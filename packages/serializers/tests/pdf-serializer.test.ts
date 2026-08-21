/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: pdf-serializer.test.ts
 * 📂 المسار: packages/serializers/tests/pdf-serializer.test.ts
 * 🎯 الهدف الرئيسي: اختبار محول PDF.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج PDF صالح بتنسيق مناسب.
 * 🏷️ المعرف: TEST-SER-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { PdfSerializer } from '../src/advanced/pdf-serializer';
import type { DocNode, NodeId } from '@libretext/core';

const serializer = new PdfSerializer();

const createDoc = (content: DocNode['content']): DocNode => ({
  type: 'doc',
  id: 'doc-1' as NodeId,
  content,
});

describe('PdfSerializer', () => {
  it('يقوم بتحويل المستند إلى PDF text format', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello World' }],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('%PDF-1.4');
    expect(result).toContain('Hello World');
  });

  it('يقوم بتحويل العناوين', () => {
    const doc = createDoc([
      {
        type: 'heading',
        id: 'h1' as NodeId,
        level: 1,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Title' }],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('§ Title');
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
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('• Item 1');
  });

  it('يقوم بتحويل الخط الفاصل', () => {
    const doc = createDoc([{ type: 'horizontal-rule', id: 'hr1' as NodeId }]);
    const result = serializer.serialize(doc);
    expect(result).toContain('- - - - - -');
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
    expect(result).toContain('[B]World[/B]');
  });
});
