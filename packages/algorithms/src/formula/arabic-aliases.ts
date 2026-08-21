/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: arabic-aliases.ts
 * 📂 المسار: src/algorithms/formula/arabic-aliases.ts
 * 🎯 الهدف الرئيسي: قاموس المترادفات والأسماء العربية لدوال LibreOffice Calc و Excel و Google Sheets
 * 📋 المعايير: دعم كامل للمسميات العربية والإنجليزية مع معالجة غير حساسة لحالة الأحرف
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-009-ALIASES
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bi-Directional Arabic-English Formula Alias Normalizer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجريد التشكيل والهمزات لتسهيل الكتابة العربية
 *    2. توافق أسماء الدوال مع المعايير الدولية
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const ARABIC_FUNCTION_MAP: Record<string, string> = {
  // الحساب والإحصاء
  مجموع: 'SUM',
  جمع: 'SUM',
  متوسط: 'AVERAGE',
  معدل: 'AVERAGE',
  اكبر: 'MAX',
  أكبر: 'MAX',
  اقصى: 'MAX',
  أقصى: 'MAX',
  اصغر: 'MIN',
  أصغر: 'MIN',
  ادنى: 'MIN',
  أدنى: 'MIN',
  عد: 'COUNT',
  عدد: 'COUNT',
  عد_الكل: 'COUNTA',
  تقريب: 'ROUND',
  مطلق: 'ABS',
  باقي: 'MOD',
  جذر: 'SQRT',
  اس: 'POWER',
  أس: 'POWER',

  // الشروط والمنطق
  اذا: 'IF',
  إذا: 'IF',
  شروط: 'IFS',
  جمع_بشرط: 'SUMIF',
  عد_بشرط: 'COUNTIF',
  و: 'AND',
  او: 'OR',
  أو: 'OR',
  ليس: 'NOT',

  // البحث والمراجع
  بحث_رأسي: 'VLOOKUP',
  بحث_راسي: 'VLOOKUP',
  بحث_عمودي: 'VLOOKUP',
  بحث_أفقي: 'HLOOKUP',
  بحث_افقي: 'HLOOKUP',
  بحث_متقدم: 'XLOOKUP',
  فهرس: 'INDEX',
  تطابق: 'MATCH',

  // المالية
  قسط: 'PMT',
  دفعة: 'PMT',
  صافي_القيمة: 'NPV',
  صافي_القيمة_الحالية: 'NPV',
  معدل_العائد: 'IRR',
  معدل_العائد_الداخلي: 'IRR',

  // النصوص
  دمج: 'CONCAT',
  دمج_نصوص: 'CONCATENATE',
  يسار: 'LEFT',
  يمين: 'RIGHT',
  وسط: 'MID',
  طول: 'LEN',
  حروف_كبيرة: 'UPPER',
  حروف_صغيرة: 'LOWER',
  تشذيب: 'TRIM',
};

export function normalizeFunctionName(name: string): string {
  const clean = name.trim().toUpperCase();
  const lowerClean = name.trim().toLowerCase();

  if (ARABIC_FUNCTION_MAP[lowerClean]) {
    return ARABIC_FUNCTION_MAP[lowerClean];
  }
  if (ARABIC_FUNCTION_MAP[name.trim()] !== undefined) {
    return ARABIC_FUNCTION_MAP[name.trim()]!;
  }
  return clean;
}
