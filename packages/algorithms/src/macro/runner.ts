/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: runner.ts
 * 📂 المسار: packages/algorithms/src/macro/runner.ts
 * 🎯 الهدف الرئيسي: محرك تشغيل الماكرو (Macro Runner) لإعادة تنفيذ الأوامر بأمان
 * 📋 المعايير: دعم تمرير المعاملات، حماية من الأخطاء، قيود زمنية
 * 🧪 الاختبارات: packages/algorithms/tests/macro/macro.test.ts
 * 🏷️ المعرف: ALGO-012
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Parameterized Command Replay with Template Interpolation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. فحص التراجع وسلامة المعاملات قبل التطبيق
 *    2. ضمان استبدال آمن للمتغيرات (Regex substitution)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  MacroDefinition,
  MacroExecutionOptions,
  MacroExecutionResult,
  MacroStep,
} from './types';

export type CommandDispatcher = (
  commandType: string,
  payload: Record<string, unknown>,
  spatialTarget?: MacroStep['spatialTarget']
) => boolean | Promise<boolean>;

export class MacroRunner {
  private interpolatePayload(
    payload: Record<string, unknown>,
    params: Record<string, unknown>
  ): Record<string, unknown> {
    const raw = JSON.stringify(payload);
    const replaced = raw.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (_, key) => {
      if (key in params) {
        return String(params[key]);
      }
      return `{{${key}}}`;
    });
    try {
      return JSON.parse(replaced);
    } catch {
      return payload;
    }
  }

  async run(
    macro: MacroDefinition,
    dispatcher: CommandDispatcher,
    options: MacroExecutionOptions = {}
  ): Promise<MacroExecutionResult> {
    const startTime = Date.now();
    const maxSteps = options.maxSteps ?? 1000;
    const timeoutMs = options.timeoutMs ?? 10000;
    const stopOnError = options.stopOnError ?? true;
    const params = options.parameters ?? {};

    let stepsExecuted = 0;
    const modifiedKeys: string[] = [];

    for (const step of macro.steps) {
      if (stepsExecuted >= maxSteps) {
        return {
          success: false,
          stepsExecuted,
          executionTimeMs: Date.now() - startTime,
          error: `Execution exceeded max steps limit (${maxSteps})`,
          modifiedKeys,
        };
      }

      if (Date.now() - startTime > timeoutMs) {
        return {
          success: false,
          stepsExecuted,
          executionTimeMs: Date.now() - startTime,
          error: `Execution timed out after ${timeoutMs}ms`,
          modifiedKeys,
        };
      }

      const resolvedPayload = this.interpolatePayload(step.payload, params);

      try {
        const result = await dispatcher(step.commandType, resolvedPayload, step.spatialTarget);
        if (!result && stopOnError) {
          return {
            success: false,
            stepsExecuted,
            executionTimeMs: Date.now() - startTime,
            error: `Step ${stepsExecuted + 1} (${step.commandType}) returned failure`,
            modifiedKeys,
          };
        }
        stepsExecuted++;
        modifiedKeys.push(step.commandType);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        if (stopOnError) {
          return {
            success: false,
            stepsExecuted,
            executionTimeMs: Date.now() - startTime,
            error: `Error at step ${stepsExecuted + 1}: ${message}`,
            modifiedKeys,
          };
        }
      }
    }

    return {
      success: true,
      stepsExecuted,
      executionTimeMs: Date.now() - startTime,
      modifiedKeys,
    };
  }
}
