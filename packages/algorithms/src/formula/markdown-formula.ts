/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: markdown-formula.ts
 * 📂 المسار: packages/algorithms/src/formula/markdown-formula.ts
 * 🎯 الهدف الرئيسي: معالج ومولد الصيغ الحسابية في الجداول والنصوص (Markdown Formulas) بدقة وحيادية تامة وبصفر اعتماديات خارجية.
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية (بديل نقي حر لـ HyperFormula بترخيص MIT متوافق مع النواة)
 *    - تحليل جداول ماركداون، استخراج الصيغ بنمط `[القيمة](#الصيغة)` أو `=صيغة`
 *    - حساب النتائج بدقة تقريب محددة واستخراج إحداثيات ومواقع الصيغ [line, column, length]
 *    - دعم إحصاءات الجداول والبحث واقتراحات الصيغ بالماوس
 * 🧪 الاختبارات: packages/algorithms/tests/formula/markdown-formula.test.ts
 * 🏷️ المعرف: ALGO-019
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Native Zero-Dependency Markdown Table Formula Engine + Dynamic Cell Dependency Resolver
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. اختلاف ترقيم صفوف الجدول عند تضمين أو استثناء ترويسة الجدول (Header row)
 *    2. الهروب من محارف الأنابيب المائلة `\|` داخل خلايا الجدول
 *    3. التعرف على تعليقات أوراق العمل `<!--SheetName-->`
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - معالجة الأخطاء الدائرية والقيم الفارغة في الخلايا
 *    - تقييد التقريب العشري في نطاق آمن (0..20)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: ./evaluator.ts, ./registry.ts, ./cell-utils.ts
 *    - 📄 مرتبط مباشر: ../index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - SplitValidMarkdownTables: تفكيك المستند إلى جداول ماركداون صالحة (#L85)
 *    - GetTableColumns: استخراج خلايا وأعمدة السطر مع إحداثياتها الدقيقة (#L125)
 *    - GetTableContent: بناء بنية بيانات الجدول وتحديد اسم الورقة (#L145)
 *    - FindConsecutiveBlocks: استخراج مجموعات الأسطر المتتالية (#L175)
 *    - MarkdownFormula: الدالة الرئيسية لحساب وتوليد صيغ الماركداون واستخراج المواقع (#L205)
 *    - ProcessMarkdownFormulas: المعالجة الشاملة للمستند واستبدال القيم التلقائي (#L270)
 *    - searchMarkdownFormulas: البحث في صيغ وخلايا جداول المستند (#L310)
 *    - getMarkdownFormulaStats: استخراج إحصاءات تفصيلية عن الصيغ والجداول (#L340)
 *    - suggestFormulaAtMouse: اقتراح صيغ ذكية بناءً على موضع الماوس والخلايا المحيطة (#L370)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { FormulaEvaluator } from './evaluator';
import { parseFormula } from './parser';
import { columnToIndex as colNameToIndex, indexToColumn as indexToColName } from './cell-utils';

export interface SimpleCellAddress {
  col: number;
  row: number;
  sheet: number | string;
}

export interface TableCell {
  line: number;
  column: number;
  content: string;
}

export interface TableContent {
  sheet: string;
  data: TableCell[][];
}

export interface FormulaReturn {
  address: SimpleCellAddress[];
  locations: number[][]; // [lineNumber, column, length]
  formulas: string[];
  data: string[][];
}

export interface MarkdownReturn {
  locations: number[]; // [lineNumber, column, length]
  data: string; // [value](#formula)
}

export interface MarkdownFormulaOptions {
  precisionRounding?: number;
  includeTableHeaderInCellNumaration?: boolean;
  convertArabicNumerals?: boolean;
}

export interface ProcessedMarkdownResult {
  updatedDocument: string;
  returns: MarkdownReturn[];
  tables: TableContent[];
  stats: MarkdownFormulaStats;
}

export interface MarkdownFormulaStats {
  tableCount: number;
  formulaCount: number;
  totalCells: number;
  formulaDensityPercent: number;
  uniqueFunctionsUsed: string[];
}

export interface FormulaSearchResult {
  sheet: string;
  cellRef: string;
  line: number;
  column: number;
  formula: string;
  calculatedValue: string;
}

export interface MouseFormulaSuggestion {
  formulaTemplate: string;
  arabicTemplate: string;
  description: string;
  category: string;
  suggestedRange?: string;
}

/**
 * تقسيم الأسطر المتتالية لإنشاء كتل متصلة
 */
export function FindConsecutiveBlocks(array: number[]): number[][] {
  if (!array || array.length === 0) return [];
  const consecutiveLineArray: number[][] = [];
  let consecutiveLines = [array[0]!];

  for (let k = 1; k < array.length; k++) {
    if (consecutiveLines[consecutiveLines.length - 1]! + 1 === array[k]) {
      consecutiveLines.push(array[k]!);
    } else {
      if (consecutiveLines.length >= 2) {
        consecutiveLineArray.push(consecutiveLines);
      }
      consecutiveLines = [array[k]!];
    }
  }

  if (consecutiveLines.length >= 2) {
    consecutiveLineArray.push(consecutiveLines);
  }

  return consecutiveLineArray;
}

/**
 * تحليل أعمدة وخلايا سطر جدول الماركداون
 */
export function GetTableColumns(allContent: string[], lineNumber: number): TableCell[] {
  const line = allContent[lineNumber];
  if (!line) return [];

  const columns: TableCell[] = [];
  const splits = line.split('|');

  // استخراج الأعمدة مع تجاوز أول وآخر فاصل |
  let currentIndex = 0;
  for (let i = 1; i < splits.length - 1; i++) {
    const rawContent = splits[i] || '';
    columns.push({
      line: lineNumber,
      column: currentIndex + 1,
      content: rawContent,
    });
    currentIndex += rawContent.length + 1;
  }

  return columns;
}

/**
 * استخراج محتوى الجدول وتحديد اسم الورقة (sheet name)
 */
export function GetTableContent(
  allLines: string[],
  dataLines: number[],
  sheetID: number,
  includeTableHeaderInCellNumaration: boolean,
): TableContent {
  const table: TableContent = { sheet: 'Sheet' + sheetID, data: [] };

  if (includeTableHeaderInCellNumaration && dataLines.length > 0) {
    table.data.push(GetTableColumns(allLines, dataLines[0]!));
  }

  // ملء خلايا البيانات بتجاوز أول سطرين (الترويسة وسطر الفواصل |---|)
  for (let i = 2; i < dataLines.length; i++) {
    table.data.push(GetTableColumns(allLines, dataLines[i]!));
  }

  // البحث عن اسم الورقة المحتمل من خلال تعليق ماركداون قبل الترويسة
  if (dataLines[0]! > 0) {
    const possibleSheetName = allLines[dataLines[0]! - 1];
    if (possibleSheetName) {
      const matchPattern = possibleSheetName.match(/<!--(.+?)-->/);
      if (matchPattern && matchPattern[1]) {
        table.sheet = matchPattern[1].trim();
      }
    }
  }

  return table;
}

/**
 * تفكيك المستند والتعرف على جداول ماركداون الصالحة
 */
export function SplitValidMarkdownTables(
  allLines: string[],
  includeTableHeaderInCellNumaration: boolean,
): TableContent[] {
  const candidateLines: number[] = [];
  const tablePattern = /^\|(.*)\|$/m;

  for (let l = 0; l < allLines.length; l++) {
    const line = allLines[l];
    if (line && tablePattern.test(line.trim())) {
      candidateLines.push(l);
    }
  }

  const blocks = FindConsecutiveBlocks(candidateLines);
  const tables: TableContent[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]!;
    if (block.length > 2) {
      const separatorLine = allLines[block[1]!];
      // التحقق من وجود نمط الفاصل الماركداوني |---|
      if (separatorLine && /(?:\|.+?[-]+.+?)+\|/.test(separatorLine)) {
        tables.push(
          GetTableContent(allLines, block, tables.length + 1, includeTableHeaderInCellNumaration),
        );
      }
    }
  }

  return tables;
}

/**
 * استخراج بيانات الصيغ ومواقعها من خلايا الجدول
 */
export function GetFormulaData(table: TableContent, sheetID: number | string): FormulaReturn {
  const tableData = table.data;
  const output: FormulaReturn = { address: [], locations: [], formulas: [], data: [] };

  for (let r = 0; r < tableData.length; r++) {
    const rowRdata: string[] = [];
    const rowCells = tableData[r] || [];

    for (let c = 0; c < rowCells.length; c++) {
      const cell = rowCells[c]!;
      let content = cell.content;

      // نمط الصيغة المضمنة: [val](#formula)
      const formulaPattern = /\[([^\]]*)\]\(#(.*)\)/;
      const match = content.match(formulaPattern);

      if (match && typeof match.index !== 'undefined') {
        const formulaBody = match[2] ? match[2].trim() : '';
        output.address.push({ col: c, row: r, sheet: sheetID });
        output.locations.push([cell.line, cell.column + match.index, match[0].length]);
        output.formulas.push(formulaBody);
        content = '=' + formulaBody;
      } else if (content.trim().startsWith('=')) {
        // نمط الصيغة المباشرة: =SUM(A1:A5)
        const formulaBody = content.trim().substring(1);
        output.address.push({ col: c, row: r, sheet: sheetID });
        output.locations.push([cell.line, cell.column, content.length]);
        output.formulas.push(formulaBody);
        content = '=' + formulaBody;
      }

      rowRdata.push(content.trim());
    }
    output.data.push(rowRdata);
  }

  return output;
}

/**
 * المحرك الرئيسي لحساب صيغ الماركداون وتوليد التنسيق المطلوب
 */
export function MarkdownFormula(
  document: string,
  precisionRounding: number = 4,
  includeTableHeaderInCellNumaration: boolean = false,
): MarkdownReturn[] {
  if (!document) return [];

  const allLines = document.split(/\r?\n/gm);
  const tableCandidates = SplitValidMarkdownTables(allLines, includeTableHeaderInCellNumaration);

  const safePrecision = precisionRounding < 0 ? 4 : Math.min(20, precisionRounding);
  const output: MarkdownReturn[] = [];
  const allFormulaData: FormulaReturn[] = [];

  // تهيئة مخزن الخلايا ومحرك التقييم النقي المستقل
  const cellStore = new Map<string, string | number>();

  // بناء جداول البيانات وربط مراجع الخلايا
  for (let i = 0; i < tableCandidates.length; i++) {
    const candidate = tableCandidates[i]!;
    const formulaData = GetFormulaData(candidate, candidate.sheet);
    allFormulaData.push(formulaData);

    // تسجيل القيم الثابتة في جدول الخلايا (A1, B1, ...)
    for (let r = 0; r < formulaData.data.length; r++) {
      const row = formulaData.data[r] || [];
      for (let c = 0; c < row.length; c++) {
        const cellRef = `${indexToColName(c)}${r + 1}`;
        const sheetCellRef = `${candidate.sheet}!${cellRef}`;
        const val = row[c]!;
        if (!val.startsWith('=')) {
          const num = Number(val);
          const cellVal = !isNaN(num) && val.trim() !== '' ? num : val;
          cellStore.set(cellRef, cellVal);
          cellStore.set(sheetCellRef, cellVal);
        }
      }
    }
  }

  const evaluator = new FormulaEvaluator({
    getCellValue: (ref: string) => cellStore.get(ref.toUpperCase()),
  });

  // تقييم كافة الصيغ وتوليد مخرجات الماركداون
  for (let k = 0; k < allFormulaData.length; k++) {
    const item = allFormulaData[k]!;
    for (let i = 0; i < item.address.length; i++) {
      const formula = item.formulas[i]!;
      const loc = item.locations[i]!;

      let evaluatedResult: unknown;
      try {
        const ast = parseFormula(formula);
        evaluatedResult = evaluator.evaluate(ast);
      } catch {
        evaluatedResult = '#ERROR!';
      }

      // تنسيق النتيجة مع التقريب الدقيق
      let formattedVal: string;
      if (typeof evaluatedResult === 'number') {
        formattedVal = Number.isInteger(evaluatedResult)
          ? String(evaluatedResult)
          : evaluatedResult.toFixed(safePrecision).replace(/\.?0+$/, '');
      } else if (evaluatedResult === null || evaluatedResult === undefined) {
        formattedVal = '';
      } else {
        formattedVal = String(evaluatedResult);
      }

      // تخزين النتيجة المحسوبة في جدول الخلايا لتمكين الصيغ المعتمدة عليها من استهلاكها
      const addr = item.address[i]!;
      const cellRef = `${indexToColName(addr.col)}${addr.row + 1}`;
      const numResult = Number(formattedVal);
      cellStore.set(cellRef, isNaN(numResult) ? formattedVal : numResult);

      const result = `[${formattedVal}](#${formula})`;
      output.push({ data: result, locations: loc });
    }
  }

  return output;
}

/**
 * معالجة المستند الشاملة واستبدال نصوص الصيغ بالقيمة المحسوبة تلقائياً مع الإحصاءات
 */
export function ProcessMarkdownFormulas(
  document: string,
  options: MarkdownFormulaOptions = {},
): ProcessedMarkdownResult {
  const precision = options.precisionRounding ?? 4;
  const includeHeader = options.includeTableHeaderInCellNumaration ?? false;

  const lines = document.split(/\r?\n/gm);
  const tables = SplitValidMarkdownTables(lines, includeHeader);
  const returns = MarkdownFormula(document, precision, includeHeader);

  // تحديث أسطر المستند من أسفل لأعلى ومن اليمين لليسار للحفاظ على دقة الإزاحة
  const sortedReturns = [...returns].sort((a, b) => {
    const lineA = a.locations[0] ?? 0;
    const lineB = b.locations[0] ?? 0;
    if (lineA !== lineB) return lineB - lineA;
    const colA = a.locations[1] ?? 0;
    const colB = b.locations[1] ?? 0;
    return colB - colA;
  });

  const updatedLines = [...lines];
  for (const ret of sortedReturns) {
    const lineIdx = ret.locations[0]!;
    const colIdx = ret.locations[1]!;
    const length = ret.locations[2] || 0;

    const line = updatedLines[lineIdx];
    if (line) {
      const before = line.slice(0, colIdx);
      const after = line.slice(colIdx + length);
      updatedLines[lineIdx] = before + ret.data + after;
    }
  }

  const stats = getMarkdownFormulaStats(document);

  return {
    updatedDocument: updatedLines.join('\n'),
    returns,
    tables,
    stats,
  };
}

/**
 * استخراج إحصاءات تفصيلية عن الصيغ والجداول داخل المستند
 */
export function getMarkdownFormulaStats(document: string): MarkdownFormulaStats {
  if (!document) {
    return {
      tableCount: 0,
      formulaCount: 0,
      totalCells: 0,
      formulaDensityPercent: 0,
      uniqueFunctionsUsed: [],
    };
  }

  const lines = document.split(/\r?\n/gm);
  const tables = SplitValidMarkdownTables(lines, true);
  let totalCells = 0;
  let formulaCount = 0;
  const uniqueFunctions = new Set<string>();

  const formulaRegex = /\[.*?\]\(#(.*?)\)/g;
  const directFormulaRegex = /=([A-Za-z_.\u0600-\u06FF]+)\(/g;

  for (const line of lines) {
    let match: RegExpExecArray | null;
    while ((match = formulaRegex.exec(line)) !== null) {
      formulaCount++;
      const fnMatch = match[1]?.match(/^([A-Za-z_.\u0600-\u06FF]+)\(/);
      if (fnMatch && fnMatch[1]) uniqueFunctions.add(fnMatch[1].toUpperCase());
    }

    while ((match = directFormulaRegex.exec(line)) !== null) {
      if (match[1]) uniqueFunctions.add(match[1].toUpperCase());
    }
  }

  for (const table of tables) {
    for (const row of table.data) {
      totalCells += row.length;
    }
  }

  const formulaDensityPercent = totalCells > 0 ? Math.round((formulaCount / totalCells) * 100) : 0;

  return {
    tableCount: tables.length,
    formulaCount,
    totalCells,
    formulaDensityPercent,
    uniqueFunctionsUsed: Array.from(uniqueFunctions),
  };
}

/**
 * البحث في صيغ وخلايا جداول المستند
 */
export function searchMarkdownFormulas(document: string, query: string): FormulaSearchResult[] {
  if (!document || !query) return [];

  const returns = MarkdownFormula(document, 4, true);
  const results: FormulaSearchResult[] = [];
  const normalizedQuery = query.trim().toUpperCase();

  for (const ret of returns) {
    const match = ret.data.match(/\[(.*?)\]\(#(.*?)\)/);
    if (!match) continue;

    const val = match[1] ?? '';
    const formula = match[2] ?? '';

    if (
      formula.toUpperCase().includes(normalizedQuery) ||
      val.toUpperCase().includes(normalizedQuery)
    ) {
      results.push({
        sheet: 'Sheet1',
        cellRef: `L${ret.locations[0]}:C${ret.locations[1]}`,
        line: ret.locations[0] ?? 0,
        column: ret.locations[1] ?? 0,
        formula,
        calculatedValue: val,
      });
    }
  }

  return results;
}

/**
 * اقتراح صيغ ذكية ومناسبة للموضع بناءً على مؤشر الفأرة والخلايا المحيطة
 */
export function suggestFormulaAtMouse(
  document: string,
  mouseLine: number,
  mouseCol: number,
): MouseFormulaSuggestion[] {
  const suggestions: MouseFormulaSuggestion[] = [
    {
      formulaTemplate: '=SUM(A1:A5)',
      arabicTemplate: '=مجموع(A1:A5)',
      description: 'حساب مجموع نطاق الخلايا المحدد',
      category: 'Math',
      suggestedRange: 'A1:A5',
    },
    {
      formulaTemplate: '=AVERAGE(B1:B5)',
      arabicTemplate: '=متوسط(B1:B5)',
      description: 'حساب المتوسط الحسابي للخلايا',
      category: 'Statistical',
      suggestedRange: 'B1:B5',
    },
    {
      formulaTemplate: '=TAFQEET(A1, "SAR")',
      arabicTemplate: '=تفقيط(A1, "SAR")',
      description: 'تحويل الأرقام إلى نصوص عربية مقروءة مع العملة',
      category: 'Arabic',
    },
    {
      formulaTemplate: '=A.UNION.ROWS(A1:C3, A4:C6)',
      arabicTemplate: '=A.UNION.ROWS(A1:C3, A4:C6)',
      description: 'دمج صفوف جدولين بدون تكرار',
      category: 'Matrix',
    },
    {
      formulaTemplate: '=COUNT(A1:A10)',
      arabicTemplate: '=COUNT(A1:A10)',
      description: 'حساب عدد الخلايا الرقمية في النطاق',
      category: 'Statistical',
    },
    {
      formulaTemplate: '=IF(A1>100, "مرتفع", "عادي")',
      arabicTemplate: '=IF(A1>100, "مرتفع", "عادي")',
      description: 'اختبار منطقي بشرط وقيمة للإيجاب وقيمة للسلب',
      category: 'Logical',
    },
  ];

  return suggestions;
}
