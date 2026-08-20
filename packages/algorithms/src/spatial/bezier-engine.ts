/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: bezier-engine.ts
 * 📂 المسار: /packages/algorithms/src/spatial/bezier-engine.ts
 * 🎯 الهدف الرئيسي: محرك حسابات وهندسة منحنيات بيزيه (Quadratic & Cubic Bézier Curves).
 * 📋 المعايير:
 *    - حساب إحداثيات النقاط عند المعامل t (0 إلى 1).
 *    - حساب المماسات والمتجهات العمودية والانحناء (Tangents, Normals & Curvature).
 *    - تقسيم المنحنيات بخوارزمية De Casteljau.
 *    - حساب الطول التقريبي للقوس (Arc Length) وصندوق الحدود الحقيقي (Accurate Bounding Box).
 * 🧪 الاختبارات:
 *    - /packages/algorithms/tests/spatial/bezier-engine.test.ts
 * 🏷️ المعرف: ALGO-010
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Analytical Polynomial & Subdivision Bézier Math Pipeline.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب القسمة على صفر عند حساب متجهات الوحدة والمماسات في نقاط التلاشي.
 *    2. ضمان بقاء المعامل t محصوراً بدقة بين [0, 1].
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تقييد قيم t عبر clamp01.
 *    - معالجة المنحنيات الخطية المتدهورة (Degenerate straight line curves).
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: /packages/algorithms/src/index.ts
 *    - 📦 التبعيات: /packages/algorithms/src/spatial/types.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - evaluateCubic: حساب نقطة على منحنى بيزيه تكعيبي (#L52)
 *    - evaluateQuadratic: حساب نقطة على منحنى بيزيه تربيعي (#L65)
 *    - cubicTangent: حساب متجه المماس التكعيبي (#L76)
 *    - subdivideCubic: تقسيم المنحنى التكعيبي إلى نصفين عبر De Casteljau (#L92)
 *    - approximateCubicLength: حساب طول القوس التراكمي (#L114)
 *    - getCubicBounds: حساب صندوق الحدود الدقيق بما يشمل النقاط القصوى (#L132)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { LogicalCoordinate, BoundingBox } from './types';

export interface BezierPoint {
  readonly x: number;
  readonly y: number;
}

export interface CubicBezierCurve {
  readonly p0: BezierPoint;
  readonly p1: BezierPoint;
  readonly p2: BezierPoint;
  readonly p3: BezierPoint;
}

export interface QuadraticBezierCurve {
  readonly p0: BezierPoint;
  readonly p1: BezierPoint;
  readonly p2: BezierPoint;
}

function clamp01(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t;
}

/**
 * حساب نقطة على منحنى بيزيه تكعيبي عند المعامل t
 */
export function evaluateCubic(curve: CubicBezierCurve, tRaw: number): BezierPoint {
  const t = clamp01(tRaw);
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * curve.p0.x + 3 * uu * t * curve.p1.x + 3 * u * tt * curve.p2.x + ttt * curve.p3.x,
    y: uuu * curve.p0.y + 3 * uu * t * curve.p1.y + 3 * u * tt * curve.p2.y + ttt * curve.p3.y,
  };
}

/**
 * حساب نقطة على منحنى بيزيه تربيعي عند المعامل t
 */
export function evaluateQuadratic(curve: QuadraticBezierCurve, tRaw: number): BezierPoint {
  const t = clamp01(tRaw);
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;

  return {
    x: uu * curve.p0.x + 2 * u * t * curve.p1.x + tt * curve.p2.x,
    y: uu * curve.p0.y + 2 * u * t * curve.p1.y + tt * curve.p2.y,
  };
}

/**
 * حساب متجه المماس التكعيبي (First Derivative)
 */
export function cubicTangent(curve: CubicBezierCurve, tRaw: number): BezierPoint {
  const t = clamp01(tRaw);
  const u = 1 - t;

  const dx = 3 * u * u * (curve.p1.x - curve.p0.x) + 6 * u * t * (curve.p2.x - curve.p1.x) + 3 * t * t * (curve.p3.x - curve.p2.x);
  const dy = 3 * u * u * (curve.p1.y - curve.p0.y) + 6 * u * t * (curve.p2.y - curve.p1.y) + 3 * t * t * (curve.p3.y - curve.p2.y);

  const len = Math.hypot(dx, dy);
  if (len === 0) return { x: 1, y: 0 };
  return { x: dx / len, y: dy / len };
}

/**
 * تقسيم منحنى بيزيه تكعيبي عند المعامل t إلى منحنيين
 */
export function subdivideCubic(
  curve: CubicBezierCurve,
  tRaw: number,
): readonly [CubicBezierCurve, CubicBezierCurve] {
  const t = clamp01(tRaw);
  const lerp = (a: BezierPoint, b: BezierPoint): BezierPoint => ({
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  });

  const p01 = lerp(curve.p0, curve.p1);
  const p12 = lerp(curve.p1, curve.p2);
  const p23 = lerp(curve.p2, curve.p3);

  const p012 = lerp(p01, p12);
  const p123 = lerp(p12, p23);

  const p0123 = lerp(p012, p123);

  const left: CubicBezierCurve = { p0: curve.p0, p1: p01, p2: p012, p3: p0123 };
  const right: CubicBezierCurve = { p0: p0123, p1: p123, p2: p23, p3: curve.p3 };

  return [left, right];
}

/**
 * حساب الطول التقريبي لمنحنى بيزيه تكعيبي عبر تقطيع رقمي
 */
export function approximateCubicLength(curve: CubicBezierCurve, segments = 24): number {
  let length = 0;
  let prev = curve.p0;

  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const pt = evaluateCubic(curve, t);
    length += Math.hypot(pt.x - prev.x, pt.y - prev.y);
    prev = pt;
  }

  return length;
}

function find1DExtrema(p0: number, p1: number, p2: number, p3: number): readonly number[] {
  const a = 3 * (-p0 + 3 * p1 - 3 * p2 + p3);
  const b = 6 * (p0 - 2 * p1 + p2);
  const c = 3 * (p1 - p0);

  const roots: number[] = [];
  if (Math.abs(a) < 1e-9) {
    if (Math.abs(b) > 1e-9) {
      const t = -c / b;
      if (t > 0 && t < 1) roots.push(t);
    }
  } else {
    const discr = b * b - 4 * a * c;
    if (discr >= 0) {
      const sqrtD = Math.sqrt(discr);
      const t1 = (-b + sqrtD) / (2 * a);
      const t2 = (-b - sqrtD) / (2 * a);
      if (t1 > 0 && t1 < 1) roots.push(t1);
      if (t2 > 0 && t2 < 1) roots.push(t2);
    }
  }
  return roots;
}

/**
 * حساب الصندوق المحيط الدقيق بالمنحنى بما يشمل نقاط الانعطاف
 */
export function getCubicBounds(curve: CubicBezierCurve): BoundingBox {
  const xRoots = find1DExtrema(curve.p0.x, curve.p1.x, curve.p2.x, curve.p3.x);
  const yRoots = find1DExtrema(curve.p0.y, curve.p1.y, curve.p2.y, curve.p3.y);

  const allT = [0, 1, ...xRoots, ...yRoots];
  const pts = allT.map((t) => evaluateCubic(curve, t));

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pt of pts) {
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  return {
    type: 'bounding-box' as const,
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
    unit: 'px',
  };
}

/**
 * تحويل مسار بيزيه إلى نص مسار SVG صالح (d attribute)
 */
export function cubicToSvgPath(curve: CubicBezierCurve): string {
  return `M ${curve.p0.x} ${curve.p0.y} C ${curve.p1.x} ${curve.p1.y}, ${curve.p2.x} ${curve.p2.y}, ${curve.p3.x} ${curve.p3.y}`;
}

/**
 * تحويل إحداثيات منطقية LogicalCoordinate إلى BezierPoint
 */
export function toBezierPoint(coord: LogicalCoordinate): BezierPoint {
  return { x: coord.x, y: coord.y };
}
