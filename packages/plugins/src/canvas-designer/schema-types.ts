/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: schema-types.ts
 * 📂 المسار: packages/plugins/src/canvas-designer/schema-types.ts
 * 🎯 الهدف الرئيسي: تعريف المخطط البنائي والتصنيفات لـ 23 نوع عنصر كانفا.
 * 📋 المعايير:
 *    - تغطية 23 نوع عنصر: أشكال هندسية، كتل تدفقية، مسارات حرة، وصلات ذكية، وحاويات.
 *    - تعريف دقيق ومحكم لخصائص ومحددات كل عنصر (Constraints & Default Props).
 * 🏷️ المعرف: PLUG-009
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type-Safe 23-Element Canvas Schema with Hierarchical Constraints & Property Bounds.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بحدود الأسطر (<400 سطر).
 *    2. ضمان دعم كافة أشكال Draw / Flowchart / Impress.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * 23 نوع معتمد لعناصر الكانفا ومصمم المخططات
 */
export type CanvasElementType =
  // 1. الأشكال الهندسية الأساسية (Basic Shapes - 6)
  | 'rect'
  | 'rounded-rect'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'diamond'

  // 2. الأشكال المتقدمة والمضلعات (Advanced Polygons & Stars - 4)
  | 'parallelogram'
  | 'trapezoid'
  | 'cylinder'
  | 'star'

  // 3. كتل المخططات التدفقية والمعمارية (Flowchart & Architectural Blocks - 5)
  | 'flowchart-process'
  | 'flowchart-decision'
  | 'flowchart-data'
  | 'cloud'
  | 'actor'

  // 4. عناصر النصوص والوسائط والملاحظات (Text, Media & Sticky - 4)
  | 'text'
  | 'sticky-note'
  | 'callout'
  | 'image-frame'

  // 5. المسارات الحرة والوصلات الذكية والحاويات (Paths, Connectors & Containers - 4)
  | 'freehand-path'
  | 'bezier-curve'
  | 'smart-connector'
  | 'group-container';

export type ElementCategory = 'basic' | 'polygon' | 'flowchart' | 'text-media' | 'connector-group';

export interface ElementSchemaDefinition {
  readonly type: CanvasElementType;
  readonly category: ElementCategory;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly defaultWidth: number;
  readonly defaultHeight: number;
  readonly minWidth: number;
  readonly minHeight: number;
  readonly defaultFill: string;
  readonly defaultStroke: string;
  readonly defaultStrokeWidth: number;
  readonly hasText: boolean;
  readonly resizable: boolean;
  readonly rotatable: boolean;
  readonly isContainer?: boolean;
}

export interface CanvasElementInstance {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  groupId?: string | null;
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  locked?: boolean;
  visible?: boolean;
  // خصائص متقدمة مخصصة
  radius?: number;
  pathData?: string;
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
  startArrow?: boolean;
  endArrow?: boolean;
  routingType?: 'straight' | 'orthogonal' | 'curved';
  points?: number; // لنجوم ومضلعات
  customData?: Record<string, unknown>;
}
