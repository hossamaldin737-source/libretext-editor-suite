/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/templates/src/writer/index.ts
 * 🎯 الهدف الرئيسي: قوالب مستندات الكاتب (Writer Templates)
 * 🏷️ المعرف: TPL-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { builder } from '@libretext/core';
import type { DocumentTemplate } from '../registry';

export const articleTemplate: DocumentTemplate = {
  id: 'writer-article',
  name: 'مقال احترافي | Professional Article',
  domain: 'writer',
  description: 'قالب مقال أكاديمي واحترافي مع عناوين وفقرات واقتباسات',
  doc: builder.doc([
    builder.heading(1, [builder.text('مستقبل تقنيات تحرير النصوص المفتوحة')]),
    builder.paragraph([
      builder.text('تعتبر المعمارية الكتلية المجردة (Headless Core) حجر الزاوية في بناء الجيل القادم من المحررات المكتبية.'),
    ]),
    builder.heading(2, [builder.text('المحاور الأساسية')]),
    builder.bulletList([
      builder.listItem([builder.paragraph([builder.text('فصل طبقة البيانات عن العرض (Decoupling)')])]),
      builder.listItem([builder.paragraph([builder.text('دعم متعدد الصيغ والتصدير الآمن (Serialization)')])]),
      builder.listItem([builder.paragraph([builder.text('السبورة التفاعلية ذات الثيم الفاتح النقي (Daylight Canvas)')])]),
    ]),
    builder.blockquote([
      builder.paragraph([builder.text('«التصميم ليس فقط كيف يبدو، بل كيف يعمل بأناقة وبساطة.»')]),
    ]),
  ]),
};

export const writerTemplates: DocumentTemplate[] = [articleTemplate];
