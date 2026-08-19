/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: validation.ts
 * 📂 المسار: packages/core/src/utils/validation.ts
 * 🎯 الهدف الرئيسي: التحقق من صحة المستندات والكتج والتأكد من أن
 *    بنية AST صحيحة ومت完整ة قبل أي معالجة.
 * 📋 المعايير:
 *    - يجب أن يتحقق من صحة جميع أنواع الكتل.
 *    - يجب أن يتحقق من التسلسل الهرمي.
 *    - يجب أن يتحقق من عدم وجود معرفات مكررة.
 * 🧪 الاختبارات:
 *    - packages/core/tests/utils/validation.test.ts
 *    - اختبار التحقق من مستند صحيح
 *    - اختبار التحقق من مستند به أخطاء
 * 🏷️ المعرف: CORE-010
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive Tree Validator with Duplicate Detection
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التأكد من عدم وجود معرفات مكررة في المستند الواحد.
 *    2. التأكد من أن كل عقدة لها نوع صحيح.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص null وundefined قبل الوصول للخصائص.
 *    - جمع جميع الأخطاء دفعة واحدة بدلاً من التوقف عند أول خطأ.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  BlockNode,
  DocNode,
  InlineNode,
  NodeId,
  ValidationError,
  ValidationResult,
} from '../ast/types';

/**
 * التحقق من صحة مستند كامل.
 */
export function validateDocument(doc: DocNode): ValidationResult {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  if (doc.type !== 'doc') {
    errors.push({
      nodeId: doc.id,
      message: 'نوع العقدة الجذرية يجب أن يكون doc',
      severity: 'error',
    });
  }

  if (!Array.isArray(doc.content)) {
    errors.push({
      nodeId: doc.id,
      message: 'محتوى المستند يجب أن يكون مصفوفة',
      severity: 'error',
    });
    return {valid: false, errors};
  }

  checkIdDuplicate(doc.id, seenIds, errors);

  for (const block of doc.content) {
    validateBlockNode(block, seenIds, errors, 0);
  }

  return {valid: errors.length === 0, errors};
}

function checkIdDuplicate(id: NodeId, seen: Set<string>, errors: ValidationError[]): void {
  if (seen.has(id)) {
    errors.push({
      nodeId: id,
      message: `معرف مكرر: ${id}`,
      severity: 'error',
    });
  }
  seen.add(id);
}

function validateBlockNode(
  node: BlockNode,
  seenIds: Set<string>,
  errors: ValidationError[],
  depth: number,
): void {
  if (!node || !node.type || !node.id) {
    errors.push({
      nodeId: (node?.id ?? 'unknown') as NodeId,
      message: 'عقدة كتلية غير صحيحة: تفتقر إلى type أو id',
      severity: 'error',
    });
    return;
  }

  checkIdDuplicate(node.id, seenIds, errors);

  if (depth > 20) {
    errors.push({
      nodeId: node.id,
      message: 'تسلسل هرمي عميق جداً (أكثر من 20 مستوى)',
      severity: 'error',
    });
    return;
  }

  switch (node.type) {
    case 'paragraph':
      validateInlineContent(node.id, node.content, seenIds, errors);
      break;
    case 'heading':
      if (typeof node.level !== 'number' || node.level < 1 || node.level > 6) {
        errors.push({
          nodeId: node.id,
          message: `مستوى عنوان غير صالح: ${node.level}`,
          severity: 'error',
        });
      }
      validateInlineContent(node.id, node.content, seenIds, errors);
      break;
    case 'list':
      if (!Array.isArray(node.items)) {
        errors.push({
          nodeId: node.id,
          message: 'عناصر القائمة يجب أن تكون مصفوفة',
          severity: 'error',
        });
      } else {
        for (const item of node.items) {
          validateBlockNode(item, seenIds, errors, depth + 1);
        }
      }
      break;
    case 'list-item':
      validateBlockContent(node.id, node.content, seenIds, errors, depth);
      if (node.nested) {
        for (const nested of node.nested) {
          validateBlockNode(nested, seenIds, errors, depth + 1);
        }
      }
      break;
    case 'code-block':
      if (typeof node.language !== 'string') {
        errors.push({
          nodeId: node.id,
          message: 'لغة الكود يجب أن تكون نصاً',
          severity: 'error',
        });
      }
      break;
    case 'blockquote':
      validateBlockContent(node.id, node.content, seenIds, errors, depth);
      break;
    case 'table':
      if (!Array.isArray(node.rows)) {
        errors.push({
          nodeId: node.id,
          message: 'صفوف الجدول يجب أن تكون مصفوفة',
          severity: 'error',
        });
      } else {
        for (const row of node.rows) {
          validateBlockNode(row, seenIds, errors, depth + 1);
        }
      }
      break;
    case 'table-row':
      if (!Array.isArray(node.cells)) {
        errors.push({
          nodeId: node.id,
          message: 'خلايا الصف يجب أن تكون مصفوفة',
          severity: 'error',
        });
      } else {
        for (const cell of node.cells) {
          validateBlockNode(cell, seenIds, errors, depth + 1);
        }
      }
      break;
    case 'table-cell':
      validateBlockContent(node.id, node.content, seenIds, errors, depth);
      break;
    case 'horizontal-rule':
      break;
    case 'image':
      if (typeof node.src !== 'string' || !node.src) {
        errors.push({
          nodeId: node.id,
          message: 'صورة يجب أن تحتوي على src غير فارغ',
          severity: 'error',
        });
      }
      break;
    case 'embed':
      if (typeof node.url !== 'string' || !node.url) {
        errors.push({
          nodeId: node.id,
          message: 'تضمين يجب أن تحتوي على url غير فارغ',
          severity: 'error',
        });
      }
      break;
    default: {
      const unknownNode = node as {id: NodeId; type: string};
      errors.push({
        nodeId: unknownNode.id,
        message: `نوع غير معروف: ${unknownNode.type}`,
        severity: 'warning',
      });
    }
  }
}

function validateInlineContent(
  parentNodeId: NodeId,
  content: readonly InlineNode[] | undefined,
  seenIds: Set<string>,
  errors: ValidationError[],
): void {
  if (!Array.isArray(content)) {
    errors.push({
      nodeId: parentNodeId,
      message: 'المحتوى المضمن يجب أن يكون مصفوفة',
      severity: 'error',
    });
    return;
  }

  for (const inline of content) {
    if (!inline || !inline.type || !inline.id) {
      errors.push({
        nodeId: parentNodeId,
        message: 'عقدة مضمنة غير صحيحة',
        severity: 'error',
      });
      continue;
    }
    checkIdDuplicate(inline.id, seenIds, errors);
  }
}

function validateBlockContent(
  parentNodeId: NodeId,
  content: readonly BlockNode[] | undefined,
  seenIds: Set<string>,
  errors: ValidationError[],
  depth: number,
): void {
  if (!Array.isArray(content)) {
    errors.push({
      nodeId: parentNodeId,
      message: 'المحتوى الكتلي يجب أن يكون مصفوفة',
      severity: 'error',
    });
    return;
  }

  for (const block of content) {
    validateBlockNode(block, seenIds, errors, depth + 1);
  }
}
