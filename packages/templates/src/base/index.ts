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

export const arabicNameSearchCensusTemplate: DocumentTemplate = {
  id: 'base-arabic-search',
  name: 'سجل البحث والتدقيق بالأسماء العربية | Arabic Name & Search Audit',
  domain: 'base',
  description: 'قالب قاعدة بيانات للتحقق من الأسماء والهمزات والمطابقة الذكية وتوحيد النصوص',
  doc: builder.doc([
    builder.heading(1, [builder.text('سجل التحقق من الأسماء والمطابقة الذكية')]),
    builder.paragraph([
      builder.text('جدول تدقيق سجلات الموظفين والعملاء مع دعم مطابقة الأسماء بتوحيد الهمزات والتاء المربوطة.'),
    ]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الرقم الوظيفي')])]),
        builder.tableCell([builder.paragraph([builder.text('الاسم المسجل')])]),
        builder.tableCell([builder.paragraph([builder.text('القسم / الإدارة')])]),
        builder.tableCell([builder.paragraph([builder.text('المدينة')])]),
        builder.tableCell([builder.paragraph([builder.text('حالة التدقيق')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('EMP-501')])]),
        builder.tableCell([builder.paragraph([builder.text('أحمد إبراهيم')])]),
        builder.tableCell([builder.paragraph([builder.text('الهندسة والتطوير')])]),
        builder.tableCell([builder.paragraph([builder.text('الرياض')])]),
        builder.tableCell([builder.paragraph([builder.text('مطابق معتمد')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('EMP-502')])]),
        builder.tableCell([builder.paragraph([builder.text('احمد ابراهيم')])]),
        builder.tableCell([builder.paragraph([builder.text('الدعم الفني')])]),
        builder.tableCell([builder.paragraph([builder.text('جدة')])]),
        builder.tableCell([builder.paragraph([builder.text('يحتاج توحيد همزات')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('EMP-503')])]),
        builder.tableCell([builder.paragraph([builder.text('فاطمه الزهراء')])]),
        builder.tableCell([builder.paragraph([builder.text('الموارد البشرية')])]),
        builder.tableCell([builder.paragraph([builder.text('الدمام')])]),
        builder.tableCell([builder.paragraph([builder.text('يحتاج توحيد تاء مربوطة')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('EMP-504')])]),
        builder.tableCell([builder.paragraph([builder.text('مُحَمَّد عَبْدُ الله')])]),
        builder.tableCell([builder.paragraph([builder.text('المالية والمحاسبة')])]),
        builder.tableCell([builder.paragraph([builder.text('مكة المكرمة')])]),
        builder.tableCell([builder.paragraph([builder.text('مشكول - تمت إزالة التشكيل')])]),
      ]),
    ]),
  ]),
};

export const baseTemplates: DocumentTemplate[] = [
  customerRecordsTemplate,
  arabicNameSearchCensusTemplate,
];

