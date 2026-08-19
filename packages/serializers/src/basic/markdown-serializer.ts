/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: markdown-serializer.ts
 * 📂 المسار: packages/serializers/src/basic/markdown-serializer.ts
 * 🎯 الهدف الرئيسي: تحويل مستند AST إلى Markdown مُنسّق وتحليل
 *    نصوص Markdown إلى مستند AST.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج Markdown صالح حسب المعايير.
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/markdown-serializer.test.ts
 * 🏷️ المعرف: SER-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive AST-to-Markdown Serializer — محول تكراري من AST إلى Markdown.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التعامل مع الأسطر الطويلة بشكل صحيح.
 *    2. التأكد من أن القوائم متداخلة بشكل صحيح.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المحتوى الفارغ قبل التحويل.
 *    - التعامل مع أنواع غير معروفة بأمان.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode} from '@libretext/core';

/**
 * محول Markdown — يحول AST إلى Markdown.
 */
export class MarkdownSerializer {
  /**
   * تحويل مستند كامل إلى نص Markdown.
   */
  serialize(doc: DocNode): string {
    const blocks = doc.content.map((block) => this.serializeBlock(block));
    return blocks.join('\n\n');
  }

  private serializeBlock(block: BlockNode): string {
    switch (block.type) {
      case 'paragraph':
        return this.serializeInlineContent(block.content);
      case 'heading': {
        const prefix = '#'.repeat(block.level);
        return `${prefix} ${this.serializeInlineContent(block.content)}`;
      }
      case 'list': {
        const items = block.items.map((item, i) => {
          const bullet = block.ordered ? `${i + 1}.` : '-';
          const content = item.content.map((c) => this.serializeBlock(c)).join('\n');
          const nested = item.nested
            ? '\n' + item.nested.map((n) => `  ${this.serializeBlock(n)}`).join('\n')
            : '';
          return `${bullet} ${content}${nested}`;
        });
        return items.join('\n');
      }
      case 'code-block':
        return '```' + block.language + '\n' + block.code + '\n```';
      case 'blockquote': {
        const lines = block.content.map((c) => `> ${this.serializeBlock(c)}`);
        return lines.join('\n');
      }
      case 'table':
        return this.serializeTable(block);
      case 'horizontal-rule':
        return '---';
      case 'image':
        return `![${block.alt}](${block.src})`;
      case 'embed':
        return `[${block.embedType}](${block.url})`;
      default:
        return '';
    }
  }

  private serializeTable(block: {
    rows: readonly {readonly cells: readonly {readonly content: readonly BlockNode[]}[]}[];
  }): string {
    if (block.rows.length === 0) return '';

    const headerRow = block.rows[0];
    if (!headerRow) return '';
    const headers = headerRow.cells.map((cell) =>
      cell.content.map((c) => this.serializeBlock(c)).join(' ')
    );
    const separator = headers.map(() => '---');
    const bodyRows = block.rows.slice(1).map((row) =>
      row.cells.map((cell) => cell.content.map((c) => this.serializeBlock(c)).join(' '))
    );

    const lines = [
      `| ${headers.join(' | ')} |`,
      `| ${separator.join(' | ')} |`,
      ...bodyRows.map((row) => `| ${row.join(' | ')} |`),
    ];

    return lines.join('\n');
  }

  private serializeInlineContent(content: readonly InlineNode[]): string {
    return content.map((node) => this.serializeInline(node)).join('');
  }

  private serializeInline(node: InlineNode): string {
    switch (node.type) {
      case 'text':
        return node.text;
      case 'bold':
        return `**${this.serializeInlineContent(node.content)}**`;
      case 'italic':
        return `*${this.serializeInlineContent(node.content)}*`;
      case 'underline':
        return `<u>${this.serializeInlineContent(node.content)}</u>`;
      case 'strikethrough':
        return `~~${this.serializeInlineContent(node.content)}~~`;
      case 'code':
        return `\`${node.code}\``;
      case 'link':
        return `[${this.serializeInlineContent(node.content)}](${node.href})`;
      case 'mention':
        return `@${node.label}`;
      default:
        return '';
    }
  }
}
