/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: odf-package.ts
 * 📂 المسار: packages/serializers/src/odf-package.ts
 * 🎯 الهدف الرئيسي: حزمة التصدير والاستيراد الموحدة لملفات ODF
 *    باستخدام محرك ZIP المعزول بالكامل (Zero-Dependency).
 * 📋 المعايير:
 *    - تجميع كافة مستندات الحزمة في ملف أرشيف مضغوط واحد (.zip).
 *    - استخدام ZipArchiveWriter/Reader المعزول بدلاً من jszip.
 * 🏷️ المعرف: SER-006
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency ODF Package Engine
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ملف mimetype في حزم ODF يجب أن يكون الملف الأول.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التعامل الآمن مع الملفات الفارغة
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: ./advanced/zip-engine
 *    - 📄 مرتبط مباشر: packages/serializers/src/advanced/odf-serializer.ts
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {ZipArchiveWriter, ZipArchiveReader} from './advanced/zip-engine';

export interface OfficeSuitePackageData {
  readonly title: string;
  readonly writerContent: string;
  readonly calcData: {
    readonly rows: number;
    readonly cols: number;
    readonly cells: Record<string, {raw: string}>;
  };
  readonly impressSlides: readonly {readonly id: string; readonly title: string; readonly content: string}[];
  readonly drawElements: readonly {readonly id: string; readonly type: string; readonly x: number; readonly y: number}[];
  readonly baseRecords: readonly unknown[];
}

function parseJsonSafe<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export class OdfPackageEngine {
  static exportUnifiedOdfPackage(data: OfficeSuitePackageData): Uint8Array {
    const zip = new ZipArchiveWriter();

    zip.addFile('mimetype', 'application/vnd.oasis.opendocument.base');

    const manifest = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0">
 <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.text" manifest:full-path="writer/content.html"/>
 <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.spreadsheet" manifest:full-path="calc/data.json"/>
 <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.presentation" manifest:full-path="impress/slides.json"/>
 <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.graphics" manifest:full-path="draw/elements.json"/>
 <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.database" manifest:full-path="base/records.json"/>
</manifest:manifest>`;
    zip.addFile('META-INF/manifest.xml', manifest);

    zip.addFile('writer/content.html', `<!DOCTYPE html><html><head><title>${data.title} - Writer</title></head><body><h1>${data.title}</h1><div>${data.writerContent}</div></body></html>`);
    zip.addFile('calc/data.json', JSON.stringify(data.calcData, null, 2));
    zip.addFile('impress/slides.json', JSON.stringify(data.impressSlides, null, 2));
    zip.addFile('draw/elements.json', JSON.stringify(data.drawElements, null, 2));
    zip.addFile('base/records.json', JSON.stringify(data.baseRecords, null, 2));

    return zip.build();
  }

  static importUnifiedOdfPackage(buffer: Uint8Array): OfficeSuitePackageData {
    const reader = new ZipArchiveReader(buffer);
    const files = reader.extractFiles();
    const fileMap = new Map(files.map(f => [f.name, f]));

    const writerFile = fileMap.get('writer/content.html');
    const writerContent = writerFile ? writerFile.text() : '';

    const calcFile = fileMap.get('calc/data.json');
    const calcData = calcFile
      ? parseJsonSafe(calcFile.text(), {rows: 10, cols: 8, cells: {}})
      : {rows: 10, cols: 8, cells: {}};

    const impressFile = fileMap.get('impress/slides.json');
    const impressSlides = impressFile
      ? parseJsonSafe<readonly {readonly id: string; readonly title: string; readonly content: string}[]>(impressFile.text(), [])
      : [];

    const drawFile = fileMap.get('draw/elements.json');
    const drawElements = drawFile
      ? parseJsonSafe<readonly {readonly id: string; readonly type: string; readonly x: number; readonly y: number}[]>(drawFile.text(), [])
      : [];

    const baseFile = fileMap.get('base/records.json');
    const baseRecords = baseFile
      ? parseJsonSafe<readonly unknown[]>(baseFile.text(), [])
      : [];

    return {
      title: 'imported-document',
      writerContent,
      calcData,
      impressSlides,
      drawElements,
      baseRecords,
    };
  }
}
