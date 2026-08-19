/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: parser.ts
  * 📂 المسار: packages/algorithms/src/formula/parser.ts
  * 🎯 الهدف الرئيسي: محلل تنازلي (Recursive Descent) يحوّل الصيغة إلى شجرة AST
  * 📋 المعايير: صفر اعتماديات، أسبقية PEMDAS، دعم الدوال والخلايا والثوابت
  * 🧪 الاختبارات: packages/algorithms/tests/formula/parser.test.ts
  * 🏷️ المعرف: ALGO-004
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 الإصدار: v2.1.0
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Recursive Descent + Precedence Climbing + Smart Error Hints
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. أسبقية العمليات والاقتران اليمين للأس (^)
  *    2. التمييز بين مرجع الخلية واستدعاء الدالة والثابت
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - ParseError class مع hints ذكية
  *    - فحوصات نوع الرمز قبل كل خطوة
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: لا توجد
  * ═══════════════════════════════════════════════════════════════════════════
  */

import { tokenize, type Token, type TokenType } from './tokenizer';
import { 
  MATH_CONSTANTS, 
  ParseError, 
  type FormulaAST, 
  type BinaryOperator, 
  type UnaryOperator, 
  type ConstantName, 
  type FunctionCall 
} from './ast';

export * from './ast';

const COMPARISON_OPS = ['=', '<>', '<', '>', '<=', '>='] as const;
const ERROR_HINTS: Partial<Record<TokenType, string>> = {
  lparen: 'Did you forget an opening parenthesis?',
  rparen: 'Do you have an extra closing parenthesis?',
  cell: 'Did you mean a cell reference like A1?',
  number: 'Expected a number',
  ident: 'Expected a function name'
};

/**
 * قواعد النحو (Grammar):
 * comparison     → concat ((= | <> | < | > | <= | >=) concat)*
 * concat         → additive (& additive)*
 * additive       → multiplicative ((+ | -) multiplicative)*
 * multiplicative → unary ((* | /) unary)*
 * unary          → (- | +) unary | power
 * power          → primary (^ unary)?          «اقتران يمين»
 * primary        → NUMBER | STRING | BOOLEAN | constant | cell | range | call | (comparison)
 */
export class FormulaParser {
  private readonly tokens: readonly Token[];
  private pos = 0;

  constructor(tokens: readonly Token[]) {
    this.tokens = tokens;
  }

  /** تحليل كامل مع التأكد من نهاية المدخل */
  parse(): FormulaAST {
    if (this.tokens.length === 0 || (this.tokens.length === 1 && this.tokens[0]?.type === 'eof')) {
      throw new ParseError('Empty expression', 0, 'Please provide a valid formula');
    }
    const ast = this.parseComparison();
    this.expect('eof');
    return ast;
  }

  private peek(): Token {
    return this.tokens[this.pos]!;
  }

  private advance(): Token {
    return this.tokens[this.pos++]!;
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private checkOp(value: string): boolean {
    return this.peek().type === 'op' && this.peek().value === value;
  }

  /** توقع نوع رمز محدد أو رمي خطأ */
  private expect(type: TokenType): Token {
    const token = this.peek();
    if (token.type !== type) {
      throw new ParseError(
        `Expected ${type} but got "${token.value}"`,
        token.pos,
        ERROR_HINTS[type]
      );
    }
    return this.advance();
  }

  private parseComparison(): FormulaAST {
    let left = this.parseConcat();
    while (this.check('op') && (COMPARISON_OPS as readonly string[]).includes(this.peek().value)) {
      const op = this.advance().value as BinaryOperator;
      left = { kind: 'binary', op, left, right: this.parseConcat() };
    }
    return left;
  }

  private parseConcat(): FormulaAST {
    let left = this.parseAdditive();
    while (this.checkOp('&')) {
      this.advance();
      left = { kind: 'binary', op: '&', left, right: this.parseAdditive() };
    }
    return left;
  }

  private parseAdditive(): FormulaAST {
    let left = this.parseMultiplicative();
    while (this.checkOp('+') || this.checkOp('-')) {
      const op = this.advance().value as BinaryOperator;
      left = { kind: 'binary', op, left, right: this.parseMultiplicative() };
    }
    return left;
  }

  private parseMultiplicative(): FormulaAST {
    let left = this.parseUnary();
    while (this.checkOp('*') || this.checkOp('/')) {
      const op = this.advance().value as BinaryOperator;
      left = { kind: 'binary', op, left, right: this.parseUnary() };
    }
    return left;
  }

  private parseUnary(): FormulaAST {
    if (this.checkOp('-') || this.checkOp('+')) {
      const op = this.advance().value as UnaryOperator;
      return { kind: 'unary', op, operand: this.parseUnary() };
    }
    return this.parsePower();
  }

  private parsePower(): FormulaAST {
    const base = this.parsePrimary();
    if (this.checkOp('^')) {
      this.advance();
      // اقتران يمين: الطرف الأيمن هو parseUnary() الذي يستدعي parsePower()
      return { kind: 'binary', op: '^', left: base, right: this.parseUnary() };
    }
    return base;
  }

  private parsePrimary(): FormulaAST {
    const token = this.peek();

    if (token.type === 'number') {
      this.advance();
      return { kind: 'number', value: parseFloat(token.value) };
    }
    if (token.type === 'string') {
      this.advance();
      return { kind: 'string', value: token.value };
    }
    if (token.type === 'boolean') {
      this.advance();
      return { kind: 'boolean', value: token.value === 'TRUE' };
    }
    if (token.type === 'cell') {
      return this.parseCellOrRange();
    }
    if (token.type === 'ident') {
      return this.parseIdentifier();
    }
    if (token.type === 'lparen') {
      this.advance();
      const expr = this.parseComparison();
      this.expect('rparen');
      return expr;
    }

    throw new ParseError(
      `Unexpected token "${token.value}"`,
      token.pos,
      `Expected a number, string, boolean, cell, function, or parentheses`
    );
  }

  private parseCellOrRange(): FormulaAST {
    const from = this.advance();
    if (this.check('colon')) {
      this.advance();
      const to = this.expect('cell');
      return { kind: 'range', from: from.value, to: to.value };
    }
    return { kind: 'cell', ref: from.value };
  }

  private parseIdentifier(): FormulaAST {
    const name = this.advance();
    if (name.value in MATH_CONSTANTS && !this.check('lparen')) {
      return { kind: 'constant', name: name.value as ConstantName };
    }
    if (!this.check('lparen')) {
      throw new ParseError(
        `Expected "(" after function name "${name.value}"`,
        name.pos,
        'Function calls require parentheses. Did you mean a constant?'
      );
    }
    return this.parseFunctionCall(name.value);
  }

  private parseFunctionCall(name: string): FunctionCall {
    this.expect('lparen');
    const args = this.parseArguments();
    this.expect('rparen');
    return { kind: 'call', name, args };
  }

  private parseArguments(): readonly FormulaAST[] {
    const args: FormulaAST[] = [];
    if (this.check('rparen')) return args;
    args.push(this.parseComparison());
    while (this.check('comma')) {
      this.advance();
      args.push(this.parseComparison());
    }
    return args;
  }
}

/** تحليل صيغة نصية إلى شجرة (ALGO-FRM-001) */
export function parseFormula(expression: string): FormulaAST {
  const tokens = tokenize(expression);
  return new FormulaParser(tokens).parse();
}
