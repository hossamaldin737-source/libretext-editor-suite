/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: smart-guides.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/smart-guides.test.ts
 * 🎯 الهدف الرئيسي: اختبار محرك خطوط الإرشاد الذكية
 * 🏷️ المعرف: TEST-ALGO-SPATIAL-SMART
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {describe, it, expect} from 'vitest';
import {
  generateReferenceLines,
  calculateDistanceBadges,
  filterDuplicateGuides,
  type ReferenceLine,
} from '../../src/spatial/smart-guides';
import type {SnappableElement} from '../../src/spatial/collision';

const bounds = (x: number, y: number, w: number, h: number) => ({x, y, width: w, height: h});

describe('Smart Guides Engine', () => {
  const staticElements: SnappableElement[] = [
    {id: 'elem-1', bounds: bounds(100, 100, 100, 100)},
    {id: 'elem-2', bounds: bounds(300, 100, 100, 100)},
  ];

  it('يولد خط إرشاد رأسي عند محاذاة الحافة اليسرى للعنصر', () => {
    const active = bounds(102, 250, 80, 80);
    const lines = generateReferenceLines(active, staticElements, 5);

    expect(lines.length).toBeGreaterThan(0);
    const vLine = lines.find(l => l.orientation === 'vertical' && l.position === 100);
    expect(vLine).toBeDefined();
  });

  it('يولد خط إرشاد أفقي عند محاذاة الحافة العلوية للعنصر', () => {
    const active = bounds(50, 99, 80, 80);
    const lines = generateReferenceLines(active, staticElements, 5);

    const hLine = lines.find(l => l.orientation === 'horizontal' && l.position === 100);
    expect(hLine).toBeDefined();
  });

  it('يحسب مؤشرات المسافات المتساوية والفجوات بدقة', () => {
    const active = bounds(250, 100, 100, 100);
    const targets: SnappableElement[] = [
      {id: 't1', bounds: bounds(100, 100, 100, 100)},
      {id: 't3', bounds: bounds(400, 100, 100, 100)},
    ];

    const badges = calculateDistanceBadges(active, targets, 2);
    expect(badges.length).toBeGreaterThanOrEqual(2);
    expect(badges[0]!.distance).toBe(50);
    expect(badges[0]!.orientation).toBe('horizontal');
  });

  it('يصفي خطوط الإرشاد المكررة على نفس الإحداثي', () => {
    const rawLines: ReferenceLine[] = [
      {id: '1', orientation: 'vertical', position: 100, start: 0, end: 200},
      {id: '2', orientation: 'vertical', position: 100.2, start: 50, end: 300},
      {id: '3', orientation: 'horizontal', position: 200, start: 0, end: 100},
    ];

    const filtered = filterDuplicateGuides(rawLines);
    expect(filtered).toHaveLength(2);
  });
});
