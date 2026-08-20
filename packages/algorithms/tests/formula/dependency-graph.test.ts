/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: dependency-graph.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/dependency-graph.test.ts
 * 🎯 الهدف الرئيسي: اختبارات شبكة الاعتماديات وكشف الحلقات وترتيب إعادة الحساب (ALGO-019)
 * 🏷️ المعرف: TEST-ALGO-DEPENDENCY
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  extractCellReferences,
  buildDependencyGraph,
  detectCycle,
  topologicalSort,
  getRecalculationOrder,
} from '../../src/formula/dependency-graph';
import { parseFormula } from '../../src/formula/parser';
import { FormulaError } from '../../src/formula/functions';

describe('Dependency Graph & Cycle Detection (ALGO-019)', () => {
  describe('extractCellReferences', () => {
    it('extracts single cell references', () => {
      const ast = parseFormula('A1 + B2 * 10');
      const refs = extractCellReferences(ast);
      expect(refs).toEqual(['A1', 'B2']);
    });

    it('expands range references', () => {
      const ast = parseFormula('SUM(A1:A3) + C1');
      const refs = extractCellReferences(ast);
      expect(refs).toEqual(['A1', 'A2', 'A3', 'C1']);
    });

    it('deduplicates multiple occurrences', () => {
      const ast = parseFormula('A1 + A1 + B1');
      const refs = extractCellReferences(ast);
      expect(refs).toEqual(['A1', 'B1']);
    });
  });

  describe('buildDependencyGraph', () => {
    it('builds linear dependency chains', () => {
      const cells = {
        A1: '10',
        B1: '=A1 * 2',
        C1: '=B1 + 5',
      };
      const graph = buildDependencyGraph(cells);

      expect(graph.nodes.has('A1')).toBe(true);
      expect(graph.nodes.has('B1')).toBe(true);
      expect(graph.nodes.has('C1')).toBe(true);

      expect(Array.from(graph.dependencies.get('B1')!)).toEqual(['A1']);
      expect(Array.from(graph.dependencies.get('C1')!)).toEqual(['B1']);
      expect(Array.from(graph.dependents.get('A1')!)).toEqual(['B1']);
      expect(Array.from(graph.dependents.get('B1')!)).toEqual(['C1']);
    });

    it('builds diamond dependencies accurately', () => {
      const cells = {
        A1: '100',
        B1: '=A1 + 10',
        C1: '=A1 + 20',
        D1: '=B1 + C1',
      };
      const graph = buildDependencyGraph(cells);

      expect(Array.from(graph.dependents.get('A1')!)).toContain('B1');
      expect(Array.from(graph.dependents.get('A1')!)).toContain('C1');
      expect(Array.from(graph.dependencies.get('D1')!)).toContain('B1');
      expect(Array.from(graph.dependencies.get('D1')!)).toContain('C1');
    });
  });

  describe('detectCycle', () => {
    it('returns null for acyclic graphs', () => {
      const cells = {
        A1: '10',
        B1: '=A1 * 2',
        C1: '=B1 + A1',
      };
      const graph = buildDependencyGraph(cells);
      expect(detectCycle(graph)).toBeNull();
    });

    it('detects direct self-reference cycles', () => {
      const cells = {
        A1: '=A1 + 1',
      };
      const graph = buildDependencyGraph(cells);
      const cycle = detectCycle(graph);
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('A1');
    });

    it('detects 2-node circular reference', () => {
      const cells = {
        A1: '=B1 + 1',
        B1: '=A1 * 2',
      };
      const graph = buildDependencyGraph(cells);
      const cycle = detectCycle(graph);
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('A1');
      expect(cycle).toContain('B1');
    });

    it('detects 3-node circular reference', () => {
      const cells = {
        A1: '=B1 + 1',
        B1: '=C1 + 2',
        C1: '=A1 + 3',
        D1: '100',
      };
      const graph = buildDependencyGraph(cells);
      const cycle = detectCycle(graph);
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('A1');
      expect(cycle).toContain('B1');
      expect(cycle).toContain('C1');
    });
  });

  describe('topologicalSort', () => {
    it('sorts acyclic graph in proper computation order', () => {
      const cells = {
        C1: '=B1 + 5',
        B1: '=A1 * 2',
        A1: '10',
      };
      const graph = buildDependencyGraph(cells);
      const sorted = topologicalSort(graph);

      const aIndex = sorted.indexOf('A1');
      const bIndex = sorted.indexOf('B1');
      const cIndex = sorted.indexOf('C1');

      expect(aIndex).toBeLessThan(bIndex);
      expect(bIndex).toBeLessThan(cIndex);
    });

    it('throws FormulaError with #CIRCULAR! on cycle', () => {
      const cells = {
        A1: '=B1 + 1',
        B1: '=A1 * 2',
      };
      const graph = buildDependencyGraph(cells);
      expect(() => topologicalSort(graph)).toThrow(FormulaError);
    });
  });

  describe('getRecalculationOrder', () => {
    it('returns only downstream affected cells in topological order', () => {
      const cells = {
        A1: '10',
        B1: '=A1 * 2',
        C1: '=B1 + 5',
        D1: '=C1 + 10',
        X1: '100',
        Y1: '=X1 * 3',
      };
      const graph = buildDependencyGraph(cells);

      const affectedWhenA1Changes = getRecalculationOrder(graph, 'A1');
      expect(affectedWhenA1Changes).toEqual(['B1', 'C1', 'D1']);

      const affectedWhenX1Changes = getRecalculationOrder(graph, 'X1');
      expect(affectedWhenX1Changes).toEqual(['Y1']);
    });

    it('returns empty array when cell has no dependents', () => {
      const cells = {
        A1: '10',
        B1: '=A1 * 2',
      };
      const graph = buildDependencyGraph(cells);
      expect(getRecalculationOrder(graph, 'B1')).toEqual([]);
    });

    it('correctly orders diamond dependents', () => {
      const cells = {
        A1: '10',
        B1: '=A1 + 1',
        C1: '=A1 + 2',
        D1: '=B1 + C1',
      };
      const graph = buildDependencyGraph(cells);
      const order = getRecalculationOrder(graph, 'A1');

      expect(order.indexOf('D1')).toBeGreaterThan(order.indexOf('B1'));
      expect(order.indexOf('D1')).toBeGreaterThan(order.indexOf('C1'));
    });
  });
});
