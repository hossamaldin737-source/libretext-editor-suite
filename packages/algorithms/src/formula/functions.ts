/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions.ts
 * 📂 المسار: packages/algorithms/src/formula/functions.ts
 * 🎯 الهدف الرئيسي: 24+ دالة مدمجة مع معالجة آمنة + FormulaError بأكواد Excel
 * 📋 المعايير: صفر اعتماديات، ROUND آمن، Infinity handling، أكواد خطأ Excel
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions.test.ts
 * 🏷️ المعرف: ALGO-006
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v3: 24+ functions + FormulaError Excel codes)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Strategy Pattern + Safe Floating-Point Arithmetic + Excel Error Codes
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
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: ./evaluator-types.ts (EvaluationError)
 *    - 📄 مرتبط: ./evaluator.ts, ./registry.ts
 *    - 🧪 اختبارات: tests/formula/functions.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية | Reference:
 *    - Excel Function Reference (SUM, AVERAGE, COUNT, etc.)
 *    - webpainter-next formula-evaluator.ts (inspiration)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── FormulaError بأكواد Excel ───

export class FormulaError {
  constructor(
    public readonly code: string,
    public readonly message: string = '',
  ) {}
  toString(): string {
    return this.code;
  }
}

/** فحص ما إذا كانت القيمة خطأ صيغة */
export function isFormulaError(val: unknown): val is FormulaError {
  return val instanceof FormulaError;
}

// ─── دوال مساعدة ───

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

function toNumberOrNull(value: unknown): number | null {
  if (value instanceof FormulaError) return null;
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return isFinite(value) ? value : null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string') {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
  return null;
}

function toNumberSafe(value: unknown): number {
  if (value instanceof FormulaError) throw value;
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') {
    if (!isFinite(value)) return 0;
    return value;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string') {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return num;
  }
  return 0;
}

function safeRound(num: number, decimals: number): number {
  if (decimals >= 0) return Number(num.toFixed(decimals));
  const factor = Math.pow(10, -decimals);
  return Math.round(num / factor) * factor;
}

/** التحقق من وجود Infinity في القيم */
function hasInfinity(args: unknown[]): boolean {
  return args.some((v) => {
    if (typeof v === 'number' && !isFinite(v)) return true;
    if (typeof v === 'string' && v.toLowerCase() === 'infinity') return true;
    return false;
  });
}

// ─── الدوال الحسابية (Math) ───

export function SUM(...args: unknown[]): number {
  if (hasInfinity(args)) throw new Error('Infinity detected');
  const values = flattenArgs(args)
    .map(toNumberOrNull)
    .filter((v): v is number => v !== null);
  return values.reduce((sum, val) => sum + val, 0);
}

export function AVERAGE(...args: unknown[]): number {
  if (hasInfinity(args)) throw new Error('Infinity detected');
  const values = flattenArgs(args)
    .map(toNumberOrNull)
    .filter((v): v is number => v !== null);
  if (values.length === 0) throw new Error('AVERAGE requires at least one numeric value');
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

export function COUNT(...args: unknown[]): number {
  return flattenArgs(args).filter((v) => toNumberOrNull(v) !== null).length;
}

export function COUNTA(...args: unknown[]): number {
  return flattenArgs(args).filter((c) => c !== null && c !== undefined && c !== '').length;
}

export function MIN(...args: unknown[]): number {
  const values = flattenArgs(args)
    .map(toNumberOrNull)
    .filter((v): v is number => v !== null);
  if (values.length === 0) throw new Error('MIN requires at least one numeric value');
  return Math.min(...values);
}

export function MAX(...args: unknown[]): number {
  const values = flattenArgs(args)
    .map(toNumberOrNull)
    .filter((v): v is number => v !== null);
  if (values.length === 0) throw new Error('MAX requires at least one numeric value');
  return Math.max(...values);
}

export function PRODUCT(...args: unknown[]): number {
  const values = flattenArgs(args).map(toNumberSafe);
  if (values.length === 0) return 0;
  return values.reduce((prod, val) => prod * val, 1);
}

export function ABS(value: unknown): number {
  if (typeof value === 'string' && isNaN(Number(value))) {
    throw new Error('ABS requires a numeric value');
  }
  return Math.abs(toNumberSafe(value));
}

export function ROUND(value: unknown, decimals: unknown = 0): number {
  const num = toNumberSafe(value);
  const dec = toNumberSafe(decimals);
  if (!Number.isInteger(dec)) throw new Error('ROUND decimals must be an integer');
  return safeRound(num, dec);
}

export function FLOOR(value: unknown): number {
  return Math.floor(toNumberSafe(value));
}

export function CEIL(value: unknown): number {
  return Math.ceil(toNumberSafe(value));
}

export function SQRT(value: unknown): number {
  const val = toNumberSafe(value);
  if (val < 0) throw new FormulaError('#NUM!', 'Square root of negative number');
  return Math.sqrt(val);
}

export function POWER(base: unknown, exp: unknown): number {
  return Math.pow(toNumberSafe(base), toNumberSafe(exp));
}

export function MOD(dividend: unknown, divisor: unknown): number {
  const d = toNumberSafe(divisor);
  if (d === 0) throw new FormulaError('#DIV/0!', 'Division by zero');
  return toNumberSafe(dividend) % d;
}

// ─── الدوال المنطقية (Logic) ───

export function IF<T>(condition: unknown, trueVal: T, falseVal: T): T {
  return Boolean(condition) ? trueVal : falseVal;
}

export function AND(...args: unknown[]): boolean {
  return flattenArgs(args).every((c) => Boolean(c));
}

export function OR(...args: unknown[]): boolean {
  return flattenArgs(args).some((c) => Boolean(c));
}

export function NOT(value: unknown): boolean {
  return !Boolean(value);
}

// ─── الدوال النصية (Text) ───

export function CONCAT(...args: unknown[]): string {
  return flattenArgs(args)
    .map((v) => (v === null || v === undefined ? '' : String(v)))
    .join('');
}

export function CONCATENATE(...args: unknown[]): string {
  return CONCAT(...args);
}

export function LEN(value: unknown): number {
  return String(value ?? '').length;
}

export function UPPER(value: unknown): string {
  return String(value ?? '').toUpperCase();
}

export function LOWER(value: unknown): string {
  return String(value ?? '').toLowerCase();
}

export function TRIM(value: unknown): string {
  return String(value ?? '').trim();
}

// ─── الدوال الزمنية (Date/Time) ───

export function NOW(): string {
  return new Date().toISOString();
}

export function TODAY(): string {
  const iso = new Date().toISOString();
  const parts = iso.split('T');
  return parts[0] ?? iso;
}

// ─── تسجيل جميع الدوال ───

export const BUILTIN_FUNCTIONS: Record<string, (...args: unknown[]) => unknown> = {
  SUM,
  AVERAGE,
  COUNT,
  COUNTA,
  MIN,
  MAX,
  PRODUCT,
  ABS,
  ROUND,
  FLOOR,
  CEIL,
  SQRT,
  POWER,
  MOD,
  IF,
  AND,
  OR,
  NOT,
  CONCAT,
  CONCATENATE,
  LEN,
  UPPER,
  LOWER,
  TRIM,
  NOW,
  TODAY,
};
