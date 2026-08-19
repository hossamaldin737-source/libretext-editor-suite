/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: registry.ts
  * 📂 المسار: packages/algorithms/src/command/registry.ts
  * 🎯 الهدف الرئيسي: سجل أوامر مع canExecute + isEnabled + Event Callbacks
  * 📋 المعايير: صفر اعتماديات خارجية، برمجة دفاعية صارمة، تسجيل حسب نوع
  * 🧪 الاختبارات: packages/algorithms/tests/command/registry.test.ts
  * 🏷️ المعرف: ALGO-003
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 آخر تحديث: 2026-08-19 (v2: canExecute + isEnabled + callbacks)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Registry + Canary Pattern + Guard Hooks + Lightweight Event System
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. إعادة تسجيل نفس نوع الأمر (تضارب المعالجات)
  *    2. canExecute يجب أن يكون خالياً من الآثار الجانبية (pure)
  *    3. isEnabled كاذب موجب يمنع التنفيذ للnoDB
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - التحقق من صحة المدخلات قبل التسجيل
  *    - canExecute/isEnabled مُلفّفتان بـ try/catch以防 كسر التنفيذ
  * ═══════════════════════════════════════════════════════════════════════════
  * 🔗 الملفات المرتبطة | Linked Files:
  *    - 📇 الفهرس: FUNCTION_INDEX.md
  *    - 📦 التبعيات: ./types.ts (Command)
  *    - 🧪 اختبارات: tests/command/registry.test.ts
  * ═══════════════════════════════════════════════════════════════════════════
  * 📊 الدوال والخوارزميات | Functions & Algorithms:
  *    - register(): تسجيل معالج مع canExecute/isEnabled (#L72)
  *    - get(): الحصول على معالج مسجل (#L100)
  *    - canExecute(): فحص قابلية التنفيذ (#L120)
  *    - isEnabled(): فحص تنشيط الأمر (#L136)
  *    - dispatch(): تنفيذ الأمر مع Event (#L149)
  * ═══════════════════════════════════════════════════════════════════════════
  * 📝 ملاحظات التطوير | Development Notes:
  *    - canExecute و isEnabled يجب أن يكونا نقيين (pure) بدون آثار جانبية
  *    - Callbacks مسجلة عبر onBefore/onAfter لا EventBus خارجي
  * ═══════════════════════════════════════════════════════════════════════════
  * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
  *    - 🔧 خطة المعالجة: مُحسّن بناءً على webpainter-next CommandRegistry
  *    - 📖 مرجع تقني: Command Pattern (GoF) + ProseMirror State Commands
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * ═══════════════════════════════════════════════════════════════════════════
  */

import type { EditorState } from '@libretext/core';
import type { Command } from './types';

// ─── الأنواع ───

/** معالج أوامر يحوّل حالة المحرر (State-Transforming Handler) */
export type StateCommandHandler = (
  cmd: Command,
  state: EditorState
) => EditorState;

/** شرط يمكن لحسابه ما إذا كان الأمر قابلاً للتنفيذ */
export type CanExecuteFn = (
  cmd: Command,
  state: EditorState
) => boolean;

/** شرط ما إذا كان الأمر مفعلاً (can be invoked) */
export type IsEnabledFn = (
  cmd: Command,
  state: EditorState
) => boolean;

/** حدث ما قبل/بعد التنفيذ */
export interface CommandEvent {
  readonly type: 'before' | 'after';
  readonly command: Command;
  readonly state: EditorState;
}

/** callback مسجل */
export type CommandEventListener = (event: CommandEvent) => void;

/** خيارات التسجيل المتقدمة */
export interface CommandRegistration {
  readonly handler: StateCommandHandler;
  readonly canExecute?: CanExecuteFn;
  readonly isEnabled?: IsEnabledFn;
}

// ─── CommandRegistry ───

export class CommandRegistry {
  private readonly registrations = new Map<string, CommandRegistration>();
  private readonly listeners: CommandEventListener[] = [];

  constructor() {}

  // ── التسجيل ──

  /** تسجيل معالج لنوع أمر مع canExecute/isEnabled اختياريين */
  register(type: string, handler: StateCommandHandler, opts?: {
    canExecute?: CanExecuteFn;
    isEnabled?: IsEnabledFn;
  }): void {
    this.validateRegistration(type, handler);
    this.registrations.set(type, {
      handler,
      canExecute: opts?.canExecute,
      isEnabled: opts?.isEnabled,
    });
  }

  /** إزالة معالج مسجل */
  unregister(type: string): boolean {
    return this.registrations.delete(type);
  }

  /** التحقق من وجود معالج */
  has(type: string): boolean {
    return this.registrations.has(type);
  }

  /** الحصول على معالج لنوع معين */
  get(type: string): StateCommandHandler | undefined {
    return this.registrations.get(type)?.handler;
  }

  /** قائمة بجميع أنواع الأوامر المسجلة */
  list(): readonly string[] {
    return Array.from(this.registrations.keys());
  }

  // ── الفحص ──

  /** هل يمكن تنفيذ الأمر بناءً على شرط canExecute؟ */
  canExecute(cmd: Command, state: EditorState): boolean {
    const reg = this.registrations.get(cmd.type);
    if (!reg) return false;
    if (!reg.isEnabled?.(cmd, state)) return false;
    if (reg.canExecute) {
      try { return reg.canExecute(cmd, state); } catch { return false; }
    }
    return true;
  }

  /** هل الأمر مفعّل (can be invoked) بناءً على شرط isEnabled؟ */
  isEnabled(cmd: Command, state: EditorState): boolean {
    const reg = this.registrations.get(cmd.type);
    if (!reg) return false;
    if (reg.isEnabled) {
      try { return reg.isEnabled(cmd, state); } catch { return false; }
    }
    return true;
  }

  // ── التنفيذ ──

  /** توجيه الأمر إلى معالجه مع Event emissions */
  dispatch(cmd: Command, state: EditorState): EditorState {
    const reg = this.registrations.get(cmd.type);
    if (!reg) {
      throw new Error(
        `No handler registered for command type: "${cmd.type}"`
      );
    }
    if (!this.isEnabled(cmd, state)) {
      throw new Error(`Command "${cmd.type}" is disabled`);
    }
    this.emit({ type: 'before', command: cmd, state });
    const newState = reg.handler(cmd, state);
    this.emit({ type: 'after', command: cmd, state: newState });
    return newState;
  }

  // ── Events ──

  /** تسجيل مستمع لأحداث الأوامر */
  on(listener: CommandEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private emit(event: CommandEvent): void {
    for (const l of this.listeners) {
      try { l(event); } catch { /* swallow listener errors */ }
    }
  }

  // ── التحقق ──

  private validateRegistration(
    type: string,
    handler: StateCommandHandler
  ): void {
    if (typeof type !== 'string' || type.trim().length === 0) {
      throw new Error('Command type must be a non-empty string');
    }
    if (typeof handler !== 'function') {
      throw new Error('Command handler must be a function');
    }
    if (this.registrations.has(type)) {
      throw new Error(`Handler for command type "${type}" is already registered`);
    }
  }
}

// ─── الواجهة الافتراضية ───

export function createCommandRegistry(): CommandRegistry {
  return new CommandRegistry();
}

const defaultRegistry = createCommandRegistry();

export function registerCommand(
  type: string,
  handler: StateCommandHandler,
  opts?: { canExecute?: CanExecuteFn; isEnabled?: IsEnabledFn }
): void {
  defaultRegistry.register(type, handler, opts);
}

export function unregisterCommand(type: string): boolean {
  return defaultRegistry.unregister(type);
}

export function dispatchCommand(
  cmd: Command,
  state: EditorState
): EditorState {
  return defaultRegistry.dispatch(cmd, state);
}

export function getDefaultRegistry(): CommandRegistry {
  return defaultRegistry;
}
