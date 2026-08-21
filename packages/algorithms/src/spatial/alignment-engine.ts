/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: alignment-engine.ts
 * 📂 المسار: packages/algorithms/src/spatial/alignment-engine.ts
 * 🎯 الهدف الرئيسي: محرك المحاذاة والتوزيع ونقاط الارتكاز المغناطيسية للعناصر.
 * 📋 المعايير:
 *    - محاذاة أفقية ورأسية (يسار، وسط، يمين، أعلى، منتصف، أسفل).
 *    - توزيع متساوي للمسافات أفقياً ورأسياً (Equal Distribution).
 *    - حساب نقاط الارتكاز المغناطيسية (Top, Right, Bottom, Left, Center).
 * 🏷️ المعرف: ALGO-014
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure Geometric Alignment & Bounding Spacing Engine with Magnetic Snap Anchors.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بحدود الأسطر (<400 سطر).
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface AlignableItem {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type AlignmentType =
  'align-left' | 'align-center-x' | 'align-right' | 'align-top' | 'align-center-y' | 'align-bottom';

export type DistributionType = 'distribute-horizontal' | 'distribute-vertical';

export interface AnchorPoint {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly position: 'top' | 'right' | 'bottom' | 'left' | 'center';
}

export class AlignmentEngine {
  /**
   * محاذاة مجموعة عناصر وفق النوع المطلوب
   */
  static align<T extends AlignableItem>(items: readonly T[], type: AlignmentType): T[] {
    if (items.length < 2) return [...items];

    const minX = Math.min(...items.map((i) => i.x));
    const maxX = Math.max(...items.map((i) => i.x + i.width));
    const minY = Math.min(...items.map((i) => i.y));
    const maxY = Math.max(...items.map((i) => i.y + i.height));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    return items.map((item) => {
      switch (type) {
        case 'align-left':
          return { ...item, x: minX };
        case 'align-right':
          return { ...item, x: maxX - item.width };
        case 'align-center-x':
          return { ...item, x: centerX - item.width / 2 };
        case 'align-top':
          return { ...item, y: minY };
        case 'align-bottom':
          return { ...item, y: maxY - item.height };
        case 'align-center-y':
          return { ...item, y: centerY - item.height / 2 };
        default:
          return item;
      }
    });
  }

  /**
   * توزيع المسافات بين العناصر بالتساوي أفقياً أو رأسياً
   */
  static distribute<T extends AlignableItem>(items: readonly T[], type: DistributionType): T[] {
    if (items.length < 3) return [...items];

    if (type === 'distribute-horizontal') {
      const sorted = [...items].sort((a, b) => a.x - b.x);
      const totalElementsWidth = sorted.reduce((sum, item) => sum + item.width, 0);
      const first = sorted[0]!;
      const last = sorted[sorted.length - 1]!;
      const totalSpan = last.x + last.width - first.x;
      const totalGap = totalSpan - totalElementsWidth;
      const gap = Math.max(0, totalGap / (sorted.length - 1));

      let currentX = first.x;
      return sorted.map((item, idx) => {
        if (idx === 0) {
          currentX += item.width + gap;
          return item;
        }
        const updated = { ...item, x: currentX };
        currentX += item.width + gap;
        return updated;
      });
    }

    // distribute-vertical
    const sorted = [...items].sort((a, b) => a.y - b.y);
    const totalElementsHeight = sorted.reduce((sum, item) => sum + item.height, 0);
    const first = sorted[0]!;
    const last = sorted[sorted.length - 1]!;
    const totalSpan = last.y + last.height - first.y;
    const totalGap = totalSpan - totalElementsHeight;
    const gap = Math.max(0, totalGap / (sorted.length - 1));

    let currentY = first.y;
    return sorted.map((item, idx) => {
      if (idx === 0) {
        currentY += item.height + gap;
        return item;
      }
      const updated = { ...item, y: currentY };
      currentY += item.height + gap;
      return updated;
    });
  }

  /**
   * استخراج نقاط الارتكاز المغناطيسية لعنصر
   */
  static getAnchorPoints(item: AlignableItem): AnchorPoint[] {
    return [
      { id: `${item.id}-top`, x: item.x + item.width / 2, y: item.y, position: 'top' },
      {
        id: `${item.id}-right`,
        x: item.x + item.width,
        y: item.y + item.height / 2,
        position: 'right',
      },
      {
        id: `${item.id}-bottom`,
        x: item.x + item.width / 2,
        y: item.y + item.height,
        position: 'bottom',
      },
      { id: `${item.id}-left`, x: item.x, y: item.y + item.height / 2, position: 'left' },
      {
        id: `${item.id}-center`,
        x: item.x + item.width / 2,
        y: item.y + item.height / 2,
        position: 'center',
      },
    ];
  }

  /**
   * إيجاد أقرب نقطة ارتكاز مغناطيسية لنقطة معينة مع نطاق جذب محدد (Snap Threshold)
   */
  static findNearestAnchor(
    point: { x: number; y: number },
    items: readonly AlignableItem[],
    threshold: number = 15,
  ): AnchorPoint | null {
    let nearest: AnchorPoint | null = null;
    let minDistance = threshold;

    for (const item of items) {
      const anchors = this.getAnchorPoints(item);
      for (const anchor of anchors) {
        const dist = Math.hypot(anchor.x - point.x, anchor.y - point.y);
        if (dist <= minDistance) {
          minDistance = dist;
          nearest = anchor;
        }
      }
    }

    return nearest;
  }
}
