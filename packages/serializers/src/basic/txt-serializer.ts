/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: txt-serializer.ts
 * 📂 المسار: packages/serializers/src/basic/txt-serializer.ts
 * 🎯 الهدف الرئيسي: تحويل مستند AST إلى نص عادي مُنظّم.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج نصاً مُنظّماً بتباعد صحيح.
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/txt-serializer.test.ts
 * 🏷️ المعرف: SER-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Structured Text Serializer — محول نص مُنظّم مع تباعد ديناميكي.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التعامل مع العناصر المضمنة (bold, italic) كنص عادي.
 *    2. الحفاظ على التباعد الصحيح بين الكتل.
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
 * محول TXT — يحول AST إلى نص عادي مُنظّم.
 */
export class TxtSerializer {
  /**
   * تحويل مستند كامل إلى نص عادي.
   */
  serialize(doc: DocNode): string {
    const lines = doc.content.map((block) => this.serializeBlock(block));
    return lines.join('\n\n');
  }

  private serializeBlock(block: BlockNode): string {
    switch (block.type) {
      case 'paragraph':
        return this.serializeInlineContent(block.content);
      case 'heading':
        return `${this.serializeInlineContent(block.content)}${'\n' + '='.repeat(40)}`;
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
        return `[Code: ${block.language}]\n${block.code}`;
      case 'blockquote':
        return block.content.map((c) => `> ${this.serializeBlock(c)}`).join('\n');
      case 'table':
        return this.serializeTable(block);
      case 'horizontal-rule':
        return '- - - - - -';
      case 'image':
        return `[Image: ${block.alt}]`;
      case 'embed':
        return `[Embed: ${block.embedType}]`;
      default:
        return '';
    }
  }

  private serializeTable(block: {
    rows: readonly {readonly cells: readonly {readonly content: readonly BlockNode[]}[]}[];
  }): string {
    if (block.rows.length === 0) return '';

    const rows = block.rows.map((row) =>
      row.cells.map((cell) => cell.content.map((c) => this.serializeBlock(c)).join(' '))
    );
    const maxWidths = rows[0]!.map((_, colIdx) =>
      Math.max(...rows.map((row) => (row[colIdx] ?? '').length))
    );

    const separator = maxWidths.map((w) => '-'.repeat(w)).join(' | ');
    const formattedRows = rows.map((row) =>
      row.map((cell, i) => cell.padEnd(maxWidths[i] ?? 0)).join(' | ')
    );

    return formattedRows[0] + '\n' + separator + '\n' + formattedRows.slice(1).join('\n');
  }

  private serializeInlineContent(content: readonly InlineNode[]): string {
    return content.map((node) => this.serializeInline(node)).join('');
  }

  private serializeInline(node: InlineNode): string {
    switch (node.type) {
      case 'text':
        return node.text;
      case 'bold':
        return this.serializeInlineContent(node.content);
      case 'italic':
        return this.serializeInlineContent(node.content);
      case 'underline':
        return this.serializeInlineContent(node.content);
      case 'strikethrough':
        return this.serializeInlineContent(node.content);
      case 'code':
        return node.code;
      case 'link':
        return this.serializeInlineContent(node.content);
      case 'mention':
        return node.label;
      default:
        return '';
    }
  }
}
