/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: simulator.ts
 * 📂 المسار: packages/algorithms/src/simulation/simulator.ts
 * 🎯 الهدف الرئيسي: محاكاة تنفيذ أوامر مكانية ونصوصية وصيغية
 *    على بيئة معزولة (بدون DOM) مع تتبع كل خطوة بشكل نقية.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية.
 *    - كل خطوة محاكاة هي function نقية (تُرجع سياقاً جديداً).
 *    - دعم تشغيل متسلسل لعدة أوامر.
 * 🧪 الاختبارات: packages/algorithms/tests/simulation/simulator.test.ts
 * 🏷️ المعرف: ALGO-021
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure Simulation Runner — تنفيذ أوامر نقية على سياق غير قابل للتغيير.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  type SimulationContext,
  moveCursor,
  selectRange,
  setFormula,
} from './context';

export type SimulationAction =
  | {readonly type: 'MOVE'; readonly dx: number; readonly dy: number}
  | {readonly type: 'SELECT'; readonly range: string}
  | {readonly type: 'EVALUATE'; readonly formula: string};

function applyAction(ctx: SimulationContext, action: SimulationAction): SimulationContext {
  switch (action.type) {
    case 'MOVE':
      return moveCursor(ctx, action.dx, action.dy);
    case 'SELECT':
      return selectRange(ctx, action.range);
    case 'EVALUATE':
      return setFormula(ctx, action.formula);
  }
}

export function simulate(
  initial: SimulationContext,
  actions: ReadonlyArray<SimulationAction>,
): SimulationContext {
  let ctx = initial;
  for (const action of actions) {
    ctx = applyAction(ctx, action);
  }
  return ctx;
}

export function simulateSingle(
  ctx: SimulationContext,
  action: SimulationAction,
): SimulationContext {
  return applyAction(ctx, action);
}
