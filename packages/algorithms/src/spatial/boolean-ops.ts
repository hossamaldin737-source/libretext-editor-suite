/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: boolean-ops.ts
 * 📂 المسار: packages/algorithms/src/spatial/boolean-ops.ts
 * 🎯 الهدف الرئيسي: إجراء العمليات البولية الهندسية على المسارات والأشكال (Union, Subtract, Intersect, Exclude).
 * 📋 المعايير:
 *    - Union: دمج منطقتي الشكلين.
 *    - Subtract: طرح الشكل الثاني من الأول.
 *    - Intersect: استخراج منطقة التقاطع المشتركة.
 *    - Exclude: استخراج المناطق غير المتقاطعة (XOR).
 * 🏷️ المعرف: ALGO-015
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Vector Path Boolean Operations & Compound SVG Path Builder.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بحدود الأسطر (<400 سطر).
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type BooleanOpType = 'union' | 'subtract' | 'intersect' | 'exclude';

export interface GeometricShapeBounds {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly pathData?: string;
}

export interface BooleanResult {
  readonly bounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly compoundPath: string;
  readonly fillRule: 'nonzero' | 'evenodd';
}

export class BooleanOperationsEngine {
  /**
   * تنفيذ العملية البولية بين شكلين أو أكثر
   */
  static execute(
    shapeA: GeometricShapeBounds,
    shapeB: GeometricShapeBounds,
    op: BooleanOpType,
  ): BooleanResult {
    const minX = Math.min(shapeA.x, shapeB.x);
    const minY = Math.min(shapeA.y, shapeB.y);
    const maxX = Math.max(shapeA.x + shapeA.width, shapeB.x + shapeB.width);
    const maxY = Math.max(shapeA.y + shapeA.height, shapeB.y + shapeB.height);

    const defaultPathA =
      shapeA.pathData ||
      `M ${shapeA.x} ${shapeA.y} H ${shapeA.x + shapeA.width} V ${shapeA.y + shapeA.height} H ${shapeA.x} Z`;
    const defaultPathB =
      shapeB.pathData ||
      `M ${shapeB.x} ${shapeB.y} H ${shapeB.x + shapeB.width} V ${shapeB.y + shapeB.height} H ${shapeB.x} Z`;

    switch (op) {
      case 'union':
      case 'exclude':
        return {
          bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
          compoundPath: `${defaultPathA} ${defaultPathB}`,
          fillRule: op === 'exclude' ? 'evenodd' : 'nonzero',
        };

      case 'subtract':
        return {
          bounds: { x: shapeA.x, y: shapeA.y, width: shapeA.width, height: shapeA.height },
          compoundPath: `${defaultPathA} ${defaultPathB}`,
          fillRule: 'evenodd',
        };

      case 'intersect': {
        const intX = Math.max(shapeA.x, shapeB.x);
        const intY = Math.max(shapeA.y, shapeB.y);
        const intW = Math.max(0, Math.min(shapeA.x + shapeA.width, shapeB.x + shapeB.width) - intX);
        const intH = Math.max(
          0,
          Math.min(shapeA.y + shapeA.height, shapeB.y + shapeB.height) - intY,
        );
        return {
          bounds: { x: intX, y: intY, width: intW, height: intH },
          compoundPath: `M ${intX} ${intY} H ${intX + intW} V ${intY + intH} H ${intX} Z`,
          fillRule: 'nonzero',
        };
      }
    }
  }
}
