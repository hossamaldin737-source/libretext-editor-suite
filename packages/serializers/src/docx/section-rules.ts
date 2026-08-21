/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: section-rules.ts
 * 📂 المسار: packages/serializers/src/docx/section-rules.ts
 * 🎯 الهدف الرئيسي: قواعد تقسيم المستند إلى أقسام ومقاطع Word
 * 📋 المعايير: Zero external dependencies, pure TypeScript
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-converter.test.ts
 * 🏷️ المعرف: SER-006-04
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Contextual Section Break Heuristic Rule
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { ContentBlock } from '../parsers/markdown';
import type { DocumentMetadata } from '../parsers/frontmatter-parser';

/**
 * تحديد ما إذا كان الفاصل الأفقي يُمثل فاصلاً مقطعياً في مستند Word
 */
export function shouldCreateSectionBreak(
  index: number,
  content: ContentBlock[],
  _metadata: DocumentMetadata | null,
): boolean {
  if (index < 0 || index >= content.length) return false;

  const current = content[index];
  if (!current || current.type !== 'hr') return false;

  const previousBlock = index > 0 ? content[index - 1] : null;
  const nextBlock = index < content.length - 1 ? content[index + 1] : null;

  if (!previousBlock || !nextBlock) {
    return false;
  }

  // إذا تبعه عنوان رئيسي أو فقرة كبيرة
  if (nextBlock.type === 'heading' || nextBlock.type === 'paragraph') {
    return true;
  }

  return false;
}
