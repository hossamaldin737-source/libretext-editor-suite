/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-text.ts
 * 📂 المسار: packages/algorithms/src/formula/functions-text.ts
 * 🎯 الهدف الرئيسي: دوال النصوص المعيارية لمعالجة وتنسيق النصوص في جداول البيانات
 * 📋 المعايير: صفر اعتماديات، توافق كامل مع معايير Excel/Calc النصية
 * 🧪 الاختبارات: packages/algorithms/tests/formula/functions-text.test.ts
 * 🏷️ المعرف: ALGO-014
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v1.0: Comprehensive Standard Text Functions Suite)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Text Utilities with Unicode & 1-Based Indexing Support
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المؤشرات في MID و REPLACE تبدأ من 1 (1-based index)
 *    2. التعامل مع الرموز التعبيرية ورموز Unicode متعددة البايتات
 *    3. تجاوز حدود النص في LEFT و RIGHT
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تحويل القيم غير النصية بأمان
 *    - التحقق من الأرقام السالبة في مؤشرات القص
 *    - استبعاد المدخلات غير الصالحة في TEXTJOIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: cell-utils.ts
 *    - 📄 مرتبط مباشر: registry.ts, functions.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/formula/functions-text.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - TRIM: إزالة المسافات الزائدة والفراغات المخفية
 *    - CLEAN: تنظيف المحارف غير القابلة للطباعة
 *    - LEFT: اقتطاع عدد من الحروف من جهة اليسار
 *    - RIGHT: اقتطاع عدد من الحروف من جهة اليمين
 *    - MID: اقتطاع جزء من النص من موقع محدد
 *    - LEN: حساب طول النص
 *    - LOWER / UPPER / PROPER: تحويل حالة الأحرف اللاتينية
 *    - SUBSTITUTE: استبدال نص داخل نص مع خيار تكرار محدد
 *    - REPLACE: استبدال جزء من النص حسب الموضع والطول
 *    - TEXTJOIN: دمج مصفوفة نصوص مع فاصل وخيار تجاهل الفراغ
 *    - EXACT: مقارنة مطابقة تامة بين نصين
 *    - REPT: تكرار النص عدداً من المرات
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Excel & OpenDocument Formula Specification
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** تحويل القيمة إلى نص آمن */
function toText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

/** تسطيح المصفوفات الممررة */
function flatten(args: unknown[]): unknown[] {
  const result: unknown[] = [];
  for (const arg of args) {
    if (Array.isArray(arg)) result.push(...flatten(arg));
    else result.push(arg);
  }
  return result;
}

/** TRIM: إزالة المسافات المزدوجة والفراغات من البداية والنهاية */
export function TRIM(text: unknown): string {
  const str = toText(text).replace(/\u00A0/g, ' ');
  return str.trim().replace(/\s+/g, ' ');
}

/** CLEAN: إزالة أحرف التحكم غير القابلة للطباعة (ASCII 0-31) */
export function CLEAN(text: unknown): string {
  return toText(text).replace(/[\x00-\x1F\x7F]/g, '');
}

/** LEFT: اقتطاع عدد محدد من الحروف من بداية النص */
export function LEFT(text: unknown, numChars: unknown = 1): string {
  const str = toText(text);
  const count = typeof numChars === 'number' ? numChars : parseInt(toText(numChars), 10);
  const n = isNaN(count) || count < 0 ? 0 : count;
  return Array.from(str).slice(0, n).join('');
}

/** RIGHT: اقتطاع عدد محدد من الحروف من نهاية النص */
export function RIGHT(text: unknown, numChars: unknown = 1): string {
  const str = toText(text);
  const count = typeof numChars === 'number' ? numChars : parseInt(toText(numChars), 10);
  const n = isNaN(count) || count < 0 ? 0 : count;
  const chars = Array.from(str);
  if (n >= chars.length) return str;
  return chars.slice(chars.length - n).join('');
}

/** MID: اقتطاع جزء من النص بدءاً من موضع محدد (1-based index) */
export function MID(text: unknown, startNum: unknown, numChars: unknown): string {
  const str = toText(text);
  const start = typeof startNum === 'number' ? startNum : parseInt(toText(startNum), 10);
  const count = typeof numChars === 'number' ? numChars : parseInt(toText(numChars), 10);
  
  if (isNaN(start) || start < 1) throw new Error('MID start position must be >= 1');
  const n = isNaN(count) || count < 0 ? 0 : count;
  
  const chars = Array.from(str);
  return chars.slice(start - 1, start - 1 + n).join('');
}

/** LEN: حساب طول النص المعياري */
export function LEN(text: unknown): number {
  return Array.from(toText(text)).length;
}

/** LOWER: تحويل النص إلى أحرف صغيرة */
export function LOWER(text: unknown): string {
  return toText(text).toLowerCase();
}

/** UPPER: تحويل النص إلى أحرف كبيرة */
export function UPPER(text: unknown): string {
  return toText(text).toUpperCase();
}

/** PROPER: تحويل الحرف الأول من كل كلمة إلى حرف كبير */
export function PROPER(text: unknown): string {
  return toText(text).replace(/\b\w/g, (c) => c.toUpperCase());
}

/** SUBSTITUTE: استبدال نص قديم بنص جديد */
export function SUBSTITUTE(
  text: unknown,
  oldText: unknown,
  newText: unknown,
  instanceNum?: unknown
): string {
  const str = toText(text);
  const search = toText(oldText);
  const replacement = toText(newText);
  if (search === '') return str;

  if (instanceNum === undefined || instanceNum === null) {
    return str.split(search).join(replacement);
  }

  const instance = typeof instanceNum === 'number' ? instanceNum : parseInt(toText(instanceNum), 10);
  if (isNaN(instance) || instance < 1) throw new Error('SUBSTITUTE instance number must be >= 1');

  let count = 0;
  return str.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), (match) => {
    count++;
    return count === instance ? replacement : match;
  });
}

/** REPLACE: استبدال مقطع نصي حسب الموضع والطول */
export function REPLACE(
  oldText: unknown,
  startNum: unknown,
  numChars: unknown,
  newText: unknown
): string {
  const str = toText(oldText);
  const start = typeof startNum === 'number' ? startNum : parseInt(toText(startNum), 10);
  const count = typeof numChars === 'number' ? numChars : parseInt(toText(numChars), 10);
  const replacement = toText(newText);

  if (isNaN(start) || start < 1) throw new Error('REPLACE start position must be >= 1');
  const n = isNaN(count) || count < 0 ? 0 : count;

  const chars = Array.from(str);
  const before = chars.slice(0, start - 1).join('');
  const after = chars.slice(start - 1 + n).join('');
  return `${before}${replacement}${after}`;
}

/** TEXTJOIN: دمج مصفوفة نصوص مع فاصل محدد */
export function TEXTJOIN(delimiter: unknown, ignoreEmpty: unknown, ...args: unknown[]): string {
  const delim = toText(delimiter);
  const ignore = Boolean(ignoreEmpty);
  const values = flatten(args).map(toText);
  const filtered = ignore ? values.filter((v) => v.length > 0) : values;
  return filtered.join(delim);
}

/** EXACT: مقارنة مطابقة تامة وحساسة لحالة الأحرف */
export function EXACT(text1: unknown, text2: unknown): boolean {
  return toText(text1) === toText(text2);
}

/** REPT: تكرار النص بعدد محدد من المرات */
export function REPT(text: unknown, numberTimes: unknown): string {
  const str = toText(text);
  const count = typeof numberTimes === 'number' ? numberTimes : parseInt(toText(numberTimes), 10);
  if (isNaN(count) || count < 0) throw new Error('REPT count must be a non-negative number');
  return str.repeat(count);
}

/** SEARCH: البحث عن موقع نص داخل نص آخر مع تجاهل حالة الأحرف (1-based index) */
export function SEARCH(findText: unknown, withinText: unknown, startNum: unknown = 1): number {
  const find = toText(findText).toLowerCase();
  const within = toText(withinText).toLowerCase();
  const start = typeof startNum === 'number' ? startNum : parseInt(toText(startNum), 10);
  const startIdx = isNaN(start) || start < 1 ? 0 : start - 1;
  const idx = within.indexOf(find, startIdx);
  return idx === -1 ? 0 : idx + 1;
}

/** FIND: البحث الحساس لحالة الأحرف عن موقع نص داخل نص آخر (1-based index) */
export function FIND(findText: unknown, withinText: unknown, startNum: unknown = 1): number {
  const find = toText(findText);
  const within = toText(withinText);
  const start = typeof startNum === 'number' ? startNum : parseInt(toText(startNum), 10);
  const startIdx = isNaN(start) || start < 1 ? 0 : start - 1;
  const idx = within.indexOf(find, startIdx);
  return idx === -1 ? 0 : idx + 1;
}

