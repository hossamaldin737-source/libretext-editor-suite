/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mermaid-plugin.ts
 * 📂 المسار: packages/plugins/src/mermaid/mermaid-plugin.ts
 * 🎯 الهدف الرئيسي: إضافة Mermaid لعرض المخططات والرسوم البيانية.
 * 📋 المعايير:
 *    - يجب أن تدعم إنشاء مخططات تدفق (Flowcharts).
 *    - يجب أن تدعم إنشاء مخططات جدول (Gantt).
 *    - يجب أن تدعم إنشاء مخططات تسلسلية (Sequence).
 * 🧪 الاختبارات:
 *    - packages/plugins/tests/mermaid-plugin.test.ts
 * 🏷️ المعرف: PLUG-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Mermaid Diagram Plugin — إضافة مخططات Mermaid.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحقق من صحة كود Mermaid قبل المعالجة.
 *    2. التعامل مع أخطاء التحليل بأمان.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المحتوى الفارغ قبل التحويل.
 *    - التعامل مع أنواع غير معروفة بأمان.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - Mermaid (https://mermaid.js.org/) — مكتبة المخططات.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BlockNode, CodeBlockNode } from '@libretext/core';
import type { Plugin, PluginResult } from '../shared/types';

const SUPPORTED_LANGUAGES = [
  'mermaid',
  'flowchart',
  'sequence',
  'gantt',
  'class',
  'state',
  'er',
  'pie',
] as const;

type MermaidDiagramType = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * إضافة Mermaid — لعرض المخططات والرسوم البيانية.
 */
export class MermaidPlugin implements Plugin {
  readonly id = 'mermaid';
  readonly name = 'Mermaid Diagrams';
  readonly description = 'إضافة لعرض المخططات والرسوم البيانية باستخدام Mermaid';
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
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(type);
  }

  /**
   * معالجة كتلة كود Mermaid.
   */
  processBlock(block: BlockNode): string {
    if (block.type !== 'code-block') {
      return '';
    }

    const codeBlock = block as CodeBlockNode;
    if (!this.supports(codeBlock.language)) {
      return '';
    }

    const result = this.processMermaid(codeBlock.code, codeBlock.language as MermaidDiagramType);
    return result.content;
  }

  /**
   * معالجة كود Mermaid.
   */
  processMermaid(code: string, type: MermaidDiagramType = 'mermaid'): PluginResult {
    if (!this.initialized) {
      return { content: '', success: false, error: 'Plugin not initialized' };
    }

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      return { content: '', success: false, error: 'Empty code' };
    }

    const validationResult = this.validateMermaidCode(trimmedCode, type);
    if (!validationResult.success) {
      return validationResult;
    }

    const html = this.generateHtml(trimmedCode, type);
    return { content: html, success: true };
  }

  /**
   * التحقق من صحة كود Mermaid.
   */
  private validateMermaidCode(code: string, type: MermaidDiagramType): PluginResult {
    const validationRules: Record<MermaidDiagramType, RegExp> = {
      mermaid: /^[\s\S]*$/,
      flowchart: /^(graph|flowchart)\s+(TD|TB|BT|RL|LR)/,
      sequence: /^sequenceDiagram/,
      gantt: /^gantt/,
      class: /^classDiagram/,
      state: /^stateDiagram/,
      er: /^erDiagram/,
      pie: /^pie/,
    };

    const rule = validationRules[type];
    if (rule && !rule.test(code)) {
      return {
        content: '',
        success: false,
        error: `Invalid ${type} syntax`,
      };
    }

    return { content: '', success: true };
  }

  /**
   * توليد HTML لعرض Mermaid.
   */
  private generateHtml(code: string, type: MermaidDiagramType): string {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    return [
      `<div class="mermaid-diagram" data-type="${type}">`,
      `  <pre class="mermaid">`,
      `    ${escapedCode}`,
      `  </pre>`,
      `</div>`,
    ].join('\n');
  }

  /**
   * تحليل كود Mermaid إلى بنية بيانات.
   */
  parseMermaidCode(code: string): {
    type: MermaidDiagramType;
    content: string;
    lines: string[];
  } {
    const trimmedCode = code.trim();
    const lines = trimmedCode.split('\n');

    for (const lang of SUPPORTED_LANGUAGES) {
      const prefix = this.getPrefix(lang);
      if (prefix && (trimmedCode.startsWith(prefix) || trimmedCode.startsWith(lang))) {
        return {
          type: lang,
          content: trimmedCode,
          lines: lines.slice(1),
        };
      }
    }

    return {
      type: 'mermaid',
      content: trimmedCode,
      lines,
    };
  }

  private getPrefix(type: MermaidDiagramType): string {
    const prefixes: Record<MermaidDiagramType, string> = {
      mermaid: '',
      flowchart: 'flowchart',
      sequence: 'sequenceDiagram',
      gantt: 'gantt',
      class: 'classDiagram',
      state: 'stateDiagram',
      er: 'erDiagram',
      pie: 'pie',
    };
    return prefixes[type];
  }
}
