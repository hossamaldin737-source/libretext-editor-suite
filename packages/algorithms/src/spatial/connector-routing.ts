/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: connector-routing.ts
 * 📂 المسار: /packages/algorithms/src/spatial/connector-routing.ts
 * 🎯 الهدف الرئيسي: محرك توجيه الروابط والأسهم التدفقية الذكية (Smart Connector Routing).
 * 📋 المعايير:
 *    - حساب مسارات التعامد (Orthogonal / Manhattan Routing) وتفادي التداخل.
 *    - حساب مسارات المنحنيات الانسيابية (Smooth Curvature Routing).
 *    - تحديد منافذ التوصيل المثلى تلقائياً (Auto-Port Docking).
 *    - حساب رؤوس الأسهم والزوايا (Arrowheads & Terminals).
 * 🧪 الاختبارات:
 *    - /packages/algorithms/tests/spatial/connector-routing.test.ts
 * 🏷️ المعرف: ALGO-011
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Geometric Manhatten Grid & Curvature Routing Engine.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بزوايا قائمة حادة أو منحنيات ناعمة حسب نوع الرابط.
 *    2. منع التماس المباشر مع مركز العنصر عبر مراعاة هوامش المنافذ.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - معالجة الحالات التي تتطابق فيها أبعاد ومواقع الصناديق.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: /packages/algorithms/src/index.ts
 *    - 📦 التبعيات: /packages/algorithms/src/spatial/types.ts, /packages/algorithms/src/spatial/bezier-engine.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - getPortPosition: حساب إحداثيات منفذ التوصيل على الصندوق (#L54)
 *    - getOptimalPorts: تحديد أفضل منفذي توصيل بين صندوقين (#L68)
 *    - routeOrthogonalConnector: حساب نقاط المسار المتعامد (#L98)
 *    - routeCurvedConnector: حساب منحنى بيزيه الانسيابي للرابط (#L136)
 *    - computeArrowhead: حساب إحداثيات رأس السهم عند نقطة النهاية (#L158)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BoundingBox } from './types';
import type { BezierPoint, CubicBezierCurve } from './bezier-engine';

export type PortSide = 'top' | 'right' | 'bottom' | 'left' | 'center';

export interface ConnectorPort {
  readonly point: BezierPoint;
  readonly side: PortSide;
  readonly normal: BezierPoint;
}

export interface ConnectorRoute {
  readonly points: readonly BezierPoint[];
  readonly svgPath: string;
  readonly startPort: ConnectorPort;
  readonly endPort: ConnectorPort;
}

/**
 * حساب إحداثيات منفذ محدد على حافة الصندوق
 */
export function getPortPosition(box: BoundingBox, side: PortSide): ConnectorPort {
  switch (side) {
    case 'top':
      return { point: { x: box.x + box.width / 2, y: box.y }, side, normal: { x: 0, y: -1 } };
    case 'right':
      return {
        point: { x: box.x + box.width, y: box.y + box.height / 2 },
        side,
        normal: { x: 1, y: 0 },
      };
    case 'bottom':
      return {
        point: { x: box.x + box.width / 2, y: box.y + box.height },
        side,
        normal: { x: 0, y: 1 },
      };
    case 'left':
      return { point: { x: box.x, y: box.y + box.height / 2 }, side, normal: { x: -1, y: 0 } };
    case 'center':
    default:
      return {
        point: { x: box.x + box.width / 2, y: box.y + box.height / 2 },
        side: 'center',
        normal: { x: 0, y: 0 },
      };
  }
}

/**
 * تحديد أفضل منفذي توصيل بين صندوقين بناءً على المواقع النسبية
 */
export function getOptimalPorts(
  fromBox: BoundingBox,
  toBox: BoundingBox,
): readonly [ConnectorPort, ConnectorPort] {
  const fromCenter = { x: fromBox.x + fromBox.width / 2, y: fromBox.y + fromBox.height / 2 };
  const toCenter = { x: toBox.x + toBox.width / 2, y: toBox.y + toBox.height / 2 };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  let fromSide: PortSide;
  let toSide: PortSide;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      fromSide = 'right';
      toSide = 'left';
    } else {
      fromSide = 'left';
      toSide = 'right';
    }
  } else {
    if (dy > 0) {
      fromSide = 'bottom';
      toSide = 'top';
    } else {
      fromSide = 'top';
      toSide = 'bottom';
    }
  }

  return [getPortPosition(fromBox, fromSide), getPortPosition(toBox, toSide)];
}

/**
 * توجيه مسار متعامد (Orthogonal / Manhattan) بزوايا 90 درجة
 */
export function routeOrthogonalConnector(
  startPort: ConnectorPort,
  endPort: ConnectorPort,
  offset = 20,
): ConnectorRoute {
  const p1 = startPort.point;
  const p4 = endPort.point;

  const points: BezierPoint[] = [p1];

  // النقطة الأولى خارجة من المنفذ
  const p2: BezierPoint = {
    x: p1.x + startPort.normal.x * offset,
    y: p1.y + startPort.normal.y * offset,
  };
  points.push(p2);

  // النقطة قبل الأخيرة داخلة إلى المنفذ
  const p3: BezierPoint = {
    x: p4.x + endPort.normal.x * offset,
    y: p4.y + endPort.normal.y * offset,
  };

  if (startPort.side === 'right' || startPort.side === 'left') {
    const midX = (p2.x + p3.x) / 2;
    points.push({ x: midX, y: p2.y });
    points.push({ x: midX, y: p3.y });
  } else {
    const midY = (p2.y + p3.y) / 2;
    points.push({ x: p2.x, y: midY });
    points.push({ x: p3.x, y: midY });
  }

  points.push(p3);
  points.push(p4);

  // بناء مسار SVG
  const pathParts = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`);
  const svgPath = pathParts.join(' ');

  return { points, svgPath, startPort, endPort };
}

/**
 * توجيه مسار انسيابي منحني عبر بيزيه تكعيبي (Curved / Bézier Connector)
 */
export function routeCurvedConnector(
  startPort: ConnectorPort,
  endPort: ConnectorPort,
  curviness = 0.5,
): { readonly curve: CubicBezierCurve; readonly svgPath: string } {
  const p0 = startPort.point;
  const p3 = endPort.point;

  const dist = Math.hypot(p3.x - p0.x, p3.y - p0.y);
  const factor = Math.max(30, dist * curviness);

  const p1: BezierPoint = {
    x: p0.x + startPort.normal.x * factor,
    y: p0.y + startPort.normal.y * factor,
  };

  const p2: BezierPoint = {
    x: p3.x + endPort.normal.x * factor,
    y: p3.y + endPort.normal.y * factor,
  };

  const curve: CubicBezierCurve = { p0, p1, p2, p3 };
  const svgPath = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  return { curve, svgPath };
}

/**
 * حساب إحداثيات رأس السهم المثلثي عند نهاية المسار
 */
export function computeArrowhead(
  targetPoint: BezierPoint,
  directionNormal: BezierPoint,
  arrowLength = 10,
  arrowWidth = 6,
): { readonly left: BezierPoint; readonly right: BezierPoint; readonly tip: BezierPoint } {
  const len = Math.hypot(directionNormal.x, directionNormal.y);
  const nx = len === 0 ? 1 : directionNormal.x / len;
  const ny = len === 0 ? 0 : directionNormal.y / len;

  // العمودي على الاتجاه
  const px = -ny;
  const py = nx;

  const baseCenter: BezierPoint = {
    x: targetPoint.x - nx * arrowLength,
    y: targetPoint.y - ny * arrowLength,
  };

  const left: BezierPoint = {
    x: baseCenter.x + px * (arrowWidth / 2),
    y: baseCenter.y + py * (arrowWidth / 2),
  };

  const right: BezierPoint = {
    x: baseCenter.x - px * (arrowWidth / 2),
    y: baseCenter.y - py * (arrowWidth / 2),
  };

  return { left, right, tip: targetPoint };
}
