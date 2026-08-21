/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: transformer.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/transformer.test.ts
 * 🎯 الهدف الرئيسي: اختبارات شاملة لمحول الإحداثيات (Screen↔Document + Rotation)
 * 📋 المعايير: تغطية 100% لجميع الدوال العامة
 * 🏷️ المعرف: TEST-ALGO-010
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Coordinate Transform Testing + Edge Case Coverage
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  screenToDocument,
  documentToScreen,
  applyLinearTransform,
  translateMatrix,
  rotationMatrix,
  rotationAroundPointMatrix,
  snapToGrid,
  snapPointToGrid,
  rotatePoint,
  radToDeg,
  degToRad,
  getBoundingBox,
  getRotatedBoundingBox,
  getBBoxEdges,
  getResizeHandles,
  distance,
  createBBox,
  bboxFromLogical,
  type TransformMatrix,
  type SnapConfig,
  type Point2D,
} from '../../src/spatial/transformer';
import { LengthUnit } from '../../src/spatial/types';

describe('ALGO-010: CoordinateTransformer', () => {
  describe('screenToDocument', () => {
    it('converts screen to document with zero offset', () => {
      const result = screenToDocument(100, 200, { x: 0, y: 0 }, 1);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('applies viewport offset', () => {
      const result = screenToDocument(300, 400, { x: 100, y: 200 }, 1);
      expect(result).toEqual({ x: 200, y: 200 });
    });

    it('applies zoom', () => {
      const result = screenToDocument(200, 400, { x: 0, y: 0 }, 2);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('applies both offset and zoom', () => {
      const result = screenToDocument(500, 600, { x: 100, y: 200 }, 2);
      expect(result).toEqual({ x: 200, y: 200 });
    });

    it('throws on zero zoom', () => {
      expect(() => screenToDocument(100, 100, { x: 0, y: 0 }, 0)).toThrow('Zoom must be > 0');
    });

    it('throws on negative zoom', () => {
      expect(() => screenToDocument(100, 100, { x: 0, y: 0 }, -1)).toThrow('Zoom must be > 0');
    });
  });

  describe('documentToScreen', () => {
    it('converts document to screen with zero offset', () => {
      const result = documentToScreen(100, 200, { x: 0, y: 0 }, 1);
      expect(result).toEqual({ x: 100, y: 200 });
    });

    it('applies viewport offset', () => {
      const result = documentToScreen(200, 200, { x: 100, y: 200 }, 1);
      expect(result).toEqual({ x: 300, y: 400 });
    });

    it('applies zoom', () => {
      const result = documentToScreen(100, 200, { x: 0, y: 0 }, 2);
      expect(result).toEqual({ x: 200, y: 400 });
    });

    it('throws on zero zoom', () => {
      expect(() => documentToScreen(100, 100, { x: 0, y: 0 }, 0)).toThrow('Zoom must be > 0');
    });
  });

  describe('screenToDocument ↔ documentToScreen (Roundtrip)', () => {
    it('roundtrips correctly', () => {
      const offset = { x: 50, y: 100 };
      const zoom = 2;
      const screen = { x: 500, y: 600 };
      const doc = screenToDocument(screen.x, screen.y, offset, zoom);
      const back = documentToScreen(doc.x, doc.y, offset, zoom);
      expect(back.x).toBeCloseTo(screen.x);
      expect(back.y).toBeCloseTo(screen.y);
    });
  });

  describe('applyLinearTransform', () => {
    it('applies identity matrix', () => {
      const m: TransformMatrix = { a: 1, b: 0, tx: 0, c: 0, d: 1, ty: 0 };
      const result = applyLinearTransform({ x: 10, y: 20 }, m);
      expect(result).toEqual({ x: 10, y: 20 });
    });

    it('applies translation', () => {
      const m: TransformMatrix = { a: 1, b: 0, tx: 5, c: 0, d: 1, ty: 10 };
      const result = applyLinearTransform({ x: 10, y: 20 }, m);
      expect(result).toEqual({ x: 15, y: 30 });
    });

    it('applies scale', () => {
      const m: TransformMatrix = { a: 2, b: 0, tx: 0, c: 0, d: 3, ty: 0 };
      const result = applyLinearTransform({ x: 10, y: 20 }, m);
      expect(result).toEqual({ x: 20, y: 60 });
    });
  });

  describe('Matrix Factories', () => {
    it('translateMatrix creates translation matrix', () => {
      const m = translateMatrix(5, 10);
      expect(m).toEqual({ a: 1, b: 0, tx: 5, c: 0, d: 1, ty: 10 });
    });

    it('rotationMatrix creates rotation matrix', () => {
      const m = rotationMatrix(0);
      expect(m.a).toBeCloseTo(1);
      expect(m.b).toBeCloseTo(0);
      expect(m.c).toBeCloseTo(0);
      expect(m.d).toBeCloseTo(1);
      expect(m.tx).toBe(0);
      expect(m.ty).toBe(0);
    });

    it('rotationMatrix at 90 degrees', () => {
      const m = rotationMatrix(degToRad(90));
      expect(m.a).toBeCloseTo(0);
      expect(m.b).toBeCloseTo(-1);
      expect(m.c).toBeCloseTo(1);
      expect(m.d).toBeCloseTo(0);
    });

    it('rotationAroundPointMatrix rotates around center', () => {
      const m = rotationAroundPointMatrix(0, 100, 100);
      const pt = applyLinearTransform({ x: 100, y: 100 }, m);
      expect(pt.x).toBeCloseTo(100);
      expect(pt.y).toBeCloseTo(100);
    });
  });

  describe('snapToGrid', () => {
    it('rounds to nearest grid step', () => {
      expect(snapToGrid(12, 10)).toBe(10);
      expect(snapToGrid(16, 10)).toBe(20);
      expect(snapToGrid(15, 10)).toBe(20);
    });

    it('returns value if step is zero', () => {
      expect(snapToGrid(12.5, 0)).toBe(12.5);
    });

    it('returns value if step is negative', () => {
      expect(snapToGrid(12.5, -5)).toBe(12.5);
    });

    it('handles exact multiples', () => {
      expect(snapToGrid(20, 10)).toBe(20);
    });
  });

  describe('snapPointToGrid', () => {
    it('snaps when enabled', () => {
      const snap: SnapConfig = { stepX: 10, stepY: 10, enabled: true };
      expect(snapPointToGrid({ x: 12, y: 28 }, snap)).toEqual({ x: 10, y: 30 });
    });

    it('does not snap when disabled', () => {
      const snap: SnapConfig = { stepX: 10, stepY: 10, enabled: false };
      expect(snapPointToGrid({ x: 12, y: 28 }, snap)).toEqual({ x: 12, y: 28 });
    });
  });

  describe('rotatePoint', () => {
    it('zero rotation returns same point', () => {
      const pt: Point2D = { x: 10, y: 20 };
      const center: Point2D = { x: 0, y: 0 };
      const result = rotatePoint(pt, 0, center);
      expect(result.x).toBeCloseTo(10);
      expect(result.y).toBeCloseTo(20);
    });

    it('rotates 90 degrees around origin', () => {
      const result = rotatePoint({ x: 1, y: 0 }, degToRad(90), { x: 0, y: 0 });
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(1);
    });

    it('rotates 180 degrees around center returns symmetric point', () => {
      const center: Point2D = { x: 5, y: 5 };
      const result = rotatePoint({ x: 10, y: 5 }, degToRad(180), center);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(5);
    });

    it('360 degree rotation returns same point', () => {
      const pt: Point2D = { x: 3, y: 7 };
      const center: Point2D = { x: 1, y: 1 };
      const result = rotatePoint(pt, degToRad(360), center);
      expect(result.x).toBeCloseTo(pt.x);
      expect(result.y).toBeCloseTo(pt.y);
    });
  });

  describe('radToDeg / degToRad', () => {
    it('converts radians to degrees', () => {
      expect(radToDeg(Math.PI)).toBeCloseTo(180);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
    });

    it('converts degrees to radians', () => {
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    });
  });

  describe('getBoundingBox', () => {
    it('computes bounding box from 4 points', () => {
      const pts: Point2D[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 50 },
        { x: 0, y: 50 },
      ];
      const bbox = getBoundingBox(pts);
      expect(bbox).toEqual({ x: 0, y: 0, width: 100, height: 50 });
    });

    it('handles scattered points', () => {
      const pts: Point2D[] = [
        { x: 50, y: 60 },
        { x: 10, y: 20 },
        { x: 90, y: 10 },
        { x: 30, y: 80 },
      ];
      const bbox = getBoundingBox(pts);
      expect(bbox).toEqual({ x: 10, y: 10, width: 80, height: 70 });
    });
  });

  describe('getRotatedBoundingBox', () => {
    it('computes bbox of rotated rectangle', () => {
      const corners: Point2D[] = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 50 },
        { x: 0, y: 50 },
      ];
      const bbox = getRotatedBoundingBox(corners, degToRad(90));
      expect(bbox.width).toBeCloseTo(50);
      expect(bbox.height).toBeCloseTo(100);
    });
  });

  describe('getBBoxEdges', () => {
    it('returns correct edges', () => {
      const bbox = createBBox(10, 20, 100, 50);
      const edges = getBBoxEdges(bbox);
      expect(edges).toEqual({ top: 20, right: 110, bottom: 70, left: 10 });
    });
  });

  describe('getResizeHandles', () => {
    it('returns 8 handles', () => {
      const bbox = createBBox(0, 0, 100, 60);
      const handles = getResizeHandles(bbox);
      expect(handles).toHaveLength(8);
    });

    it('positions handles correctly', () => {
      const bbox = createBBox(0, 0, 100, 60);
      const handles = getResizeHandles(bbox);
      const map = Object.fromEntries(handles.map((h) => [h.position, h.point]));
      expect(map['top-left']).toEqual({ x: 0, y: 0 });
      expect(map['bottom-right']).toEqual({ x: 100, y: 60 });
      expect(map['top-center']).toEqual({ x: 50, y: 0 });
      expect(map['middle-right']).toEqual({ x: 100, y: 30 });
    });

    it('positions handles for offset bbox', () => {
      const bbox = createBBox(20, 30, 80, 40);
      const handles = getResizeHandles(bbox);
      const map = Object.fromEntries(handles.map((h) => [h.position, h.point]));
      expect(map['top-left']).toEqual({ x: 20, y: 30 });
      expect(map['bottom-right']).toEqual({ x: 100, y: 70 });
      expect(map['middle-left']).toEqual({ x: 20, y: 50 });
    });
  });

  describe('distance', () => {
    it('computes distance between two points', () => {
      expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    });

    it('returns 0 for same point', () => {
      expect(distance({ x: 5, y: 5 }, { x: 5, y: 5 })).toBe(0);
    });
  });

  describe('createBBox', () => {
    it('creates a BBox', () => {
      const bbox = createBBox(10, 20, 100, 50);
      expect(bbox).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    });
  });

  describe('bboxFromLogical', () => {
    it('creates BBox from logical coordinates', () => {
      const bbox = bboxFromLogical(10, 20, 100, 50);
      expect(bbox).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    });

    it('accepts optional unit parameter', () => {
      const bbox = bboxFromLogical(10, 20, 100, 50, LengthUnit.CM);
      expect(bbox).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    });
  });
});
