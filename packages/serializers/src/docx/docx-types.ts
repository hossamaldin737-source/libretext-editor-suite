/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: docx-types.ts
 * 📂 المسار: packages/serializers/src/docx/docx-types.ts
 * 🎯 الهدف الرئيسي: أنواع وثوابت محول DOCX
 * 📋 المعايير: Zero dependencies, Type-safe, Documented constants
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-types.test.ts
 * 🏷️ المعرف: SER-006-01
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Constants Registry + Type-Safe Configuration
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. DOCX يستخدم TWIPs (1/20 of a point) - 1 inch = 1440 TWIPs
 *    2. Heading levels مقيدة 1-6 في Word
 *    3. حجم الصفحة الافتراضي A4 (210mm × 297mm)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - as const للثوابت لمنع الطفرات
 *    - Validation helpers للأحجام والهوامش
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { HeadingLevel, type HeadingLevel as HL } from './docx-model';

// ─────────────────────────────────────────────────────────────────────────────
// خيارات التحويل
// ─────────────────────────────────────────────────────────────────────────────

export type PageSize = 'A4' | 'LETTER' | 'LEGAL';

export interface PageMargins {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

export interface DocxConversionOptions {
  readonly pageSize?: PageSize;
  readonly margins?: Partial<PageMargins>;
  readonly fontSize?: number;
  readonly fontFamily?: string;
  readonly rtl?: boolean;
  readonly maxFileSize?: number; // bytes
}

export interface DocxConversionResult {
  readonly success: boolean;
  readonly outputPath: string;
  readonly pageCount?: number;
  readonly warnings: readonly string[];
  readonly fileSize?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// الثوابت (Constants)
// ─────────────────────────────────────────────────────────────────────────────

/** TWIPs conversion: 1 inch = 1440 TWIPs (Twentieth of a Point) */
export const TWIPS_PER_INCH = 1440 as const;
export const TWIPS_PER_CM = 567 as const;
export const TWIPS_PER_PT = 20 as const;

/** الافتراضيات */
export const DEFAULTS = {
  FONT_FAMILY: 'Calibri',
  FONT_SIZE: 11,
  PAGE_SIZE: 'A4' as const,
  MARGINS: {
    top: TWIPS_PER_INCH, // 1 inch
    right: TWIPS_PER_INCH,
    bottom: TWIPS_PER_INCH,
    left: TWIPS_PER_INCH,
  },
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
  CODE_FONT: 'Courier New',
  TABLE_HEADER_BG: 'D3D3D3',
  CODE_BLOCK_BG: 'F5F5F5',
} as const;

/** خريطة مستويات العناوين */
export const HEADING_LEVELS: Record<number, HL> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Validation Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function resolveMargins(partial?: Partial<PageMargins>): Required<PageMargins> {
  return {
    top: partial?.top ?? DEFAULTS.MARGINS.top,
    right: partial?.right ?? DEFAULTS.MARGINS.right,
    bottom: partial?.bottom ?? DEFAULTS.MARGINS.bottom,
    left: partial?.left ?? DEFAULTS.MARGINS.left,
  };
}

export function clampHeadingLevel(level: number): 1 | 2 | 3 | 4 | 5 | 6 {
  if (level < 1) return 1;
  if (level > 6) return 6;
  return level as 1 | 2 | 3 | 4 | 5 | 6;
}

export function validateInputPath(inputPath: string): void {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Input path must be a non-empty string');
  }
  if (!inputPath.toLowerCase().endsWith('.md')) {
    throw new Error('Input file must have .md extension');
  }
}
