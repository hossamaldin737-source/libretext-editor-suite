/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: arabic-integration.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/arabic-integration.test.ts
 * 🎯 الهدف الرئيسي: اختبار تكامل محرك الصيغ وتقييم التعابير باللغة العربية بالكامل
 * 📋 المعايير: تقييم الصيغ المعقدة، الأسماء المستعارة، تفقيط الخلايا، الدوال المركبة
 * 🏷️ المعرف: TEST-ALGO-016
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { parseFormula } from '../../src/formula/parser';
import { FormulaEvaluator } from '../../src/formula/evaluator';

describe('ALGO-016: Arabic Formula Integration & Full Evaluator', () => {
  const getCellValue = (ref: string) => {
    const data: Record<string, unknown> = {
      A1: 10,
      A2: 20,
      A3: 30,
      B1: '   مهندس برمجيات   ',
      B2: 'مُحَمَّدٌ عَلِيّ',
      B3: 2500.5,
    };
    return data[ref] ?? null;
  };

  const evaluator = new FormulaEvaluator({ getCellValue });

  it('evaluates Arabic alias for SUM: =مجموع(A1:A3)', () => {
    const ast = parseFormula('مجموع(A1:A3)');
    const result = evaluator.evaluate(ast);
    expect(result).toBe(60);
  });

  it('evaluates Arabic alias for AVERAGE: =متوسط(A1:A3)', () => {
    const ast = parseFormula('متوسط(A1:A3)');
    const result = evaluator.evaluate(ast);
    expect(result).toBe(20);
  });

  it('evaluates Tafqeet on cell reference: =تفقيط(B3, "SAR")', () => {
    const ast = parseFormula('تفقيط(B3, "SAR")');
    const result = evaluator.evaluate(ast);
    expect(result).toBe('فقط ألفان وخمسمائة ريال سعودي وخمسون هللة لا غير');
  });

  it('evaluates TRIM in Arabic: =مسح_الفراغات(B1)', () => {
    const ast = parseFormula('مسح_الفراغات(B1)');
    const result = evaluator.evaluate(ast);
    expect(result).toBe('مهندس برمجيات');
  });

  it('evaluates Tashkeel stripping: =حذف_التشكيل(B2)', () => {
    const ast = parseFormula('حذف_التشكيل(B2)');
    const result = evaluator.evaluate(ast);
    expect(result).toBe('محمد علي');
  });

  it('evaluates nested formulas in Arabic: =دمج("المجموع: ", تفقيط(مجموع(A1:A3), "EGP"))', () => {
    const ast = parseFormula('دمج("المجموع: ", تفقيط(مجموع(A1:A3), "EGP"))');
    const result = evaluator.evaluate(ast);
    expect(result).toBe('المجموع: فقط ستون جنيه مصري لا غير');
  });

  it('evaluates Arabic boolean conditions with IF: =شرط(صحيح, "نعم", "لا")', () => {
    const ast = parseFormula('شرط(صحيح, "نعم", "لا")');
    const result = evaluator.evaluate(ast);
    expect(result).toBe('نعم');
  });
});
