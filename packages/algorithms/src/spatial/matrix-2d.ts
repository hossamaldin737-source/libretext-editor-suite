/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: matrix-2d.ts
 * 📂 المسار: /packages/algorithms/src/spatial/matrix-2d.ts
 * 🎯 الهدف الرئيسي: مصفوفات التحويل الهندسي ثنائية الأبعاد (2D Affine Transformation Matrix).
 * 📋 المعايير:
 *    - تمثيل مصفوفة 3x3 متجانسة [a, b, c, d, tx, ty].
 *    - عمليات الإزاحة (Translate)، التكبير/التصغير (Scale)، التدوير (Rotate) مع مركز ارتكاز (Pivot).
 *    - ضرب المصفوفات، حساب المعكوس (Inverse Matrix)، ومحدد المصفوفة (Determinant).
 *    - تحويل النقاط وصناديق الحدود، والتحويل إلى صيغ CSS / SVG Matrix strings.
 * 🧪 الاختبارات:
 *    - /packages/algorithms/tests/spatial/matrix-2d.test.ts
 * 🏷️ المعرف: ALGO-012
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable 2D Matrix Algebra Engine for High-Performance Canvas Rendering.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحقق من أن المحدد غير صفري قبل محاولة عكس المصفوفة (Invertible check).
 *    2. مراعاة زوايا التدوير بالراديان أو الدرجات بدقة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - إرجاع مصفوفة الوحدة (Identity) عند فشل المعكوس.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: /packages/algorithms/src/index.ts
 *    - 📦 التبعيات: /packages/algorithms/src/spatial/types.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createIdentityMatrix: مصفوفة الوحدة (#L50)
 *    - createTranslationMatrix: مصفوفة الإزاحة (#L57)
 *    - createScalingMatrix: مصفوفة التحجيم (#L64)
 *    - createRotationMatrix: مصفوفة التدوير مع نقطة ارتكاز (#L75)
 *    - multiplyMatrices: ضرب مصفوفتين (#L93)
 *    - invertMatrix: حساب معكوس المصفوفة (#L109)
 *    - transformPointWithMatrix: تطبيق المصفوفة على نقطة (#L128)
 *    - transformBoxWithMatrix: تطبيق المصفوفة على صندوق الحدود (#L136)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BoundingBox, LogicalCoordinate } from './types';

/**
 * تمثيل مصفوفة تحويل ثنائية الأبعاد (Affine Transform)
 * | a  c  tx |
 * | b  d  ty |
 * | 0  0  1  |
 */
export interface Matrix2D {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly tx: number;
  readonly ty: number;
}

export function createIdentityMatrix(): Matrix2D {
  return { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };
}

export function createTranslationMatrix(tx: number, ty: number): Matrix2D {
  return { a: 1, b: 0, c: 0, d: 1, tx, ty };
}

export function createScalingMatrix(sx: number, sy: number, pivot?: LogicalCoordinate): Matrix2D {
  if (!pivot) {
    return { a: sx, b: 0, c: 0, d: sy, tx: 0, ty: 0 };
  }
  const t1 = createTranslationMatrix(-pivot.x, -pivot.y);
  const s = { a: sx, b: 0, c: 0, d: sy, tx: 0, ty: 0 };
  const t2 = createTranslationMatrix(pivot.x, pivot.y);
  return multiplyMatrices(t2, multiplyMatrices(s, t1));
}

export function createRotationMatrix(radians: number, pivot?: LogicalCoordinate): Matrix2D {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rot: Matrix2D = { a: cos, b: sin, c: -sin, d: cos, tx: 0, ty: 0 };

  if (!pivot) return rot;

  const t1 = createTranslationMatrix(-pivot.x, -pivot.y);
  const t2 = createTranslationMatrix(pivot.x, pivot.y);
  return multiplyMatrices(t2, multiplyMatrices(rot, t1));
}

export function createRotationDegreesMatrix(degrees: number, pivot?: LogicalCoordinate): Matrix2D {
  return createRotationMatrix((degrees * Math.PI) / 180, pivot);
}

/**
 * ضرب مصفوفتين ثنائيتي الأبعاد (m1 * m2)
 */
export function multiplyMatrices(m1: Matrix2D, m2: Matrix2D): Matrix2D {
  return {
    a: m1.a * m2.a + m1.c * m2.b,
    b: m1.b * m2.a + m1.d * m2.b,
    c: m1.a * m2.c + m1.c * m2.d,
    d: m1.b * m2.c + m1.d * m2.d,
    tx: m1.a * m2.tx + m1.c * m2.ty + m1.tx,
    ty: m1.b * m2.tx + m1.d * m2.ty + m1.ty,
  };
}

/**
 * حساب معكوس مصفوفة التحويل
 */
export function invertMatrix(m: Matrix2D): Matrix2D {
  const det = m.a * m.d - m.b * m.c;
  if (Math.abs(det) < 1e-10) {
    return createIdentityMatrix();
  }

  const invDet = 1 / det;
  return {
    a: m.d * invDet,
    b: -m.b * invDet,
    c: -m.c * invDet,
    d: m.a * invDet,
    tx: (m.c * m.ty - m.d * m.tx) * invDet,
    ty: (m.b * m.tx - m.a * m.ty) * invDet,
  };
}

/**
 * تطبيق المصفوفة على نقطة إحداثية
 */
export function transformPointWithMatrix(m: Matrix2D, p: LogicalCoordinate): LogicalCoordinate {
  return {
    type: 'logical',
    x: m.a * p.x + m.c * p.y + m.tx,
    y: m.b * p.x + m.d * p.y + m.ty,
    unit: p.unit,
  };
}

/**
 * تطبيق المصفوفة على صندوق حدود (Axis-Aligned Bounding Box)
 */
export function transformBoxWithMatrix(m: Matrix2D, box: BoundingBox): BoundingBox {
  const corners: LogicalCoordinate[] = [
    { type: 'logical', x: box.x, y: box.y, unit: 'px' },
    { type: 'logical', x: box.x + box.width, y: box.y, unit: 'px' },
    { type: 'logical', x: box.x + box.width, y: box.y + box.height, unit: 'px' },
    { type: 'logical', x: box.x, y: box.y + box.height, unit: 'px' },
  ];

  const transformed = corners.map((c) => transformPointWithMatrix(m, c));

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const pt of transformed) {
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
 * تحويل المصفوفة إلى صيغة CSS Transform: matrix(a, b, c, d, tx, ty)
 */
export function toCssMatrixString(m: Matrix2D): string {
  return `matrix(${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.tx}, ${m.ty})`;
}
