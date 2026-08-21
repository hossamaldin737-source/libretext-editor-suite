/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: markdown-serializer.test.ts
 * 📂 المسار: packages/serializers/tests/markdown-serializer.test.ts
 * 🎯 الهدف الرئيسي: اختبار محول Markdown.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج Markdown صالح حسب المعايير.
 * 🏷️ المعرف: TEST-SER-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { MarkdownSerializer } from '../src/basic/markdown-serializer';
import type { DocNode, NodeId } from '@libretext/core';

const serializer = new MarkdownSerializer();

const createDoc = (content: DocNode['content']): DocNode => ({
  type: 'doc',
  id: 'doc-1' as NodeId,
  content,
});

describe('MarkdownSerializer', () => {
  it('يقوم بتحويل الفقرات', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello World' }],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('Hello World');
  });

  it('يقوم بتحويل العناوين', () => {
    const doc = createDoc([
      {
        type: 'heading',
        id: 'h1' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'عنوان' }],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('## عنوان');
  });

  it('يقوم بتحويل القوائم', () => {
    const doc = createDoc([
      {
        type: 'list',
        id: 'l1' as NodeId,
        ordered: false,
        items: [
          {
            id: 'li1' as NodeId,
            type: 'list-item',
            content: [
              {
                type: 'paragraph',
                id: 'p1' as NodeId,
                content: [{ type: 'text', id: 't1' as NodeId, text: 'Item 1' }],
              },
            ],
          },
          {
            id: 'li2' as NodeId,
            type: 'list-item',
            content: [
              {
                type: 'paragraph',
                id: 'p2' as NodeId,
                content: [{ type: 'text', id: 't2' as NodeId, text: 'Item 2' }],
              },
            ],
          },
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('- Item 1\n- Item 2');
  });

  it('يقوم بتحويل أكواد البرمجة', () => {
    const doc = createDoc([
      {
        type: 'code-block',
        id: 'c1' as NodeId,
        language: 'typescript',
        code: 'const x = 1;',
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('```typescript\nconst x = 1;\n```');
  });

  it('يقوم بتحويل الاقتباسات', () => {
    const doc = createDoc([
      {
        type: 'blockquote',
        id: 'bq1' as NodeId,
        content: [
          {
            type: 'paragraph',
            id: 'p1' as NodeId,
            content: [{ type: 'text', id: 't1' as NodeId, text: 'Quote' }],
          },
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('> Quote');
  });

  it('يقوم بتحويل الخط الفاصل', () => {
    const doc = createDoc([{ type: 'horizontal-rule', id: 'hr1' as NodeId }]);
    const result = serializer.serialize(doc);
    expect(result).toBe('---');
  });

  it('يقوم بتحويل الصور', () => {
    const doc = createDoc([
      { type: 'image', id: 'img1' as NodeId, src: '/test.png', alt: 'Test Image' },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('![Test Image](/test.png)');
  });

  it('يقوم بتحويل العناصر المضمنة', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [
          { type: 'text', id: 't1' as NodeId, text: 'Hello ' },
          {
            type: 'bold',
            id: 'b1' as NodeId,
            content: [{ type: 'text', id: 't2' as NodeId, text: 'World' }],
          },
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('Hello **World**');
  });

  it('يقوم بتحويل الكود المضمن', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [
          { type: 'text', id: 't1' as NodeId, text: 'Use ' },
          { type: 'code', id: 'c1' as NodeId, code: 'npm install' },
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('Use `npm install`');
  });
});
