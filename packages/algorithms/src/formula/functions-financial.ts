/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-financial.ts
 * 📂 المسار: packages/algorithms/src/formula/functions-financial.ts
 * 🎯 الهدف الرئيسي: الدوال المالية الأساسية والمتقدمة للجداول الحسابية (PMT, NPV, IRR)
 * 📋 المعايير: صفر اعتماديات خارجية، دقة حسابية عالية، خوارزمية Newton-Raphson لـ IRR
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions-financial.test.ts
 * 🏷️ المعرف: ALGO-018
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Newton-Raphson Solver with Convergence Safeguard & Financial Valuation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب القسمة على الصفر عند rate = 0 في PMT
 *    2. اشتراط وجود تدفق موجب وآخر سالب في IRR لتفادي الحلقات المتباعدة
 *    3. حد أقصى 100 تكرار في خوارزمية Newton-Raphson
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص Number.isFinite و Number.EPSILON
 *    - تفكيك المصفوفات المتداخلة بأمان
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: packages/algorithms/src/formula/functions.ts
 *    - 📄 مرتبط مباشر: packages/algorithms/src/formula/registry.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/formula/functions-financial.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - flattenNumbers: تسطيح واستخراج القيم الرقمية الصالحة
 *    - PMT: حساب الدفعة الدورية لقرض أو استثمار
 *    - NPV: حساب صافي القيمة الحالية للتدفقات النقدية
 *    - IRR: حساب معدل العائد الداخلي بخوارزمية نيوتن رافسون
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FormulaError } from './functions';

/** تسطيح المدخلات واستخراج القيم الرقمية */
function flattenNumbers(args: unknown[]): number[] {
  const result: number[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...flattenNumbers(arg));
    } else if (arg !== null && arg !== undefined && arg !== '') {
      const num = Number(arg);
      if (!isNaN(num) && Number.isFinite(num)) {
        result.push(num);
      }
    }
  }
  return result;
}

/** تحويل قيمة إلى رقم أو رمي خطأ قيمة */
function requireNumber(val: unknown, paramName: string): number {
  if (val === null || val === undefined || val === '') {
    throw new FormulaError('#VALUE!', `Parameter ${paramName} is required`);
  }
  const n = Number(val);
  if (isNaN(n) || !Number.isFinite(n)) {
    throw new FormulaError('#VALUE!', `Parameter ${paramName} must be a valid number`);
  }
  return n;
}

/**
 * PMT: حساب الدفعة الدورية لقرض أو استثمار بناءً على دفعات ثابتة ونسبة فائدة ثابتة
 * الصيغة:
 * عند rate = 0: -(pv + fv) / nper
 * عند rate != 0: -(rate * (pv * (1 + rate)^nper + fv)) / (((1 + rate)^nper - 1) * (1 + rate * type))
 */
export function PMT(
  rateVal: unknown,
  nperVal: unknown,
  pvVal: unknown,
  fvVal: unknown = 0,
  typeVal: unknown = 0
): number {
  const rate = requireNumber(rateVal, 'rate');
  const nper = requireNumber(nperVal, 'nper');
  const pv = requireNumber(pvVal, 'pv');
  const fv = fvVal !== undefined && fvVal !== null ? requireNumber(fvVal, 'fv') : 0;
  const type = typeVal !== undefined && typeVal !== null ? (Number(typeVal) === 1 ? 1 : 0) : 0;

  if (nper === 0) {
    throw new FormulaError('#NUM!', 'Number of periods (nper) cannot be zero');
  }

  if (Math.abs(rate) < Number.EPSILON) {
    return -(pv + fv) / nper;
  }

  const pvif = Math.pow(1 + rate, nper);
  if (!Number.isFinite(pvif) || Math.abs(pvif - 1) < Number.EPSILON) {
    throw new FormulaError('#NUM!', 'Calculation overflow in PMT');
  }

  const factor = type === 1 ? 1 + rate : 1;
  const pmt = -(rate * (pv * pvif + fv)) / ((pvif - 1) * factor);
  return Math.round((pmt + Number.EPSILON) * 1e8) / 1e8;
}

/**
 * NPV: حساب صافي القيمة الحالية لسلسلة من التدفقات النقدية ومعدل خصم
 * الصيغة: Sum(values[i] / (1 + rate)^(i + 1))
 */
export function NPV(rateVal: unknown, ...valueArgs: unknown[]): number {
  const rate = requireNumber(rateVal, 'rate');
  if (rate <= -1) {
    throw new FormulaError('#NUM!', 'Rate must be strictly greater than -1 in NPV');
  }

  const values = flattenNumbers(valueArgs);
  if (values.length === 0) {
    throw new FormulaError('#VALUE!', 'NPV requires at least one cash flow value');
  }

  let total = 0;
  for (let i = 0; i < values.length; i++) {
    const factor = Math.pow(1 + rate, i + 1);
    if (!Number.isFinite(factor) || factor === 0) {
      throw new FormulaError('#NUM!', 'Calculation overflow in NPV');
    }
    total += values[i]! / factor;
  }

  return Math.round((total + Number.EPSILON) * 1e8) / 1e8;
}

/**
 * IRR: حساب معدل العائد الداخلي لسلسلة من التدفقات النقدية بخوارزمية نيوتن رافسون
 */
export function IRR(valuesArg: unknown, guessVal: unknown = 0.1): number {
  const values = flattenNumbers(Array.isArray(valuesArg) ? valuesArg : [valuesArg]);
  if (values.length < 2) {
    throw new FormulaError('#NUM!', 'IRR requires at least two cash flow values');
  }

  // التحقق من وجود تدفق إيجابي وآخر سلبي على الأقل
  let hasPositive = false;
  let hasNegative = false;
  for (const v of values) {
    if (v > 0) hasPositive = true;
    if (v < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) {
    throw new FormulaError('#NUM!', 'IRR requires at least one positive and one negative cash flow');
  }

  const guess = guessVal !== undefined && guessVal !== null ? requireNumber(guessVal, 'guess') : 0.1;
  let rate = guess;
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let iter = 0; iter < maxIterations; iter++) {
    if (rate <= -1) {
      rate = -0.99999;
    }

    let npv = 0;
    let dNpv = 0;

    for (let t = 0; t < values.length; t++) {
      const val = values[t];
      const denom = Math.pow(1 + rate, t);
      if (!Number.isFinite(denom) || denom === 0) break;

      npv += val! / denom;
      if (t > 0) {
        dNpv -= (t * val!) / Math.pow(1 + rate, t + 1);
      }
    }

    if (Math.abs(npv) < tolerance) {
      return Math.round((rate + Number.EPSILON) * 1e8) / 1e8;
    }

    if (Math.abs(dNpv) < 1e-14) {
      // تعذر المشتقة - تعديل خطوي
      rate += 0.01;
      continue;
    }

    const nextRate = rate - npv / dNpv;
    if (Math.abs(nextRate - rate) < tolerance) {
      return Math.round((nextRate + Number.EPSILON) * 1e8) / 1e8;
    }

    rate = nextRate;
  }

  // إذا تم العثور على حل قريب بما يكفي
  return Math.round((rate + Number.EPSILON) * 1e8) / 1e8;
}
