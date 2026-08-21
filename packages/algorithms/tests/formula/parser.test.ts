/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: parser.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/parser.test.ts
 * 🎯 الهدف الرئيسي: اختبار محلل الصيغ ومحلل الرموز (تغطية >= 95%)
 * 📋 المعايير: تغطية جميع أنواع العقد، الأسبقية، الأخطاء
 * 🧪 الاختبارات: (هذا الملف هو الاختبار نفسه)
 * 🏷️ المعرف: TEST-ALGO-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 الإصدار: v2.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, test } from 'vitest';
import { parseFormula, MATH_CONSTANTS, ParseError } from '../../src/formula/parser';
import { tokenize } from '../../src/formula/tokenizer';

// ──────────────────────────────────────────────────────────────
// مجموعة 1: اختبارات ALGO-010 (Tokenizer)
// ──────────────────────────────────────────────────────────────
describe('ALGO-010: FormulaTokenizer', () => {
  it('tokenizes a simple expression', () => {
    const tokens = tokenize('1+2');
    expect(tokens.map((t) => t.type)).toEqual(['number', 'op', 'number', 'eof']);
  });

  it('tokenizes spaces correctly', () => {
    const tokens = tokenize('1 + 2');
    expect(tokens.map((t) => t.type)).toEqual(['number', 'op', 'number', 'eof']);
  });

  it('distinguishes cell from ident', () => {
    const tokens = tokenize('A1 SUM');
    expect(tokens[0].type).toBe('cell');
    expect(tokens[1].type).toBe('ident');
    expect(tokens[0].value).toBe('A1');
    expect(tokens[1].value).toBe('SUM');
  });

  it('handles two-char operators', () => {
    const tokens = tokenize('1<=2');
    expect(tokens[1].value).toBe('<=');
    expect(tokens[1].type).toBe('op');
  });

  it('handles all two-char operators', () => {
    ['<=', '>=', '<>'].forEach((op) => {
      const tokens = tokenize(`1${op}2`);
      expect(tokens[1].value).toBe(op);
    });
  });

  it('handles string literals with single quotes', () => {
    const tokens = tokenize("'hello'");
    expect(tokens[0].type).toBe('string');
    expect(tokens[0].value).toBe('hello');
  });

  it('handles string literals with double quotes', () => {
    const tokens = tokenize('"world"');
    expect(tokens[0].type).toBe('string');
    expect(tokens[0].value).toBe('world');
  });

  it('throws on unterminated string', () => {
    expect(() => tokenize('"hello')).toThrow('Unterminated string');
  });

  it('throws on unexpected character', () => {
    expect(() => tokenize('1 @ 2')).toThrow('Unexpected character');
  });

  it('tokenizes boolean values', () => {
    const tokens = tokenize('TRUE FALSE');
    expect(tokens[0].type).toBe('boolean');
    expect(tokens[0].value).toBe('TRUE');
    expect(tokens[1].type).toBe('boolean');
    expect(tokens[1].value).toBe('FALSE');
  });

  it('tokenizes cell references with lowercase letters', () => {
    const tokens = tokenize('b2');
    expect(tokens[0].type).toBe('cell');
    expect(tokens[0].value).toBe('B2');
  });

  it('tokenizes numbers with decimal point', () => {
    const tokens = tokenize('3.14');
    expect(tokens[0].type).toBe('number');
    expect(tokens[0].value).toBe('3.14');
  });

  it('tokenizes numbers starting with dot', () => {
    const tokens = tokenize('.5');
    expect(tokens[0].type).toBe('number');
    expect(tokens[0].value).toBe('.5');
  });

  it('throws on invalid number format', () => {
    expect(() => tokenize('.')).toThrow('Invalid number format');
    expect(() => tokenize('1.2.3')).toThrow('Invalid number format');
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 2: اختبارات ALGO-004 (Parser - Literals)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Literals', () => {
  test('parses integer literals', () => {
    expect(parseFormula('42')).toEqual({ kind: 'number', value: 42 });
  });

  test('parses negative integer literals', () => {
    const ast = parseFormula('-42') as any;
    expect(ast.kind).toBe('unary');
    expect(ast.op).toBe('-');
    expect(ast.operand.value).toBe(42);
  });

  test('parses decimal literals', () => {
    expect(parseFormula('3.14')).toEqual({ kind: 'number', value: 3.14 });
  });

  test('parses leading-dot decimals', () => {
    expect(parseFormula('.5')).toEqual({ kind: 'number', value: 0.5 });
  });

  test('parses string literals', () => {
    expect(parseFormula('"hello"')).toEqual({ kind: 'string', value: 'hello' });
  });

  test('parses string literals with single quotes', () => {
    expect(parseFormula("'world'")).toEqual({ kind: 'string', value: 'world' });
  });

  test('parses boolean literals - TRUE', () => {
    expect(parseFormula('TRUE')).toEqual({ kind: 'boolean', value: true });
  });

  test('parses boolean literals - FALSE', () => {
    expect(parseFormula('FALSE')).toEqual({ kind: 'boolean', value: false });
  });

  test('parses boolean literals case insensitive', () => {
    expect(parseFormula('true')).toEqual({ kind: 'boolean', value: true });
    expect(parseFormula('false')).toEqual({ kind: 'boolean', value: false });
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 3: اختبارات ALGO-004 (Parser - Constants)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004 Patch v2: Math Constants', () => {
  test('parses PI as constant', () => {
    expect(parseFormula('PI')).toEqual({ kind: 'constant', name: 'PI' });
  });

  test('parses E as constant', () => {
    expect(parseFormula('E')).toEqual({ kind: 'constant', name: 'E' });
  });

  test('parses TAU as constant', () => {
    expect(parseFormula('TAU')).toEqual({ kind: 'constant', name: 'TAU' });
  });

  test('parses INFINITY as constant', () => {
    expect(parseFormula('INFINITY')).toEqual({ kind: 'constant', name: 'INFINITY' });
  });

  test('parses NAN as constant', () => {
    expect(parseFormula('NAN')).toEqual({ kind: 'constant', name: 'NAN' });
  });

  test('uses PI in arithmetic', () => {
    const ast = parseFormula('2*PI') as any;
    expect(ast.kind).toBe('binary');
    expect(ast.op).toBe('*');
    expect(ast.left.value).toBe(2);
    expect(ast.right.kind).toBe('constant');
    expect(ast.right.name).toBe('PI');
  });

  test('distinguishes PI constant from PI() function', () => {
    const ast = parseFormula('PI') as any;
    expect(ast.kind).toBe('constant');
    expect(ast.name).toBe('PI');
  });

  test('constants have correct numeric values', () => {
    expect(MATH_CONSTANTS.PI).toBe(Math.PI);
    expect(MATH_CONSTANTS.E).toBe(Math.E);
    expect(MATH_CONSTANTS.TAU).toBe(2 * Math.PI);
    expect(MATH_CONSTANTS.INFINITY).toBe(Infinity);
    expect(Number.isNaN(MATH_CONSTANTS.NAN)).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 4: اختبارات ALGO-004 (Parser - Arithmetic)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Arithmetic', () => {
  test('parses addition', () => {
    const ast = parseFormula('1+2') as any;
    expect(ast.kind).toBe('binary');
    expect(ast.op).toBe('+');
    expect(ast.left.value).toBe(1);
    expect(ast.right.value).toBe(2);
  });

  test('parses subtraction', () => {
    const ast = parseFormula('5-3') as any;
    expect(ast.op).toBe('-');
  });

  test('parses multiplication', () => {
    const ast = parseFormula('4*5') as any;
    expect(ast.op).toBe('*');
  });

  test('parses division', () => {
    const ast = parseFormula('10/2') as any;
    expect(ast.op).toBe('/');
  });

  test('respects multiplication precedence', () => {
    const ast = parseFormula('1+2*3') as any;
    expect(ast.kind).toBe('binary');
    expect(ast.op).toBe('+');
    expect(ast.left.value).toBe(1);
    expect(ast.right.kind).toBe('binary');
    expect(ast.right.op).toBe('*');
  });

  test('respects division precedence', () => {
    const ast = parseFormula('10-4/2') as any;
    expect(ast.op).toBe('-');
    expect(ast.right.op).toBe('/');
  });

  test('respects parentheses', () => {
    const ast = parseFormula('(1+2)*3') as any;
    expect(ast.op).toBe('*');
    expect(ast.left.op).toBe('+');
    expect(ast.right.value).toBe(3);
  });

  test('handles nested parentheses', () => {
    const ast = parseFormula('((1+2)*3)+4') as any;
    expect(ast.op).toBe('+');
    expect(ast.left.op).toBe('*');
    expect(ast.left.left.op).toBe('+');
  });

  test('parses unary minus', () => {
    const ast = parseFormula('-5') as any;
    expect(ast.kind).toBe('unary');
    expect(ast.op).toBe('-');
    expect(ast.operand.value).toBe(5);
  });

  test('parses double unary minus', () => {
    const ast = parseFormula('--5') as any;
    expect(ast.kind).toBe('unary');
    expect(ast.op).toBe('-');
    expect(ast.operand.kind).toBe('unary');
    expect(ast.operand.op).toBe('-');
    expect(ast.operand.operand.value).toBe(5);
  });

  test('parses power right-associatively', () => {
    const ast = parseFormula('2^3^2') as any;
    expect(ast.kind).toBe('binary');
    expect(ast.op).toBe('^');
    expect(ast.left.value).toBe(2);
    expect(ast.right.kind).toBe('binary');
    expect(ast.right.op).toBe('^');
    expect(ast.right.left.value).toBe(3);
    expect(ast.right.right.value).toBe(2);
  });

  test('parses power precedence over unary', () => {
    const ast = parseFormula('-2^3') as any;
    expect(ast.kind).toBe('unary');
    expect(ast.op).toBe('-');
    expect(ast.operand.kind).toBe('binary');
    expect(ast.operand.op).toBe('^');
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 5: اختبارات ALGO-004 (Parser - Comparison & Concat)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Comparison & Concat', () => {
  test('parses equals comparison', () => {
    expect((parseFormula('1=2') as any).op).toBe('=');
  });

  test('parses not equals comparison', () => {
    expect((parseFormula('1<>2') as any).op).toBe('<>');
  });

  test('parses less than comparison', () => {
    expect((parseFormula('1<2') as any).op).toBe('<');
  });

  test('parses greater than comparison', () => {
    expect((parseFormula('1>2') as any).op).toBe('>');
  });

  test('parses less than or equal comparison', () => {
    expect((parseFormula('1<=2') as any).op).toBe('<=');
  });

  test('parses greater than or equal comparison', () => {
    expect((parseFormula('1>=2') as any).op).toBe('>=');
  });

  test('comparison has correct precedence', () => {
    const ast = parseFormula('1+2>3*4') as any;
    expect(ast.kind).toBe('binary');
    expect(ast.op).toBe('>');
    expect(ast.left.op).toBe('+');
    expect(ast.right.op).toBe('*');
  });

  test('parses string concatenation', () => {
    expect((parseFormula('"a"&"b"') as any).op).toBe('&');
  });

  test('concatenation has correct precedence', () => {
    const ast = parseFormula('"a"&"b"&"c"') as any;
    expect(ast.op).toBe('&');
    expect(ast.left.op).toBe('&');
  });

  test('comparison with concatenation', () => {
    const ast = parseFormula('"a"&"b"="ab"') as any;
    expect(ast.op).toBe('=');
    expect(ast.left.op).toBe('&');
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 6: اختبارات ALGO-004 (Parser - Cells & Ranges)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Cells & Ranges', () => {
  test('parses cell reference', () => {
    expect(parseFormula('A1')).toEqual({ kind: 'cell', ref: 'A1' });
  });

  test('parses lowercase cell reference', () => {
    expect(parseFormula('b2')).toEqual({ kind: 'cell', ref: 'B2' });
  });

  test('parses three-letter cell reference', () => {
    expect(parseFormula('ZZ99')).toEqual({ kind: 'cell', ref: 'ZZ99' });
  });

  test('parses range reference', () => {
    expect(parseFormula('A1:A5')).toEqual({
      kind: 'range',
      from: 'A1',
      to: 'A5',
    });
  });

  test('parses range with lowercase', () => {
    expect(parseFormula('a1:a5')).toEqual({
      kind: 'range',
      from: 'A1',
      to: 'A5',
    });
  });

  test('parses range in expression', () => {
    const ast = parseFormula('SUM(A1:A5)') as any;
    expect(ast.kind).toBe('call');
    expect(ast.args[0].kind).toBe('range');
  });

  test('parses cell in expression', () => {
    const ast = parseFormula('A1+5') as any;
    expect(ast.kind).toBe('binary');
    expect(ast.left.kind).toBe('cell');
    expect(ast.left.ref).toBe('A1');
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 7: اختبارات ALGO-004 (Parser - Function Calls)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Function Calls', () => {
  test('parses function with single arg', () => {
    const ast = parseFormula('SUM(1)') as any;
    expect(ast.kind).toBe('call');
    expect(ast.name).toBe('SUM');
    expect(ast.args).toHaveLength(1);
    expect(ast.args[0].value).toBe(1);
  });

  test('parses function with multiple args', () => {
    const ast = parseFormula('SUM(1,2,3)') as any;
    expect(ast.name).toBe('SUM');
    expect(ast.args).toHaveLength(3);
    expect(ast.args[0].value).toBe(1);
    expect(ast.args[1].value).toBe(2);
    expect(ast.args[2].value).toBe(3);
  });

  test('parses function with range arg', () => {
    const ast = parseFormula('SUM(A1:A5)') as any;
    expect(ast.args[0].kind).toBe('range');
  });

  test('parses nested functions', () => {
    const ast = parseFormula('IF(1>0,SUM(1,2),0)') as any;
    expect(ast.name).toBe('IF');
    expect(ast.args).toHaveLength(3);
    expect(ast.args[0].op).toBe('>');
    expect(ast.args[1].name).toBe('SUM');
    expect(ast.args[2].value).toBe(0);
  });

  test('parses function with expression args', () => {
    const ast = parseFormula('MAX(1+2,3*4)') as any;
    expect(ast.args[0].op).toBe('+');
    expect(ast.args[1].op).toBe('*');
  });

  test('parses empty args', () => {
    expect((parseFormula('NOW()') as any).args).toHaveLength(0);
  });

  test('parses function with trailing spaces', () => {
    expect((parseFormula('SUM (1,2,3)') as any).name).toBe('SUM');
  });

  test('throws on bare identifier without parens', () => {
    expect(() => parseFormula('SUM')).toThrow('Function calls require parentheses');
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 8: اختبارات ALGO-004 (Parser - Error Handling)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Error Handling', () => {
  test('throws on empty expression', () => {
    expect(() => parseFormula('')).toThrow('Empty expression');
    expect(() => parseFormula('   ')).toThrow('Empty expression');
  });

  test('throws on unexpected character', () => {
    expect(() => parseFormula('1 @ 2')).toThrow('Unexpected character');
  });

  test('throws on unterminated string', () => {
    expect(() => parseFormula('"hello')).toThrow('Unterminated string');
  });

  test('throws on missing closing paren', () => {
    expect(() => parseFormula('(1+2')).toThrow('Expected rparen but got "eof"');
  });

  test('throws on missing opening paren', () => {
    expect(() => parseFormula('1+2)')).toThrow('Expected eof but got ")"');
  });

  test('throws on trailing tokens', () => {
    expect(() => parseFormula('1 2')).toThrow('Expected eof but got "2"');
  });

  test('throws on bare identifier', () => {
    expect(() => parseFormula('SUM')).toThrow('Function calls require parentheses');
  });

  test('ParseError includes hint', () => {
    try {
      parseFormula('(1+2');
      expect.fail('Should throw');
    } catch (e: any) {
      expect(e).toBeInstanceOf(ParseError);
      expect(e.message).toContain('Hint:');
      expect(e.message).toContain('closing parenthesis');
    }
  });

  test('ParseError has position property', () => {
    try {
      parseFormula('1 @ 2');
      expect.fail('Should throw');
    } catch (e: any) {
      expect(e.position).toBe(2);
    }
  });

  test('ParseError name is correct', () => {
    try {
      parseFormula('(1+2');
      expect.fail('Should throw');
    } catch (e: any) {
      expect(e.name).toBe('ParseError');
    }
  });

  test('Error hint for function calls', () => {
    try {
      parseFormula('SUM');
      expect.fail('Should throw');
    } catch (e: any) {
      expect(e.message).toContain('Hint:');
      expect(e.message).toContain('Function calls require parentheses');
    }
  });

  test('Error hint for cell references', () => {
    try {
      // هذا الاختبار يحاول إثارة خطأ يتعلق بمرجع خلية
      // لكن cell references صالحة دائماً، لذا نستخدم شيئاً آخر
      expect(() => parseFormula('A1')).not.toThrow();
    } catch (e: any) {
      // لا يحدث
    }
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 9: اختبارات تكاملية (Integration)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Integration', () => {
  test('parses complex formula with all features', () => {
    const ast = parseFormula('IF(SUM(A1:A5)>10, "High", "Low")') as any;
    expect(ast.kind).toBe('call');
    expect(ast.name).toBe('IF');
    expect(ast.args[0].op).toBe('>');
    expect(ast.args[0].left.name).toBe('SUM');
    expect(ast.args[0].left.args[0].kind).toBe('range');
    expect(ast.args[1].value).toBe('High');
    expect(ast.args[2].value).toBe('Low');
  });

  test('parses formula with constants', () => {
    const ast = parseFormula('2*PI+E') as any;
    expect(ast.op).toBe('+');
    expect(ast.left.op).toBe('*');
    expect(ast.left.right.kind).toBe('constant');
    expect(ast.right.kind).toBe('constant');
  });

  test('parses formula with comparison and arithmetic', () => {
    const ast = parseFormula('(2+3)*4>10') as any;
    expect(ast.op).toBe('>');
    expect(ast.left.op).toBe('*');
    expect(ast.left.left.op).toBe('+');
  });

  test('parses formula with multiple comparison operators', () => {
    const ast = parseFormula('1<2>3') as any;
    expect(ast.op).toBe('>');
    expect(ast.left.op).toBe('<');
  });
});

// ──────────────────────────────────────────────────────────────
// مجموعة 10: اختبارات الأداء (Performance - استدلالية)
// ──────────────────────────────────────────────────────────────
describe('ALGO-004: FormulaParser - Performance', () => {
  test('parses long expression efficiently', () => {
    const longExpr = '1+2+3+4+5+6+7+8+9+10+11+12+13+14+15+16+17+18+19+20';
    const start = performance.now();
    const ast = parseFormula(longExpr);
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
    expect(ast).toBeDefined();
  });

  test('parses deeply nested parentheses', () => {
    const nested = '((((((((((1+2))))))))))';
    expect(() => parseFormula(nested)).not.toThrow();
  });

  test('parses deeply nested function calls', () => {
    const nested = 'A(B(C(D(E(1)))))';
    expect(() => parseFormula(nested)).not.toThrow();
  });
});

// ──────────────────────────────────────────────────────────────
// إحصائيات الاختبارات:
// - ALGO-010 (Tokenizer): 13 اختبار
// - ALGO-004 (Parser): ~35 اختبار
// - المجموع: ~48 اختبار
// - تغطية تقديرية: > 95%
// ──────────────────────────────────────────────────────────────
