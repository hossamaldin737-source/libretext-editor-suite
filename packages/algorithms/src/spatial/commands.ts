/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: commands.ts
 * 📂 المسار: packages/algorithms/src/spatial/commands.ts
 * 🎯 الهدف الرئيسي: مصانع الأوامر المكانية (Spatial Commands) ودوال الحساب المساعدة
 * 📋 المعايير: صفر اعتماديات خارجية، دوال نقية، برمجة دفاعية صارمة
 * 🧪 الاختبارات: packages/algorithms/tests/spatial/commands.test.ts
 * 🏷️ المعرف: ALGO-009
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v2: Unit Validation + Discriminated Delta)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Command Factory + Discriminated Unions + Shared Validators
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. خلط الوحدات (cm vs px) في computeMoveDelta يُنتج قيماً بلا معنى
 *    2. BoundingBox تتطلب إحداثيات مستمرة (Logical) وترفض الشبكية (Grid)
 *    3. التحجيم بأبعاد صفرية أو سالبة يجب أن يُرفض في جميع المصانع
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - validateCoordinateTypesMatch يفحص النوع والوحدة معاً
 *    - validatePositiveDimensions دالة مشتركة للتحقق من الأبعاد
 *    - فحص content !== null في createCreateCommand
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#ALGO-009
 *    - 📦 التبعيات: ./types.ts (SpatialCoordinate, BoundingBox)
 *    - 📄 مرتبط مباشر: mapper.ts (ALGO-008)
 *    - 🧪 اختبارات: tests/spatial/commands.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createMoveCommand(): إنشاء أمر تحريك (#L84)
 *    - createResizeCommand(): إنشاء أمر تحجيم (#L94)
 *    - createSelectCommand(): إنشاء أمر تحديد (#L105)
 *    - createDeleteCommand(): إنشاء أمر حذف (#L118)
 *    - createCreateCommand(): إنشاء أمر إنشاء (#L125)
 *    - computeMoveDelta(): حساب إزاحة التحريك (#L148)
 *    - toBoundingBox(): تحويل إلى BoundingBox (#L170)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ProseMirror (MIT) - Command Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  type SpatialCoordinate,
  type BoundingBox,
  isLogicalCoordinate,
  isGridCoordinate
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// أنواع الأوامر المكانية
// ─────────────────────────────────────────────────────────────────────────────

export const SpatialOp = {
  MOVE: 'spatial_move',
  RESIZE: 'spatial_resize',
  SELECT: 'spatial_select',
  DELETE: 'spatial_delete',
  CREATE: 'spatial_create'
} as const;

export type SpatialOpValue = typeof SpatialOp[keyof typeof SpatialOp];

export interface MoveCommand {
  readonly op: typeof SpatialOp.MOVE;
  readonly targetId: string;
  readonly from: SpatialCoordinate;
  readonly to: SpatialCoordinate;
}

export interface ResizeCommand {
  readonly op: typeof SpatialOp.RESIZE;
  readonly targetId: string;
  readonly position: SpatialCoordinate;
  readonly size: { readonly width: number; readonly height: number };
}

export interface SelectCommand {
  readonly op: typeof SpatialOp.SELECT;
  readonly targetIds: readonly string[];
  readonly addToSelection: boolean;
}

export interface DeleteCommand {
  readonly op: typeof SpatialOp.DELETE;
  readonly targetIds: readonly string[];
}

export interface CreateCommand {
  readonly op: typeof SpatialOp.CREATE;
  readonly position: SpatialCoordinate;
  readonly size?: { readonly width: number; readonly height: number };
  readonly content: unknown;
}

export type SpatialCommand =
  | MoveCommand | ResizeCommand | SelectCommand | DeleteCommand | CreateCommand;

// ─────────────────────────────────────────────────────────────────────────────
// دوال التحقق المشتركة (Shared Validators)
// ─────────────────────────────────────────────────────────────────────────────

function validatePositiveDimensions(
  width: number | undefined,
  height: number | undefined
): void {
  if (width !== undefined && width <= 0) {
    throw new Error(`Width must be positive, got: ${width}`);
  }
  if (height !== undefined && height <= 0) {
    throw new Error(`Height must be positive, got: ${height}`);
  }
}

/**
 * التحقق من تطابق نوع الإحداثيات والوحدة (للـ Logical)
 * @throws Error إذا اختلف النوع (logical vs grid) أو الوحدة (cm vs px)
 */
function validateCoordinateTypesMatch(
  a: SpatialCoordinate,
  b: SpatialCoordinate
): void {
  if (a.type !== b.type) {
    throw new Error(
      `Coordinate types must match: got "${a.type}" and "${b.type}"`
    );
  }
  if (a.type === 'logical' && b.type === 'logical' && a.unit !== b.unit) {
    throw new Error(
      `Logical coordinate units must match: got "${a.unit}" and "${b.unit}"`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// المصانع (Factories)
// ─────────────────────────────────────────────────────────────────────────────

export function createMoveCommand(
  targetId: string,
  from: SpatialCoordinate,
  to: SpatialCoordinate
): MoveCommand {
  validateCoordinateTypesMatch(from, to);
  return { op: SpatialOp.MOVE, targetId, from, to };
}

export function createResizeCommand(
  targetId: string,
  position: SpatialCoordinate,
  width: number,
  height: number
): ResizeCommand {
  validatePositiveDimensions(width, height);
  return { op: SpatialOp.RESIZE, targetId, position, size: { width, height } };
}

export function createSelectCommand(
  targetIds: readonly string[],
  addToSelection: boolean = false
): SelectCommand {
  if (targetIds.length === 0) {
    throw new Error('Selection cannot be empty');
  }
  if (new Set(targetIds).size !== targetIds.length) {
    throw new Error('Selection contains duplicate IDs');
  }
  return { op: SpatialOp.SELECT, targetIds, addToSelection };
}

export function createDeleteCommand(targetIds: readonly string[]): DeleteCommand {
  if (targetIds.length === 0) {
    throw new Error('Delete requires at least one target ID');
  }
  return { op: SpatialOp.DELETE, targetIds };
}

export function createCreateCommand(
  position: SpatialCoordinate,
  content: unknown,
  width?: number,
  height?: number
): CreateCommand {
  if (content === null || content === undefined) {
    throw new Error('Content cannot be null or undefined');
  }
  validatePositiveDimensions(width, height);
  const size = width !== undefined && height !== undefined
    ? { width, height }
    : undefined;
  return { op: SpatialOp.CREATE, position, size, content };
}

// ─────────────────────────────────────────────────────────────────────────────
// دوال الحساب (State Transformers / Utilities)
// ─────────────────────────────────────────────────────────────────────────────

/** إزاحة التحريك مع تمييز النوع (Discriminated Union) */
export type MoveDelta =
  | { readonly kind: 'logical'; readonly dx: number; readonly dy: number }
  | { readonly kind: 'grid'; readonly dRow: number; readonly dCol: number };

export function computeMoveDelta(
  from: SpatialCoordinate,
  to: SpatialCoordinate
): MoveDelta {
  validateCoordinateTypesMatch(from, to);
  
  if (isLogicalCoordinate(from) && isLogicalCoordinate(to)) {
    return { kind: 'logical', dx: to.x - from.x, dy: to.y - from.y };
  }
  
  if (isGridCoordinate(from) && isGridCoordinate(to)) {
    return { kind: 'grid', dRow: to.row - from.row, dCol: to.col - from.col };
  }
  
  throw new Error('Unreachable: coordinate types validated');
}

/**
 * تحويل أمر التحجيم إلى BoundingBox
 * @throws Error إذا كان الموضع GridCoordinate
 * ⚠️ ملاحظة: BoundingBox يتطلب إحداثيات مستمرة (Logical).
 * الإحداثيات الشبكية منفصلة ولا تمثل أبعاداً بالبكسل/سم مباشرة.
 */
export function toBoundingBox(cmd: ResizeCommand): BoundingBox {
  if (!isLogicalCoordinate(cmd.position)) {
    throw new Error('BoundingBox requires LogicalCoordinate (continuous space)');
  }
  return {
    type: 'bounding-box',
    x: cmd.position.x,
    y: cmd.position.y,
    width: cmd.size.width,
    height: cmd.size.height,
    unit: cmd.position.unit
  };
}
