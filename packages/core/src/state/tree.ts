/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: tree.ts
 * 📂 المسار: packages/core/src/state/tree.ts
 * 🎯 الهدف الرئيسي: دوال مساعدة تعمل على شجرة AST بشكل تكراري
 *    (تحديث/حذف/نقل/إدراج) مع ضمان عدم التغيير (Immutable).
 * 📋 المعايير:
 *    - كل دالة تُعيد بنية جديدة تماماً (لا تعديل للمصدر).
 *    - دعم الحاويات المتداخلة: list-item, blockquote, table, list.
 * 🧪 الاختبارات:
 *    - packages/core/tests/state/operations.test.ts
 *    - packages/core/tests/state/editor-state.test.ts
 * 🏷️ المعرف: CORE-012
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Generic Recursive Tree Walker — مشي تكراري موحد على حاويات الشجرة.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم إرجاع الحاويات المتداخلة دون نسخ عند تغيير أبنائها.
 *    2. ضمان عدم إحداث تغيير عند عدم وجود العقدة المستهدفة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود العقدة قبل التعديل.
 *    - التعامل مع content و nested و rows و items بشكل صريح.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BlockNode, InlineNode, NodeId } from '../ast/types';

/**
 * إدراج عنصر في مصفوفة نسبة إلى عنصر مرجعي.
 */
export function insertInArray<T>(
  arr: readonly T[],
  item: T,
  referenceId: NodeId,
  position: 'before' | 'after',
): T[] {
  const index = arr.findIndex((i) => (i as T & { id?: string }).id === referenceId);
  if (index === -1) return [...arr, item];
  const insertIndex = position === 'before' ? index : index + 1;
  return [...arr.slice(0, insertIndex), item, ...arr.slice(insertIndex)];
}

/**
 * إعادة بناء الحاويات المتداخلة للكتلة بعد تطبيق دالة على محتواها.
 */
function mapContainers(
  block: BlockNode,
  fn: (inner: readonly BlockNode[]) => BlockNode[],
): BlockNode {
  switch (block.type) {
    case 'list-item':
      return {
        ...block,
        content: fn(block.content),
        nested: block.nested ? fn(block.nested) : block.nested,
      };
    case 'blockquote':
    case 'table-cell':
      return { ...block, content: fn(block.content) };
    case 'table':
      return {
        ...block,
        rows: block.rows.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => ({ ...cell, content: fn(cell.content) })),
        })),
      };
    case 'list':
      return {
        ...block,
        items: block.items.map((item) => ({
          ...item,
          content: fn(item.content),
          nested: item.nested ? fn(item.nested) : item.nested,
        })),
      };
    default:
      return block;
  }
}

/**
 * البحث عن كتلة بالمعرف وتحديثها عبر updater بشكل تكراري.
 */
export function findAndUpdateBlock(
  blocks: readonly BlockNode[],
  targetId: NodeId,
  updater: (node: BlockNode) => BlockNode,
): BlockNode[] {
  return blocks.map((block) => {
    if (block.id === targetId) {
      return updater(block);
    }
    return mapContainers(block, (inner) => findAndUpdateBlock(inner, targetId, updater));
  });
}

/**
 * تحديث عقدة مضمنة بالمعرف عبر updater بشكل تكراري (بما فيها المتداخلة).
 */
function updateInlineNode(
  inline: InlineNode,
  targetId: NodeId,
  updater: (node: InlineNode) => InlineNode,
): InlineNode {
  if (inline.id === targetId) {
    return updater(inline);
  }
  if ('content' in inline && Array.isArray(inline.content)) {
    return {
      ...inline,
      content: inline.content.map((child) => updateInlineNode(child, targetId, updater)),
    };
  }
  return inline;
}

/**
 * البحث عن عقدة مضمنة بالمعرف داخل كل الكتل وتحديثها.
 */
export function findAndUpdateInline(
  blocks: readonly BlockNode[],
  targetId: NodeId,
  updater: (node: InlineNode) => InlineNode,
): BlockNode[] {
  return blocks.map((block) => {
    if (block.type === 'paragraph' || block.type === 'heading') {
      return {
        ...block,
        content: block.content.map((inline) => updateInlineNode(inline, targetId, updater)),
      };
    }
    return mapContainers(block, (inner) => findAndUpdateInline(inner, targetId, updater));
  });
}

/**
 * إزالة كتلة بالمعرف بشكل تكراري من جميع الحاويات.
 */
export function removeBlocks(blocks: readonly BlockNode[], targetId: NodeId): BlockNode[] {
  return blocks
    .filter((block) => block.id !== targetId)
    .map((block) => mapContainers(block, (inner) => removeBlocks(inner, targetId)));
}

/**
 * إزالة عقدة مضمنة بالمعرف من جميع المحتويات المضمنة.
 */
function removeInlineFromNode(inline: InlineNode, targetId: NodeId): InlineNode {
  if (inline.id === targetId) return inline;
  if ('content' in inline && Array.isArray(inline.content)) {
    return {
      ...inline,
      content: inline.content
        .filter((child) => child.id !== targetId)
        .map((child) => removeInlineFromNode(child, targetId)),
    };
  }
  return inline;
}

/**
 * إزالة عقدة مضمنة بالمعرف من كل الكتل (فقرات وعناوين) بشكل تكراري.
 */
export function removeInlineFromBlocks(
  blocks: readonly BlockNode[],
  targetId: NodeId,
): BlockNode[] {
  return blocks.map((block) => {
    if (block.type === 'paragraph' || block.type === 'heading') {
      return {
        ...block,
        content: block.content
          .filter((inline) => inline.id !== targetId)
          .map((inline) => removeInlineFromNode(inline, targetId)),
      };
    }
    return mapContainers(block, (inner) => removeInlineFromBlocks(inner, targetId));
  });
}

/**
 * إدراج عقدة مضمنة في محتوى كتلة محددة (فقرة أو عنوان).
 */
export function insertInlineIntoBlock(
  blocks: readonly BlockNode[],
  targetId: NodeId,
  inline: InlineNode,
  referenceId?: NodeId,
  position?: 'before' | 'after',
): BlockNode[] {
  return blocks.map((block) => {
    if (block.id === targetId && (block.type === 'paragraph' || block.type === 'heading')) {
      const content =
        referenceId && position
          ? insertInArray(block.content, inline, referenceId, position)
          : [...block.content, inline];
      return { ...block, content };
    }
    return mapContainers(block, (inner) =>
      insertInlineIntoBlock(inner, targetId, inline, referenceId, position),
    );
  });
}

/**
 * نقل كتلة بالمعرف (نسبة إلى مرجع أو إلى نهاية الحاوية).
 * تُعيد {blocks, moved} لمعرفة إن تم النقل فعلياً.
 */
export function moveBlockInTree(
  blocks: readonly BlockNode[],
  targetId: NodeId,
  referenceId?: NodeId,
  position?: 'before' | 'after',
): { blocks: BlockNode[]; moved: boolean } {
  const index = blocks.findIndex((block) => block.id === targetId);
  if (index !== -1) {
    const moved = blocks[index]!;
    const without = blocks.filter((_, i) => i !== index);
    if (referenceId && position) {
      return { blocks: insertInArray(without, moved, referenceId, position), moved: true };
    }
    return { blocks: [...without, moved], moved: true };
  }

  let moved = false;
  const updated = blocks.map((block) => {
    const result = mapContainers(block, (inner) => {
      const res = moveBlockInTree(inner, targetId, referenceId, position);
      if (res.moved) moved = true;
      return res.blocks;
    });
    return result;
  });

  return { blocks: updated, moved };
}
