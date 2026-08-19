/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/core/src/index.ts
 * 🎯 الهدف الرئيسي: التصدير العام لجميع واجهات ودوال النواة.
 * 📋 المعايير:
 *    - يجب أن يصدّر جميع الأنواع والدوال العامة.
 *    - يجب ألا يصدّر شيئاً خاصاً (internal).
 * 🧪 الاختبارات: لا توجد اختبارات مباشرة.
 * 🏷️ المعرف: CORE-011
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Barrel Export — تصدير مركّز من نقطة واحدة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── الأنواع ───
export type {
  NodeId,
  InlineNodeType,
  BlockNodeType,
  MarkType,
  Mark,
  TextNode,
  BoldNode,
  ItalicNode,
  UnderlineNode,
  StrikethroughNode,
  CodeNode,
  LinkNode,
  MentionNode,
  InlineNode,
  CodeBlockNode,
  ListItemNode,
  ListNode,
  TableCellNode,
  TableRowNode,
  TableNode,
  ParagraphNode,
  HeadingNode,
  BlockquoteNode,
  HorizontalRuleNode,
  ImageNode,
  EmbedNode,
  BlockNode,
  DocNode,
  SearchResult,
  NodeInfo,
  ValidationResult,
  ValidationError,
} from './ast/types';

// ─── بناء AST ───
export * as builder from './ast/builder';
export {getSchema, validateBlockNode, validateDocument, type NodeSchema} from './ast/schema';

// ─── الحالة والعمليات ───
export type {EditorState, Selection, FullEditorState} from './state/editor-state';
export {
  createEditorState,
  canUndo,
  canRedo,
  getDocument,
  apply,
  undo,
  redo,
} from './state/editor-state';

export type {Operation, OperationType} from './state/operations';
export {applyOperation, applyOperations} from './state/operations';

export type {HistorySnapshot, HistoryState} from './state/history';
export {
  createHistory,
  pushSnapshot,
  popUndo,
  popRedo,
  clearHistory,
} from './state/history';

// ─── الفهرسة والبحث ───
export type {Indexer} from './indexer/indexer';
export {buildIndexer, getNodeById, getNodesByType} from './indexer/indexer';

export type {SearchOptions} from './indexer/search';
export {search, simpleSearch} from './indexer/search';

// ─── الأدوات المساعدة ───
export {generateId, isValidId} from './utils/id';
export {validateDocument as validateDoc} from './utils/validation';
