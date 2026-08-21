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
  labelToGrid,
  isValidCellLabel,
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

    it('throws when row or col is negative', () => {
      expect(() => createGridCoordinate(-1, 0)).toThrow('Row cannot be negative');
      expect(() => createGridCoordinate(0, -1)).toThrow('Column cannot be negative');
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
      expect(() => labelToGrid('1A')).toThrow('Invalid cell label format: 1A');
      expect(() => labelToGrid('A')).toThrow('Invalid cell label format: A');
      expect(() => labelToGrid('1')).toThrow('Invalid cell label format: 1');
      expect(() => labelToGrid('A1B')).toThrow('Invalid cell label format: A1B');
    });
  });

  describe('ALGO-007 v3: Leading Zeros + Multi-Letter Columns', () => {
    describe('Leading Zeros Support', () => {
      it('accepts "A01" as valid label', () => {
        const coord = labelToGrid('A01');
        expect(coord).toEqual({ type: 'grid', row: 0, col: 0 });
      });

      it('accepts "AA001" as valid label', () => {
        const coord = labelToGrid('AA001');
        expect(coord).toEqual({ type: 'grid', row: 0, col: 26 });
      });

      it('treats "A01" and "A1" as equivalent', () => {
        const coord1 = labelToGrid('A01');
        const coord2 = labelToGrid('A1');
        expect(coord1).toEqual(coord2);
      });
    });

    describe('Multi-Letter Columns', () => {
      it('converts col=26 to "AA"', () => {
        const coord = createGridCoordinate(0, 26);
        expect(gridToLabel(coord)).toBe('AA1');
      });

      it('converts col=27 to "AB"', () => {
        const coord = createGridCoordinate(0, 27);
        expect(gridToLabel(coord)).toBe('AB1');
      });

      it('converts col=51 to "AZ"', () => {
        const coord = createGridCoordinate(0, 51);
        expect(gridToLabel(coord)).toBe('AZ1');
      });

      it('converts col=52 to "BA"', () => {
        const coord = createGridCoordinate(0, 52);
        expect(gridToLabel(coord)).toBe('BA1');
      });

      it('converts col=701 to "ZZ"', () => {
        const coord = createGridCoordinate(0, 701);
        expect(gridToLabel(coord)).toBe('ZZ1');
      });

      it('converts col=702 to "AAA"', () => {
        const coord = createGridCoordinate(0, 702);
        expect(gridToLabel(coord)).toBe('AAA1');
      });

      it('parses "AA1" correctly', () => {
        const coord = labelToGrid('AA1');
        expect(coord.col).toBe(26);
      });

      it('parses "ZZ1" correctly', () => {
        const coord = labelToGrid('ZZ1');
        expect(coord.col).toBe(701);
      });

      it('parses "AAA1" correctly', () => {
        const coord = labelToGrid('AAA1');
        expect(coord.col).toBe(702);
      });

      it('round-trips multi-letter columns', () => {
        const original = createGridCoordinate(42, 100);
        const label = gridToLabel(original);
        const parsed = labelToGrid(label);
        expect(parsed).toEqual(original);
      });
    });

    describe('isValidCellLabel Clarification', () => {
      it('returns true for "A0" (format valid, semantic invalid)', () => {
        expect(isValidCellLabel('A0')).toBe(true);
      });

      it('labelToGrid throws on "A0" (semantic validation)', () => {
        expect(() => labelToGrid('A0')).toThrow('Row number must be at least 1');
      });

      it('isValidCellLabel checks format only', () => {
        expect(isValidCellLabel('A01')).toBe(true);
        expect(isValidCellLabel('AA999')).toBe(true);
        expect(isValidCellLabel('ZZZ1234')).toBe(true);
      });
    });
  });
});
