/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: registry.ts
  * 📂 المسار: packages/algorithms/src/command/registry.ts
  * 🎯 الهدف الرئيسي: سجل لمعالجات الأوامر يتيح التسجيل والفحص والتوجيه (Dispatch)
  * 📋 المعايير: صفر اعتماديات خارجية، برمجة دفاعية صارمة، تسجيل حسب نوع الأمر
  * 🧪 الاختبارات: packages/algorithms/tests/command/registry.test.ts
  * 🏷️ المعرف: ALGO-003
  * 📅 تاريخ الإنشاء: 2026-08-19
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Registry Pattern + Type-Safe Dispatch + Default Singleton Registry
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. إعادة تسجيل نفس نوع الأمر (تضارب المعالجات)
  *    2. توجيه أمر لا يمتلك معالجاً مسجلاً (خطأ في وقت التشغيل)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - التحقق من صحة المدخلات قبل التسجيل
  *    - رسائل خطأ واضحة عند غياب المعالج
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: ProseMirror (MIT) - Command Registry Inspiration
  * ═══════════════════════════════════════════════════════════════════════════
  */

import type { EditorState } from '@libretext/core';
import type { Command } from './types';

/**
 * معالج أوامر يحوّل حالة المحرر (State-Transforming Handler)
 * يعيد حالة جديدة غير قابلة للتغيير (Immutable)
 */
export type StateCommandHandler = (
  cmd: Command,
  state: EditorState
) => EditorState;

/**
 * سجل الأوامر - يدير خريطة من أنواع الأوامر إلى معالجاتها
 */
export class CommandRegistry {
  private readonly handlers: Map<string, StateCommandHandler>;

  constructor() {
    this.handlers = new Map<string, StateCommandHandler>();
  }

  /**
   * تسجيل معالج لنوع أمر محدد
   * @throws Error إذا كان النوع فارغاً أو المعالج غير صالح أو مسجل مسبقاً
   */
  register(type: string, handler: StateCommandHandler): void {
    this.validateRegistration(type, handler);
    this.handlers.set(type, handler);
  }

  /**
   * إزالة معالج مسجل
   * @returns true إذا تمت الإزالة، false إذا لم يكن موجوداً
   */
  unregister(type: string): boolean {
    return this.handlers.delete(type);
  }

  /**
   * التحقق من وجود معالج لنوع معين
   */
  has(type: string): boolean {
    return this.handlers.has(type);
  }

  /**
   * الحصول على معالج لنوع معين
   */
  get(type: string): StateCommandHandler | undefined {
    return this.handlers.get(type);
  }

  /**
   * قائمة بجميع أنواع الأوامر المسجلة
   */
  list(): readonly string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * توجيه الأمر إلى معالجه المناسب بناءً على نوع الأمر
   * @throws Error إذا لم يوجد معالج لنوع الأمر
   */
  dispatch(cmd: Command, state: EditorState): EditorState {
    const handler = this.handlers.get(cmd.type);
    if (!handler) {
      throw new Error(
        `No handler registered for command type: "${cmd.type}"`
      );
    }
    return handler(cmd, state);
  }

  /**
   * التحقق من صحة مدخلات التسجيل (برمجة دفاعية)
   */
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
    if (this.handlers.has(type)) {
      throw new Error(`Handler for command type "${type}" is already registered`);
    }
  }
}

/**
 * دالة مصنّعة لإنشاء سجل أوامر جديد
 */
export function createCommandRegistry(): CommandRegistry {
  return new CommandRegistry();
}

/**
 * السجل الافتراضي العام (Default Singleton Registry)
 * يُستخدم للتسجيل السريع عبر registerCommand
 */
const defaultRegistry = createCommandRegistry();

/**
 * تسجيل معالج في السجل الافتراضي
 * يطابق الـ API: ALGO-CMD-004
 */
export function registerCommand(
  type: string,
  handler: StateCommandHandler
): void {
  defaultRegistry.register(type, handler);
}

/**
 * إلغاء تسجيل معالج من السجل الافتراضي
 */
export function unregisterCommand(type: string): boolean {
  return defaultRegistry.unregister(type);
}

/**
 * توجيه أمر عبر السجل الافتراضي
 */
export function dispatchCommand(
  cmd: Command,
  state: EditorState
): EditorState {
  return defaultRegistry.dispatch(cmd, state);
}

/**
 * الحصول على مرجع السجل الافتراضي (للاختبار أو التكامل المتقدم)
 */
export function getDefaultRegistry(): CommandRegistry {
  return defaultRegistry;
}
