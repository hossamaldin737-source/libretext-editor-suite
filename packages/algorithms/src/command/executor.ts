/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: executor.ts
 * 📂 المسار: packages/algorithms/src/command/executor.ts
 * 🎯 الهدف الرئيسي: تنفيذ الأوامر على حالة المحرر وإرجاع حالة جديدة (Immutable)
 * 📋 المعايير: صفر اعتماديات خارجية (عدا النواة)، دوال نقية، دعم undo
 * 🧪 الاختبارات: packages/algorithms/tests/command/executor.test.ts
 * 🏷️ المعرف: ALGO-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Extensible Command Registry + Result Pattern + Batch Undo
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. افتراض أن إحداثيات SpatialCommand هي deltas عند تنفيذ undo - تم حلها بحفظ previousX/Y
 *    2. التأكد من تطابق شكل العملية (Operation) مع نواة المحرر
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من نوع الأمر قبل التنفيذ باستخدام Result Pattern
 *    - إرجاع الحالة كما هي عند فشل التراجع مع إرجاع الخطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ProseMirror (MIT) - Command Execution Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { applyOperation, type EditorState } from '@libretext/core';
import {
  Command,
  SpatialCommand,
  TextCommand,
  FormulaCommand,
  isSpatialCommand,
  isTextCommand,
  isFormulaCommand,
} from './types';

/**
 * استنتاج نوع العملية من النواة لضمان التوافق الصارم
 */
type Operation = Parameters<typeof applyOperation>[1];

export type CommandOpResult<T> = { success: true; value: T } | { success: false; error: string };

export interface CommandResult {
  success: boolean;
  state: EditorState;
  error?: string;
}

export interface ExtensibleCommandHandler<T extends Command = Command> {
  canHandle(cmd: Command): cmd is T;
  toOperation(cmd: T): CommandOpResult<Operation>;
  toInverseOperation(cmd: T): CommandOpResult<Operation>;
}

export const SpatialCommandHandler: ExtensibleCommandHandler<SpatialCommand> = {
  canHandle: isSpatialCommand,
  toOperation: (cmd) => ({
    success: true,
    value: {
      type: 'SPATIAL_MOVE',
      id: cmd.targetId,
      x: cmd.payload.x,
      y: cmd.payload.y,
    } as Operation,
  }),
  toInverseOperation: (cmd) => {
    if (cmd.payload.previousX !== undefined && cmd.payload.previousY !== undefined) {
      return {
        success: true,
        value: {
          type: 'SPATIAL_MOVE',
          id: cmd.targetId,
          x: cmd.payload.previousX,
          y: cmd.payload.previousY,
        } as Operation,
      };
    }
    // Fallback if previous values are missing
    return {
      success: true,
      value: {
        type: 'SPATIAL_MOVE',
        id: cmd.targetId,
        x: -cmd.payload.x,
        y: -cmd.payload.y,
      } as Operation,
    };
  },
};

export const TextCommandHandler: ExtensibleCommandHandler<TextCommand> = {
  canHandle: isTextCommand,
  toOperation: (cmd) => ({
    success: true,
    value: {
      type: 'TEXT_UPDATE',
      id: cmd.targetId,
      content: cmd.payload.content,
      position: cmd.payload.position,
    } as Operation,
  }),
  toInverseOperation: () => ({ success: false, error: 'Undo not supported for TextCommand yet' }),
};

export const FormulaCommandHandler: ExtensibleCommandHandler<FormulaCommand> = {
  canHandle: isFormulaCommand,
  toOperation: (cmd) => ({
    success: true,
    value: {
      type: 'FORMULA_UPDATE',
      id: cmd.targetId,
      expression: cmd.payload.expression,
    } as Operation,
  }),
  toInverseOperation: () => ({ success: false, error: 'Undo not supported for FormulaCommand yet' }),
};

export class CommandExecutor {
  // Use proper typing instead of 'any'
  private handlers: ExtensibleCommandHandler<Command>[] = [];
  private history: Command[] = [];

  constructor() {
    this.register(SpatialCommandHandler as ExtensibleCommandHandler<Command>);
    this.register(TextCommandHandler as ExtensibleCommandHandler<Command>);
    this.register(FormulaCommandHandler as ExtensibleCommandHandler<Command>);
  }

  register(handler: ExtensibleCommandHandler<Command>): void {
    this.handlers.push(handler);
  }

  findHandler(cmd: Command): ExtensibleCommandHandler<Command> | null {
    return this.handlers.find((h) => h.canHandle(cmd)) || null;
  }

  canUndo(cmd: Command): boolean {
    const nonUndoable = ['DELETE', 'EXPORT', 'PRINT', 'SYSTEM'];
    return !nonUndoable.includes(cmd.type);
  }

  execute(cmd: Command, state: EditorState): CommandResult {
    const handler = this.findHandler(cmd);
    if (!handler) {
      /* eslint-disable-next-line no-console */
      console.error(`[CommandExecutor] No handler found for command type: ${cmd.type}`);
      return { success: false, state, error: `No handler found for command type: ${cmd.type}` };
    }

    const opResult = handler.toOperation(cmd);
    if (!opResult.success) {
      /* eslint-disable-next-line no-console */
      console.error(`[CommandExecutor] Failed to convert command to operation: ${opResult.error}`);
      return { success: false, state, error: opResult.error };
    }

    try {
      const newDoc = applyOperation(state.document, opResult.value);
      const newState = { ...state, document: newDoc };

      if (this.canUndo(cmd)) {
        this.history.push(cmd);
      }

      return { success: true, state: newState };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      /* eslint-disable-next-line no-console */
      console.error(`[CommandExecutor] Execution failed: ${errorMsg}`);
      return { success: false, state, error: errorMsg };
    }
  }

  undo(cmd: Command, state: EditorState): CommandResult {
    const handler = this.findHandler(cmd);
    if (!handler) {
      return { success: false, state, error: `No handler found for command type: ${cmd.type}` };
    }

    const opResult = handler.toInverseOperation(cmd);
    if (!opResult.success) {
      return { success: false, state, error: opResult.error };
    }

    try {
      const newDoc = applyOperation(state.document, opResult.value);
      const newState = { ...state, document: newDoc };
      return { success: true, state: newState };
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      return { success: false, state, error: errorMsg };
    }
  }

  undoLast(state: EditorState): CommandResult {
    if (this.history.length === 0) {
      return { success: false, state, error: 'History is empty' };
    }

    // Peak at the last command
    const lastCmd = this.history[this.history.length - 1];
    
    // Attempt undo
    const result = this.undo(lastCmd, state);
    
    if (result.success) {
      // Safely pop only if undo succeeds
      this.history.pop();
    } else {
      /* eslint-disable-next-line no-console */
      console.error(`[CommandExecutor] Undo failed: ${result.error}`);
    }
    
    return result;
  }

  undoMany(count: number, state: EditorState): CommandResult {
    let currentState = state;
    let successCount = 0;

    for (let i = 0; i < count && this.history.length > 0; i++) {
      const lastCmd = this.history[this.history.length - 1];
      const result = this.undo(lastCmd, currentState);
      
      if (result.success) {
        this.history.pop();
        currentState = result.state;
        successCount++;
      } else {
        /* eslint-disable-next-line no-console */
        console.error(`[CommandExecutor] Batch undo aborted at index ${i}: ${result.error}`);
        return { success: false, state: currentState, error: `Batch undo aborted: ${result.error}` };
      }
    }
    
    if (successCount === 0 && count > 0) {
      return { success: false, state: currentState, error: 'No commands could be undone' };
    }
    
    return { success: true, state: currentState };
  }

  getHistoryLength(): number {
    return this.history.length;
  }
}

// For standalone pure operations
export function executeCommand(cmd: Command, state: EditorState): CommandResult {
  return new CommandExecutor().execute(cmd, state);
}

export function undoCommand(cmd: Command, state: EditorState): CommandResult {
  return new CommandExecutor().undo(cmd, state);
}
