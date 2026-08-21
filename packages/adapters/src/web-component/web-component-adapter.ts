/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: web-component-adapter.ts
 * 📂 المسار: packages/adapters/src/web-component/web-component-adapter.ts
 * 🎯 الهدف الرئيسي: محور Web Component لتحرير المستندات.
 * 🏷️ المعرف: ADAP-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - Web Components (https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode, BlockNode, InlineNode } from '@libretext/core';
import type { AdapterOptions, EditorAdapter, Selection } from '../shared/types';

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );
}

export class WebComponentAdapter implements EditorAdapter {
  private container: HTMLElement | null = null;
  private doc: DocNode;
  private selection: Selection | null = null;
  private readOnly = false;
  private options: AdapterOptions;

  constructor(options: AdapterOptions = {}) {
    this.options = options;
    this.doc = options.initialDoc ?? {
      type: 'doc',
      id: 'doc-1' as import('@libretext/core').NodeId,
      content: [],
    };
    this.readOnly = options.readOnly ?? false;
  }

  initialize(container: HTMLElement): void {
    if (!container) throw new Error('Container element is required');
    this.container = container;
    this.render();
  }

  destroy(): void {
    this.container = null;
    this.selection = null;
  }
  getDocument(): DocNode {
    return this.doc;
  }
  setDocument(doc: DocNode): void {
    this.doc = doc;
    this.render();
    this.options.onContentChange?.(doc);
  }
  getSelection(): Selection | null {
    return this.selection;
  }
  setSelection(selection: Selection): void {
    this.selection = selection;
    this.options.onSelectionChange?.(selection);
  }
  isReadOnly(): boolean {
    return this.readOnly;
  }
  setReadOnly(readOnly: boolean): void {
    this.readOnly = readOnly;
    this.render();
  }

  private render(): void {
    if (!this.container) return;
    this.container.innerHTML = this.doc.content.map((b) => this.renderBlock(b)).join('');
  }

  private renderBlock(block: BlockNode): string {
    switch (block.type) {
      case 'paragraph':
        return `<div class="lt-paragraph" data-id="${block.id}">${this.renderInlines(block.content)}</div>`;
      case 'heading':
        return `<h${block.level} class="lt-heading" data-id="${block.id}">${this.renderInlines(block.content)}</h${block.level}>`;
      case 'code-block':
        return `<pre class="lt-code-block" data-id="${block.id}"><code>${escapeHtml(block.code)}</code></pre>`;
      case 'blockquote':
        return `<blockquote class="lt-blockquote" data-id="${block.id}">${block.content.map((c) => this.renderBlock(c)).join('')}</blockquote>`;
      case 'list':
        return `<ul class="lt-list" data-id="${block.id}">${block.items.map((item) => `<li>${item.content.map((c) => this.renderBlock(c)).join('')}</li>`).join('')}</ul>`;
      case 'horizontal-rule':
        return `<hr class="lt-hr" data-id="${block.id}">`;
      case 'image':
        return `<img class="lt-image" data-id="${block.id}" src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}">`;
      case 'table':
        return `<table class="lt-table" data-id="${block.id}"><tbody>${block.rows.map((row) => `<tr>${row.cells.map((cell) => `<td>${cell.content.map((c) => this.renderBlock(c)).join('')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      default:
        return `<div class="lt-unknown" data-id="${block.id}">${block.type}</div>`;
    }
  }

  private renderInlines(nodes: readonly InlineNode[]): string {
    return nodes
      .map((node) => {
        switch (node.type) {
          case 'text':
            return escapeHtml(node.text);
          case 'bold':
            return `<strong>${this.renderInlines(node.content)}</strong>`;
          case 'italic':
            return `<em>${this.renderInlines(node.content)}</em>`;
          case 'underline':
            return `<u>${this.renderInlines(node.content)}</u>`;
          case 'strikethrough':
            return `<del>${this.renderInlines(node.content)}</del>`;
          case 'code':
            return `<code>${escapeHtml(node.code)}</code>`;
          case 'link':
            return `<a href="${escapeHtml(node.href)}">${this.renderInlines(node.content)}</a>`;
          case 'mention':
            return `<span class="mention">@${escapeHtml(node.label)}</span>`;
          default:
            return '';
        }
      })
      .join('');
  }
}

export function createWebComponentAdapter(options?: AdapterOptions): WebComponentAdapter {
  return new WebComponentAdapter(options);
}
