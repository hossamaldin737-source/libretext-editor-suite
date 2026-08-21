/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: search-engine.ts
 * 📂 المسار: src/algorithms/streets/search-engine.ts
 * 🎯 الهدف الرئيسي: محرك البحث المتقدم والفرز متعدد المستويات لشوارع وأحياء المدينة
 * 📋 المعايير: خوارزمية فرز مستقرة مع معالجة الترتيب العربي وشجرة التفرعات
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-024-SEARCH-ENGINE
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-Key Stable Sort & Hierarchical Urban Query Pipeline
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { CityStreet, StreetQueryFilter, StreetSortOption, DuplicateNameReport } from './types';
import { arabicIncludes, compareArabicStrings } from './arabic-utils';
import { analyzeDuplicateStreetNames } from './similarity';

/**
 * تصفية وبحث شامل في سجلات شوارع المدينة
 * @param streets مصفوفة الشوارع
 * @param filter معايير التصفية
 * @returns الشوارع المطابقة
 */
export function queryCityStreets(
  streets: readonly CityStreet[],
  filter: StreetQueryFilter,
): readonly CityStreet[] {
  let results = [...streets];

  // تصفية حسب البحث النصي الحر (الاسم، الحي، المدينة، المنطقة، الشارع المتفرع، المعالم، الملاحظات)
  if (filter.textQuery && filter.textQuery.trim().length > 0) {
    const q = filter.textQuery.trim();
    results = results.filter((st) => {
      return (
        arabicIncludes(st.name, q) ||
        (st.city && arabicIncludes(st.city, q)) ||
        arabicIncludes(st.neighborhood, q) ||
        arabicIncludes(st.region, q) ||
        arabicIncludes(st.branchedFrom, q) ||
        arabicIncludes(st.landmarks, q) ||
        arabicIncludes(st.description, q) ||
        arabicIncludes(st.notes, q)
      );
    });
  }

  // تصفية حسب المدينة
  if (filter.city && filter.city !== 'الكل') {
    results = results.filter((st) => (st.city || 'المدينة الرئيسية') === filter.city);
  }

  // تصفية حسب الحي
  if (filter.neighborhood && filter.neighborhood !== 'الكل') {
    results = results.filter((st) => st.neighborhood === filter.neighborhood);
  }

  // تصفية حسب المنطقة
  if (filter.region && filter.region !== 'الكل') {
    results = results.filter((st) => st.region === filter.region);
  }

  // تصفية حسب الشارع المتفرع منه
  if (filter.branchedFrom && filter.branchedFrom !== 'الكل') {
    results = results.filter((st) => arabicIncludes(st.branchedFrom, filter.branchedFrom || ''));
  }

  // تصفية حسب نوع الشارع
  if (filter.streetType && filter.streetType !== 'الكل') {
    results = results.filter((st) => st.streetType === filter.streetType);
  }

  // تصفية حسب حالة الشارع
  if (filter.status && filter.status !== 'الكل') {
    results = results.filter((st) => st.status === filter.status);
  }

  // تصفية للشوارع المكررة الاسم فقط
  if (filter.onlyDuplicates) {
    const dupReports = analyzeDuplicateStreetNames(streets);
    const dupNames = new Set(dupReports.map((d) => d.normalizedName));
    results = results.filter((st) => {
      const norm = st.name.replace(/^(شارع|طريق|ميدان)\s+/g, '').trim();
      return dupNames.has(norm);
    });
  }

  return results;
}

/**
 * فرز الشوارع متعدد المستويات (مثلاً: على الاسم ثم الحي ثم المنطقة)
 * @param streets قائمة الشوارع
 * @param sortOption خيارات الفرز
 * @returns مصفوفة مفروزة مستقرة
 */
export function sortCityStreets(
  streets: readonly CityStreet[],
  sortOption: StreetSortOption,
): readonly CityStreet[] {
  const result = [...streets];
  const { primaryField, secondaryField, direction } = sortOption;

  return result.sort((a, b) => {
    // المقارنة الأولية
    const valA = String(a[primaryField] || '');
    const valB = String(b[primaryField] || '');
    let cmp = compareArabicStrings(valA, valB);

    if (direction === 'desc') {
      cmp = -cmp;
    }

    // إذا تساوت القيم في المستوى الأول، ننتقل للمستوى الثاني
    if (cmp === 0 && secondaryField) {
      const secA = String(a[secondaryField] || '');
      const secB = String(b[secondaryField] || '');
      cmp = compareArabicStrings(secA, secB);
    }

    return cmp;
  });
}

/**
 * استخراج شبكة التفرعات من الشوارع الرئيسية
 * @param streets مصفوفة الشوارع
 * @returns خريطة الشوارع الرئيسية وتفرعاتها
 */
export function buildStreetBranchingTree(
  streets: readonly CityStreet[],
): Readonly<Record<string, readonly CityStreet[]>> {
  const tree: Record<string, CityStreet[]> = {};

  for (const st of streets) {
    const mainRoad = st.branchedFrom.trim() || 'شوارع رئيسية ومباشرة';
    if (!tree[mainRoad]) {
      tree[mainRoad] = [];
    }
    tree[mainRoad].push(st);
  }

  return tree;
}
