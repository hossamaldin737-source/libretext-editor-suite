/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: ast.ts
 * 📂 المسار: packages/algorithms/src/formula/ast.ts
 * 🎯 الهدف الرئيسي: تعريف شجرة الصيغة المجردة (AST) والثوابت الرياضية
 * 📋 المعايير: صفر اعتماديات
 * 🧪 الاختبارات: packages/algorithms/tests/formula/parser.test.ts
 * 🏷️ المعرف: ALGO-011
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 الإصدار: v1.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Discriminated Union for Formula AST
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دعم جميع أنواع العقد في المقيّم (Evaluator)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Readonly properties for immutability
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const MATH_CONSTANTS = {
  PI: Math.PI,
  E: Math.E,
  TAU: 2 * Math.PI,
  INFINITY: Infinity,
  NAN: NaN,
} as const;

export type ConstantName = keyof typeof MATH_CONSTANTS;
export type BinaryOperator =
  '+' | '-' | '*' | '/' | '^' | '&' | '=' | '<>' | '<' | '>' | '<=' | '>=';
export type UnaryOperator = '-' | '+';

export interface NumberLiteral {
  readonly kind: 'number';
  readonly value: number;
}
export interface StringLiteral {
  readonly kind: 'string';
  readonly value: string;
}
export interface BooleanLiteral {
  readonly kind: 'boolean';
  readonly value: boolean;
}
export interface ConstantLiteral {
  readonly kind: 'constant';
  readonly name: ConstantName;
}
export interface CellReference {
  readonly kind: 'cell';
  readonly ref: string;
}
export interface RangeReference {
  readonly kind: 'range';
  readonly from: string;
  readonly to: string;
}
export interface BinaryExpression {
  readonly kind: 'binary';
  readonly op: BinaryOperator;
  readonly left: FormulaAST;
  readonly right: FormulaAST;
}
export interface UnaryExpression {
  readonly kind: 'unary';
  readonly op: UnaryOperator;
  readonly operand: FormulaAST;
}
export interface FunctionCall {
  readonly kind: 'call';
  readonly name: string;
  readonly args: readonly FormulaAST[];
}

export type FormulaAST =
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | ConstantLiteral
  | CellReference
  | RangeReference
  | BinaryExpression
  | UnaryExpression
  | FunctionCall;

export class ParseError extends Error {
  constructor(
    message: string,
    public readonly position: number,
    public readonly hint?: string,
  ) {
    super(hint ? `${message} (Hint: ${hint})` : message);
    this.name = 'ParseError';
  }
}
