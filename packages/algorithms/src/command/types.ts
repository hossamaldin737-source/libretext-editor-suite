/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/algorithms/src/command/types.ts
 * 🎯 الهدف الرئيسي: تعريف الأنواع الأساسية لنمط الأوامر (Command Pattern)
 * 📋 المعايير: صفر اعتماديات، أنواع نقية، دعم SpatialCommand و TextCommand
 * 🧪 الاختبارات: packages/algorithms/tests/command/types.test.ts
 * 🏷️ المعرف: ALGO-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Discriminated Unions + Strict Type Guards for Command Routing
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجاوز حجم الـ Payload عن الحد المسموح في الذاكرة
 *    2. عدم تمييز نوع الأمر بشكل صحيح مما يسبب أخطاء في الـ Executor
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام readonly لجميع الخصائص
 *    - Type Guards إلزامية للتحقق من نوع الأمر قبل التنفيذ
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ProseMirror (MIT) - Command Pattern Inspiration
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * أنواع الأوامر المدعومة في النظام
 * Supported command types in the system
 */
export const CommandType = {
  SPATIAL: 'spatial',
  TEXT: 'text',
  FORMULA: 'formula',
  SYSTEM: 'system',
} as const;

export type CommandTypeValue = (typeof CommandType)[keyof typeof CommandType];

/**
 * الحمولة الأساسية لأي أمر
 * Base payload for any command
 */
export interface BasePayload {
  readonly timestamp: number;
  readonly source?: string;
}

/**
 * أمر مكاني - يتعلق بالإحداثيات والتحريك
 * Spatial Command - Coordinates and movement
 */
export interface SpatialCommand {
  readonly type: typeof CommandType.SPATIAL;
  readonly targetId: string;
  readonly payload: BasePayload & {
    readonly x: number;
    readonly y: number;
    readonly previousX?: number;
    readonly previousY?: number;
    readonly grid?: { readonly row: number; readonly col: number };
  };
}

/**
 * أمر نصي - يتعلق بتحرير المحتوى
 * Text Command - Content editing
 */
export interface TextCommand {
  readonly type: typeof CommandType.TEXT;
  readonly targetId: string;
  readonly payload: BasePayload & {
    readonly content: string;
    readonly position: number;
  };
}

/**
 * أمر صيغة - يتعلق بالحسابات
 * Formula Command - Calculations
 */
export interface FormulaCommand {
  readonly type: typeof CommandType.FORMULA;
  readonly targetId: string;
  readonly payload: BasePayload & {
    readonly expression: string;
    readonly result?: unknown;
  };
}

/**
 * اتحاد جميع الأوامر
 * Union of all commands
 */
export type Command = SpatialCommand | TextCommand | FormulaCommand;

/**
 * نتيجة تنفيذ الأمر
 * Command execution result
 */
export interface CommandResult {
  readonly success: boolean;
  readonly error?: string;
  readonly stateChanged: boolean;
}

/**
 * معالج الأوامر
 * Command Handler signature
 */
export type CommandHandler<T extends Command = Command> = (
  cmd: T,
) => Promise<CommandResult> | CommandResult;

// --- Type Guards (Defensive Coding) ---

export function isSpatialCommand(cmd: Command): cmd is SpatialCommand {
  return cmd.type === CommandType.SPATIAL;
}

export function isTextCommand(cmd: Command): cmd is TextCommand {
  return cmd.type === CommandType.TEXT;
}

export function isFormulaCommand(cmd: Command): cmd is FormulaCommand {
  return cmd.type === CommandType.FORMULA;
}
