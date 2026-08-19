/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: registry.ts
  * 📂 المسار: packages/algorithms/src/formula/registry.ts
  * 🎯 الهدف الرئيسي: سجل الدوال مع registerOrReplace للتسجيل الآمن
  * 📋 المعايير: صفر اعتماديات، Singleton موثق، registerOrReplace
  * 🧪 الاختبارات: packages/algorithms/tests/formula/registry.test.ts
  * 🏷️ المعرف: ALGO-012
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 آخر تحديث: 2026-08-19 (v2: registerOrReplace + Singleton Doc)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Registry Pattern + Module-Level Singleton + Safe Overwrite
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. defaultRegistry هو Singleton على مستوى الموديول
  *    2. استخدام registerOrReplace لتجنب الأخطاء في HMR
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - registerOrReplace بدلاً من register للتسجيل الآمن
  *    - استرجاع آمن للدوال
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: لا توجد
  * ═══════════════════════════════════════════════════════════════════════════
  */

import * as builtins from './functions';
import type { FunctionHandler } from './evaluator';

/** سجل الدوال المدمجة */
export class FunctionRegistry {
  private readonly functions: Map<string, FunctionHandler>;

  constructor() {
    this.functions = new Map<string, FunctionHandler>();
  }

  /** تسجيل دالة (يرمي إذا كان الاسم مسجلاً مسبقاً) */
  register(name: string, handler: FunctionHandler): void {
    const upper = name.toUpperCase();
    if (this.functions.has(upper)) {
      throw new Error(`Function "${upper}" is already registered`);
    }
    this.functions.set(upper, handler);
  }

  /** تسجيل أو استبدال دالة (آمن لـ HMR) */
  registerOrReplace(name: string, handler: FunctionHandler): void {
    this.functions.set(name.toUpperCase(), handler);
  }

  /** استرجاع دالة */
  get(name: string): FunctionHandler | undefined {
    return this.functions.get(name.toUpperCase());
  }

  /** التحقق من وجود دالة */
  has(name: string): boolean {
    return this.functions.has(name.toUpperCase());
  }

  /** قائمة بجميع الدوال المسجلة */
  list(): readonly string[] {
    return Array.from(this.functions.keys());
  }

  /** تسجيل جميع الدوال المدمجة */
  registerBuiltins(): this {
    this.registerOrReplace('SUM', builtins.SUM);
    this.registerOrReplace('AVERAGE', builtins.AVERAGE);
    this.registerOrReplace('COUNT', builtins.COUNT);
    this.registerOrReplace('MIN', builtins.MIN);
    this.registerOrReplace('MAX', builtins.MAX);
    this.registerOrReplace('ABS', builtins.ABS);
    this.registerOrReplace('ROUND', builtins.ROUND);
    this.registerOrReplace('CONCAT', builtins.CONCAT);
    this.registerOrReplace('IF', builtins.IF);
    return this;
  }
}

/** إنشاء سجل دوال مع الدوال المدمجة مسجّلة */
export function createFunctionRegistry(): FunctionRegistry {
  return new FunctionRegistry().registerBuiltins();
}

/**
 * السجل الافتراضي العام (Module-Level Singleton)
 * ⚠️ تحذير: هذا كائن واحد مشترك عبر جميع الاستيرادات في نفس الموديول
 */
const defaultRegistry = createFunctionRegistry();

/** الحصول على السجل الافتراضي */
export function getDefaultFunctionRegistry(): FunctionRegistry {
  return defaultRegistry;
}

/** استرجاع دالة من السجل الافتراضي */
export function getBuiltinFunction(name: string): FunctionHandler | undefined {
  return defaultRegistry.get(name);
}
