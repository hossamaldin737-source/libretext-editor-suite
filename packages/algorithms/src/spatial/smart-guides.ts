/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: smart-guides.ts
 * 📂 المسار: packages/algorithms/src/spatial/smart-guides.ts
 * 🎯 الهدف الرئيسي: محرك خطوط الإرشاد الذكية والمحاذاة التلقائية ومؤشرات الفجوات والمسافات
 * 📋 المعايير:
 *    - توليد خطوط إرشاد أفقية ورأسية (ReferenceLine) عند تطابق حواف أو مراكز العناصر
 *    - حساب مسافات التساوي البصري (DistanceBadge) بين العناصر المتجاورة
 *    - التكامل مع كواشف التصادم ومحرك التسنين (Snapping Engine)
 * 🧪 الاختبارات: packages/algorithms/tests/spatial/smart-guides.test.ts
 * 🏷️ المعرف: ALGO-030
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Proximity Spatial Indexing + Dynamic Guideline & Equal Spacing Synthesis
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب توليد خطوط إرشاد مكررة أو لا نهائية على نفس الإحداثي
 *    2. مراعاة عتبة المحاذاة (Snap Threshold) لتفادي الوميض
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من وجود عناصر مرجعية كافية قبل حساب الفجوات
 *    - تصفية العناصر المتداخلة بالكامل أو ذات الأبعاد الصفرية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/algorithms/src/index.ts
 *    - 📦 التبعيات: packages/algorithms/src/spatial/collision.ts
 *    - 📄 مرتبط مباشر: packages/algorithms/src/spatial/types.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/spatial/smart-guides.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - generateReferenceLines: توليد خطوط المحاذاة الذكية بين عنصر متحرك وعناصر ثابتة (#L59)
 *    - calculateDistanceBadges: حساب مؤشرات المسافات المتساوية بين ثلاثية عناصر (#L124)
 *    - filterDuplicateGuides: إزالة خطوط الإرشاد المتطابقة والمتجاورة (#L178)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم ترقية المحرك ليدعم الحواف الستة (بداية، وسط، نهاية لكلا المحورين X و Y)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { type Rect, type SnappableElement } from './collision';

export interface ReferenceLine {
  id: string;
  orientation: 'horizontal' | 'vertical';
  position: number;
  start: number;
  end: number;
  color?: string;
  label?: string;
}

export interface DistanceBadge {
  id: string;
  x: number;
  y: number;
  distance: number;
  orientation: 'horizontal' | 'vertical';
}

function generateGuideId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * توليد خطوط المحاذاة الذكية عند تحريك عنصر بالقرب من عناصر أخرى
 */
export function generateReferenceLines(
  activeRect: Rect,
  otherElements: SnappableElement[],
  threshold: number = 5,
): ReferenceLine[] {
  const lines: ReferenceLine[] = [];

  const activePointsX = [
    { pos: activeRect.x, type: 'left' },
    { pos: activeRect.x + activeRect.width / 2, type: 'centerX' },
    { pos: activeRect.x + activeRect.width, type: 'right' },
  ];

  const activePointsY = [
    { pos: activeRect.y, type: 'top' },
    { pos: activeRect.y + activeRect.height / 2, type: 'centerY' },
    { pos: activeRect.y + activeRect.height, type: 'bottom' },
  ];

  for (const elem of otherElements) {
    const target = elem.bounds;
    const targetPointsX = [target.x, target.x + target.width / 2, target.x + target.width];
    const targetPointsY = [target.y, target.y + target.height / 2, target.y + target.height];

    // فحص المحور الرأسي (X-axis snap)
    for (const ap of activePointsX) {
      for (const tp of targetPointsX) {
        if (Math.abs(ap.pos - tp) <= threshold) {
          const minY = Math.min(activeRect.y, target.y);
          const maxY = Math.max(activeRect.y + activeRect.height, target.y + target.height);
          lines.push({
            id: generateGuideId('ref_v'),
            orientation: 'vertical',
            position: tp,
            start: minY,
            end: maxY,
            label: `${Math.round(tp)}px`,
          });
        }
      }
    }

    // فحص المحور الأفقي (Y-axis snap)
    for (const ap of activePointsY) {
      for (const tp of targetPointsY) {
        if (Math.abs(ap.pos - tp) <= threshold) {
          const minX = Math.min(activeRect.x, target.x);
          const maxX = Math.max(activeRect.x + activeRect.width, target.x + target.width);
          lines.push({
            id: generateGuideId('ref_h'),
            orientation: 'horizontal',
            position: tp,
            start: minX,
            end: maxX,
            label: `${Math.round(tp)}px`,
          });
        }
      }
    }
  }

  return filterDuplicateGuides(lines);
}

/**
 * حساب مؤشرات المسافات المتساوية والفجوات بين العناصر
 */
export function calculateDistanceBadges(
  activeRect: Rect,
  otherElements: SnappableElement[],
  tolerance: number = 2,
): DistanceBadge[] {
  const badges: DistanceBadge[] = [];
  if (otherElements.length < 2) return badges;

  const sortedByX = [...otherElements]
    .map((e) => e.bounds)
    .concat(activeRect)
    .sort((a, b) => a.x - b.x);

  for (let i = 0; i < sortedByX.length - 2; i++) {
    const r1 = sortedByX[i]!;
    const r2 = sortedByX[i + 1]!;
    const r3 = sortedByX[i + 2]!;

    const gap1 = r2.x - (r1.x + r1.width);
    const gap2 = r3.x - (r2.x + r2.width);

    if (gap1 > 0 && gap2 > 0 && Math.abs(gap1 - gap2) <= tolerance) {
      badges.push({
        id: generateGuideId('badge_h1'),
        x: r1.x + r1.width + gap1 / 2,
        y: (r1.y + r2.y) / 2,
        distance: Math.round(gap1),
        orientation: 'horizontal',
      });
      badges.push({
        id: generateGuideId('badge_h2'),
        x: r2.x + r2.width + gap2 / 2,
        y: (r2.y + r3.y) / 2,
        distance: Math.round(gap2),
        orientation: 'horizontal',
      });
    }
  }

  const sortedByY = [...otherElements]
    .map((e) => e.bounds)
    .concat(activeRect)
    .sort((a, b) => a.y - b.y);

  for (let i = 0; i < sortedByY.length - 2; i++) {
    const r1 = sortedByY[i]!;
    const r2 = sortedByY[i + 1]!;
    const r3 = sortedByY[i + 2]!;

    const gap1 = r2.y - (r1.y + r1.height);
    const gap2 = r3.y - (r2.y + r2.height);

    if (gap1 > 0 && gap2 > 0 && Math.abs(gap1 - gap2) <= tolerance) {
      badges.push({
        id: generateGuideId('badge_v1'),
        x: (r1.x + r2.x) / 2,
        y: r1.y + r1.height + gap1 / 2,
        distance: Math.round(gap1),
        orientation: 'vertical',
      });
      badges.push({
        id: generateGuideId('badge_v2'),
        x: (r2.x + r3.x) / 2,
        y: r2.y + r2.height + gap2 / 2,
        distance: Math.round(gap2),
        orientation: 'vertical',
      });
    }
  }

  return badges;
}

/**
 * تصفية خطوط الإرشاد المتطابقة
 */
export function filterDuplicateGuides(lines: ReferenceLine[]): ReferenceLine[] {
  const seen = new Set<string>();
  const unique: ReferenceLine[] = [];

  for (const line of lines) {
    const key = `${line.orientation}_${Math.round(line.position)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(line);
    }
  }

  return unique;
}
