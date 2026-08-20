/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: matrix-2d.test.ts
 * 📂 المسار: /packages/algorithms/tests/spatial/matrix-2d.test.ts
 * 🎯 الهدف الرئيسي: اختبارات مصفوفات التحويل الهندسي ثنائية الأبعاد 2D Matrix.
 * 🏷️ المعرف: TEST-ALGO-012
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
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

describe('2D Matrix Engine', () => {
  it('creates identity matrix and preserves points', () => {
    const id = createIdentityMatrix();
    const pt = { x: 42, y: 88 };
    const res = transformPointWithMatrix(id, pt);
    expect(res).toEqual(pt);
  });

  it('translates points accurately', () => {
    const t = createTranslationMatrix(15, -20);
    const pt = { x: 10, y: 30 };
    const res = transformPointWithMatrix(t, pt);
    expect(res).toEqual({ x: 25, y: 10 });
  });

  it('scales points around origin or pivot', () => {
    const s = createScalingMatrix(2, 3);
    expect(transformPointWithMatrix(s, { x: 5, y: 10 })).toEqual({ x: 10, y: 30 });

    const pivot = { x: 10, y: 10 };
    const sPivot = createScalingMatrix(2, 2, pivot);
    expect(transformPointWithMatrix(sPivot, { x: 15, y: 15 })).toEqual({ x: 20, y: 20 });
  });

  it('rotates points around origin and pivot', () => {
    const rot90 = createRotationDegreesMatrix(90);
    const pt = { x: 10, y: 0 };
    const res = transformPointWithMatrix(rot90, pt);
    expect(res.x).toBeCloseTo(0);
    expect(res.y).toBeCloseTo(10);
  });

  it('multiplies matrices and inverts accurately', () => {
    const t = createTranslationMatrix(50, 100);
    const s = createScalingMatrix(2, 2);
    const combined = multiplyMatrices(t, s);

    const pt = { x: 10, y: 10 };
    const transformed = transformPointWithMatrix(combined, pt);
    expect(transformed).toEqual({ x: 70, y: 120 });

    const inv = invertMatrix(combined);
    const back = transformPointWithMatrix(inv, transformed);
    expect(back.x).toBeCloseTo(10);
    expect(back.y).toBeCloseTo(10);
  });

  it('transforms bounding box with rotation and scaling', () => {
    const box = { x: 0, y: 0, width: 100, height: 50 };
    const t = createTranslationMatrix(20, 30);
    const transformedBox = transformBoxWithMatrix(t, box);

    expect(transformedBox).toEqual({
      x: 20,
      y: 30,
      width: 100,
      height: 50,
    });
  });

  it('formats valid CSS matrix string', () => {
    const m = createTranslationMatrix(10, 20);
    expect(toCssMatrixString(m)).toBe('matrix(1, 0, 0, 1, 10, 20)');
  });
});
