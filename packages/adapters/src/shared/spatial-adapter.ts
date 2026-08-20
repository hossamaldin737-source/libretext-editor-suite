/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: spatial-adapter.ts
 * 📂 المسار: packages/adapters/src/shared/spatial-adapter.ts
 * 🎯 الهدف الرئيسي: محول إحداثيات الماوس الخام (clientX, clientY) إلى
 *    إحداثيات منطقية (GridCoordinate / LogicalCoordinate)usable by commands.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية.
 *    - دوال نقية فقط (لا تأثيرات جانبية).
 *    - كل دالة أقل من 20 سطر.
 * 🧪 الاختبارات: packages/adapters/tests/spatial-adapter.test.ts
 * 🏷️ المعرف: ADAP-012
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Side-Effect Spatial Coordinate Adapter
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface MouseCoords {
  readonly clientX: number;
  readonly clientY: number;
}

export interface GridCoordinate {
  readonly row: number;
  readonly col: number;
}

export interface LogicalCoordinate {
  readonly type: 'logical';
  readonly x: number;
  readonly y: number;
  readonly unit: 'px' | 'cm' | 'inch' | 'pt';
}

export interface ViewportConfig {
  readonly offsetX: number;
  readonly offsetY: number;
  readonly zoom: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
}

const DEFAULT_VIEWPORT: ViewportConfig = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
  cellWidth: 80,
  cellHeight: 24,
};

export function toLogical(
  mouse: MouseCoords,
  viewport: ViewportConfig = DEFAULT_VIEWPORT,
): LogicalCoordinate {
  return {
    type: 'logical',
    x: (mouse.clientX - viewport.offsetX) / viewport.zoom,
    y: (mouse.clientY - viewport.offsetY) / viewport.zoom,
    unit: 'px',
  };
}

export function toGrid(
  mouse: MouseCoords,
  viewport: ViewportConfig = DEFAULT_VIEWPORT,
): GridCoordinate {
  const lx = (mouse.clientX - viewport.offsetX) / viewport.zoom;
  const ly = (mouse.clientY - viewport.offsetY) / viewport.zoom;
  return {
    row: Math.floor(ly / viewport.cellHeight),
    col: Math.floor(lx / viewport.cellWidth),
  };
}

export function gridToLogical(
  grid: GridCoordinate,
  viewport: ViewportConfig = DEFAULT_VIEWPORT,
): LogicalCoordinate {
  return {
    type: 'logical',
    x: grid.col * viewport.cellWidth,
    y: grid.row * viewport.cellHeight,
    unit: 'px',
  };
}

export function logicalToGrid(
  logical: LogicalCoordinate,
  viewport: ViewportConfig = DEFAULT_VIEWPORT,
): GridCoordinate {
  return {
    row: Math.floor(logical.y / viewport.cellHeight),
    col: Math.floor(logical.x / viewport.cellWidth),
  };
}
