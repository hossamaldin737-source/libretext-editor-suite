/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: adapters.test.ts
 * 📂 المسار: packages/adapters/tests/adapters.test.ts
 * 🎯 الهدف الرئيسي: اختبار جميع المحاور.
 * 🏷️ المعرف: TEST-ADAP-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ReactAdapter } from '../src/react/react-adapter';
import { VueAdapter } from '../src/vue/vue-adapter';
import { WebComponentAdapter } from '../src/web-component/web-component-adapter';
import { VanillaAdapter } from '../src/vanilla/vanilla-adapter';
import type { DocNode, NodeId } from '@libretext/core';

const createDoc = (content: DocNode['content']): DocNode => ({
  type: 'doc',
  id: 'doc-1' as NodeId,
  content,
});

const createContainer = (): HTMLElement => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return div;
};

describe('ReactAdapter', () => {
  let container: HTMLElement;
  let adapter: ReactAdapter;

  beforeEach(() => {
    container = createContainer();
    adapter = new ReactAdapter();
  });

  afterEach(() => {
    adapter.destroy();
    document.body.removeChild(container);
  });

  it('يقوم بالتهيئة', () => {
    adapter.initialize(container);
    expect(adapter.getDocument()).toBeDefined();
  });

  it('يرمي خطأ بدون حاوية', () => {
    expect(() => adapter.initialize(null as unknown as HTMLElement)).toThrow();
  });

  it('يقوم بتعيين المستند', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(adapter.getDocument().content).toHaveLength(1);
  });

  it('يقوم بعرض المحتوى', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(container.innerHTML).toContain('Hello');
  });

  it('يقوم بتعيين التحديد', () => {
    adapter.initialize(container);
    adapter.setSelection({ nodeId: 'p1', startOffset: 0, endOffset: 5 });
    expect(adapter.getSelection()).toEqual({ nodeId: 'p1', startOffset: 0, endOffset: 5 });
  });

  it('يدعم القراءة فقط', () => {
    const adapter = new ReactAdapter({ readOnly: true });
    adapter.initialize(container);
    expect(adapter.isReadOnly()).toBe(true);
  });
});

describe('VueAdapter', () => {
  let container: HTMLElement;
  let adapter: VueAdapter;

  beforeEach(() => {
    container = createContainer();
    adapter = new VueAdapter();
  });

  afterEach(() => {
    adapter.destroy();
    document.body.removeChild(container);
  });

  it('يقوم بالتهيئة', () => {
    adapter.initialize(container);
    expect(adapter.getDocument()).toBeDefined();
  });

  it('يرمي خطأ بدون حاوية', () => {
    expect(() => adapter.initialize(null as unknown as HTMLElement)).toThrow();
  });

  it('يقوم بتعيين المستند', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(adapter.getDocument().content).toHaveLength(1);
  });

  it('يقوم بعرض المحتوى', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(container.innerHTML).toContain('Hello');
  });
});

describe('WebComponentAdapter', () => {
  let container: HTMLElement;
  let adapter: WebComponentAdapter;

  beforeEach(() => {
    container = createContainer();
    adapter = new WebComponentAdapter();
  });

  afterEach(() => {
    adapter.destroy();
    document.body.removeChild(container);
  });

  it('يقوم بالتهيئة', () => {
    adapter.initialize(container);
    expect(adapter.getDocument()).toBeDefined();
  });

  it('يرمي خطأ بدون حاوية', () => {
    expect(() => adapter.initialize(null as unknown as HTMLElement)).toThrow();
  });

  it('يقوم بتعيين المستند', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(adapter.getDocument().content).toHaveLength(1);
  });

  it('يقوم بعرض المحتوى', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(container.innerHTML).toContain('Hello');
  });
});

describe('VanillaAdapter', () => {
  let container: HTMLElement;
  let adapter: VanillaAdapter;

  beforeEach(() => {
    container = createContainer();
    adapter = new VanillaAdapter();
  });

  afterEach(() => {
    adapter.destroy();
    document.body.removeChild(container);
  });

  it('يقوم بالتهيئة', () => {
    adapter.initialize(container);
    expect(adapter.getDocument()).toBeDefined();
  });

  it('يرمي خطأ بدون حاوية', () => {
    expect(() => adapter.initialize(null as unknown as HTMLElement)).toThrow();
  });

  it('يقوم بتعيين المستند', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(adapter.getDocument().content).toHaveLength(1);
  });

  it('يقوم بعرض المحتوى', () => {
    adapter.initialize(container);
    const doc = createDoc([
      {
        type: 'paragraph',
        id: 'p1' as NodeId,
        content: [{ type: 'text', id: 't1' as NodeId, text: 'Hello' }],
      },
    ]);
    adapter.setDocument(doc);
    expect(container.innerHTML).toContain('Hello');
  });
});
