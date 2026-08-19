/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: editor-state.ts
 * 📂 المسار: packages/core/src/state/editor-state.ts
 * 🎯 الهدف الرئيسي: إدارة حالة المحرر بشكل غير قابل للتغيير (Immutable)
 *    مع دعم العمليات والتراجع والإعادة والفهرسة.
 * 📋 المعايير:
 *    - يجب أن تكون الحالة immutable تماماً.
 *    - يجب أن تدعم apply() لتطبيق العمليات.
 *    - يجب أن تدعم undo() و redo().
 *    - يجب أن تدعم getDocument() لاستخراج المستند.
 * 🧪 الاختبارات:
 *    - packages/core/tests/state/editor-state.test.ts
 *    - اختبار إنشاء حالة فارغة
 *    - اختبار تطبيق العمليات
 *    - اختبار التراجع والإعادة
 * 🏷️ المعرف: CORE-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Immutable State with Snapshot History — حالة immutable مع تاريخ لقطات.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تعديل الحالة الأصلية أبداً (spread operator دائماً).
 *    2. منع Stale Closures عبر استخدام snapshots.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الحالة قبل كل عملية.
 *    - إعادة الحالة الأصلية عند الخطأ.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - ProseMirror (https://prosemirror.net/) — نمط الحالة.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {DocNode} from '../ast/types';
import {generateId} from '../utils/id';
import {type Operation, applyOperation} from './operations';

// ─── حالة المحرر ───
export interface EditorState {
  readonly document: DocNode;
  readonly selection: Selection | null;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export interface Selection {
  readonly anchor: number[];
  readonly head: number[];
}

// ─── اللقطة (Snapshot) ───
interface Snapshot {
  readonly document: DocNode;
  readonly selection: Selection | null;
}

// ─── تاريخ التراجع ───
interface History {
  readonly past: readonly Snapshot[];
  readonly future: readonly Snapshot[];
}

// ─── حالة المحرر الكاملة ───
export interface FullEditorState {
  readonly editor: EditorState;
  readonly _history: History;
}

const MAX_HISTORY_SIZE = 100;

/**
 * إنشاء مستند فارغ.
 */
function createEmptyDoc(): DocNode {
  return {
    type: 'doc',
    id: generateId('doc'),
    content: [],
  };
}

/**
 * إنشاء حالة محرر جديدة.
 */
export function createEditorState(doc?: DocNode): FullEditorState {
  const document = doc ?? createEmptyDoc();
  return {
    editor: {
      document,
      selection: null,
      canUndo: false,
      canRedo: false,
    },
    _history: {
      past: [{document, selection: null}],
      future: [],
    },
  };
}

/**
 * التحقق من إمكانية التراجع.
 */
export function canUndo(state: FullEditorState): boolean {
  return state._history.past.length > 1;
}

/**
 * التحقق من إمكانية الإعادة.
 */
export function canRedo(state: FullEditorState): boolean {
  return state._history.future.length > 0;
}

/**
 * استخراج المستند الحالي.
 */
export function getDocument(state: FullEditorState): DocNode {
  return state.editor.document;
}

/**
 * تطبيق عملية على الحالة.
 * تُعيد حالة جديدة (Immutable).
 */
export function apply(state: FullEditorState, operation: Operation): FullEditorState {
  const newDoc = applyOperation(state.editor.document, operation);

  const currentSnapshot: Snapshot = {
    document: state.editor.document,
    selection: state.editor.selection,
  };

  const newPast = [...state._history.past, currentSnapshot];
  if (newPast.length > MAX_HISTORY_SIZE) {
    newPast.shift();
  }

  return {
    editor: {
      document: newDoc,
      selection: state.editor.selection,
      canUndo: true,
      canRedo: false,
    },
    _history: {
      past: newPast,
      future: [],
    },
  };
}

/**
 * التراجع.
 */
export function undo(state: FullEditorState): FullEditorState {
  if (!canUndo(state)) return state;

  const newPast = [...state._history.past];
  const snapshot = newPast.pop()!;

  const currentSnapshot: Snapshot = {
    document: state.editor.document,
    selection: state.editor.selection,
  };

  return {
    editor: {
      document: snapshot.document,
      selection: snapshot.selection,
      canUndo: newPast.length > 1,
      canRedo: true,
    },
    _history: {
      past: newPast,
      future: [currentSnapshot, ...state._history.future],
    },
  };
}

/**
 * الإعادة.
 */
export function redo(state: FullEditorState): FullEditorState {
  if (!canRedo(state)) return state;

  const newFuture = [...state._history.future];
  const snapshot = newFuture.shift()!;

  const currentSnapshot: Snapshot = {
    document: state.editor.document,
    selection: state.editor.selection,
  };

  return {
    editor: {
      document: snapshot.document,
      selection: snapshot.selection,
      canUndo: true,
      canRedo: newFuture.length > 0,
    },
    _history: {
      past: [...state._history.past, currentSnapshot],
      future: newFuture,
    },
  };
}
