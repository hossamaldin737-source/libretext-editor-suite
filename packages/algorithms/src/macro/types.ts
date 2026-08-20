/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/algorithms/src/macro/types.ts
 * 🎯 الهدف الرئيسي: تعريف الواجهات والأنواع لنظام الماكرو والأتمتة
 * 📋 المعايير: التزام بالأنواع الصارمة وعدم وجود اعتماديات خارجية
 * 🧪 الاختبارات: packages/algorithms/tests/macro/macro.test.ts
 * 🏷️ المعرف: ALGO-010
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable Macro Definition & Parameterized Execution Spec
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان عزل المعاملات واستبدال المتغيرات بأمان
 *    2. حماية التنفيذ من الحلقات اللانهائية عبر timeouts وحد أقصى للخطوات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من صحة خطوات الماكرو
 *    - حقول للقراءة فقط (readonly)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/algorithms/src/index.ts
 *    - 📦 التبعيات: packages/algorithms/src/spatial/types.ts
 *    - 📄 مرتبط مباشر: packages/algorithms/src/macro/recorder.ts, packages/algorithms/src/macro/runner.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/macro/macro.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - isMacroDefinition: تحقق نوعي من تعريف الماكرو (#L65)
 *    - isMacroStep: تحقق نوعي من خطوة الماكرو (#L80)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم النطاقات الأربعة: writer, calc, impress, base ونطاق universal
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { LogicalCoordinate, GridCoordinate } from '../spatial/types';

export type MacroDomain = 'writer' | 'calc' | 'impress' | 'base' | 'universal';

export interface MacroParameter {
  readonly name: string;
  readonly type: 'string' | 'number' | 'boolean' | 'coordinate';
  readonly defaultValue?: unknown;
  readonly description?: string;
}

export interface MacroStep {
  readonly commandType: string;
  readonly payload: Record<string, unknown>;
  readonly spatialTarget?: LogicalCoordinate | GridCoordinate;
  readonly timestamp: number;
}

export interface MacroDefinition {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly domain: MacroDomain;
  readonly steps: readonly MacroStep[];
  readonly parameters?: readonly MacroParameter[];
  readonly createdAt: number;
  readonly author?: string;
  readonly version?: number;
}

export interface MacroExecutionOptions {
  readonly parameters?: Record<string, unknown>;
  readonly maxSteps?: number;
  readonly timeoutMs?: number;
  readonly stopOnError?: boolean;
}

export interface MacroExecutionResult {
  readonly success: boolean;
  readonly stepsExecuted: number;
  readonly executionTimeMs: number;
  readonly error?: string;
  readonly modifiedKeys: readonly string[];
  readonly outputs?: Record<string, unknown>;
}

export type RecorderState = 'idle' | 'recording' | 'paused';

export interface RecorderOptions {
  readonly domain?: MacroDomain;
  readonly maxSteps?: number;
}

/**
 * Type Guard للتحقق من صحة تعريف الماكرو
 */
export function isMacroDefinition(value: unknown): value is MacroDefinition {
  if (typeof value !== 'object' || value === null) return false;
  const def = value as Partial<MacroDefinition>;
  return (
    typeof def.id === 'string' &&
    typeof def.name === 'string' &&
    typeof def.domain === 'string' &&
    Array.isArray(def.steps) &&
    typeof def.createdAt === 'number'
  );
}

/**
 * Type Guard للتحقق من صحة خطوة الماكرو
 */
export function isMacroStep(value: unknown): value is MacroStep {
  if (typeof value !== 'object' || value === null) return false;
  const step = value as Partial<MacroStep>;
  return (
    typeof step.commandType === 'string' &&
    typeof step.payload === 'object' &&
    step.payload !== null &&
    typeof step.timestamp === 'number'
  );
}
