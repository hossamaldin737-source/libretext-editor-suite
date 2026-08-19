/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: executor.ts
 * 📂 المسار: packages/algorithms/src/command/executor.ts
 * 🎯 الهدف الرئيسي: تنفيذ الأوامر على حالة المحرر وإرجاع حالة جديدة (Immutable)
 *    عبر تحويل كل أمر إلى عملية نواة (Operation) وتطبيقها على المستند الفعلي.
 * 📋 المعايير: صفر اعتماديات خارجية (عدا النواة)، دوال نقية، دعم undo
 * 🧪 الاختبارات: packages/algorithms/tests/command/executor.test.ts
 * 🏷️ المعرف: ALGO-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Extensible Command Registry + Result Pattern + Batch Undo
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يجب أن تكون الحمولة متوافقة تماماً مع عمليات النواة (Discriminated Union).
 *    2. الحالة المُستلمة هي FullEditorState (state.editor.document) وليست EditorState.
 *    3. لا يجب تحميل history محلياً عند التراجع — التراجع يعكس العملية مباشرة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من نوع الأمر قبل التنفيذ باستخدام Result Pattern.
 *    - إرجاع الحالة كما هي عند فشل التراجع مع إرجاع الخطأ.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ProseMirror (MIT) - Command Execution Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {applyOperation} from '@libretext/core';
import type {FullEditorState, NodeId, Operation} from '@libretext/core';
import {
  type Command,
  type SpatialCommand,
  type TextCommand,
  type FormulaCommand,
  isSpatialCommand,
  isTextCommand,
  isFormulaCommand,
} from './types';

/**
 * نتيجة تحويل أمر إلى عملية نواة.
 */
export type CommandOpResult<T> = {success: true; value: T} | {success: false; error: string};

/**
 * نتيجة تنفيذ أمر على الحالة.
 */
export interface CommandResult {
  readonly success: boolean;
  readonly state: FullEditorState;
  readonly error?: string;
}

/**
 * معالج قابل للتوسع يحوّل الأمر إلى عملية نواة وعملية عكسية.
 */
export interface ExtensibleCommandHandler<T extends Command = Command> {
  canHandle(cmd: Command): cmd is T;
  toOperation(cmd: T): CommandOpResult<Operation>;
  toInverseOperation(cmd: T): CommandOpResult<Operation>;
}

function spatialOperation(targetId: string, x: number, y: number): Operation {
  return {
    type: 'spatial-move',
    targetId: targetId as NodeId,
    payload: {x, y},
  };
}

export const SpatialCommandHandler: ExtensibleCommandHandler<SpatialCommand> = {
  canHandle: isSpatialCommand,
  toOperation: (cmd) => ({
    success: true,
    value: spatialOperation(cmd.targetId, cmd.payload.x, cmd.payload.y),
  }),
  toInverseOperation: (cmd) => {
    if (cmd.payload.previousX !== undefined && cmd.payload.previousY !== undefined) {
      return {
        success: true,
        value: spatialOperation(cmd.targetId, cmd.payload.previousX, cmd.payload.previousY),
      };
    }
    return {
      success: true,
      value: spatialOperation(cmd.targetId, -cmd.payload.x, -cmd.payload.y),
    };
  },
};

export const TextCommandHandler: ExtensibleCommandHandler<TextCommand> = {
  canHandle: isTextCommand,
  toOperation: (cmd) => ({
    success: true,
    value: {
      type: 'text-update',
      targetId: cmd.targetId as NodeId,
      payload: {content: cmd.payload.content},
    },
  }),
  toInverseOperation: () => ({success: false, error: 'Undo not supported for TextCommand yet'}),
};

export const FormulaCommandHandler: ExtensibleCommandHandler<FormulaCommand> = {
  canHandle: isFormulaCommand,
  toOperation: (cmd) => ({
    success: true,
    value: {
      type: 'formula-update',
      targetId: cmd.targetId as NodeId,
      payload: {expression: cmd.payload.expression},
    },
  }),
  toInverseOperation: () => ({success: false, error: 'Undo not supported for FormulaCommand yet'}),
};

export class CommandExecutor {
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
    const nonUndoable: readonly string[] = ['system'];
    return !nonUndoable.includes(cmd.type);
  }

  execute(cmd: Command, state: FullEditorState): CommandResult {
    const handler = this.findHandler(cmd);
    if (!handler) {
      return {success: false, state, error: `No handler found for command type: ${cmd.type}`};
    }

    const opResult = handler.toOperation(cmd);
    if (!opResult.success) {
      return {success: false, state, error: opResult.error};
    }

    try {
      const newDoc = applyOperation(state.editor.document, opResult.value);
      const newState = {...state, editor: {...state.editor, document: newDoc}};

      if (this.canUndo(cmd)) {
        this.history.push(cmd);
      }

      return {success: true, state: newState};
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      return {success: false, state, error: errorMsg};
    }
  }

  undo(cmd: Command, state: FullEditorState): CommandResult {
    const handler = this.findHandler(cmd);
    if (!handler) {
      return {success: false, state, error: `No handler found for command type: ${cmd.type}`};
    }

    const opResult = handler.toInverseOperation(cmd);
    if (!opResult.success) {
      return {success: false, state, error: opResult.error};
    }

    try {
      const newDoc = applyOperation(state.editor.document, opResult.value);
      const newState = {...state, editor: {...state.editor, document: newDoc}};
      return {success: true, state: newState};
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      return {success: false, state, error: errorMsg};
    }
  }

  undoLast(state: FullEditorState): CommandResult {
    if (this.history.length === 0) {
      return {success: false, state, error: 'History is empty'};
    }

    const lastCmd = this.history[this.history.length - 1];
    if (!lastCmd) {
      return {success: false, state, error: 'History is empty'};
    }
    const result = this.undo(lastCmd, state);

    if (result.success) {
      this.history.pop();
    }

    return result;
  }

  undoMany(count: number, state: FullEditorState): CommandResult {
    let currentState = state;
    let successCount = 0;

    for (let i = 0; i < count && this.history.length > 0; i++) {
      const lastCmd = this.history[this.history.length - 1];
      if (!lastCmd) {
        return {success: false, state: currentState, error: 'History is empty'};
      }
      const result = this.undo(lastCmd, currentState);

      if (result.success) {
        this.history.pop();
        currentState = result.state;
        successCount++;
      } else {
        return {success: false, state: currentState, error: `Batch undo aborted: ${result.error}`};
      }
    }

    if (successCount === 0 && count > 0) {
      return {success: false, state: currentState, error: 'No commands could be undone'};
    }

    return {success: true, state: currentState};
  }

  getHistoryLength(): number {
    return this.history.length;
  }
}

// For standalone pure operations
export function executeCommand(cmd: Command, state: FullEditorState): CommandResult {
  return new CommandExecutor().execute(cmd, state);
}

export function undoCommand(cmd: Command, state: FullEditorState): CommandResult {
  return new CommandExecutor().undo(cmd, state);
}
