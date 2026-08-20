/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: markdown.ts
 * 📂 المسار: packages/serializers/src/parsers/markdown.ts
 * 🎯 الهدف الرئيسي: تفكيك وتحليل نصوص Markdown إلى كتل محتوى مهيكلة
 * 📋 المعايير: Zero external dependencies, pure TypeScript, safe parsing
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-converter.test.ts
 * 🏷️ المعرف: SER-006-06
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Line Scanner + Block Reducer Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الجداول متعددة الصفوف والأعمدة
 *    2. الكتل البرمجية متعددة الأسطر
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'table' | 'code' | 'hr';
  level?: number;
  content?: string | string[] | TableData;
  ordered?: boolean;
  language?: string;
}

export interface ParsedMarkdown {
  content: ContentBlock[];
}

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const lines = markdown.split(/\r?\n/);
  const blocks: ContentBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      i = parseCodeBlock(lines, i, blocks);
    } else if (trimmed.startsWith('|')) {
      i = parseTableBlock(lines, i, blocks);
    } else if (/^#{1,6}\s+/.test(line)) {
      parseHeadingBlock(line, blocks);
      i++;
    } else if (/^(\*|-|\+)\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      i = parseListBlock(lines, i, blocks);
    } else if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
    } else if (trimmed.length > 0) {
      blocks.push({ type: 'paragraph', content: trimmed });
      i++;
    } else {
      i++;
    }
  }

  return { content: blocks };
}

function parseHeadingBlock(line: string, blocks: ContentBlock[]): void {
  const match = line.match(/^(#{1,6})\s+(.*)$/);
  if (match?.[1] && match[2] !== undefined) {
    blocks.push({
      type: 'heading',
      level: match[1].length,
      content: match[2].trim(),
    });
  }
}

function parseCodeBlock(lines: string[], startIndex: number, blocks: ContentBlock[]): number {
  const langMatch = (lines[startIndex] ?? '').trim().match(/^```(.*)$/);
  const language = langMatch?.[1]?.trim() ?? '';
  const codeLines: string[] = [];
  let i = startIndex + 1;

  while (i < lines.length && !(lines[i] ?? '').trim().startsWith('```')) {
    codeLines.push(lines[i] ?? '');
    i++;
  }

  blocks.push({
    type: 'code',
    language,
    content: codeLines.join('\n'),
  });

  return i < lines.length ? i + 1 : i;
}

function parseTableBlock(lines: string[], startIndex: number, blocks: ContentBlock[]): number {
  const rawRows: string[][] = [];
  let i = startIndex;

  while (i < lines.length && (lines[i] ?? '').trim().startsWith('|')) {
    const cells = (lines[i] ?? '')
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    rawRows.push(cells);
    i++;
  }

  if (rawRows.length > 0) {
    const headers = rawRows[0] || [];
    const rows = rawRows.slice(1).filter((r) => !r.every((c) => /^:?-+:?$/.test(c)));
    blocks.push({
      type: 'table',
      content: { headers, rows },
    });
  }

  return i;
}

function parseListBlock(lines: string[], startIndex: number, blocks: ContentBlock[]): number {
  const items: string[] = [];
  const isOrdered = /^\d+\.\s+/.test(lines[startIndex] ?? '');
  let i = startIndex;

  while (i < lines.length) {
    const currentLine = lines[i] ?? '';
    const match = isOrdered
      ? currentLine.match(/^\d+\.\s+(.*)$/)
      : currentLine.match(/^(\*|-|\+)\s+(.*)$/);

    if (match?.[1]) {
      items.push(match[1].trim());
      i++;
    } else {
      break;
    }
  }

  blocks.push({
    type: 'list',
    ordered: isOrdered,
    content: items,
  });

  return i;
}
