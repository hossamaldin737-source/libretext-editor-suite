/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: mapper.test.ts
 * 📂 المسار: packages/algorithms/tests/spatial/mapper.test.ts
 * 🎯 الهدف الرئيسي: اختبار المترجم المكاني (تغطية >= 95%)
 * 🏷️ المعرف: TEST-ALGO-008
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v2: mm tests + zoom + upper bounds + defaults)
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  PIXELS_PER_INCH,
  PIXELS_PER_CM,
  PIXELS_PER_PT,
  PIXELS_PER_MM,
  OfficeDomain,
  convertLength,
  unitToPx,
  translateToLogical,
  translateToGrid,
  translateCoords,
  getDomainDefaultUnit,
  type RawMouseCoords,
  type ViewportConfig,
  type GridMapperConfig,
  type MapperConfig
} from '../../src/spatial/mapper';
import { LengthUnit } from '../../src/spatial/types';

// ─────────────────────────────────────────────────────────────────────────────
// إعدادات اختبار مشتركة
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_VIEWPORT: ViewportConfig = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1
};

const DEFAULT_GRID: GridMapperConfig = {
  cellWidth: 100,
  cellHeight: 30,
  headerWidth: 50,
  headerHeight: 25
};

describe('ALGO-008 v2: SpatialMapper', () => {
  // ───────────────────────────────────────────────────────────────────────────
  // تحويل الوحدات (مع mm الجديد)
  // ───────────────────────────────────────────────────────────────────────────
  describe('Unit Conversion', () => {
    it('has correct CSS standard constants', () => {
      expect(PIXELS_PER_INCH).toBe(96);
      expect(PIXELS_PER_CM).toBeCloseTo(96 / 2.54);
      expect(PIXELS_PER_PT).toBeCloseTo(96 / 72);
      expect(PIXELS_PER_MM).toBeCloseTo(96 / 25.4);
    });

    it('converts mm to pixels correctly', () => {
      expect(unitToPx(25.4, LengthUnit.MILLIMETER)).toBeCloseTo(96);
      expect(unitToPx(10, LengthUnit.MILLIMETER)).toBeCloseTo(96 / 2.54);
    });

    it('converts mm to inches correctly', () => {
      expect(convertLength(25.4, LengthUnit.MILLIMETER, LengthUnit.INCH))
        .toBeCloseTo(1);
    });

    it('converts inches to mm correctly', () => {
      expect(convertLength(1, LengthUnit.INCH, LengthUnit.MILLIMETER))
        .toBeCloseTo(25.4);
    });

    it('converts between all unit pairs correctly', () => {
      expect(convertLength(1, LengthUnit.INCH, LengthUnit.CENTIMETER))
        .toBeCloseTo(2.54);
      expect(convertLength(72, LengthUnit.POINT, LengthUnit.INCH))
        .toBeCloseTo(1);
      expect(convertLength(1, LengthUnit.CENTIMETER, LengthUnit.MILLIMETER))
        .toBeCloseTo(10);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // translateToLogical
  // ───────────────────────────────────────────────────────────────────────────
  describe('translateToLogical', () => {
    it('translates coordinates with offset and zoom correctly', () => {
      const raw: RawMouseCoords = { clientX: 250, clientY: 150 };
      const viewport: ViewportConfig = { offsetX: 50, offsetY: 50, zoom: 2 };
      const result = translateToLogical(raw, viewport, LengthUnit.PIXEL);
      expect(result.type).toBe('logical');
      expect(result.x).toBe(100);
      expect(result.y).toBe(50);
      expect(result.unit).toBe('px');
    });

    it('translates coordinates to centimeters correctly', () => {
      const raw: RawMouseCoords = { clientX: 96, clientY: 192 };
      const viewport: ViewportConfig = { offsetX: 0, offsetY: 0, zoom: 1 };
      const result = translateToLogical(raw, viewport, LengthUnit.CENTIMETER);
      expect(result.type).toBe('logical');
      expect(result.x).toBeCloseTo(2.54);
      expect(result.y).toBeCloseTo(5.08);
      expect(result.unit).toBe('cm');
    });

    it('throws on non-positive zoom', () => {
      const raw: RawMouseCoords = { clientX: 100, clientY: 100 };
      const viewport: ViewportConfig = { offsetX: 0, offsetY: 0, zoom: 0 };
      expect(() => translateToLogical(raw, viewport, LengthUnit.PIXEL))
        .toThrow('zoom must be positive');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // translateToGrid — Zoom والحدود العليا
  // ───────────────────────────────────────────────────────────────────────────
  describe('translateToGrid Enhancements', () => {
    it('throws on negative zoom', () => {
      const raw: RawMouseCoords = { clientX: 100, clientY: 100 };
      const viewport: ViewportConfig = { offsetX: 0, offsetY: 0, zoom: -1 };
      expect(() => translateToGrid(raw, viewport, DEFAULT_GRID))
        .toThrow('zoom must be positive');
    });

    it('throws on zero zoom', () => {
      const raw: RawMouseCoords = { clientX: 100, clientY: 100 };
      const viewport: ViewportConfig = { offsetX: 0, offsetY: 0, zoom: 0 };
      expect(() => translateToGrid(raw, viewport, DEFAULT_GRID))
        .toThrow('zoom must be positive');
    });

    it('clamps to maxRow when exceeding grid bounds', () => {
      const gridWithBounds: GridMapperConfig = {
        ...DEFAULT_GRID,
        maxRow: 5,
        maxCol: 10
      };
      const raw: RawMouseCoords = {
        clientX: DEFAULT_GRID.headerWidth + DEFAULT_GRID.cellWidth * 100,
        clientY: DEFAULT_GRID.headerHeight + DEFAULT_GRID.cellHeight * 100
      };
      const result = translateToGrid(raw, DEFAULT_VIEWPORT, gridWithBounds);
      expect(result.row).toBe(5);
      expect(result.col).toBe(10);
    });

    it('does not clamp when no maxRow/maxCol specified', () => {
      const raw: RawMouseCoords = {
        clientX: DEFAULT_GRID.headerWidth + DEFAULT_GRID.cellWidth * 1000,
        clientY: DEFAULT_GRID.headerHeight + DEFAULT_GRID.cellHeight * 500
      };
      const result = translateToGrid(raw, DEFAULT_VIEWPORT, DEFAULT_GRID);
      expect(result.col).toBe(1000);
      expect(result.row).toBe(500);
    });

    it('respects maxRow only when maxCol is undefined', () => {
      const gridWithRowBound: GridMapperConfig = {
        ...DEFAULT_GRID,
        maxRow: 3
      };
      const raw: RawMouseCoords = {
        clientX: DEFAULT_GRID.headerWidth + DEFAULT_GRID.cellWidth * 100,
        clientY: DEFAULT_GRID.headerHeight + DEFAULT_GRID.cellHeight * 100
      };
      const result = translateToGrid(raw, DEFAULT_VIEWPORT, gridWithRowBound);
      expect(result.row).toBe(3);
      expect(result.col).toBe(100);
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // translateCoords — Default Units & Exhaustive Check
  // ───────────────────────────────────────────────────────────────────────────
  describe('translateCoords Enhancements', () => {
    const raw: RawMouseCoords = { clientX: 200, clientY: 150 };

    it('uses pt as default unit for Writer domain', () => {
      const config: MapperConfig = { viewport: DEFAULT_VIEWPORT };
      const result = translateCoords(raw, OfficeDomain.WRITER, config);
      expect(result.type).toBe('logical');
      if (result.type === 'logical') {
        expect(result.unit).toBe('pt');
      }
    });

    it('uses cm as default unit for Impress domain', () => {
      const config: MapperConfig = { viewport: DEFAULT_VIEWPORT };
      const result = translateCoords(raw, OfficeDomain.IMPRESS, config);
      expect(result.type).toBe('logical');
      if (result.type === 'logical') {
        expect(result.unit).toBe('cm');
      }
    });

    it('uses px as default unit for Calc domain (when grid present)', () => {
      const config: MapperConfig = {
        viewport: DEFAULT_VIEWPORT,
        grid: DEFAULT_GRID
      };
      const result = translateCoords(raw, OfficeDomain.CALC, config);
      expect(result.type).toBe('grid');
    });

    it('uses px as default unit for Base domain (when grid present)', () => {
      const config: MapperConfig = {
        viewport: DEFAULT_VIEWPORT,
        grid: DEFAULT_GRID
      };
      const result = translateCoords(raw, OfficeDomain.BASE, config);
      expect(result.type).toBe('grid');
    });

    it('throws on unknown office domain (exhaustive check)', () => {
      const config: MapperConfig = { viewport: DEFAULT_VIEWPORT };
      const unknownDomain = 'unknown_domain' as unknown as typeof OfficeDomain[keyof typeof OfficeDomain];
      expect(() => translateCoords(raw, unknownDomain, config))
        .toThrow('Unknown office domain');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Domain Default Units
  // ───────────────────────────────────────────────────────────────────────────
  describe('getDomainDefaultUnit', () => {
    it('returns pt for Writer', () => {
      expect(getDomainDefaultUnit(OfficeDomain.WRITER)).toBe('pt');
    });

    it('returns cm for Impress', () => {
      expect(getDomainDefaultUnit(OfficeDomain.IMPRESS)).toBe('cm');
    });

    it('returns px for Calc', () => {
      expect(getDomainDefaultUnit(OfficeDomain.CALC)).toBe('px');
    });

    it('returns px for Base', () => {
      expect(getDomainDefaultUnit(OfficeDomain.BASE)).toBe('px');
    });
  });
});
