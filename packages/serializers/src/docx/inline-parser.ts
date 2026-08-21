/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: inline-parser.ts
 * 📂 المسار: packages/serializers/src/docx/inline-parser.ts
 * 🎯 الهدف الرئيسي: محلل التنسيقات المضمنة داخل النصوص لـ Word DOCX
 * 📋 المعايير: Zero external dependencies, pure regex tokenizer, type-safe
 * 🧪 الاختبارات: packages/serializers/tests/docx/inline-parser.test.ts
 * 🏷️ المعرف: SER-006-02
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Ordered Multi-Pattern Tokenizer with Overlap Resolution
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. المطابقات المتداخلة بين الغامق والمائل (Bold قبل Italic)
 *    2. الروابط والأكواد المضمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { TextRun, ExternalHyperlink } from './docx-model';
import { DEFAULTS } from './docx-types';

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; text: string };

const INLINE_PATTERNS = [
  { type: 'bold', regex: /\*\*([^*]+)\*\*/g },
  { type: 'italic', regex: /(?<!\*)\*([^*]+)\*(?!\*)/g },
  { type: 'code', regex: /`([^`]+)`/g },
  { type: 'link', regex: /\[([^\]]+)\]\(([^)]+)\)/g },
] as const;

interface RawMatch {
  type: 'bold' | 'italic' | 'code' | 'link';
  start: number;
  end: number;
  value: string;
  href?: string;
}

/** تحويل نص Markdown إلى tokens */
export function tokenizeInline(text: string): InlineToken[] {
  if (!text) return [];

  const rawMatches = collectPatternMatches(text);
  rawMatches.sort((a, b) => a.start - b.start);

  const filteredMatches = filterOverlappingMatches(rawMatches);
  return buildTokensFromMatches(text, filteredMatches);
}

function collectPatternMatches(text: string): RawMatch[] {
  const matches: RawMatch[] = [];

  for (const pattern of INLINE_PATTERNS) {
    const regex = new RegExp(pattern.regex);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (pattern.type === 'link') {
        matches.push({
          type: 'link',
          start: match.index,
          end: match.index + match[0].length,
          value: match[1] ?? '',
          href: match[2] ?? '',
        });
      } else {
        matches.push({
          type: pattern.type,
          start: match.index,
          end: match.index + match[0].length,
          value: match[1] ?? '',
        });
      }
    }
  }

  return matches;
}

function filterOverlappingMatches(matches: RawMatch[]): RawMatch[] {
  const filtered: RawMatch[] = [];
  let lastEnd = 0;

  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }

  return filtered;
}

function buildTokensFromMatches(text: string, matches: RawMatch[]): InlineToken[] {
  const tokens: InlineToken[] = [];
  let cursor = 0;

  for (const m of matches) {
    if (m.start > cursor) {
      tokens.push({ type: 'text', value: text.slice(cursor, m.start) });
    }
    if (m.type === 'link') {
      tokens.push({ type: 'link', text: m.value, href: m.href || '' });
    } else {
      tokens.push({ type: m.type, value: m.value });
    }
    cursor = m.end;
  }

  if (cursor < text.length) {
    tokens.push({ type: 'text', value: text.slice(cursor) });
  }

  return tokens;
}

/**
 * تحويل نص Markdown إلى TextRun[] جاهز للاستخدام في DOCX
 * يدعم: bold, italic, code, links
 */
export function parseInlineFormatting(
  text: string,
  fontFamily: string = DEFAULTS.FONT_FAMILY,
): Array<TextRun | ExternalHyperlink> {
  if (!text) return [new TextRun({ text: '', font: fontFamily })];

  const tokens = tokenizeInline(text);
  if (tokens.length === 0) {
    return [new TextRun({ text: '', font: fontFamily })];
  }

  return tokens.map((token) => mapTokenToDocxRun(token, fontFamily));
}

function mapTokenToDocxRun(token: InlineToken, fontFamily: string): TextRun | ExternalHyperlink {
  switch (token.type) {
    case 'text':
      return new TextRun({ text: token.value, font: fontFamily });
    case 'bold':
      return new TextRun({
        text: token.value,
        bold: true,
        font: fontFamily,
        style: 'Strong',
      });
    case 'italic':
      return new TextRun({
        text: token.value,
        italics: true,
        font: fontFamily,
        style: 'Emphasis',
      });
    case 'code':
      return new TextRun({
        text: token.value,
        font: DEFAULTS.CODE_FONT,
        shading: { fill: DEFAULTS.CODE_BLOCK_BG },
      });
    case 'link':
      return new ExternalHyperlink({
        link: token.href,
        children: [
          new TextRun({
            text: token.text,
            style: 'Hyperlink',
            font: fontFamily,
          }),
        ],
      });
  }
}
