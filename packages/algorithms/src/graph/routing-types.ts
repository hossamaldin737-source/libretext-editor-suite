/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: routing-types.ts
 * 📂 المسار: src/algorithms/graph/routing-types.ts
 * 🎯 الهدف الرئيسي: تعريف النماذج والأنواع لموجه المسارات المتعامدة والموصلات الذكية
 * 📋 المعايير: صفر تبعيات خارجية، نماذج غير قابلة للتعديل وتدعم كافة الأشكال ونقاط الربط
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-021-ROUTING-TYPES
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Modular Shape & Anchor Graph Architecture for Office Diagramming
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Point2D, AABB } from '../types';

export type NodeShapeType =
  'rectangle' | 'rounded' | 'diamond' | 'cylinder' | 'parallelogram' | 'circle';

export type NodeRole = 'source' | 'target' | 'obstacle' | 'process' | 'decision';

export type AnchorPosition = 'auto' | 'top' | 'right' | 'bottom' | 'left' | 'center';

export type RoutingAlgorithmType =
  | 'dijkstra-orthogonal'
  | 'astar-orthogonal'
  | 'wavefront-lee'
  | 'manhattan-step'
  | 'smooth-bezier'
  | 'direct-linear';

export type LineStrokeStyle = 'solid' | 'dashed' | 'dotted';
export type ArrowheadType = 'arrow' | 'dot' | 'diamond' | 'none';

export interface DiagramNode extends AABB {
  readonly id: string;
  readonly label: string;
  readonly role: NodeRole;
  readonly shape: NodeShapeType;
  readonly colorScheme: string; // Tailwind classes
  readonly description?: string;
}

export interface DiagramConnector {
  readonly id: string;
  readonly sourceNodeId: string;
  readonly targetNodeId: string;
  readonly sourceAnchor: AnchorPosition;
  readonly targetAnchor: AnchorPosition;
  readonly algorithm: RoutingAlgorithmType;
  readonly strokeStyle: LineStrokeStyle;
  readonly arrowhead: ArrowheadType;
  readonly color: string;
  readonly strokeWidth: number;
  readonly label?: string;
}

export interface AdvancedRouteOptions {
  readonly margin?: number;
  readonly bendPenalty?: number;
  readonly obstaclePenalty?: number;
  readonly cornerRadius?: number;
  readonly sourceAnchorDir?: Point2D;
  readonly targetAnchorDir?: Point2D;
  readonly maxIterations?: number;
}

export interface RouteTelemetry {
  readonly executionTimeMs: number;
  readonly pathLength: number;
  readonly bendCount: number;
  readonly pointsCount: number;
  readonly nodesEvaluated: number;
  readonly obstaclesAvoided: number;
  readonly algorithmUsed: RoutingAlgorithmType;
}

export interface ComputedRoute {
  readonly points: readonly Point2D[];
  readonly svgPath: string;
  readonly telemetry: RouteTelemetry;
}
