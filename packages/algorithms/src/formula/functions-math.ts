/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-math.ts
 * 📂 المسار: packages/algorithms/src/formula/functions-math.ts
 * 🎯 الهدف الرئيسي: دوال الحساب والإحصاء الوصفي البسيطة والمتوسطة لجداول البيانات
 * 📋 المعايير: صفر اعتماديات، معالجة القسمة على صفر والقيم السالبة في الجذور
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions-math.test.ts
 * 🏷️ المعرف: ALGO-015
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v1.0: Extended Mathematical & Statistical Suite)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Robust Statistical Reductions & Safe Floating-Point Truncation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الجذور التربيعية لقيم سالبة
 *    2. القسمة على صفر في MOD
 *    3. حساب الوسيط والمنوال لمصفوفات فارغة أو متساوية التكرار
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص NaN واللانهاية قبل العمليات
 *    - تسطيح المصفوفات الممررة تلقائياً
 *    - رمي أخطاء واضحة عند المعاملات غير الصالحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: cell-utils.ts
 *    - 📄 مرتبط مباشر: registry.ts, functions.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/formula/functions-math.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - POWER: حساب الأس والرفع للقوة
 *    - SQRT: حساب الجذر التربيعي الآمن
 *    - MOD: حساب باقي القسمة
 *    - FLOOR: تقريب الرقم للأسفل لأقرب مضاعف
 *    - CEILING: تقريب الرقم للأعلى لأقرب مضاعف
 *    - TRUNC: بتر الأرقام العشرية دون تقريب
 *    - MEDIAN: حساب الوسيط الحسابي لمجموعة أرقام
 *    - MODE: إيجاد القيمة الأكثر تكراراً (المنوال)
 *    - COUNTA: حساب عدد القيم غير الفارغة
 *    - COUNTBLANK: حساب عدد القيم الفارغة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: OpenFormula Specification
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** تسطيح المصفوفات */
function flatten(args: unknown[]): unknown[] {
  const result: unknown[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) result.push(...flatten(arg));
    else result.push(arg);
  }
  return result;
}

/** تحويل القيمة إلى رقم آمن */
function toNum(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string') {
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  }
  return null;
}

/** POWER: الرفع إلى القوة والأس */
export function POWER(number: unknown, power: unknown): number {
  const n = toNum(number);
  const p = toNum(power);
  if (n === null || p === null) throw new Error('POWER requires two numeric values');
  return Math.pow(n, p);
}

/** SQRT: الجذر التربيعي */
export function SQRT(number: unknown): number {
  const n = toNum(number);
  if (n === null) throw new Error('SQRT requires a numeric value');
  if (n < 0) throw new Error('SQRT cannot accept negative numbers');
  return Math.sqrt(n);
}

/** MOD: باقي القسمة */
export function MOD(number: unknown, divisor: unknown): number {
  const n = toNum(number);
  const d = toNum(divisor);
  if (n === null || d === null) throw new Error('MOD requires two numeric values');
  if (d === 0) throw new Error('MOD divisor cannot be zero');
  return ((n % d) + d) % d;
}

/** FLOOR: التقريب للأسفل لأقرب مضاعف */
export function FLOOR(number: unknown, significance: unknown = 1): number {
  const n = toNum(number);
  const sig = toNum(significance);
  if (n === null || sig === null) throw new Error('FLOOR requires numeric values');
  if (sig === 0) return 0;
  const result = Math.floor(n / sig) * sig;
  return Number(result.toPrecision(12));
}

/** CEILING: التقريب للأعلى لأقرب مضاعف */
export function CEILING(number: unknown, significance: unknown = 1): number {
  const n = toNum(number);
  const sig = toNum(significance);
  if (n === null || sig === null) throw new Error('CEILING requires numeric values');
  if (sig === 0) return 0;
  const result = Math.ceil(n / sig) * sig;
  return Number(result.toPrecision(12));
}

/** TRUNC: بتر الأرقام العشرية */
export function TRUNC(number: unknown, numDigits: unknown = 0): number {
  const n = toNum(number);
  const digits = toNum(numDigits) ?? 0;
  if (n === null) throw new Error('TRUNC requires a numeric value');
  const factor = Math.pow(10, digits);
  return Math.trunc(n * factor) / factor;
}

/** MEDIAN: حساب الوسيط الحسابي */
export function MEDIAN(...args: unknown[]): number {
  const values = flatten(args)
    .map(toNum)
    .filter((v): v is number => v !== null)
    .sort((a, b) => a - b);
  if (values.length === 0) throw new Error('MEDIAN requires at least one numeric value');
  const mid = Math.floor(values.length / 2);
  if (values.length % 2 !== 0) {
    return values[mid]!;
  }
  return (values[mid - 1]! + values[mid]!) / 2;
}

/** MODE: إيجاد القيمة الأكثر تكراراً */
export function MODE(...args: unknown[]): number {
  const values = flatten(args)
    .map(toNum)
    .filter((v): v is number => v !== null);
  if (values.length === 0) throw new Error('MODE requires at least one numeric value');

  const counts = new Map<number, number>();
  let maxFreq = 0;
  let modeVal: number | null = null;

  for (const v of values) {
    const c = (counts.get(v) ?? 0) + 1;
    counts.set(v, c);
    if (c > maxFreq) {
      maxFreq = c;
      modeVal = v;
    }
  }

  if (maxFreq <= 1 && values.length > 1) {
    throw new Error('MODE found no repeating values');
  }
  return modeVal!;
}

/** COUNTA: حساب عدد القيم غير الفارغة */
export function COUNTA(...args: unknown[]): number {
  const values = flatten(args);
  return values.filter((v) => v !== null && v !== undefined && v !== '').length;
}

/** COUNTBLANK: حساب عدد الخلايا أو القيم الفارغة */
export function COUNTBLANK(...args: unknown[]): number {
  const values = flatten(args);
  return values.filter((v) => v === null || v === undefined || v === '').length;
}

/** مطابقة المعايير لـ COUNTIF و SUMIF */
function matchCriteria(val: unknown, criteria: unknown): boolean {
  if (criteria === null || criteria === undefined) return val === criteria;
  const critStr = String(criteria).trim();

  // فحص المقارنات الرياضية (>10, <=5, <>0, =100)
  const opMatch = critStr.match(/^([><]=?|<>|=)(.*)$/);
  if (opMatch) {
    const op = opMatch[1];
    const targetNum = parseFloat(opMatch[2]!.trim());
    const valNum = typeof val === 'number' ? val : parseFloat(String(val));
    if (!isNaN(targetNum) && !isNaN(valNum)) {
      if (op === '>') return valNum > targetNum;
      if (op === '>=') return valNum >= targetNum;
      if (op === '<') return valNum < targetNum;
      if (op === '<=') return valNum <= targetNum;
      if (op === '<>') return valNum !== targetNum;
      if (op === '=') return valNum === targetNum;
    }
  }

  // مطابقة نصية مباشرة أو مع تجاهل التشكيل والهمزات العربية
  const sVal = String(val ?? '')
    .trim()
    .toLowerCase();
  const sCrit = critStr.toLowerCase();
  if (sVal === sCrit) return true;

  // تطبيع الحروف العربية للمطابقة المرنة
  const normVal = sVal
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
  const normCrit = sCrit
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
  return normVal === normCrit;
}

/** COUNTIF: حساب عدد الخلايا المطابقة لشرط معين */
export function COUNTIF(range: unknown, criteria: unknown): number {
  const items = Array.isArray(range) ? flatten(range) : [range];
  return items.filter((item) => matchCriteria(item, criteria)).length;
}

/** SUMIF: جمع قيم الخلايا المطابقة لشرط معين */
export function SUMIF(range: unknown, criteria: unknown, sumRange?: unknown): number {
  const checkItems = Array.isArray(range) ? flatten(range) : [range];
  const sumItems =
    sumRange !== undefined
      ? Array.isArray(sumRange)
        ? flatten(sumRange)
        : [sumRange]
      : checkItems;

  let total = 0;
  for (let i = 0; i < checkItems.length; i++) {
    if (matchCriteria(checkItems[i], criteria)) {
      const val = toNum(sumItems[i]);
      if (val !== null) total += val;
    }
  }
  return total;
}
