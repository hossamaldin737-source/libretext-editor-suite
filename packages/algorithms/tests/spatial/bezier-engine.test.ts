/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: bezier-engine.test.ts
 * 📂 المسار: /packages/algorithms/tests/spatial/bezier-engine.test.ts
 * 🎯 الهدف الرئيسي: اختبارات محرك منحنيات بيزيه التكعيبية والتربيعية.
 * 🏷️ المعرف: TEST-ALGO-010
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  evaluateCubic,
  evaluateQuadratic,
  cubicTangent,
  subdivideCubic,
  approximateCubicLength,
  getCubicBounds,
  cubicToSvgPath,
  type CubicBezierCurve,
  type QuadraticBezierCurve,
} from '../../src/spatial/bezier-engine';

describe('Bezier Engine', () => {
  const lineCurve: CubicBezierCurve = {
    p0: { x: 0, y: 0 },
    p1: { x: 10, y: 0 },
    p2: { x: 20, y: 0 },
    p3: { x: 30, y: 0 },
  };

  const simpleCubic: CubicBezierCurve = {
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 100 },
    p2: { x: 100, y: 100 },
    p3: { x: 100, y: 0 },
  };

  it('evaluates endpoints accurately at t=0 and t=1', () => {
    const start = evaluateCubic(simpleCubic, 0);
    const end = evaluateCubic(simpleCubic, 1);
    expect(start).toEqual({ x: 0, y: 0 });
    expect(end).toEqual({ x: 100, y: 0 });
  });

  it('evaluates midpoint at t=0.5 for symmetric curve', () => {
    const mid = evaluateCubic(simpleCubic, 0.5);
    expect(mid.x).toBeCloseTo(50);
    expect(mid.y).toBeCloseTo(75);
  });

  it('evaluates quadratic bezier curve', () => {
    const quad: QuadraticBezierCurve = {
      p0: { x: 0, y: 0 },
      p1: { x: 50, y: 100 },
      p2: { x: 100, y: 0 },
    };
    const start = evaluateQuadratic(quad, 0);
    const mid = evaluateQuadratic(quad, 0.5);
    const end = evaluateQuadratic(quad, 1);

    expect(start).toEqual({ x: 0, y: 0 });
    expect(mid).toEqual({ x: 50, y: 50 });
    expect(end).toEqual({ x: 100, y: 0 });
  });

  it('calculates normalized tangent vectors', () => {
    const tangentStart = cubicTangent(lineCurve, 0);
    expect(tangentStart.x).toBeCloseTo(1);
    expect(tangentStart.y).toBeCloseTo(0);
  });

  it('subdivides curve accurately using De Casteljau', () => {
    const [left, right] = subdivideCubic(simpleCubic, 0.5);
    expect(left.p0).toEqual(simpleCubic.p0);
    expect(right.p3).toEqual(simpleCubic.p3);
    expect(left.p3).toEqual(right.p0);
  });

  it('approximates cubic arc length accurately', () => {
    const len = approximateCubicLength(lineCurve, 10);
    expect(len).toBeCloseTo(30, 0);
  });

  it('computes tight bounding box containing extrema', () => {
    const bounds = getCubicBounds(simpleCubic);
    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(100);
    expect(bounds.height).toBeCloseTo(75, 0);
  });

  it('generates standard SVG path string', () => {
    const path = cubicToSvgPath(simpleCubic);
    expect(path).toBe('M 0 0 C 0 100, 100 100, 100 0');
  });
});
