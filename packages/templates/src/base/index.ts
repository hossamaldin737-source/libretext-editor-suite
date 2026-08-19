/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/templates/src/base/index.ts
 * 🎯 الهدف الرئيسي: قوالب السجلات وقواعد البيانات (Base Templates)
 * 🏷️ المعرف: TPL-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { builder } from '@libretext/core';
import type { DocumentTemplate } from '../registry';

export const customerRecordsTemplate: DocumentTemplate = {
  id: 'base-records',
  name: 'سجل العملاء والبيانات | Customer Registry',
  domain: 'base',
  description: 'قالب جداول السجلات المنظمة لإدارة قواعد البيانات والكيانات',
  doc: builder.doc([
    builder.heading(1, [builder.text('سجل المشتركين وقاعدة البيانات')]),
    builder.paragraph([
      builder.text('جدول بيانات العملاء مع تحديد المعرف وحالة الاشتراك.'),
    ]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('ID')])]),
        builder.tableCell([builder.paragraph([builder.text('الاسم / Name')])]),
        builder.tableCell([builder.paragraph([builder.text('البريد / Email')])]),
        builder.tableCell([builder.paragraph([builder.text('الحالة / Status')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('USR-001')])]),
        builder.tableCell([builder.paragraph([builder.text('أحمد الخولي')])]),
        builder.tableCell([builder.paragraph([builder.text('ahmed@example.com')])]),
        builder.tableCell([builder.paragraph([builder.text('نشط / Active')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('USR-002')])]),
        builder.tableCell([builder.paragraph([builder.text('سارة محمود')])]),
        builder.tableCell([builder.paragraph([builder.text('sara@example.com')])]),
        builder.tableCell([builder.paragraph([builder.text('نشط / Active')])]),
      ]),
    ]),
  ]),
};

export const baseTemplates: DocumentTemplate[] = [customerRecordsTemplate];
