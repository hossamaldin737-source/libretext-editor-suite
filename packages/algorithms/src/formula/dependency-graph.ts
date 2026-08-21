/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: dependency-graph.ts
 * 📂 المسار: packages/algorithms/src/formula/dependency-graph.ts
 * 🎯 الهدف الرئيسي: بناء شبكة الاعتماديات وكشف الحلقات وترتيب إعادة الحساب الذكي
 * 📋 المعايير: صفر اعتماديات، تعقيد O(V+E)، خوارزمية Kahn و DFS ثلاثي الألوان
 * 🧪 الاختبارات: packages/algorithms/tests/formula/dependency-graph.test.ts
 * 🏷️ المعرف: ALGO-019
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    3-Color Cycle Detection + Subgraph Topological Recalculation Order
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كشف المراجع الدائرية الذاتية (A1 -> A1) والحلقات متعددة العقد
 *    2. توسيع النطاقات (A1:B2) إلى كافة الخلايا المكونة لها
 *    3. عدم إعادة حساب الجدول بأكمله عند تعديل خلية واحدة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية ضد المراجع غير الموجودة
 *    - رمي FormulaError('#CIRCULAR!') عند كشف أي حلقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: packages/algorithms/src/formula/cell-utils.ts, parser.ts
 *    - 📄 مرتبط مباشر: packages/algorithms/src/index.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/formula/dependency-graph.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - extractCellReferences: استخراج كافة المراجع من شجرة AST
 *    - buildDependencyGraph: بناء شبكة الاعتماديات الثنائية
 *    - detectCycle: كشف الحلقات باستخدام DFS ثلاثي الألوان
 *    - topologicalSort: الترتيب الطوبولوجي الكامل باستخدام خوارزمية Kahn
 *    - getRecalculationOrder: تحديد ترتيب إعادة الحساب للخلايا المتأثرة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { parseFormula } from './parser';
import { type FormulaAST } from './ast';
import { expandCellRange } from './cell-utils';
import { FormulaError } from './functions';

/** نوع الخلية أو مدخلات الجدول الحسابي */
export type CellFormulaInput = string | { formula?: string; value?: unknown } | null | undefined;
export type CellsMap = Record<string, CellFormulaInput> | Map<string, CellFormulaInput>;

/** بنية شبكة الاعتماديات */
export interface DependencyGraph {
  readonly nodes: Set<string>;
  readonly dependencies: Map<string, Set<string>>; // node -> الخلايا التي تعتمد عليها
  readonly dependents: Map<string, Set<string>>; // node -> الخلايا التي تعتمد على هذه الخلية
}

/** استخراج مراجع الخلايا من شجرة AST */
export function extractCellReferences(ast: FormulaAST): string[] {
  const refs: string[] = [];

  function walk(node: FormulaAST): void {
    if (!node) return;
    if (node.kind === 'cell') {
      refs.push(node.ref.toUpperCase());
    } else if (node.kind === 'range') {
      try {
        const expanded = expandCellRange(node.from.toUpperCase(), node.to.toUpperCase());
        refs.push(...expanded);
      } catch {
        refs.push(node.from.toUpperCase(), node.to.toUpperCase());
      }
    } else if (node.kind === 'binary') {
      walk(node.left);
      walk(node.right);
    } else if (node.kind === 'unary') {
      walk(node.operand);
    } else if (node.kind === 'call') {
      for (const arg of node.args) {
        walk(arg);
      }
    }
  }

  walk(ast);
  return Array.from(new Set(refs));
}

/** استخراج الصيغة من مدخل الخلية إن وجدت */
function extractFormulaString(input: CellFormulaInput): string | null {
  if (!input) return null;
  if (typeof input === 'string') {
    return input.startsWith('=') ? input.slice(1) : null;
  }
  if (typeof input === 'object' && input.formula) {
    return input.formula.startsWith('=') ? input.formula.slice(1) : input.formula;
  }
  return null;
}

/**
 * بناء شبكة الاعتماديات من خلايا الجدول الحسابي
 * تعقيد زمني ومكاني: O(V + E)
 */
export function buildDependencyGraph(cells: CellsMap): DependencyGraph {
  const nodes = new Set<string>();
  const dependencies = new Map<string, Set<string>>();
  const dependents = new Map<string, Set<string>>();

  const entries: [string, CellFormulaInput][] =
    cells instanceof Map ? Array.from(cells.entries()) : Object.entries(cells);

  // تهيئة كافة العقد
  for (const [rawKey] of entries) {
    const key = rawKey.toUpperCase();
    nodes.add(key);
    dependencies.set(key, new Set());
    dependents.set(key, new Set());
  }

  // بناء حواف الاعتمادية
  for (const [rawKey, input] of entries) {
    const key = rawKey.toUpperCase();
    const formulaStr = extractFormulaString(input);
    if (!formulaStr) continue;

    try {
      const ast = parseFormula(formulaStr);
      const refs = extractCellReferences(ast);

      for (const ref of refs) {
        nodes.add(ref);
        if (!dependencies.has(ref)) dependencies.set(ref, new Set());
        if (!dependents.has(ref)) dependents.set(ref, new Set());

        dependencies.get(key)!.add(ref);
        dependents.get(ref)!.add(key);
      }
    } catch {
      // الأخطاء النحوية لا توقف بناء الشبكة
    }
  }

  return { nodes, dependencies, dependents };
}

/**
 * كشف الحلقات باستخدام DFS ثلاثي الألوان (0=White, 1=Gray, 2=Black)
 * يُرجع مسار الحلقة إن وُجدت، أو null إن لم توجد
 */
export function detectCycle(graph: DependencyGraph): string[] | null {
  const color = new Map<string, 0 | 1 | 2>();
  const parent = new Map<string, string | null>();

  for (const node of graph.nodes) {
    color.set(node, 0);
  }

  for (const node of graph.nodes) {
    if (color.get(node) === 0) {
      const cycle = dfsDetectCycle(node, graph, color, parent);
      if (cycle) return cycle;
    }
  }

  return null;
}

/** بحث العمق المساعد لكشف الدورات */
function dfsDetectCycle(
  u: string,
  graph: DependencyGraph,
  color: Map<string, 0 | 1 | 2>,
  parent: Map<string, string | null>,
): string[] | null {
  color.set(u, 1); // Gray: قيد المعالجة

  const deps = graph.dependencies.get(u) || new Set();
  for (const v of deps) {
    const vColor = color.get(v) ?? 0;
    if (vColor === 1) {
      // اكتشاف حلقة
      const path = [v, u];
      let curr = parent.get(u);
      while (curr && curr !== v) {
        path.push(curr);
        curr = parent.get(curr);
      }
      path.reverse();
      path.push(v);
      return path;
    }
    if (vColor === 0) {
      parent.set(v, u);
      const cycle = dfsDetectCycle(v, graph, color, parent);
      if (cycle) return cycle;
    }
  }

  color.set(u, 2); // Black: اكتملت
  return null;
}

/**
 * الترتيب الطوبولوجي الكامل باستخدام خوارزمية Kahn
 * يرمي خطأ FormulaError('#CIRCULAR!') عند وجود حلقة
 */
export function topologicalSort(graph: DependencyGraph): string[] {
  const inDegree = new Map<string, number>();
  for (const node of graph.nodes) {
    inDegree.set(node, 0);
  }

  for (const node of graph.nodes) {
    const deps = graph.dependencies.get(node) || new Set();
    inDegree.set(node, deps.size);
  }

  const queue: string[] = [];
  for (const [node, deg] of inDegree.entries()) {
    if (deg === 0) {
      queue.push(node);
    }
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    sorted.push(u);

    const depsOnU = graph.dependents.get(u) || new Set();
    for (const v of depsOnU) {
      const currentDeg = inDegree.get(v) || 0;
      const nextDeg = currentDeg - 1;
      inDegree.set(v, nextDeg);
      if (nextDeg === 0) {
        queue.push(v);
      }
    }
  }

  if (sorted.length < graph.nodes.size) {
    const cycle = detectCycle(graph);
    const cycleDesc = cycle ? cycle.join(' -> ') : 'Circular reference detected';
    throw new FormulaError('#CIRCULAR!', `Circular dependency detected: ${cycleDesc}`);
  }

  return sorted;
}

/**
 * استخراج ترتيب إعادة الحساب الذكي للخلايا المتأثرة بتعديل معين
 * يبدأ من الخلية المعدلة ويسير عبر المعولين (Dependents) ويرتبهم طوبولوجياً
 */
export function getRecalculationOrder(
  graph: DependencyGraph,
  changedCell: string | string[],
): string[] {
  const startNodes = (Array.isArray(changedCell) ? changedCell : [changedCell]).map((c) =>
    c.toUpperCase(),
  );

  // جمع كافة الخلايا المتأثرة باستخدام BFS
  const affected = new Set<string>();
  const queue = [...startNodes];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const deps = graph.dependents.get(current) || new Set();
    for (const dep of deps) {
      if (!affected.has(dep)) {
        affected.add(dep);
        queue.push(dep);
      }
    }
  }

  if (affected.size === 0) {
    return [];
  }

  // بناء شبكة فرعية للخلايا المتأثرة فقط
  const subNodes = new Set(affected);
  const subDependencies = new Map<string, Set<string>>();
  const subDependents = new Map<string, Set<string>>();

  for (const node of subNodes) {
    subDependencies.set(node, new Set());
    subDependents.set(node, new Set());
  }

  for (const node of subNodes) {
    const nodeDeps = graph.dependencies.get(node) || new Set();
    for (const dep of nodeDeps) {
      if (subNodes.has(dep)) {
        subDependencies.get(node)!.add(dep);
        subDependents.get(dep)!.add(node);
      }
    }
  }

  const subGraph: DependencyGraph = {
    nodes: subNodes,
    dependencies: subDependencies,
    dependents: subDependents,
  };

  return topologicalSort(subGraph);
}
