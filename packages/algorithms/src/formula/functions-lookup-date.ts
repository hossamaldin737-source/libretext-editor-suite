/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-lookup-date.ts
 * 📂 المسار: packages/algorithms/src/formula/functions-lookup-date.ts
 * 🎯 الهدف الرئيسي: دوال البحث والمصفوفات والتاريخ والمنطق المتقدم للجداول
 * 📋 المعايير: صفر اعتماديات، معالجة أخطاء #N/A و #VALUE!
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions-lookup-date.test.ts
 * 🏷️ المعرف: ALGO-016
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Lookup Strategy with Binary/Exact Matching & Date Calculations
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تجاوز حدود الأعمدة والصفوف في VLOOKUP/INDEX
 *    2. حسابات فروق التواريخ ومراعاة leap years
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FormulaError } from './functions';

function flatten(args: unknown[]): unknown[] {
  const result: unknown[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) result.push(...flatten(arg));
    else result.push(arg);
  }
  return result;
}

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

/** MATCH: البحث عن موضع القيمة داخل مصفوفة */
export function MATCH(lookupValue: unknown, lookupArray: unknown[], matchType: unknown = 1): number {
  if (!Array.isArray(lookupArray) || lookupArray.length === 0) {
    throw new FormulaError('#N/A', 'Lookup array is empty or not an array');
  }
  const flatArray = flatten(lookupArray);
  const type = toNum(matchType) ?? 1;

  if (type === 0) {
    const sTarget = String(lookupValue).trim().toLowerCase();
    for (let i = 0; i < flatArray.length; i++) {
      if (String(flatArray[i]).trim().toLowerCase() === sTarget) {
        return i + 1;
      }
    }
    throw new FormulaError('#N/A', 'Value not found in array');
  }

  // Exact or approximate matching
  const targetNum = toNum(lookupValue);
  if (targetNum !== null) {
    let bestIndex = -1;
    for (let i = 0; i < flatArray.length; i++) {
      const currentNum = toNum(flatArray[i]);
      if (currentNum !== null) {
        if (type === 1 && currentNum <= targetNum) {
          bestIndex = i + 1;
        } else if (type === -1 && currentNum >= targetNum) {
          bestIndex = i + 1;
        }
      }
    }
    if (bestIndex !== -1) return bestIndex;
  }

  throw new FormulaError('#N/A', 'Match not found');
}

/** INDEX: استرجاع قيمة عنصر داخل مصفوفة بأرقام الصف والعمود */
export function INDEX(array: unknown[][], rowNum: unknown, colNum?: unknown): unknown {
  if (!Array.isArray(array) || array.length === 0) {
    throw new FormulaError('#REF!', 'Array is empty or invalid');
  }
  const r = (toNum(rowNum) ?? 1) - 1;
  const c = colNum !== undefined ? (toNum(colNum) ?? 1) - 1 : 0;

  if (r < 0 || r >= array.length) {
    throw new FormulaError('#REF!', 'Row index out of range');
  }

  const row = array[r];
  if (!Array.isArray(row)) {
    if (c === 0) return row;
    throw new FormulaError('#REF!', 'Column index out of range for 1D array');
  }

  if (c < 0 || c >= row.length) {
    throw new FormulaError('#REF!', 'Column index out of range');
  }

  return row[c];
}

/** VLOOKUP: البحث العمودي في مصفوفة */
export function VLOOKUP(
  lookupValue: unknown,
  tableArray: unknown[][],
  colIndex: unknown,
  rangeLookup: unknown = true
): unknown {
  if (!Array.isArray(tableArray) || tableArray.length === 0) {
    throw new FormulaError('#N/A', 'Table array is empty');
  }
  const col = toNum(colIndex);
  if (col === null || col < 1) {
    throw new FormulaError('#VALUE!', 'Column index must be >= 1');
  }

  const isApproximate = rangeLookup === true || rangeLookup === 'TRUE' || rangeLookup === 1;
  const targetStr = String(lookupValue).trim().toLowerCase();

  for (let r = 0; r < tableArray.length; r++) {
    const row = tableArray[r];
    if (!Array.isArray(row) || row.length === 0) continue;

    const firstCell = String(row[0]).trim().toLowerCase();
    if (firstCell === targetStr) {
      if (col - 1 >= row.length) {
        throw new FormulaError('#REF!', 'Column index exceeds row length');
      }
      return row[col - 1];
    }
  }

  if (isApproximate) {
    const targetNum = toNum(lookupValue);
    if (targetNum !== null) {
      let lastMatchRow: unknown[] | null = null;
      for (let r = 0; r < tableArray.length; r++) {
        const row = tableArray[r];
        if (!Array.isArray(row) || row.length === 0) continue;
        const cellNum = toNum(row[0]);
        if (cellNum !== null && cellNum <= targetNum) {
          lastMatchRow = row;
        }
      }
      if (lastMatchRow && col - 1 < lastMatchRow.length) {
        return lastMatchRow[col - 1];
      }
    }
  }

  throw new FormulaError('#N/A', 'VLOOKUP did not find a match');
}

/** XLOOKUP: البحث المتقدم ثنائي الاتجاه */
export function XLOOKUP(
  lookupValue: unknown,
  lookupArray: unknown[],
  returnArray: unknown[],
  ifNotFound: unknown = '#N/A'
): unknown {
  if (!Array.isArray(lookupArray) || !Array.isArray(returnArray)) {
    throw new FormulaError('#VALUE!', 'Lookup and return arrays are required');
  }

  const flatLookup = flatten(lookupArray);
  const flatReturn = flatten(returnArray);
  const targetStr = String(lookupValue).trim().toLowerCase();

  for (let i = 0; i < flatLookup.length; i++) {
    if (String(flatLookup[i]).trim().toLowerCase() === targetStr) {
      return flatReturn[i] !== undefined ? flatReturn[i] : null;
    }
  }

  if (ifNotFound === '#N/A') {
    throw new FormulaError('#N/A', 'XLOOKUP match not found');
  }
  return ifNotFound;
}

/** IFS: تقييم شروط متعددة وإرجاع نتيجة أول شرط صحيح */
export function IFS(...args: unknown[]): unknown {
  if (args.length < 2 || args.length % 2 !== 0) {
    throw new FormulaError('#VALUE!', 'IFS requires pairs of conditions and values');
  }
  for (let i = 0; i < args.length; i += 2) {
    const condition = args[i];
    const isTrue = condition === true || condition === 'TRUE' || (typeof condition === 'number' && condition !== 0);
    if (isTrue) {
      return args[i + 1];
    }
  }
  throw new FormulaError('#N/A', 'No condition evaluated to true in IFS');
}

/** SWITCH: مطابقة تعبير بقيم متعددة */
export function SWITCH(expression: unknown, ...args: unknown[]): unknown {
  if (args.length < 2) {
    throw new FormulaError('#VALUE!', 'SWITCH requires at least expression, value, and result');
  }
  const expStr = String(expression).trim().toLowerCase();

  for (let i = 0; i < args.length - 1; i += 2) {
    const matchVal = String(args[i]).trim().toLowerCase();
    if (matchVal === expStr) {
      return args[i + 1];
    }
  }

  // Default value if odd number of args left
  if (args.length % 2 !== 0) {
    return args[args.length - 1];
  }

  throw new FormulaError('#N/A', 'No matching case in SWITCH');
}

/** DATE: إنشاء تاريخ بتنسيق ISO */
export function DATE(year: unknown, month: unknown, day: unknown): string {
  const y = toNum(year);
  const m = toNum(month);
  const d = toNum(day);
  if (y === null || m === null || d === null) {
    throw new FormulaError('#VALUE!', 'DATE requires numeric year, month, and day');
  }
  const date = new Date(y, m - 1, d);
  const yStr = String(date.getFullYear()).padStart(4, '0');
  const mStr = String(date.getMonth() + 1).padStart(2, '0');
  const dStr = String(date.getDate()).padStart(2, '0');
  return `${yStr}-${mStr}-${dStr}`;
}

/** TODAY: تاريخ اليوم بتنسيق YYYY-MM-DD */
export function TODAY(): string {
  const now = new Date();
  const y = String(now.getFullYear()).padStart(4, '0');
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** NOW: تاريخ ووقت اللحظة */
export function NOW(): string {
  return new Date().toISOString();
}

/** DATEDIF: حساب الفرق بين تاريخين بوحدات Y, M, D */
export function DATEDIF(startDate: unknown, endDate: unknown, unit: unknown = 'D'): number {
  const s = new Date(String(startDate));
  const e = new Date(String(endDate));
  if (isNaN(s.getTime()) || isNaN(e.getTime())) {
    throw new FormulaError('#VALUE!', 'Invalid date format in DATEDIF');
  }
  if (s > e) {
    throw new FormulaError('#NUM!', 'Start date cannot be after end date');
  }

  const u = String(unit).toUpperCase().trim();
  const diffMs = e.getTime() - s.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (u === 'D') return diffDays;
  if (u === 'Y') {
    let years = e.getFullYear() - s.getFullYear();
    const m = e.getMonth() - s.getMonth();
    if (m < 0 || (m === 0 && e.getDate() < s.getDate())) {
      years--;
    }
    return Math.max(0, years);
  }
  if (u === 'M') {
    let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    if (e.getDate() < s.getDate()) {
      months--;
    }
    return Math.max(0, months);
  }

  return diffDays;
}
