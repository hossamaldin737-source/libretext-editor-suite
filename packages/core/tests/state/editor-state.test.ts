/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: editor-state.test.ts
 * 📂 المسار: packages/core/tests/state/editor-state.test.ts
 * 🎯 الهدف الرئيسي: اختبار حالة المحرر والعمليات والتراجع والإعادة.
 * 🏷️ المعرف: TEST-CORE-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  createEditorState,
  canUndo,
  canRedo,
  getDocument,
  apply,
  undo,
  redo,
} from '../../src/state/editor-state';
import { paragraph, text, heading, doc } from '../../src/ast/builder';
import type { Operation } from '../../src/state/operations';
import { buildIndexer, getNodeById, getNodesByType } from '../../src/indexer/indexer';
import { search, simpleSearch } from '../../src/indexer/search';

describe('EditorState', () => {
  it('should create empty state', () => {
    const state = createEditorState();
    expect(state.editor.document.type).toBe('doc');
    expect(state.editor.document.content).toHaveLength(0);
    expect(state.editor.canUndo).toBe(false);
    expect(state.editor.canRedo).toBe(false);
  });

  it('should create state with document', () => {
    const d = doc([paragraph([text('محتوى')])]);
    const state = createEditorState(d);
    expect(getDocument(state).content).toHaveLength(1);
  });

  it('should apply insert operation', () => {
    const state = createEditorState();
    const newPara = paragraph([text('فقرة جديدة')]);
    const op: Operation = {
      type: 'insert-block',
      targetId: state.editor.document.id,
      payload: newPara,
    };
    const newState = apply(state, op);
    expect(newState.editor.document.content).toHaveLength(1);
    expect(newState.editor.canUndo).toBe(true);
  });

  it('should apply delete operation', () => {
    const p = paragraph([text('فقرة')]);
    const state = createEditorState(doc([p]));
    const op: Operation = {
      type: 'delete-block',
      targetId: p.id,
    };
    const newState = apply(state, op);
    expect(newState.editor.document.content).toHaveLength(0);
  });

  it('should undo', () => {
    const state = createEditorState();
    const p = paragraph([text('فقرة')]);
    const op: Operation = {
      type: 'insert-block',
      targetId: state.editor.document.id,
      payload: p,
    };
    const state2 = apply(state, op);
    expect(state2.editor.document.content).toHaveLength(1);

    const state3 = undo(state2);
    expect(state3.editor.document.content).toHaveLength(0);
    expect(state3.editor.canRedo).toBe(true);
  });

  it('should redo', () => {
    const state = createEditorState();
    const p = paragraph([text('فقرة')]);
    const op: Operation = {
      type: 'insert-block',
      targetId: state.editor.document.id,
      payload: p,
    };
    const state2 = apply(state, op);
    const state3 = undo(state2);
    const state4 = redo(state3);
    expect(state4.editor.document.content).toHaveLength(1);
  });

  it('should not undo when nothing to undo', () => {
    const state = createEditorState();
    const result = undo(state);
    expect(result).toBe(state);
  });

  it('should not redo when nothing to redo', () => {
    const state = createEditorState();
    const result = redo(state);
    expect(result).toBe(state);
  });

  it('should clear future on new operation after undo', () => {
    const state = createEditorState();
    const p1 = paragraph([text('أول')]);
    const p2 = paragraph([text('ثاني')]);

    const state2 = apply(state, {
      type: 'insert-block',
      targetId: state.editor.document.id,
      payload: p1,
    });
    const state3 = apply(state2, {
      type: 'insert-block',
      targetId: state.editor.document.id,
      payload: p2,
    });
    const state4 = undo(state3);
    expect(state4.editor.canRedo).toBe(true);

    const state5 = apply(state4, {
      type: 'insert-block',
      targetId: state4.editor.document.id,
      payload: paragraph([text('جديد')]),
    });
    expect(state5.editor.canRedo).toBe(false);
  });
});

describe('Indexer', () => {
  it('should build indexer from document', () => {
    const d = doc([heading(1, [text('عنوان')]), paragraph([text('فقرة اختبارية')])]);
    const indexer = buildIndexer(d);
    expect(indexer.nodeMap.size).toBeGreaterThan(0);
  });

  it('should find node by ID', () => {
    const p = paragraph([text('اختبار')]);
    const d = doc([p]);
    const indexer = buildIndexer(d);
    const found = getNodeById(indexer, p.id);
    expect(found).toBeDefined();
    expect(found?.node.type).toBe('paragraph');
  });

  it('should find nodes by type', () => {
    const d = doc([
      heading(1, [text('عنوان')]),
      paragraph([text('فقرة')]),
      paragraph([text('فقرة أخرى')]),
    ]);
    const indexer = buildIndexer(d);
    const paragraphs = getNodesByType(indexer, 'paragraph');
    expect(paragraphs).toHaveLength(2);
  });
});

describe('Search', () => {
  it('should search text', () => {
    const d = doc([paragraph([text('مرحباً بالعالم')])]);
    const indexer = buildIndexer(d);
    const results = simpleSearch(indexer, 'العالم');
    expect(results).toHaveLength(1);
  });

  it('should search case-insensitive', () => {
    const d = doc([paragraph([text('Hello World')])]);
    const indexer = buildIndexer(d);
    const results = simpleSearch(indexer, 'hello');
    expect(results).toHaveLength(1);
  });

  it('should return empty for no matches', () => {
    const d = doc([paragraph([text('مرحباً')])]);
    const indexer = buildIndexer(d);
    const results = simpleSearch(indexer, 'غير موجود');
    expect(results).toHaveLength(0);
  });

  it('should handle empty query', () => {
    const d = doc([paragraph([text('اختبار')])]);
    const indexer = buildIndexer(d);
    const results = simpleSearch(indexer, '');
    expect(results).toHaveLength(0);
  });
});
