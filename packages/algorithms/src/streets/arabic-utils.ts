/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: arabic-utils.ts
 * 📂 المسار: src/algorithms/streets/arabic-utils.ts
 * 🎯 الهدف الرئيسي: دوال معالجة وتطبيع النصوص العربية للفرز والمطابقة اللغوية الدقيقة
 * 📋 المعايير: خالية من أي مكتبة خارجية مع معالجة التشكيل والهمزات والألفات
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-022-ARABIC-UTILS
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Collation Normalizer & Arabic Diacritic Stripper
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * تجريد التشكيل والرموز والحركات التشكيلية من النص العربي
 * @param text النص الأصلي
 * @returns النص مجرداً من الحركات
 */
export function stripArabicDiacritics(text: string): string {
  if (!text) return '';
  // إزالة حركات الفتحة، الضمة، الكسرة، التنوين، الشدة، والسكون والمد
  return text.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
}

/**
 * تطبيع النص العربي للمقارنة والبحث (توحيد الألفات، الياءات، والتاء المربوطة)
 * @param text النص المراد تطبيعه
 * @returns نص قياسي موحد
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  let normalized = stripArabicDiacritics(text).trim().toLowerCase();

  // توحيد الهمزات والألفات: أ، إ، آ، ٱ -> ا
  normalized = normalized.replace(/[أإآٱ]/g, 'ا');

  // توحيد التاء المربوطة والهاء في أواخر الكلمات: ة -> ه
  normalized = normalized.replace(/ة/g, 'ه');

  // توحيد الألف المقصورة والياء: ى -> ي
  normalized = normalized.replace(/ى/g, 'ي');

  // توحيد الهمزة على الواو والياء والسطر: ؤ، ئ -> ء
  normalized = normalized.replace(/[ؤئ]/g, 'ء');

  // إزالة الكلمات الزائدة الاختيارية في بداية الاسم لتسهيل الفهرسة مثل "شارع "، "ميدان "
  normalized = normalized.replace(/^(شارع|طريق|ميدان|حارة|زقاق|ممر|درب|محور)\s+/g, '');

  // تنظيف المسافات المكررة
  return normalized.replace(/\s+/g, ' ').trim();
}

/**
 * مقارنة معجمية عربية مخصصة للفرز الأبجدي الدقيق
 * @param a النص الأول
 * @param b النص الثاني
 * @returns قيمة المقارنة (-1, 0, 1)
 */
export function compareArabicStrings(a: string, b: string): number {
  const normA = normalizeArabicText(a);
  const normB = normalizeArabicText(b);

  if (normA === normB) {
    return a.localeCompare(b, 'ar');
  }
  return normA.localeCompare(normB, 'ar');
}

/**
 * التحقق مما إذا كان النص يحتوي على كلمة بحث معينة بشكل غير حساس للهمزات
 * @param source النص المصدر
 * @param query كلمة البحث
 * @returns true إذا كان النص يحتوي على الاستعلام
 */
export function arabicIncludes(source: string, query: string): boolean {
  if (!query) return true;
  if (!source) return false;

  const normSource = normalizeArabicText(source);
  const normQuery = normalizeArabicText(query);

  if (normSource.includes(normQuery)) return true;

  // فحص الكلمات الفردية
  const queryTokens = normQuery.split(' ').filter(Boolean);
  return queryTokens.every((token) => normSource.includes(token));
}
