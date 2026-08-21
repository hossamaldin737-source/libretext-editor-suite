/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: document-validator.ts
 * 📂 المسار: packages/core/src/utils/document-validator.ts
 * 🎯 الهدف الرئيسي: التحقق الشامل من مستندات Markdown مع دعم كامل
 *    للنص العربي (RTL) و Front Matter باستخدام Functional Pipeline
 * 📋 المعايير: Functional Pipeline (Rule 5.2.1)، Arabic-aware،
 *    Zero dependencies (عدا parsers النواة)
 * 🧪 الاختبارات: packages/core/tests/utils/document-validator.test.ts
 * 🏷️ المعرف: UTIL-VAL-002
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Functional Pipeline + Arabic-aware + Type-Safe Validators
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Front Matter يجب تحليله أولاً قبل content
 *    2. Document بدون H1 يعطي تحذيراً وليس خطأ
 *    3. RTL detection يُطبق على كل block منفردًا
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Functional Pipeline يمنع Side Effects
 *    - Type Guards قوية (isTableContent, etc.)
 *    - Fallback للقيم الافتراضية عند فشل parsing
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: ../parsers/frontmatter-parser.ts, ../parsers/markdown.ts
 *    - 📄 مرتبط مباشر: content-validator.ts (UTIL-VAL-001)
 *    - 📄 يستخدم: arabic-text.ts (UTIL-AR-001)
 *    - 🧪 اختبارات: tests/utils/document-validator.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - validateDocument(): التحقق الشامل (Pipeline)
 *    - validateHeadingHierarchy(): التحقق من التسلسل الهرمي
 *    - validateTables(): التحقق من جميع الجداول
 *    - hasFrontMatter(): فحص سريع
 *    - extractMetadata(): استخراج البيانات الوصفية
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ProseMirror schema validation
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocumentMetadata } from '../parsers/frontmatter-parser';
import type { ContentBlock } from '../parsers/markdown';
import { parseFrontMatter } from '../parsers/frontmatter-parser';
import { parseMarkdown } from '../parsers/markdown';
import { validateBlock, type HeadingHierarchyState } from './content-validator';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly metadata: DocumentMetadata | null;
  readonly direction?: 'rtl' | 'ltr' | 'auto';
  readonly arabicRatio?: number;
}

export interface ContentValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline Steps
// ─────────────────────────────────────────────────────────────────────────────

interface PipelineContext {
  readonly markdown: string;
  readonly metadata: DocumentMetadata | null;
  readonly content: readonly ContentBlock[];
  readonly errors: string[];
  readonly warnings: string[];
  readonly direction: 'rtl' | 'ltr' | 'auto';
  readonly arabicRatio: number;
}

function parseFrontMatterStep(markdown: string): PipelineContext {
  const result = parseFrontMatter(markdown);
  const parsed = result.metadata ? parseMarkdown(result.content) : null;

  return {
    markdown,
    metadata: result.metadata,
    content: parsed?.content ?? [],
    errors: [] as string[],
    warnings: [...result.warnings],
    direction: 'auto',
    arabicRatio: 0,
  };
}

function validateContentStep(ctx: PipelineContext): PipelineContext {
  if (ctx.errors.length > 0) return ctx;

  const errors: string[] = [];
  const warnings: string[] = [];
  let headingState: HeadingHierarchyState = {
    lastLevel: 0,
    hasH1: false,
    headingCount: 0,
  };
  let rtlCount = 0;
  let ltrCount = 0;

  for (let i = 0; i < ctx.content.length; i++) {
    const block = ctx.content[i];
    if (!block) continue;
    const result = validateBlock(block, i, headingState);
    errors.push(...result.validation.errors);
    warnings.push(...result.validation.warnings);
    headingState = result.newState;

    if (result.validation.direction === 'rtl') rtlCount++;
    else if (result.validation.direction === 'ltr') ltrCount++;
  }

  if (!headingState.hasH1 && ctx.content.length > 0) {
    warnings.push('Document has no H1 heading (title)');
  }

  const direction: 'rtl' | 'ltr' | 'auto' =
    rtlCount > ltrCount ? 'rtl' : ltrCount > 0 ? 'ltr' : 'auto';

  return {
    ...ctx,
    errors,
    warnings,
    direction,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Validator (Functional Pipeline)
// ─────────────────────────────────────────────────────────────────────────────

/** التحقق الشامل من مستند Markdown باستخدام Functional Pipeline */
export function validateDocument(markdown: string): ValidationResult {
  const parsed = parseFrontMatterStep(markdown);
  const ctx = validateContentStep(parsed);

  return {
    valid: ctx.errors.length === 0,
    errors: ctx.errors,
    warnings: ctx.warnings,
    metadata: ctx.metadata,
    direction: ctx.direction,
    arabicRatio: ctx.arabicRatio,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Standalone Validators
// ─────────────────────────────────────────────────────────────────────────────

/** التحقق من التسلسل الهرمي للعناوين فقط */
export function validateHeadingHierarchy(content: readonly ContentBlock[]): {
  valid: boolean;
  errors: readonly string[];
} {
  const errors: string[] = [];
  let lastLevel = 0;

  for (const block of content) {
    if (block.type === 'heading') {
      const level = block.level ?? 1;
      if (lastLevel > 0 && level > lastLevel + 1) {
        const text = typeof block.content === 'string' ? block.content : '';
        errors.push(
          `H${lastLevel} → H${level}: "${text.slice(0, 50)}" ` + `(skipped H${lastLevel + 1})`,
        );
      }
      lastLevel = level;
    }
  }

  return { valid: errors.length === 0, errors };
}

/** التحقق من جميع الجداول فقط */
export function validateTables(content: readonly ContentBlock[]): ContentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let tableCount = 0;

  for (const block of content) {
    if (block.type !== 'table') continue;
    tableCount++;

    if (
      typeof block.content !== 'object' ||
      block.content === null ||
      !('headers' in block.content)
    ) {
      errors.push(`Table ${tableCount}: Invalid structure`);
      continue;
    }

    const table = block.content as TableDataLike;
    const headerCount = table.headers?.length ?? 0;

    if (headerCount === 0) {
      errors.push(`Table ${tableCount}: No headers defined`);
    }

    if (table.rows && Array.isArray(table.rows)) {
      for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        if (Array.isArray(row) && row.length !== headerCount) {
          errors.push(
            `Table ${tableCount}, Row ${i + 1}: ` +
              `Column count mismatch (expected ${headerCount}, found ${row.length})`,
          );
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

interface TableDataLike {
  headers?: readonly string[];
  rows?: readonly (readonly string[])[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** فحص سريع: هل المستند يحتوي على Front Matter؟ */
export function hasFrontMatter(markdown: string): boolean {
  return markdown.trimStart().startsWith('---');
}

/** استخراج البيانات الوصفية فقط دون تحليل كامل */
export function extractMetadata(markdown: string): DocumentMetadata | null {
  const result = parseFrontMatter(markdown);
  return result.metadata;
}

/** التحقق من وجود Front Matter صالح */
export function hasValidFrontMatter(markdown: string): boolean {
  if (!hasFrontMatter(markdown)) return false;
  const result = parseFrontMatter(markdown);
  return result.metadata !== null && result.warnings.length === 0;
}
