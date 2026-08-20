/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: smart-guides.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/smart-guides.test.ts
 * 🎯 الهدف الرئيسي: اختبارات شاملة لمحرك خطوط الإرشاد الذكية ومؤشرات المسافات
 * 🏷️ المعرف: TEST-ALGO-032
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  generateReferenceLines,
  calculateDistanceBadges,
  filterDuplicateGuides,
  type ReferenceLine,
} from '../../src/spatial/smart-guides';
import type { SnappableElement } from '../../src/spatial/collision';

describe('Smart Guides Engine', () => {
  const staticElements: SnappableElement[] = [
    {
      id: 'elem-1',
      rect: { x: 100, y: 100, width: 100, height: 100 },
    },
    {
      id: 'elem-2',
      rect: { x: 300, y: 100, width: 100, height: 100 },
    },
  ];

  it('يولد خط إرشاد رأسي عند محاذاة الحافة اليسرى للعنصر', () => {
    const active = { x: 102, y: 250, width: 80, height: 80 };
    const lines = generateReferenceLines(active, staticElements, 5);

    expect(lines.length).toBeGreaterThan(0);
    const vLine = lines.find((l) => l.orientation === 'vertical' && l.position === 100);
    expect(vLine).toBeDefined();
  });

  it('يولد خط إرشاد أفقي عند محاذاة الحافة العلوية للعنصر', () => {
    const active = { x: 50, y: 99, width: 80, height: 80 };
    const lines = generateReferenceLines(active, staticElements, 5);

    const hLine = lines.find((l) => l.orientation === 'horizontal' && l.position === 100);
    expect(hLine).toBeDefined();
  });

  it('يحسب مؤشرات المسافات المتساوية والفجوات بدقة', () => {
    // elem1: 100..200 (width=100) -> gap1 = 50 -> active: 250..350 (width=100) -> gap2 = 50 -> elem3: 400..500
    const active = { x: 250, y: 100, width: 100, height: 100 };
    const targets: SnappableElement[] = [
      { id: 't1', rect: { x: 100, y: 100, width: 100, height: 100 } },
      { id: 't3', rect: { x: 400, y: 100, width: 100, height: 100 } },
    ];

    const badges = calculateDistanceBadges(active, targets, 2);
    expect(badges.length).toBeGreaterThanOrEqual(2);
    expect(badges[0].distance).toBe(50);
    expect(badges[0].orientation).toBe('horizontal');
  });

  it('يصفي خطوط الإرشاد المكررة على نفس الإحداثي', () => {
    const rawLines: ReferenceLine[] = [
      { id: '1', orientation: 'vertical', position: 100, start: 0, end: 200 },
      { id: '2', orientation: 'vertical', position: 100.2, start: 50, end: 300 },
      { id: '3', orientation: 'horizontal', position: 200, start: 0, end: 100 },
    ];

    const filtered = filterDuplicateGuides(rawLines);
    expect(filtered).toHaveLength(2);
  });
});
