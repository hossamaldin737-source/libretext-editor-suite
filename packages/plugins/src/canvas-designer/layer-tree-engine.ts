/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: layer-tree-engine.ts
 * 📂 المسار: packages/plugins/src/canvas-designer/layer-tree-engine.ts
 * 🎯 الهدف الرئيسي: محرك إدارة شجرة الطبقات، ترتيب Z-Index، والتجميع وفك التجميع.
 * 📋 المعايير:
 *    - دوال نقية لإدارة الطبقات وترتيب Z-Index بدقة.
 *    - دعم كامل لـ Grouping و Ungrouping مع الحفاظ على التموضع النسبي.
 *    - القفل (Lock/Unlock) والإخفاء (Hide/Show).
 * 🏷️ المعرف: PLUG-011
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Tree-Based Hierarchical Layer Engine with Normalized Z-Indexing & Group Boundaries.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بحدود الأسطر (<400 سطر).
 *    2. ضمان عدم تكرار قيم Z-Index وتطبيعها دوماً.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { CanvasElementInstance } from './schema-types';

export interface LayerNode {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly zIndex: number;
  readonly visible: boolean;
  readonly locked: boolean;
  readonly groupId?: string | null;
  readonly children?: readonly LayerNode[];
}

export class LayerTreeEngine {
  /**
   * إعادة تسوية وتطبيع قيم Z-Index لجميع العناصر تصاعدياً (0, 1, 2...)
   */
  static normalizeZIndices(elements: readonly CanvasElementInstance[]): CanvasElementInstance[] {
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);
    return sorted.map((el, idx) => ({
      ...el,
      zIndex: idx,
    }));
  }

  /**
   * جلب العنصر للمقدمة تماماً (Bring to Front)
   */
  static bringToFront(
    elements: readonly CanvasElementInstance[],
    elementId: string,
  ): CanvasElementInstance[] {
    const maxZ = elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
    const updated = elements.map((el) => (el.id === elementId ? { ...el, zIndex: maxZ + 1 } : el));
    return this.normalizeZIndices(updated);
  }

  /**
   * إرسال العنصر للخلفية تماماً (Send to Back)
   */
  static sendToBack(
    elements: readonly CanvasElementInstance[],
    elementId: string,
  ): CanvasElementInstance[] {
    const minZ = elements.reduce((min, el) => Math.min(min, el.zIndex), 0);
    const updated = elements.map((el) => (el.id === elementId ? { ...el, zIndex: minZ - 1 } : el));
    return this.normalizeZIndices(updated);
  }

  /**
   * تقديم العنصر طبقة واحدة للأمام (Bring Forward)
   */
  static bringForward(
    elements: readonly CanvasElementInstance[],
    elementId: string,
  ): CanvasElementInstance[] {
    const normalized = this.normalizeZIndices(elements);
    const targetIdx = normalized.findIndex((el) => el.id === elementId);
    if (targetIdx < 0 || targetIdx === normalized.length - 1) return normalized;

    const swapped = [...normalized];
    const nextEl = swapped[targetIdx + 1]!;
    swapped[targetIdx + 1] = { ...swapped[targetIdx]!, zIndex: nextEl.zIndex };
    swapped[targetIdx] = { ...nextEl, zIndex: swapped[targetIdx]!.zIndex };

    return this.normalizeZIndices(swapped);
  }

  /**
   * تأخير العنصر طبقة واحدة للخلف (Send Backward)
   */
  static sendBackward(
    elements: readonly CanvasElementInstance[],
    elementId: string,
  ): CanvasElementInstance[] {
    const normalized = this.normalizeZIndices(elements);
    const targetIdx = normalized.findIndex((el) => el.id === elementId);
    if (targetIdx <= 0) return normalized;

    const swapped = [...normalized];
    const prevEl = swapped[targetIdx - 1]!;
    swapped[targetIdx - 1] = { ...swapped[targetIdx]!, zIndex: prevEl.zIndex };
    swapped[targetIdx] = { ...prevEl, zIndex: swapped[targetIdx]!.zIndex };

    return this.normalizeZIndices(swapped);
  }

  /**
   * تجميع عدة عناصر في مجموعة واحدة (Group Elements)
   */
  static groupElements(
    elements: readonly CanvasElementInstance[],
    selectedIds: readonly string[],
    newGroupId: string,
  ): CanvasElementInstance[] {
    if (selectedIds.length < 2) return [...elements];

    return elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return {
          ...el,
          groupId: newGroupId,
        };
      }
      return el;
    });
  }

  /**
   * فك تجميع العناصر من مجموعة محددة (Ungroup Elements)
   */
  static ungroupElements(
    elements: readonly CanvasElementInstance[],
    groupId: string,
  ): CanvasElementInstance[] {
    return elements.map((el) => {
      if (el.groupId === groupId) {
        const { groupId: _, ...rest } = el;
        return { ...rest, groupId: null };
      }
      return el;
    });
  }

  /**
   * تبديل حالة القفل لعنصر
   */
  static toggleLock(
    elements: readonly CanvasElementInstance[],
    elementId: string,
  ): CanvasElementInstance[] {
    return elements.map((el) => (el.id === elementId ? { ...el, locked: !el.locked } : el));
  }

  /**
   * تبديل حالة الظهور لعنصر
   */
  static toggleVisibility(
    elements: readonly CanvasElementInstance[],
    elementId: string,
  ): CanvasElementInstance[] {
    return elements.map((el) =>
      el.id === elementId ? { ...el, visible: el.visible === false } : el,
    );
  }

  /**
   * بناء شجرة هرمية للطبقات لتمثيلها في الواجهة الجانبية (Layers Panel)
   */
  static buildLayerTree(elements: readonly CanvasElementInstance[]): LayerNode[] {
    const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex); // الأعلى في الأعلى
    const groupsMap = new Map<string, LayerNode[]>();
    const rootNodes: LayerNode[] = [];

    // تجميع أولاً
    for (const el of sorted) {
      const node: LayerNode = {
        id: el.id,
        name: el.text || `عنصر ${el.type}`,
        type: el.type,
        zIndex: el.zIndex,
        visible: el.visible !== false,
        locked: Boolean(el.locked),
        groupId: el.groupId,
      };

      if (el.groupId) {
        if (!groupsMap.has(el.groupId)) {
          groupsMap.set(el.groupId, []);
        }
        groupsMap.get(el.groupId)!.push(node);
      } else {
        rootNodes.push(node);
      }
    }

    // بناء عقد المجموعات
    for (const [groupId, children] of groupsMap.entries()) {
      const highestZ = Math.max(...children.map((c) => c.zIndex));
      const groupNode: LayerNode = {
        id: groupId,
        name: `مجموعة (${children.length})`,
        type: 'group-container',
        zIndex: highestZ,
        visible: children.some((c) => c.visible),
        locked: children.every((c) => c.locked),
        children,
      };
      rootNodes.push(groupNode);
    }

    return rootNodes.sort((a, b) => b.zIndex - a.zIndex);
  }
}
