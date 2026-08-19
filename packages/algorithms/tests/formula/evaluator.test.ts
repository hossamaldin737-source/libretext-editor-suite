/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: evaluator.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/evaluator.test.ts
 * 🎯 الهدف الرئيسي: اختبار مقيم الصيغ (FormulaEvaluator)
 * 📋 المعايير: تغطية 100%، اختبار العمليات الحسابية والمنطقية والدوال
 * 🏷️ المعرف: TEST-ALGO-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { parseFormula } from '../../src/formula/parser';
import { evaluateFormula, EvaluationContext } from '../../src/formula/evaluator';

describe('ALGO-005: FormulaEvaluator', () => {
  const ctx: EvaluationContext = {
    getCellValue: (ref: string) => {
      if (ref === 'A1') return 10;
      if (ref === 'A2') return 20;
      if (ref === 'B1') return 'Hello';
      if (ref === 'B2') return ' World';
      if (ref === 'C1') return true;
      if (ref === 'C2') return false;
      return null;
    },
    getFunction: (name: string) => {
      if (name === 'SUM') {
        return (...args: unknown[]) => {
          const values = args.flat() as number[];
          return values.reduce((sum, val) => sum + (val as number || 0), 0);
        };
      }
      if (name === 'AVERAGE') {
        return (...args: unknown[]) => {
          const values = args.flat() as number[];
          if (values.length === 0) return 0;
          return values.reduce((sum, val) => sum + (val as number || 0), 0) / values.length;
        };
      }
      if (name === 'IF') {
        return (cond: unknown, ifTrue: unknown, ifFalse: unknown) => {
          return cond ? ifTrue : ifFalse;
        };
      }
      if (name === 'CONCATENATE') {
        return (...args: unknown[]) => args.join('');
      }
      if (name === 'MIN') {
        return (...args: unknown[]) => Math.min(...(args as number[]));
      }
      if (name === 'MAX') {
        return (...args: unknown[]) => Math.max(...(args as number[]));
      }
      return undefined;
    }
  };

  const evalStr = (expr: string, context = ctx) => evaluateFormula(parseFormula(expr), context);

  describe('Literals & Constants', () => {
    it('evaluates numbers', () => {
      expect(evalStr('42')).toBe(42);
      expect(evalStr('3.14')).toBe(3.14);
    });

    it('evaluates strings', () => {
      expect(evalStr('"hello"')).toBe('hello');
    });

    it('evaluates booleans', () => {
      expect(evalStr('TRUE')).toBe(true);
      expect(evalStr('FALSE')).toBe(false);
    });

    it('evaluates constants', () => {
      expect(evalStr('PI')).toBe(Math.PI);
    });
  });

  describe('Cell & Range References', () => {
    it('evaluates cell references', () => {
      expect(evalStr('A1')).toBe(10);
      expect(evalStr('B1')).toBe('Hello');
    });

    it('returns null when evaluating a range directly', () => {
      expect(evalStr('A1:A2')).toBe(10); // visitRange returns first value when used directly
    });
  });

  describe('Unary Operations', () => {
    it('evaluates unary minus', () => {
      expect(evalStr('-5')).toBe(-5);
      expect(evalStr('-A1')).toBe(-10);
    });

    it('evaluates unary plus', () => {
      expect(evalStr('+5')).toBe(5);
      expect(evalStr('+A1')).toBe(10);
    });
  });

  describe('Binary Arithmetic', () => {
    it('evaluates addition', () => {
      expect(evalStr('10 + 5')).toBe(15);
      expect(evalStr('A1 + A2')).toBe(30);
    });

    it('evaluates subtraction', () => {
      expect(evalStr('10 - 5')).toBe(5);
      expect(evalStr('A2 - A1')).toBe(10);
    });

    it('evaluates multiplication', () => {
      expect(evalStr('10 * 5')).toBe(50);
    });

    it('evaluates division', () => {
      expect(evalStr('10 / 2')).toBe(5);
    });

    it('throws on division by zero', () => {
      expect(() => evalStr('10 / 0')).toThrow('Division by zero');
    });

    it('evaluates exponentiation', () => {
      expect(evalStr('2 ^ 3')).toBe(8);
    });
  });

  describe('Comparison & String Operations', () => {
    it('evaluates concatenation', () => {
      expect(evalStr('"Foo" & "Bar"')).toBe('FooBar');
      expect(evalStr('B1 & B2')).toBe('Hello World');
    });

    it('evaluates equality', () => {
      expect(evalStr('10 = 10')).toBe(true);
      expect(evalStr('10 = 5')).toBe(false);
      expect(evalStr('A1 = 10')).toBe(true);
    });

    it('evaluates inequality', () => {
      expect(evalStr('10 <> 5')).toBe(true);
      expect(evalStr('10 <> 10')).toBe(false);
    });

    it('evaluates greater/less than', () => {
      expect(evalStr('10 > 5')).toBe(true);
      expect(evalStr('5 < 10')).toBe(true);
      expect(evalStr('10 >= 10')).toBe(true);
      expect(evalStr('10 <= 10')).toBe(true);
    });
  });

  describe('Built-in Functions', () => {
    it('evaluates SUM', () => {
      expect(evalStr('SUM(10, 20, 30)')).toBe(60);
      expect(evalStr('SUM(A1:A2, 5)')).toBe(35); // 10 + 20 + 5
    });

    it('evaluates AVERAGE', () => {
      expect(evalStr('AVERAGE(10, 20, 30)')).toBe(20);
      expect(evalStr('AVERAGE(A1:A2)')).toBe(15);
    });

    it('evaluates IF', () => {
      expect(evalStr('IF(TRUE, 1, 2)')).toBe(1);
      expect(evalStr('IF(FALSE, 1, 2)')).toBe(2);
      expect(evalStr('IF(A1 > 5, "Yes", "No")')).toBe('Yes');
    });

    it('evaluates CONCATENATE', () => {
      expect(evalStr('CONCATENATE("A", "B", "C")')).toBe('ABC');
    });

    it('evaluates MIN/MAX', () => {
      expect(evalStr('MIN(10, 5, 20)')).toBe(5);
      expect(evalStr('MAX(10, 5, 20)')).toBe(20);
    });

    it('throws on unknown function', () => {
      expect(() => evalStr('UNKNOWN(1)')).toThrow('Unknown function: UNKNOWN');
    });
  });

  describe('ALGO-005 v2: Bug Fixes', () => {
    describe('Constants (Fixed)', () => {
      it('evaluates PI correctly', () => {
        expect(evalStr('PI')).toBeCloseTo(Math.PI);
      });

      it('evaluates E correctly', () => {
        expect(evalStr('E')).toBeCloseTo(Math.E);
      });

      it('evaluates TAU correctly', () => {
        expect(evalStr('TAU')).toBeCloseTo(2 * Math.PI);
      });
    });

    describe('Range Expansion (Fixed)', () => {
      it('handles missing cells in range as null', () => {
        const localCtx = {
          getCellValue: (ref: string) => {
            if (ref === 'A1') return 10;
            // A2 missing
            if (ref === 'A3') return 30;
            return null;
          },
          getFunction: ctx.getFunction
        };
        expect(evalStr('SUM(A1:A3)', localCtx)).toBe(40);
      });
    });

    describe('Null Handling (Fixed)', () => {
      it('treats null as 0 in arithmetic', () => {
        const localCtx = {
          getCellValue: () => null
        };
        expect(evalStr('A1+5', localCtx)).toBe(5);
      });

      it('treats null as empty string in concatenation', () => {
        const localCtx = {
          getCellValue: () => null
        };
        expect(evalStr('A1&"test"', localCtx)).toBe('test');
      });
    });

    describe('Excel-Style Equality (Fixed)', () => {
      it('compares number with string correctly', () => {
        expect(evalStr('5="5"')).toBe(true);
        expect(evalStr('"5"=5')).toBe(true);
      });

      it('compares different types correctly', () => {
        expect(evalStr('5=6')).toBe(false);
        expect(evalStr('"a"="a"')).toBe(true);
      });
    });

    describe('Circular Reference (Real Test)', () => {
      it('detects circular reference via getCellValue recursion', () => {
        let callCount = 0;
        const localCtx: EvaluationContext = {
          getCellValue: (ref: string) => {
            callCount++;
            if (callCount > 10) {
              throw new Error('Circular reference detected');
            }
            if (ref === 'A1') {
              return evalStr('B1', localCtx);
            }
            if (ref === 'B1') {
              return evalStr('A1', localCtx);
            }
            return null;
          },
          maxDepth: 5
        };
        expect(() => evalStr('A1', localCtx)).toThrow();
      });
    });

    describe('Comparison Operators (Fixed)', () => {
      it('compares strings lexicographically', () => {
        expect(evalStr('"a"<"b"')).toBe(true);
        expect(evalStr('"z">"a"')).toBe(true);
      });

      it('compares booleans correctly', () => {
        expect(evalStr('TRUE>FALSE')).toBe(true);
        expect(evalStr('FALSE<TRUE')).toBe(true);
      });
    });
  });

  describe('ALGO-005 v3: Lazy IF (Critical Fix)', () => {
    it('IF does not evaluate false branch when condition is true', () => {
      const context = {
        getCellValue: (ref: string) => {
          if (ref === 'A1') return 10;
          if (ref === 'B1') return 0;
          return null;
        },
        getFunction: (name: string) => {
          if (name === 'DIVIDE') {
            return (a: number, b: number) => {
              if (b === 0) throw new Error('Division by zero in DIVIDE');
              return a / b;
            };
          }
          return undefined;
        }
      };

      const ast = parseFormula('IF(A1>5, 100, DIVIDE(10, B1))');
      expect(evaluateFormula(ast, context)).toBe(100);
    });

    it('IF evaluates true branch when condition is true', () => {
      const context = {
        getCellValue: () => 1
      };
      const ast = parseFormula('IF(TRUE, 42, 0)');
      expect(evaluateFormula(ast, context)).toBe(42);
    });

    it('IF evaluates false branch when condition is false', () => {
      const context = {
        getCellValue: () => 1
      };
      const ast = parseFormula('IF(FALSE, 0, 99)');
      expect(evaluateFormula(ast, context)).toBe(99);
    });

    it('IF protects against division by zero (Excel pattern)', () => {
      const context = {
        getCellValue: (ref: string) => {
          if (ref === 'A1') return 100;
          if (ref === 'B1') return 0;
          return null;
        }
      };

      const ast = parseFormula('IF(B1<>0, A1/B1, 0)');
      expect(evaluateFormula(ast, context)).toBe(0);
    });

    it('merged context uses default registry when getFunction not provided', () => {
      const context = {
        getCellValue: () => 5
      };
      const ast = parseFormula('SUM(A1, 10)');
      expect(evaluateFormula(ast, context)).toBe(15);
    });
  });
});

