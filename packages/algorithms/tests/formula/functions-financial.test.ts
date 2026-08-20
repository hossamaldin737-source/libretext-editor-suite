/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-financial.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/functions-financial.test.ts
 * 🎯 الهدف الرئيسي: اختبارات الدوال المالية (PMT, NPV, IRR)
 * 🏷️ المعرف: TEST-ALGO-FINANCIAL
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { PMT, NPV, IRR } from '../../src/formula/functions-financial';
import { FormulaError } from '../../src/formula/functions';

describe('Financial Functions (PMT, NPV, IRR)', () => {
  describe('PMT', () => {
    it('calculates monthly loan payment correctly for standard loan (type 0)', () => {
      // $10,000 loan, 8% annual rate (0.08/12 monthly), 10 months
      const rate = 0.08 / 12;
      const nper = 10;
      const pv = 10000;
      const result = PMT(rate, nper, pv);
      // Expected PMT: approx -1037.03
      expect(Math.round(result * 100) / 100).toBe(-1037.03);
    });

    it('calculates payment with zero interest rate', () => {
      const result = PMT(0, 12, 12000);
      expect(result).toBe(-1000);
    });

    it('calculates payment with future value and beginning-of-period type (type 1)', () => {
      const rate = 0.05 / 12;
      const nper = 60;
      const pv = 50000;
      const fv = 0;
      const type = 1;
      const result = PMT(rate, nper, pv, fv, type);
      expect(result).toBeLessThan(0);
      expect(Math.abs(result)).toBeLessThan(1000);
    });

    it('throws error when nper is 0 or invalid arguments passed', () => {
      expect(() => PMT(0.05, 0, 1000)).toThrow(FormulaError);
      expect(() => PMT('invalid', 12, 1000)).toThrow(FormulaError);
    });
  });

  describe('NPV', () => {
    it('calculates Net Present Value for standard cash flows', () => {
      // 10% discount rate, cash flows: 1000, 2000, 3000
      const rate = 0.1;
      const result = NPV(rate, 1000, 2000, 3000);
      // 1000/1.1 + 2000/1.21 + 3000/1.331 = 909.0909 + 1652.8925 + 2253.9444 = 4815.9278
      expect(Math.round(result * 100) / 100).toBe(4815.93);
    });

    it('supports array of cash flows', () => {
      const rate = 0.08;
      const flows = [500, 1000, 1500, 2000];
      const result = NPV(rate, flows);
      expect(result).toBeGreaterThan(0);
    });

    it('throws when discount rate is <= -1 or no cash flows provided', () => {
      expect(() => NPV(-1, 1000, 2000)).toThrow(FormulaError);
      expect(() => NPV(0.1, [])).toThrow(FormulaError);
    });
  });

  describe('IRR', () => {
    it('calculates Internal Rate of Return accurately', () => {
      // Initial investment: -100, followed by cash inflows: 39, 59, 55, 20
      const flows = [-100, 39, 59, 55, 20];
      const result = IRR(flows);
      // Expected IRR is around 28.09% (0.2809)
      expect(Math.round(result * 10000) / 100).toBeCloseTo(28.09, 1);
    });

    it('calculates simple 1-period IRR', () => {
      // -100 to 110 => 10% return
      const flows = [-100, 110];
      const result = IRR(flows);
      expect(Math.round(result * 100) / 100).toBe(0.1);
    });

    it('throws error if all cash flows are positive or all negative', () => {
      expect(() => IRR([100, 200, 300])).toThrow(FormulaError);
      expect(() => IRR([-100, -200, -300])).toThrow(FormulaError);
      expect(() => IRR([100])).toThrow(FormulaError);
    });
  });
});
