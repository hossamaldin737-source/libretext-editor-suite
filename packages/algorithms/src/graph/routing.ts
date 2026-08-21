/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: routing.ts
 * 📂 المسار: src/algorithms/graph/routing.ts
 * 🎯 الهدف الرئيسي: توجيه المسارات المتعامدة الذكية (Orthogonal Dijkstra Routing) لموصلات الأشكال
 * 📋 المعايير: تفادي العوائق وتوليد مسارات بأقل عدد من الانحناءات
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-008-ROUTING
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Gridless Orthogonal Dijkstra Router with Obstacle Inflation & Bend Penalties
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Point2D, AABB } from '../types';
import { routeAStarVisibility } from './orthogonal-router';

export * from './routing-types';
export * from './orthogonal-router';

export interface RouteOptions {
  readonly gridSize?: number;
  readonly margin?: number;
  readonly bendPenalty?: number;
}

export function pointInBox(p: Point2D, box: AABB, margin = 0): boolean {
  return (
    p.x >= box.x - margin &&
    p.x <= box.x + box.width + margin &&
    p.y >= box.y - margin &&
    p.y <= box.y + box.height + margin
  );
}

export function findOrthogonalRoute(
  start: Point2D,
  end: Point2D,
  obstacles: readonly AABB[] = [],
  options: RouteOptions = {},
): Point2D[] {
  const res = routeAStarVisibility(start, end, obstacles, {
    margin: options.margin ?? 12,
    bendPenalty: options.bendPenalty ?? 35,
  });
  return res.path;
}
