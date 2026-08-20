/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: arabic-text.ts
 * 📂 المسار: packages/core/src/utils/arabic-text.ts
 * 🎯 الهدف الرئيسي: أدوات شاملة لمعالجة النص العربي (RTL, Numerals,
 *    Diacritics, Normalization) للمحررات متعددة اللغات
 * 📋 المعايير: Zero dependencies, Unicode-aware, RTL/LTR detection
 * 🧪 الاختبارات: packages/core/tests/utils/arabic-text.test.ts
 * 🏷️ المعرف: UTIL-AR-001
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unicode Range Detection + Diacritics Stripping + Bidirectional Utils
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. Unicode ranges: Arabic (0600-06FF), Extended (0750-077F, FB50-FDFF)
 *    2. التشكيل (Diacritics) يقع في النطاق 064B-065F
 *    3. الأرقام العربية (٠-٩) تختلف عن الهندية (0-9)
 *    4. الحروف المتشابهة (أ/إ/آ/ا, ت/ة, ي/ى) تحتاج توحيد
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - null/undefined guards في كل دالة
 *    - regex caching للأنماط المتكررة
 *    - fallback للقيم الافتراضية عند الفشل
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Unicode Standard, MDN String Methods
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// الثوابت (Constants)
// ─────────────────────────────────────────────────────────────────────────────

/** نطاقات Unicode للحروف العربية */
export const ARABIC_RANGES = {
  BASIC: /[\u0600-\u06FF]/,
  EXTENDED: /[\u0750-\u077F]/,
  SUPPLEMENT: /[\u08A0-\u08FF]/,
  PRESENTATION_A: /[\uFB50-\uFDFF]/,
  PRESENTATION_B: /[\uFE70-\uFEFF]/,
} as const;

/** التشكيل العربي (Diacritics) */
export const ARABIC_DIACRITICS =
  /[\u064B-\u065F\u0670\u0640]/g;

/** الأرقام */
export const NUMERALS = {
  ARABIC: ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'],
  WESTERN: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
} as const;

/** خريطة الحروف المتشابهة للتوحيد */
export const NORMALIZATION_MAP: Record<string, string> = {
  'أ': 'ا', 'إ': 'ا', 'آ': 'ا', 'ٱ': 'ا',
  'ى': 'ي',
  'ة': 'ه',
} as const;

export type TextDirection = 'rtl' | 'ltr' | 'auto';

// ─────────────────────────────────────────────────────────────────────────────
// Detection Functions
// ─────────────────────────────────────────────────────────────────────────────

/** فحص إذا كان الحرف عربي */
export function isArabicChar(char: string): boolean {
  if (!char || char.length === 0) return false;
  const code = char.charCodeAt(0);
  return (
    (code >= 0x0600 && code <= 0x06FF) ||
    (code >= 0x0750 && code <= 0x077F) ||
    (code >= 0x08A0 && code <= 0x08FF) ||
    (code >= 0xFB50 && code <= 0xFDFF) ||
    (code >= 0xFE70 && code <= 0xFEFF)
  );
}

/** فحص إذا كان النص يحتوي على حروف عربية */
export function containsArabic(text: string): boolean {
  if (!text) return false;
  return ARABIC_RANGES.BASIC.test(text) ||
    ARABIC_RANGES.EXTENDED.test(text) ||
    ARABIC_RANGES.SUPPLEMENT.test(text);
}

/**
 * كشف اتجاه النص الغالب.
 * يعيد 'rtl' إذا كانت الأغلبية عربية، 'ltr' وإلا، 'auto' للنص الفارغ.
 */
export function detectDirection(text: string): TextDirection {
  if (!text || text.trim().length === 0) return 'auto';

  let arabicCount = 0;
  let latinCount = 0;

  for (const char of text) {
    if (isArabicChar(char)) arabicCount++;
    else if (/[A-Za-z]/.test(char)) latinCount++;
  }

  if (arabicCount === 0 && latinCount === 0) return 'auto';
  return arabicCount > latinCount ? 'rtl' : 'ltr';
}

/** عد الكلمات العربية في النص */
export function countArabicWords(text: string): number {
  if (!text) return 0;
  const words = text.split(/\s+/);
  return words.filter((w) => containsArabic(w)).length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalization Functions
// ─────────────────────────────────────────────────────────────────────────────

/** إزالة التشكيل العربي (الفتحة، الضمة، الكسرة، الشدة، إلخ) */
export function removeDiacritics(text: string): string {
  if (!text) return '';
  return text.replace(ARABIC_DIACRITICS, '');
}

/** إزالة التطويل (Tatweel ـ) */
export function removeTatweel(text: string): string {
  if (!text) return '';
  return text.replace(/\u0640/g, '');
}

/** توحيد الحروف العربية المتشابهة (أ/إ/آ/ا → ا، ى → ي، ة → ه) */
export function normalizeArabicLetters(text: string): string {
  if (!text) return '';
  let result = text;
  for (const [from, to] of Object.entries(NORMALIZATION_MAP)) {
    result = result.replace(new RegExp(from, 'g'), to);
  }
  return result;
}

/** توحيد شامل: إزالة التشكيل + التطويل + توحيد الحروف */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return normalizeArabicLetters(removeTatweel(removeDiacritics(text)));
}

// ─────────────────────────────────────────────────────────────────────────────
// Numerals Conversion
// ─────────────────────────────────────────────────────────────────────────────

/** تحويل الأرقام العربية (١٢٣) إلى غربية (123) */
export function arabicToWesternNumerals(text: string): string {
  if (!text) return '';
  let result = text;
  for (let i = 0; i < NUMERALS.ARABIC.length; i++) {
    const arabicNum = NUMERALS.ARABIC[i];
    const westernNum = NUMERALS.WESTERN[i];
    if (arabicNum !== undefined && westernNum !== undefined) {
      result = result.replace(new RegExp(arabicNum, 'g'), westernNum);
    }
  }
  return result;
}

/** تحويل الأرقام الغربية (123) إلى عربية (١٢٣) */
export function westernToArabicNumerals(text: string): string {
  if (!text) return '';
  let result = text;
  for (let i = 0; i < NUMERALS.WESTERN.length; i++) {
    const westernNum = NUMERALS.WESTERN[i];
    const arabicNum = NUMERALS.ARABIC[i];
    if (westernNum !== undefined && arabicNum !== undefined) {
      result = result.replace(new RegExp(westernNum, 'g'), arabicNum);
    }
  }
  return result;
}

/** توحيد الأرقام إلى غربية (للمعالجة الداخلية) */
export function normalizeNumerals(text: string): string {
  return arabicToWesternNumerals(text);
}

// ─────────────────────────────────────────────────────────────────────────────
// RTL/LTR Wrapping
// ─────────────────────────────────────────────────────────────────────────────

/** تغليف النص بـ HTML span مع dir attribute مناسب */
export function wrapWithDir(
  text: string,
  direction?: TextDirection
): string {
  if (!text) return '';
  const dir = direction ?? detectDirection(text);
  if (dir === 'auto') return text;
  return `<span dir="${dir}">${text}</span>`;
}

/** إضافة Unicode BiDi marks (RLE/LRE/PDF) للنص المختلط */
export function embedBidi(text: string): string {
  if (!text) return '';
  const dir = detectDirection(text);
  if (dir === 'rtl') return `\u202B${text}\u202C`;
  if (dir === 'ltr') return `\u202A${text}\u202C`;
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search & Compare Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** مقارنة نصين عربيين مع توحيد (تجاهل التشكيل والحروف المتشابهة) */
export function arabicEquals(a: string, b: string): boolean {
  return normalizeArabic(a) === normalizeArabic(b);
}

/** بحث في نص عربي مع تجاهل التشكيل */
export function arabicIncludes(
  text: string,
  query: string
): boolean {
  return normalizeArabic(text).includes(normalizeArabic(query));
}

/** تنظيف المسافات الزائدة (للنص العربي والإنجليزي) */
export function normalizeWhitespace(text: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}