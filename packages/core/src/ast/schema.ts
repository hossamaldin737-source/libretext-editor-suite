/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: schema.ts
 * 📂 المسار: packages/core/src/ast/schema.ts
 * 🎯 الهدف الرئيسي: تعريف مخطط AST مع قواعد التحقق من بنية كل نوع
 *    من العقد وعلاقاتها والتسلسل الهرمي للمستند.
 * 📋 المعايير:
 *    - يجب أن يحدد المخطط الأبناء المسموح به لكل نوع عقدة.
 *    - يجب أن يتحقق من صحة التسلسل الهرمي.
 *    - يجب أن يكون المخطط قابلاً للامتداد عبر نظام الإضافات.
 * 🧪 الاختبارات:
 *    - packages/core/tests/ast/schema.test.ts
 *    - اختبار مخطط كل نوع عقدة
 *    - اختبار التحقق من بنية المستند
 * 🏷️ المعرف: CORE-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Schema-Driven Validation — مخطط يحدد القواعد ويُستخدم للتحقق أثناء البناء.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم السماح بعقدة فارغة في أنواع معينة (مثل heading يجب أن يحتوي على محتوى).
 *    2. التحقق من أن table-row يحتوي على cells صحيحة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص جميع الخصائص الإلزامية.
 *    - إرجاع أخطاء واضحة مع معرف العقدة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - ProseMirror (https://prosemirror.net/) — نمط مخطط العقد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  BlockNode,
  DocNode,
  InlineNode,
  NodeId,
  ValidationError,
  ValidationResult,
} from './types';

// ─── تعريف مخطط نوع العقدة ───
export interface NodeSchema {
  readonly type: string;
  readonly requiredFields: readonly string[];
  readonly allowedChildren: readonly string[] | 'inline' | 'block' | 'none';
  readonly inline: boolean;
}

// ─── مخططات الكتل ───
const BLOCK_SCHEMAS: Record<string, NodeSchema> = {
  paragraph: {
    type: 'paragraph',
    requiredFields: ['id', 'content'],
    allowedChildren: 'inline',
    inline: false,
  },
  heading: {
    type: 'heading',
    requiredFields: ['id', 'level', 'content'],
    allowedChildren: 'inline',
    inline: false,
  },
  list: {
    type: 'list',
    requiredFields: ['id', 'ordered', 'items'],
    allowedChildren: 'none',
    inline: false,
  },
  'list-item': {
    type: 'list-item',
    requiredFields: ['id', 'content'],
    allowedChildren: 'block',
    inline: false,
  },
  'code-block': {
    type: 'code-block',
    requiredFields: ['id', 'language', 'code'],
    allowedChildren: 'none',
    inline: false,
  },
  blockquote: {
    type: 'blockquote',
    requiredFields: ['id', 'content'],
    allowedChildren: 'block',
    inline: false,
  },
  table: {
    type: 'table',
    requiredFields: ['id', 'rows'],
    allowedChildren: 'none',
    inline: false,
  },
  'table-row': {
    type: 'table-row',
    requiredFields: ['id', 'cells'],
    allowedChildren: 'none',
    inline: false,
  },
  'table-cell': {
    type: 'table-cell',
    requiredFields: ['id', 'content'],
    allowedChildren: 'block',
    inline: false,
  },
  'horizontal-rule': {
    type: 'horizontal-rule',
    requiredFields: ['id'],
    allowedChildren: 'none',
    inline: false,
  },
  image: {
    type: 'image',
    requiredFields: ['id', 'src', 'alt'],
    allowedChildren: 'none',
    inline: false,
  },
  embed: {
    type: 'embed',
    requiredFields: ['id', 'embedType', 'url'],
    allowedChildren: 'none',
    inline: false,
  },
};

// ─── مخططات العناصر المضمنة ───
const INLINE_SCHEMAS: Record<string, NodeSchema> = {
  text: {
    type: 'text',
    requiredFields: ['id', 'text'],
    allowedChildren: 'none',
    inline: true,
  },
  bold: {
    type: 'bold',
    requiredFields: ['id', 'content'],
    allowedChildren: 'inline',
    inline: true,
  },
  italic: {
    type: 'italic',
    requiredFields: ['id', 'content'],
    allowedChildren: 'inline',
    inline: true,
  },
  underline: {
    type: 'underline',
    requiredFields: ['id', 'content'],
    allowedChildren: 'inline',
    inline: true,
  },
  strikethrough: {
    type: 'strikethrough',
    requiredFields: ['id', 'content'],
    allowedChildren: 'inline',
    inline: true,
  },
  code: {
    type: 'code',
    requiredFields: ['id', 'code'],
    allowedChildren: 'none',
    inline: true,
  },
  link: {
    type: 'link',
    requiredFields: ['id', 'href', 'content'],
    allowedChildren: 'inline',
    inline: true,
  },
  mention: {
    type: 'mention',
    requiredFields: ['id', 'userId', 'label'],
    allowedChildren: 'none',
    inline: true,
  },
};

// ─── المخطط الموحد ───
export const ALL_SCHEMAS: Record<string, NodeSchema> = {
  ...BLOCK_SCHEMAS,
  ...INLINE_SCHEMAS,
};

/**
 * جلب مخطط نوع العقدة.
 */
export function getSchema(type: string): NodeSchema | undefined {
  return ALL_SCHEMAS[type];
}

/**
 * التحقق من صحة عقدة كتلية.
 */
export function validateBlockNode(node: BlockNode): ValidationResult {
  const errors: ValidationError[] = [];
  const schema = BLOCK_SCHEMAS[node.type];

  if (!schema) {
    errors.push({
      nodeId: node.id,
      message: `نوع غير معروف: ${node.type}`,
      severity: 'error',
    });
    return {valid: false, errors};
  }

  for (const field of schema.requiredFields) {
    if (!(field in node)) {
      errors.push({
        nodeId: node.id,
        message: `الحقل المطلوب مفقود: ${field}`,
        severity: 'error',
      });
    }
  }

  return {valid: errors.length === 0, errors};
}

/**
 * التحقق من صحة مستند كامل.
 */
export function validateDocument(doc: DocNode): ValidationResult {
  const errors: ValidationError[] = [];

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

  for (const block of doc.content) {
    const result = validateBlockNode(block);
    errors.push(...result.errors);
  }

  return {valid: errors.length === 0, errors};
}
