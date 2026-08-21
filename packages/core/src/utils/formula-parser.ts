/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: formula-parser.ts
 * 📂 المسار: packages/core/src/utils/formula-parser.ts
 * 🎯 الهدف الرئيسي: محلل صيغ Excel مع دعم كامل للدوال العربية والإنجليزية
 * 📋 المعايير: Bilingual functions, Reference tracking, Validation
 * 🧪 الاختبارات: packages/core/tests/utils/formula-parser.test.ts
 * 🏷️ المعرف: UTIL-FORM-001
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bilingual Function Map + Reference Adjustment + Circular Detection
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الدوال العربية: مجموع, متوسط, عدد, إذا, جمع, جذر, اس
 *    2. المراجع النسبية (A1) تتغير عند النسخ، المطلقة ($A$1) لا
 *    3. المراجع الدائرية (A1 = B1 + A1) تسبب حلقة لانهائية
 *    4. النطاقات (A1:B5) يجب التعامل معها كمجموعة خلايا
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Validation للأقواس المتطابقة
 *    - Detection للمراجع الدائرية
 *    - Sanitization للـ input لمنع الحقن
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Excel Formula Syntax, LibreOffice Calc
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { arabicToWesternNumerals } from './arabic-text';

// ─────────────────────────────────────────────────────────────────────────────
// Constants: Bilingual Function Map
// ─────────────────────────────────────────────────────────────────────────────

/** خريطة الدوال العربية إلى الإنجليزية */
export const ARABIC_TO_ENGLISH_FUNCTIONS: Record<string, string> = {
  // دوال رياضية
  مجموع: 'SUM',
  جمع: 'SUM',
  المجموع: 'SUM',
  متوسط: 'AVERAGE',
  المتوسط: 'AVERAGE',
  عدد: 'COUNT',
  العدد: 'COUNT',
  عدد_ا: 'COUNTA',
  عدد_شرطي: 'COUNTIF',
  اقل: 'MIN',
  ادنى: 'MIN',
  اعلى: 'MAX',
  اقصى: 'MAX',
  تقريب: 'ROUND',
  جذر: 'SQRT',
  جذر_تربيعي: 'SQRT',
  اس: 'POWER',
  باقي: 'MOD',
  حاصل_ضرب: 'PRODUCT',
  مطلق: 'ABS',
  قيمة_مطلقة: 'ABS',
  وسيط: 'MEDIAN',
  منوال: 'MODE',
  // دوال منطقية
  اذا: 'IF',
  إذا: 'IF',
  و: 'AND',
  او: 'OR',
  أو: 'OR',
  ليس: 'NOT',
  خطا: 'FALSE',
  صحيح: 'TRUE',
  // دوال نصية
  دمج: 'CONCAT',
  اطول: 'LEN',
  طول: 'LEN',
  يسار: 'LEFT',
  يمين: 'RIGHT',
  وسط: 'MID',
  تشذيب: 'TRIM',
  احذف_المسافات: 'TRIM',
  كبير: 'UPPER',
  صغير: 'LOWER',
  استبدال: 'SUBSTITUTE',
  نص: 'TEXT',
  // دوال التاريخ
  اليوم: 'TODAY',
  الان: 'NOW',
  الآن: 'NOW',
  تاريخ: 'DATE',
  سنة: 'YEAR',
  شهر: 'MONTH',
  يوم: 'DAY',
  // دوال البحث
  بحث_عمودي: 'VLOOKUP',
  بحث_افقي: 'HLOOKUP',
  فهرس: 'INDEX',
  مطابقة: 'MATCH',
  اختيار: 'CHOOSE',
  // دوال إحصائية
  انحراف_معيار: 'STDEV',
  تباين: 'VAR',
  رتبة: 'RANK',
  مئوية: 'PERCENTILE',
  // دوال مالية
  دفعة: 'PMT',
  قيمة_مستقبلية: 'FV',
  قيمة_حالية: 'PV',
};

/** قائمة الدوال الإنجليزية المدعومة */
export const ENGLISH_FUNCTIONS: readonly string[] = [
  'SUM',
  'AVERAGE',
  'COUNT',
  'COUNTA',
  'COUNTIF',
  'COUNTIFS',
  'MIN',
  'MAX',
  'ROUND',
  'ROUNDUP',
  'ROUNDDOWN',
  'INT',
  'ABS',
  'SQRT',
  'POWER',
  'MOD',
  'PRODUCT',
  'SUMIF',
  'SUMIFS',
  'AVERAGEIF',
  'AVERAGEIFS',
  'MEDIAN',
  'MODE',
  'IF',
  'AND',
  'OR',
  'NOT',
  'XOR',
  'TRUE',
  'FALSE',
  'IFERROR',
  'IFNA',
  'CONCATENATE',
  'CONCAT',
  'LEFT',
  'RIGHT',
  'MID',
  'LEN',
  'TRIM',
  'UPPER',
  'LOWER',
  'PROPER',
  'SUBSTITUTE',
  'REPLACE',
  'TEXT',
  'TODAY',
  'NOW',
  'DATE',
  'YEAR',
  'MONTH',
  'DAY',
  'HOUR',
  'MINUTE',
  'VLOOKUP',
  'HLOOKUP',
  'XLOOKUP',
  'INDEX',
  'MATCH',
  'CHOOSE',
  'STDEV',
  'STDEVP',
  'VAR',
  'VARP',
  'RANK',
  'PERCENTILE',
  'PMT',
  'FV',
  'PV',
  'RATE',
  'NPV',
  'IRR',
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Patterns
// ─────────────────────────────────────────────────────────────────────────────

const CELL_REFERENCE_PATTERN = /\$?[A-Z]+\$?\d+/gi;
const RANGE_PATTERN = /\$?[A-Z]+\$?\d+:\$?[A-Z]+\$?\d+/gi;
const FUNCTION_PATTERN = /\b([A-Z\u0600-\u06FF_]+)\s*\(/gi;
const COLUMN_RANGE_PATTERN = /\$?[A-Z]+:\$?[A-Z]+/gi;
const ROW_RANGE_PATTERN = /\$?\d+:\$?\d+/g;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FormulaValidation {
  readonly isValid: boolean;
  readonly formula: string;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly cellReferences: readonly string[];
  readonly functions: readonly string[];
  readonly translatedFormula: string;
}

export interface CellReference {
  readonly column: string;
  readonly row: number;
  readonly absoluteColumn: boolean;
  readonly absoluteRow: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Translation
// ─────────────────────────────────────────────────────────────────────────────

/** ترجمة الدوال العربية إلى الإنجليزية وتوحيد الأرقام */
export function translateFormula(formula: string): string {
  if (!formula) return '';

  // توحيد الأرقام العربية إلى غربية
  let translated = arabicToWesternNumerals(formula);

  // استبدال الدوال العربية بالإنجليزية
  for (const [arabic, english] of Object.entries(ARABIC_TO_ENGLISH_FUNCTIONS)) {
    const pattern = new RegExp(`\\b${escapeRegex(arabic)}\\b`, 'g');
    translated = translated.replace(pattern, english);
  }

  // توحيد أسماء الأعمدة إلى أحرف كبيرة
  translated = translated.replace(/[a-z](?=\d)/g, (m) => m.toUpperCase());

  return translated;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─────────────────────────────────────────────────────────────────────────────
// Parsing & Validation
// ─────────────────────────────────────────────────────────────────────────────

/** تحليل الصيغة واستخراج المعلومات */
export function parseFormula(rawFormula: string): FormulaValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const cellReferences: string[] = [];
  const functions: string[] = [];

  // إزالة '=' من البداية
  const cleanFormula = rawFormula.startsWith('=') ? rawFormula.substring(1) : rawFormula;

  // ترجمة الدوال العربية وتوحيد الأرقام
  const translated = translateFormula(cleanFormula);

  // استخراج المراجع
  const cellMatches = translated.match(CELL_REFERENCE_PATTERN);
  if (cellMatches) cellReferences.push(...cellMatches);

  const rangeMatches = translated.match(RANGE_PATTERN);
  if (rangeMatches) cellReferences.push(...rangeMatches);

  const colMatches = translated.match(COLUMN_RANGE_PATTERN);
  if (colMatches) cellReferences.push(...colMatches);

  const rowMatches = translated.match(ROW_RANGE_PATTERN);
  if (rowMatches) cellReferences.push(...rowMatches);

  // استخراج الدوال
  const fnMatches = translated.matchAll(FUNCTION_PATTERN);
  for (const match of fnMatches) {
    const fnName = (match[1] ?? '').toUpperCase();
    functions.push(fnName);
    if (!ENGLISH_FUNCTIONS.includes(fnName)) {
      warnings.push(`Unknown function: ${fnName}`);
    }
  }

  // التحقق من الأقواس
  const openParens = (translated.match(/\(/g) || []).length;
  const closeParens = (translated.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push('Mismatched parentheses');
  }

  if (cleanFormula.trim().length === 0) {
    errors.push('Empty formula');
  }

  return {
    isValid: errors.length === 0,
    formula: cleanFormula,
    errors,
    warnings,
    cellReferences,
    functions,
    translatedFormula: translated,
  };
}

/** التحقق من صحة الصيغة */
export function validateFormula(formula: string): FormulaValidation {
  return parseFormula(formula);
}

// ─────────────────────────────────────────────────────────────────────────────
// Cell Reference Utilities
// ─────────────────────────────────────────────────────────────────────────────

/** تحويل حرف العمود إلى فهرس (A=0, B=1, Z=25, AA=26) */
export function columnToIndex(column: string): number {
  let index = 0;
  for (let i = 0; i < column.length; i++) {
    index = index * 26 + (column.charCodeAt(i) - 64);
  }
  return index - 1;
}

/** تحويل الفهرس إلى حرف العمود (0=A, 1=B, 25=Z, 26=AA) */
export function indexToColumn(index: number): string {
  let column = '';
  let num = index + 1;
  while (num > 0) {
    const remainder = (num - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    num = Math.floor((num - 1) / 26);
  }
  return column;
}

/** تحليل مرجع الخلية إلى مكونات */
export function parseCellReference(ref: string): CellReference | null {
  const pattern = /^(\$)?([A-Z]+)(\$)?(\d+)$/i;
  const match = ref.match(pattern);
  if (!match?.[2] || !match[4]) return null;
  return {
    column: match[2].toUpperCase(),
    row: parseInt(match[4], 10),
    absoluteColumn: match[1] === '$',
    absoluteRow: match[3] === '$',
  };
}

/** تنسيق مرجع الخلية */
export function formatCellReference(
  column: string,
  row: number,
  absoluteColumn = false,
  absoluteRow = false,
): string {
  const colPrefix = absoluteColumn ? '$' : '';
  const rowPrefix = absoluteRow ? '$' : '';
  return `${colPrefix}${column}${rowPrefix}${row}`;
}

/** فحص المراجع الدائرية */
export function hasCircularReference(formula: string, currentCell: string): boolean {
  const validation = parseFormula(formula);
  return validation.cellReferences.includes(currentCell);
}

/** تعديل المراجع النسبية عند النسخ */
export function adjustReferences(formula: string, rowOffset: number, colOffset: number): string {
  const translated = translateFormula(formula);
  const references = translated.match(CELL_REFERENCE_PATTERN);
  if (!references) return translated;

  let modified = translated;
  for (const ref of references) {
    const parsed = parseCellReference(ref);
    if (!parsed) continue;

    const newCol =
      !parsed.absoluteColumn && colOffset !== 0
        ? indexToColumn(columnToIndex(parsed.column) + colOffset)
        : parsed.column;

    const newRow = !parsed.absoluteRow && rowOffset !== 0 ? parsed.row + rowOffset : parsed.row;

    const newRef = formatCellReference(newCol, newRow, parsed.absoluteColumn, parsed.absoluteRow);
    modified = modified.replace(ref, newRef);
  }
  return modified;
}

/** الحصول على جميع المراجع الفريدة */
export function getAllReferences(formula: string): readonly string[] {
  const validation = parseFormula(formula);
  return Array.from(new Set(validation.cellReferences));
}

/** تنقية الصيغة من أي محتوى خطير */
export function sanitizeFormula(formula: string): string {
  if (!formula) return '';
  let cleaned = formula.trim();
  if (cleaned.startsWith('=')) cleaned = cleaned.substring(1);
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  return cleaned;
}
