/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: dependency.ts
 * 📂 المسار: src/algorithms/graph/dependency.ts
 * 🎯 الهدف الرئيسي: كشف الحلقات الدائرية والترتيب الطوبولوجي لشبكات الاعتماد
 * 📋 المعايير: خوارزمية DFS ثلاثية الألوان وكاهن (Kahn) بتعقيد زمني O(V+E)
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-019-GRAPH
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    3-Color State Machine DFS Cycle Tracer + Kahn Topological Recalculator
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. إرجاع رسالة الخطأ #CIRCULAR! مع المسار الدقيق للحلقة
 *    2. ضمان ترتيب الخلايا المعتمدة بترتيب حسابي يمنع القيم القديمة
 *    3. التعامل الآمن مع العقد المعزولة والعلاقات التكرارية الذاتية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية من العقد غير المعرفة في مصفوفة الحواف
 *    - استخراج المسار الدائري الصافي فقط دون العقد السابقة غير المشتركة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: src/algorithms/types.ts
 *    - 📄 مرتبط مباشر: src/algorithms/index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - detectCycle: كشف الحلقات واستخراج مسارها (#L65)
 *    - getCircularError: صياغة نص خطأ الحلقة (#L112)
 *    - topologicalSort: الترتيب الطوبولوجي بخوارزمية كاهن (#L128)
 *    - getRecalculationOrder: تحديد ترتيب إعادة الحساب التنازلي (#L175)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Kahn (1962) & Tarjan (1972) Graph Algorithms
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { DependencyGraphData } from '../types';

enum NodeColor {
  White = 0, // لم تتم زيارته
  Gray = 1, // قيد الاستكشاف في المكدس الحالي
  Black = 2, // تم الانتهاء من جميع تفريعاته
}

// @function-index: #1/3 — detectCycle
// @see: FUNCTION_INDEX.md#L140

/**
 * كشف الحلقات في الرسم البياني للاعتماديات باستخدام DFS ثلاثي الألوان
 *
 * @param graph - كائن يحوي قائمة العقد ومصفوفة الحواف (من العقدة إلى ما تعتمد عليه)
 * @returns مسار الحلقة إن وجدت (مثل ['A', 'B', 'A']) أو null
 */
export function detectCycle(graph: DependencyGraphData): string[] | null {
  const colorMap = new Map<string, NodeColor>();
  const parentMap = new Map<string, string | null>();
  const allNodes = Array.from(
    new Set([...graph.nodes, ...Object.keys(graph.edges), ...Object.values(graph.edges).flat()]),
  );

  for (const node of allNodes) {
    colorMap.set(node, NodeColor.White);
  }

  const cycleStack: string[] = [];

  for (const node of allNodes) {
    if (colorMap.get(node) === NodeColor.White) {
      const detected = dfsVisitCycle(node, graph, colorMap, cycleStack, parentMap);
      if (detected) {
        return detected;
      }
    }
  }

  return null;
}

function dfsVisitCycle(
  current: string,
  graph: DependencyGraphData,
  colorMap: Map<string, NodeColor>,
  stack: string[],
  parentMap: Map<string, string | null>,
): string[] | null {
  colorMap.set(current, NodeColor.Gray);
  stack.push(current);

  const neighbors = graph.edges[current] || [];
  for (const neighbor of neighbors) {
    const neighborColor = colorMap.get(neighbor) ?? NodeColor.White;

    if (neighborColor === NodeColor.Gray) {
      // حلقة دائرية مكتشفة
      const cycleStartIdx = stack.indexOf(neighbor);
      if (cycleStartIdx !== -1) {
        const cycle = stack.slice(cycleStartIdx);
        cycle.push(neighbor);
        return cycle;
      }
      return [current, neighbor, current];
    }

    if (neighborColor === NodeColor.White) {
      parentMap.set(neighbor, current);
      const result = dfsVisitCycle(neighbor, graph, colorMap, stack, parentMap);
      if (result) return result;
    }
  }

  colorMap.set(current, NodeColor.Black);
  stack.pop();
  return null;
}

// @function-index: #2/3 — getCircularError
// @see: FUNCTION_INDEX.md#L162

/**
 * صياغة رسالة الخطأ القياسية للجداول الإلكترونية عند وجود حلقة دائرية
 */
export function getCircularError(graph: DependencyGraphData): string {
  const cycle = detectCycle(graph);
  if (cycle && cycle.length > 0) {
    return `#CIRCULAR! (${cycle.join(' -> ')})`;
  }
  return '#CIRCULAR!';
}

// @function-index: #3/3 — topologicalSort
// @see: FUNCTION_INDEX.md#L178

/**
 * الترتيب الطوبولوجي للعقد باستخدام خوارزمية كاهن (Kahn's Algorithm)
 * يرتب العقد من الأصول غير المعتمدة إلى المشتقات الأكثر اعتماداً
 *
 * @param graph - الرسم البياني للاعتماديات
 * @returns ترتيب التنفيذ أو null في حال وجود حلقة
 */
export function topologicalSort(graph: DependencyGraphData): string[] | null {
  if (detectCycle(graph) !== null) {
    return null;
  }

  const allNodes = Array.from(
    new Set([...graph.nodes, ...Object.keys(graph.edges), ...Object.values(graph.edges).flat()]),
  );

  // حساب الدرجة الداخلة (in-degree): كم اعتماداً يلزم لحساب هذه العقدة
  const inDegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();

  for (const node of allNodes) {
    inDegree.set(node, 0);
    dependents.set(node, []);
  }

  for (const [node, dependencies] of Object.entries(graph.edges)) {
    inDegree.set(node, (inDegree.get(node) || 0) + dependencies.length);
    for (const dep of dependencies) {
      if (!dependents.has(dep)) dependents.set(dep, []);
      dependents.get(dep)!.push(node);
    }
  }

  const queue: string[] = [];
  for (const [node, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(node);
    }
  }

  const sortedOrder: string[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    sortedOrder.push(u);

    const downstream = dependents.get(u) || [];
    for (const v of downstream) {
      const currentDegree = inDegree.get(v) || 0;
      const nextDegree = currentDegree - 1;
      inDegree.set(v, nextDegree);
      if (nextDegree === 0) {
        queue.push(v);
      }
    }
  }

  return sortedOrder;
}

/**
 * حساب ترتيب إعادة الحساب التنازلي للخلايا المتغيرة (Cascade Recalculation Order)
 * يحدد جميع الخلايا المتأثرة بتغير خلية معينة ويرتبها بالترتيب الحسابي الصحيح
 */
export function getRecalculationOrder(
  graph: DependencyGraphData,
  changedCells: readonly string[],
): string[] {
  // بناء علاقات التبعية العكسية (من الأصل إلى المعتمد)
  const dependentsMap = new Map<string, Set<string>>();

  for (const [cell, deps] of Object.entries(graph.edges)) {
    for (const dep of deps) {
      if (!dependentsMap.has(dep)) dependentsMap.set(dep, new Set());
      dependentsMap.get(dep)!.add(cell);
    }
  }

  // جمع جميع الخلايا المتأثرة باستخدام BFS
  const affected = new Set<string>();
  const queue = [...changedCells];

  while (queue.length > 0) {
    const current = queue.shift()!;
    affected.add(current);
    const downstream = dependentsMap.get(current);
    if (downstream) {
      for (const nextCell of downstream) {
        if (!affected.has(nextCell)) {
          affected.add(nextCell);
          queue.push(nextCell);
        }
      }
    }
  }

  // فرز الخلايا المتأثرة وفق الترتيب الطوبولوجي العام
  const fullOrder = topologicalSort(graph);
  if (!fullOrder) {
    return Array.from(affected);
  }

  return fullOrder.filter((node) => affected.has(node));
}
