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
export {
  CEILING, TRUNC, MEDIAN, MODE,
  COUNTBLANK, COUNTIF, SUMIF,
} from './formula/functions-math';
export {
  CLEAN, LEFT, RIGHT, MID, PROPER,
  SUBSTITUTE, REPLACE, TEXTJOIN, EXACT, REPT, SEARCH, FIND,
} from './formula/functions-text';
export * from './formula/functions-arabic';
export * from './formula/functions-financial';
export * from './formula/evaluator';
export * from './formula/evaluator-types';
export * from './formula/cell-utils';
export * from './formula/dependency-graph';
export * from './formula/registry';
export {
  MATCH, INDEX, VLOOKUP, XLOOKUP, IFS, SWITCH,
  DATE, TODAY, NOW, DATEDIF,
} from './formula/functions-lookup-date';

// Matrix & Lambda Functions
export * from './formula/functions-matrix';

// Markdown Formula Engine
export * from './formula/markdown-formula';

// Macro System Exports
export * from './macro/types';
export { MacroRecorder } from './macro/recorder';
export { MacroRunner } from './macro/runner';
export { MacroRegistry, macroRegistry } from './macro/registry';

// Spatial Translation Exports
export * from './spatial/types';
export * from './spatial/mapper';
export * from './spatial/transformer';
export * from './spatial/collision';
export * from './spatial/vector-path';
export * from './spatial/bezier-engine';
export * from './spatial/alignment-engine';
export * from './spatial/boolean-ops';
export * from './spatial/connector-routing';
export * from './spatial/matrix-2d';
export * from './spatial/smart-guides';
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

// Search & Replace Exports
export * from './search/types';
export * from './search/find-replace-engine';

// Simulation Exports
export * from './simulation/context';
export {
  type SimulationAction,
  simulate,
  simulateSingle,
} from './simulation/simulator';
