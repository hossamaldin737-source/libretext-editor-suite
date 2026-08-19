/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: functions.ts
  * 📂 المسار: packages/algorithms/src/formula/functions.ts
  * 🎯 الهدف الرئيسي: دوال مدمجة مع معالجة آمنة للفاصلة العائمة و Infinity
  * 📋 المعايير: صفر اعتماديات، ROUND آمن، Infinity handling
  * 🧪 الاختبارات: packages/algorithms/tests/formula/functions.test.ts
  * 🏷️ المعرف: ALGO-006
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 آخر تحديث: 2026-08-19 (v2: Safe ROUND + Infinity Check)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Strategy Pattern + Safe Floating-Point Arithmetic
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. أخطاء الفاصلة العائمة في ROUND
  *    2. Infinity في الحسابات التجميعية
  *    3. المصفوفات المتداخلة من Ranges
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - استخدام toFixed لتجنب floating-point errors
  *    - فحص Infinity قبل العمليات
  *    - تسطيح المصفوفات تلقائياً
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: Excel Function Reference
  * ═══════════════════════════════════════════════════════════════════════════
  */

/** تسطيح المصفوفات المتداخلة */
function flattenArgs(args: unknown[]): unknown[] {
  const result: unknown[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...flattenArgs(arg));
    } else {
      result.push(arg);
    }
  }
  return result;
}

/** تحويل القيمة إلى رقم مع فحص Infinity */
function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') {
    if (isNaN(value)) return null;
    if (!isFinite(value)) {
      throw new Error(`Cannot use ${value} in calculations (Infinity detected)`);
    }
    return value;
  }
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (isNaN(num)) return null;
    if (!isFinite(num)) {
      throw new Error(`Cannot use "${value}" in calculations (Infinity detected)`);
    }
    return num;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  return null;
}

/** ROUND آمن مع معالجة dec السالب */
function safeRound(num: number, decimals: number): number {
  if (decimals >= 0) {
    // استخدام toFixed لتجنب floating-point errors
    return Number(num.toFixed(decimals));
  }
  // dec سالب: تقريب للعشرات/المئات/...
  const factor = Math.pow(10, -decimals);
  return Math.round(num / factor) * factor;
}

/** SUM: جمع جميع الأرقام */
export function SUM(...args: unknown[]): number {
  const values = flattenArgs(args).map(toNumber).filter((v): v is number => v !== null);
  return values.reduce((sum, val) => sum + val, 0);
}

/** AVERAGE: متوسط الأرقام */
export function AVERAGE(...args: unknown[]): number {
  const values = flattenArgs(args).map(toNumber).filter((v): v is number => v !== null);
  if (values.length === 0) {
    throw new Error('AVERAGE requires at least one numeric value');
  }
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/** COUNT: عدد القيم الرقمية */
export function COUNT(...args: unknown[]): number {
  const values = flattenArgs(args);
  return values.filter((v) => toNumber(v) !== null).length;
}

/** MIN: أصغر قيمة */
export function MIN(...args: unknown[]): number {
  const values = flattenArgs(args).map(toNumber).filter((v): v is number => v !== null);
  if (values.length === 0) {
    throw new Error('MIN requires at least one numeric value');
  }
  return Math.min(...values);
}

/** MAX: أكبر قيمة */
export function MAX(...args: unknown[]): number {
  const values = flattenArgs(args).map(toNumber).filter((v): v is number => v !== null);
  if (values.length === 0) {
    throw new Error('MAX requires at least one numeric value');
  }
  return Math.max(...values);
}

/** ABS: القيمة المطلقة */
export function ABS(value: unknown): number {
  const num = toNumber(value);
  if (num === null) {
    throw new Error('ABS requires a numeric value');
  }
  return Math.abs(num);
}

/** ROUND: تقريب آمن (ALGO-FRM-010) */
export function ROUND(value: unknown, decimals: unknown = 0): number {
  const num = toNumber(value);
  if (num === null) {
    throw new Error('ROUND requires a numeric value');
  }
  const dec = toNumber(decimals) ?? 0;
  if (!Number.isInteger(dec)) {
    throw new Error('ROUND decimals must be an integer');
  }
  return safeRound(num, dec);
}

/** CONCAT: دمج النصوص */
export function CONCAT(...args: unknown[]): string {
  const values = flattenArgs(args);
  return values
    .map((v) => {
      if (v === null || v === undefined) return '';
      return String(v);
    })
    .join('');
}

/** IF: شرط منطقي (Lazy - يتم تقييمه في evaluator.ts) */
export function IF<T>(condition: unknown, trueVal: T, falseVal: T): T {
  const bool = Boolean(condition);
  return bool ? trueVal : falseVal;
}
