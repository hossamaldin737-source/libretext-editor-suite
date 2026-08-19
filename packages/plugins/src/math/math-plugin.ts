/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: math-plugin.ts
 * 📂 المسار: packages/plugins/src/math/math-plugin.ts
 * 🎯 الهدف الرئيسي: إضافة Math لعرض المعادلات الرياضية.
 * 📋 المعايير:
 *    - يجب أن تدعم LaTeX Math.
 *    - يجب أن تدعم MathML.
 * 🧪 الاختبارات:
 *    - packages/plugins/tests/math-plugin.test.ts
 * 🏷️ المعرف: PLUG-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Math Equation Plugin — إضافة معادلات رياضية.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحقق من صحة صيغ LaTeX قبل المعالجة.
 *    2. التعامل مع المعادلات الطويلة بشكل صحيح.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المحتوى الفارغ قبل التحويل.
 *    - التعامل مع أنواع غير معروفة بأمان.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - KaTeX (https://katex.org/) — مكتبة عرض المعادلات.
 *    - MathJax (https://www.mathjax.org/) — مكتبة المعادلات الرياضية.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, CodeBlockNode, InlineNode, CodeNode} from '@libretext/core';
import type {Plugin, PluginResult} from '../shared/types';

const MATH_LANGUAGES = ['math', 'latex', 'mathml'] as const;
type MathType = (typeof MATH_LANGUAGES)[number];

/**
 * إضافة Math — لعرض المعادلات الرياضية.
 */
export class MathPlugin implements Plugin {
  readonly id = 'math';
  readonly name = 'Math Equations';
  readonly description = 'إضافة لعرض المعادلات الرياضية باستخدام LaTeX/MathML';
  readonly version = '1.0.0';

  private initialized = false;

  initialize(): void {
    this.initialized = true;
  }

  destroy(): void {
    this.initialized = false;
  }

  /**
   * التحقق من دعم نوع اللغة.
   */
  supports(type: string): boolean {
    return (MATH_LANGUAGES as readonly string[]).includes(type);
  }

  /**
   * معالجة كتلة كود رياضي.
   */
  processBlock(block: BlockNode): string {
    if (block.type !== 'code-block') {
      return '';
    }

    const codeBlock = block as CodeBlockNode;
    if (!this.supports(codeBlock.language)) {
      return '';
    }

    const result = this.processMath(codeBlock.code, codeBlock.language as MathType);
    return result.content;
  }

  /**
   * معالجة كود رياضي مضمن.
   */
  processInline(node: InlineNode): string {
    if (node.type !== 'code') {
      return '';
    }

    const codeNode = node as CodeNode;
    if (codeNode.code.startsWith('$') || codeNode.code.startsWith('\\(')) {
      const math = codeNode.code.replace(/^\$|^\(/, '').replace(/\)$|\$$/, '');
      const result = this.processMath(math, 'latex');
      return result.content;
    }

    return '';
  }

  /**
   * معالجة كود رياضي.
   */
  processMath(code: string, type: MathType = 'latex'): PluginResult {
    if (!this.initialized) {
      return {content: '', success: false, error: 'Plugin not initialized'};
    }

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      return {content: '', success: false, error: 'Empty code'};
    }

    const validationResult = this.validateMathCode(trimmedCode, type);
    if (!validationResult.success) {
      return validationResult;
    }

    const html = this.generateHtml(trimmedCode, type);
    return {content: html, success: true};
  }

  /**
   * التحقق من صحة كود رياضي.
   */
  private validateMathCode(code: string, type: MathType): PluginResult {
    const validationRules: Record<MathType, RegExp> = {
      math: /^[\s\S]*$/,
      latex: /^[a-zA-Z0-9\s\+\-\*\/\^\_\{\}\[\]\(\)\\=<>!&|;:,.]+$/,
      mathml: /^<math[\s\S]*<\/math>$/,
    };

    const rule = validationRules[type];
    if (rule && !rule.test(code)) {
      return {
        content: '',
        success: false,
        error: `Invalid ${type} syntax`,
      };
    }

    return {content: '', success: true};
  }

  /**
   * توليد HTML لعرض المعادلة.
   */
  private generateHtml(code: string, type: MathType): string {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    if (type === 'mathml') {
      return `<div class="math-equation" data-type="mathml">${escapedCode}</div>`;
    }

    return [
      `<div class="math-equation" data-type="${type}">`,
      `  <span class="math-inline">`,
      `    ${escapedCode}`,
      `  </span>`,
      `</div>`,
    ].join('\n');
  }

  /**
   * تحليل كود رياضي.
   */
  parseMathCode(code: string): {
    type: MathType;
    content: string;
    isBlock: boolean;
  } {
    const trimmedCode = code.trim();

    if (trimmedCode.startsWith('$$') && trimmedCode.endsWith('$$')) {
      return {
        type: 'latex',
        content: trimmedCode.slice(2, -2).trim(),
        isBlock: true,
      };
    }

    if (trimmedCode.startsWith('$') && trimmedCode.endsWith('$')) {
      return {
        type: 'latex',
        content: trimmedCode.slice(1, -1).trim(),
        isBlock: false,
      };
    }

    if (trimmedCode.startsWith('\\(') && trimmedCode.endsWith('\\)')) {
      return {
        type: 'latex',
        content: trimmedCode.slice(2, -2).trim(),
        isBlock: false,
      };
    }

    if (trimmedCode.startsWith('\\[') && trimmedCode.endsWith('\\]')) {
      return {
        type: 'latex',
        content: trimmedCode.slice(2, -2).trim(),
        isBlock: true,
      };
    }

    return {
      type: 'latex',
      content: trimmedCode,
      isBlock: false,
    };
  }
}
