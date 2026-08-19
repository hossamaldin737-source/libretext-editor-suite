/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: txt-serializer.test.ts
 * 📂 المسار: packages/serializers/tests/txt-serializer.test.ts
 * 🎯 الهدف الرئيسي: اختبار محول TXT.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج نصاً مُنظّماً بتباعد صحيح.
 * 🏷️ المعرف: TEST-SER-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {describe, it, expect} from 'vitest';
import {TxtSerializer} from '../src/basic/txt-serializer';
import type {DocNode, NodeId} from '@libretext/core';

const serializer = new TxtSerializer();

const createDoc = (content: DocNode['content']): DocNode => ({
  type: 'doc',
  id: 'doc-1' as NodeId,
  content,
});

describe('TxtSerializer', () => {
  it('يقوم بتحويل الفقرات', () => {
    const doc = createDoc([
      {type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Hello World'}]},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('Hello World');
  });

  it('يقوم بتحويل العناوين مع خط فاصل', () => {
    const doc = createDoc([
      {
        type: 'heading',
        id: 'h1' as NodeId,
        level: 1,
        content: [{type: 'text', id: 't1' as NodeId, text: 'Title'}],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('Title\n========================================');
  });

  it('يقوم بتحويل القوائم', () => {
    const doc = createDoc([
      {
        type: 'list',
        id: 'l1' as NodeId,
        ordered: false,
        items: [
          {id: 'li1' as NodeId, type: 'list-item', content: [{type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Item 1'}]}]},
          {id: 'li2' as NodeId, type: 'list-item', content: [{type: 'paragraph', id: 'p2' as NodeId, content: [{type: 'text', id: 't2' as NodeId, text: 'Item 2'}]}]},
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
    expect(result).toBe('[Code: typescript]\nconst x = 1;');
  });

  it('يقوم بتحويل الخط الفاصل', () => {
    const doc = createDoc([{type: 'horizontal-rule', id: 'hr1' as NodeId}]);
    const result = serializer.serialize(doc);
    expect(result).toBe('- - - - - -');
  });

  it('يقوم بتحويل الصور كنص', () => {
    const doc = createDoc([
      {type: 'image', id: 'img1' as NodeId, src: '/test.png', alt: 'Test Image'},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toBe('[Image: Test Image]');
  });

  it('يقوم بتحويل العناصر المضمنة كنص عادي', () => {
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
    expect(result).toBe('Hello World');
  });
});
