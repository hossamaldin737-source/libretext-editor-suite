/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: latex-serializer.test.ts
 * 📂 المسار: packages/serializers/tests/latex-serializer.test.ts
 * 🎯 الهدف الرئيسي: اختبار محول LaTeX.
 * 📋 المعايير:
 *    - يجب أن يدعم جميع أنواع الكتل والعناصر المضمنة.
 *    - يجب أن يُخرج LaTeX صالح قابل للترجمة.
 * 🏷️ المعرف: TEST-SER-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {describe, it, expect} from 'vitest';
import {LatexSerializer} from '../src/advanced/latex-serializer';
import type {DocNode, NodeId} from '@libretext/core';

const serializer = new LatexSerializer();

const createDoc = (content: DocNode['content']): DocNode => ({
  type: 'doc',
  id: 'doc-1' as NodeId,
  content,
});

describe('LatexSerializer', () => {
  it('يقوم بتحويل المستند الكامل مع preamble', () => {
    const doc = createDoc([
      {type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Hello'}]},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\documentclass{article}');
    expect(result).toContain('\\begin{document}');
    expect(result).toContain('\\end{document}');
  });

  it('يقوم بتحويل الفقرات', () => {
    const doc = createDoc([
      {type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Hello World'}]},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('Hello World');
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
    expect(result).toContain('\\section{Title}');
  });

  it('يقوم بتحويل العناوين الفرعية', () => {
    const doc = createDoc([
      {
        type: 'heading',
        id: 'h2' as NodeId,
        level: 2,
        content: [{type: 'text', id: 't1' as NodeId, text: 'Subtitle'}],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\subsection{Subtitle}');
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
    expect(result).toContain('\\begin{itemize}');
    expect(result).toContain('\\item Item');
    expect(result).toContain('\\end{itemize}');
  });

  it('يقوم بتحويل القوائم المرقمة', () => {
    const doc = createDoc([
      {
        type: 'list',
        id: 'l1' as NodeId,
        ordered: true,
        items: [
          {id: 'li1' as NodeId, type: 'list-item', content: [{type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'First'}]}]},
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\begin{enumerate}');
  });

  it('يقوم بتحويل أكواد البرمجة', () => {
    const doc = createDoc([
      {
        type: 'code-block',
        id: 'c1' as NodeId,
        language: 'python',
        code: 'print("hello")',
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\begin{lstlisting}[language=python]');
    expect(result).toContain('print("hello")');
  });

  it('يقوم بتحويل الاقتباسات', () => {
    const doc = createDoc([
      {
        type: 'blockquote',
        id: 'bq1' as NodeId,
        content: [{type: 'paragraph', id: 'p1' as NodeId, content: [{type: 'text', id: 't1' as NodeId, text: 'Quote'}]}],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\begin{quote}');
    expect(result).toContain('Quote');
  });

  it('يقوم بتحويل الصور', () => {
    const doc = createDoc([
      {type: 'image', id: 'img1' as NodeId, src: 'image.png', alt: 'Test'},
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\includegraphics');
    expect(result).toContain('image.png');
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
    expect(result).toContain('\\textbf{World}');
  });

  it('يقوم بتحويل الكود المضمن', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [
          {type: 'text', id: 't1' as NodeId, text: 'Use '},
          {type: 'code', id: 'c1' as NodeId, code: 'npm install'},
        ],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\texttt{npm install}');
  });

  it('يقوم بهروب الرموز الخاصة', () => {
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{type: 'text', id: 't1' as NodeId, text: 'Price is $5 & tax is 10%'}],
      },
    ]);
    const result = serializer.serialize(doc);
    expect(result).toContain('\\$5');
    expect(result).toContain('\\&');
    expect(result).toContain('\\%');
  });
});
