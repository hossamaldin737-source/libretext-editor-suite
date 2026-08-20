/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: connector-routing.test.ts
 * 📂 المسار: /packages/algorithms/tests/spatial/connector-routing.test.ts
 * 🎯 الهدف الرئيسي: اختبارات محرك توجيه الروابط المتعامدة والمنحنية والأسهم.
 * 🏷️ المعرف: TEST-ALGO-011
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  getPortPosition,
  getOptimalPorts,
  routeOrthogonalConnector,
  routeCurvedConnector,
  computeArrowhead,
} from '../../src/spatial/connector-routing';

describe('Connector Routing Engine', () => {
  const box1 = { x: 100, y: 100, width: 80, height: 40 };
  const box2 = { x: 300, y: 100, width: 80, height: 40 };
  const box3 = { x: 100, y: 300, width: 80, height: 40 };

  it('calculates accurate port positions on bounding box edges', () => {
    const top = getPortPosition(box1, 'top');
    const right = getPortPosition(box1, 'right');
    const bottom = getPortPosition(box1, 'bottom');
    const left = getPortPosition(box1, 'left');

    expect(top.point).toEqual({ x: 140, y: 100 });
    expect(right.point).toEqual({ x: 180, y: 120 });
    expect(bottom.point).toEqual({ x: 140, y: 140 });
    expect(left.point).toEqual({ x: 100, y: 120 });
  });

  it('determines optimal docking ports based on relative direction', () => {
    const [from1, to1] = getOptimalPorts(box1, box2);
    expect(from1.side).toBe('right');
    expect(to1.side).toBe('left');

    const [from2, to2] = getOptimalPorts(box1, box3);
    expect(from2.side).toBe('bottom');
    expect(to2.side).toBe('top');
  });

  it('routes orthogonal 90-degree connector path', () => {
    const startPort = getPortPosition(box1, 'right');
    const endPort = getPortPosition(box2, 'left');

    const route = routeOrthogonalConnector(startPort, endPort, 20);
    expect(route.points.length).toBe(6);
    expect(route.svgPath).toContain('M 180 120');
    expect(route.svgPath).toContain('300 120');
  });

  it('routes smooth curved connector path', () => {
    const startPort = getPortPosition(box1, 'right');
    const endPort = getPortPosition(box2, 'left');

    const { curve, svgPath } = routeCurvedConnector(startPort, endPort);
    expect(curve.p0).toEqual({ x: 180, y: 120 });
    expect(curve.p3).toEqual({ x: 300, y: 120 });
    expect(svgPath).toContain('M 180 120 C');
  });

  it('computes arrowhead triangle geometry with target tip', () => {
    const tip = { x: 300, y: 120 };
    const normal = { x: 1, y: 0 };
    const arrow = computeArrowhead(tip, normal, 10, 6);

    expect(arrow.tip).toEqual(tip);
    expect(arrow.left.x).toBeCloseTo(290);
    expect(arrow.left.y).toBeCloseTo(123);
    expect(arrow.right.x).toBeCloseTo(290);
    expect(arrow.right.y).toBeCloseTo(117);
  });
});
