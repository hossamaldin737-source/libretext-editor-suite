/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: html-serializer.test.ts
 * 📂 المسار: packages/serializers/tests/html-serializer.test.ts
 * 🎯 الهدف الرئيسي: اختبار محول HTML.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج HTML صالح ومؤمن (Safe HTML).
 * 🏷️ المعرف: TEST-SER-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {describe, it, expect} from 'vitest';
import {HtmlSerializer} from '../src/basic/html-serializer';
import type {DocNode, NodeId} from '@libretext/core';

const serializer = new HtmlSerializer();

const createDoc = (content: DocNode['content']): DocNode => ({
  type: 'doc',
  id: 'doc-1' as NodeId,
  content,
});

describe('HtmlSerializer', () => {
  it('يقوم بتحويل المستند الكامل مع DOCTYPE', () => {
    const doc = createDoc([
      {type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Hello'}]},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('lang="en"');
    expect(result).toContain('<title>Document</title>');
  });

  it('يقوم بتحويل الفقرات', () => {
    const doc = createDoc([
      {type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Hello World'}]},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<p>Hello World</p>');
  });

  it('يقوم بتحويل العناوين', () => {
    const doc = createDoc([
      {
        type: 'heading',
        id: 'h1' as NodeId,
        level: 1,
        content: [{type: 'text', id: 't1' as NodeId, text: 'Title'}],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<h1>Title</h1>');
  });

  it('يقوم بتحويل القوائم', () => {
    const doc = createDoc([
      {
        type: 'list',
        id: 'l1' as NodeId,
        ordered: false,
        items: [
          {id: 'li1' as NodeId, type: 'list-item', content: [{type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Item'}]}]},
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('يقوم بتحويل أكواد البرمجة', () => {
    const doc = createDoc([
      {
        type: 'code-block',
        id: 'c1' as NodeId,
        language: 'js',
        code: 'console.log("x");',
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<pre><code class="language-js">');
    expect(result).toContain('console.log(&quot;x&quot;);');
  });

  it('يقوم بتحويل الخط الفاصل', () => {
    const doc = createDoc([{type: 'horizontal-rule', id: 'hr1' as NodeId}]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<hr>');
  });

  it('يقوم بتحويل العناصر المضمنة', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [
          {type: 'text', id: 't1' as NodeId, text: 'Hello '},
          {type: 'bold', id: 'b1' as NodeId, content: [{type: 'text', id: 't2' as NodeId, text: 'World'}]},
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<strong>World</strong>');
  });

  it('يقوم بتحويل الروابط', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [
          {type: 'text', id: 't1' as NodeId, text: 'Visit '},
          {
            type: 'link',
            id: 'l1' as NodeId,
            href: 'https://example.com',
            content: [{type: 'text', id: 't2' as NodeId, text: 'Example'}],
          },
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('<a href="https://example.com">Example</a>');
  });

  it('يقوم بتأمين HTML (XSS Protection)', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{type: 'text', id: 't1' as NodeId, text: '<script>alert("xss")</script>'}],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });
});
