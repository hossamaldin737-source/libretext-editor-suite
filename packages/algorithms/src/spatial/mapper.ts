/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mapper.ts
 * 📂 المسار: packages/algorithms/src/spatial/mapper.ts
 * 🎯 الهدف الرئيسي: ترجمة إحداثيات الماوس الخام إلى إحداثيات منطقية
 *                    (LogicalCoordinate لـ Impress، GridCoordinate لـ Calc/Base)
 * 📋 المعايير: صفر اعتماديات خارجية، دوال نقية، دعم الوحدات المتعددة، دعم Zoom
 * 🧪 الاختبارات: packages/algorithms/tests/spatial/mapper.test.ts
 * 🏷️ المعرف: ALGO-008
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v2: Domain Defaults + Upper Bounds)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure Function Pipeline + Domain-Based Dispatch + Unit Conversion Table
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القسمة على صفر إذا كان zoom <= 0
 *    2. الإحداثيات السالبة خارج الشبكة تُثبَّت عند (0,0)
 *    3. دقة تحويل الوحدات العشرية قد تسبب أخطاء تقريب (مقبولة في خرائط الشبكات)
 *    4. جميع قيم GridMapperConfig بوحدات منطقية (Logical Pixels) غير مُقيَّسة بالـ Zoom
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من zoom > 0 قبل أي قسمة
 *    - Math.max(0, ...) لمنع تسرب قيم سالبة إلى createGridCoordinate
 *    - Math.min(maxRow, ...) لمنع الإحداثيات خارج حدود الشبكة
 *    - Type Guards عبر as const للثوابت
 *    - Domain default units map لحل تناقضات الوحدات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#ALGO-008
 *    - 📦 التبعيات: ./types.ts (LogicalCoordinate, GridCoordinate, LengthUnit)
 *    - 📄 مرتبط مباشر: spatial/commands.ts (ALGO-009) سيستهلك هذا الملف
 *    - 🧪 اختبارات: tests/spatial/mapper.test.ts
 *    - 📚 مراجع: RESTRUCTURING_PLAN.md §2 (Spatial Translation Engine)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - unitToPx(): تحويل من وحدة إلى بكسل (#L86)
 *    - pxToUnit(): تحويل من بكسل إلى وحدة (#L91)
 *    - convertLength(): تحويل بين وحدتين مختلفتين (#L96)
 *    - translateToLogical(): تحويل إلى إحداثيات ديكارتية (#L112)
 *    - translateToGrid(): تحويل إلى إحداثيات شبكية (#L133)
 *    - translateCoords(): الدالة الرئيسية ALGO-SPR-001 (#L167)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - معيار CSS: 1 inch = 96 px (ثابت لا يتغير)
 *    - الإحداثيات السالبة تُثبَّت عند 0 لحماية createGridCoordinate
 *    - Writer يستخدم pt كوحدة افتراضية، Impress يستخدم cm
 *    - GridMapperConfig يستخدم Logical Pixels (غير مُقيَّسة بالـ Zoom)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل معروفة حالياً
 *    - 📖 مرجع تقني: CSS Values and Units Module Level 3 (W3C)
 *    - 🎯 التحسينات المستقبلية: دعم RTL للشبكات، دعم الإحداثيات النسبية (%)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: W3C CSS Values and Units (Public Domain)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  type LogicalCoordinate,
  type GridCoordinate,
  type SpatialCoordinate,
  type LengthUnitValue,
  LengthUnit,
  createLogicalCoordinate,
  createGridCoordinate
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// ثوابت التحويل (CSS Standard: 1 inch = 96 px)
// ─────────────────────────────────────────────────────────────────────────────

/** عدد البكسلات في البوصة الواحدة (معيار CSS) */
export const PIXELS_PER_INCH = 96;
/** عدد البكسلات في السنتيمتر الواحد */
export const PIXELS_PER_CM = PIXELS_PER_INCH / 2.54;
/** عدد البكسلات في المليمتر الواحد */
export const PIXELS_PER_MM = PIXELS_PER_INCH / 25.4;
/** عدد البكسلات في النقطة الواحدة (pt) */
export const PIXELS_PER_PT = PIXELS_PER_INCH / 72;

// ─────────────────────────────────────────────────────────────────────────────
// الأنواع والواجهات
// ─────────────────────────────────────────────────────────────────────────────

/** إحداثيات الماوس الخام (من Adapter) */
export interface RawMouseCoords {
  readonly clientX: number;
  readonly clientY: number;
}

/** إعدادات نافذة العرض (Viewport) */
export interface ViewportConfig {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly zoom: number;
}

/**
 * إعدادات الشبكة (لـ Calc و Base)
 * ⚠️ ملاحظة هامة: جميع القيم (cellWidth, cellHeight, headerWidth, headerHeight)
 * يجب أن تكون بالوحدات المنطقية (Logical Pixels) أي غير مُقيَّسة بالـ Zoom.
 * مثال: إذا كان cellWidth = 100، فإن الخلية تظهر بـ 200px عند zoom=2
 */
export interface GridMapperConfig {
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly headerWidth: number;
  readonly headerHeight: number;
  readonly maxRow?: number;
  readonly maxCol?: number;
}

/** إعدادات المترجم الشاملة */
export interface MapperConfig {
  readonly viewport: ViewportConfig;
  readonly grid?: GridMapperConfig;
  readonly unit?: LengthUnitValue;
}

/** النطاقات المكتبية الأربعة */
export const OfficeDomain = {
  WRITER: 'writer',
  CALC: 'calc',
  IMPRESS: 'impress',
  BASE: 'base'
} as const;

export type OfficeDomainValue = typeof OfficeDomain[keyof typeof OfficeDomain];

/** خريطة الوحدات الافتراضية لكل نطاق */
const DOMAIN_DEFAULT_UNIT: Record<OfficeDomainValue, LengthUnitValue> = {
  [OfficeDomain.WRITER]: LengthUnit.POINT,
  [OfficeDomain.CALC]: LengthUnit.PIXEL,
  [OfficeDomain.IMPRESS]: LengthUnit.CENTIMETER,
  [OfficeDomain.BASE]: LengthUnit.PIXEL
};

// ─────────────────────────────────────────────────────────────────────────────
// جدول تحويل الوحدات
// ─────────────────────────────────────────────────────────────────────────────

/** خريطة التحويل من كل وحدة إلى البكسل */
const UNIT_TO_PX: Record<LengthUnitValue, number> = {
  [LengthUnit.PIXEL]: 1,
  [LengthUnit.CENTIMETER]: PIXELS_PER_CM,
  [LengthUnit.INCH]: PIXELS_PER_INCH,
  [LengthUnit.POINT]: PIXELS_PER_PT,
  [LengthUnit.MILLIMETER]: PIXELS_PER_MM
};

// ─────────────────────────────────────────────────────────────────────────────
// دوال تحويل الوحدات
// ─────────────────────────────────────────────────────────────────────────────

/** تحويل قيمة من وحدة إلى بكسل */
export function unitToPx(value: number, unit: LengthUnitValue): number {
  return value * UNIT_TO_PX[unit];
}

/** تحويل قيمة من بكسل إلى وحدة محددة */
export function pxToUnit(px: number, unit: LengthUnitValue): number {
  return px / UNIT_TO_PX[unit];
}

/** تحويل قيمة بين وحدتين مختلفتين */
export function convertLength(
  value: number,
  from: LengthUnitValue,
  to: LengthUnitValue
): number {
  if (from === to) {
    return value;
  }
  return pxToUnit(unitToPx(value, from), to);
}

// ─────────────────────────────────────────────────────────────────────────────
// دوال الترجمة المكانية
// ─────────────────────────────────────────────────────────────────────────────

/** التحقق من صحة إعدادات نافذة العرض */
function validateViewport(viewport: ViewportConfig): void {
  if (viewport.zoom <= 0) {
    throw new Error(`Viewport zoom must be positive, got: ${viewport.zoom}`);
  }
}

/**
 * تحويل إحداثيات الماوس الخام إلى إحداثيات ديكارتية منطقية
 * (لـ Impress و Writer)
 * @param raw إحداثيات الماوس الخام (clientX, clientY)
 * @param viewport إعدادات نافذة العرض (offset, zoom)
 * @param unit الوحدة المطلوبة للإخراج (افتراضي: px)
 */
export function translateToLogical(
  raw: RawMouseCoords,
  viewport: ViewportConfig,
  unit: LengthUnitValue = LengthUnit.PIXEL
): LogicalCoordinate {
  validateViewport(viewport);

  const viewX = raw.clientX - viewport.offsetX;
  const viewY = raw.clientY - viewport.offsetY;
  const logicalX = viewX / viewport.zoom;
  const logicalY = viewY / viewport.zoom;
  const x = pxToUnit(logicalX, unit);
  const y = pxToUnit(logicalY, unit);

  return createLogicalCoordinate(x, y, unit);
}

/**
 * تحويل إحداثيات الماوس الخام إلى إحداثيات شبكية
 * (لـ Calc و Base)
 * ⚠️ الإحداثيات خارج الشبكة تُثبَّت بين (0,0) و (maxRow, maxCol)
 * ⚠️ جميع قيم grid يجب أن تكون بالوحدات المنطقية (Logical Pixels)
 * @param raw إحداثيات الماوس الخام
 * @param viewport إعدادات نافذة العرض
 * @param grid إعدادات الشبكة (أبعاد الخلايا والرأس)
 */
export function translateToGrid(
  raw: RawMouseCoords,
  viewport: ViewportConfig,
  grid: GridMapperConfig
): GridCoordinate {
  validateViewport(viewport);

  const viewX = (raw.clientX - viewport.offsetX) / viewport.zoom;
  const viewY = (raw.clientY - viewport.offsetY) / viewport.zoom;
  const gridX = viewX - grid.headerWidth;
  const gridY = viewY - grid.headerHeight;

  let col = Math.max(0, Math.floor(gridX / grid.cellWidth));
  let row = Math.max(0, Math.floor(gridY / grid.cellHeight));

  if (grid.maxRow !== undefined) {
    row = Math.min(row, grid.maxRow);
  }
  if (grid.maxCol !== undefined) {
    col = Math.min(col, grid.maxCol);
  }

  return createGridCoordinate(row, col);
}

/**
 * الدالة الرئيسية لترجمة الإحداثيات حسب النطاق المكتبي
 * (ALGO-SPR-001: translateCoords)
 * @param raw إحداثيات الماوس الخام
 * @param domain النطاق المكتبي (writer, calc, impress, base)
 * @param config إعدادات المترجم الشاملة
 * @returns إحداثيات منطقية مناسبة للنطاق
 */
export function translateCoords(
  raw: RawMouseCoords,
  domain: OfficeDomainValue,
  config: MapperConfig
): SpatialCoordinate {
  switch (domain) {
    case OfficeDomain.CALC:
    case OfficeDomain.BASE: {
      if (!config.grid) {
        throw new Error(`Grid config required for domain: ${domain}`);
      }
      return translateToGrid(raw, config.viewport, config.grid);
    }
    case OfficeDomain.WRITER:
    case OfficeDomain.IMPRESS: {
      const unit = config.unit ?? DOMAIN_DEFAULT_UNIT[domain];
      return translateToLogical(raw, config.viewport, unit);
    }
    default: {
      const _exhaustive: never = domain;
      throw new Error(`Unknown office domain: ${_exhaustive}`);
    }
  }
}

/** الحصول على الوحدة الافتراضية لنطاق مكتبي */
export function getDomainDefaultUnit(domain: OfficeDomainValue): LengthUnitValue {
  return DOMAIN_DEFAULT_UNIT[domain];
}
