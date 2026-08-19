/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/algorithms/src/spatial/types.ts
 * 🎯 الهدف الرئيسي: تعريف أنواع البيانات للإحداثيات المكانية (Logical, Grid)
 * 📋 المعايير: صفر اعتماديات خارجية، استخدام Readonly
 * 🧪 الاختبارات: packages/algorithms/tests/spatial/types.test.ts
 * 🏷️ المعرف: ALGO-007
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type Branding / Tagging for Coordinate Systems
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بـ Readonly لجميع خصائص الإحداثيات
 *    2. التمييز بين الإحداثيات المنطقية (Impress) والشبكية (Calc/Base)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards لتمييز نوع الإحداثية
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * إحداثيات ديكارتية منطقية (LogicalCoordinate) تستخدم بشكل رئيسي في Impress (العروض).
 */
export interface LogicalCoordinate {
  readonly type: 'logical';
  readonly x: number;
  readonly y: number;
  readonly unit?: 'px' | 'cm' | 'inch' | 'pt';
}

/**
 * إحداثيات شبكية (GridCoordinate) تستخدم بشكل رئيسي في Calc (الجداول) و Base (قواعد البيانات).
 */
export interface GridCoordinate {
  readonly type: 'grid';
  readonly row: number;
  readonly col: number;
}

/**
 * النوع الشامل للإحداثيات المكانية
 */
export type SpatialCoordinate = LogicalCoordinate | GridCoordinate;

/**
 * إنشاء إحداثية ديكارتية
 */
export function createLogicalCoordinate(x: number, y: number, unit: LogicalCoordinate['unit'] = 'px'): LogicalCoordinate {
  return { type: 'logical', x, y, unit };
}

/**
 * إنشاء إحداثية شبكية
 */
export function createGridCoordinate(row: number, col: number): GridCoordinate {
  return { type: 'grid', row, col };
}

/** Type Guard for LogicalCoordinate */
export function isLogicalCoordinate(coord: SpatialCoordinate): coord is LogicalCoordinate {
  return coord.type === 'logical';
}

/** Type Guard for GridCoordinate */
export function isGridCoordinate(coord: SpatialCoordinate): coord is GridCoordinate {
  return coord.type === 'grid';
}

/**
 * تحويل من إحداثية شبكية إلى اسم مرجعي (مثال: {row: 0, col: 0} -> "A1")
 */
export function gridToLabel(coord: GridCoordinate): string {
  let tempCol = coord.col;
  let colLabel = '';
  while (tempCol >= 0) {
    colLabel = String.fromCharCode(65 + (tempCol % 26)) + colLabel;
    tempCol = Math.floor(tempCol / 26) - 1;
  }
  return `${colLabel}${coord.row + 1}`;
}

/**
 * تحويل من اسم مرجعي إلى إحداثية شبكية (مثال: "A1" -> {row: 0, col: 0})
 */
export function labelToGrid(label: string): GridCoordinate {
  const match = label.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid grid label format: ${label}`);
  }
  
  const colStr = match[1]!.toUpperCase();
  const rowStr = match[2]!;
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  
  // Convert from 1-based indexing to 0-based indexing
  return createGridCoordinate(parseInt(rowStr, 10) - 1, col - 1);
}
