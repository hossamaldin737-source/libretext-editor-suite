/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: hlookup.ts
 * 📂 المسار: src/algorithms/lookup/hlookup.ts
 * 🎯 الهدف الرئيسي: تنفيذ دالة البحث الأفقي HLOOKUP بدقة معمارية عالية
 * 📋 المعايير: دعم البحث التقريبي والدقيق ومعالجة الأنواع والحدود
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-018-LOOKUP
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hybrid Binary-Search + Linear Exact Type-Aware Matcher
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. إرجاع #REF! عند تجاوز رقم الصف حدود الجدول
 *    2. إرجاع #N/A عند عدم العثور على أي تطابق
 *    3. البحث التقريبي يفترض ترتيب الصف الأول تصاعدياً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المصفوفات الفارغة أو الصفوف غير المتطابقة
 *    - معالجة القيم الفارغة و null و undefined بأمان
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: src/algorithms/types.ts
 *    - 📄 مرتبط مباشر: src/algorithms/index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - HLOOKUP: دالة البحث الأفقي في الجداول (#L60)
 *    - compareValues: مقارنة قيمتين متعددة الأنواع (#L92)
 *    - exactSearchRow: البحث عن التطابق الدقيق (#L118)
 *    - binarySearchRow: البحث التقريبي الثنائي (#L132)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: OASIS OpenDocument Standard (2009)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// @function-index: #1/4 — HLOOKUP
// @see: FUNCTION_INDEX.md#L45

/**
 * بحث أفقي في الجداول (Horizontal Lookup)
 * يبحث عن قيمة في الصف الأول لمصفوفة، ويعيد القيمة المقابلة في صف محدد
 *
 * @param lookupValue - القيمة المراد البحث عنها
 * @param tableArray - المصفوفة ثنائية الأبعاد (صفوف × أعمدة)
 * @param rowIndex - رقم الصف المطلوب إرجاع القيمة منه (يبدأ من 1)
 * @param rangeLookup - true: بحث تقريبي، false: بحث دقيق (الافتراضي false)
 * @returns القيمة المستخرجة أو '#N/A' أو '#REF!'
 */
export function HLOOKUP(
  lookupValue: unknown,
  tableArray: readonly (readonly unknown[])[],
  rowIndex: number,
  rangeLookup: boolean = false,
): unknown {
  if (!tableArray || tableArray.length === 0) {
    return '#N/A';
  }

  const firstRow = tableArray[0];
  if (!firstRow || firstRow.length === 0) {
    return '#N/A';
  }

  if (rowIndex < 1 || rowIndex > tableArray.length) {
    return '#REF!';
  }

  let matchedColumnIndex = -1;

  if (rangeLookup) {
    matchedColumnIndex = binarySearchRow(firstRow, lookupValue);
  } else {
    matchedColumnIndex = exactSearchRow(firstRow, lookupValue);
  }

  if (matchedColumnIndex === -1) {
    return '#N/A';
  }

  const targetRow = tableArray[rowIndex - 1];
  if (!targetRow || matchedColumnIndex >= targetRow.length) {
    return '#N/A';
  }

  const result = targetRow[matchedColumnIndex];
  return result !== undefined ? result : '#N/A';
}

/**
 * مقارنة متقدمة بين قيمتين مع دعم الأرقام، النصوص، والتواريخ
 */
export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;

  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return 0;
    return a - b;
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b, undefined, { sensitivity: 'accent', numeric: true });
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }

  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return (a ? 1 : 0) - (b ? 1 : 0);
  }

  const strA = String(a).toLowerCase();
  const strB = String(b).toLowerCase();
  return strA.localeCompare(strB);
}

/**
 * البحث عن التطابق الدقيق في الصف الأول
 */
export function exactSearchRow(row: readonly unknown[], lookupValue: unknown): number {
  for (let i = 0; i < row.length; i++) {
    const cellValue = row[i];
    if (compareValues(lookupValue, cellValue) === 0) {
      return i;
    }
  }
  return -1;
}

/**
 * بحث تقريبي باستخدام الخوارزمية الثنائية (يفترض ترتيب الصف تصاعدياً)
 * يعيد أكبر مؤشر تكون قيمته أصغر من أو تساوي قيمة البحث
 */
export function binarySearchRow(row: readonly unknown[], lookupValue: unknown): number {
  let left = 0;
  let right = row.length - 1;
  let bestMatch = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = row[mid];
    const comparison = compareValues(lookupValue, midVal);

    if (comparison === 0) {
      return mid;
    }

    if (comparison > 0) {
      bestMatch = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return bestMatch;
}
