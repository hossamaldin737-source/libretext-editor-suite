/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: evaluator.ts
  * 📂 المسار: packages/algorithms/src/formula/evaluator.ts
  * 🎯 الهدف الرئيسي: تقييم شجرة AST للصيغ مع دعم Lazy Evaluation لـ IF
  * 📋 المعايير: صفر اعتماديات، Lazy IF، merged context، برمجة دفاعية (<250 سطر)
  * 🧪 الاختبارات: packages/algorithms/tests/formula/evaluator.test.ts
  * 🏷️ المعرف: ALGO-005
  * 📅 تاريخ الإنشاء: 2026-08-19
  * 🔄 آخر تحديث: 2026-08-19 (v3: Lazy IF + Merged Context)
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Visitor Pattern + Lazy Evaluation + Context Merging
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. IF() يجب أن تكون Lazy لتجنب تقييم الفروع غير المطلوبة
  *    2. القسمة على صفر
  *    3. المراجع الدائرية للخلايا (Circular References)
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * ═══════════════════════════════════════════════════════════════════════════
  */

import type {
  FormulaAST,
  BinaryOperator,
  UnaryOperator,
  ConstantName
} from './ast';
import { MATH_CONSTANTS } from './ast';
import {
  excelEquals,
  compare,
  expandCellRange
} from './cell-utils';
import { getDefaultFunctionRegistry } from './registry';
import {
  EvaluationContext,
  EvaluationResult,
  EvaluationError
} from './evaluator-types';

export * from './evaluator-types';

const DEFAULT_MAX_DEPTH = 100;

/**
 * مُقيّم التعابير - يحول AST إلى قيم مع Lazy Evaluation لـ IF
 */
export class FormulaEvaluator {
  private readonly context: EvaluationContext;
  private readonly maxDepth: number;
  private depth = 0;

  constructor(context: EvaluationContext = {}) {
    this.context = context;
    this.maxDepth = context.maxDepth ?? DEFAULT_MAX_DEPTH;
  }

  /** تقييم شجرة AST */
  evaluate(ast: FormulaAST): EvaluationResult {
    if (this.depth >= this.maxDepth) {
      throw new EvaluationError(
        `Maximum evaluation depth (${this.maxDepth}) exceeded. Possible circular reference.`
      );
    }
    this.depth++;
    try {
      return this.visitNode(ast);
    } finally {
      this.depth--;
    }
  }

  private visitNode(node: FormulaAST): EvaluationResult {
    switch (node.kind) {
      case 'number':
      case 'string':
      case 'boolean':
        return node.value;
      case 'constant':
        return this.visitConstant(node.name);
      case 'cell':
        return this.visitCell(node.ref);
      case 'range':
        const values = this.visitRange(node.from, node.to);
        return values.length > 0 ? (values[0] ?? null) : null;
      case 'unary':
        return this.visitUnary(node.op, node.operand);
      case 'binary':
        return this.visitBinary(node.op, node.left, node.right);
      case 'call':
        return this.visitCall(node.name, node.args);
      default:
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        throw new EvaluationError(`Unknown AST node kind: ${(node as any).kind}`);
    }
  }

  private visitConstant(name: ConstantName): number {
    const value = MATH_CONSTANTS[name];
    if (value === undefined) {
      throw new EvaluationError(`Unknown constant: ${name}`);
    }
    return value;
  }

  private visitCell(ref: string): EvaluationResult {
    if (!this.context.getCellValue) {
      throw new EvaluationError(
        `Cell reference "${ref}" used but no getCellValue function provided`
      );
    }
    const value = this.context.getCellValue(ref);
    return value === undefined ? null : (value as EvaluationResult);
  }

  private visitRange(from: string, to: string): EvaluationResult[] {
    try {
      const refs = expandCellRange(from, to);
      return refs.map((ref) => {
        try {
          return this.visitCell(ref);
        } catch {
          return null;
        }
      });
    } catch {
      throw new EvaluationError(`Invalid range: ${from}:${to}`);
    }
  }

  private visitUnary(op: UnaryOperator, operand: FormulaAST): EvaluationResult {
    const value = this.evaluate(operand);
    const num = this.coerceToNumber(value);
    return op === '-' ? -num : num;
  }

  private visitBinary(
    op: BinaryOperator,
    left: FormulaAST,
    right: FormulaAST
  ): EvaluationResult {
    const l = this.evaluate(left);
    const r = this.evaluate(right);

    switch (op) {
      case '+': return this.coerceToNumber(l) + this.coerceToNumber(r);
      case '-': return this.coerceToNumber(l) - this.coerceToNumber(r);
      case '*': return this.coerceToNumber(l) * this.coerceToNumber(r);
      case '/': {
        const d = this.coerceToNumber(r);
        if (d === 0) throw new EvaluationError('Division by zero');
        return this.coerceToNumber(l) / d;
      }
      case '^': return Math.pow(this.coerceToNumber(l), this.coerceToNumber(r));
      case '&': return this.coerceToString(l) + this.coerceToString(r);
      case '=': return excelEquals(l, r);
      case '<>': return !excelEquals(l, r);
      case '<': return compare(l, r) < 0;
      case '>': return compare(l, r) > 0;
      case '<=': return compare(l, r) <= 0;
      case '>=': return compare(l, r) >= 0;
      default: throw new EvaluationError(`Unknown binary operator: ${op}`);
    }
  }

  private visitCall(name: string, args: readonly FormulaAST[]): EvaluationResult {
    // Lazy Evaluation لـ IF: لا نقيم الفروع غير المناسبة
    const upper = name.toUpperCase().trim();
    if (upper === 'IF' || upper === 'شرط' || upper === 'إذا' || upper === 'اذا') {
      return this.visitLazyIF(args);
    }

    const getFn = this.context.getFunction ?? ((fnName: string) => getDefaultFunctionRegistry().get(fnName));
    const fn = getFn(name);
    if (!fn) {
      throw new EvaluationError(`Unknown function: ${name}`);
    }

    const evaluatedArgs = args.map((arg) => {
      if (arg.kind === 'range') return this.visitRange(arg.from, arg.to);
      return this.evaluate(arg);
    });

    try {
      return fn(...evaluatedArgs) as EvaluationResult;
    } catch (err) {
      throw new EvaluationError(`Error in function "${name}": ${(err as Error).message}`, err);
    }
  }

  /** Lazy Evaluation لـ IF: تقييم الشرط فقط، ثم الفرع المطلوب */
  private visitLazyIF(args: readonly FormulaAST[]): EvaluationResult {
    if (args.length !== 3) {
      throw new EvaluationError('IF requires exactly 3 arguments');
    }
    const condition = this.evaluate(args[0]!);
    const branchArg = Boolean(condition) ? args[1] : args[2];
    if (!branchArg) return null;
    if (branchArg.kind === 'range' && 'from' in branchArg && 'to' in branchArg) {
      const values = this.visitRange(branchArg.from, branchArg.to);
      return values.length > 0 ? (values[0] ?? null) : null;
    }
    return this.evaluate(branchArg);
  }

  private coerceToNumber(value: EvaluationResult): number {
    if (value === null) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (isNaN(num)) throw new EvaluationError(`Cannot convert "${value}" to number`);
      return num;
    }
    if (typeof value === 'boolean') return value ? 1 : 0;
    throw new EvaluationError(`Cannot convert ${typeof value} to number`);
  }

  private coerceToString(value: EvaluationResult): string {
    if (value === null) return '';
    return String(value);
  }
}

/** تقييم صيغة مع سياق + دمج السجل الافتراضي (ALGO-FRM-002) */
export function evaluateFormula(
  ast: FormulaAST,
  context: EvaluationContext = {}
): EvaluationResult {
  const defaultRegistry = getDefaultFunctionRegistry();
  const mergedContext: EvaluationContext = {
    ...context,
    getFunction: (name: string) => {
      const customFn = context.getFunction?.(name);
      if (customFn !== undefined) return customFn;
      return defaultRegistry.get(name);
    }
  };
  return new FormulaEvaluator(mergedContext).evaluate(ast);
}
