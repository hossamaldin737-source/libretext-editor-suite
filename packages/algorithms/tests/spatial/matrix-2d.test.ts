/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: matrix-2d.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/matrix-2d.test.ts
 * 🎯 الهدف الرئيسي: اختبار محرك المصفوفاتثنائية الأبعاد
 * 🏷️ المعرف: TEST-ALGO-SPATIAL-MATRIX
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {describe, it, expect} from 'vitest';
import {
  createIdentityMatrix,
  createTranslationMatrix,
  createScalingMatrix,
  createRotationDegreesMatrix,
  multiplyMatrices,
  invertMatrix,
  transformPointWithMatrix,
  transformBoxWithMatrix,
  toCssMatrixString,
} from '../../src/spatial/matrix-2d';

const pt = (x: number, y: number) => ({type: 'logical' as const, x, y, unit: 'px' as const});

describe('2D Matrix Engine', () => {
  it('creates identity matrix and preserves points', () => {
    const id = createIdentityMatrix();
    const p = pt(42, 88);
    const res = transformPointWithMatrix(id, p);
    expect(res.x).toBe(42);
    expect(res.y).toBe(88);
  });

  it('translates points accurately', () => {
    const t = createTranslationMatrix(15, -20);
    const res = transformPointWithMatrix(t, pt(10, 30));
    expect(res.x).toBe(25);
    expect(res.y).toBe(10);
  });

  it('scales points around origin or pivot', () => {
    const s = createScalingMatrix(2, 3);
    const r1 = transformPointWithMatrix(s, pt(5, 10));
    expect(r1.x).toBe(10);
    expect(r1.y).toBe(30);

    const pivot = pt(10, 10);
    const sPivot = createScalingMatrix(2, 2, pivot);
    const r2 = transformPointWithMatrix(sPivot, pt(15, 15));
    expect(r2.x).toBe(20);
    expect(r2.y).toBe(20);
  });

  it('rotates points around origin and pivot', () => {
    const rot90 = createRotationDegreesMatrix(90);
    const res = transformPointWithMatrix(rot90, pt(10, 0));
    expect(res.x).toBeCloseTo(0);
    expect(res.y).toBeCloseTo(10);
  });

  it('multiplies matrices and inverts accurately', () => {
    const t = createTranslationMatrix(50, 100);
    const s = createScalingMatrix(2, 2);
    const combined = multiplyMatrices(t, s);

    const transformed = transformPointWithMatrix(combined, pt(10, 10));
    expect(transformed.x).toBe(70);
    expect(transformed.y).toBe(120);

    const inv = invertMatrix(combined);
    const back = transformPointWithMatrix(inv, transformed);
    expect(back.x).toBeCloseTo(10);
    expect(back.y).toBeCloseTo(10);
  });

  it('transforms bounding box with rotation and scaling', () => {
    const box = {type: 'bounding-box' as const, x: 0, y: 0, width: 100, height: 50, unit: 'px' as const};
    const t = createTranslationMatrix(20, 30);
    const transformedBox = transformBoxWithMatrix(t, box);

    expect(transformedBox.x).toBe(20);
    expect(transformedBox.y).toBe(30);
    expect(transformedBox.width).toBe(100);
    expect(transformedBox.height).toBe(50);
  });

  it('formats valid CSS matrix string', () => {
    const m = createTranslationMatrix(10, 20);
    expect(toCssMatrixString(m)).toBe('matrix(1, 0, 0, 1, 10, 20)');
  });
});
