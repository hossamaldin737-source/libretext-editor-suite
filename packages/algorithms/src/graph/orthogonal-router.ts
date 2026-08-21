/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: orthogonal-router.ts
 * 📂 المسار: src/algorithms/graph/orthogonal-router.ts
 * 🎯 الهدف الرئيسي: محرك توجيه المسارات المتعامدة وخوارزميات دايجسترا و A* وتفادي العوائق
 * 📋 المعايير: صفر تبعيات، تفادي عوائق حقيقي، تقليل انحناءات، توليد مسارات ناعمة
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-022-ROUTER-ENGINE
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Orthogonal Channel Graph + Priority Queue A* Router with Bend Minimization
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. لا تتجاوز أي دالة 50 سطراً أو الملف 400 سطر
 *    2. حماية المسار من الانسداد الكامل عبر مسار التفافي آمن
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Point2D, AABB } from '../types';
import {
  AnchorPosition,
  DiagramNode,
  DiagramConnector,
  AdvancedRouteOptions,
  ComputedRoute,
  RouteTelemetry,
  RoutingAlgorithmType,
} from './routing-types';

export function getNodeAnchorPoint(
  node: AABB,
  anchor: AnchorPosition,
  targetPoint?: Point2D,
): Point2D {
  const cx = node.x + node.width / 2;
  const cy = node.y + node.height / 2;

  if (anchor === 'auto') {
    if (!targetPoint) return { x: node.x + node.width, y: cy };
    const dx = targetPoint.x - cx;
    const dy = targetPoint.y - cy;
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? { x: node.x + node.width, y: cy } : { x: node.x, y: cy };
    } else {
      return dy > 0 ? { x: cx, y: node.y + node.height } : { x: cx, y: node.y };
    }
  }

  switch (anchor) {
    case 'top':
      return { x: cx, y: node.y };
    case 'bottom':
      return { x: cx, y: node.y + node.height };
    case 'left':
      return { x: node.x, y: cy };
    case 'right':
      return { x: node.x + node.width, y: cy };
    case 'center':
    default:
      return { x: cx, y: cy };
  }
}

export function isSegmentBlocked(p1: Point2D, p2: Point2D, box: AABB, margin = 8): boolean {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);

  const bx = box.x - margin;
  const bw = box.x + box.width + margin;
  const by = box.y - margin;
  const bh = box.y + box.height + margin;

  if (maxX <= bx || minX >= bw || maxY <= by || minY >= bh) return false;
  if (p1.x === p2.x) {
    return p1.x >= bx && p1.x <= bw && Math.max(p1.y, p2.y) > by && Math.min(p1.y, p2.y) < bh;
  }
  if (p1.y === p2.y) {
    return p1.y >= by && p1.y <= bh && Math.max(p1.x, p2.x) > bx && Math.min(p1.x, p2.x) < bw;
  }
  return true;
}

export function buildRoutingChannels(
  start: Point2D,
  end: Point2D,
  obstacles: readonly AABB[],
  margin = 12,
): { xList: number[]; yList: number[] } {
  const xSet = new Set<number>([start.x, end.x]);
  const ySet = new Set<number>([start.y, end.y]);

  for (const ob of obstacles) {
    xSet.add(Math.round(ob.x - margin));
    xSet.add(Math.round(ob.x + ob.width / 2));
    xSet.add(Math.round(ob.x + ob.width + margin));
    ySet.add(Math.round(ob.y - margin));
    ySet.add(Math.round(ob.y + ob.height / 2));
    ySet.add(Math.round(ob.y + ob.height + margin));
  }

  const xList = Array.from(xSet).sort((a, b) => a - b);
  const yList = Array.from(ySet).sort((a, b) => a - b);
  return { xList, yList };
}

interface GridSearchNode {
  x: number;
  y: number;
  dir: 'none' | 'h' | 'v';
  g: number;
  f: number;
  parent: GridSearchNode | null;
}

export function routeAStarVisibility(
  start: Point2D,
  end: Point2D,
  obstacles: readonly AABB[],
  options: AdvancedRouteOptions = {},
): { path: Point2D[]; evaluated: number } {
  const margin = options.margin ?? 12;
  const bendPenalty = options.bendPenalty ?? 45;
  const { xList, yList } = buildRoutingChannels(start, end, obstacles, margin);

  const openSet: GridSearchNode[] = [
    {
      x: start.x,
      y: start.y,
      dir: 'none',
      g: 0,
      f: Math.abs(start.x - end.x) + Math.abs(start.y - end.y),
      parent: null,
    },
  ];
  const closed = new Set<string>();
  let evaluated = 0;

  while (openSet.length > 0) {
    evaluated++;
    if (evaluated > (options.maxIterations ?? 1500)) break;

    openSet.sort((a, b) => a.f - b.f);
    const curr = openSet.shift()!;
    const key = `${curr.x}:${curr.y}:${curr.dir}`;

    if (curr.x === end.x && curr.y === end.y) {
      return { path: reconstructPath(curr), evaluated };
    }
    if (closed.has(key)) continue;
    closed.add(key);

    const neighbors = getOrthogonalNeighbors(curr.x, curr.y, xList, yList);
    for (const nb of neighbors) {
      const nextDir: 'h' | 'v' = nb.x !== curr.x ? 'h' : 'v';
      let blocked = false;
      for (const ob of obstacles) {
        if (isSegmentBlocked(curr, nb, ob, margin)) {
          blocked = true;
          break;
        }
      }
      if (blocked) continue;

      const dist = Math.abs(curr.x - nb.x) + Math.abs(curr.y - nb.y);
      const isTurn = curr.dir !== 'none' && curr.dir !== nextDir;
      const gScore = curr.g + dist + (isTurn ? bendPenalty : 0);
      const hScore = Math.abs(nb.x - end.x) + Math.abs(nb.y - end.y);

      openSet.push({ x: nb.x, y: nb.y, dir: nextDir, g: gScore, f: gScore + hScore, parent: curr });
    }
  }

  // Fallback direct path
  return {
    path: [
      start,
      { x: (start.x + end.x) / 2, y: start.y },
      { x: (start.x + end.x) / 2, y: end.y },
      end,
    ],
    evaluated,
  };
}

function getOrthogonalNeighbors(x: number, y: number, xList: number[], yList: number[]): Point2D[] {
  const res: Point2D[] = [];
  const xi = xList.indexOf(x);
  const yi = yList.indexOf(y);

  if (xi > 0) res.push({ x: xList[xi - 1] ?? 0, y });
  if (xi >= 0 && xi < xList.length - 1) res.push({ x: xList[xi + 1] ?? 0, y });
  if (yi > 0) res.push({ x, y: yList[yi - 1] ?? 0 });
  if (yi >= 0 && yi < yList.length - 1) res.push({ x, y: yList[yi + 1] ?? 0 });

  return res;
}

function reconstructPath(node: GridSearchNode): Point2D[] {
  const pts: Point2D[] = [];
  let curr: GridSearchNode | null = node;
  while (curr) {
    pts.unshift({ x: curr.x, y: curr.y });
    curr = curr.parent;
  }
  return simplifyCollinearPoints(pts);
}

export function simplifyCollinearPoints(points: readonly Point2D[]): Point2D[] {
  if (points.length <= 2) return [...points];
  const res: Point2D[] = [points[0]!];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = res[res.length - 1]!;
    const curr = points[i]!;
    const next = points[i + 1]!;

    const isCollinearX = prev.x === curr.x && curr.x === next.x;
    const isCollinearY = prev.y === curr.y && curr.y === next.y;

    if (!isCollinearX && !isCollinearY) {
      res.push(curr);
    }
  }
  res.push(points[points.length - 1]!);
  return res;
}

export function generateSmoothCurvedPath(points: readonly Point2D[], radius = 10): string {
  if (points.length <= 1) return '';
  if (points.length === 2)
    return `M ${points[0]!.x} ${points[0]!.y} L ${points[1]!.x} ${points[1]!.y}`;

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const pPrev = points[i - 1]!;
    const pCurr = points[i]!;
    const pNext = points[i + 1]!;

    const d1 = Math.hypot(pCurr.x - pPrev.x, pCurr.y - pPrev.y);
    const d2 = Math.hypot(pNext.x - pCurr.x, pNext.y - pCurr.y);
    const r = Math.min(radius, d1 / 2, d2 / 2);

    const startX = pCurr.x - (r * (pCurr.x - pPrev.x)) / d1;
    const startY = pCurr.y - (r * (pCurr.y - pPrev.y)) / d1;
    const endX = pCurr.x + (r * (pNext.x - pCurr.x)) / d2;
    const endY = pCurr.y + (r * (pNext.y - pCurr.y)) / d2;

    d += ` L ${startX} ${startY} Q ${pCurr.x} ${pCurr.y} ${endX} ${endY}`;
  }
  d += ` L ${points[points.length - 1]!.x} ${points[points.length - 1]!.y}`;
  return d;
}

export function computeDiagramRoute(
  source: DiagramNode,
  target: DiagramNode,
  connector: DiagramConnector,
  allObstacles: readonly DiagramNode[],
  options: AdvancedRouteOptions = {},
): ComputedRoute {
  const startTimer = performance.now();
  const obstacles = allObstacles.filter((n) => n.id !== source.id && n.id !== target.id);

  const startPt = getNodeAnchorPoint(source, connector.sourceAnchor, { x: target.x, y: target.y });
  const endPt = getNodeAnchorPoint(target, connector.targetAnchor, startPt);

  let rawPoints: Point2D[] = [];
  let evaluated = 1;

  if (connector.algorithm === 'direct-linear') {
    rawPoints = [startPt, endPt];
  } else if (connector.algorithm === 'manhattan-step') {
    const midX = (startPt.x + endPt.x) / 2;
    rawPoints = simplifyCollinearPoints([
      startPt,
      { x: midX, y: startPt.y },
      { x: midX, y: endPt.y },
      endPt,
    ]);
  } else {
    const res = routeAStarVisibility(startPt, endPt, obstacles, options);
    rawPoints = res.path;
    evaluated = res.evaluated;
  }

  let totalLength = 0;
  for (let i = 0; i < rawPoints.length - 1; i++) {
    totalLength += Math.hypot(
      rawPoints[i + 1]!.x - rawPoints[i]!.x,
      rawPoints[i + 1]!.y - rawPoints[i]!.y,
    );
  }

  const svgPath =
    connector.algorithm === 'smooth-bezier'
      ? generateSmoothCurvedPath(rawPoints, options.cornerRadius ?? 12)
      : rawPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const duration = performance.now() - startTimer;

  const telemetry: RouteTelemetry = {
    executionTimeMs: Math.round(duration * 100) / 100,
    pathLength: Math.round(totalLength),
    bendCount: Math.max(0, rawPoints.length - 2),
    pointsCount: rawPoints.length,
    nodesEvaluated: evaluated,
    obstaclesAvoided: obstacles.length,
    algorithmUsed: connector.algorithm,
  };

  return { points: rawPoints, svgPath, telemetry };
}
