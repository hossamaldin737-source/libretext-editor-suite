/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: writer-templates.ts
 * 📂 المسار: packages/templates/src/writer/writer-templates.ts
 * 🎯 الهدف الرئيسي: قوالب جاهزة لنطاق Writer (خطاب، تقرير، مقال، سيرة ذاتية)
 * 📋 المعايير: DocNode-based، Template<DocNode>، Builder Pattern
 * 🧪 الاختبارات: packages/templates/tests/writer-templates.test.ts
 * 🏷️ المعرف: TPL-002
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Template Factory + Builder Pattern + Auto-Registration Function
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القوالب تستخدم DocNode من @libretext/core
 *    2. كل قالب له id فريد يبدأ بـ "writer-"
 *    3. registerWriterTemplates() يسجل جميع القوالب دفعة واحدة
 *    4. القوالب ثابتة (immutable) — لا تعدلها بعد التسجيل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام NodeId branded type مع as NodeId casts
 *    - كل text node له id فريد
 *    - معالجة أخطاء التسجيل (duplicate ids)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: packages/templates/src/index.ts
 *    - 📦 التبعيات: @libretext/core (DocNode, NodeId), ../registry-types.ts, ../registry.ts
 *    - 📄 مرتبط مباشر: packages/templates/src/writer/index.ts
 *    - 🧪 اختبارات: packages/templates/tests/writer-templates.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createLetterTemplate(): إنشاء قالب خطاب
 *    - createReportTemplate(): إنشاء قالب تقرير
 *    - createEssayTemplate(): إنشاء قالب مقال
 *    - createResumeTemplate(): إنشاء قالب سيرة ذاتية
 *    - registerWriterTemplates(): تسجيل جميع القوالب في السجل
 *    - getWriterTemplates(): قائمة بجميع القوالب المتاحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - القوالب تستخدم نصوص عربية واضحة ومقاطع قياسية
 *    - كل قالب يحتوي على metadata كاملة (tags, author, version)
 *    - يمكن إضافة قوالب Writer جديدة بسهولة بإضافة دالة create*
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreOffice Writer Templates
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode, NodeId } from '@libretext/core';
import { type Template, TemplateDomain, type TemplateMetadata } from '../registry-types';
import type { TemplateRegistry } from '../registry';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createMetadata(tags: readonly string[]): TemplateMetadata {
  return {
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
    tags,
    author: 'LibreText Team',
    license: 'MIT',
    language: 'ar',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Letter Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب خطاب رسمي */
export function createLetterTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'letter-doc' as NodeId,
    content: [
      {
        type: 'paragraph',
        id: 'letter-date' as NodeId,
        content: [
          { type: 'text', id: 'letter-date-t' as NodeId, text: 'التاريخ: ____/____/________' },
        ],
      },
      {
        type: 'paragraph',
        id: 'letter-to' as NodeId,
        content: [
          { type: 'text', id: 'letter-to-t' as NodeId, text: 'إلى السيد/السيدة: ________________' },
        ],
      },
      {
        type: 'paragraph',
        id: 'letter-subject' as NodeId,
        content: [
          {
            type: 'text',
            id: 'letter-subject-t' as NodeId,
            text: 'الموضوع: ________________',
            marks: [{ type: 'bold' }],
          },
        ],
      },
      {
        type: 'paragraph',
        id: 'letter-greeting' as NodeId,
        content: [{ type: 'text', id: 'letter-greeting-t' as NodeId, text: 'تحية طيبة وبعد،' }],
      },
      {
        type: 'paragraph',
        id: 'letter-body-1' as NodeId,
        content: [
          {
            type: 'text',
            id: 'letter-body-1-t' as NodeId,
            text: 'أتقدم إليكم بهذا الخطاب بشأن...',
          },
        ],
      },
      {
        type: 'paragraph',
        id: 'letter-body-2' as NodeId,
        content: [
          {
            type: 'text',
            id: 'letter-body-2-t' as NodeId,
            text: 'أرجو التكرم بالاطلاع واتخاذ اللازم...',
          },
        ],
      },
      {
        type: 'paragraph',
        id: 'letter-closing' as NodeId,
        content: [
          {
            type: 'text',
            id: 'letter-closing-t' as NodeId,
            text: 'وتفضلوا بقبول فائق الاحترام والتقدير،',
          },
        ],
      },
      {
        type: 'paragraph',
        id: 'letter-signature' as NodeId,
        content: [
          {
            type: 'text',
            id: 'letter-signature-t' as NodeId,
            text: 'مقدمه لسيادتكم: ________________',
          },
        ],
      },
    ],
  };

  return {
    id: 'writer-letter-formal',
    name: 'خطاب رسمي',
    domain: TemplateDomain.WRITER,
    description: 'قالب خطاب رسمي احترافي مع تنسيق قياسي',
    category: 'مراسلات',
    style: 'professional',
    preview: 'letter-preview.png',
    content,
    metadata: createMetadata(['letter', 'formal', 'correspondence']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب تقرير احترافي */
export function createReportTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'report-doc' as NodeId,
    content: [
      {
        type: 'heading',
        id: 'report-title' as NodeId,
        level: 1,
        content: [{ type: 'text', id: 'report-title-t' as NodeId, text: 'عنوان التقرير' }],
      },
      {
        type: 'paragraph',
        id: 'report-meta' as NodeId,
        content: [
          {
            type: 'text',
            id: 'report-meta-t1' as NodeId,
            text: 'إعداد: ________________',
            marks: [{ type: 'italic' }],
          },
          {
            type: 'text',
            id: 'report-meta-t2' as NodeId,
            text: ' | التاريخ: ____/____/________',
            marks: [{ type: 'italic' }],
          },
        ],
      },
      {
        type: 'heading',
        id: 'report-summary-heading' as NodeId,
        level: 2,
        content: [
          { type: 'text', id: 'report-summary-heading-t' as NodeId, text: 'الملخص التنفيذي' },
        ],
      },
      {
        type: 'paragraph',
        id: 'report-summary' as NodeId,
        content: [
          {
            type: 'text',
            id: 'report-summary-t' as NodeId,
            text: 'يقدم هذا التقرير نظرة شاملة على...',
          },
        ],
      },
      {
        type: 'heading',
        id: 'report-intro-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'report-intro-heading-t' as NodeId, text: 'المقدمة' }],
      },
      {
        type: 'paragraph',
        id: 'report-intro' as NodeId,
        content: [
          { type: 'text', id: 'report-intro-t' as NodeId, text: 'يهدف هذا التقرير إلى...' },
        ],
      },
      {
        type: 'heading',
        id: 'report-findings-heading' as NodeId,
        level: 2,
        content: [
          { type: 'text', id: 'report-findings-heading-t' as NodeId, text: 'النتائج الرئيسية' },
        ],
      },
      {
        type: 'paragraph',
        id: 'report-findings' as NodeId,
        content: [{ type: 'text', id: 'report-findings-t' as NodeId, text: 'أظهرت الدراسة أن...' }],
      },
      {
        type: 'heading',
        id: 'report-conclusion-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'report-conclusion-heading-t' as NodeId, text: 'التوصيات' }],
      },
      {
        type: 'paragraph',
        id: 'report-conclusion' as NodeId,
        content: [
          {
            type: 'text',
            id: 'report-conclusion-t' as NodeId,
            text: 'بناءً على ما تقدم، نوصي بـ...',
          },
        ],
      },
    ],
  };

  return {
    id: 'writer-report-professional',
    name: 'تقرير احترافي',
    domain: TemplateDomain.WRITER,
    description: 'قالب تقرير احترافي مع أقسام قياسية (ملخص، مقدمة، نتائج، توصيات)',
    category: 'تقارير',
    style: 'professional',
    preview: 'report-preview.png',
    content,
    metadata: createMetadata(['report', 'professional', 'business']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Essay Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب مقال أكاديمي */
export function createEssayTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'essay-doc' as NodeId,
    content: [
      {
        type: 'heading',
        id: 'essay-title' as NodeId,
        level: 1,
        content: [{ type: 'text', id: 'essay-title-t' as NodeId, text: 'عنوان المقال' }],
      },
      {
        type: 'paragraph',
        id: 'essay-author' as NodeId,
        content: [
          {
            type: 'text',
            id: 'essay-author-t' as NodeId,
            text: 'بقلم: ________________',
            marks: [{ type: 'italic' }],
          },
        ],
      },
      {
        type: 'heading',
        id: 'essay-intro-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'essay-intro-heading-t' as NodeId, text: 'المقدمة' }],
      },
      {
        type: 'paragraph',
        id: 'essay-intro' as NodeId,
        content: [
          {
            type: 'text',
            id: 'essay-intro-t' as NodeId,
            text: 'تعتبر هذه القضية من أهم القضايا المعاصرة...',
          },
        ],
      },
      {
        type: 'heading',
        id: 'essay-body1-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'essay-body1-heading-t' as NodeId, text: 'النقطة الأولى' }],
      },
      {
        type: 'paragraph',
        id: 'essay-body1' as NodeId,
        content: [
          {
            type: 'text',
            id: 'essay-body1-t' as NodeId,
            text: 'من أهم الجوانب التي يجب مناقشتها...',
          },
        ],
      },
      {
        type: 'heading',
        id: 'essay-body2-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'essay-body2-heading-t' as NodeId, text: 'النقطة الثانية' }],
      },
      {
        type: 'paragraph',
        id: 'essay-body2' as NodeId,
        content: [
          { type: 'text', id: 'essay-body2-t' as NodeId, text: 'علاوة على ذلك، نجد أن...' },
        ],
      },
      {
        type: 'heading',
        id: 'essay-conclusion-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'essay-conclusion-heading-t' as NodeId, text: 'الخاتمة' }],
      },
      {
        type: 'paragraph',
        id: 'essay-conclusion' as NodeId,
        content: [
          {
            type: 'text',
            id: 'essay-conclusion-t' as NodeId,
            text: 'خلاصة القول، يتضح من خلال ما تقدم أن...',
          },
        ],
      },
    ],
  };

  return {
    id: 'writer-essay-academic',
    name: 'مقال أكاديمي',
    domain: TemplateDomain.WRITER,
    description: 'قالب مقال أكاديمي مع مقدمة، نقاط رئيسية، وخاتمة',
    category: 'مقالات',
    style: 'academic',
    preview: 'essay-preview.png',
    content,
    metadata: createMetadata(['essay', 'academic', 'article']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Resume Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب سيرة ذاتية */
export function createResumeTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'resume-doc' as NodeId,
    content: [
      {
        type: 'heading',
        id: 'resume-name' as NodeId,
        level: 1,
        content: [{ type: 'text', id: 'resume-name-t' as NodeId, text: 'الاسم الكامل' }],
      },
      {
        type: 'paragraph',
        id: 'resume-contact' as NodeId,
        content: [
          {
            type: 'text',
            id: 'resume-contact-t' as NodeId,
            text: 'البريد الإلكتروني: ________________ | الهاتف: ________________',
            marks: [{ type: 'italic' }],
          },
        ],
      },
      {
        type: 'heading',
        id: 'resume-summary-heading' as NodeId,
        level: 2,
        content: [
          { type: 'text', id: 'resume-summary-heading-t' as NodeId, text: 'الملخص المهني' },
        ],
      },
      {
        type: 'paragraph',
        id: 'resume-summary' as NodeId,
        content: [
          {
            type: 'text',
            id: 'resume-summary-t' as NodeId,
            text: 'محترف ذو خبرة في... مع مهارات قوية في...',
          },
        ],
      },
      {
        type: 'heading',
        id: 'resume-experience-heading' as NodeId,
        level: 2,
        content: [
          { type: 'text', id: 'resume-experience-heading-t' as NodeId, text: 'الخبرات المهنية' },
        ],
      },
      {
        type: 'paragraph',
        id: 'resume-job1' as NodeId,
        content: [
          {
            type: 'text',
            id: 'resume-job1-t1' as NodeId,
            text: 'المسمى الوظيفي',
            marks: [{ type: 'bold' }],
          },
          { type: 'text', id: 'resume-job1-t2' as NodeId, text: ' | اسم الشركة | التاريخ' },
        ],
      },
      {
        type: 'paragraph',
        id: 'resume-job1-desc' as NodeId,
        content: [
          {
            type: 'text',
            id: 'resume-job1-desc-t' as NodeId,
            text: '• إنجاز رئيسي 1\n• إنجاز رئيسي 2',
          },
        ],
      },
      {
        type: 'heading',
        id: 'resume-education-heading' as NodeId,
        level: 2,
        content: [
          { type: 'text', id: 'resume-education-heading-t' as NodeId, text: 'المؤهلات العلمية' },
        ],
      },
      {
        type: 'paragraph',
        id: 'resume-degree' as NodeId,
        content: [
          {
            type: 'text',
            id: 'resume-degree-t1' as NodeId,
            text: 'الدرجة العلمية',
            marks: [{ type: 'bold' }],
          },
          { type: 'text', id: 'resume-degree-t2' as NodeId, text: ' | اسم الجامعة | سنة التخرج' },
        ],
      },
      {
        type: 'heading',
        id: 'resume-skills-heading' as NodeId,
        level: 2,
        content: [{ type: 'text', id: 'resume-skills-heading-t' as NodeId, text: 'المهارات' }],
      },
      {
        type: 'paragraph',
        id: 'resume-skills' as NodeId,
        content: [
          { type: 'text', id: 'resume-skills-t' as NodeId, text: '• مهارة 1 • مهارة 2 • مهارة 3' },
        ],
      },
    ],
  };

  return {
    id: 'writer-resume-professional',
    name: 'سيرة ذاتية احترافية',
    domain: TemplateDomain.WRITER,
    description: 'قالب سيرة ذاتية احترافي مع أقسام (ملخص، خبرات، تعليم، مهارات)',
    category: 'سير ذاتية',
    style: 'professional',
    preview: 'resume-preview.png',
    content,
    metadata: createMetadata(['resume', 'cv', 'career', 'professional']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-Registration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * تسجيل جميع قوالب Writer في السجل
 * @returns عدد القوالب المسجلة بنجاح
 */
export function registerWriterTemplates(registry: TemplateRegistry<DocNode>): number {
  const templates = getWriterTemplates();

  let registered = 0;
  for (const template of templates) {
    try {
      registry.register(template);
      registered++;
    } catch {
      // Ignore duplicate IDs or registration errors safely
    }
  }

  return registered;
}

/** قائمة بجميع قوالب Writer المتاحة */
export function getWriterTemplates(): readonly Template<DocNode>[] {
  return [
    createLetterTemplate(),
    createReportTemplate(),
    createEssayTemplate(),
    createResumeTemplate(),
  ];
}
