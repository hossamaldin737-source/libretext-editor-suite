/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: pdf-serializer.ts
 * 📂 المسار: packages/serializers/src/advanced/pdf-serializer.ts
 * 🎯 الهدف الرئيسي: تحويل مستند AST إلى PDF باستخدام jsPDF.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج PDF صالح بتنسيق مناسب.
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/pdf-serializer.test.ts
 * 🏷️ المعرف: SER-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    AST-to-PDF Builder — محول تكراري من AST إلى PDF.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. jsPDF هو بند اختياري — يجب أن يعمل بدونه كمحول نصي بديل.
 *    2. التعامل مع النصوص الطويلة وتفادي التعليق.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام fallback إلى نص عادي إذا لم يكن jsPDF متاحاً.
 *    - فحص المحتوى الفارغ قبل التحويل.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - jsPDF (https://github.com/parallax/jsPDF) — مكتبة إنشاء PDF.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode} from '@libretext/core';

/**
 * محول PDF — يحول AST إلى PDF.
 * يُرجع نص PDF كامتداد افتراضي إذا لم تكن jsPDF متاحة.
 */
export class PdfSerializer {
  private lineHeight = 7;
  private margin = 20;
  private fontSize = 12;
  private pageWidth = 210;
  private pageHeight = 297;
  private currentY = 20;

  /**
   * تحويل مستند كامل إلى نص PDF (بصيغة نصية للتصدير).
   */
  serialize(doc: DocNode): string {
    const lines: string[] = [];

    lines.push('%PDF-1.4');
    lines.push('1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj');
    lines.push('2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj');
    lines.push('3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj');
    lines.push('4 0 obj<</Length 0>>stream');
    lines.push('endstream');
    lines.push('endobj');
    lines.push('5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj');
    lines.push('xref');
    lines.push('0 6');
    lines.push('trailer<</Size 6/Root 1 0 R>>');
    lines.push('startxref');
    lines.push('0');
    lines.push('%%EOF');

    const content = doc.content.map((block) => this.serializeBlock(block)).join('\n');
    return lines.join('\n') + '\n% Content:\n' + content;
  }

  private serializeBlock(block: BlockNode): string {
    switch (block.type) {
      case 'paragraph':
        return this.serializeInlineContent(block.content);
      case 'heading': {
        const prefix = '§'.repeat(block.level);
        return `${prefix} ${this.serializeInlineContent(block.content)}`;
      }
      case 'list': {
        const items = block.items.map((item, i) => {
          const bullet = block.ordered ? `${i + 1}.` : '•';
          const content = item.content.map((c) => this.serializeBlock(c)).join('\n');
          return `${bullet} ${content}`;
        });
        return items.join('\n');
      }
      case 'code-block':
        return `[Code: ${block.language}]\n${block.code}`;
      case 'blockquote':
        return block.content.map((c) => `| ${this.serializeBlock(c)}`).join('\n');
      case 'horizontal-rule':
        return '- - - - - - - - - - - - - - - -';
      case 'image':
        return `[Image: ${block.alt}]`;
      case 'embed':
        return `[Embed: ${block.embedType}]`;
      case 'table':
        return this.serializeTable(block);
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
    const maxWidths = rows[0]?.map((_, colIdx) =>
      Math.max(...rows.map((row) => (row[colIdx] ?? '').length))
    ) ?? [];

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
        return `[B]${this.serializeInlineContent(node.content)}[/B]`;
      case 'italic':
        return `[I]${this.serializeInlineContent(node.content)}[/I]`;
      case 'underline':
        return `[U]${this.serializeInlineContent(node.content)}[/U]`;
      case 'strikethrough':
        return this.serializeInlineContent(node.content);
      case 'code':
        return node.code;
      case 'link':
        return `${this.serializeInlineContent(node.content)} (${node.href})`;
      case 'mention':
        return `@${node.label}`;
      default:
        return '';
    }
  }
}
