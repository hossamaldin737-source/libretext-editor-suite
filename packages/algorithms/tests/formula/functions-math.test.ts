/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-math.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/functions-math.test.ts
 * 🎯 الهدف الرئيسي: اختبارات وحدة شاملة لدوال الحساب والإحصاء الوصفي
 * 📋 المعايير: تغطية 100%، اختبار القسمة على صفر، الجذور السالبة، المصفوفات
 * 🏷️ المعرف: TEST-ALGO-015
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  POWER,
  SQRT,
  MOD,
  FLOOR,
  CEILING,
  TRUNC,
  MEDIAN,
  MODE,
  COUNTA,
  COUNTBLANK,
  COUNTIF,
  SUMIF,
} from '../../src/formula/functions-math';

describe('ALGO-015: Extended Math & Statistics Functions', () => {
  describe('POWER & SQRT', () => {
    it('calculates POWER', () => {
      expect(POWER(2, 3)).toBe(8);
      expect(POWER(10, 2)).toBe(100);
      expect(POWER(4, 0.5)).toBe(2);
    });

    it('calculates SQRT and protects against negative numbers', () => {
      expect(SQRT(16)).toBe(4);
      expect(SQRT(0)).toBe(0);
      expect(() => SQRT(-9)).toThrow('SQRT cannot accept negative numbers');
    });
  });

  describe('MOD, FLOOR, CEILING, TRUNC', () => {
    it('calculates MOD and protects against division by zero', () => {
      expect(MOD(10, 3)).toBe(1);
      expect(MOD(8, 4)).toBe(0);
      expect(() => MOD(5, 0)).toThrow('MOD divisor cannot be zero');
    });

    it('calculates FLOOR and CEILING with significance', () => {
      expect(FLOOR(3.7, 1)).toBe(3);
      expect(FLOOR(3.75, 0.1)).toBe(3.7);
      expect(CEILING(3.2, 1)).toBe(4);
      expect(CEILING(3.21, 0.1)).toBe(3.3);
    });

    it('truncates decimals with TRUNC', () => {
      expect(TRUNC(8.9)).toBe(8);
      expect(TRUNC(8.915, 2)).toBe(8.91);
      expect(TRUNC(-8.9)).toBe(-8);
    });
  });

  describe('Statistical Functions (MEDIAN, MODE, COUNTA, COUNTBLANK, COUNTIF, SUMIF)', () => {
    it('calculates MEDIAN for odd and even length lists', () => {
      expect(MEDIAN(1, 2, 100)).toBe(2);
      expect(MEDIAN(1, 2, 3, 4)).toBe(2.5);
      expect(MEDIAN([10, 20, [30, 40, 50]])).toBe(30);
    });

    it('calculates MODE (most frequent value)', () => {
      expect(MODE(1, 2, 2, 3, 4)).toBe(2);
      expect(MODE([10, 20, 20, 30, 20])).toBe(20);
    });

    it('counts non-empty values with COUNTA', () => {
      expect(COUNTA(1, 'text', '', null, true, undefined, 0)).toBe(4); // 1, 'text', true, 0
    });

    it('counts blank values with COUNTBLANK', () => {
      expect(COUNTBLANK(1, 'text', '', null, true, undefined, 0)).toBe(3); // '', null, undefined
    });

    it('counts conditional matches with COUNTIF', () => {
      expect(COUNTIF([10, 25, 5, 30, 15], '>20')).toBe(2);
      expect(COUNTIF(['مكتمل', 'قيد المعالجة', 'مكتمل', 'ملغي'], 'مكتمل')).toBe(2);
      expect(COUNTIF(['أحمد', 'احمد', 'محمد'], 'احمد')).toBe(2); // with Arabic normalization
    });

    it('sums conditional items with SUMIF', () => {
      expect(SUMIF([10, 20, 30, 40], '>25')).toBe(70);
      expect(SUMIF(['مكتمل', 'قيد المعالجة', 'مكتمل'], 'مكتمل', [100, 200, 300])).toBe(400);
    });
  });
});
