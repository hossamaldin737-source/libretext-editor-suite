/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/algorithms/src/index.ts
 * 🎯 الهدف الرئيسي: تصدير محتويات مكتبة الخوارزميات (Barrel Export)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Command Pattern Exports
export * from './command/types';
export {
  CommandExecutor,
  SpatialCommandHandler,
  TextCommandHandler,
  FormulaCommandHandler,
  executeCommand,
  undoCommand,
} from './command/executor';
export type {CommandOpResult} from './command/executor';
export * from './command/registry';

// Formula AST & Evaluator Exports
export * from './formula/ast';
export * from './formula/tokenizer';
export * from './formula/parser';
export * from './formula/functions';
export * from './formula/evaluator';
export * from './formula/cell-utils';
export * from './formula/registry';

// Spatial Translation Exports
export * from './spatial/types';
export * from './spatial/mapper';
export {
  type SpatialOpValue,
  type MoveCommand,
  type ResizeCommand,
  type SelectCommand,
  type DeleteCommand,
  type CreateCommand,
  type MoveDelta,
  SpatialOp,
  createMoveCommand,
  createResizeCommand,
  createSelectCommand,
  createDeleteCommand,
  createCreateCommand,
  computeMoveDelta,
  toBoundingBox,
} from './spatial/commands';
