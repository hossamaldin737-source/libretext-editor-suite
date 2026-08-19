/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: history.ts
 * 📂 المسار: packages/core/src/state/history.ts
 * 🎯 الهدف الرئيسي: إدارة سجل التراجع والإعادة بشكل مستقل
 *    مع دعم الحد الأقصى للسجل ومسح المستقبل.
 * 📋 المعايير:
 *    - يجب أن يدعم التراجع والإعادة.
 *    - يجب أن يحدد حجم السجل الأقصى.
 *    - يجب أن يدعم مسح السجل.
 * 🧪 الاختبارات:
 *    - packages/core/tests/state/history.test.ts
 *    - اختبار التراجع
 *    - اختبار الإعادة
 *    - اختبار الحد الأقصى
 * 🏷️ المعرف: CORE-006
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bounded History Stack — مكدس سجل محدود الحجم.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. مسح future عند إضافة لقطة جديدة.
 *    2. عدم تجاوز الحد الأقصى للسجل.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الفراغ قبل التراجع/الإعادة.
 *    - نسخ المصفوفات بدلاً من التعديل المباشر.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {DocNode} from '../ast/types';

export interface HistorySnapshot {
  readonly document: DocNode;
  readonly timestamp: number;
}

export interface HistoryState {
  readonly past: readonly HistorySnapshot[];
  readonly future: readonly HistorySnapshot[];
  readonly maxSize: number;
}

/**
 * إنشاء حالة تاريخ فارغة.
 */
export function createHistory(maxSize: number = 100): HistoryState {
  return {
    past: [],
    future: [],
    maxSize,
  };
}

/**
 * تسجيل لقطة جديدة.
 */
export function pushSnapshot(state: HistoryState, snapshot: HistorySnapshot): HistoryState {
  const newPast = [...state.past, snapshot];
  if (newPast.length > state.maxSize) {
    newPast.shift();
  }
  return {
    ...state,
    past: newPast,
    future: [],
  };
}

/**
 * التراجع.
 */
export function popUndo(state: HistoryState): {
  snapshot: HistorySnapshot | null;
  newState: HistoryState;
} {
  if (state.past.length === 0) {
    return {snapshot: null, newState: state};
  }

  const newPast = [...state.past];
  const snapshot = newPast.pop()!;

  return {
    snapshot,
    newState: {
      ...state,
      past: newPast,
      future: [...state.future, snapshot],
    },
  };
}

/**
 * الإعادة.
 */
export function popRedo(state: HistoryState): {
  snapshot: HistorySnapshot | null;
  newState: HistoryState;
} {
  if (state.future.length === 0) {
    return {snapshot: null, newState: state};
  }

  const newFuture = [...state.future];
  const snapshot = newFuture.shift()!;

  return {
    snapshot,
    newState: {
      ...state,
      past: [...state.past, snapshot],
      future: newFuture,
    },
  };
}

/**
 * مسح السجل بالكامل.
 */
export function clearHistory(state: HistoryState): HistoryState {
  return {
    ...state,
    past: [],
    future: [],
  };
}
