/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: functions.test.ts
  * 📂 المسار: packages/algorithms/tests/formula/functions.test.ts
  * 🎯 الهدف الرئيسي: اختبار الدوال المدمجة مع معالجة الفاصلة العائمة واللانهاية
  * 📋 المعايير: تغطية 100%، اختبار الحالات الحدية
  * 🏷️ المعرف: TEST-ALGO-006
  * 📅 تاريخ الإنشاء: 2026-08-19
  * ═══════════════════════════════════════════════════════════════════════════
  */

import { describe, it, expect } from 'vitest';
import {
  SUM,
  AVERAGE,
  COUNT,
  MIN,
  MAX,
  ABS,
  ROUND,
  CONCAT,
  IF
} from '../../src/formula/functions';

describe('ALGO-006: Built-in Functions', () => {
  describe('SUM', () => {
    it('sums basic numbers', () => {
      expect(SUM(1, 2, 3)).toBe(6);
    });

    it('flattens array ranges', () => {
      expect(SUM([1, 2], [3, [4, 5]])).toBe(15);
    });

    it('ignores non-numeric strings and nulls', () => {
      expect(SUM(10, 'abc', null, undefined, 5)).toBe(15);
    });

    it('coerces numeric strings and booleans', () => {
      expect(SUM('10', true, false, 5)).toBe(16);
    });
  });

  describe('AVERAGE', () => {
    it('calculates average of numbers', () => {
      expect(AVERAGE(2, 4, 6)).toBe(4);
    });

    it('throws error when no numeric values present', () => {
      expect(() => AVERAGE('abc', null)).toThrow('AVERAGE requires at least one numeric value');
    });
  });

  describe('COUNT', () => {
    it('counts numeric values including nested arrays', () => {
      expect(COUNT(1, '2', 'foo', null, [3, 4, 'bar'])).toBe(4);
    });
  });

  describe('MIN & MAX', () => {
    it('finds min value', () => {
      expect(MIN(10, 5, 20)).toBe(5);
    });

    it('throws on empty MIN', () => {
      expect(() => MIN('abc')).toThrow('MIN requires at least one numeric value');
    });

    it('finds max value', () => {
      expect(MAX(10, 5, 20)).toBe(20);
    });

    it('throws on empty MAX', () => {
      expect(() => MAX('abc')).toThrow('MAX requires at least one numeric value');
    });
  });

  describe('ABS', () => {
    it('returns absolute value', () => {
      expect(ABS(-10)).toBe(10);
      expect(ABS(10)).toBe(10);
    });

    it('throws on non-numeric value', () => {
      expect(() => ABS('abc')).toThrow('ABS requires a numeric value');
    });
  });

  describe('CONCAT & IF', () => {
    it('concatenates strings and values', () => {
      expect(CONCAT('Hello', ' ', 'World', 123)).toBe('Hello World123');
    });

    it('evaluates eager IF correctly', () => {
      expect(IF(true, 'yes', 'no')).toBe('yes');
      expect(IF(false, 'yes', 'no')).toBe('no');
    });
  });
});

describe('ALGO-006 v2: Safe ROUND + Infinity', () => {
  describe('ROUND (Safe Floating-Point)', () => {
    it('handles negative decimals correctly', () => {
      expect(ROUND(1234.56, -2)).toBe(1200);
      expect(ROUND(1234.56, -1)).toBe(1230);
    });

    it('avoids floating-point errors', () => {
      expect(ROUND(0.1 + 0.2, 1)).toBe(0.3);
    });

    it('handles zero decimals', () => {
      expect(ROUND(3.7, 0)).toBe(4);
      expect(ROUND(3.2, 0)).toBe(3);
    });

    it('throws on non-integer decimals', () => {
      expect(() => ROUND(3.14, 1.5)).toThrow('must be an integer');
    });
  });

  describe('Infinity Handling', () => {
    it('throws on Infinity in SUM', () => {
      expect(() => SUM(Infinity, 1)).toThrow('Infinity detected');
    });

    it('throws on Infinity in AVERAGE', () => {
      expect(() => AVERAGE(1, Infinity)).toThrow('Infinity detected');
    });

    it('throws on Infinity string', () => {
      expect(() => SUM('Infinity')).toThrow('Infinity detected');
    });

    it('allows finite numbers', () => {
      expect(SUM(1, 2, 3)).toBe(6);
    });
  });
});
