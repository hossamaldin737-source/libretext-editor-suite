/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mergesort.ts
 * 📂 المسار: src/algorithms/sort/mergesort.ts
 * 🎯 الهدف الرئيسي: خوارزمية الفرز المدمج التصاعدي التكراري (Bottom-Up MergeSort) المستقر
 * 📋 المعايير: فرز مستقر بزمن O(N log N) مع دعم مقارنة النصوص العربية والأرقام
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-007-MERGESORT
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Iterative Bottom-Up Stable MergeSort with Multi-Column Collation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان استقرار الفرز (Stability) عند تساوي القيم
 *    2. تجنب استهلاك الذاكرة المفرط عبر استخدام مصفوفة مساعدة واحدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية من المصفوفات الفارغة وعناصر Null/Undefined
 *    - فحص حدود الفهرس (Index Bounds) بدقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: src/algorithms/types.ts
 *    - 📄 مرتبط مباشر: src/algorithms/index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - bottomUpMergeSort: الفرز المدمج التكراري (#L70)
 *    - mergeSubarrays: دمج مصفوفتين جزئيتين مرتبتين (#L100)
 *    - createTableColumnComparator: توليد مقارن متعدد الأعمدة (#L130)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: John von Neumann Merge Sort Analysis (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type SortDirection = 'asc' | 'desc';

export interface SortCriteria {
  readonly columnIndex: number;
  readonly direction: SortDirection;
}

const arabicCollator = new Intl.Collator(['ar', 'en'], { numeric: true, sensitivity: 'base' });

export function compareCellValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined || a === '') return 1;
  if (b === null || b === undefined || b === '') return -1;

  const numA = typeof a === 'number' ? a : parseFloat(String(a));
  const numB = typeof b === 'number' ? b : parseFloat(String(b));

  if (!isNaN(numA) && !isNaN(numB) && typeof a !== 'boolean' && typeof b !== 'boolean') {
    return numA - numB;
  }

  return arabicCollator.compare(String(a), String(b));
}

export function createTableColumnComparator(
  criteria: readonly SortCriteria[],
): (rowA: readonly unknown[], rowB: readonly unknown[]) => number {
  return (rowA, rowB) => {
    for (const c of criteria) {
      const valA = rowA[c.columnIndex];
      const valB = rowB[c.columnIndex];
      const cmp = compareCellValues(valA, valB);
      if (cmp !== 0) {
        return c.direction === 'asc' ? cmp : -cmp;
      }
    }
    return 0;
  };
}

export function bottomUpMergeSort<T>(
  items: readonly T[],
  comparator: (a: T, b: T) => number = (a, b) => compareCellValues(a, b),
): T[] {
  const n = items.length;
  if (n <= 1) return [...items];

  const src: T[] = [...items];
  const aux: T[] = new Array(n);

  for (let sz = 1; sz < n; sz *= 2) {
    for (let lo = 0; lo < n - sz; lo += 2 * sz) {
      const mid = lo + sz - 1;
      const hi = Math.min(lo + 2 * sz - 1, n - 1);
      mergeSubarrays(src, aux, lo, mid, hi, comparator);
    }
  }

  return src;
}

function mergeSubarrays<T>(
  src: T[],
  aux: T[],
  lo: number,
  mid: number,
  hi: number,
  comparator: (a: T, b: T) => number,
): void {
  for (let k = lo; k <= hi; k++) {
    aux[k] = src[k]!;
  }

  let i = lo;
  let j = mid + 1;

  for (let k = lo; k <= hi; k++) {
    if (i > mid) {
      src[k] = aux[j++]!;
    } else if (j > hi) {
      src[k] = aux[i++]!;
    } else if (comparator(aux[j]!, aux[i]!) < 0) {
      src[k] = aux[j++]!;
    } else {
      src[k] = aux[i++]!;
    }
  }
}
