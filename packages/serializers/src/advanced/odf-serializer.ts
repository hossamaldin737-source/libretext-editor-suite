/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: odf-serializer.ts
 * 📂 المسار: /packages/serializers/src/advanced/odf-serializer.ts
 * 🎯 الهدف الرئيسي: محول تنسيقات OpenDocument (ODT / ODS / FODT) المكتبي
 *    المتوافق مع LibreOffice و Apache OpenOffice و Microsoft Word.
 * 📋 المعايير:
 *    - تحويل مستندات AST (DocNode) إلى حزم ODT ثنائية قياسية (OASIS OpenDocument v1.3).
 *    - دعم تصدير جداول الحسابات إلى ODS.
 *    - دعم توليد صيغة Flat XML FODT.
 *    - استخراج وتحليل نصوص ODT بدقة وسرعة.
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/odf-serializer.test.ts
 * 🏷️ المعرف: SER-007
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency OASIS OpenDocument Packaging Architecture using In-Memory ZIP Pipeline.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام الصارم بـ XML Namespaces لـ OpenDocument (office, text, table, dc, fo, style).
 *    2. تحصين جميع النصوص ضد تداخل أحرف XML (& < > " ').
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تحقق صارم من صحة وجود العقد والكتل.
 *    - دعم مستندات فارغة مع إخراج حاويات ODF صالحة.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/serializers/src/index.ts
 *    - 📦 التبعيات: packages/serializers/src/advanced/zip-engine.ts
 *    - 📄 مرتبط مباشر: packages/serializers/src/advanced/index.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - OdfSerializer.serializeToOdt: تحويل DocNode إلى بايتات ODT ثنائية (#L56)
 *    - OdfSerializer.serializeToFodt: تحويل DocNode إلى Flat XML FODT (#L141)
 *    - OdfSerializer.serializeGridToOds: تحويل مصفوفة ثنائية الأبعاد إلى حزمة ODS (#L168)
 *    - OdfSerializer.parseOdt: قراءة وتحليل بايتات ODT واستخراج النصوص (#L206)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { BlockNode, DocNode, InlineNode } from '@libretext/core';
import { ZipArchiveWriter, ZipArchiveReader } from './zip-engine';
import { OdfDrawSerializer, type OdfDrawOptions } from './odf-draw';
import type { SvgSceneSpec } from './svg-serializer';

export interface OdfExportOptions {
  readonly title?: string;
  readonly author?: string;
  readonly language?: string;
  readonly createdAt?: Date;
}

export class OdfSerializer {
  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * تحويل مستند AST إلى حزمة ODT ثنائية (Uint8Array)
   */
  public serializeToOdt(doc: DocNode, options: OdfExportOptions = {}): Uint8Array {
    const writer = new ZipArchiveWriter();
    const title = options.title || 'LibreText Document';
    const author = options.author || 'LibreText Suite';
    const dateStr = (options.createdAt || new Date()).toISOString();

    // 1. mimetype (أول ملف في الحزمة وبدون ضغط)
    writer.addFile('mimetype', 'application/vnd.oasis.opendocument.text');

    // 2. META-INF/manifest.xml
    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.text"/>
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
    <dc:title>${OdfSerializer.escapeXml(title)}</dc:title>
    <dc:creator>${OdfSerializer.escapeXml(author)}</dc:creator>
    <dc:date>${dateStr}</dc:date>
    <meta:generator>LibreText Modular Editor Suite</meta:generator>
  </office:meta>
</office:document-meta>`;
    writer.addFile('meta.xml', metaXml);

    // 4. styles.xml
    const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
  <office:styles>
    <style:default-style style:family="paragraph">
      <style:paragraph-properties fo:text-align="start"/>
      <style:text-properties fo:font-size="12pt" fo:color="#1e293b" style:font-name="Segoe UI, Cairo, sans-serif"/>
    </style:default-style>
    <style:style style:name="Bold" style:family="text">
      <style:text-properties fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="Italic" style:family="text">
      <style:text-properties fo:font-style="italic"/>
    </style:style>
    <style:style style:name="Underline" style:family="text">
      <style:text-properties style:text-underline-style="solid"/>
    </style:style>
    <style:style style:name="Strike" style:family="text">
      <style:text-properties style:text-line-through-style="solid"/>
    </style:style>
  </office:styles>
</office:document-styles>`;
    writer.addFile('styles.xml', stylesXml);

    // 5. content.xml
    const bodyContent = this.serializeDocContent(doc);
    const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.3">
  <office:body>
    <office:text>
      ${bodyContent}
    </office:text>
  </office:body>
</office:document-content>`;
    writer.addFile('content.xml', contentXml);

    return writer.build();
  }

  /**
   * تحويل مستند AST إلى Flat XML FODT
   */
  public serializeToFodt(doc: DocNode, options: OdfExportOptions = {}): string {
    const title = options.title || 'LibreText Document';
    const bodyContent = this.serializeDocContent(doc);

    return `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  office:version="1.3"
  office:mimetype="application/vnd.oasis.opendocument.text">
  <office:meta>
    <dc:title>${OdfSerializer.escapeXml(title)}</dc:title>
  </office:meta>
  <office:body>
    <office:text>
      ${bodyContent}
    </office:text>
  </office:body>
</office:document>`;
  }

  /**
   * توليد جدول ODS قياسي لحسابات وبيانات Calc
   */
  public serializeGridToOds(data: readonly (readonly (string | number)[])[], _options: OdfExportOptions = {}): Uint8Array {
    const writer = new ZipArchiveWriter();
    writer.addFile('mimetype', 'application/vnd.oasis.opendocument.spreadsheet');

    const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
  <manifest:file-entry manifest:full-path="/" manifest:version="1.3" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
  <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;
    writer.addFile('META-INF/manifest.xml', manifestXml);

    let rowsXml = '';
    for (const row of data) {
      rowsXml += '<table:table-row>';
      for (const cell of row) {
        const isNum = typeof cell === 'number';
        const valType = isNum ? 'float' : 'string';
        const valAttr = isNum ? ` office:value="${cell}"` : '';
        rowsXml += `<table:table-cell office:value-type="${valType}"${valAttr}><text:p>${OdfSerializer.escapeXml(String(cell))}</text:p></table:table-cell>`;
      }
      rowsXml += '</table:table-row>';
    }

    const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" office:version="1.3">
  <office:body>
    <office:spreadsheet>
      <table:table table:name="Sheet1">
        ${rowsXml}
      </table:table>
    </office:spreadsheet>
  </office:body>
</office:document-content>`;
    writer.addFile('content.xml', contentXml);

    return writer.build();
  }

  /**
   * قراءة واستخراج النصوص والفقرات من ملف ODT ثنائي
   */
  public parseOdt(buffer: ArrayBuffer | Uint8Array): string {
    const reader = new ZipArchiveReader(buffer);
    const files = reader.extractFiles();
    const contentXmlFile = files.find((f) => f.name === 'content.xml');

    if (!contentXmlFile) {
      throw new Error('الملف ليس مستند ODT صالح (حاوية content.xml مفقودة)');
    }

    const xml = contentXmlFile.text();
    const matches = xml.match(/<text:(p|h)[^>]*>(.*?)<\/text:(p|h)>/gi) || [];
    return matches
      .map((p) => p.replace(/<[^>]+>/g, '').trim())
      .filter((t) => t.length > 0)
      .join('\n\n');
  }

  /**
   * توليد حزمة OpenDocument Graphics (.odg) قياسية من مشهد الكانفا
   */
  public serializeCanvasToOdg(scene: SvgSceneSpec, options?: OdfDrawOptions): Uint8Array {
    const drawSerializer = new OdfDrawSerializer();
    return drawSerializer.serializeToOdg(scene, options);
  }

  /**
   * توليد مستند Flat XML FODG من مشهد الكانفا
   */
  public serializeCanvasToFodg(scene: SvgSceneSpec, options?: OdfDrawOptions): string {
    const drawSerializer = new OdfDrawSerializer();
    return drawSerializer.serializeToFodg(scene, options);
  }

  private serializeDocContent(doc: DocNode): string {
    return doc.content.map((block) => this.serializeBlock(block)).join('\n');
  }

  private serializeBlock(block: BlockNode): string {
    switch (block.type) {
      case 'heading':
        return `<text:h text:outline-level="${block.level}">${this.serializeInlineContent(block.content)}</text:h>`;
      case 'paragraph':
        return `<text:p>${this.serializeInlineContent(block.content)}</text:p>`;
      case 'blockquote':
        return `<text:p text:style-name="Quotations">${block.content.map((p) => this.serializeBlock(p)).join('')}</text:p>`;
      case 'code-block':
        return `<text:p text:style-name="Preformatted_20_Text">${OdfSerializer.escapeXml(block.code)}</text:p>`;
      case 'list': {
        const items = block.items
          .map((it) => {
            const body = it.content.map((c) => this.serializeBlock(c)).join('');
            return `<text:list-item>${body}</text:list-item>`;
          })
          .join('\n');
        return `<text:list text:style-name="${block.ordered ? 'Ordered' : 'Unordered'}">\n${items}\n</text:list>`;
      }
      case 'table':
        return this.serializeTable(block);
      case 'horizontal-rule':
        return `<text:p text:style-name="Horizontal_20_Line">---</text:p>`;
      default:
        return '';
    }
  }

  private serializeTable(block: {
    readonly rows: readonly { readonly cells: readonly { readonly content: readonly BlockNode[] }[] }[];
  }): string {
    if (block.rows.length === 0) return '';
    let tableXml = '<table:table table:name="Table1">';
    for (const row of block.rows) {
      tableXml += '<table:table-row>';
      for (const cell of row.cells) {
        const cellBody = cell.content.map((c) => this.serializeBlock(c)).join('');
        tableXml += `<table:table-cell>${cellBody || '<text:p/>'}</table:table-cell>`;
      }
      tableXml += '</table:table-row>';
    }
    tableXml += '</table:table-table>';
    return tableXml;
  }

  private serializeInlineContent(content: readonly InlineNode[]): string {
    return content.map((node) => this.serializeInline(node)).join('');
  }

  private serializeInline(node: InlineNode): string {
    switch (node.type) {
      case 'text':
        return OdfSerializer.escapeXml(node.text);
      case 'bold':
        return `<text:span text:style-name="Bold">${this.serializeInlineContent(node.content)}</text:span>`;
      case 'italic':
        return `<text:span text:style-name="Italic">${this.serializeInlineContent(node.content)}</text:span>`;
      case 'underline':
        return `<text:span text:style-name="Underline">${this.serializeInlineContent(node.content)}</text:span>`;
      case 'strikethrough':
        return `<text:span text:style-name="Strike">${this.serializeInlineContent(node.content)}</text:span>`;
      case 'code':
        return `<text:span text:style-name="Source_20_Text">${OdfSerializer.escapeXml(node.code)}</text:span>`;
      case 'link':
        return `<text:a xlink:type="simple" xlink:href="${OdfSerializer.escapeXml(node.href)}">${this.serializeInlineContent(node.content)}</text:a>`;
      default:
        return '';
    }
  }
}
