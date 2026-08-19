/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.test.ts
 * 📂 المسار: packages/core/tests/ast/types.test.ts
 * 🎯 الهدف الرئيسي: اختبار جميع أنواع AST والتأكد من صحتها.
 * 🏷️ المعرف: TEST-CORE-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {describe, it, expect} from 'vitest';
import {
  paragraph,
  heading,
  text,
  bold,
  italic,
  codeBlock,
  blockquote,
  bulletList,
  orderedList,
  listItem,
  table,
  tableRow,
  tableCell,
  horizontalRule,
  image,
  embed,
  doc,
  codeInline,
  link,
  mention,
  strikethrough,
  underline,
} from '../../src/ast/builder';
import {validateDocument} from '../../src/utils/validation';
import {generateId, isValidId} from '../../src/utils/id';
import {getSchema, validateBlockNode} from '../../src/ast/schema';

describe('AST Builder', () => {
  describe('Inline Nodes', () => {
    it('should create text node', () => {
      const node = text('مرحباً بالعالم');
      expect(node.type).toBe('text');
      expect(node.text).toBe('مرحباً بالعالم');
      expect(node.id).toBeTruthy();
    });

    it('should create bold node', () => {
      const inner = text('نص غامق');
      const node = bold([inner]);
      expect(node.type).toBe('bold');
      expect(node.content).toHaveLength(1);
    });

    it('should create italic node', () => {
      const node = italic([text('مائل')]);
      expect(node.type).toBe('italic');
    });

    it('should create underline node', () => {
      const node = underline([text('تحته خط')]);
      expect(node.type).toBe('underline');
    });

    it('should create strikethrough node', () => {
      const node = strikethrough([text('يتوسطه خط')]);
      expect(node.type).toBe('strikethrough');
    });

    it('should create inline code node', () => {
      const node = codeInline('const x = 1');
      expect(node.type).toBe('code');
      expect(node.code).toBe('const x = 1');
    });

    it('should create link node', () => {
      const node = link('https://example.com', [text('رابط')]);
      expect(node.type).toBe('link');
      expect(node.href).toBe('https://example.com');
    });

    it('should create mention node', () => {
      const node = mention('user-123', 'أحمد');
      expect(node.type).toBe('mention');
      expect(node.userId).toBe('user-123');
      expect(node.label).toBe('أحمد');
    });
  });

  describe('Block Nodes', () => {
    it('should create paragraph', () => {
      const node = paragraph([text('فقرة اختبارية')]);
      expect(node.type).toBe('paragraph');
      expect(node.content).toHaveLength(1);
    });

    it('should create heading with level', () => {
      const node = heading(1, [text('عنوان رئيسي')]);
      expect(node.type).toBe('heading');
      expect(node.level).toBe(1);
    });

    it('should create code block', () => {
      const node = codeBlock('typescript', 'const x = 1;');
      expect(node.type).toBe('code-block');
      expect(node.language).toBe('typescript');
    });

    it('should create blockquote', () => {
      const node = blockquote([paragraph([text('اقتباس')])]);
      expect(node.type).toBe('blockquote');
    });

    it('should create bullet list', () => {
      const node = bulletList([
        listItem([paragraph([text('عنصر 1')])]),
        listItem([paragraph([text('عنصر 2')])]),
      ]);
      expect(node.type).toBe('list');
      expect(node.ordered).toBe(false);
      expect(node.items).toHaveLength(2);
    });

    it('should create ordered list', () => {
      const node = orderedList([
        listItem([paragraph([text('أولاً')])]),
      ]);
      expect(node.type).toBe('list');
      expect(node.ordered).toBe(true);
    });

    it('should create table', () => {
      const node = table([
        tableRow([
          tableCell([paragraph([text('خلية 1')])]),
          tableCell([paragraph([text('خلية 2')])]),
        ]),
      ]);
      expect(node.type).toBe('table');
      expect(node.rows).toHaveLength(1);
      expect(node.rows[0].cells).toHaveLength(2);
    });

    it('should create horizontal rule', () => {
      const node = horizontalRule();
      expect(node.type).toBe('horizontal-rule');
    });

    it('should create image', () => {
      const node = image('https://example.com/img.png', 'صورة اختبارية', 100, 200);
      expect(node.type).toBe('image');
      expect(node.src).toBe('https://example.com/img.png');
      expect(node.width).toBe(100);
    });

    it('should create embed', () => {
      const node = embed('youtube', 'https://youtube.com/watch?v=123');
      expect(node.type).toBe('embed');
    });
  });

  describe('Document', () => {
    it('should create document', () => {
      const d = doc([
        heading(1, [text('عنوان')]),
        paragraph([text('فقرة')]),
      ]);
      expect(d.type).toBe('doc');
      expect(d.content).toHaveLength(2);
    });
  });
});

describe('ID Generation', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should generate IDs with prefix', () => {
    const id = generateId('para');
    expect(id.startsWith('para_')).toBe(true);
  });

  it('should validate non-empty IDs', () => {
    expect(isValidId('test-123')).toBe(true);
    expect(isValidId('')).toBe(false);
  });
});

describe('Schema', () => {
  it('should return schema for known types', () => {
    const schema = getSchema('paragraph');
    expect(schema).toBeDefined();
    expect(schema?.type).toBe('paragraph');
    expect(schema?.inline).toBe(false);
  });

  it('should return undefined for unknown types', () => {
    const schema = getSchema('unknown-type');
    expect(schema).toBeUndefined();
  });

  it('should validate correct paragraph', () => {
    const node = paragraph([text('اختبار')]);
    const result = validateBlockNode(node);
    expect(result.valid).toBe(true);
  });
});

describe('Validation', () => {
  it('should validate correct document', () => {
    const d = doc([
      heading(1, [text('عنوان')]),
      paragraph([text('فقرة')]),
    ]);
    const result = validateDocument(d);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid document type', () => {
    const d = {type: 'invalid', id: 'test', content: []} as any;
    const result = validateDocument(d);
    expect(result.valid).toBe(false);
  });

  it('should handle empty document', () => {
    const d = doc([]);
    const result = validateDocument(d);
    expect(result.valid).toBe(true);
  });
});
