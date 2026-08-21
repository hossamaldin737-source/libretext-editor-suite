/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: vector-path.ts
 * 📂 المسار: packages/algorithms/src/spatial/vector-path.ts
 * 🎯 الهدف الرئيسي: محرك تحرير المسارات الفيكتورية المتقدم ونمذجة منحنيات بيزييه (Bezier Curves)
 * 📋 المعايير:
 *    - نمذجة مسارات بيزييه برؤوس Corner و Smooth و Symmetric
 *    - دوال تنعيم المسار (smoothPath) وتبسيط المسار (simplifyPath بمبدأ Ramer-Douglas-Peucker)
 *    - توليد وتحويل كود SVG Path d-strings وعكس الاتجاهات وحساب الصناديق المحيطة
 * 🧪 الاختبارات: packages/algorithms/tests/spatial/vector-path.test.ts
 * 🏷️ المعرف: ALGO-029
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type-Safe Bezier Spline Modeling + Douglas-Peucker Polygon Simplification
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب القسمة على صفر عند حساب زوايا النقاط المتطابقة
 *    2. ضمان عزل النسخ (Immutable Clones) في جميع دوال التحويل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من وجود نقطتين على الأقل قبل التبسيط
 *    - تطهير معاملات SVG من المحارف غير الصالحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/algorithms/src/index.ts
 *    - 📦 التبعيات: packages/algorithms/src/spatial/types.ts
 *    - 📄 مرتبط مباشر: packages/algorithms/src/spatial/transformer.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/spatial/vector-path.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createVectorPath: إنشاء مسار فيكتوري جديد فارغ أو بنقاط أولية (#L68)
 *    - addVertex: إضافة رأس جديد إلى المسار (#L84)
 *    - removeVertex: حذف رأس محدد بالمعرف (#L100)
 *    - updateVertex: تحديث إحداثيات ومقابض الرأس (#L108)
 *    - toggleVertexType: تبديل نوع الرأس بين زاوية ومنحنى متماثل (#L132)
 *    - smoothPath: تنعيم المسار بحساب مقابض بيزييه تلقائية (#L153)
 *    - simplifyPath: تبسيط المسار بنقاط Ramer-Douglas-Peucker (#L192)
 *    - vectorPathToSvgD: تحويل بيانات المسار إلى نص SVG d attribute (#L233)
 *    - svgDToVectorPath: استخراج المسار من نص SVG d attribute (#L264)
 *    - getVectorPathBounds: حساب الصندوق المحيط بالمسار ومقابضه (#L318)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم استخلاص وترقية المحرك من مشاريع النواة المرجعية ليتوافق مع TypeScript الصارم
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - Ramer-Douglas-Peucker Algorithm (1972/1973) - Polyline simplification
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { type Point, type Rect } from './collision';

export type VertexType = 'corner' | 'smooth' | 'symmetric';

export interface PathVertex {
  id: string;
  point: Point;
  inHandle?: Point;
  outHandle?: Point;
  type: VertexType;
  selected?: boolean;
}

export interface VectorPathData {
  id: string;
  closed: boolean;
  vertices: PathVertex[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

function generateVertexId(): string {
  return `vtx_${Math.random().toString(36).substring(2, 9)}`;
}

function distance(p1: Point, p2: Point): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function angle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function clonePath(path: VectorPathData): VectorPathData {
  return {
    ...path,
    vertices: path.vertices.map((v) => ({
      ...v,
      point: { ...v.point },
      inHandle: v.inHandle ? { ...v.inHandle } : undefined,
      outHandle: v.outHandle ? { ...v.outHandle } : undefined,
    })),
  };
}

/**
 * إنشاء مسار فيكتوري جديد
 */
export function createVectorPath(
  id: string,
  points: Point[] = [],
  closed: boolean = false,
): VectorPathData {
  return {
    id,
    closed,
    vertices: points.map((p) => ({
      id: generateVertexId(),
      point: { ...p },
      type: 'corner',
    })),
  };
}

/**
 * إضافة نقطة جديدة إلى المسار
 */
export function addVertex(path: VectorPathData, point: Point, index?: number): VectorPathData {
  const result = clonePath(path);
  const newVtx: PathVertex = {
    id: generateVertexId(),
    point: { ...point },
    type: 'corner',
  };

  if (index !== undefined && index >= 0 && index <= result.vertices.length) {
    result.vertices.splice(index, 0, newVtx);
  } else {
    result.vertices.push(newVtx);
  }
  return result;
}

/**
 * حذف نقطة من المسار
 */
export function removeVertex(path: VectorPathData, vertexId: string): VectorPathData {
  const result = clonePath(path);
  result.vertices = result.vertices.filter((v) => v.id !== vertexId);
  return result;
}

/**
 * تحديث رأس ومقابضه
 */
export function updateVertex(
  path: VectorPathData,
  vertexId: string,
  updates: Partial<PathVertex>,
): VectorPathData {
  const result = clonePath(path);
  const vtx = result.vertices.find((v) => v.id === vertexId);
  if (!vtx) return result;

  Object.assign(vtx, updates);

  if (updates.inHandle && vtx.type === 'symmetric' && vtx.outHandle) {
    const dx = vtx.point.x - updates.inHandle.x;
    const dy = vtx.point.y - updates.inHandle.y;
    vtx.outHandle = { x: vtx.point.x + dx, y: vtx.point.y + dy };
  } else if (updates.outHandle && vtx.type === 'symmetric' && vtx.inHandle) {
    const dx = vtx.point.x - updates.outHandle.x;
    const dy = vtx.point.y - updates.outHandle.y;
    vtx.inHandle = { x: vtx.point.x + dx, y: vtx.point.y + dy };
  }

  return result;
}

/**
 * تبديل نوع الرأس (Corner <-> Smooth <-> Symmetric)
 */
export function toggleVertexType(path: VectorPathData, vertexId: string): VectorPathData {
  const result = clonePath(path);
  const vtx = result.vertices.find((v) => v.id === vertexId);
  if (!vtx) return result;

  if (vtx.type === 'corner') {
    vtx.type = 'smooth';
    vtx.inHandle = { x: vtx.point.x - 20, y: vtx.point.y };
    vtx.outHandle = { x: vtx.point.x + 20, y: vtx.point.y };
  } else if (vtx.type === 'smooth') {
    vtx.type = 'symmetric';
  } else {
    vtx.type = 'corner';
    delete vtx.inHandle;
    delete vtx.outHandle;
  }

  return result;
}

/**
 * تنعيم المسار الفيكتوري بحساب منحنيات بيزييه تلقائية للرؤوس
 */
export function smoothPath(path: VectorPathData, tension: number = 0.3): VectorPathData {
  const result = clonePath(path);
  const n = result.vertices.length;
  if (n < 3) return result;

  for (let i = 0; i < n; i++) {
    const curr = result.vertices[i]!;
    const prev = result.vertices[(i - 1 + n) % n]!;
    const next = result.vertices[(i + 1) % n]!;

    if (!result.closed && (i === 0 || i === n - 1)) {
      curr.type = 'corner';
      continue;
    }

    const dPrev = distance(prev.point, curr.point);
    const dNext = distance(curr.point, next.point);
    const totalDist = dPrev + dNext;
    if (totalDist === 0) continue;

    const angleBetween = angle(prev.point, next.point);
    const inDist = dPrev * tension;
    const outDist = dNext * tension;

    curr.inHandle = {
      x: Math.round((curr.point.x - inDist * Math.cos(angleBetween)) * 100) / 100,
      y: Math.round((curr.point.y - inDist * Math.sin(angleBetween)) * 100) / 100,
    };
    curr.outHandle = {
      x: Math.round((curr.point.x + outDist * Math.cos(angleBetween)) * 100) / 100,
      y: Math.round((curr.point.y + outDist * Math.sin(angleBetween)) * 100) / 100,
    };
    curr.type = 'smooth';
  }

  return result;
}

/**
 * تبسيط المسار الفيكتوري بتقليل النقاط الزائدة (Ramer-Douglas-Peucker)
 */
export function simplifyPath(path: VectorPathData, tolerance: number = 2): VectorPathData {
  if (path.vertices.length <= 2) return clonePath(path);

  const points = path.vertices.map((v) => v.point);
  const simplifiedPoints: Point[] = [];

  function simplifySection(startIdx: number, endIdx: number) {
    let maxDist = 0;
    let maxIdx = startIdx;
    const pStart = points[startIdx]!;
    const pEnd = points[endIdx]!;

    for (let i = startIdx + 1; i < endIdx; i++) {
      const p = points[i]!;
      const dx = pEnd.x - pStart.x;
      const dy = pEnd.y - pStart.y;
      const mag = Math.hypot(dx, dy);
      const d =
        mag === 0
          ? distance(p, pStart)
          : Math.abs(dy * p.x - dx * p.y + pEnd.x * pStart.y - pEnd.y * pStart.x) / mag;

      if (d > maxDist) {
        maxDist = d;
        maxIdx = i;
      }
    }

    if (maxDist > tolerance) {
      simplifySection(startIdx, maxIdx);
      simplifySection(maxIdx, endIdx);
    } else {
      if (
        simplifiedPoints.length === 0 ||
        simplifiedPoints[simplifiedPoints.length - 1] !== pStart
      ) {
        simplifiedPoints.push(pStart);
      }
      simplifiedPoints.push(pEnd);
    }
  }

  simplifySection(0, points.length - 1);

  const result = clonePath(path);
  result.vertices = simplifiedPoints.map((p) => ({
    id: generateVertexId(),
    point: { ...p },
    type: 'corner',
  }));
  return result;
}

/**
 * تحويل بيانات المسار الفيكتوري إلى SVG Path d string
 */
export function vectorPathToSvgD(path: VectorPathData): string {
  if (path.vertices.length === 0) return '';

  const parts: string[] = [];
  const first = path.vertices[0]!;
  parts.push(`M ${first.point.x} ${first.point.y}`);

  for (let i = 1; i < path.vertices.length; i++) {
    const curr = path.vertices[i]!;
    const prev = path.vertices[i - 1]!;

    if (prev.outHandle || curr.inHandle) {
      const cp1 = prev.outHandle || prev.point;
      const cp2 = curr.inHandle || curr.point;
      parts.push(`C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${curr.point.x} ${curr.point.y}`);
    } else {
      parts.push(`L ${curr.point.x} ${curr.point.y}`);
    }
  }

  if (path.closed && path.vertices.length >= 2) {
    const last = path.vertices[path.vertices.length - 1]!;
    if (last.outHandle || first.inHandle) {
      const cp1 = last.outHandle || last.point;
      const cp2 = first.inHandle || first.point;
      parts.push(`C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${first.point.x} ${first.point.y}`);
    }
    parts.push('Z');
  }

  return parts.join(' ');
}

/**
 * استخراج مسار فيكتوري من SVG Path d string
 */
export function svgDToVectorPath(id: string, d: string): VectorPathData {
  const path: VectorPathData = { id, closed: false, vertices: [] };
  const commands = d.match(/[a-df-z]|[\d.-]+/gi);
  if (!commands) return path;

  let currentX = 0;
  let currentY = 0;
  const vertices: PathVertex[] = [];

  for (let i = 0; i < commands.length;) {
    const cmd = commands[i++]!;
    if (/^[mlcz]$/i.test(cmd)) {
      if (cmd === 'M' || cmd === 'm') {
        const x = parseFloat(commands[i++]!);
        const y = parseFloat(commands[i++]!);
        currentX = cmd === 'M' ? x : currentX + x;
        currentY = cmd === 'M' ? y : currentY + y;
        vertices.push({
          id: generateVertexId(),
          point: { x: currentX, y: currentY },
          type: 'corner',
        });
      } else if (cmd === 'L' || cmd === 'l') {
        const x = parseFloat(commands[i++]!);
        const y = parseFloat(commands[i++]!);
        currentX = cmd === 'L' ? x : currentX + x;
        currentY = cmd === 'L' ? y : currentY + y;
        vertices.push({
          id: generateVertexId(),
          point: { x: currentX, y: currentY },
          type: 'corner',
        });
      } else if (cmd === 'C' || cmd === 'c') {
        const x1 = parseFloat(commands[i++]!);
        const y1 = parseFloat(commands[i++]!);
        const x2 = parseFloat(commands[i++]!);
        const y2 = parseFloat(commands[i++]!);
        const x = parseFloat(commands[i++]!);
        const y = parseFloat(commands[i++]!);

        const prev = vertices[vertices.length - 1];
        if (prev) {
          prev.outHandle = {
            x: cmd === 'C' ? x1 : currentX + x1,
            y: cmd === 'C' ? y1 : currentY + y1,
          };
          prev.type = 'smooth';
        }

        currentX = cmd === 'C' ? x : currentX + x;
        currentY = cmd === 'C' ? y : currentY + y;
        vertices.push({
          id: generateVertexId(),
          point: { x: currentX, y: currentY },
          inHandle: {
            x: cmd === 'C' ? x2 : currentX - (x - x2),
            y: cmd === 'C' ? y2 : currentY - (y - y2),
          },
          type: 'smooth',
        });
      } else if (cmd === 'Z' || cmd === 'z') {
        path.closed = true;
      }
    }
  }

  path.vertices = vertices;
  return path;
}

/**
 * حساب الصندوق المحيط بالمسار الفيكتوري شاملاً الرؤوس والمقابض
 */
export function getVectorPathBounds(path: VectorPathData): Rect {
  if (path.vertices.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const v of path.vertices) {
    minX = Math.min(minX, v.point.x);
    minY = Math.min(minY, v.point.y);
    maxX = Math.max(maxX, v.point.x);
    maxY = Math.max(maxY, v.point.y);

    if (v.inHandle) {
      minX = Math.min(minX, v.inHandle.x);
      minY = Math.min(minY, v.inHandle.y);
      maxX = Math.max(maxX, v.inHandle.x);
      maxY = Math.max(maxY, v.inHandle.y);
    }
    if (v.outHandle) {
      minX = Math.min(minX, v.outHandle.x);
      minY = Math.min(minY, v.outHandle.y);
      maxX = Math.max(maxX, v.outHandle.x);
      maxY = Math.max(maxY, v.outHandle.y);
    }
  }

  return {
    x: minX,
    y: minY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
  };
}
