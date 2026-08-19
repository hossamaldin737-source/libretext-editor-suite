/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: cell-utils.ts
  * 📂 المسار: packages/algorithms/src/formula/cell-utils.ts
  * 🎯 الهدف الرئيسي: دوال مساعدة لمعالجة مراجع الخلايا والمقارنات
  * 📋 المعايير: صفر اعتماديات، دعم Excel-style comparisons
  * 🧪 الاختبارات: packages/algorithms/tests/formula/cell-utils.test.ts
  * 🏷️ المعرف: ALGO-011
  * 📅 تاريخ الإنشاء: 2026-08-19
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Excel-Compatible Comparison + Cell Reference Conversion
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. Column conversion (A=1, Z=26, AA=27)
  *    2. Excel-style equality (5 = "5" → true)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - Input validation for cell references
  *    - Type-safe comparison functions
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: Excel Reference System
  * ═══════════════════════════════════════════════════════════════════════════
  */

/** تحويل اسم العمود إلى فهرس رقمي (A=0, B=1, ..., Z=25, AA=26) */
export function columnToIndex(col: string): number {
  const upper = col.toUpperCase();
  let index = 0;
  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }
  return index - 1;
}

/** تحويل الفهرس الرقمي إلى اسم عمود (0=A, 1=B, ..., 25=Z, 26=AA) */
export function indexToColumn(index: number): string {
  let col = '';
  let idx = index;
  while (idx >= 0) {
    col = String.fromCharCode((idx % 26) + 65) + col;
    idx = Math.floor(idx / 26) - 1;
  }
  return col;
}

/** توسيع نطاق الخلايا (A1:B2) إلى قائمة مراجع */
export function expandCellRange(from: string, to: string): string[] {
  const fromMatch = from.match(/^([A-Z]+)(\d+)$/);
  const toMatch = to.match(/^([A-Z]+)(\d+)$/);
  if (!fromMatch || !toMatch) {
    throw new Error(`Invalid range: ${from}:${to}`);
  }
  const fromCol = columnToIndex(fromMatch[1]);
  const fromRow = parseInt(fromMatch[2], 10);
  const toCol = columnToIndex(toMatch[1]);
  const toRow = parseInt(toMatch[2], 10);
  const refs: string[] = [];
  for (let row = fromRow; row <= toRow; row++) {
    for (let col = fromCol; col <= toCol; col++) {
      refs.push(indexToColumn(col) + row);
    }
  }
  return refs;
}

/** مقارنة Excel-style (5 = "5" → true) */
export function excelEquals(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    return a.length === b.length && a.every((val, i) => excelEquals(val, b[i]));
  }
  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA === 'number' && typeB === 'string') {
    return a === parseFloat(b as string);
  }
  if (typeA === 'string' && typeB === 'number') {
    return parseFloat(a as string) === b;
  }
  return false;
}

/** مقارنة عامة (تدعم الأرقام والنصوص والمنطق) */
export function compare(a: unknown, b: unknown): number {
  if (Array.isArray(a) || Array.isArray(b)) {
    throw new Error('Cannot compare ranges directly');
  }
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return (a ? 1 : 0) - (b ? 1 : 0);
  }
  // محاولة التحويل إلى رقم
  const numA = typeof a === 'number' ? a : parseFloat(String(a));
  const numB = typeof b === 'number' ? b : parseFloat(String(b));
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
  throw new Error(`Cannot compare ${typeof a} with ${typeof b}`);
}
