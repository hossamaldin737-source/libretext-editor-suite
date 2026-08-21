/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: docx-builders.ts
 * 📂 المسار: packages/serializers/src/docx/docx-builders.ts
 * 🎯 الهدف الرئيسي: بناء عناصر مستند Word (فقرات، جداول، عناوين، قوائم)
 * 📋 المعايير: Zero external dependencies, pure TypeScript, modular builders
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-builders.test.ts
 * 🏷️ المعرف: SER-006-03
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Component Builder & Dispatcher Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دعم الاتجاه ثنائي الاتجاه RTL للغة العربية
 *    2. ضمان عدم تجاوز 50 سطر لكل دالة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  BorderStyle,
  WidthType,
  AlignmentType,
} from './docx-model';
import type { ContentBlock, TableData } from '../parsers/markdown';
import { parseInlineFormatting } from './inline-parser';
import {
  DEFAULTS,
  HEADING_LEVELS,
  clampHeadingLevel,
  type DocxConversionOptions,
} from './docx-types';

export function buildHeading(block: ContentBlock, options: DocxConversionOptions): Paragraph {
  const level = clampHeadingLevel(block.level || 1);
  const text = typeof block.content === 'string' ? block.content : '';

  return new Paragraph({
    text,
    heading: HEADING_LEVELS[level],
    spacing: { before: 240, after: 120 },
    bidirectional: options.rtl,
    alignment: options.rtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
    style: `Heading${level}`,
  });
}

export function buildParagraph(block: ContentBlock, options: DocxConversionOptions): Paragraph {
  const text = typeof block.content === 'string' ? block.content : '';
  const runs = parseInlineFormatting(text, options.fontFamily);

  return new Paragraph({
    children: runs,
    spacing: { after: 120 },
    bidirectional: options.rtl,
    alignment: options.rtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
  });
}

export function buildList(block: ContentBlock, options: DocxConversionOptions): Paragraph[] {
  const items = Array.isArray(block.content) ? block.content : [];

  return items.map((item) => {
    const text = typeof item === 'string' ? item : '';
    const runs = parseInlineFormatting(text, options.fontFamily);

    return new Paragraph({
      children: runs,
      style: 'ListParagraph',
      bullet: block.ordered ? undefined : { level: 0 },
      numbering: block.ordered ? { reference: 'default-numbering', level: 0 } : undefined,
      spacing: { after: 60 },
      bidirectional: options.rtl,
    });
  });
}

export function buildTable(tableData: TableData, options: DocxConversionOptions): Table {
  const rows: TableRow[] = [];

  if (tableData.headers.length > 0) {
    rows.push(buildTableHeaderRow(tableData.headers, options));
  }

  for (const row of tableData.rows) {
    rows.push(buildTableDataRow(row, options));
  }

  const border = { style: BorderStyle.SINGLE, size: 1, color: '000000' };
  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: border,
      bottom: border,
      left: border,
      right: border,
      insideHorizontal: border,
      insideVertical: border,
    },
  });
}

function buildTableHeaderRow(headers: string[], options: DocxConversionOptions): TableRow {
  const headerCells = headers.map(
    (header) =>
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: header,
                bold: true,
                style: 'Strong',
                font: options.fontFamily ?? DEFAULTS.FONT_FAMILY,
              }),
            ],
          }),
        ],
        shading: { fill: DEFAULTS.TABLE_HEADER_BG },
      }),
  );
  return new TableRow({ children: headerCells });
}

function buildTableDataRow(row: string[], options: DocxConversionOptions): TableRow {
  const cells = row.map(
    (cellValue) =>
      new TableCell({
        children: [
          new Paragraph({
            children: parseInlineFormatting(cellValue, options.fontFamily),
          }),
        ],
      }),
  );
  return new TableRow({ children: cells });
}

export function buildCodeBlock(block: ContentBlock, options: DocxConversionOptions): Paragraph[] {
  const code = typeof block.content === 'string' ? block.content : '';
  const lines = code.split('\n');

  return lines.map(
    (line, idx) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line || ' ',
            font: DEFAULTS.CODE_FONT,
          }),
        ],
        shading: { fill: DEFAULTS.CODE_BLOCK_BG },
        spacing: {
          before: idx === 0 ? 120 : 0,
          after: idx === lines.length - 1 ? 120 : 0,
          line: 276,
        },
        bidirectional: options.rtl,
      }),
  );
}

export function buildHorizontalRule(): Paragraph {
  return new Paragraph({
    border: {
      bottom: {
        color: '999999',
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    spacing: { before: 240, after: 240 },
  });
}

export type DocxElement = Paragraph | Table;

export function buildElement(block: ContentBlock, options: DocxConversionOptions): DocxElement[] {
  switch (block.type) {
    case 'heading':
      return [buildHeading(block, options)];
    case 'paragraph':
      return [buildParagraph(block, options)];
    case 'list':
      return buildList(block, options);
    case 'table':
      if (
        typeof block.content === 'object' &&
        block.content !== null &&
        'headers' in block.content
      ) {
        return [buildTable(block.content as TableData, options)];
      }
      return [];
    case 'code':
      return buildCodeBlock(block, options);
    case 'hr':
      return [buildHorizontalRule()];
    default:
      return [];
  }
}

export function buildElements(
  blocks: ContentBlock[],
  options: DocxConversionOptions,
): DocxElement[] {
  return blocks.flatMap((block) => buildElement(block, options));
}
