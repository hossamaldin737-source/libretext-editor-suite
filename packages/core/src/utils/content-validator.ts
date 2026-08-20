/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: content-validator.ts
 * 📂 المسار: packages/core/src/utils/content-validator.ts
 * 🎯 الهدف الرئيسي: validators منفصلة لكل نوع كتلة (ContentBlock) مع
 *    دعم كامل للنص العربي (RTL, Diacritics, Normalization)
 * 📋 المعايير: Zero dependencies (عدا types النواة)، Pure functions،
 *    Type Guards بدلاً من any، Arabic-aware
 * 🧪 الاختبارات: packages/core/tests/utils/content-validator.test.ts
 * 🏷️ المعرف: CORE-013
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Block-Type Dispatch + Arabic-aware Validators + Type Guards
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. النص العربي يتطلب RTL detection وتوحيد للتشكيل
 *    2. heading hierarchy validation يجب أن يكون صارمًا (H1 → H2 → H3)
 *    3. Tables قد يكون لها headers أو rows غير متسقة
 *    4. Code blocks قد تفتقر language tag
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards بدلاً من `as any`
 *    - normalizeArabic للمقارنات العربية
 *    - fallback للقيم الافتراضية عند الفشل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: ../parsers/markdown.ts
 *    - 📄 مرتبط مباشر: document-validator.ts (CORE-014)
 *    - 📄 يستخدم: arabic-text.ts (CORE-012)
 *    - 🧪 اختبارات: tests/utils/content-validator.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - validateHeadingBlock(): التحقق من عنوان واحد
 *    - validateListBlock(): التحقق من قائمة
 *    - validateTableBlock(): التحقق من جدول مع Type Guards
 *    - validateCodeBlock(): التحقق من كتلة كود
 *    - validateBlock(): dispatcher لكل الكتل
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ProseMirror schema validation
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {ContentBlock, TableData} from '../parsers/markdown';
import {detectDirection} from './arabic-text';

export interface BlockValidation {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly direction?: 'rtl' | 'ltr' | 'auto';
}

export interface HeadingHierarchyState {
  readonly lastLevel: number;
  readonly hasH1: boolean;
  readonly headingCount: number;
}

export function isTableContent(content: unknown): content is TableData {
  return (
    typeof content === 'object' &&
    content !== null &&
    'headers' in content &&
    'rows' in content &&
    Array.isArray((content as TableData).headers) &&
    Array.isArray((content as TableData).rows)
  );
}

export function validateHeadingBlock(
  block: ContentBlock,
  position: number,
  previousState: HeadingHierarchyState
): {validation: BlockValidation; newState: HeadingHierarchyState} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const level = block.level ?? 1;
  const text = typeof block.content === 'string' ? block.content : '';
  const direction = detectDirection(text);

  if (!text.trim()) {
    errors.push(`Empty heading at position ${position}`);
  }

  const previousLevel = previousState.lastLevel;
  if (previousLevel > 0 && level > previousLevel + 1) {
    errors.push(
      `Heading hierarchy error at position ${position}: ` +
        `H${previousLevel} → H${level} (skipped H${previousLevel + 1})`
    );
  }

  if (text.trim().length < 3) {
    warnings.push(`Very short heading at position ${position}: "${text.slice(0, 30)}"`);
  }

  const newState: HeadingHierarchyState = {
    lastLevel: level,
    hasH1: previousState.hasH1 || level === 1,
    headingCount: previousState.headingCount + 1,
  };

  return {validation: {valid: errors.length === 0, errors, warnings, direction}, newState};
}

export function validateListBlock(
  block: ContentBlock,
  position: number
): BlockValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const items = Array.isArray(block.content) ? block.content : [];
  const listType = block.ordered ? 'numbered' : 'bullet';
  const direction = detectDirection(items.join(' '));

  if (items.length === 0) {
    warnings.push(`Empty ${listType} list at position ${position}`);
  }

  if (items.length > 50) {
    warnings.push(`Very long ${listType} list at position ${position} (${items.length} items)`);
  }

  const emptyItems = items.filter((item) => !item.trim());
  if (emptyItems.length > 0) {
    warnings.push(`${emptyItems.length} empty item(s) in ${listType} list at position ${position}`);
  }

  return {valid: errors.length === 0, errors, warnings, direction};
}

export function validateTableBlock(
  block: ContentBlock,
  position: number
): BlockValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isTableContent(block.content)) {
    errors.push(`Invalid table content at position ${position}`);
    return {valid: false, errors, warnings};
  }

  const table = block.content;
  if (table.headers.length === 0) {
    errors.push(`Table at position ${position} has no headers`);
  }

  if (table.rows.length === 0) {
    warnings.push(`Table at position ${position} has no data rows`);
  }

  for (let rowIdx = 0; rowIdx < table.rows.length; rowIdx++) {
    const row = table.rows[rowIdx];
    if (row && row.length !== table.headers.length) {
      errors.push(
        `Table at position ${position}, row ${rowIdx + 1}: ` +
          `Expected ${table.headers.length} columns, found ${row.length}`
      );
    }
  }

  const allCells = [...table.headers, ...table.rows.flat()].join(' ');
  const direction = detectDirection(allCells);

  return {valid: errors.length === 0, errors, warnings, direction};
}

export function validateCodeBlock(
  block: ContentBlock,
  position: number
): BlockValidation {
  const warnings: string[] = [];

  if (block.language === undefined || block.language === '') {
    warnings.push(`Code block at position ${position} has no language tag`);
  }

  const code = typeof block.content === 'string' ? block.content : '';
  if (!code.trim()) {
    warnings.push(`Empty code block at position ${position}`);
  }

  return {valid: true, errors: [], warnings, direction: 'ltr'};
}

export function validateBlock(
  block: ContentBlock,
  position: number,
  headingState: HeadingHierarchyState
): {validation: BlockValidation; newState: HeadingHierarchyState} {
  switch (block.type) {
    case 'heading':
      return validateHeadingBlock(block, position, headingState);
    case 'list':
      return {validation: validateListBlock(block, position), newState: headingState};
    case 'table':
      return {validation: validateTableBlock(block, position), newState: headingState};
    case 'code':
      return {validation: validateCodeBlock(block, position), newState: headingState};
    case 'paragraph': {
      const text = typeof block.content === 'string' ? block.content : '';
      return {
        validation: {valid: true, errors: [], warnings: [], direction: detectDirection(text)},
        newState: headingState,
      };
    }
    default:
      return {validation: {valid: true, errors: [], warnings: []}, newState: headingState};
  }
}
