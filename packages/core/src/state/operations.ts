/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: operations.ts
 * 📂 المسار: packages/core/src/state/operations.ts
 * 🎯 الهدف الرئيسي: تعريف جميع عمليات التحرير المتاحة على المستند
 *    بما في ذلك الإضافة والحذف والتحريك والتحديث مع ضمان عدم التغيير.
 * 📋 المعايير:
 *    - يجب أن تكون كل عملية غير قابلة للتغيير (Immutable).
 *    - يجب أن تُعيد حالة جديدة بدلاً من تعديل الحالة الحالية.
 *    - يجب أن تدعم جميع أنواع الكتل.
 * 🧪 الاختبارات:
 *    - packages/core/tests/state/operations.test.ts
 *    - اختبار كل عملية على حدة
 *    - اختبار سلاسل العمليات
 * 🏷️ المعرف: CORE-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Operation Chain — سلسلة عمليات غير قابلة للتغيير.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تعديل المصفوفات الأصلية (spread operator دائماً).
 *    2. التأكد من أن كل عملية تُعيد مستنداً كاملاً وصالحاً.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العقدة قبل التعديل.
 *    - إرجاع الحالة الأصلية إذا فشلت العملية.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - ProseMirror (https://prosemirror.net/) — نمط العمليات.
 *    - Quill.js (https://quilljs.com/) — نمط Deltas.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode, NodeId} from '../ast/types';

// ─── تعريف العملية ───
export type OperationType =
  | 'insert-block'
  | 'delete-block'
  | 'update-block'
  | 'move-block'
  | 'insert-inline'
  | 'delete-inline'
  | 'update-inline';

export interface Operation {
  readonly type: OperationType;
  readonly targetId: NodeId;
  readonly payload?: unknown;
  readonly position?: 'before' | 'after';
  readonly referenceId?: NodeId;
}

// ─── دوال تطبيق العمليات ───

function findAndUpdateBlock(
  blocks: readonly BlockNode[],
  targetId: NodeId,
  updater: (node: BlockNode) => BlockNode,
): BlockNode[] {
  return blocks.map((block) => {
    if (block.id === targetId) {
      return updater(block);
    }
    if ('content' in block && Array.isArray(block.content)) {
      if (block.type === 'list-item') {
        return {
          ...block,
          content: findAndUpdateBlock(block.content as BlockNode[], targetId, updater),
          nested: block.nested
            ? findAndUpdateBlock(block.nested, targetId, updater)
            : block.nested,
        };
      }
      if (block.type === 'blockquote' || block.type === 'table-cell') {
        return {
          ...block,
          content: findAndUpdateBlock(block.content as BlockNode[], targetId, updater),
        };
      }
    }
    if (block.type === 'table') {
      return {
        ...block,
        rows: block.rows.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => ({
            ...cell,
            content: findAndUpdateBlock(cell.content, targetId, updater),
          })),
        })),
      };
    }
    return block;
  });
}

function insertInArray<T>(arr: readonly T[], item: T, referenceId: NodeId, position: 'before' | 'after'): T[] {
  const index = arr.findIndex((i) => (i as T & {id?: string}).id === referenceId);
  if (index === -1) return [...arr, item];
  const insertIndex = position === 'before' ? index : index + 1;
  return [...arr.slice(0, insertIndex), item, ...arr.slice(insertIndex)];
}

/**
 * تطبيق عملية على المستند.
 * تُعيد مستنداً جديداً (Immutable).
 */
export function applyOperation(doc: DocNode, operation: Operation): DocNode {
  switch (operation.type) {
    case 'insert-block': {
      const newBlock = operation.payload as BlockNode;
      if (!newBlock) return doc;
      if (operation.referenceId && operation.position) {
        return {
          ...doc,
          content: insertInArray(doc.content, newBlock, operation.referenceId, operation.position),
        };
      }
      return {...doc, content: [...doc.content, newBlock]};
    }

    case 'delete-block':
      return {
        ...doc,
        content: doc.content.filter((block) => block.id !== operation.targetId),
      };

    case 'update-block': {
      const updater = operation.payload as (node: BlockNode) => BlockNode;
      if (!updater) return doc;
      return {
        ...doc,
        content: findAndUpdateBlock(doc.content, operation.targetId, updater),
      };
    }

    case 'move-block': {
      const block = doc.content.find((b) => b.id === operation.targetId);
      if (!block) return doc;
      const without = doc.content.filter((b) => b.id !== operation.targetId);
      if (operation.referenceId && operation.position) {
        return {
          ...doc,
          content: insertInArray(without, block, operation.referenceId, operation.position),
        };
      }
      return {...doc, content: [...without, block]};
    }

    default:
      return doc;
  }
}

/**
 * سلسلة عمليات على المستند.
 * تُعيد مستنداً واحداً بعد تطبيق جميع العمليات.
 */
export function applyOperations(doc: DocNode, operations: readonly Operation[]): DocNode {
  return operations.reduce((current, op) => applyOperation(current, op), doc);
}
