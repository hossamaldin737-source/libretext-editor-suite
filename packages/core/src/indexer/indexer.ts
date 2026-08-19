/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: indexer.ts
 * 📂 المسار: packages/core/src/indexer/indexer.ts
 * 🎯 الهدف الرئيسي: بناء فهرس من المستند يدعم البحث السريع
 *    والاستعلام عن العقد حسب النوع والنص والمعرف.
 * 📋 المعايير:
 *    - يجب أن يبني فهرساً من المستند في خطوة واحدة.
 *    - يجب أن يدعم البحث النصي السريع.
 *    - يجب أن يدعم البحث بالنوع والمعرف.
 * 🧪 الاختبارات:
 *    - packages/core/tests/indexer/indexer.test.ts
 *    - اختبار بناء الفهرس
 *    - اختبار البحث بالنوع
 *    - اختبار البحث بالنص
 * 🏷️ المعرف: CORE-007
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pre-built Index Map — فهرس مبني مسبقاً للاستعلامات السريعة.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. إعادة بناء الفهرس عند كل تغيير في المستند.
 *    2. عدم تخزين مراجع مباشرة للعقد (تخزين نسخ).
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود المحتوى قبل الفهرسة.
 *    - التعامل مع المستندات الفارغة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode, NodeId, NodeInfo} from '../ast/types';

export interface Indexer {
  readonly nodeMap: Map<NodeId, NodeInfo>;
  readonly nodesByType: Map<string, readonly NodeInfo[]>;
  readonly textNodes: readonly {id: NodeId; text: string; path: readonly NodeId[]}[];
}

/**
 * بناء فهرس من المستند.
 */
export function buildIndexer(doc: DocNode): Indexer {
  const nodeMap = new Map<NodeId, NodeInfo>();
  const nodesByType = new Map<string, NodeInfo[]>();
  const textNodes: {id: NodeId; text: string; path: readonly NodeId[]}[] = [];

  function addNode(
    node: BlockNode | InlineNode,
    path: readonly NodeId[],
    depth: number,
    parent: BlockNode | DocNode | null,
  ): void {
    const info: NodeInfo = {node, path, depth, parent};
    nodeMap.set(node.id, info);

    const typeList = nodesByType.get(node.type) ?? [];
    typeList.push(info);
    nodesByType.set(node.type, typeList);

    if (node.type === 'text' && 'text' in node) {
      textNodes.push({
        id: node.id,
        text: (node as {text: string}).text,
        path: [...path, node.id],
      });
    }
  }

  function traverseBlock(
    block: BlockNode,
    path: readonly NodeId[],
    depth: number,
    parent: BlockNode | DocNode,
  ): void {
    addNode(block, path, depth, parent);

    const currentPath = [...path, block.id];

    if ('content' in block && Array.isArray(block.content)) {
      for (const child of block.content) {
        traverseBlock(child as BlockNode, currentPath, depth + 1, block);
      }
    }

    if (block.type === 'list') {
      for (const item of block.items) {
        traverseBlock(item, currentPath, depth + 1, block);
        if (item.nested) {
          for (const nested of item.nested) {
            traverseBlock(nested, [...currentPath, item.id], depth + 2, item);
          }
        }
      }
    }

    if (block.type === 'table') {
      for (const row of block.rows) {
        addNode(row, currentPath, depth + 1, block);
        for (const cell of row.cells) {
          addNode(cell, [...currentPath, row.id], depth + 2, row);
          for (const cellBlock of cell.content) {
            traverseBlock(cellBlock, [...currentPath, row.id, cell.id], depth + 3, cell);
          }
        }
      }
    }
  }

  for (const block of doc.content) {
    traverseBlock(block, [doc.id], 1, doc);
  }

  return {
    nodeMap,
    nodesByType,
    textNodes,
  };
}

/**
 * جلب عقدة بالمعرف.
 */
export function getNodeById(indexer: Indexer, id: NodeId): NodeInfo | undefined {
  return indexer.nodeMap.get(id);
}

/**
 * جلب جميع العقد من نوع معين.
 */
export function getNodesByType(indexer: Indexer, type: string): readonly NodeInfo[] {
  return indexer.nodesByType.get(type) ?? [];
}
