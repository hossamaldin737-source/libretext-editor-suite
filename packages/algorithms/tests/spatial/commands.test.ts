/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: commands.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/commands.test.ts
 * 🎯 الهدف الرئيسي: اختبار مصانع ودوال الأوامر المكانية (تغطية >= 95%)
 * 🏷️ المعرف: TEST-ALGO-009
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v2: Critical fixes tests)
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  SpatialOp,
  createMoveCommand,
  createResizeCommand,
  createSelectCommand,
  createDeleteCommand,
  createCreateCommand,
  computeMoveDelta,
  toBoundingBox
} from '../../src/spatial/commands';
import {
  createLogicalCoordinate,
  createGridCoordinate,
  LengthUnit
} from '../../src/spatial/types';

describe('ALGO-009: Spatial Commands', () => {
  describe('createMoveCommand', () => {
    it('creates a move command with matching logical coordinates', () => {
      const from = createLogicalCoordinate(10, 20, LengthUnit.PIXEL);
      const to = createLogicalCoordinate(30, 40, LengthUnit.PIXEL);
      const cmd = createMoveCommand('item-1', from, to);
      expect(cmd.op).toBe(SpatialOp.MOVE);
      expect(cmd.targetId).toBe('item-1');
      expect(cmd.from).toEqual(from);
      expect(cmd.to).toEqual(to);
    });

    it('creates a move command with matching grid coordinates', () => {
      const from = createGridCoordinate(0, 0);
      const to = createGridCoordinate(3, 4);
      const cmd = createMoveCommand('cell-1', from, to);
      expect(cmd.op).toBe(SpatialOp.MOVE);
      expect(cmd.targetId).toBe('cell-1');
      expect(cmd.from).toEqual(from);
      expect(cmd.to).toEqual(to);
    });

    it('throws when from and to have different types', () => {
      const from = createLogicalCoordinate(10, 20);
      const to = createGridCoordinate(1, 2);
      expect(() => createMoveCommand('item-1', from, to))
        .toThrow('Coordinate types must match');
    });

    it('throws when from and to have different units', () => {
      const from = createLogicalCoordinate(10, 20, LengthUnit.CENTIMETER);
      const to = createLogicalCoordinate(30, 40, LengthUnit.PIXEL);
      expect(() => createMoveCommand('item-1', from, to))
        .toThrow('Logical coordinate units must match');
    });
  });

  describe('createResizeCommand', () => {
    it('creates a resize command with positive dimensions', () => {
      const pos = createLogicalCoordinate(10, 20);
      const cmd = createResizeCommand('item-1', pos, 100, 200);
      expect(cmd.op).toBe(SpatialOp.RESIZE);
      expect(cmd.targetId).toBe('item-1');
      expect(cmd.position).toEqual(pos);
      expect(cmd.size).toEqual({ width: 100, height: 200 });
    });

    it('throws on non-positive width', () => {
      const pos = createLogicalCoordinate(10, 20);
      expect(() => createResizeCommand('item-1', pos, 0, 100))
        .toThrow('Width must be positive');
      expect(() => createResizeCommand('item-1', pos, -10, 100))
        .toThrow('Width must be positive');
    });

    it('throws on non-positive height', () => {
      const pos = createLogicalCoordinate(10, 20);
      expect(() => createResizeCommand('item-1', pos, 100, 0))
        .toThrow('Height must be positive');
      expect(() => createResizeCommand('item-1', pos, 100, -5))
        .toThrow('Height must be positive');
    });
  });

  describe('createSelectCommand', () => {
    it('creates a select command with unique IDs', () => {
      const cmd = createSelectCommand(['id-1', 'id-2'], true);
      expect(cmd.op).toBe(SpatialOp.SELECT);
      expect(cmd.targetIds).toEqual(['id-1', 'id-2']);
      expect(cmd.addToSelection).toBe(true);
    });

    it('defaults addToSelection to false', () => {
      const cmd = createSelectCommand(['id-1']);
      expect(cmd.addToSelection).toBe(false);
    });

    it('throws on empty targetIds', () => {
      expect(() => createSelectCommand([]))
        .toThrow('Selection cannot be empty');
    });

    it('throws on duplicate IDs', () => {
      expect(() => createSelectCommand(['id-1', 'id-1']))
        .toThrow('Selection contains duplicate IDs');
    });
  });

  describe('createDeleteCommand', () => {
    it('creates a delete command', () => {
      const cmd = createDeleteCommand(['id-1', 'id-2']);
      expect(cmd.op).toBe(SpatialOp.DELETE);
      expect(cmd.targetIds).toEqual(['id-1', 'id-2']);
    });

    it('throws on empty targetIds', () => {
      expect(() => createDeleteCommand([]))
        .toThrow('Delete requires at least one target ID');
    });
  });

  describe('createCreateCommand', () => {
    it('creates a create command with optional size', () => {
      const pos = createLogicalCoordinate(10, 20);
      const cmd = createCreateCommand(pos, { text: 'Hello' }, 100, 50);
      expect(cmd.op).toBe(SpatialOp.CREATE);
      expect(cmd.position).toEqual(pos);
      expect(cmd.size).toEqual({ width: 100, height: 50 });
      expect(cmd.content).toEqual({ text: 'Hello' });
    });

    it('creates a create command without size', () => {
      const pos = createLogicalCoordinate(10, 20);
      const cmd = createCreateCommand(pos, 'simple text');
      expect(cmd.size).toBeUndefined();
      expect(cmd.content).toBe('simple text');
    });

    it('throws on null or undefined content', () => {
      const pos = createLogicalCoordinate(10, 20);
      expect(() => createCreateCommand(pos, null))
        .toThrow('Content cannot be null or undefined');
      expect(() => createCreateCommand(pos, undefined))
        .toThrow('Content cannot be null or undefined');
    });

    it('throws on non-positive width or height', () => {
      const pos = createLogicalCoordinate(10, 20);
      expect(() => createCreateCommand(pos, 'data', -10, 50))
        .toThrow('Width must be positive');
      expect(() => createCreateCommand(pos, 'data', 10, 0))
        .toThrow('Height must be positive');
    });
  });

  describe('computeMoveDelta', () => {
    it('returns discriminated union for logical coordinates', () => {
      const from = createLogicalCoordinate(10, 20, LengthUnit.PIXEL);
      const to = createLogicalCoordinate(35, 60, LengthUnit.PIXEL);
      const delta = computeMoveDelta(from, to);
      expect(delta.kind).toBe('logical');
      if (delta.kind === 'logical') {
        expect(delta.dx).toBe(25);
        expect(delta.dy).toBe(40);
      }
    });

    it('returns discriminated union for grid coordinates', () => {
      const from = createGridCoordinate(2, 3);
      const to = createGridCoordinate(5, 9);
      const delta = computeMoveDelta(from, to);
      expect(delta.kind).toBe('grid');
      if (delta.kind === 'grid') {
        expect(delta.dRow).toBe(3);
        expect(delta.dCol).toBe(6);
      }
    });

    it('throws on unit mismatch', () => {
      const from = createLogicalCoordinate(10, 20, LengthUnit.CENTIMETER);
      const to = createLogicalCoordinate(30, 40, LengthUnit.PIXEL);
      expect(() => computeMoveDelta(from, to))
        .toThrow('Logical coordinate units must match');
    });

    it('throws on coordinate type mismatch', () => {
      const from = createLogicalCoordinate(10, 20);
      const to = createGridCoordinate(1, 2);
      expect(() => computeMoveDelta(from, to))
        .toThrow('Coordinate types must match');
    });
  });

  describe('toBoundingBox', () => {
    it('transforms resize command with logical coordinates to bounding box', () => {
      const pos = createLogicalCoordinate(15, 25, LengthUnit.CENTIMETER);
      const cmd = createResizeCommand('node-1', pos, 120, 80);
      const bbox = toBoundingBox(cmd);
      expect(bbox).toEqual({
        type: 'bounding-box',
        x: 15,
        y: 25,
        width: 120,
        height: 80,
        unit: LengthUnit.CENTIMETER
      });
    });

    it('throws when command position is GridCoordinate', () => {
      const pos = createGridCoordinate(1, 2);
      const cmd = createResizeCommand('cell-1', pos, 100, 50);
      expect(() => toBoundingBox(cmd))
        .toThrow('BoundingBox requires LogicalCoordinate');
    });
  });
});
