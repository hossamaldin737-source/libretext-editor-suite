/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: zip-engine.ts
 * 📂 المسار: /packages/serializers/src/advanced/zip-engine.ts
 * 🎯 الهدف الرئيسي: محرك أرشيف ZIP معزول بالكامل بدون أي مكتبات خارجية
 *    لإنشاء وقراءة حزم ODT/ODS/ODF و DOCX.
 * 📋 المعايير:
 *    - Zero-dependency: الاعتماد فقط على TypedArrays و DataView و TextEncoder.
 *    - دعم بنية ZIP القياسية (Local File Header, Central Directory, EOCD).
 * 🧪 الاختبارات:
 *    - packages/serializers/tests/odf-serializer.test.ts
 * 🏷️ المعرف: SER-006
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure In-Memory ZIP Architecture with CRC32 Pre-calculation table.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ملف mimetype في حزم ODF يجب أن يكون الملف الأول وغير مضغوط (STORE).
 *    2. تفعيل Bit 11 في Flags لضمان سلامة نصوص UTF-8 العربية.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص دقيق لتوقيعات الهيدرز الثنائية.
 *    - التعامل الآمن مع المصفوفات الفارغة.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/serializers/src/index.ts
 *    - 📄 مرتبط مباشر: packages/serializers/src/advanced/odf-serializer.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - crc32: خوارزمية حساب البصمة CRC32 للملفات (#L54)
 *    - ZipArchiveWriter.addFile: إضافة ملف للأرشيف (#L80)
 *    - ZipArchiveWriter.build: تجميع حزمة ZIP الثنائية (#L89)
 *    - ZipArchiveReader.extractFiles: فك واستخراج ملفات الأرشيف (#L185)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ZipEntry {
  readonly name: string;
  readonly data: Uint8Array | string;
  readonly lastModified?: Date;
  readonly comment?: string;
}

export interface ExtractedZipFile {
  readonly name: string;
  readonly data: Uint8Array;
  readonly text: () => string;
  readonly size: number;
}

const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC32_TABLE[i] = c;
}

export function crc32(data: Uint8Array): number {
  let crc = 0 ^ -1;
  for (let i = 0; i < data.length; i++) {
    const byte = data[i] ?? 0;
    crc = (crc >>> 8) ^ (CRC32_TABLE[(crc ^ byte) & 0xff] ?? 0);
  }
  return (crc ^ -1) >>> 0;
}

interface ProcessedEntry {
  readonly nameBytes: Uint8Array;
  readonly dataBytes: Uint8Array;
  readonly crc32: number;
  readonly size: number;
  readonly time: number;
  readonly date: number;
}

export class ZipArchiveWriter {
  private entries: ZipEntry[] = [];
  private encoder = new TextEncoder();

  public addFile(name: string, data: Uint8Array | string, options: { lastModified?: Date; comment?: string } = {}): void {
    this.entries.push({
      name,
      data,
      lastModified: options.lastModified || new Date(),
      comment: options.comment,
    });
  }

  public build(): Uint8Array {
    const processed: ProcessedEntry[] = [];
    let localHeadersSize = 0;
    let centralDirSize = 0;

    for (const entry of this.entries) {
      const nameBytes = this.encoder.encode(entry.name);
      const dataBytes = typeof entry.data === 'string' ? this.encoder.encode(entry.data) : entry.data;
      const crc = crc32(dataBytes);
      const now = entry.lastModified || new Date();
      const time = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
      const date = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

      processed.push({
        nameBytes,
        dataBytes,
        crc32: crc,
        size: dataBytes.length,
        time,
        date,
      });

      localHeadersSize += 30 + nameBytes.length + dataBytes.length;
      centralDirSize += 46 + nameBytes.length;
    }

    const totalSize = localHeadersSize + centralDirSize + 22;
    const buffer = new Uint8Array(totalSize);
    const view = new DataView(buffer.buffer);
    let offset = 0;
    const localOffsets: number[] = [];

    for (const item of processed) {
      localOffsets.push(offset);
      view.setUint32(offset, 0x04034b50, true);
      view.setUint16(offset + 4, 20, true);
      view.setUint16(offset + 6, 0x0800, true);
      view.setUint16(offset + 8, 0, true);
      view.setUint16(offset + 10, item.time, true);
      view.setUint16(offset + 12, item.date, true);
      view.setUint32(offset + 14, item.crc32, true);
      view.setUint32(offset + 18, item.size, true);
      view.setUint32(offset + 22, item.size, true);
      view.setUint16(offset + 26, item.nameBytes.length, true);
      view.setUint16(offset + 28, 0, true);
      offset += 30;

      buffer.set(item.nameBytes, offset);
      offset += item.nameBytes.length;

      buffer.set(item.dataBytes, offset);
      offset += item.dataBytes.length;
    }

    const centralDirStart = offset;
    for (let i = 0; i < processed.length; i++) {
      const item = processed[i];
      const localOffset = localOffsets[i] ?? 0;
      if (!item) continue;

      view.setUint32(offset, 0x02014b50, true);
      view.setUint16(offset + 4, 20, true);
      view.setUint16(offset + 6, 20, true);
      view.setUint16(offset + 8, 0x0800, true);
      view.setUint16(offset + 10, 0, true);
      view.setUint16(offset + 12, item.time, true);
      view.setUint16(offset + 14, item.date, true);
      view.setUint32(offset + 16, item.crc32, true);
      view.setUint32(offset + 20, item.size, true);
      view.setUint32(offset + 24, item.size, true);
      view.setUint16(offset + 28, item.nameBytes.length, true);
      view.setUint16(offset + 30, 0, true);
      view.setUint16(offset + 32, 0, true);
      view.setUint16(offset + 34, 0, true);
      view.setUint16(offset + 36, 0, true);
      view.setUint32(offset + 38, 0, true);
      view.setUint32(offset + 42, localOffset, true);
      offset += 46;

      buffer.set(item.nameBytes, offset);
      offset += item.nameBytes.length;
    }

    const centralDirLength = offset - centralDirStart;
    view.setUint32(offset, 0x06054b50, true);
    view.setUint16(offset + 4, 0, true);
    view.setUint16(offset + 6, 0, true);
    view.setUint16(offset + 8, this.entries.length, true);
    view.setUint16(offset + 10, this.entries.length, true);
    view.setUint32(offset + 12, centralDirLength, true);
    view.setUint32(offset + 16, centralDirStart, true);
    view.setUint16(offset + 20, 0, true);

    return buffer;
  }
}

export class ZipArchiveReader {
  private buffer: Uint8Array;
  private view: DataView;
  private decoder = new TextDecoder('utf-8');

  constructor(data: Uint8Array | ArrayBuffer) {
    this.buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
  }

  public extractFiles(): ExtractedZipFile[] {
    const files: ExtractedZipFile[] = [];
    const eocdOffset = this.findEOCD();
    if (eocdOffset === -1) {
      return this.extractSequentially();
    }

    const totalEntries = this.view.getUint16(eocdOffset + 10, true);
    const centralDirOffset = this.view.getUint32(eocdOffset + 16, true);
    let currentCDOffset = centralDirOffset;

    for (let i = 0; i < totalEntries; i++) {
      if (currentCDOffset + 46 > this.buffer.length) break;
      const signature = this.view.getUint32(currentCDOffset, true);
      if (signature !== 0x02014b50) break;

      const compSize = this.view.getUint32(currentCDOffset + 20, true);
      const nameLength = this.view.getUint16(currentCDOffset + 28, true);
      const extraLength = this.view.getUint16(currentCDOffset + 30, true);
      const commentLength = this.view.getUint16(currentCDOffset + 32, true);
      const localHeaderOffset = this.view.getUint32(currentCDOffset + 42, true);

      const nameBytes = this.buffer.subarray(currentCDOffset + 46, currentCDOffset + 46 + nameLength);
      const filename = this.decoder.decode(nameBytes);

      if (!filename.endsWith('/')) {
        const fileData = this.extractFileData(localHeaderOffset, compSize);
        files.push({
          name: filename,
          data: fileData,
          size: fileData.length,
          text: () => this.decoder.decode(fileData),
        });
      }
      currentCDOffset += 46 + nameLength + extraLength + commentLength;
    }
    return files;
  }

  private extractFileData(localOffset: number, size: number): Uint8Array {
    if (localOffset + 30 > this.buffer.length) return new Uint8Array(0);
    const localSig = this.view.getUint32(localOffset, true);
    if (localSig !== 0x04034b50) return new Uint8Array(0);

    const nameLen = this.view.getUint16(localOffset + 26, true);
    const extraLen = this.view.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + nameLen + extraLen;
    return this.buffer.slice(dataStart, dataStart + size);
  }

  private findEOCD(): number {
    for (let i = this.buffer.length - 22; i >= Math.max(0, this.buffer.length - 65557); i--) {
      if (this.view.getUint32(i, true) === 0x06054b50) {
        return i;
      }
    }
    return -1;
  }

  private extractSequentially(): ExtractedZipFile[] {
    const files: ExtractedZipFile[] = [];
    let offset = 0;
    while (offset + 30 <= this.buffer.length) {
      const sig = this.view.getUint32(offset, true);
      if (sig !== 0x04034b50) break;
      const compSize = this.view.getUint32(offset + 18, true);
      const nameLength = this.view.getUint16(offset + 26, true);
      const extraLength = this.view.getUint16(offset + 28, true);
      const nameBytes = this.buffer.subarray(offset + 30, offset + 30 + nameLength);
      const filename = this.decoder.decode(nameBytes);
      const dataStart = offset + 30 + nameLength + extraLength;
      const fileData = this.buffer.slice(dataStart, dataStart + compSize);

      if (!filename.endsWith('/')) {
        files.push({
          name: filename,
          data: fileData,
          size: fileData.length,
          text: () => this.decoder.decode(fileData),
        });
      }
      offset = dataStart + compSize;
    }
    return files;
  }
}
