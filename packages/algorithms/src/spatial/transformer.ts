/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: transformer.ts
  * 📂 المسار: packages/algorithms/src/spatial/transformer.ts
  * 🎯 الهدف الرئيسي: Screen↔Document transform + rotation + snap-to-grid
  *                    + 8-point resize handles
  * 📋 المعايير: صفر اعتماديات خارجية، دوال نقية، Arrow Pointers Only
  * 🧪 الاختبارات: packages/algorithms/tests/spatial/transformer.test.ts
  * 🏷️ المعرف: ALGO-010
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 آخر تحديث: 2026-08-19
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Linear Transform Matrix + Rotation + Snap-to-Grid + 8-Point Handles
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. الدوران حول نقطة المركز فقط
  *    2. snap-to-grid يجب أن يكون اختيارياً (لا يُفرض افتراضياً)
  *    3. Handles الثمانية تُحسب من BoundingBox + rotation
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - Math.hypot للمسافات为了避免 أخطاء التقريب
  *    - clamp للثوابت/Grid snapping
  *    - NaN checks في كل دالة تحويل
  * ═══════════════════════════════════════════════════════════════════════════
  * 🔗 الملفات المرتبطة | Linked Files:
  *    - 📇 الفهرس: FUNCTION_INDEX.md
  *    - 📦 التبعيات: ./types.ts (LogicalCoordinate, createLogicalCoordinate)
  *    - 📄 مرتبط مباشر: mapper.ts (coordinate conversion logic)
  *    - 🧪 اختبارات: tests/spatial/transformer.test.ts
  * ═══════════════════════════════════════════════════════════════════════════
  * 📊 الدوال والخوارزميات | Functions & Algorithms:
  *    - screenToDocument(): screen coords → document coords (#L80)
  *    - documentToScreen(): document coords → screen coords (#L99)
  *    - rotatePoint(): rotate point around center (#L118)
  *    - snapToGrid(): snap value to nearest grid step (#L140)
  *    - getBoundingBox(): compute bounding box from 4 points (#L152)
  *    - getResizeHandles(): 8-point handles from bounding box (#L176)
  *    - applyLinearTransform(): 2D affine transform matrix (#L200)
  * ═══════════════════════════════════════════════════════════════════════════
  * 📝 ملاحظات التطوير | Development Notes:
  *    - مصدر الإلهام: webpainter-next CoordinateTransformer
  *    - مُكيّف لـ libretext: zero-dependency + functional API
  *    - Handles تُستخدم في Play للسحب بالماوس
  * ═══════════════════════════════════════════════════════════════════════════
  * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
  *    - 🔧 خطة المعالجة: Ported from webpainter-next + adapted
  *    - 📖 مرجع تقني: Linear Algebra (Affine Transforms)
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * ═══════════════════════════════════════════════════════════════════════════
  */

import { type LengthUnitValue, LengthUnit } from './types';

// ─── الأنواع ───

export interface Point2D {
  readonly x: number;
  readonly y: number;
}

/** نموذج تحويل خطي 2D (2x3 Affine Matrix) */
export interface TransformMatrix {
  readonly a: number; readonly b: number; readonly tx: number;
  readonly c: number; readonly d: number; readonly ty: number;
}

/** إعدادات Snap-to-Grid */
export interface SnapConfig {
  readonly stepX: number;
  readonly stepY: number;
  readonly enabled: boolean;
}

/** Bounding Box */
export interface BBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** نقطة Fixed (8-point handles) */
export type HandlePosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'middle-left' | 'middle-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ResizeHandle {
  readonly position: HandlePosition;
  readonly point: Point2D;
}

/** LTRB edges from BBox */
export interface BBoxEdges {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

// ─── ثوابت ───

const IDENTITY_MATRIX: TransformMatrix = {
  a: 1, b: 0, tx: 0,
  c: 0, d: 1, ty: 0,
};

// ─── التحويلات الخطية ───

/** تطبيق تحويل خطي 2D على نقطة */
export function applyLinearTransform(
  pt: Point2D,
  m: TransformMatrix
): Point2D {
  return {
    x: m.a * pt.x + m.b * pt.y + m.tx,
    y: m.c * pt.x + m.d * pt.y + m.ty,
  };
}

/** إنشاء مصفوفة تحويل من إزاحة فقط */
export function translateMatrix(tx: number, ty: number): TransformMatrix {
  return { ...IDENTITY_MATRIX, tx, ty };
}

/** إنشاء مصفوفة تحويل من دوران فقط (بالراديان) */
export function rotationMatrix(angleRad: number): TransformMatrix {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return { a: cos, b: -sin, tx: 0, c: sin, d: cos, ty: 0 };
}

/** إنشاء مصفوفة تحويل من دوران حول نقطة معينة */
export function rotationAroundPointMatrix(
  angleRad: number,
  cx: number,
  cy: number
): TransformMatrix {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    a: cos,
    b: -sin,
    tx: cx - cos * cx + sin * cy,
    c: sin,
    d: cos,
    ty: cy - sin * cx - cos * cy,
  };
}

// ─── Screen ↔ Document ───

/**
 * تحويل إحداثيات الشاشة إلى إحداثيات المستند
 * document = (screen - offset) / zoom
 */
export function screenToDocument(
  screenX: number,
  screenY: number,
  viewportOffset: Point2D,
  zoom: number
): Point2D {
  if (zoom <= 0) throw new Error(`Zoom must be > 0, got ${zoom}`);
  return {
    x: (screenX - viewportOffset.x) / zoom,
    y: (screenY - viewportOffset.y) / zoom,
  };
}

/**
 * تحويل إحداثيات المستند إلى إحداثيات الشاشة
 * screen = document * zoom + offset
 */
export function documentToScreen(
  docX: number,
  docY: number,
  viewportOffset: Point2D,
  zoom: number
): Point2D {
  if (zoom <= 0) throw new Error(`Zoom must be > 0, got ${zoom}`);
  return {
    x: docX * zoom + viewportOffset.x,
    y: docY * zoom + viewportOffset.y,
  };
}

// ─── Snap-to-Grid ───

/** تقريب قيمة إلى أقرب خطوة شبكية */
export function snapToGrid(value: number, step: number): number {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

/** تقريب نقطة إلى أقرب نقطة على الشبكة */
export function snapPointToGrid(
  pt: Point2D,
  snap: SnapConfig
): Point2D {
  if (!snap.enabled) return pt;
  return {
    x: snapToGrid(pt.x, snap.stepX),
    y: snapToGrid(pt.y, snap.stepY),
  };
}

// ─── Rotation ───

/** دوران نقطة حول مركز محدد بالراديان */
export function rotatePoint(
  pt: Point2D,
  angleRad: number,
  center: Point2D
): Point2D {
  const m = rotationAroundPointMatrix(angleRad, center.x, center.y);
  return applyLinearTransform(pt, m);
}

/** تحويل راديان إلى درجات */
export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

/** تحويل درجات إلى راديان */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ─── BoundingBox & Handles ───

/** حساب Bounding Box من 4 زوايا */
export function getBoundingBox(
  points: readonly Point2D[]
): BBox {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (Number.isFinite(p.x)) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
    }
    if (Number.isFinite(p.y)) {
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

/** حساب Bounding Box من 4 زوايا مع مراعاة الدوران */
export function getRotatedBoundingBox(
  corners: readonly Point2D[],
  angleRad: number
): BBox {
  const center: Point2D = {
    x: corners.reduce((s, c) => s + c.x, 0) / corners.length,
    y: corners.reduce((s, c) => s + c.y, 0) / corners.length,
  };
  const rotated = corners.map(c => rotatePoint(c, angleRad, center));
  return getBoundingBox(rotated);
}

/** إرجاع حافة Bounding Box (top/right/bottom/left) */
export function getBBoxEdges(bbox: BBox): BBoxEdges {
  return {
    top: bbox.y,
    right: bbox.x + bbox.width,
    bottom: bbox.y + bbox.height,
    left: bbox.x,
  };
}

/** حساب 8 نقاط ت control السحب من Bounding Box */
export function getResizeHandles(bbox: BBox): readonly ResizeHandle[] {
  const { x, y, width: w, height: h } = bbox;
  const mx = x + w / 2;
  const my = y + h / 2;
  return [
    { position: 'top-left',     point: { x,     y } },
    { position: 'top-center',   point: { x: mx, y } },
    { position: 'top-right',    point: { x: x+w,y } },
    { position: 'middle-left',  point: { x,     y: my } },
    { position: 'middle-right', point: { x: x+w,y: my } },
    { position: 'bottom-left',  point: { x,     y: y+h } },
    { position: 'bottom-center',point: { x: mx, y: y+h } },
    { position: 'bottom-right', point: { x: x+w,y: y+h } },
  ] as const;
}

/** حساب المسافة بين نقطتين */
export function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** إنشاء Bounding Box من نقطة وأبعاد */
export function createBBox(
  x: number, y: number, width: number, height: number
): BBox {
  return { x, y, width, height };
}

/** إنشاء BBox من LogicalCoordinate + أبعاد */
export function bboxFromLogical(
  x: number, y: number, w: number, h: number,
  _unit: LengthUnitValue = LengthUnit.PIXEL
): BBox {
  return createBBox(x, y, w, h);
}
