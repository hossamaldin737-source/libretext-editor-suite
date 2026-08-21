/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: math-plugin.test.ts
 * 📂 المسار: packages/plugins/tests/math-plugin.test.ts
 * 🎯 الهدف الرئيسي: اختبار إضافة Math.
 * 🏷️ المعرف: TEST-PLUG-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MathPlugin } from '../src/math/math-plugin';
import type { CodeBlockNode, InlineNode, NodeId } from '@libretext/core';

const plugin = new MathPlugin();

beforeEach(() => {
  plugin.initialize();
});

describe('MathPlugin', () => {
  it('يقوم بتهيئة الإضافة', () => {
    expect(plugin.id).toBe('math');
    expect(plugin.name).toBe('Math Equations');
  });

  it('يقوم بتحقق من دعم اللغة', () => {
    expect(plugin.supports('math')).toBe(true);
    expect(plugin.supports('latex')).toBe(true);
    expect(plugin.supports('mathml')).toBe(true);
    expect(plugin.supports('javascript')).toBe(false);
  });

  it('يقوم بمعالجة معادلة LaTeX', () => {
    const block: CodeBlockNode = {
      type: 'code-block',
      id: 'c1' as NodeId,
      language: 'latex',
      code: 'E = mc^2',
    };
    const result = plugin.processBlock(block);
    expect(result).toContain('math-equation');
    expect(result).toContain('E = mc^2');
  });

  it('يقوم بمعالجة MathML', () => {
    const block: CodeBlockNode = {
      type: 'code-block',
      id: 'c1' as NodeId,
      language: 'mathml',
      code: '<math><mi>x</mi></math>',
    };
    const result = plugin.processBlock(block);
    expect(result).toContain('mathml');
  });

  it('يرجع خطأ عندما لا يكون مُهيأ', () => {
    plugin.destroy();
    const result = plugin.processMath('x^2', 'latex');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Plugin not initialized');
  });

  it('يرجع خطأ لمحتوى فارغ', () => {
    const result = plugin.processMath('', 'latex');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Empty code');
  });

  it('يقوم بتحليل كود LaTeX', () => {
    const result = plugin.parseMathCode('$x^2$');
    expect(result.type).toBe('latex');
    expect(result.content).toBe('x^2');
    expect(result.isBlock).toBe(false);
  });

  it('يقوم بتحليل كود LaTeX ككتلة', () => {
    const result = plugin.parseMathCode('$$x^2$$');
    expect(result.type).toBe('latex');
    expect(result.content).toBe('x^2');
    expect(result.isBlock).toBe(true);
  });

  it('يقوم بمعالجة عنصر مضمن', () => {
    const node: InlineNode = {
      type: 'code',
      id: 'c1' as NodeId,
      code: '$x^2$',
    };
    const result = plugin.processInline(node);
    expect(result).toContain('math-equation');
  });
});
