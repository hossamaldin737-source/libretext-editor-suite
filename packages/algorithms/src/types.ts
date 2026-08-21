/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/algorithms/src/types.ts
 * 🎯 الهدف الرئيسي: الأنواع المشتركة بين وحدات الخوارزميات
 * 📋 المعايير: صفر اعتماديات، أنواع نقية
 * 🏷️ المعرف: ALGO-000-TYPES
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** توقيت استحقاق الدفعات المالية */
export type PaymentTiming = 'begin' | 'end';

/** مستطيل محاذي للمحاور */
export interface AABB {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly id?: string;
  readonly label?: string;
}

/** نقطة إحداثيات ثنائية الأبعاد */
export interface Point2D {
  readonly x: number;
  readonly y: number;
}

/** تمثيل الرسم البياني للاعتماديات */
export interface DependencyGraphData {
  readonly nodes: readonly string[];
  readonly edges: Readonly<Record<string, readonly string[]>>;
}

/** نتائج تقييم دورة الاعتماديات */
export interface CycleDetectionResult {
  readonly hasCycle: boolean;
  readonly cyclePath: readonly string[] | null;
  readonly errorMessage: string | null;
}

/** التحقق من نوع AABB */
export function isAABB(val: unknown): val is AABB {
  if (typeof val !== 'object' || val === null) return false;
  const obj = val as Record<string, unknown>;
  return (
    typeof obj.x === 'number' &&
    typeof obj.y === 'number' &&
    typeof obj.width === 'number' &&
    typeof obj.height === 'number'
  );
}

/** التحقق من نوع Point2D */
export function isPoint2D(val: unknown): val is Point2D {
  if (typeof val !== 'object' || val === null) return false;
  const obj = val as Record<string, unknown>;
  return typeof obj.x === 'number' && typeof obj.y === 'number';
}
