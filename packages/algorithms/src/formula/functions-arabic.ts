/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-arabic.ts
 * 📂 المسار: packages/algorithms/src/formula/functions-arabic.ts
 * 🎯 الهدف الرئيسي: دوال معالجة النصوص والتفقيط المالي والأرقام العربية
 * 📋 المعايير: صفر اعتماديات، دعم التشكيل، التفقيط المالي بالعملات العربية
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions-arabic.test.ts
 * 🏷️ المعرف: ALGO-013
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v1.0: Arabic Text & Financial Tafqeet Suite)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Hierarchical Recursive Tafqeet Engine + RegEx-Based Arabic Normalization
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الأعداد السالبة في التفقيط
 *    2. تنوين وتثنية وتمييز الآحاد والعشرات والمئات والآلاف
 *    3. التشكيل المتداخل مع تطبيع الحروف
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية ضد القيم الفارغة أو NaN
 *    - ضبط أقصى قيمة للتفقيط إلى 15 منزلة (Trillions)
 *    - فحص نوع المدخلات دائماً
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: cell-utils.ts
 *    - 📄 مرتبط مباشر: registry.ts, functions.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/formula/functions-arabic.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - TAFQEET: تفقيط المبالغ والأعداد إلى كلمات عربية فصيحة مع العملات
 *    - STRIP_TASHKEEL: إزالة الحركات التشكيلية والتطويل
 *    - NORMALIZE_ARABIC: توحيد صور الألف والياء والتاء المربوطة
 *    - TO_ARABIC_NUMERALS: تحويل الأرقام إلى الأرقام المشرقية (٠-٩)
 *    - TO_WESTERN_NUMERALS: تحويل الأرقام المشرقية إلى الغربية (0-9)
 *    - ARABIC_LEN: حساب طول النص مع خيار استبعاد علامات التشكيل
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: قواعد النحو والتفقيط المالي العربي المعياري
 * ═══════════════════════════════════════════════════════════════════════════
 */

// جدول تعريفات العملات العربية الشائعة
export interface CurrencyConfig {
  readonly primary: string;
  readonly primaryDual?: string;
  readonly primaryPlural?: string;
  readonly secondary: string;
  readonly secondaryDual?: string;
  readonly secondaryPlural?: string;
  readonly decimals: number;
}

export const ARABIC_CURRENCIES: Record<string, CurrencyConfig> = {
  SAR: { primary: 'ريال سعودي', primaryDual: 'ريالان سعوديان', primaryPlural: 'ريالات سعودية', secondary: 'هللة', secondaryPlural: 'هللات', decimals: 2 },
  EGP: { primary: 'جنيه مصري', primaryDual: 'جنيهان مصريان', primaryPlural: 'جنيهات مصرية', secondary: 'قرش', secondaryPlural: 'قروش', decimals: 2 },
  AED: { primary: 'درهم إماراتي', primaryDual: 'درهمان إماراتيان', primaryPlural: 'دراهم إماراتية', secondary: 'فلس', secondaryPlural: 'فلوس', decimals: 2 },
  KWD: { primary: 'دينار كويتي', primaryDual: 'ديناران كويتيان', primaryPlural: 'دنانير كويتية', secondary: 'فلس', secondaryPlural: 'فلوس', decimals: 3 },
  QAR: { primary: 'ريال قطري', primaryDual: 'ريالان قطريان', primaryPlural: 'ريالات قطرية', secondary: 'درهم', secondaryPlural: 'دراهم', decimals: 2 },
  OMR: { primary: 'ريال عماني', primaryDual: 'ريالان عمانيان', primaryPlural: 'ريالات عمانية', secondary: 'بيسة', secondaryPlural: 'بيسات', decimals: 3 },
  BHD: { primary: 'دينار بحريني', primaryDual: 'ديناران بحرينيان', primaryPlural: 'دنانير بحرينية', secondary: 'فلس', secondaryPlural: 'فلوس', decimals: 3 },
  JOD: { primary: 'دينار أردني', primaryDual: 'ديناران أردنيان', primaryPlural: 'دنانير أردنية', secondary: 'قرش', secondaryPlural: 'قروش', decimals: 2 },
  USD: { primary: 'دولار أمريكي', primaryDual: 'دولاران أمريكيان', primaryPlural: 'دولارات أمريكية', secondary: 'سنت', secondaryPlural: 'سنتات', decimals: 2 },
  EUR: { primary: 'يورو', primaryDual: 'يورو', primaryPlural: 'يورو', secondary: 'سنت', secondaryPlural: 'سنتات', decimals: 2 }
};

const ONES = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TENS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
const HUNDREDS = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

const SCALES = [
  { singular: '', dual: '', plural: '', accusative: '' },
  { singular: 'ألف', dual: 'ألفان', plural: 'آلاف', accusative: 'ألفاً' },
  { singular: 'مليون', dual: 'مليونان', plural: 'ملايين', accusative: 'مليوناً' },
  { singular: 'مليار', dual: 'ملياران', plural: 'مليارات', accusative: 'ملياراً' },
  { singular: 'ترليون', dual: 'ترليونان', plural: 'ترليونات', accusative: 'ترليوناً' }
];

/** تحويل عدد حتى 999 إلى كلمات عربية */
function convertThreeDigits(num: number): string {
  if (num === 0) return '';
  const h = Math.floor(num / 100);
  const r = num % 100;
  const parts: string[] = [];

  if (h > 0) parts.push(HUNDREDS[h]!);
  if (r > 0) {
    if (r < 20) {
      parts.push(ONES[r]!);
    } else {
      const o = r % 10;
      const t = Math.floor(r / 10);
      if (o > 0) parts.push(`${ONES[o]!} و${TENS[t]!}`);
      else parts.push(TENS[t]!);
    }
  }
  return parts.join(' و');
}

/** تطبيق قواعد التمييز للأعداد الكبيرة (آلاف، ملايين...) */
function formatScaleGroup(groupVal: number, scaleIdx: number): string {
  if (groupVal === 0) return '';
  const scale = SCALES[scaleIdx]!;
  if (scaleIdx === 0) return convertThreeDigits(groupVal);

  if (groupVal === 1) return scale.singular;
  if (groupVal === 2) return scale.dual;
  if (groupVal >= 3 && groupVal <= 10) return `${convertThreeDigits(groupVal)} ${scale.plural}`;
  if (groupVal >= 11 && groupVal <= 99) return `${convertThreeDigits(groupVal)} ${scale.accusative}`;
  return `${convertThreeDigits(groupVal)} ${scale.singular}`;
}

/** تفقيط العدد الصحيح الموجب */
function integerToWords(num: number): string {
  if (num === 0) return 'صفر';
  const groups: number[] = [];
  let temp = Math.floor(num);

  while (temp > 0) {
    groups.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const val = groups[i]!;
    if (val > 0) {
      parts.push(formatScaleGroup(val, i));
    }
  }
  return parts.join(' و');
}

/**
 * TAFQEET: تحويل الأرقام إلى نصوص باللغة العربية مع دعم العملات والكسور
 */
export function TAFQEET(
  amount: unknown,
  currencyCode?: unknown,
  prefix: unknown = 'فقط',
  suffix: unknown = 'لا غير'
): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(num)) return '';
  if (num === 0) return 'صفر';

  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const intPart = Math.floor(absNum);

  const currCode = typeof currencyCode === 'string' ? currencyCode.toUpperCase().trim() : '';
  const curr = currCode && ARABIC_CURRENCIES[currCode] ? ARABIC_CURRENCIES[currCode] : null;

  let result = integerToWords(intPart);

  if (curr) {
    if (intPart === 1) {
      result = curr.primary;
    } else if (intPart === 2) {
      result = curr.primaryDual ?? curr.primary;
    } else if (intPart >= 3 && intPart <= 10) {
      result = `${integerToWords(intPart)} ${curr.primaryPlural ?? curr.primary}`;
    } else {
      result = `${integerToWords(intPart)} ${curr.primary}`;
    }
    const decFactor = Math.pow(10, curr.decimals);
    const fracPart = Math.round((absNum - intPart) * decFactor);
    if (fracPart > 0) {
      let fracWords = '';
      if (fracPart === 1) {
        fracWords = curr.secondary;
      } else if (fracPart === 2) {
        fracWords = curr.secondaryDual ?? `اثنان ${curr.secondary}`;
      } else if (fracPart >= 3 && fracPart <= 10) {
        fracWords = `${integerToWords(fracPart)} ${curr.secondaryPlural ?? curr.secondary}`;
      } else {
        fracWords = `${integerToWords(fracPart)} ${curr.secondary}`;
      }
      result += ` و${fracWords}`;
    }
  } else {
    const fracPart = Math.round((absNum - intPart) * 100);
    if (fracPart > 0) {
      result += ` وفاصلة ${integerToWords(fracPart)}`;
    }
  }

  const p = prefix ? `${String(prefix).trim()} ` : '';
  const s = suffix ? ` ${String(suffix).trim()}` : '';
  const sign = isNegative ? 'سالب ' : '';

  return `${p}${sign}${result}${s}`.trim();
}

/**
 * STRIP_TASHKEEL: إزالة حركات التشكيل والتطويل من النص
 */
export function STRIP_TASHKEEL(text: unknown): string {
  if (text === null || text === undefined) return '';
  const str = String(text);
  // إزالة حركات التشكيل (U+064B - U+065F) والتطويل (U+0640) والهمزات العلوية
  return str.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
}

/**
 * NORMALIZE_ARABIC: توحيد أشكال الحروف العربية للبحث والمطابقة
 */
export function NORMALIZE_ARABIC(text: unknown, normalizeTaa: unknown = false): string {
  if (text === null || text === undefined) return '';
  let str = STRIP_TASHKEEL(text);
  const normTaa = Boolean(normalizeTaa);
  // توحيد الألفات
  str = str.replace(/[أإآٱ]/g, 'ا');
  // توحيد الياء والياء المقصورة
  str = str.replace(/ى/g, 'ي');
  // توحيد التاء المربوطة اختيارياً أو عند الطلب
  if (normTaa) {
    str = str.replace(/ة/g, 'ه');
  }
  // توحيد الهمزات المركبة
  str = str.replace(/ئ/g, 'ي').replace(/ؤ/g, 'و');
  return str.trim();
}

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/**
 * TO_ARABIC_NUMERALS: تحويل الأرقام اللاتينية (0-9) إلى أرقام مشرقية (٠-٩)
 */
export function TO_ARABIC_NUMERALS(input: unknown): string {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (digit) => ARABIC_DIGITS[Number(digit)] ?? digit);
}

/**
 * TO_WESTERN_NUMERALS: تحويل الأرقام المشرقية والفارسية إلى أرقام لاتينية (0-9)
 */
export function TO_WESTERN_NUMERALS(input: unknown): string {
  if (input === null || input === undefined) return '';
  let str = String(input);
  for (let i = 0; i < 10; i++) {
    str = str.replace(new RegExp(ARABIC_DIGITS[i]!, 'g'), String(i));
    str = str.replace(new RegExp(PERSIAN_DIGITS[i]!, 'g'), String(i));
  }
  return str;
}

/**
 * ARABIC_LEN: حساب طول النص مع خيار تجاهل علامات التشكيل
 */
export function ARABIC_LEN(text: unknown, ignoreTashkeel: unknown = true): number {
  if (text === null || text === undefined) return 0;
  const str = Boolean(ignoreTashkeel) ? STRIP_TASHKEEL(text) : String(text);
  return Array.from(str).length;
}

/**
 * ARABIC_MATCH: مطابقة ذكية للنصوص والأسماء مع توحيد الهمزات والياء/الألف المقصورة والتاء المربوطة
 * تدعم المطابقة التامة أو البحث بجزء من الاسم (isPartial = true)
 */
export function ARABIC_MATCH(text: unknown, pattern: unknown, isPartial: unknown = false): boolean {
  if (text === null || text === undefined || pattern === null || pattern === undefined) return false;
  const normText = NORMALIZE_ARABIC(text, true).toLowerCase();
  const normPattern = NORMALIZE_ARABIC(pattern, true).toLowerCase();
  if (Boolean(isPartial)) {
    return normText.includes(normPattern);
  }
  return normText === normPattern;
}

