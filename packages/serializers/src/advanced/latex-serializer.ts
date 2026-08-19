/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: latex-serializer.ts
 * 📂 المسار: packages/serializers/src/advanced/latex-serializer.ts
 * 🎯 الهدف الرئيسي: تحويل مستند AST إلى LaTeX مُنسّق.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج LaTeX صالح قابل للترجمة.
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/latex-serializer.test.ts
 * 🏷️ المعرف: SER-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Recursive AST-to-LaTeX Serializer — محول تكراري من AST إلى LaTeX.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الهروب من الرموز الخاصة في LaTeX (#, $, %, &, _, {, }).
 *    2. التعامل مع الرموز العربية بشكل صحيح.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المحتوى الفارغ قبل التحويل.
 *    - التعامل مع أنواع غير معروفة بأمان.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - LaTeX Project (https://www.latex-project.org/) — نظام التنضيد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode} from '@libretext/core';

const LATEX_ESCAPE_MAP: Record<string, string> = {
  '#': '\\#',
  '$': '\\$',
  '%': '\\%',
  '&': '\\&',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
  '\\': '\\textbackslash{}',
};

function escapeLatex(text: string): string {
  return text.replace(/[#$%&_{}~^\\]/g, (char) => LATEX_ESCAPE_MAP[char] ?? char);
}

/**
 * محول LaTeX — يحول AST إلى LaTeX مُنسّق.
 */
export class LatexSerializer {
  /**
   * تحويل مستند كامل إلى نص LaTeX.
   */
  serialize(doc: DocNode): string {
    const preamble = [
      '\\documentclass{article}',
      '\\usepackage[utf8]{inputenc}',
      '\\usepackage[T1]{fontenc}',
      '\\usepackage{arabtex}',
      '\\usepackage{graphicx}',
      '\\usepackage{hyperref}',
      '\\usepackage{listings}',
      '\\usepackage{longtable}',
      '\\begin{document}',
    ].join('\n');

    const body = doc.content.map((block) => this.serializeBlock(block)).join('\n\n');
    const postamble = '\\end{document}';

    return `${preamble}\n\n${body}\n\n${postamble}`;
  }

  private serializeBlock(block: BlockNode): string {
    switch (block.type) {
      case 'paragraph':
        return this.serializeInlineContent(block.content);
      case 'heading': {
        const commands: Record<number, string> = {
          1: '\\section',
          2: '\\subsection',
          3: '\\subsubsection',
          4: '\\paragraph',
          5: '\\subparagraph',
          6: '\\subparagraph',
        };
        const cmd = commands[block.level] ?? '\\section';
        return `${cmd}{${this.serializeInlineContent(block.content)}}`;
      }
      case 'list': {
        const env = block.ordered ? 'enumerate' : 'itemize';
        const items = block.items
          .map((item) => {
            const content = item.content.map((c) => this.serializeBlock(c)).join('\n');
            return `  \\item ${content}`;
          })
          .join('\n');
        return `\\begin{${env}}\n${items}\n\\end{${env}}`;
      }
      case 'code-block': {
        const lang = block.language || 'text';
        return `\\begin{lstlisting}[language=${escapeLatex(lang)}]\n${block.code}\n\\end{lstlisting}`;
      }
      case 'blockquote': {
        const content = block.content.map((c) => this.serializeBlock(c)).join('\n');
        return `\\begin{quote}\n${content}\n\\end{quote}`;
      }
      case 'table':
        return this.serializeTable(block);
      case 'horizontal-rule':
        return '\\hrulefill';
      case 'image':
        return `\\includegraphics[width=0.8\\textwidth]{${escapeLatex(block.src)}}`;
      case 'embed':
        return `\\url{${escapeLatex(block.url)}}`;
      default:
        return '';
    }
  }

  private serializeTable(block: {
    rows: readonly {readonly cells: readonly {readonly content: readonly BlockNode[]}[]}[];
  }): string {
    if (block.rows.length === 0) return '';

    const colCount = block.rows[0]?.cells.length ?? 0;
    const colSpec = 'l'.repeat(colCount);

    const headerCells = block.rows[0]
      ? block.rows[0].cells
          .map((cell) => cell.content.map((c) => this.serializeBlock(c)).join(' '))
          .join(' & ')
      : '';
    const bodyRows = block.rows
      .slice(1)
      .map((row) => {
        const cells = row.cells
          .map((cell) => cell.content.map((c) => this.serializeBlock(c)).join(' '))
          .join(' & ');
        return `${cells} \\\\`;
      })
      .join('\n');

    return [
      `\\begin{longtable}{|${colSpec}|}`,
      '\\hline',
      `${headerCells} \\\\`,
      '\\hline',
      bodyRows,
      '\\hline',
      '\\end{longtable}',
    ].join('\n');
  }

  private serializeInlineContent(content: readonly InlineNode[]): string {
    return content.map((node) => this.serializeInline(node)).join('');
  }

  private serializeInline(node: InlineNode): string {
    switch (node.type) {
      case 'text':
        return escapeLatex(node.text);
      case 'bold':
        return `\\textbf{${this.serializeInlineContent(node.content)}}`;
      case 'italic':
        return `\\textit{${this.serializeInlineContent(node.content)}}`;
      case 'underline':
        return `\\underline{${this.serializeInlineContent(node.content)}}`;
      case 'strikethrough':
        return `\\sout{${this.serializeInlineContent(node.content)}}`;
      case 'code':
        return `\\texttt{${escapeLatex(node.code)}}`;
      case 'link':
        return `\\href{${escapeLatex(node.href)}}{${this.serializeInlineContent(node.content)}}`;
      case 'mention':
        return `@${escapeLatex(node.label)}`;
      default:
        return '';
    }
  }
}
