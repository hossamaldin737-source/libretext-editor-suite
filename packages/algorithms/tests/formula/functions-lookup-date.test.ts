/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-lookup-date.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/functions-lookup-date.test.ts
 * 🎯 الهدف الرئيسي: اختبارات دوال البحث والمصفوفات والتاريخ
 * 🏷️ المعرف: TEST-ALGO-LOOKUP
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  MATCH, INDEX, VLOOKUP, XLOOKUP, IFS, SWITCH,
  DATE, TODAY, NOW, DATEDIF,
} from '../../src/formula/functions-lookup-date';
import { FormulaError } from '../../src/formula/functions';

// ─── MATCH ──────────────────────────────────────────────────────────────────
describe('MATCH', () => {
  it('finds exact match (type 0)', () => {
    expect(MATCH('b', ['a', 'b', 'c'], 0)).toBe(2);
  });

  it('finds approximate match (type 1)', () => {
    expect(MATCH(3, [1, 2, 3, 4, 5], 1)).toBe(3);
  });

  it('finds reverse approximate match (type -1)', () => {
    expect(MATCH(4, [5, 4, 3, 2, 1], -1)).toBe(2);
  });

  it('throws on empty array', () => {
    expect(() => MATCH('a', [], 0)).toThrow(FormulaError);
  });

  it('throws when value not found', () => {
    expect(() => MATCH('z', ['a', 'b', 'c'], 0)).toThrow(FormulaError);
  });
});

// ─── INDEX ──────────────────────────────────────────────────────────────────
describe('INDEX', () => {
  it('returns value from 2D array', () => {
    const arr = [['a', 'b'], ['c', 'd']];
    expect(INDEX(arr, 2, 2)).toBe('d');
  });

  it('returns value from 1D array', () => {
    expect(INDEX([10, 20, 30], 2)).toBe(20);
  });

  it('throws on out of range row', () => {
    expect(() => INDEX([[1, 2]], 5, 1)).toThrow(FormulaError);
  });

  it('throws on empty array', () => {
    expect(() => INDEX([], 1, 1)).toThrow(FormulaError);
  });
});

// ─── VLOOKUP ────────────────────────────────────────────────────────────────
describe('VLOOKUP', () => {
  const table = [
    ['Name', 'Score'],
    ['Alice', 95],
    ['Bob', 87],
  ];

  it('finds exact match', () => {
    expect(VLOOKUP('Alice', table, 2, false)).toBe(95);
  });

  it('finds approximate match', () => {
    const nums = [[10, 'a'], [20, 'b'], [30, 'c']];
    expect(VLOOKUP(25, nums, 2, true)).toBe('b');
  });

  it('throws on no match', () => {
    expect(() => VLOOKUP('Zoe', table, 2, false)).toThrow(FormulaError);
  });

  it('throws on empty table', () => {
    expect(() => VLOOKUP('a', [], 1)).toThrow(FormulaError);
  });

  it('throws on invalid column index', () => {
    expect(() => VLOOKUP('Alice', table, 0)).toThrow(FormulaError);
  });
});

// ─── XLOOKUP ────────────────────────────────────────────────────────────────
describe('XLOOKUP', () => {
  it('finds match', () => {
    expect(XLOOKUP('b', ['a', 'b', 'c'], [1, 2, 3])).toBe(2);
  });

  it('returns default on no match', () => {
    expect(XLOOKUP('z', ['a', 'b'], [1, 2], 'not found')).toBe('not found');
  });

  it('throws on no match when no default', () => {
    expect(() => XLOOKUP('z', ['a', 'b'], [1, 2])).toThrow(FormulaError);
  });
});

// ─── IFS ────────────────────────────────────────────────────────────────────
describe('IFS', () => {
  it('returns first true condition', () => {
    expect(IFS(false, 'A', true, 'B', false, 'C')).toBe('B');
  });

  it('throws when no condition is true', () => {
    expect(() => IFS(false, 'A', false, 'B')).toThrow(FormulaError);
  });

  it('throws on odd number of args', () => {
    expect(() => IFS(true, 'A', false)).toThrow(FormulaError);
  });
});

// ─── SWITCH ─────────────────────────────────────────────────────────────────
describe('SWITCH', () => {
  it('matches case', () => {
    expect(SWITCH('a', 'a', 1, 'b', 2)).toBe(1);
  });

  it('returns default', () => {
    expect(SWITCH('x', 'a', 1, 'b', 2, 'default')).toBe('default');
  });

  it('throws on no match and no default', () => {
    expect(() => SWITCH('x', 'a', 1, 'b', 2)).toThrow(FormulaError);
  });
});

// ─── DATE ───────────────────────────────────────────────────────────────────
describe('DATE', () => {
  it('creates ISO date', () => {
    expect(DATE(2026, 8, 20)).toBe('2026-08-20');
  });

  it('pads single digits', () => {
    expect(DATE(2026, 1, 5)).toBe('2026-01-05');
  });

  it('throws on non-numeric', () => {
    expect(() => DATE('abc', 1, 1)).toThrow(FormulaError);
  });
});

// ─── TODAY / NOW ────────────────────────────────────────────────────────────
describe('TODAY', () => {
  it('returns YYYY-MM-DD format', () => {
    const result = TODAY();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('NOW', () => {
  it('returns ISO string', () => {
    const result = NOW();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

// ─── DATEDIF ────────────────────────────────────────────────────────────────
describe('DATEDIF', () => {
  it('calculates days', () => {
    expect(DATEDIF('2026-01-01', '2026-01-10', 'D')).toBe(9);
  });

  it('calculates months', () => {
    expect(DATEDIF('2026-01-15', '2026-06-10', 'M')).toBe(4);
  });

  it('calculates years', () => {
    expect(DATEDIF('2020-06-15', '2026-08-20', 'Y')).toBe(6);
  });

  it('throws on invalid date', () => {
    expect(() => DATEDIF('invalid', '2026-01-01')).toThrow(FormulaError);
  });

  it('throws when start > end', () => {
    expect(() => DATEDIF('2026-12-01', '2026-01-01')).toThrow(FormulaError);
  });
});
