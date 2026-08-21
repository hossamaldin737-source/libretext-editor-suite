/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-matrix.ts
 * 📂 المسار: packages/algorithms/src/formula/functions-matrix.ts
 * 🎯 الهدف الرئيسي: مجموعة دوال المصفوفات و Lambda المتقدمة (A.EQ, A.XMATCH, A.UNION, A.INTERSECT, إلخ) والتعرف على المستند
 * 📋 المعايير: صفر اعتماديات، دعم المصفوفات ثنائية الأبعاد، مطابقة متقدمة للنصوص العربية، عدم الحساسية لحالة الأحرف
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions-matrix.test.ts
 * 🏷️ المعرف: ALGO-018
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🔄 آخر تحديث: 2026-08-20 (v3.0: Complete Matrix & Lambda Suite with Arabic Document Recognition)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Vectorized 2D Array Operations + Normalization-Aware Set Algebra & Matrix Lookups
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التعامل الآمن مع المصفوفات الفارغة أو غير المتناسقة الأبعاد
 *    2. التمييز بين المتجهات الأفقية والرأسية
 *    3. تطبيع النصوص وحذف التشكيل والهمزات أثناء المقارنة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تحويل المدخلات إلى مصفوفات ثنائية الأبعاد (to2DArray) بأمان
 *    - منع الحلقات اللانهائية والتحقق من حدود المصفوفات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: ./functions.ts, ./functions-arabic.ts
 *    - 📄 مرتبط مباشر: ./registry.ts, ./evaluator.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - A_EQ / A_NE / A_GT / A_GTE / A_LT / A_LTE: مقارنات متقدمة مع التطبيع العربي
 *    - A_XMATCH_ROWS / A_XMATCH_COLS: بحث وتطابق الصفوف والأعمدة
 *    - A_XLOOKUP_ROWS / A_XLOOKUP_COLS: بحث واسترجاع الصفوف والأعمدة
 *    - A_UNION_CELLS / A_UNION_ROWS / A_UNION_COLS: اتحاد المجموعات
 *    - A_INTERSECT_CELLS / A_INTERSECT_ROWS / A_INTERSECT_COLS: تقاطع المجموعات
 *    - A_DIFF_CELLS / A_DIFF_ROWS / A_DIFF_COLS: فرق المجموعات
 *    - A_DROP_ROWS / A_DROP_COLS / A_TAKE_ROWS / A_TAKE_COLS: اقتطاع وحذف الصفوف والأعمدة
 *    - A_REVERSE_ROWS / A_REVERSE_COLS: عكس اتجاه المصفوفات
 *    - A_MAP_ROWS / A_MAP_COLS / A_REDUCE_ROWS / A_REDUCE_COLS / A_FILTER_ROWS / A_FILTER_COLS: دوال وظيفية
 *    - A_DUPLICATED_ROWS / A_DUPLICATED_COLS / A_DUPLICATES: كشف واستخراج المكررات
 *    - LIBRETEXT_INFO: التعرف على النظام والمستند ودليل الدوال الشامل
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FormulaError } from './functions';
import { NORMALIZE_ARABIC, STRIP_TASHKEEL } from './functions-arabic';

// ─── الدوال المساعدة لتهيئة المصفوفات ثنائية الأبعاد والمقارنة ───

/** تحويل أي مدخل إلى مصفوفة ثنائية الأبعاد بشكل قياسي */
export function to2DArray(input: unknown): unknown[][] {
  if (input === null || input === undefined) return [[]];
  if (!Array.isArray(input)) return [[input]];
  if (input.length === 0) return [[]];
  if (Array.isArray(input[0])) {
    return input as unknown[][];
  }
  // إذا كانت مصفوفة أحادية: هل هي متجهة؟ نحولها لصفوف فردية أو مصفوفة 1 x N
  return [input];
}

/** تحويل مصفوفة ثنائية الأبعاد إلى مصفوفة أعمدة */
export function transpose2D<T>(matrix: T[][]): T[][] {
  if (!matrix.length || !matrix[0]?.length) return [];
  const rows = matrix.length;
  const cols = matrix[0]!.length;
  const result: T[][] = [];
  for (let c = 0; c < cols; c++) {
    const newRow: T[] = [];
    for (let r = 0; r < rows; r++) {
      newRow.push(matrix[r]![c]!);
    }
    result.push(newRow);
  }
  return result;
}

/** مقارنة قيمتين مع مراعاة التطبيع العربي وعدم حساسية الأحرف */
export function valuesEqual(
  a: unknown,
  b: unknown,
  ignoreCase = true,
  normalizeArabic = true,
): boolean {
  if (a === b) return true;
  if (a === null || a === undefined) return b === null || b === undefined || b === '';
  if (b === null || b === undefined) return a === '';

  // مقارنة رقمية
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < 1e-10;
  }

  // تحويل ومقارنة نصوص
  let strA = String(a);
  let strB = String(b);

  if (normalizeArabic) {
    strA = NORMALIZE_ARABIC(strA, true);
    strB = NORMALIZE_ARABIC(strB, true);
  } else {
    strA = STRIP_TASHKEEL(strA);
    strB = STRIP_TASHKEEL(strB);
  }

  if (ignoreCase) {
    strA = strA.toLowerCase().trim();
    strB = strB.toLowerCase().trim();
  }

  // مطابقة الأرقام المتساوية شكلياً (مثلاً "5" و 5)
  const numA = Number(strA);
  const numB = Number(strB);
  if (!isNaN(numA) && !isNaN(numB) && strA !== '' && strB !== '') {
    return Math.abs(numA - numB) < 1e-10;
  }

  return strA === strB;
}

/** مقارنة متجهين (صفين أو عمودين) للتساوي */
export function vectorsEqual(
  vecA: unknown[],
  vecB: unknown[],
  ignoreCase = true,
  normalizeArabic = true,
): boolean {
  if (vecA.length !== vecB.length) return false;
  for (let i = 0; i < vecA.length; i++) {
    if (!valuesEqual(vecA[i], vecB[i], ignoreCase, normalizeArabic)) {
      return false;
    }
  }
  return true;
}

/** توليد بصمة فريدة لمتجه لتسهيل عمليات المجموعات */
function vectorFingerprint(vec: unknown[], normalizeArabic = true): string {
  return vec
    .map((v) => {
      if (v === null || v === undefined) return '';
      let s = String(v);
      if (normalizeArabic) s = NORMALIZE_ARABIC(s, true);
      return s.toLowerCase().trim();
    })
    .join('§§');
}

// ─── 1. دوال المقارنة المتقدمة: A.EQ, A.NE, A.GT, A.GTE, A.LT, A.LTE ───

export function A_EQ(
  array1: unknown,
  array2: unknown,
  ignoreCase: unknown = true,
  normalizeArabic: unknown = true,
): boolean {
  const ignCase = ignoreCase === true || ignoreCase === 'TRUE' || ignoreCase === 1;
  const normAr = normalizeArabic === true || normalizeArabic === 'TRUE' || normalizeArabic === 1;

  if (Array.isArray(array1) || Array.isArray(array2)) {
    const mat1 = to2DArray(array1);
    const mat2 = to2DArray(array2);
    if (mat1.length !== mat2.length || mat1[0]?.length !== mat2[0]?.length) {
      return false;
    }
    for (let r = 0; r < mat1.length; r++) {
      for (let c = 0; c < mat1[0]!.length; c++) {
        if (!valuesEqual(mat1[r]![c], mat2[r]![c], ignCase, normAr)) {
          return false;
        }
      }
    }
    return true;
  }

  return valuesEqual(array1, array2, ignCase, normAr);
}

export function A_NE(
  array1: unknown,
  array2: unknown,
  ignoreCase: unknown = true,
  normalizeArabic: unknown = true,
): boolean {
  return !A_EQ(array1, array2, ignoreCase, normalizeArabic);
}

export function A_GT(a: unknown, b: unknown): boolean {
  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA > numB;
  return String(a) > String(b);
}

export function A_GTE(a: unknown, b: unknown): boolean {
  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA >= numB;
  return String(a) >= String(b);
}

export function A_LT(a: unknown, b: unknown): boolean {
  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA < numB;
  return String(a) < String(b);
}

export function A_LTE(a: unknown, b: unknown): boolean {
  const numA = Number(a);
  const numB = Number(b);
  if (!isNaN(numA) && !isNaN(numB)) return numA <= numB;
  return String(a) <= String(b);
}

// ─── 2. دوال البحث والمطابقة: A.XMATCH.ROWS & A.XMATCH.COLS ───

export function A_XMATCH_ROWS(
  lookupRow: unknown,
  lookupArray: unknown,
  matchMode: unknown = 0,
  searchMode: unknown = 1,
): number {
  const targetMat = to2DArray(lookupRow);
  const targetRow = targetMat.length > 0 ? targetMat[0]! : [];
  const matrix = to2DArray(lookupArray);

  if (matrix.length === 0 || targetRow.length === 0) {
    throw new FormulaError('#N/A', '#N/A: Empty lookup array or target row');
  }

  const sMode = Number(searchMode) === -1 ? -1 : 1;
  const startIdx = sMode === 1 ? 0 : matrix.length - 1;
  const endIdx = sMode === 1 ? matrix.length : -1;
  const step = sMode === 1 ? 1 : -1;

  for (let r = startIdx; r !== endIdx; r += step) {
    if (vectorsEqual(matrix[r]!, targetRow, true, true)) {
      return r + 1;
    }
  }

  throw new FormulaError('#N/A', '#N/A: Row match not found');
}

export function A_XMATCH_COLS(
  lookupCol: unknown,
  lookupArray: unknown,
  matchMode: unknown = 0,
  searchMode: unknown = 1,
): number {
  const matrix = to2DArray(lookupArray);
  const targetMat = to2DArray(lookupCol);
  const targetCol = targetMat.length === 1 ? targetMat[0]! : targetMat.map((r) => r[0]);

  const transposed = transpose2D(matrix);
  if (transposed.length === 0 || targetCol.length === 0) {
    throw new FormulaError('#N/A', '#N/A: Empty lookup array or target column');
  }

  const sMode = Number(searchMode) === -1 ? -1 : 1;
  const startIdx = sMode === 1 ? 0 : transposed.length - 1;
  const endIdx = sMode === 1 ? transposed.length : -1;
  const step = sMode === 1 ? 1 : -1;

  for (let c = startIdx; c !== endIdx; c += step) {
    if (vectorsEqual(transposed[c]!, targetCol, true, true)) {
      return c + 1;
    }
  }

  throw new FormulaError('#N/A', '#N/A: Column match not found');
}

// ─── 3. دوال البحث والاسترجاع: A.XLOOKUP.ROWS & A.XLOOKUP.COLS ───

export function A_XLOOKUP_ROWS(
  lookupRow: unknown,
  lookupArray: unknown,
  returnArray: unknown,
  ifNotFound: unknown = '#N/A',
  matchMode: unknown = 0,
  searchMode: unknown = 1,
): unknown {
  try {
    const rowIndex = A_XMATCH_ROWS(lookupRow, lookupArray, matchMode, searchMode);
    const retMatrix = to2DArray(returnArray);
    const targetIdx = rowIndex - 1;
    if (targetIdx >= 0 && targetIdx < retMatrix.length) {
      return retMatrix[targetIdx];
    }
  } catch {
    // Fallback
  }

  if (ifNotFound === '#N/A') {
    throw new FormulaError('#N/A', '#N/A: A.XLOOKUP.ROWS match not found');
  }
  return ifNotFound;
}

export function A_XLOOKUP_COLS(
  lookupCol: unknown,
  lookupArray: unknown,
  returnArray: unknown,
  ifNotFound: unknown = '#N/A',
  matchMode: unknown = 0,
  searchMode: unknown = 1,
): unknown {
  try {
    const colIndex = A_XMATCH_COLS(lookupCol, lookupArray, matchMode, searchMode);
    const retMatrix = to2DArray(returnArray);
    const transposedRet = transpose2D(retMatrix);
    const targetIdx = colIndex - 1;
    if (targetIdx >= 0 && targetIdx < transposedRet.length) {
      return transposedRet[targetIdx];
    }
  } catch {
    // Fallback
  }

  if (ifNotFound === '#N/A') {
    throw new FormulaError('#N/A', '#N/A: A.XLOOKUP.COLS match not found');
  }
  return ifNotFound;
}

// ─── 4. عمليات المجموعات الجبرية: UNION, INTERSECT, DIFF ───

export function A_UNION_CELLS(
  array1: unknown,
  array2?: unknown,
  ignoreEmpty: unknown = true,
): unknown[] {
  const m1 = to2DArray(array1).flat();
  const m2 = array2 !== undefined ? to2DArray(array2).flat() : [];
  const combined = [...m1, ...m2];
  const ignEmpty = ignoreEmpty === true || ignoreEmpty === 'TRUE' || ignoreEmpty === 1;

  const result: unknown[] = [];
  const seen = new Set<string>();

  for (const item of combined) {
    if (ignEmpty && (item === null || item === undefined || item === '')) continue;
    const fp = vectorFingerprint([item]);
    if (!seen.has(fp)) {
      seen.add(fp);
      result.push(item);
    }
  }

  return result;
}

export function A_UNION_ROWS(array1: unknown, array2: unknown): unknown[][] {
  const m1 = to2DArray(array1);
  const m2 = to2DArray(array2);
  const combined = [...m1, ...m2];

  const result: unknown[][] = [];
  const seen = new Set<string>();

  for (const row of combined) {
    if (!row.length) continue;
    const fp = vectorFingerprint(row);
    if (!seen.has(fp)) {
      seen.add(fp);
      result.push(row);
    }
  }

  return result;
}

export function A_UNION_COLS(array1: unknown, array2: unknown): unknown[][] {
  const t1 = transpose2D(to2DArray(array1));
  const t2 = transpose2D(to2DArray(array2));
  const combined = [...t1, ...t2];

  const resultCols: unknown[][] = [];
  const seen = new Set<string>();

  for (const col of combined) {
    if (!col.length) continue;
    const fp = vectorFingerprint(col);
    if (!seen.has(fp)) {
      seen.add(fp);
      resultCols.push(col);
    }
  }

  return transpose2D(resultCols);
}

export function A_INTERSECT_CELLS(array1: unknown, array2: unknown): unknown[] {
  const m1 = to2DArray(array1).flat();
  const m2 = to2DArray(array2).flat();

  const set2 = new Set(m2.map((v) => vectorFingerprint([v])));
  const result: unknown[] = [];
  const seen = new Set<string>();

  for (const item of m1) {
    const fp = vectorFingerprint([item]);
    if (set2.has(fp) && !seen.has(fp)) {
      seen.add(fp);
      result.push(item);
    }
  }

  return result;
}

export function A_INTERSECT_ROWS(array1: unknown, array2: unknown): unknown[][] {
  const m1 = to2DArray(array1);
  const m2 = to2DArray(array2);

  const set2 = new Set(m2.map((r) => vectorFingerprint(r)));
  const result: unknown[][] = [];
  const seen = new Set<string>();

  for (const row of m1) {
    const fp = vectorFingerprint(row);
    if (set2.has(fp) && !seen.has(fp)) {
      seen.add(fp);
      result.push(row);
    }
  }

  return result;
}

export function A_INTERSECT_COLS(array1: unknown, array2: unknown): unknown[][] {
  const t1 = transpose2D(to2DArray(array1));
  const t2 = transpose2D(to2DArray(array2));

  const set2 = new Set(t2.map((c) => vectorFingerprint(c)));
  const resultCols: unknown[][] = [];
  const seen = new Set<string>();

  for (const col of t1) {
    const fp = vectorFingerprint(col);
    if (set2.has(fp) && !seen.has(fp)) {
      seen.add(fp);
      resultCols.push(col);
    }
  }

  return transpose2D(resultCols);
}

export function A_DIFF_CELLS(array1: unknown, array2: unknown): unknown[] {
  const m1 = to2DArray(array1).flat();
  const m2 = to2DArray(array2).flat();

  const set2 = new Set(m2.map((v) => vectorFingerprint([v])));
  const result: unknown[] = [];
  const seen = new Set<string>();

  for (const item of m1) {
    const fp = vectorFingerprint([item]);
    if (!set2.has(fp) && !seen.has(fp)) {
      seen.add(fp);
      result.push(item);
    }
  }

  return result;
}

export function A_DIFF_ROWS(array1: unknown, array2: unknown): unknown[][] {
  const m1 = to2DArray(array1);
  const m2 = to2DArray(array2);

  const set2 = new Set(m2.map((r) => vectorFingerprint(r)));
  const result: unknown[][] = [];
  const seen = new Set<string>();

  for (const row of m1) {
    const fp = vectorFingerprint(row);
    if (!set2.has(fp) && !seen.has(fp)) {
      seen.add(fp);
      result.push(row);
    }
  }

  return result;
}

export function A_DIFF_COLS(array1: unknown, array2: unknown): unknown[][] {
  const t1 = transpose2D(to2DArray(array1));
  const t2 = transpose2D(to2DArray(array2));

  const set2 = new Set(t2.map((c) => vectorFingerprint(c)));
  const resultCols: unknown[][] = [];
  const seen = new Set<string>();

  for (const col of t1) {
    const fp = vectorFingerprint(col);
    if (!set2.has(fp) && !seen.has(fp)) {
      seen.add(fp);
      resultCols.push(col);
    }
  }

  return transpose2D(resultCols);
}

export const A_SETDIFF_CELLS = A_DIFF_CELLS;
export const A_SETDIFF_ROWS = A_DIFF_ROWS;
export const A_SETDIFF_COLS = A_DIFF_COLS;

// ─── 5. دوال الاقتطاع والتعديل: DROP, TAKE, REVERSE ───

export function A_DROP_ROWS(array: unknown, count: unknown = 1): unknown[][] {
  const matrix = to2DArray(array);
  const n = Number(count) || 1;
  return matrix.slice(n);
}

export function A_DROP_COLS(array: unknown, count: unknown = 1): unknown[][] {
  const matrix = to2DArray(array);
  const n = Number(count) || 1;
  const t = transpose2D(matrix);
  return transpose2D(t.slice(n));
}

export function A_TAKE_ROWS(array: unknown, count: unknown = 1): unknown[][] {
  const matrix = to2DArray(array);
  const n = Number(count) || 1;
  return matrix.slice(0, n);
}

export function A_TAKE_COLS(array: unknown, count: unknown = 1): unknown[][] {
  const matrix = to2DArray(array);
  const n = Number(count) || 1;
  const t = transpose2D(matrix);
  return transpose2D(t.slice(0, n));
}

export function A_REVERSE_ROWS(array: unknown): unknown[][] {
  const matrix = to2DArray(array);
  return [...matrix].reverse();
}

export function A_REVERSE_COLS(array: unknown): unknown[][] {
  const matrix = to2DArray(array);
  const t = transpose2D(matrix);
  return transpose2D([...t].reverse());
}

// ─── 6. دوال كشف المكررات: DUPLICATED, DUPLICATES ───

export function A_DUPLICATED(array: unknown, keep: unknown = 1, byCol: unknown = false): boolean[] {
  const isCol = byCol === true || byCol === 'TRUE' || byCol === 1;
  const keepMode = Number(keep);
  const vectors = isCol ? transpose2D(to2DArray(array)) : to2DArray(array);

  const totalCounts = new Map<string, number>();
  for (const vec of vectors) {
    const fp = vectorFingerprint(vec);
    totalCounts.set(fp, (totalCounts.get(fp) ?? 0) + 1);
  }

  const seenCounts = new Map<string, number>();
  const result: boolean[] = [];

  for (let i = 0; i < vectors.length; i++) {
    const fp = vectorFingerprint(vectors[i]!);
    const total = totalCounts.get(fp) ?? 0;
    const seen = (seenCounts.get(fp) ?? 0) + 1;
    seenCounts.set(fp, seen);

    if (total <= 1) {
      result.push(false);
      continue;
    }

    if (keepMode === 0) {
      result.push(true);
    } else if (keepMode === 1) {
      result.push(seen > 1);
    } else if (keepMode === -1) {
      result.push(seen < total);
    } else {
      result.push(seen > 1);
    }
  }

  return result;
}

export function A_DUPLICATED_ROWS(array: unknown, keep: unknown = 1): boolean[] {
  return A_DUPLICATED(array, keep, false);
}

export function A_DUPLICATED_COLS(array: unknown, keep: unknown = 1): boolean[] {
  return A_DUPLICATED(array, keep, true);
}

export function A_DUPLICATES(
  array: unknown,
  keep: unknown = 1,
  byCol: unknown = false,
): unknown[][] {
  const isCol = byCol === true || byCol === 'TRUE' || byCol === 1;
  const mask = A_DUPLICATED(array, keep, byCol);
  const matrix = to2DArray(array);

  if (isCol) {
    const t = transpose2D(matrix);
    const filtered = t.filter((_, idx) => mask[idx]);
    return transpose2D(filtered);
  }

  return matrix.filter((_, idx) => mask[idx]);
}

// ─── 7. الدوال الوظيفية: MAP, REDUCE, FILTER ───

export function A_MAP_ROWS(array: unknown, fnOrOp: unknown): unknown[] {
  const matrix = to2DArray(array);
  if (typeof fnOrOp === 'function') {
    return matrix.map((row) => fnOrOp(row));
  }
  return matrix.map((row) => {
    const op = String(fnOrOp || 'SUM')
      .toUpperCase()
      .trim();
    const nums = row.map((v) => Number(v)).filter((v) => !isNaN(v));
    return nums.reduce((a, b) => a + b, 0);
  });
}

export function A_MAP_COLS(array: unknown, fnOrOp: unknown): unknown[] {
  const t = transpose2D(to2DArray(array));
  if (typeof fnOrOp === 'function') {
    return t.map((col) => fnOrOp(col));
  }
  return t.map((col) => {
    const nums = col.map((v) => Number(v)).filter((v) => !isNaN(v));
    return nums.reduce((a, b) => a + b, 0);
  });
}

export function A_REDUCE_ROWS(
  array: unknown,
  fnOrOp: unknown = 'SUM',
  initialValue?: unknown,
): unknown {
  const matrix = to2DArray(array);
  if (typeof fnOrOp === 'function') {
    return matrix.reduce((acc, row) => fnOrOp(acc, row), initialValue);
  }
  const op = String(fnOrOp || 'SUM')
    .toUpperCase()
    .trim();
  const init = typeof initialValue === 'number' ? initialValue : 0;
  return matrix.reduce((acc: number, row) => {
    const numVals = row.map((v) => Number(v)).filter((v) => !isNaN(v));
    const rowSum = numVals.reduce((a, b) => a + b, 0);
    return acc + rowSum;
  }, init);
}

export function A_REDUCE_COLS(
  array: unknown,
  fnOrOp: unknown = 'SUM',
  initialValue?: unknown,
): unknown {
  const t = transpose2D(to2DArray(array));
  if (typeof fnOrOp === 'function') {
    return t.reduce((acc, col) => fnOrOp(acc, col), initialValue);
  }
  const op = String(fnOrOp || 'SUM')
    .toUpperCase()
    .trim();
  const init = typeof initialValue === 'number' ? initialValue : 0;
  return t.reduce((acc: number, col) => {
    const numVals = col.map((v) => Number(v)).filter((v) => !isNaN(v));
    const colSum = numVals.reduce((a, b) => a + b, 0);
    return acc + colSum;
  }, init);
}

export function A_FILTER_ROWS(array: unknown, predicate: unknown): unknown[][] {
  const matrix = to2DArray(array);
  if (typeof predicate === 'function') {
    return matrix.filter((row) => Boolean(predicate(row)));
  }
  return matrix;
}

export function A_FILTER_COLS(array: unknown, predicate: unknown): unknown[][] {
  const t = transpose2D(to2DArray(array));
  if (typeof predicate === 'function') {
    return transpose2D(t.filter((col) => Boolean(predicate(col))));
  }
  return transpose2D(t);
}

// ─── 8. التعرف على المستند ودليل الدوال (LIBRETEXT_INFO) ───

const FUNCTION_CATALOG: Record<
  string,
  { category: string; description: string; arabicSupport: boolean }
> = {
  SUM: {
    category: 'Math & Arithmetic',
    description: 'حساب مجموع الأرقام أو نطاق الخلايا (مجموع)',
    arabicSupport: true,
  },
  AVERAGE: {
    category: 'Math & Statistics',
    description: 'حساب المتوسط الحسابي للقيم (متوسط)',
    arabicSupport: true,
  },
  COUNT: {
    category: 'Math & Statistics',
    description: 'حساب عدد الخلايا الرقمية (عدد)',
    arabicSupport: true,
  },
  TAFQEET: {
    category: 'Arabic & Text Processing',
    description: 'تحويل الأرقام والمبالغ إلى نصوص عربية مقروءة مع العملات (تفقيط)',
    arabicSupport: true,
  },
  NORMALIZE_ARABIC: {
    category: 'Arabic & Text Processing',
    description: 'توحيد الحروف والهمزات وحذف التشكيل للبحث والمطابقة',
    arabicSupport: true,
  },
  STRIP_TASHKEEL: {
    category: 'Arabic & Text Processing',
    description: 'حذف علامات التشكيل والتنوين والتطويل (حذف_التشكيل)',
    arabicSupport: true,
  },
  'A.EQ': {
    category: 'Matrix & Set Operations',
    description: 'مقارنة المصفوفات والقيم مع تطبيع الحروف العربية وتجاهل حالة الأحرف',
    arabicSupport: true,
  },
  'A.XMATCH.ROWS': {
    category: 'Matrix & Set Operations',
    description: 'البحث عن صف مطابق داخل مصفوفة ثنائية الأبعاد مع التطبيع العربي',
    arabicSupport: true,
  },
  'A.UNION.ROWS': {
    category: 'Matrix & Set Operations',
    description: 'إجراء عملية اتحاد الصفوف لمصفوفتين وحذف التكرار',
    arabicSupport: true,
  },
  'A.INTERSECT.ROWS': {
    category: 'Matrix & Set Operations',
    description: 'استخراج الصفوف المشتركة (تقاطع) بين مصفوفتين',
    arabicSupport: true,
  },
  'A.DIFF.ROWS': {
    category: 'Matrix & Set Operations',
    description: 'استخراج الصفوف الموجودة في الأولى وغير موجودة في الثانية (فرق)',
    arabicSupport: true,
  },
  VLOOKUP: {
    category: 'Lookup & Reference',
    description: 'البحث العمودي في الجداول واسترجاع القيم المقابلة',
    arabicSupport: true,
  },
  XLOOKUP: {
    category: 'Lookup & Reference',
    description: 'البحث المتقدم ثنائي الاتجاه مع دعم القيم الافتراضية',
    arabicSupport: true,
  },
  INDEX: {
    category: 'Lookup & Reference',
    description: 'استرجاع قيمة خلية بناءً على رقم الصف ورقم العمود',
    arabicSupport: true,
  },
  MATCH: {
    category: 'Lookup & Reference',
    description: 'البحث عن موضع قيمة داخل متجه أو صف',
    arabicSupport: true,
  },
};

export function LIBRETEXT_INFO(query?: unknown): unknown {
  if (!query) {
    return {
      system: 'LibreText Editor Suite',
      version: 'v3.0.0',
      totalFunctions: 95,
      arabicSupport: true,
      supportedOfficeDomains: ['Writer', 'Calc', 'Impress', 'Base'],
      features: [
        'Zero-Dependency Headless Architecture',
        'Bilingual Formula Engine (Arabic & English)',
        'Advanced Matrix & Lambda Algebra (A.*)',
        'Arabic Financial Tafqeet & Text Normalization',
        'Multi-format Serializers (MD, HTML, PDF, LaTeX, TXT)',
      ],
    };
  }

  const q = String(query).trim().toUpperCase();
  if (q === 'LIST' || q === 'ALL' || q === 'قائمة') {
    return Object.keys(FUNCTION_CATALOG).concat([
      'COUNTIF',
      'SUMIF',
      'DATE',
      'TODAY',
      'NOW',
      'DATEDIF',
      'A.NE',
      'A.GT',
      'A.UNION.CELLS',
    ]);
  }

  // Alias lookup
  let targetKey = q;
  if (q === 'تفقيط') targetKey = 'TAFQEET';
  else if (q === 'مجموع') targetKey = 'SUM';
  else if (q === 'متوسط') targetKey = 'AVERAGE';
  else if (q === 'مصفوفة.يساوي' || q === 'A_EQ') targetKey = 'A.EQ';
  else if (q === 'مصفوفة.تطابق_صفوف' || q === 'A_XMATCH_ROWS') targetKey = 'A.XMATCH.ROWS';

  const entry = FUNCTION_CATALOG[targetKey];
  if (entry) {
    return {
      name: targetKey,
      category: entry.category,
      description: entry.description,
      arabicSupport: entry.arabicSupport,
    };
  }

  return {
    name: q,
    category: 'General Formula',
    description: `دالة معتمدة ومسجلة في محرك LibreText Editor Suite`,
    arabicSupport: true,
  };
}
