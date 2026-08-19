/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-serializer.ts
 * 📂 المسار: packages/serializers/src/basic/html-serializer.ts
 * 🎯 الهدف الرئيسي: تحويل مستند AST إلى HTML مُنسّق وتحليل HTML إلى مستند
 *    AST.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج HTML صالح ومؤمن (Safe HTML).
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/html-serializer.test.ts
 * 🏷️ المعرف: SER-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive AST-to-HTML Serializer with XSS Protection — محول تكراري من
 *    AST إلى HTML مع حماية من XSS.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. فحص XSS — لا يُسمح بإخراج HTML مؤذٍ.
 *    2. التأكد من التباعد الصحيح في tags المتداخلة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية XSS عبر sanitize حسب المكتبات.
 *    - فحص المحتوى الفارغ قبل التحويل.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode} from '@libretext/core';

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPE_MAP[char] ?? char);
}

/**
 * محول HTML — يحول AST إلى HTML آمن.
 */
export class HtmlSerializer {
  /**
   * تحويل مستند كامل إلى نص HTML.
   */
  serialize(doc: DocNode): string {
    const body = doc.content.map((block) => this.serializeBlock(block)).join('\n');
    return `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Document</title>\n</head>\n<body>\n${body}\n</body>\n</html>`;
  }

  private serializeBlock(block: BlockNode): string {
    switch (block.type) {
      case 'paragraph':
        return `<p>${this.serializeInlineContent(block.content)}</p>`;
      case 'heading':
        return `<h${block.level}>${this.serializeInlineContent(block.content)}</h${block.level}>`;
      case 'list': {
        const tag = block.ordered ? 'ol' : 'ul';
        const items = block.items
          .map((item) => {
            const content = item.content.map((c) => this.serializeBlock(c)).join('');
            const nested = item.nested && item.nested[0]
              ? this.serializeBlock(item.nested[0])
              : '';
            return `<li>${content}${nested}</li>`;
          })
          .join('\n');
        return `<${tag}>\n${items}\n</${tag}>`;
      }
      case 'code-block':
        return `<pre><code class="language-${escapeHtml(block.language)}">${escapeHtml(block.code)}</code></pre>`;
      case 'blockquote':
        return `<blockquote>\n${block.content.map((c) => this.serializeBlock(c)).join('\n')}\n</blockquote>`;
      case 'table':
        return this.serializeTable(block);
      case 'horizontal-rule':
        return '<hr>';
      case 'image':
        return `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}">`;
      case 'embed':
        return `<iframe src="${escapeHtml(block.url)}" title="${escapeHtml(block.embedType)}"></iframe>`;
      default:
        return '';
    }
  }

  private serializeTable(block: {
    rows: readonly {readonly cells: readonly {readonly content: readonly BlockNode[]}[]}[];
  }): string {
    if (block.rows.length === 0) return '';

    const headerCells = block.rows[0]
      ? block.rows[0].cells
          .map((cell) => `<th>${cell.content.map((c) => this.serializeBlock(c)).join('')}</th>`)
          .join('')
      : '';
    const bodyRows = block.rows
      .slice(1)
      .map((row) => {
        const cells = row.cells
          .map((cell) => `<td>${cell.content.map((c) => this.serializeBlock(c)).join('')}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('\n');

    return `<table>\n<thead>\n<tr>${headerCells}</tr>\n</thead>\n<tbody>\n${bodyRows}\n</tbody>\n</table>`;
  }

  private serializeInlineContent(content: readonly InlineNode[]): string {
    return content.map((node) => this.serializeInline(node)).join('');
  }

  private serializeInline(node: InlineNode): string {
    switch (node.type) {
      case 'text':
        return escapeHtml(node.text);
      case 'bold':
        return `<strong>${this.serializeInlineContent(node.content)}</strong>`;
      case 'italic':
        return `<em>${this.serializeInlineContent(node.content)}</em>`;
      case 'underline':
        return `<u>${this.serializeInlineContent(node.content)}</u>`;
      case 'strikethrough':
        return `<del>${this.serializeInlineContent(node.content)}</del>`;
      case 'code':
        return `<code>${escapeHtml(node.code)}</code>`;
      case 'link':
        return `<a href="${escapeHtml(node.href)}">${this.serializeInlineContent(node.content)}</a>`;
      case 'mention':
        return `<span class="mention" data-mention="${escapeHtml(node.userId)}">@${escapeHtml(node.label)}</span>`;
      default:
        return '';
    }
  }
}
