/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: src/algorithms/streets/types.ts
 * 🎯 الهدف الرئيسي: تعريف أنواع وهياكل بيانات نظام شوارع وأحياء ومعالم المدينة
 * 📋 المعايير: نوعية صارمة وخالية من الاعتماديات الخارجية 100%
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-021-STREETS-TYPES
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hierarchical Urban Graph & Collation-Aware Data Model
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** تصنيف نوع الشارع */
export type StreetType = 'شريان رئيسي' | 'شارع رئيسي' | 'شارع فرعي' | 'زقاق/ممر' | 'ميدان' | 'محور';

/** حالة الشارع والنشاط */
export type StreetStatus =
  'نشط تجاري' | 'سكني هادئ' | 'تجاري وسكني' | 'تحت الصيانة/رصف' | 'كثافة مرورية عالية';

/** نموذج بيانات الشارع في المدينة */
export interface CityStreet {
  readonly id: string;
  readonly name: string;
  readonly city?: string;
  readonly neighborhood: string;
  readonly region: string;
  readonly branchedFrom: string;
  readonly landmarks: string;
  readonly description: string;
  readonly streetType: StreetType;
  readonly status: StreetStatus;
  readonly notes: string;
  readonly updatedAt: string;
  readonly lengthMeters?: number;
}

/** نتيجة تحليل تكرار اسم الشارع عبر الأحياء والمدن */
export interface DuplicateNameReport {
  readonly normalizedName: string;
  readonly originalName: string;
  readonly count: number;
  readonly occurrences: readonly {
    readonly id: string;
    readonly name: string;
    readonly city?: string;
    readonly neighborhood: string;
    readonly region: string;
    readonly branchedFrom: string;
  }[];
}

/** نتيجة فحص التشابه اللفظي والجزئي بين اسمين */
export interface SimilarityMatch {
  readonly streetA: CityStreet;
  readonly streetB: CityStreet;
  readonly score: number;
  readonly matchType: 'تطابق تام' | 'تشابه مرتفع' | 'تطابق جزئي' | 'تشابه طفيف';
  readonly explanation: string;
}

/** معايير تصفية واستعلام الشوارع */
export interface StreetQueryFilter {
  readonly textQuery?: string;
  readonly city?: string;
  readonly neighborhood?: string;
  readonly region?: string;
  readonly branchedFrom?: string;
  readonly streetType?: string;
  readonly status?: string;
  readonly onlyDuplicates?: boolean;
}

/** خيارات الترتيب متعدد المستويات */
export type StreetSortField =
  'city' | 'name' | 'neighborhood' | 'region' | 'branchedFrom' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface StreetSortOption {
  readonly primaryField: StreetSortField;
  readonly secondaryField?: StreetSortField;
  readonly tertiaryField?: StreetSortField;
  readonly direction: SortDirection;
}
