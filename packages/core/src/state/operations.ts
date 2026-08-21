/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: operations.ts
 * 📂 المسار: packages/core/src/state/operations.ts
 * 🎯 الهدف الرئيسي: تعريف جميع عمليات التحرير المتاحة على المستند
 *    (كتلية ومضمنة ومكانية) وتطبيقها مع ضمان عدم التغيير (Immutable).
 * 📋 المعايير:
 *    - كل عملية هي اتحاد متمايز (Discriminated Union) بأنواع حمولة آمنة.
 *    - كل عملية تُعيد مستنداً جديداً بدلاً من تعديل الحالي.
 *    - دعم العمليات المكانية (spatial-move) والنصية (text-update) والصيغ.
 * 🧪 الاختبارات:
 *    - packages/core/tests/state/operations.test.ts
 *    - packages/core/tests/state/editor-state.test.ts
 * 🏷️ المعرف: CORE-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Discriminated Union Operations + Recursive Tree Application
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تعديل المصفوفات الأصلية (spread operator دائماً).
 *    2. التأكد من أن كل عملية تُعيد مستنداً كاملاً وصالحاً.
 *    3. العمليات المكانية تتطلب حقلاً position في العقدة الهدف.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العقدة قبل التعديل (تُعيد الحاوية كما هي عند الغياب).
 *    - إرجاع المستند الأصلي إذا لم تُطبَّق العملية.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - ProseMirror (https://prosemirror.net/) — نمط العمليات.
 *    - Quill.js (https://quilljs.com/) — نمط Deltas.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BlockNode, DocNode, InlineNode, NodeId, LogicalPosition } from '../ast/types';
import {
  findAndUpdateBlock,
  findAndUpdateInline,
  insertInArray,
  insertInlineIntoBlock,
  moveBlockInTree,
  removeBlocks,
  removeInlineFromBlocks,
} from './tree';

// ─── أنواع العمليات ───
export type OperationType =
  | 'insert-block'
  | 'delete-block'
  | 'update-block'
  | 'move-block'
  | 'insert-inline'
  | 'delete-inline'
  | 'update-inline'
  | 'spatial-move'
  | 'text-update'
  | 'formula-update';

export interface InsertBlockOperation {
  readonly type: 'insert-block';
  readonly targetId: NodeId;
  readonly payload: BlockNode;
  readonly referenceId?: NodeId;
  readonly position?: 'before' | 'after';
}

export interface DeleteBlockOperation {
  readonly type: 'delete-block';
  readonly targetId: NodeId;
}

export interface UpdateBlockOperation {
  readonly type: 'update-block';
  readonly targetId: NodeId;
  readonly payload: (node: BlockNode) => BlockNode;
}

export interface MoveBlockOperation {
  readonly type: 'move-block';
  readonly targetId: NodeId;
  readonly referenceId?: NodeId;
  readonly position?: 'before' | 'after';
}

export interface InsertInlineOperation {
  readonly type: 'insert-inline';
  readonly targetId: NodeId;
  readonly payload: InlineNode;
  readonly referenceId?: NodeId;
  readonly position?: 'before' | 'after';
}

export interface DeleteInlineOperation {
  readonly type: 'delete-inline';
  readonly targetId: NodeId;
}

export interface UpdateInlineOperation {
  readonly type: 'update-inline';
  readonly targetId: NodeId;
  readonly payload: (node: InlineNode) => InlineNode;
}

export interface SpatialMoveOperation {
  readonly type: 'spatial-move';
  readonly targetId: NodeId;
  readonly payload: LogicalPosition;
}

export interface TextUpdateOperation {
  readonly type: 'text-update';
  readonly targetId: NodeId;
  readonly payload: { readonly content: string };
}

export interface FormulaUpdateOperation {
  readonly type: 'formula-update';
  readonly targetId: NodeId;
  readonly payload: { readonly expression: string };
}

export type Operation =
  | InsertBlockOperation
  | DeleteBlockOperation
  | UpdateBlockOperation
  | MoveBlockOperation
  | InsertInlineOperation
  | DeleteInlineOperation
  | UpdateInlineOperation
  | SpatialMoveOperation
  | TextUpdateOperation
  | FormulaUpdateOperation;

// ─── تطبيق العمليات ───

/**
 * تطبيق عملية على المستند.
 * تُعيد مستنداً جديداً (Immutable).
 */
export function applyOperation(doc: DocNode, operation: Operation): DocNode {
  switch (operation.type) {
    case 'insert-block': {
      if (operation.referenceId && operation.position) {
        return {
          ...doc,
          content: insertInArray(
            doc.content,
            operation.payload,
            operation.referenceId,
            operation.position,
          ),
        };
      }
      return { ...doc, content: [...doc.content, operation.payload] };
    }

    case 'delete-block':
      return { ...doc, content: removeBlocks(doc.content, operation.targetId) };

    case 'update-block':
      return {
        ...doc,
        content: findAndUpdateBlock(doc.content, operation.targetId, operation.payload),
      };

    case 'move-block': {
      const { blocks } = moveBlockInTree(
        doc.content,
        operation.targetId,
        operation.referenceId,
        operation.position,
      );
      return { ...doc, content: blocks };
    }

    case 'insert-inline':
      return {
        ...doc,
        content: insertInlineIntoBlock(
          doc.content,
          operation.targetId,
          operation.payload,
          operation.referenceId,
          operation.position,
        ),
      };

    case 'delete-inline':
      return { ...doc, content: removeInlineFromBlocks(doc.content, operation.targetId) };

    case 'update-inline':
      return {
        ...doc,
        content: findAndUpdateInline(doc.content, operation.targetId, operation.payload),
      };

    case 'spatial-move':
      return {
        ...doc,
        content: findAndUpdateBlock(
          doc.content,
          operation.targetId,
          (node) =>
            ({
              ...node,
              position: operation.payload,
            }) as unknown as BlockNode,
        ),
      };

    case 'text-update':
      return {
        ...doc,
        content: findAndUpdateInline(doc.content, operation.targetId, (node) =>
          node.type === 'text' ? { ...node, text: operation.payload.content } : node,
        ),
      };

    case 'formula-update':
      return {
        ...doc,
        content: findAndUpdateInline(doc.content, operation.targetId, (node) =>
          node.type === 'text' ? { ...node, formula: operation.payload.expression } : node,
        ),
      };

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
