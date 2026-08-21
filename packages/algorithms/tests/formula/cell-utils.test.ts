/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: cell-utils.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/cell-utils.test.ts
 * 🎯 الهدف الرئيسي: اختبار دوال الخلايا والمقارنات الخاصة بمعادلات الجداول
 * 📋 المعايير: تغطية 100% للتحويلات والمقارنات
 * 🏷️ المعرف: TEST-ALGO-011
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { columnToIndex, indexToColumn, excelEquals, compare } from '../../src/formula/cell-utils';

describe('ALGO-011: cell-utils', () => {
  describe('columnToIndex', () => {
    it('converts A to 0', () => expect(columnToIndex('A')).toBe(0));
    it('converts Z to 25', () => expect(columnToIndex('Z')).toBe(25));
    it('converts AA to 26', () => expect(columnToIndex('AA')).toBe(26));
    it('converts AZ to 51', () => expect(columnToIndex('AZ')).toBe(51));
    it('converts BA to 52', () => expect(columnToIndex('BA')).toBe(52));
    it('handles lowercase', () => expect(columnToIndex('a')).toBe(0));
  });

  describe('indexToColumn', () => {
    it('converts 0 to A', () => expect(indexToColumn(0)).toBe('A'));
    it('converts 25 to Z', () => expect(indexToColumn(25)).toBe('Z'));
    it('converts 26 to AA', () => expect(indexToColumn(26)).toBe('AA'));
    it('converts 51 to AZ', () => expect(indexToColumn(51)).toBe('AZ'));
    it('converts 52 to BA', () => expect(indexToColumn(52)).toBe('BA'));
  });

  describe('excelEquals', () => {
    it('returns true for same primitive values', () => {
      expect(excelEquals(5, 5)).toBe(true);
      expect(excelEquals('a', 'a')).toBe(true);
      expect(excelEquals(null, null)).toBe(true);
    });

    it('returns false for different primitive values', () => {
      expect(excelEquals(5, 6)).toBe(false);
      expect(excelEquals('a', 'b')).toBe(false);
      expect(excelEquals(null, 5)).toBe(false);
    });

    it('coerces strings and numbers correctly', () => {
      expect(excelEquals(5, '5')).toBe(true);
      expect(excelEquals('5', 5)).toBe(true);
      expect(excelEquals(5.5, '5.5')).toBe(true);
    });

    it('returns false for non-coercible string and number', () => {
      expect(excelEquals(5, 'a')).toBe(false);
    });

    it('handles arrays correctly', () => {
      expect(excelEquals([1, 2], [1, 2])).toBe(true);
      expect(excelEquals([1, 2], [1, 3])).toBe(false);
      expect(excelEquals([1, 2], [1])).toBe(false);
      expect(excelEquals(1, [1])).toBe(false);
      expect(excelEquals([1], 1)).toBe(false);
    });
  });

  describe('compare', () => {
    it('compares numbers', () => {
      expect(compare(5, 10)).toBeLessThan(0);
      expect(compare(10, 5)).toBeGreaterThan(0);
      expect(compare(5, 5)).toBe(0);
    });

    it('compares strings', () => {
      expect(compare('a', 'b')).toBeLessThan(0);
      expect(compare('b', 'a')).toBeGreaterThan(0);
      expect(compare('a', 'a')).toBe(0);
    });

    it('compares booleans', () => {
      expect(compare(false, true)).toBeLessThan(0);
      expect(compare(true, false)).toBeGreaterThan(0);
      expect(compare(true, true)).toBe(0);
    });

    it('coerces to number if possible', () => {
      expect(compare(5, '10')).toBeLessThan(0);
      expect(compare('10', 5)).toBeGreaterThan(0);
    });

    it('throws when comparing arrays directly', () => {
      expect(() => compare([1], [2])).toThrow('Cannot compare ranges directly');
      expect(() => compare(1, [2])).toThrow('Cannot compare ranges directly');
    });

    it('throws when comparing incompatible types', () => {
      expect(() => compare({}, {})).toThrow('Cannot compare object with object');
    });
  });
});
