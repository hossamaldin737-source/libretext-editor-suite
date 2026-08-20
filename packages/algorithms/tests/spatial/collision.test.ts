/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: collision.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/collision.test.ts
 * 🎯 الهدف الرئيسي: اختبارات كشف التصادم وحساب مساحة ونسبة التقاطع والجذب المغناطيسي والمسافات (ALGO-020)
 * 🧪 الاختبارات: اختبارات شاملة مع كافة الحالات الحدية والسلوكيات الموثقة والبرمجة الدفاعية
 * 🏷️ المعرف: TEST-ALGO-COLLISION
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  checkCollision,
  getIntersectionArea,
  getOverlapRatio,
  isPointInRect,
  distanceToRect,
  snapToNearestElement,
  clamp,
  isValidPoint,
  isValidRect,
  type Rect,
  type Point,
  type SnappableElement,
} from '../../src/spatial/collision';

describe('Spatial Collision & Snapping (ALGO-020)', () => {
  describe('clamp', () => {
    it('clamps values within range correctly', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('Type Guards: isValidPoint & isValidRect', () => {
    it('validates points correctly', () => {
      expect(isValidPoint({ x: 0, y: 0 })).toBe(true);
      expect(isValidPoint({ x: 10.5, y: -20.2 })).toBe(true);
      expect(isValidPoint({ x: NaN, y: 0 })).toBe(false);
      expect(isValidPoint({ x: 0, y: Infinity })).toBe(false);
      expect(isValidPoint(null)).toBe(false);
      expect(isValidPoint({ x: '0', y: 0 })).toBe(false);
    });

    it('validates rects correctly with strict positive dimensions', () => {
      expect(isValidRect({ x: 0, y: 0, width: 100, height: 100 })).toBe(true);
      expect(isValidRect({ x: 0, y: 0, width: 0, height: 100 })).toBe(false);
      expect(isValidRect({ x: 0, y: 0, width: 100, height: -10 })).toBe(false);
      expect(isValidRect({ x: NaN, y: 0, width: 100, height: 100 })).toBe(false);
      expect(isValidRect(undefined)).toBe(false);
    });
  });

  describe('checkCollision (AABB)', () => {
    it('detects overlapping rectangles', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 50, y: 50, width: 100, height: 100 };
      expect(checkCollision(a, b)).toBe(true);
      expect(checkCollision(b, a)).toBe(true);
    });

    it('detects fully contained rectangles', () => {
      const a: Rect = { x: 0, y: 0, width: 200, height: 200 };
      const b: Rect = { x: 50, y: 50, width: 50, height: 50 };
      expect(checkCollision(a, b)).toBe(true);
    });

    it('returns false for disjoint rectangles', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 100, y: 100, width: 50, height: 50 };
      expect(checkCollision(a, b)).toBe(false);
    });

    it('returns false when touching on edges or corners (strict boundary check <)', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const bRight: Rect = { x: 50, y: 0, width: 50, height: 50 };
      const bBottom: Rect = { x: 0, y: 50, width: 50, height: 50 };
      const bCorner: Rect = { x: 50, y: 50, width: 50, height: 50 };

      expect(checkCollision(a, bRight)).toBe(false);
      expect(checkCollision(a, bBottom)).toBe(false);
      expect(checkCollision(a, bCorner)).toBe(false);
    });

    it('throws error for invalid width or height (<= 0)', () => {
      const invalidA: Rect = { x: 0, y: 0, width: 0, height: 50 };
      const validB: Rect = { x: 10, y: 10, width: 50, height: 50 };
      expect(() => checkCollision(invalidA, validB)).toThrow('Invalid rect A width');

      const invalidHeight: Rect = { x: 0, y: 0, width: 50, height: -10 };
      expect(() => checkCollision(invalidHeight, validB)).toThrow('Invalid rect A height');
    });

    it('throws error for NaN or Infinity coordinates', () => {
      const nanRect: Rect = { x: NaN, y: 0, width: 50, height: 50 };
      const validRect: Rect = { x: 0, y: 0, width: 50, height: 50 };
      expect(() => checkCollision(nanRect, validRect)).toThrow();

      const infRect: Rect = { x: 0, y: Infinity, width: 50, height: 50 };
      expect(() => checkCollision(infRect, validRect)).toThrow();
    });
  });

  describe('getIntersectionArea', () => {
    it('calculates exact intersection area of overlapping rectangles', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 50, y: 50, width: 100, height: 100 };
      expect(getIntersectionArea(a, b)).toBe(2500);
      expect(getIntersectionArea(b, a)).toBe(2500);
    });

    it('calculates area for contained rectangle', () => {
      const a: Rect = { x: 0, y: 0, width: 200, height: 200 };
      const b: Rect = { x: 50, y: 50, width: 50, height: 50 };
      expect(getIntersectionArea(a, b)).toBe(2500);
    });

    it('returns 0 for disjoint or touching rectangles without throwing', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const bDisjoint: Rect = { x: 100, y: 100, width: 50, height: 50 };
      const bTouching: Rect = { x: 50, y: 0, width: 50, height: 50 };

      expect(getIntersectionArea(a, bDisjoint)).toBe(0);
      expect(getIntersectionArea(a, bTouching)).toBe(0);
    });
  });

  describe('getOverlapRatio', () => {
    it('calculates ratio of overlap relative to rect A', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 }; // area = 10000
      const b: Rect = { x: 50, y: 0, width: 100, height: 100 }; // overlap = 50x100 = 5000
      expect(getOverlapRatio(a, b)).toBe(0.5);
    });

    it('returns 1 when rect A is completely inside rect B', () => {
      const a: Rect = { x: 10, y: 10, width: 50, height: 50 };
      const b: Rect = { x: 0, y: 0, width: 100, height: 100 };
      expect(getOverlapRatio(a, b)).toBe(1);
    });

    it('returns 0 when there is no overlap', () => {
      const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
      const b: Rect = { x: 100, y: 100, width: 50, height: 50 };
      expect(getOverlapRatio(a, b)).toBe(0);
    });
  });

  describe('isPointInRect', () => {
    const rect: Rect = { x: 10, y: 20, width: 100, height: 50 };

    it('returns true for points strictly inside', () => {
      expect(isPointInRect({ x: 50, y: 40 }, rect)).toBe(true);
    });

    it('returns true for points on edges and corners (inclusive <=)', () => {
      expect(isPointInRect({ x: 10, y: 20 }, rect)).toBe(true);
      expect(isPointInRect({ x: 110, y: 70 }, rect)).toBe(true);
      expect(isPointInRect({ x: 50, y: 20 }, rect)).toBe(true);
    });

    it('returns false for points outside', () => {
      expect(isPointInRect({ x: 9, y: 20 }, rect)).toBe(false);
      expect(isPointInRect({ x: 111, y: 40 }, rect)).toBe(false);
    });
  });

  describe('distanceToRect', () => {
    const rect: Rect = { x: 100, y: 100, width: 100, height: 100 };

    it('returns 0 for points inside or on boundaries of rect', () => {
      expect(distanceToRect({ x: 150, y: 150 }, rect)).toBe(0);
      expect(distanceToRect({ x: 100, y: 120 }, rect)).toBe(0);
    });

    it('returns exact orthogonal distance for points aligned with sides', () => {
      expect(distanceToRect({ x: 50, y: 150 }, rect)).toBe(50);
      expect(distanceToRect({ x: 250, y: 150 }, rect)).toBe(50);
      expect(distanceToRect({ x: 150, y: 50 }, rect)).toBe(50);
      expect(distanceToRect({ x: 150, y: 250 }, rect)).toBe(50);
    });

    it('returns Euclidean distance to corners for diagonal points', () => {
      // Point at (70, 60), corner at (100, 100), dx=30, dy=40 -> dist=50
      expect(distanceToRect({ x: 70, y: 60 }, rect)).toBe(50);
    });
  });

  describe('snapToNearestElement', () => {
    const elements: SnappableElement[] = [
      {
        id: 'box-1',
        bounds: { x: 100, y: 100, width: 100, height: 100 },
      },
      {
        id: 'box-2',
        bounds: { x: 300, y: 100, width: 100, height: 100 },
      },
    ];

    it('snaps point close to edge when within threshold', () => {
      const point: Point = { x: 95, y: 120 };
      const result = snapToNearestElement(point, elements, 10);

      expect(result.snapped).toBe(true);
      expect(result.element?.id).toBe('box-1');
      expect(result.point).toEqual({ x: 100, y: 120 });
    });

    it('snaps point close to corner with Euclidean distance', () => {
      const point: Point = { x: 96, y: 97 };
      const result = snapToNearestElement(point, elements, 6);

      expect(result.snapped).toBe(true);
      expect(result.element?.id).toBe('box-1');
      expect(result.point).toEqual({ x: 100, y: 100 });
    });

    it('does not snap when distance exceeds threshold', () => {
      const point: Point = { x: 50, y: 50 };
      const result = snapToNearestElement(point, elements, 10);

      expect(result.snapped).toBe(false);
      expect(result.element).toBeNull();
      expect(result.point).toEqual(point);
    });

    it('picks first element in array order upon exact distance tie', () => {
      const tiedElements: SnappableElement[] = [
        { id: 'first', bounds: { x: 100, y: 100, width: 50, height: 50 } },
        { id: 'second', bounds: { x: 200, y: 100, width: 50, height: 50 } },
      ];
      const point: Point = { x: 175, y: 125 };
      const result = snapToNearestElement(point, tiedElements, 30);

      expect(result.snapped).toBe(true);
      expect(result.element?.id).toBe('first');
    });

    it('snaps point inside element to nearest internal edge', () => {
      const point: Point = { x: 102, y: 150 };
      const result = snapToNearestElement(point, elements, 5);

      expect(result.snapped).toBe(true);
      expect(result.element?.id).toBe('box-1');
      expect(result.point).toEqual({ x: 100, y: 150 });
    });

    it('throws when threshold <= 0 or non-finite', () => {
      const point: Point = { x: 100, y: 100 };
      expect(() => snapToNearestElement(point, elements, 0)).toThrow();
      expect(() => snapToNearestElement(point, elements, -5)).toThrow();
      expect(() => snapToNearestElement(point, elements, NaN)).toThrow();
    });

    it('throws when point has NaN or Infinity', () => {
      expect(() => snapToNearestElement({ x: NaN, y: 0 }, elements, 10)).toThrow();
    });
  });

  describe('ALGO-020: Documented Behaviors', () => {
    describe('snapToNearestElement - silent skip of invalid bounds', () => {
      it('skips elements with invalid bounds and still finds valid ones', () => {
        const point: Point = { x: 5, y: 5 };
        const elements: SnappableElement[] = [
          { id: 'valid', bounds: { x: 0, y: 0, width: 10, height: 10 } },
          { id: 'invalid-zero-width', bounds: { x: 0, y: 0, width: 0, height: 10 } },
          { id: 'invalid-nan', bounds: { x: NaN, y: 0, width: 10, height: 10 } },
        ];

        const result = snapToNearestElement(point, elements, 10);
        expect(result.snapped).toBe(true);
        expect(result.element?.id).toBe('valid');
      });

      it('returns null when only invalid elements exist', () => {
        const point: Point = { x: 5, y: 5 };
        const elements: SnappableElement[] = [
          { id: 'bad1', bounds: { x: 0, y: 0, width: 0, height: 10 } },
          { id: 'bad2', bounds: { x: 0, y: 0, width: 10, height: -5 } },
        ];

        const result = snapToNearestElement(point, elements, 10);
        expect(result.snapped).toBe(false);
        expect(result.element).toBe(null);
      });
    });

    describe('getOverlapRatio edge cases', () => {
      it('throws error when rect height is 0 or negative', () => {
        const a: Rect = { x: 0, y: 0, width: 10, height: 0 };
        const b: Rect = { x: 0, y: 0, width: 10, height: 10 };
        expect(() => getOverlapRatio(a, b)).toThrow('Invalid rect A height');
      });
    });
  });
});
