/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/adapters/src/shared/index.ts
 * 🎯 الهدف الرئيسي: تصدير الأنواع المشتركة.
 * 🏷️ المعرف: ADAP-006
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type { AdapterOptions, Selection, EditorAdapter, AdapterFactory } from './types';
export {
  toLogical,
  toGrid,
  gridToLogical,
  logicalToGrid,
  type MouseCoords,
  type GridCoordinate,
  type LogicalCoordinate,
  type ViewportConfig,
} from './spatial-adapter';
