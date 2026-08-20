/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: vector-plugin.test.ts
 * 📂 المسار: packages/plugins/tests/vector-plugin.test.ts
 * 🎯 الهدف الرئيسي: اختبارات إضافة الرسم والمسارات المتجهة
 * 🏷️ المعرف: TEST-PLUG-003
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import { createVectorPlugin, renderVectorPathHtml } from '../src/vector';

describe('Vector Editor Plugin', () => {
  it('ينشئ إضافة المسارات المتجهة بالخصائص الصحيحة', () => {
    const plugin = createVectorPlugin();
    expect(plugin.id).toBe('plugin-vector-path');
    expect(plugin.version).toBe('1.0.0');
    expect(plugin.name).toContain('المسارات');
  });

  it('يسجل أوامر تحرير المتجهات في سياق المحرر', () => {
    const plugin = createVectorPlugin();
    const registeredCommands: any[] = [];

    const mockContext: any = {
      registerCommand: (cmd: any) => registeredCommands.push(cmd),
      getState: () => ({}),
      dispatch: () => {},
    };

    plugin.init(mockContext);
    expect(registeredCommands.length).toBeGreaterThan(0);
    expect(registeredCommands[0].id).toBe('vector:create-path');
  });

  it('يولد وسم SVG صالح للمسارات المتجهة', () => {
    const svg = renderVectorPathHtml('M 10 10 L 50 50 Z', 200, 200, '#0284c7');
    expect(svg).toContain('<svg');
    expect(svg).toContain('d="M 10 10 L 50 50 Z"');
    expect(svg).toContain('stroke="#0284c7"');
    expect(svg).toContain('</svg>');
  });
});
