/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: types.ts
  * 📂 المسار: packages/algorithms/src/spatial/types.ts
  * 🎯 الهدف الرئيسي: تعريف أنواع الإحداثيات المكانية (LogicalCoordinate و GridCoordinate)
  * 📋 المعايير: صفر اعتماديات، أنواع نقية، دعم الوحدات المتعددة
  * 🧪 الاختبارات: packages/algorithms/tests/spatial/types.test.ts
  * 🏷️ المعرف: ALGO-007
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 آخر تحديث: 2026-08-19 (v3: Leading Zeros + Multi-Letter Columns)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Discriminated Unions + Unit System + Immutable Coordinates
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. الخلط بين الإحداثيات الديكارتية والشبكية
  *    2. الإحداثيات السالبة (خارج حدود الصفحة) - مسموحة لـ Logical فقط
  *    3. GridCoordinate تستخدم فهرسة صفرية (0-indexed): row=0, col=0
  *    4. التحويل إلى Label يضيف +1 للصف فقط: row=0 → "A1"
  *    5. الأصفار البادئة مسموحة: "A01" تعادل "A1"
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - استخدام readonly لجميع الخصائص
  *    - Type Guards للتحقق من نوع الإحداثيات
  *    - Validation للإحداثيات الشبكية (رفض القيم السالبة)
  *    - Validation لتسميات الخلايا
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: لا توجد
  * ═══════════════════════════════════════════════════════════════════════════
  */

/** وحدات الطول المدعومة */
export const LengthUnit = {
  PIXEL: 'px',
  CENTIMETER: 'cm',
  INCH: 'in',
  POINT: 'pt',
  MILLIMETER: 'mm'
} as const;

export type LengthUnitValue = typeof LengthUnit[keyof typeof LengthUnit];

/** إحداثيات ديكارتية (لـ Impress والعروض التقديمية) */
export interface LogicalCoordinate {
  readonly type: 'logical';
  readonly x: number;
  readonly y: number;
  readonly unit: LengthUnitValue;
}

/**
 * إحداثيات شبكية (لـ Calc و Base)
 * ⚠️ ملاحظة: row و col صفريا الأساس (0-indexed)
 * - row=0 يعني الصف الأول
 * - col=0 يعني العمود الأول (A)
 */
export interface GridCoordinate {
  readonly type: 'grid';
  readonly row: number;
  readonly col: number;
}

/** اتحاد أنواع الإحداثيات */
export type SpatialCoordinate = LogicalCoordinate | GridCoordinate;

/** إعدادات الشبكة */
export interface GridConfig {
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly unit: LengthUnitValue;
}

/** نطاق إحداثيات (Bounding Box) */
export interface BoundingBox {
  readonly type: 'bounding-box';
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly unit: LengthUnitValue;
}

// --- Type Guards ---

export function isLogicalCoordinate(coord: SpatialCoordinate): coord is LogicalCoordinate {
  return coord.type === 'logical';
}

export function isGridCoordinate(coord: SpatialCoordinate): coord is GridCoordinate {
  return coord.type === 'grid';
}

// --- Factory Functions (ALGO-SPR-002, ALGO-SPR-003) ---

/**
 * إنشاء إحداثيات ديكارتية
 * ⚠️ ملاحظة: القيم السالبة مسموحة (عناصر خارج حدود الصفحة)
 */
export function createLogicalCoordinate(
  x: number,
  y: number,
  unit: LengthUnitValue = LengthUnit.PIXEL
): LogicalCoordinate {
  return { type: 'logical', x, y, unit };
}

/**
 * إنشاء إحداثيات شبكية
 * @throws Error إذا كانت row أو col سالبة
 * ⚠️ ملاحظة: row و col صفريا الأساس (0-indexed)
 */
export function createGridCoordinate(row: number, col: number): GridCoordinate {
  if (row < 0) {
    throw new Error(`Row cannot be negative: ${row}`);
  }
  if (col < 0) {
    throw new Error(`Column cannot be negative: ${col}`);
  }
  return { type: 'grid', row, col };
}

// --- Conversion Functions ---

/**
 * تحويل GridCoordinate إلى تسمية خلية (A1, B2, etc.)
 * ⚠️ ملاحظة: row=0 → "A1"، row=1 → "A2" (يضيف +1 للصف)
 */
export function gridToLabel(coord: GridCoordinate): string {
  const colLabel = indexToColumnLabel(coord.col);
  return `${colLabel}${coord.row + 1}`;
}

/**
 * تحويل تسمية خلية إلى GridCoordinate
 * @throws Error إذا كانت التسمية غير صالحة أو رقم الصف أقل من 1
 * ⚠️ ملاحظة: "A1" → row=0، "A2" → row=1 (يطرح -1 من الصف)
 * ⚠️ ملاحظة: الأصفار البادئة مسموحة (مثال: "A01" تعادل "A1")
 */
export function labelToGrid(label: string): GridCoordinate {
  const match = label.match(/^([A-Z]+)(\d+)$/i);
  if (!match) {
    throw new Error(`Invalid cell label format: ${label}`);
  }
  
  const colLabel = match[1]!.toUpperCase();
  const rowStr = match[2]!;
  const row = parseInt(rowStr, 10);
  
  // التحويل من 1-indexed إلى 0-indexed
  const zeroBasedRow = row - 1;
  if (zeroBasedRow < 0) {
    throw new Error(`Row number must be at least 1, got: ${row}`);
  }
  
  const col = columnLabelToIndex(colLabel);
  return { type: 'grid', row: zeroBasedRow, col };
}

/**
 * التحقق من صحة تسمية خلية (الشكل فقط، ليس الصلاحية الدلالية)
 * ⚠️ ملاحظة: تتحقق من الشكل فقط (Format)، ليس الصلاحية الدلالية (Semantic Validity)
 * مثال: "A0" ستُعتبر صالحة شكلًا، لكن labelToGrid سترمي خطأ
 */
export function isValidCellLabel(label: string): boolean {
  return /^[A-Z]+\d+$/i.test(label);
}

/**
 * تحويل فهرس العمود إلى تسمية (0=A, 1=B, ..., 25=Z, 26=AA)
 * ⚠️ ملاحظة: يستخدم bijective base-26 (لا يوجد صفر)
 */
function indexToColumnLabel(index: number): string {
  if (index < 0) {
    throw new Error(`Column index cannot be negative: ${index}`);
  }
  let label = '';
  let idx = index;
  while (idx >= 0) {
    label = String.fromCharCode((idx % 26) + 65) + label;
    idx = Math.floor(idx / 26) - 1;
  }
  return label;
}

/**
 * تحويل تسمية العمود إلى فهرس (A=0, B=1, ..., Z=25, AA=26)
 * ⚠️ ملاحظة: A=0 لأننا نستخدم فهرسة صفرية (0-indexed)
 */
function columnLabelToIndex(label: string): number {
  let index = 0;
  for (let i = 0; i < label.length; i++) {
    index = index * 26 + (label.charCodeAt(i) - 64);
  }
  return index - 1;
}
