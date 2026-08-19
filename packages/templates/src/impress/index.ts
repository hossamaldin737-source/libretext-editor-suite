/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/templates/src/impress/index.ts
 * 🎯 الهدف الرئيسي: قوالب العروض التقديمية والشرائح (Impress Templates)
 * 🏷️ المعرف: TPL-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { builder } from '@libretext/core';
import type { DocumentTemplate } from '../registry';

export const presentationTemplate: DocumentTemplate = {
  id: 'impress-deck',
  name: 'عرض تقديمي حديث | Keynote Pitch Deck',
  domain: 'impress',
  description: 'قالب شرائح عرض تقديمي متسلسلة بتنسيق نظيف وثيم نهاري ناصع',
  doc: builder.doc([
    builder.heading(1, [builder.text('مقدمة في نظام LibreText Editor Suite')]),
    builder.paragraph([
      builder.text('الحل المكتبي الشامل والحر لتحرير النصوص، الجداول، والعروض.'),
    ]),
    builder.horizontalRule(),
    builder.heading(2, [builder.text('الشريحة الثانية: المزايا الأساسية')]),
    builder.bulletList([
      builder.listItem([builder.paragraph([builder.text('تفاعل حصري بالفأرة والزر الأيمن السريع')])]),
      builder.listItem([builder.paragraph([builder.text('ثيم نهاري فاتح نقي ومريح للعين')])]),
      builder.listItem([builder.paragraph([builder.text('محولات جاهزة إلى Markdown و HTML و LaTeX و PDF')])]),
    ]),
  ]),
};

export const impressTemplates: DocumentTemplate[] = [presentationTemplate];
