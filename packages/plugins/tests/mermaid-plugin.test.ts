/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mermaid-plugin.test.ts
 * 📂 المسار: packages/plugins/tests/mermaid-plugin.test.ts
 * 🎯 الهدف الرئيسي: اختبار إضافة Mermaid.
 * 🏷️ المعرف: TEST-PLUG-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MermaidPlugin } from '../src/mermaid/mermaid-plugin';
import type { CodeBlockNode, NodeId } from '@libretext/core';

const plugin = new MermaidPlugin();

beforeEach(() => {
  plugin.initialize();
});

describe('MermaidPlugin', () => {
  it('يقوم بتهيئة الإضافة', () => {
    expect(plugin.id).toBe('mermaid');
    expect(plugin.name).toBe('Mermaid Diagrams');
  });

  it('يقوم بتحقق من دعم اللغة', () => {
    expect(plugin.supports('mermaid')).toBe(true);
    expect(plugin.supports('flowchart')).toBe(true);
    expect(plugin.supports('sequence')).toBe(true);
    expect(plugin.supports('gantt')).toBe(true);
    expect(plugin.supports('javascript')).toBe(false);
  });

  it('يقوم بمعالجة كود flowchart', () => {
    const block: CodeBlockNode = {
      type: 'code-block',
      id: 'c1' as NodeId,
      language: 'flowchart',
      code: 'flowchart TD\n  A[Start] --> B[End]',
    };
    const result = plugin.processBlock(block);
    expect(result).toContain('mermaid-diagram');
    expect(result).toContain('flowchart TD');
  });

  it('يقوم بمعالجة كود sequence', () => {
    const block: CodeBlockNode = {
      type: 'code-block',
      id: 'c1' as NodeId,
      language: 'sequence',
      code: 'sequenceDiagram\n  Alice->>Bob: Hello',
    };
    const result = plugin.processBlock(block);
    expect(result).toContain('sequenceDiagram');
  });

  it('يرجع خطأ عندما لا يكون مُهيأ', () => {
    plugin.destroy();
    const result = plugin.processMermaid('graph TD A-->B', 'mermaid');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Plugin not initialized');
  });

  it('يرجع خطأ لمحتوى فارغ', () => {
    const result = plugin.processMermaid('', 'mermaid');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Empty code');
  });

  it('يقوم بتحليل كود Mermaid', () => {
    const result = plugin.parseMermaidCode('flowchart TD\n  A-->B');
    expect(result.type).toBe('flowchart');
    expect(result.lines).toContain('  A-->B');
  });
});
