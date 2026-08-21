/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: context.ts
 * 📂 المسار: packages/algorithms/src/simulation/context.ts
 * 🎯 الهدف الرئيسي: تعريف سياق المحاكاة (SimulationContext) koji يمثل
 *    بيئة تنفيذ الأوامر المكانية والنصوصية بشكل معزول عن DOM.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية.
 *    - جميع الخصائص readonly (Immutable).
 *    - دعم التوسيع عبر واجهات فرعية.
 * 🧪 الاختبارات: packages/algorithms/tests/simulation/context.test.ts
 * 🏷️ المعرف: ALGO-020
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Simulation Context — بيئة محاكاة نقية غير قابلة للتغيير.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SimulationContext {
  readonly cursorPosition: { readonly x: number; readonly y: number };
  readonly selectedRange: string;
  readonly activeFormula?: string;
  readonly domain: 'writer' | 'calc' | 'impress' | 'base';
}

export function createSimulationContext(
  domain: SimulationContext['domain'] = 'writer',
): SimulationContext {
  return {
    cursorPosition: { x: 0, y: 0 },
    selectedRange: '',
    domain,
  };
}

export function moveCursor(ctx: SimulationContext, dx: number, dy: number): SimulationContext {
  return {
    ...ctx,
    cursorPosition: {
      x: ctx.cursorPosition.x + dx,
      y: ctx.cursorPosition.y + dy,
    },
  };
}

export function selectRange(ctx: SimulationContext, range: string): SimulationContext {
  return { ...ctx, selectedRange: range };
}

export function setFormula(ctx: SimulationContext, formula: string): SimulationContext {
  return { ...ctx, activeFormula: formula };
}
