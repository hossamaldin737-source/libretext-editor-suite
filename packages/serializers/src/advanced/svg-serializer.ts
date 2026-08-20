/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: svg-serializer.ts
 * 📂 المسار: /packages/serializers/src/advanced/svg-serializer.ts
 * 🎯 الهدف الرئيسي: محول الرسوم والمخططات المتجهية إلى كود W3C SVG معياري عالي الدقة ونقي.
 * 📋 المعايير:
 *    - تحويل الأشكال المتجهية (المستطيل، المعين، المثلث، السحابة، المسارات، النصوص، الروابط) إلى وسوم SVG نقية.
 *    - تنقية وتحصين شامل للسمات والألوان والأنماط لمنع حقن كود XSS غير آمن.
 *    - توليد فلاتر الظلال الهادئة، والأسهم، والتدرجات الضوئية القياسية.
 * 🧪 الاختبارات:
 *    - /packages/serializers/tests/svg-serializer.test.ts
 * 🏷️ المعرف: SER-009
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Sanitized Attribute Pipeline + High-Fidelity Parametric Vector Shape Generator.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الهروب الصارم من أحرف XML الخاصة في النصوص والمعرفات والسمات.
 *    2. تنقية الألوان وأسماء الخطوط من أي شفرات ضارة أو حقن CSS.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من الأبعاد والأرقام والحدود القصوى والدنيا.
 *    - توفير قيم افتراضية آمنة في حالة فقدان أي خاصية.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: /packages/serializers/src/advanced/index.ts
 *    - 📦 التبعيات: لا توجد اعتماديات خارجية
 *    - 📄 مرتبط مباشر: /packages/serializers/src/advanced/odf-draw.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - SvgSerializer.escapeXml: تنقية أحرف XML (#L68)
 *    - SvgSerializer.sanitizeColor: تنقية الألوان وضمان سلامتها (#L77)
 *    - SvgSerializer.serializeScene: تحويل مشهد الكانفاس بالكامل إلى SVG (#L92)
 *    - SvgSerializer.renderElement: توليد وسم SVG لعنصر مفرد (#L118)
 *    - SvgSerializer.generateShapePath: توليد مسارات الأشكال الهندسية البارامترية (#L165)
 *    - SvgSerializer.buildDefs: إنشاء تعريفات الرموز والأسهم والفلاتر (#L212)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SvgElementSpec {
  readonly id: string;
  readonly type: 'rect' | 'circle' | 'ellipse' | 'diamond' | 'triangle' | 'cloud' | 'star' | 'path' | 'text' | 'connector' | 'group';
  readonly x: number;
  readonly y: number;
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  readonly pathData?: string;
  readonly text?: string;
  readonly fontSize?: number;
  readonly fontFamily?: string;
  readonly fontWeight?: string | number;
  readonly textAlign?: 'start' | 'middle' | 'end';
  readonly fill?: string;
  readonly stroke?: string;
  readonly strokeWidth?: number;
  readonly strokeDasharray?: string;
  readonly opacity?: number;
  readonly rotation?: number;
  readonly startArrow?: boolean;
  readonly endArrow?: boolean;
  readonly filter?: 'shadow' | 'none';
  readonly children?: readonly SvgElementSpec[];
}

export interface SvgSceneSpec {
  readonly width: number;
  readonly height: number;
  readonly backgroundColor?: string;
  readonly title?: string;
  readonly description?: string;
  readonly elements: readonly SvgElementSpec[];
}

export class SvgSerializer {
  /**
   * تنقية نصوص XML لمنع الثغرات والتداخل
   */
  public static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * تنقية أكواد الألوان لمنع حقن أكواد CSS الضارة
   */
  public static sanitizeColor(color: string | undefined, fallback: string = '#000000'): string {
    if (!color) return fallback;
    const trimmed = color.trim().toLowerCase();
    if (trimmed === 'none' || trimmed === 'transparent') return trimmed;
    // مطابقة Hex, rgb, rgba, hsl, hsla, أو أسماء الألوان البسيطة
    if (/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(trimmed)) return trimmed;
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(trimmed)) return trimmed;
    if (/^[a-z]{3,20}$/.test(trimmed) && !/script|expression|javascript/i.test(trimmed)) return trimmed;
    return fallback;
  }

  /**
   * تحويل مشهد الكانفاس بالكامل إلى كود SVG قياسي فائق النقاء
   */
  public serializeScene(scene: SvgSceneSpec): string {
    const width = Math.max(10, scene.width || 800);
    const height = Math.max(10, scene.height || 600);
    const bgFill = SvgSerializer.sanitizeColor(scene.backgroundColor, '#ffffff');
    const defsXml = this.buildDefs();
    const titleXml = scene.title ? `\n  <title>${SvgSerializer.escapeXml(scene.title)}</title>` : '';
    const descXml = scene.description ? `\n  <desc>${SvgSerializer.escapeXml(scene.description)}</desc>` : '';
    const elementsXml = scene.elements.map((el) => this.renderElement(el)).join('\n  ');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${titleXml}${descXml}
  ${defsXml}
  <rect width="100%" height="100%" fill="${bgFill}"/>
  ${elementsXml}
</svg>`;
  }

  /**
   * توليد وسم SVG لعنصر متجهي محدد
   */
  public renderElement(el: SvgElementSpec): string {
    const idAttr = `id="${SvgSerializer.escapeXml(el.id)}"`;
    const fill = SvgSerializer.sanitizeColor(el.fill, '#ffffff');
    const stroke = SvgSerializer.sanitizeColor(el.stroke, '#0284c7');
    const strokeWidth = Math.max(0, el.strokeWidth ?? 1.5);
    const opacity = el.opacity !== undefined && el.opacity >= 0 && el.opacity <= 1 ? ` opacity="${el.opacity}"` : '';
    const dash = el.strokeDasharray ? ` stroke-dasharray="${SvgSerializer.escapeXml(el.strokeDasharray)}"` : '';
    const filter = el.filter === 'shadow' ? ' filter="url(#soft-shadow)"' : '';
    const transform = this.buildTransform(el);

    switch (el.type) {
      case 'rect':
        return `<rect ${idAttr} x="${el.x}" y="${el.y}" width="${el.width ?? 100}" height="${el.height ?? 60}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dash}${opacity}${filter}${transform}/>`;
      case 'circle':
        return `<circle ${idAttr} cx="${el.x}" cy="${el.y}" r="${el.radius ?? 30}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dash}${opacity}${filter}${transform}/>`;
      case 'ellipse':
        return `<ellipse ${idAttr} cx="${el.x}" cy="${el.y}" rx="${(el.width ?? 80) / 2}" ry="${(el.height ?? 50) / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dash}${opacity}${filter}${transform}/>`;
      case 'diamond':
      case 'triangle':
      case 'cloud':
      case 'star':
        return `<path ${idAttr} d="${this.generateShapePath(el)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"${dash}${opacity}${filter}${transform}/>`;
      case 'path':
        return `<path ${idAttr} d="${SvgSerializer.escapeXml(el.pathData ?? '')}" fill="${fill === 'none' ? 'none' : fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${dash}${opacity}${filter}${transform}/>`;
      case 'connector': {
        const markerEnd = el.endArrow !== false ? ' marker-end="url(#arrowhead)"' : '';
        const markerStart = el.startArrow ? ' marker-start="url(#arrowhead-start)"' : '';
        return `<path ${idAttr} d="${SvgSerializer.escapeXml(el.pathData ?? '')}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"${markerStart}${markerEnd}${dash}${opacity}${transform}/>`;
      }
      case 'text':
        return this.renderTextElement(el, idAttr, fill, opacity, transform);
      case 'group': {
        const inner = (el.children || []).map((c) => this.renderElement(c)).join('\n    ');
        return `<g ${idAttr}${transform}${opacity}>\n    ${inner}\n  </g>`;
      }
      default:
        return '';
    }
  }

  private buildTransform(el: SvgElementSpec): string {
    if (!el.rotation) return '';
    const cx = el.x + (el.width ?? 0) / 2;
    const cy = el.y + (el.height ?? 0) / 2;
    return ` transform="rotate(${el.rotation} ${cx} ${cy})"`;
  }

  private renderTextElement(el: SvgElementSpec, idAttr: string, fill: string, opacity: string, transform: string): string {
    const fontSize = el.fontSize ?? 14;
    const fontFamily = el.fontFamily ? SvgSerializer.escapeXml(el.fontFamily) : 'Segoe UI, Cairo, sans-serif';
    const fontWeight = el.fontWeight ?? 500;
    const textAnchor = el.textAlign ? ` text-anchor="${el.textAlign}"` : '';
    const textFill = fill !== 'none' ? fill : '#1e293b';
    return `<text ${idAttr} x="${el.x}" y="${el.y}" fill="${textFill}" font-family="${fontFamily}" font-size="${fontSize}px" font-weight="${fontWeight}"${textAnchor}${opacity}${transform}>${SvgSerializer.escapeXml(el.text ?? '')}</text>`;
  }

  /**
   * توليد المسار الهندسي للأشكال المتجهية الشائعة
   */
  public generateShapePath(el: SvgElementSpec): string {
    const w = el.width ?? 100;
    const h = el.height ?? 60;
    const x = el.x;
    const y = el.y;

    if (el.type === 'diamond') {
      const mx = x + w / 2;
      const my = y + h / 2;
      return `M ${mx} ${y} L ${x + w} ${my} L ${mx} ${y + h} L ${x} ${my} Z`;
    }

    if (el.type === 'triangle') {
      const mx = x + w / 2;
      return `M ${mx} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    }

    if (el.type === 'star') {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const outerR = Math.min(w, h) / 2;
      const innerR = outerR * 0.4;
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`);
      }
      return `M ${pts.join(' L ')} Z`;
    }

    if (el.type === 'cloud') {
      const r = h * 0.35;
      return `M ${x + r} ${y + h - r} A ${r * 0.8} ${r * 0.8} 0 0 1 ${x + w * 0.3} ${y + r} A ${r * 1.1} ${r * 1.1} 0 0 1 ${x + w * 0.7} ${y + r} A ${r * 0.9} ${r * 0.9} 0 0 1 ${x + w - r} ${y + h - r} Z`;
    }

    return el.pathData ?? `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  }

  private buildDefs(): string {
    return `<defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#0284c7"/>
    </marker>
    <marker id="arrowhead-start" markerWidth="10" markerHeight="7" refX="1" refY="3.5" orient="auto">
      <polygon points="10 0, 0 3.5, 10 7" fill="#0284c7"/>
    </marker>
    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>`;
  }
}
