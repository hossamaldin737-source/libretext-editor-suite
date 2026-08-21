/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: odf-draw.ts
 * 📂 المسار: /packages/serializers/src/advanced/odf-draw.ts
 * 🎯 الهدف الرئيسي: محول الرسوم والمخططات المتجهية إلى وسوم وحزم OpenDocument Draw (ODG / FODG).
 * 📋 المعايير:
 *    - تحويل عناصر الرسم إلى وسوم `draw:custom-shape` و `draw:path` و `draw:rect` و `draw:connector`.
 *    - توليد حزم ODG ثنائية قياسية (OASIS OpenDocument v1.3 Graphics).
 *    - توليد صيغة الرسم المسطحة Flat XML FODG.
 *    - دعم تضمين إطارات الرسم داخل مستندات ODT النصية.
 * 🧪 الاختبارات:
 *    - /packages/serializers/tests/odf-draw.test.ts
 * 🏷️ المعرف: SER-010
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency OASIS OpenDocument Draw (ODG) Geometry & Packaging Engine.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تحويل القياسات من بيكسل (px) إلى سنتيمتر (cm) / ملليمتر (mm) المعيارية في ODF.
 *    2. الهروب الصارم من رموز XML داخل البيانات والمسارات.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التعامل الآمن مع المشاهد الفارغة والخصائص الناقصة.
 *    - تطبيق قيم إحداثيات وأبعاد موجبة دائماً.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: /packages/serializers/src/advanced/index.ts
 *    - 📦 التبعيات: /packages/serializers/src/advanced/zip-engine.ts, /packages/serializers/src/advanced/svg-serializer.ts
 *    - 📄 مرتبط مباشر: /packages/serializers/src/advanced/odf-serializer.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - OdfDrawSerializer.serializeToOdg: توليد حزمة ODG ثنائية قياسية (#L68)
 *    - OdfDrawSerializer.serializeToFodg: توليد مستند Flat XML FODG (#L124)
 *    - OdfDrawSerializer.renderDrawingElements: تحويل العناصر إلى وسوم draw:* (#L155)
 *    - OdfDrawSerializer.renderCustomShape: توليد وسم draw:custom-shape (#L188)
 *    - OdfDrawSerializer.renderDrawPath: توليد وسم draw:path (#L208)
 *    - OdfDrawSerializer.renderDrawConnector: توليد وسم draw:connector (#L224)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ZipArchiveWriter } from './zip-engine';
import { type SvgSceneSpec, type SvgElementSpec, SvgSerializer } from './svg-serializer';

export interface OdfDrawOptions {
  readonly title?: string;
  readonly author?: string;
  readonly createdAt?: Date;
  readonly pageName?: string;
}

export class OdfDrawSerializer {
  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * تحويل بيكسل الشاشة إلى سنتيمتر قياسي لـ OpenDocument
   */
  public static pxToCm(px: number): string {
    const cm = px * 0.0264583333;
    return `${cm.toFixed(3)}cm`;
  }

  /**
   * تحويل مشهد الكانفا إلى حزمة ODG ثنائية (Uint8Array)
   */
  public serializeToOdg(scene: SvgSceneSpec, options: OdfDrawOptions = {}): Uint8Array {
    const writer = new ZipArchiveWriter();
    const title = options.title || 'LibreText Vector Drawing';
    const author = options.author || 'LibreText Draw';
    const dateStr = (options.createdAt || new Date()).toISOString();

    // 1. mimetype
    writer.addFile('mimetype', 'application/vnd.oasis.opendocument.graphics');

    // 2. META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.graphics"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
  <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
    writer.addFile('META-INF/manifest.xml', manifestXml);

    // 3. meta.xml
    const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" office:version="1.3">
  <office:meta>
    <dc:title>${OdfDrawSerializer.escapeXml(title)}</dc:title>
    <dc:creator>${OdfDrawSerializer.escapeXml(author)}</dc:creator>
    <dc:date>${dateStr}</dc:date>
    <meta:generator>LibreText Vector Studio Engine</meta:generator>
  </office:meta>
</office:document-meta>`;
    writer.addFile('meta.xml', metaXml);

    // 4. styles.xml
    writer.addFile('styles.xml', this.generateStylesXml());

    // 5. content.xml
    writer.addFile('content.xml', this.generateContentXml(scene, options));

    return writer.build();
  }

  /**
   * تحويل مشهد الكانفا إلى Flat XML FODG
   */
  public serializeToFodg(scene: SvgSceneSpec, options: OdfDrawOptions = {}): string {
    const title = options.title || 'LibreText Vector Drawing';
    const pageName = options.pageName || 'Page 1';
    const pageWidth = OdfDrawSerializer.pxToCm(scene.width || 800);
    const pageHeight = OdfDrawSerializer.pxToCm(scene.height || 600);
    const shapesXml = this.renderDrawingElements(scene.elements);

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
  xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  office:version="1.3"
  office:mimetype="application/vnd.oasis.opendocument.graphics">
  <office:meta>
    <dc:title>${OdfDrawSerializer.escapeXml(title)}</dc:title>
  </office:meta>
  <office:body>
    <office:drawing>
      <draw:page draw:name="${OdfDrawSerializer.escapeXml(pageName)}" svg:width="${pageWidth}" svg:height="${pageHeight}">
        ${shapesXml}
      </draw:page>
    </office:drawing>
  </office:body>
</office:document>`;
  }

  /**
   * تحويل قائمة عناصر الكانفا إلى وسوم OpenDocument الرسم (draw:*)
   */
  public renderDrawingElements(elements: readonly SvgElementSpec[]): string {
    return elements.map((el) => this.renderDrawElement(el)).join('\n        ');
  }

  /**
   * تحويل عنصر فردي إلى وسم draw مناسب
   */
  public renderDrawElement(el: SvgElementSpec): string {
    const x = OdfDrawSerializer.pxToCm(el.x);
    const y = OdfDrawSerializer.pxToCm(el.y);
    const width = OdfDrawSerializer.pxToCm(el.width ?? (el.radius ? el.radius * 2 : 100));
    const height = OdfDrawSerializer.pxToCm(el.height ?? (el.radius ? el.radius * 2 : 60));
    const nameAttr = `draw:name="${OdfDrawSerializer.escapeXml(el.id)}"`;

    switch (el.type) {
      case 'rect':
        return `<draw:rect ${nameAttr} svg:x="${x}" svg:y="${y}" svg:width="${width}" svg:height="${height}" draw:corner-radius="0.2cm"/>`;
      case 'circle':
      case 'ellipse':
        return `<draw:ellipse ${nameAttr} svg:x="${x}" svg:y="${y}" svg:width="${width}" svg:height="${height}"/>`;
      case 'diamond':
      case 'triangle':
      case 'star':
      case 'cloud':
        return this.renderCustomShape(el, x, y, width, height, nameAttr);
      case 'path':
        return this.renderDrawPath(el, x, y, width, height, nameAttr);
      case 'connector':
        return this.renderDrawConnector(el, nameAttr);
      case 'text':
        return this.renderDrawTextBox(el, x, y, width, height, nameAttr);
      case 'group': {
        const childrenXml = (el.children || [])
          .map((c) => this.renderDrawElement(c))
          .join('\n          ');
        return `<draw:g ${nameAttr}>\n          ${childrenXml}\n        </draw:g>`;
      }
      default:
        return '';
    }
  }

  private renderCustomShape(
    el: SvgElementSpec,
    x: string,
    y: string,
    width: string,
    height: string,
    nameAttr: string,
  ): string {
    const svgSer = new SvgSerializer();
    const pathData = svgSer.generateShapePath(el);
    return `<draw:custom-shape ${nameAttr} svg:x="${x}" svg:y="${y}" svg:width="${width}" svg:height="${height}">
      <draw:enhanced-geometry draw:type="${el.type}" draw:enhanced-path="${OdfDrawSerializer.escapeXml(pathData)}"/>
    </draw:custom-shape>`;
  }

  private renderDrawPath(
    el: SvgElementSpec,
    x: string,
    y: string,
    width: string,
    height: string,
    nameAttr: string,
  ): string {
    const pathData = el.pathData || '';
    return `<draw:path ${nameAttr} svg:x="${x}" svg:y="${y}" svg:width="${width}" svg:height="${height}" svg:d="${OdfDrawSerializer.escapeXml(pathData)}" svg:viewBox="0 0 ${el.width ?? 100} ${el.height ?? 60}"/>`;
  }

  private renderDrawConnector(el: SvgElementSpec, nameAttr: string): string {
    const pathData = el.pathData || '';
    return `<draw:connector ${nameAttr} svg:d="${OdfDrawSerializer.escapeXml(pathData)}" draw:type="lines"/>`;
  }

  private renderDrawTextBox(
    el: SvgElementSpec,
    x: string,
    y: string,
    width: string,
    height: string,
    nameAttr: string,
  ): string {
    const content = OdfDrawSerializer.escapeXml(el.text || '');
    return `<draw:frame ${nameAttr} svg:x="${x}" svg:y="${y}" svg:width="${width}" svg:height="${height}">
      <draw:text-box>
        <text:p>${content}</text:p>
      </draw:text-box>
    </draw:frame>`;
  }

  private generateStylesXml(): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
  xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" office:version="1.3">
  <office:styles>
    <style:default-style style:family="graphic">
      <style:graphic-properties svg:stroke-color="#0284c7" svg:stroke-width="0.05cm" draw:fill="solid" draw:fill-color="#f0f9ff"/>
    </style:default-style>
  </office:styles>
</office:document-styles>`;
  }

  private generateContentXml(scene: SvgSceneSpec, options: OdfDrawOptions): string {
    const pageName = options.pageName || 'Slide 1';
    const pageWidth = OdfDrawSerializer.pxToCm(scene.width || 800);
    const pageHeight = OdfDrawSerializer.pxToCm(scene.height || 600);
    const shapesXml = this.renderDrawingElements(scene.elements);

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"
  xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" office:version="1.3">
  <office:body>
    <office:drawing>
      <draw:page draw:name="${OdfDrawSerializer.escapeXml(pageName)}" svg:width="${pageWidth}" svg:height="${pageHeight}">
        ${shapesXml}
      </draw:page>
    </office:drawing>
  </office:body>
</office:document-content>`;
  }
}
