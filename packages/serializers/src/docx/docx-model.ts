/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: docx-model.ts
 * 📂 المسار: packages/serializers/src/docx/docx-model.ts
 * 🎯 الهدف الرئيسي: النماذج والعناصر الأساسية لتوليد ملفات Word OOXML بدون اعتماديات
 * 📋 المعايير: Zero external dependencies, pure TypeScript, OOXML compliant
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-converter.test.ts
 * 🏷️ المعرف: SER-012
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Lightweight OOXML DOM Model + In-Memory Zip Stream Packager
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الهروب الصحيح لمحرارف XML لتجنب تلف مستندات Word
 *    2. توافق تام مع واجهات docx القياسية
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ZipArchiveWriter } from '../advanced/zip-engine';

export enum HeadingLevel {
  HEADING_1 = 'Heading1',
  HEADING_2 = 'Heading2',
  HEADING_3 = 'Heading3',
  HEADING_4 = 'Heading4',
  HEADING_5 = 'Heading5',
  HEADING_6 = 'Heading6',
  TITLE = 'Title',
}

export enum AlignmentType {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  JUSTIFIED = 'both',
  START = 'start',
  END = 'end',
}

export enum LevelFormat {
  DECIMAL = 'decimal',
  LOWER_LETTER = 'lowerLetter',
  UPPER_LETTER = 'upperLetter',
  LOWER_ROMAN = 'lowerRoman',
  UPPER_ROMAN = 'upperRoman',
  BULLET = 'bullet',
}

export enum BorderStyle {
  SINGLE = 'single',
  DASHED = 'dashed',
  DOTTED = 'dotted',
  DOUBLE = 'double',
  NONE = 'none',
}

export enum WidthType {
  PERCENTAGE = 'pct',
  DXA = 'dxa',
  AUTO = 'auto',
}

export interface BorderOptions {
  style?: BorderStyle;
  size?: number;
  color?: string;
  space?: number;
}

export interface TextRunOptions {
  text: string;
  bold?: boolean;
  italics?: boolean;
  font?: string;
  size?: number;
  color?: string;
  style?: string;
  shading?: { fill?: string };
}

export class TextRun {
  readonly text: string;
  readonly bold?: boolean;
  readonly italics?: boolean;
  readonly font?: string;
  readonly size?: number;
  readonly color?: string;
  readonly style?: string;
  readonly shading?: { fill?: string };

  constructor(options: TextRunOptions | string) {
    if (typeof options === 'string') {
      this.text = options;
    } else {
      this.text = options.text;
      this.bold = options.bold;
      this.italics = options.italics;
      this.font = options.font;
      this.size = options.size;
      this.color = options.color;
      this.style = options.style;
      this.shading = options.shading;
    }
  }

  toXml(): string {
    const rPr: string[] = [];
    if (this.bold) rPr.push('<w:b/>');
    if (this.italics) rPr.push('<w:i/>');
    if (this.font)
      rPr.push(
        `<w:rFonts w:ascii="${escapeXml(this.font)}" w:hAnsi="${escapeXml(this.font)}" w:cs="${escapeXml(this.font)}"/>`,
      );
    if (this.size) rPr.push(`<w:sz w:val="${this.size * 2}"/>`);
    if (this.color) rPr.push(`<w:color w:val="${this.color.replace('#', '')}"/>`);
    if (this.shading?.fill)
      rPr.push(
        `<w:shd w:val="clear" w:color="auto" w:fill="${this.shading.fill.replace('#', '')}"/>`,
      );
    if (this.style) rPr.push(`<w:rStyle w:val="${escapeXml(this.style)}"/>`);

    const props = rPr.length > 0 ? `<w:rPr>${rPr.join('')}</w:rPr>` : '';
    return `<w:r>${props}<w:t xml:space="preserve">${escapeXml(this.text)}</w:t></w:r>`;
  }
}

export interface ExternalHyperlinkOptions {
  link: string;
  children: TextRun[];
}

export class ExternalHyperlink {
  readonly link: string;
  readonly children: TextRun[];
  relId?: string;

  constructor(options: ExternalHyperlinkOptions) {
    this.link = options.link;
    this.children = options.children;
  }

  toXml(): string {
    const id = this.relId || 'rIdLink';
    const inner = this.children.map((c) => c.toXml()).join('');
    return `<w:hyperlink r:id="${id}" w:history="1">${inner}</w:hyperlink>`;
  }
}

export interface ParagraphOptions {
  text?: string;
  children?: Array<TextRun | ExternalHyperlink>;
  heading?: HeadingLevel;
  style?: string;
  spacing?: { before?: number; after?: number; line?: number };
  bidirectional?: boolean;
  alignment?: AlignmentType;
  bullet?: { level: number };
  numbering?: { reference: string; level: number };
  border?: { bottom?: BorderOptions; top?: BorderOptions };
  shading?: { fill?: string };
}

export class Paragraph {
  readonly children: Array<TextRun | ExternalHyperlink>;
  readonly heading?: HeadingLevel;
  readonly style?: string;
  readonly spacing?: { before?: number; after?: number; line?: number };
  readonly bidirectional?: boolean;
  readonly alignment?: AlignmentType;
  readonly bullet?: { level: number };
  readonly numbering?: { reference: string; level: number };
  readonly border?: { bottom?: BorderOptions; top?: BorderOptions };
  readonly shading?: { fill?: string };

  constructor(options: ParagraphOptions | string) {
    if (typeof options === 'string') {
      this.children = [new TextRun(options)];
    } else {
      this.children =
        options.children || (options.text !== undefined ? [new TextRun(options.text)] : []);
      this.heading = options.heading;
      this.style = options.style;
      this.spacing = options.spacing;
      this.bidirectional = options.bidirectional;
      this.alignment = options.alignment;
      this.bullet = options.bullet;
      this.numbering = options.numbering;
      this.border = options.border;
      this.shading = options.shading;
    }
  }

  toXml(): string {
    const pPr: string[] = [];
    if (this.style) pPr.push(`<w:pStyle w:val="${escapeXml(this.style)}"/>`);
    if (this.heading) pPr.push(`<w:pStyle w:val="${escapeXml(this.heading)}"/>`);
    if (this.bidirectional) pPr.push('<w:bidi/>');
    if (this.alignment) pPr.push(`<w:jc w:val="${this.alignment}"/>`);
    if (this.spacing) {
      const b = this.spacing.before !== undefined ? ` w:before="${this.spacing.before}"` : '';
      const a = this.spacing.after !== undefined ? ` w:after="${this.spacing.after}"` : '';
      const l = this.spacing.line !== undefined ? ` w:line="${this.spacing.line}"` : '';
      pPr.push(`<w:spacing${b}${a}${l}/>`);
    }
    if (this.numbering) {
      pPr.push(`<w:numPr><w:ilvl w:val="${this.numbering.level}"/><w:numId w:val="1"/></w:numPr>`);
    } else if (this.bullet) {
      pPr.push(`<w:numPr><w:ilvl w:val="${this.bullet.level}"/><w:numId w:val="2"/></w:numPr>`);
    }
    if (this.shading?.fill) {
      pPr.push(
        `<w:shd w:val="clear" w:color="auto" w:fill="${this.shading.fill.replace('#', '')}"/>`,
      );
    }
    if (this.border?.bottom) {
      const b = this.border.bottom;
      pPr.push(
        `<w:pBdr><w:bottom w:val="${b.style || 'single'}" w:sz="${b.size || 6}" w:space="${b.space || 1}" w:color="${b.color || 'auto'}"/></w:pBdr>`,
      );
    }

    const pPrXml = pPr.length > 0 ? `<w:pPr>${pPr.join('')}</w:pPr>` : '';
    const bodyXml = this.children.map((c) => c.toXml()).join('');
    return `<w:p>${pPrXml}${bodyXml}</w:p>`;
  }
}

export interface TableCellOptions {
  children: Paragraph[];
  shading?: { fill?: string };
}

export class TableCell {
  readonly children: Paragraph[];
  readonly shading?: { fill?: string };

  constructor(options: TableCellOptions) {
    this.children = options.children;
    this.shading = options.shading;
  }

  toXml(): string {
    const tcPr: string[] = [];
    if (this.shading?.fill) {
      tcPr.push(
        `<w:shd w:val="clear" w:color="auto" w:fill="${this.shading.fill.replace('#', '')}"/>`,
      );
    }
    const tcPrXml = tcPr.length > 0 ? `<w:tcPr>${tcPr.join('')}</w:tcPr>` : '';
    const bodyXml = this.children.map((c) => c.toXml()).join('');
    return `<w:tc>${tcPrXml}${bodyXml}</w:tc>`;
  }
}

export interface TableRowOptions {
  children: TableCell[];
}

export class TableRow {
  readonly children: TableCell[];

  constructor(options: TableRowOptions) {
    this.children = options.children;
  }

  toXml(): string {
    const bodyXml = this.children.map((c) => c.toXml()).join('');
    return `<w:tr>${bodyXml}</w:tr>`;
  }
}

export interface TableOptions {
  rows: TableRow[];
  width?: { size: number; type: WidthType };
  borders?: {
    top?: BorderOptions;
    bottom?: BorderOptions;
    left?: BorderOptions;
    right?: BorderOptions;
    insideHorizontal?: BorderOptions;
    insideVertical?: BorderOptions;
  };
}

export class Table {
  readonly rows: TableRow[];
  readonly width?: { size: number; type: WidthType };
  readonly borders?: TableOptions['borders'];

  constructor(options: TableOptions) {
    this.rows = options.rows;
    this.width = options.width;
    this.borders = options.borders;
  }

  toXml(): string {
    const tblPr: string[] = [];
    tblPr.push('<w:tblW w:w="5000" w:type="pct"/>');
    tblPr.push('<w:tblBorders>');
    tblPr.push('<w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>');
    tblPr.push('<w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>');
    tblPr.push('<w:left w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>');
    tblPr.push('<w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>');
    tblPr.push('<w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>');
    tblPr.push('<w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>');
    tblPr.push('</w:tblBorders>');

    const rowsXml = this.rows.map((r) => r.toXml()).join('');
    return `<w:tbl><w:tblPr>${tblPr.join('')}</w:tblPr>${rowsXml}</w:tbl>`;
  }
}

export type DocxBodyElement = Paragraph | Table;

export interface ISectionOptions {
  properties?: {
    page?: {
      margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };
      size?: {
        width?: number;
        height?: number;
      };
    };
  };
  children: DocxBodyElement[];
}

export interface DocumentProperties {
  creator?: string;
  title?: string;
  description?: string;
  subject?: string;
  keywords?: string;
  numbering?: {
    config: Array<{
      reference: string;
      levels: Array<{
        level: number;
        format: LevelFormat;
        text: string;
        alignment: AlignmentType;
        style?: {
          paragraph?: {
            indent?: { left?: number; hanging?: number };
          };
        };
      }>;
    }>;
  };
  sections: ISectionOptions[];
}

export class Document {
  readonly properties: DocumentProperties;

  constructor(properties: DocumentProperties) {
    this.properties = properties;
  }
}

export class Packer {
  static async toBuffer(doc: Document): Promise<Uint8Array> {
    const writer = new ZipArchiveWriter();

    // 1. [Content_Types].xml
    writer.addFile(
      '[Content_Types].xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`,
    );

    // 2. _rels/.rels
    writer.addFile(
      '_rels/.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`,
    );

    // 3. docProps/core.xml
    const title = escapeXml(doc.properties.title || 'Document');
    const creator = escapeXml(doc.properties.creator || 'LibreText DOCX Engine');
    writer.addFile(
      'docProps/core.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/">
  <dc:title>${title}</dc:title>
  <dc:creator>${creator}</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`,
    );

    // 4. word/styles.xml
    writer.addFile(
      'word/styles.xml',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Traditional Arabic"/>
        <w:sz w:val="22"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="36"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:rPr><w:b/><w:sz w:val="28"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>
</w:styles>`,
    );

    // 5. word/_rels/document.xml.rels
    writer.addFile(
      'word/_rels/document.xml.rels',
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    );

    // 6. word/document.xml
    const sectionsXml: string[] = [];
    for (const section of doc.properties.sections) {
      for (const child of section.children) {
        sectionsXml.push(child.toXml());
      }
    }

    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${sectionsXml.join('\n    ')}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    writer.addFile('word/document.xml', docXml);
    return writer.build();
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
