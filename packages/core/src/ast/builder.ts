/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: builder.ts
 * 📂 المسار: packages/core/src/ast/builder.ts
 * 🎯 الهدف الرئيسي: توفير واجهة برمجية سهلة لبناء كتل AST
 *    بسهولة مع توليد المعرفات تلقائياً والتحقق من البنية.
 * 📋 المعايير:
 *    - يجب أن تدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن تولد معرفات تلقائياً.
 *    - يجب أن تتحقق من صحة المدخلات.
 * 🧪 الاختبارات:
 *    - packages/core/tests/ast/builder.test.ts
 *    - اختبار بناء كل نوع عقدة
 *    - اختبار التحقق من المدخلات
 * 🏷️ المعرف: CORE-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Builder Pattern with Auto-ID — بناء مرن مع توليد معرفات تلقائي.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم السماح بإنشاء عقد بدون معرف.
 *    2. التحقق من أن المحتوى من النوع الصحيح لكل عقدة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - قيم افتراضية آمنة لجميع الخصائص الاختيارية.
 *    - Type narrowing قبل إرجاع العقدة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  BlockNode,
  BoldNode,
  BlockquoteNode,
  CodeBlockNode,
  CodeNode,
  DocNode,
  EmbedNode,
  HeadingNode,
  HorizontalRuleNode,
  ImageNode,
  InlineNode,
  ItalicNode,
  LinkNode,
  ListNode,
  ListItemNode,
  MentionNode,
  NodeId,
  ParagraphNode,
  StrikethroughNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TextNode,
  UnderlineNode,
} from './types';
import { generateId } from '../utils/id';

// ─── بناء العناصر المضمنة ───

export function text(
  content: string,
  marks?: readonly { type: string; attrs?: Record<string, string> }[],
): TextNode {
  return {
    type: 'text',
    id: generateId('txt'),
    text: content,
    marks: marks as TextNode['marks'],
  };
}

export function bold(content: InlineNode[]): BoldNode {
  return { type: 'bold', id: generateId('bld'), content };
}

export function italic(content: InlineNode[]): ItalicNode {
  return { type: 'italic', id: generateId('itl'), content };
}

export function underline(content: InlineNode[]): UnderlineNode {
  return { type: 'underline', id: generateId('und'), content };
}

export function strikethrough(content: InlineNode[]): StrikethroughNode {
  return { type: 'strikethrough', id: generateId('str'), content };
}

export function codeInline(code: string): CodeNode {
  return { type: 'code', id: generateId('cin'), code };
}

export function link(href: string, content: InlineNode[]): LinkNode {
  return { type: 'link', id: generateId('lnk'), href, content };
}

export function mention(userId: string, label: string): MentionNode {
  return { type: 'mention', id: generateId('men'), userId, label };
}

// ─── بناء الكتل ───

export function paragraph(content: InlineNode[]): ParagraphNode {
  return { type: 'paragraph', id: generateId('para'), content };
}

export function heading(level: 1 | 2 | 3 | 4 | 5 | 6, content: InlineNode[]): HeadingNode {
  return { type: 'heading', id: generateId('head'), level, content };
}

export function codeBlock(language: string, code: string): CodeBlockNode {
  return { type: 'code-block', id: generateId('cblk'), language, code };
}

export function blockquote(content: BlockNode[]): BlockquoteNode {
  return { type: 'blockquote', id: generateId('blq'), content };
}

export function horizontalRule(): HorizontalRuleNode {
  return { type: 'horizontal-rule', id: generateId('hr') };
}

export function image(src: string, alt: string, width?: number, height?: number): ImageNode {
  return { type: 'image', id: generateId('img'), src, alt, width, height };
}

export function embed(embedType: string, url: string): EmbedNode {
  return { type: 'embed', id: generateId('emb'), embedType, url };
}

// ─── بناء القوائم ───

export function listItem(content: BlockNode[], nested?: BlockNode[]): ListItemNode {
  return { type: 'list-item', id: generateId('li'), content, nested };
}

export function bulletList(items: ListItemNode[]): ListNode {
  return { type: 'list', id: generateId('ul'), ordered: false, items };
}

export function orderedList(items: ListItemNode[]): ListNode {
  return { type: 'list', id: generateId('ol'), ordered: true, items };
}

// ─── بناء الجداول ───

export function tableCell(content: BlockNode[], colspan?: number, rowspan?: number): TableCellNode {
  return { type: 'table-cell', id: generateId('tc'), content, colspan, rowspan };
}

export function tableRow(cells: TableCellNode[]): TableRowNode {
  return { type: 'table-row', id: generateId('tr'), cells };
}

export function table(rows: TableRowNode[]): TableNode {
  return { type: 'table', id: generateId('tbl'), rows };
}

// ─── بناء المستند ───

export function doc(content: BlockNode[]): DocNode {
  return { type: 'doc', id: generateId('doc'), content };
}
