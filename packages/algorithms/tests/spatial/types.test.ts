/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/types.test.ts
 * 🎯 الهدف الرئيسي: اختبار أنواع الإحداثيات ودوال التحويل الشبكية
 * 📋 المعايير: تغطية 100%
 * 🏷️ المعرف: TEST-ALGO-007
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  createLogicalCoordinate,
  createGridCoordinate,
  isLogicalCoordinate,
  isGridCoordinate,
  gridToLabel,
  labelToGrid
} from '../../src/spatial/types';

describe('ALGO-007: Spatial Types', () => {
  describe('Coordinate Creation', () => {
    it('creates logical coordinates', () => {
      const coord = createLogicalCoordinate(100, 200, 'cm');
      expect(coord).toEqual({ type: 'logical', x: 100, y: 200, unit: 'cm' });
    });

    it('creates logical coordinates with default px unit', () => {
      const coord = createLogicalCoordinate(50, 50);
      expect(coord).toEqual({ type: 'logical', x: 50, y: 50, unit: 'px' });
    });

    it('creates grid coordinates', () => {
      const coord = createGridCoordinate(0, 0); // A1
      expect(coord).toEqual({ type: 'grid', row: 0, col: 0 });
    });
  });

  describe('Type Guards', () => {
    it('isLogicalCoordinate works correctly', () => {
      const logical = createLogicalCoordinate(10, 10);
      const grid = createGridCoordinate(1, 1);
      expect(isLogicalCoordinate(logical)).toBe(true);
      expect(isLogicalCoordinate(grid)).toBe(false);
    });

    it('isGridCoordinate works correctly', () => {
      const logical = createLogicalCoordinate(10, 10);
      const grid = createGridCoordinate(1, 1);
      expect(isGridCoordinate(logical)).toBe(false);
      expect(isGridCoordinate(grid)).toBe(true);
    });
  });

  describe('Grid Labels Translation', () => {
    it('translates grid coordinate to label', () => {
      expect(gridToLabel(createGridCoordinate(0, 0))).toBe('A1');
      expect(gridToLabel(createGridCoordinate(0, 1))).toBe('B1');
      expect(gridToLabel(createGridCoordinate(1, 0))).toBe('A2');
      expect(gridToLabel(createGridCoordinate(0, 25))).toBe('Z1');
      expect(gridToLabel(createGridCoordinate(0, 26))).toBe('AA1');
      expect(gridToLabel(createGridCoordinate(2, 27))).toBe('AB3');
    });

    it('translates label to grid coordinate', () => {
      expect(labelToGrid('A1')).toEqual({ type: 'grid', row: 0, col: 0 });
      expect(labelToGrid('B1')).toEqual({ type: 'grid', row: 0, col: 1 });
      expect(labelToGrid('A2')).toEqual({ type: 'grid', row: 1, col: 0 });
      expect(labelToGrid('Z1')).toEqual({ type: 'grid', row: 0, col: 25 });
      expect(labelToGrid('AA1')).toEqual({ type: 'grid', row: 0, col: 26 });
      expect(labelToGrid('AB3')).toEqual({ type: 'grid', row: 2, col: 27 });
      expect(labelToGrid('a1')).toEqual({ type: 'grid', row: 0, col: 0 }); // lowercase support
    });

    it('throws error on invalid label format', () => {
      expect(() => labelToGrid('1A')).toThrow('Invalid grid label format: 1A');
      expect(() => labelToGrid('A')).toThrow('Invalid grid label format: A');
      expect(() => labelToGrid('1')).toThrow('Invalid grid label format: 1');
      expect(() => labelToGrid('A1B')).toThrow('Invalid grid label format: A1B');
    });
  });
});
