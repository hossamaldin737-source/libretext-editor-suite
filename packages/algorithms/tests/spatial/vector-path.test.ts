/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: vector-path.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/vector-path.test.ts
 * 🎯 الهدف الرئيسي: اختبارات شاملة لمحرك المسارات الفيكتورية ومنحنيات بيزييه
 * 🏷️ المعرف: TEST-ALGO-031
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  createVectorPath,
  addVertex,
  removeVertex,
  updateVertex,
  toggleVertexType,
  smoothPath,
  simplifyPath,
  vectorPathToSvgD,
  svgDToVectorPath,
  getVectorPathBounds,
} from '../../src/spatial/vector-path';

describe('VectorPath Engine', () => {
  it('ينشئ مساراً فيكتورياً جديداً مع الرؤوس المحددة', () => {
    const path = createVectorPath('path-1', [
      { x: 10, y: 10 },
      { x: 50, y: 50 },
    ]);
    expect(path.id).toBe('path-1');
    expect(path.vertices).toHaveLength(2);
    expect(path.closed).toBe(false);
  });

  it('يضيف ويحذف الرؤوس بدقة', () => {
    let path = createVectorPath('path-2', [{ x: 0, y: 0 }]);
    path = addVertex(path, { x: 100, y: 100 });
    expect(path.vertices).toHaveLength(2);

    const vtxId = path.vertices[0].id;
    path = removeVertex(path, vtxId);
    expect(path.vertices).toHaveLength(1);
    expect(path.vertices[0].point).toEqual({ x: 100, y: 100 });
  });

  it('يحدث الرأس ومقابض التحكم المتناظرة', () => {
    let path = createVectorPath('path-3', [{ x: 50, y: 50 }]);
    const vId = path.vertices[0].id;

    path = updateVertex(path, vId, {
      type: 'symmetric',
      point: { x: 50, y: 50 },
      inHandle: { x: 30, y: 50 },
      outHandle: { x: 70, y: 50 },
    });

    const vtx = path.vertices[0];
    expect(vtx.type).toBe('symmetric');
    expect(vtx.inHandle).toEqual({ x: 30, y: 50 });
    expect(vtx.outHandle).toEqual({ x: 70, y: 50 });
  });

  it('يبدل نوع الرأس بين corner و smooth و symmetric', () => {
    let path = createVectorPath('path-4', [{ x: 20, y: 20 }]);
    const vId = path.vertices[0].id;

    path = toggleVertexType(path, vId);
    expect(path.vertices[0].type).toBe('smooth');

    path = toggleVertexType(path, vId);
    expect(path.vertices[0].type).toBe('symmetric');

    path = toggleVertexType(path, vId);
    expect(path.vertices[0].type).toBe('corner');
  });

  it('ينعم المسار بحساب مقابض بيزييه التلقائية', () => {
    const rawPath = createVectorPath(
      'path-5',
      [
        { x: 0, y: 0 },
        { x: 50, y: 100 },
        { x: 100, y: 0 },
      ],
      true,
    );

    const smoothed = smoothPath(rawPath);
    expect(smoothed.vertices[1].inHandle).toBeDefined();
    expect(smoothed.vertices[1].outHandle).toBeDefined();
  });

  it('يبسط المسار بنقاط Ramer-Douglas-Peucker', () => {
    const rawPath = createVectorPath('path-6', [
      { x: 0, y: 0 },
      { x: 10, y: 0.1 },
      { x: 20, y: 0 },
      { x: 30, y: 0.2 },
      { x: 100, y: 0 },
    ]);

    const simplified = simplifyPath(rawPath, 1.0);
    expect(simplified.vertices.length).toBeLessThan(rawPath.vertices.length);
    expect(simplified.vertices[0].point).toEqual({ x: 0, y: 0 });
    expect(simplified.vertices[simplified.vertices.length - 1].point).toEqual({ x: 100, y: 0 });
  });

  it('يحول المسار الفيكتوري إلى SVG Path d string وبالعكس', () => {
    const path = createVectorPath(
      'path-7',
      [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
      ],
      true,
    );
    const d = vectorPathToSvgD(path);
    expect(d).toContain('M 10 20');
    expect(d).toContain('L 30 40');
    expect(d).toContain('Z');

    const parsed = svgDToVectorPath('path-parsed', d);
    expect(parsed.vertices).toHaveLength(2);
    expect(parsed.vertices[0].point).toEqual({ x: 10, y: 20 });
    expect(parsed.vertices[1].point).toEqual({ x: 30, y: 40 });
    expect(parsed.closed).toBe(true);
  });

  it('يحسب الصندوق المحيط بالمسار الفيكتوري بدقة', () => {
    const path = createVectorPath('path-8', [
      { x: 10, y: 20 },
      { x: 110, y: 120 },
    ]);
    const bounds = getVectorPathBounds(path);
    expect(bounds.x).toBe(10);
    expect(bounds.y).toBe(20);
    expect(bounds.width).toBe(100);
    expect(bounds.height).toBe(100);
  });
});
