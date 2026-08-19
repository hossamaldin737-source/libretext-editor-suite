/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/templates/src/calc/index.ts
 * 🎯 الهدف الرئيسي: قوالب جداول الحسابات (Calc Templates)
 * 🏷️ المعرف: TPL-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { builder } from '@libretext/core';
import type { DocumentTemplate } from '../registry';

export const budgetTemplate: DocumentTemplate = {
  id: 'calc-budget',
  name: 'جدول الميزانية التقديرية | Budget Planner',
  domain: 'calc',
  description: 'قالب حسابات مالية تفاعلي مع دعم الصيغ الحسابية (SUM, AVERAGE)',
  doc: builder.doc([
    builder.heading(1, [builder.text('تقرير الميزانية والمصروفات الشهري')]),
    builder.paragraph([
      builder.text('جدول ديناميكي يعتمد على محرك تقييم التعابير الرياضية.'),
    ]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('البند / Item')])]),
        builder.tableCell([builder.paragraph([builder.text('المبلغ المخصص / Budget')])]),
        builder.tableCell([builder.paragraph([builder.text('المنصرف الفعلي / Actual')])]),
        builder.tableCell([builder.paragraph([builder.text('الفرق / Difference')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('التطوير والبحث')])]),
        builder.tableCell([builder.paragraph([builder.text('5000')])]),
        builder.tableCell([builder.paragraph([builder.text('4200')])]),
        builder.tableCell([builder.paragraph([builder.text('=B2-C2')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الاستضافة والسحابة')])]),
        builder.tableCell([builder.paragraph([builder.text('1200')])]),
        builder.tableCell([builder.paragraph([builder.text('1150')])]),
        builder.tableCell([builder.paragraph([builder.text('=B3-C3')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الإجمالي')])]),
        builder.tableCell([builder.paragraph([builder.text('=SUM(B2:B3)')])]),
        builder.tableCell([builder.paragraph([builder.text('=SUM(C2:C3)')])]),
        builder.tableCell([builder.paragraph([builder.text('=SUM(D2:D3)')])]),
      ]),
    ]),
  ]),
};

export const calcTemplates: DocumentTemplate[] = [budgetTemplate];
