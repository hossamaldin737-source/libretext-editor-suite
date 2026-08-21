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
    builder.paragraph([builder.text('جدول ديناميكي يعتمد على محرك تقييم التعابير الرياضية.')]),
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

export const incidentCensusTemplate: DocumentTemplate = {
  id: 'calc-census-incidents',
  name: 'إحصاء الحالات والبلاغات | Incident & Status Census',
  domain: 'calc',
  description: 'قالب إحصائي لحصر وتصنيف الحالات والبلاغات مع حساب معدلات الإنجاز ديناميكياً',
  doc: builder.doc([
    builder.heading(1, [builder.text('سجل حصر وإحصاء الحالات والبلاغات')]),
    builder.paragraph([
      builder.text('جدول تفاعلي لرصد الحالات اليومية وتوزيعها حسب الحالة ونوع الإجراء.'),
    ]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('رقم البلاغ / ID')])]),
        builder.tableCell([builder.paragraph([builder.text('صاحب البلاغ / Name')])]),
        builder.tableCell([builder.paragraph([builder.text('التصنيف / Category')])]),
        builder.tableCell([builder.paragraph([builder.text('الحالة / Status')])]),
        builder.tableCell([builder.paragraph([builder.text('الأولوية / Priority')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('INC-101')])]),
        builder.tableCell([builder.paragraph([builder.text('أحمد عبد الله')])]),
        builder.tableCell([builder.paragraph([builder.text('دعم فني')])]),
        builder.tableCell([builder.paragraph([builder.text('مكتمل')])]),
        builder.tableCell([builder.paragraph([builder.text('عالية')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('INC-102')])]),
        builder.tableCell([builder.paragraph([builder.text('إسماعيل محمد')])]),
        builder.tableCell([builder.paragraph([builder.text('استفسار')])]),
        builder.tableCell([builder.paragraph([builder.text('قيد المعالجة')])]),
        builder.tableCell([builder.paragraph([builder.text('متوسطة')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('INC-103')])]),
        builder.tableCell([builder.paragraph([builder.text('فاطمة الزهراء')])]),
        builder.tableCell([builder.paragraph([builder.text('دعم فني')])]),
        builder.tableCell([builder.paragraph([builder.text('مكتمل')])]),
        builder.tableCell([builder.paragraph([builder.text('حرجة')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('INC-104')])]),
        builder.tableCell([builder.paragraph([builder.text('يوسف إبراهيم')])]),
        builder.tableCell([builder.paragraph([builder.text('شكوى')])]),
        builder.tableCell([builder.paragraph([builder.text('قيد المعالجة')])]),
        builder.tableCell([builder.paragraph([builder.text('عادية')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('INC-105')])]),
        builder.tableCell([builder.paragraph([builder.text('منى عبد الرحمن')])]),
        builder.tableCell([builder.paragraph([builder.text('استفسار')])]),
        builder.tableCell([builder.paragraph([builder.text('ملغي')])]),
        builder.tableCell([builder.paragraph([builder.text('منخفضة')])]),
      ]),
    ]),
    builder.heading(2, [builder.text('مؤشرات وإحصائيات الحالات (Statistical Summary)')]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('المؤشر الإحصائي / Metric')])]),
        builder.tableCell([builder.paragraph([builder.text('القيمة المحسوبة / Formula Value')])]),
      ]),
      builder.tableRow([
        builder.tableCell([
          builder.paragraph([builder.text('إجمالي الحالات المسجلة (Total Cases)')]),
        ]),
        builder.tableCell([builder.paragraph([builder.text('5')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الحالات المكتملة (Completed)')])]),
        builder.tableCell([builder.paragraph([builder.text('2')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('حالات قيد المعالجة (In Progress)')])]),
        builder.tableCell([builder.paragraph([builder.text('2')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الحالات الملغاة (Cancelled)')])]),
        builder.tableCell([builder.paragraph([builder.text('1')])]),
      ]),
    ]),
  ]),
};

export const inventoryAuditTemplate: DocumentTemplate = {
  id: 'calc-inventory-audit',
  name: 'جرد المخزون والتدقيق المالي | Inventory & Stock Audit',
  domain: 'calc',
  description: 'قالب تفاعلي لجرد المخازن مع تقييم الأصناف وحساب إجمالي القيمة مع التفقيط المالي',
  doc: builder.doc([
    builder.heading(1, [builder.text('تقرير الجرد الفعلي للمخزون والتقييم المالي')]),
    builder.paragraph([
      builder.text(
        'حصر كميات المخزون وتحديد حالة إعادة الطلب تلقائياً مع حساب إجمالي القيمة بالريال السعودي.',
      ),
    ]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('كود الصنف / SKU')])]),
        builder.tableCell([builder.paragraph([builder.text('اسم المنتج / Product')])]),
        builder.tableCell([builder.paragraph([builder.text('سعر الوحدة (ر.س)')])]),
        builder.tableCell([builder.paragraph([builder.text('الرصيد الفعلي')])]),
        builder.tableCell([builder.paragraph([builder.text('الحد الأدنى')])]),
        builder.tableCell([builder.paragraph([builder.text('القيمة الإجمالية')])]),
        builder.tableCell([builder.paragraph([builder.text('حالة الطلب')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('PRD-01')])]),
        builder.tableCell([builder.paragraph([builder.text('شاشة عرض 27 بوصة')])]),
        builder.tableCell([builder.paragraph([builder.text('1200')])]),
        builder.tableCell([builder.paragraph([builder.text('15')])]),
        builder.tableCell([builder.paragraph([builder.text('10')])]),
        builder.tableCell([builder.paragraph([builder.text('=C2*D2')])]),
        builder.tableCell([builder.paragraph([builder.text('متوفر')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('PRD-02')])]),
        builder.tableCell([builder.paragraph([builder.text('لوحة مفاتيح ميكانيكية')])]),
        builder.tableCell([builder.paragraph([builder.text('350')])]),
        builder.tableCell([builder.paragraph([builder.text('4')])]),
        builder.tableCell([builder.paragraph([builder.text('8')])]),
        builder.tableCell([builder.paragraph([builder.text('=C3*D3')])]),
        builder.tableCell([builder.paragraph([builder.text('إعادة طلب')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('PRD-03')])]),
        builder.tableCell([builder.paragraph([builder.text('فأرة لاسلكية مريحة')])]),
        builder.tableCell([builder.paragraph([builder.text('180')])]),
        builder.tableCell([builder.paragraph([builder.text('22')])]),
        builder.tableCell([builder.paragraph([builder.text('15')])]),
        builder.tableCell([builder.paragraph([builder.text('=C4*D4')])]),
        builder.tableCell([builder.paragraph([builder.text('متوفر')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('PRD-04')])]),
        builder.tableCell([builder.paragraph([builder.text('سماعة رأس احترافية')])]),
        builder.tableCell([builder.paragraph([builder.text('450')])]),
        builder.tableCell([builder.paragraph([builder.text('5')])]),
        builder.tableCell([builder.paragraph([builder.text('10')])]),
        builder.tableCell([builder.paragraph([builder.text('=C5*D5')])]),
        builder.tableCell([builder.paragraph([builder.text('إعادة طلب')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الإجمالي الكلي')])]),
        builder.tableCell([builder.paragraph([builder.text('-')])]),
        builder.tableCell([builder.paragraph([builder.text('=AVERAGE(C2:C5)')])]),
        builder.tableCell([builder.paragraph([builder.text('=SUM(D2:D5)')])]),
        builder.tableCell([builder.paragraph([builder.text('-')])]),
        builder.tableCell([builder.paragraph([builder.text('=SUM(F2:F5)')])]),
        builder.tableCell([builder.paragraph([builder.text('-')])]),
      ]),
    ]),
  ]),
};

export const comparativeStatisticsTemplate: DocumentTemplate = {
  id: 'calc-comparative-stats',
  name: 'إحصائية مقارنة ومؤشرات الأداء | Comparative KPI Analysis',
  domain: 'calc',
  description: 'قالب تحليلي لمقارنة الأداء المستهدف بالفعلي مع حساب المتوسطات ونسب الإنجاز',
  doc: builder.doc([
    builder.heading(1, [builder.text('تحليل مقارن لمؤشرات الأداء المستهدف والفعلي')]),
    builder.paragraph([
      builder.text('مقارنة نتائج الفروع والمناطق مع رصد الفروق ونسب تحقيق الأهداف.'),
    ]),
    builder.table([
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('الفرع / المنطقة')])]),
        builder.tableCell([builder.paragraph([builder.text('الهدف المستهدف')])]),
        builder.tableCell([builder.paragraph([builder.text('المحقق الفعلي')])]),
        builder.tableCell([builder.paragraph([builder.text('فارق الأداء')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('فرع الرياض')])]),
        builder.tableCell([builder.paragraph([builder.text('150000')])]),
        builder.tableCell([builder.paragraph([builder.text('168000')])]),
        builder.tableCell([builder.paragraph([builder.text('=C2-B2')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('فرع جدة')])]),
        builder.tableCell([builder.paragraph([builder.text('120000')])]),
        builder.tableCell([builder.paragraph([builder.text('115000')])]),
        builder.tableCell([builder.paragraph([builder.text('=C3-B3')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('فرع الدمام')])]),
        builder.tableCell([builder.paragraph([builder.text('95000')])]),
        builder.tableCell([builder.paragraph([builder.text('102000')])]),
        builder.tableCell([builder.paragraph([builder.text('=C4-B4')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('فرع مكة')])]),
        builder.tableCell([builder.paragraph([builder.text('80000')])]),
        builder.tableCell([builder.paragraph([builder.text('84000')])]),
        builder.tableCell([builder.paragraph([builder.text('=C5-B5')])]),
      ]),
      builder.tableRow([
        builder.tableCell([builder.paragraph([builder.text('المتوسط العام')])]),
        builder.tableCell([builder.paragraph([builder.text('=AVERAGE(B2:B5)')])]),
        builder.tableCell([builder.paragraph([builder.text('=AVERAGE(C2:C5)')])]),
        builder.tableCell([builder.paragraph([builder.text('=SUM(D2:D5)')])]),
      ]),
    ]),
  ]),
};

export const calcTemplates: DocumentTemplate[] = [
  budgetTemplate,
  incidentCensusTemplate,
  inventoryAuditTemplate,
  comparativeStatisticsTemplate,
];
