/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: evaluator-types.ts
 * 📂 المسار: packages/algorithms/src/formula/evaluator-types.ts
 * 🎯 الهدف الرئيسي: تعريف أنواع وسياق وأخطاء مقيم الصيغ
 * 📋 المعايير: صفر اعتماديات، أنواع صارمة
 * 🏷️ المعرف: ALGO-005-T
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** معالج دالة مخصصة */
export type FunctionHandler = (...args: unknown[]) => unknown;

/** نتيجة التقييم */
export type EvaluationResult = number | string | boolean | null;

/** سياق التقييم - يوفر قيم الخلايا والدوال */
export interface EvaluationContext {
  readonly getCellValue?: (ref: string) => unknown;
  readonly getFunction?: (name: string) => FunctionHandler | undefined;
  readonly maxDepth?: number;
}

/** خطأ تقييم */
export class EvaluationError extends Error {
  constructor(
    message: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'EvaluationError';
  }
}
