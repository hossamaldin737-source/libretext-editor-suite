/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: calc-templates.ts
 * 📂 المسار: packages/templates/src/calc/calc-templates.ts
 * 🎯 الهدف الرئيسي: قوالب جاهزة لنطاق Calc (ميزانية، تتبع، إحصاء)
 * 📋 المعايير: DocNode-based، TableNode للهياكل الجدولية، Builder helpers
 * 🧪 الاختبارات: packages/templates/tests/calc-templates.test.ts
 * 🏷️ المعرف: TPL-003
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Template Factory + Node Builder Helpers + Auto-Registration
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. القوالب تستخدم TableNode من النواة لبناء هياكل جداول
 *    2. كل قالب له id فريد يبدأ بـ "calc-"
 *    3. registerCalcTemplates() يسجل جميع القوالب دفعة واحدة
 *    4. القوالب ثابتة (immutable) — لا تعدلها بعد التسجيل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Node builder helpers مع `as const` لضمان سلامة الأنواع
 *    - معالجة أخطاء التسجيل (duplicate ids)
 *    - كل helper يعيد كائن readonly
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: @libretext/core (DocNode), registry-types.ts, registry.ts
 *    - 📄 مرتبط مباشر: writer-templates.ts (TPL-002) — نفس النمط
 *    - 🧪 اختبارات: packages/templates/tests/calc-templates.test.ts
 *    - 📚 مراجع: RESTRUCTURING_PLAN.md §المرحلة C
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - createBudgetTemplate(): إنشاء قالب ميزانية (#L95)
 *    - createTrackerTemplate(): إنشاء قالب تتبع (#L135)
 *    - createStatisticsTemplate(): إنشاء قالب إحصاء (#L175)
 *    - registerCalcTemplates(): تسجيل جميع القوالب (#L210)
 *    - getCalcTemplates(): قائمة القوالب المتاحة (#L230)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - القوالب تستخدم placeholder "____" للقيم القابلة للتعبئة
 *    - كل قالب يحتوي على metadata كاملة (tags, author, version)
 *    - يمكن إضافة قوالب Calc جديدة بسهولة بإضافة دالة create*
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل معروفة
 *    - 📖 مرجع تقني: LibreOffice Calc Templates
 *    - 🎯 التحسينات المستقبلية: دعم Chart Templates، Pivot Table Templates
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: LibreOffice Calc Templates
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode, NodeId } from '@libretext/core';
import { type Template, TemplateDomain } from '../registry-types';
import type { TemplateRegistry } from '../registry';

// ─────────────────────────────────────────────────────────────────────────────
// Node Builder Helpers
// ─────────────────────────────────────────────────────────────────────────────

let txtCounter = 0;

function createMetadata(tags: readonly string[]) {
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

function txt(content: string, bold = false) {
  const id = `ctxt-${++txtCounter}` as NodeId;
  return bold
    ? { type: 'text' as const, id, text: content, marks: [{ type: 'bold' as const }] }
    : { type: 'text' as const, id, text: content };
}

function para(id: string, content: string, bold = false) {
  return { type: 'paragraph' as const, id: id as NodeId, content: [txt(content, bold)] };
}

function head(id: string, level: 1 | 2 | 3, content: string) {
  return { type: 'heading' as const, id: id as NodeId, level, content: [txt(content)] };
}

function cell(id: string, content: string, bold = false) {
  return {
    type: 'table-cell' as const,
    id: id as NodeId,
    content: [para(`${id}-p`, content, bold)],
  };
}

function row(id: string, cells: ReturnType<typeof cell>[]) {
  return { type: 'table-row' as const, id: id as NodeId, cells };
}

function tbl(id: string, rows: ReturnType<typeof row>[]) {
  return { type: 'table' as const, id: id as NodeId, rows };
}

// ─────────────────────────────────────────────────────────────────────────────
// Budget Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب ميزانية شهرية */
export function createBudgetTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'budget-doc' as NodeId,
    content: [
      head('budget-title', 1, 'الميزانية الشهرية'),
      head('budget-income-h', 2, 'الدخل'),
      tbl('budget-income', [
        row('inc-r1', [cell('inc-c1', 'المصدر', true), cell('inc-c2', 'المبلغ', true)]),
        row('inc-r2', [cell('inc-c3', 'الراتب'), cell('inc-c4', '____')]),
        row('inc-r3', [cell('inc-c5', 'دخل إضافي'), cell('inc-c6', '____')]),
        row('inc-r4', [cell('inc-c7', 'الإجمالي', true), cell('inc-c8', '____', true)]),
      ]),
      head('budget-expense-h', 2, 'المصروفات'),
      tbl('budget-expense', [
        row('exp-r1', [cell('exp-c1', 'البند', true), cell('exp-c2', 'المبلغ', true)]),
        row('exp-r2', [cell('exp-c3', 'الإيجار'), cell('exp-c4', '____')]),
        row('exp-r3', [cell('exp-c5', 'المواصلات'), cell('exp-c6', '____')]),
        row('exp-r4', [cell('exp-c7', 'الطعام'), cell('exp-c8', '____')]),
        row('exp-r5', [cell('exp-c9', 'الفواتير'), cell('exp-c10', '____')]),
        row('exp-r6', [cell('exp-c11', 'الإجمالي', true), cell('exp-c12', '____', true)]),
      ]),
      para('budget-summary', 'الفرق بين الدخل والمصروفات: ____'),
    ],
  };

  return {
    id: 'calc-budget-monthly',
    name: 'ميزانية شهرية',
    domain: TemplateDomain.CALC,
    description: 'قالب ميزانية شهرية مع جداول الدخل والمصروفات',
    category: 'مالية',
    style: 'professional',
    content,
    metadata: createMetadata(['budget', 'monthly', 'finance']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tracker Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب تتبع المصروفات */
export function createTrackerTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'tracker-doc' as NodeId,
    content: [
      head('tracker-title', 1, 'تتبع المصروفات'),
      tbl('tracker-table', [
        row('tr-r1', [
          cell('tr-c1', 'التاريخ', true),
          cell('tr-c2', 'البند', true),
          cell('tr-c3', 'الفئة', true),
          cell('tr-c4', 'المبلغ', true),
          cell('tr-c5', 'الحالة', true),
        ]),
        row('tr-r2', [
          cell('tr-c6', '____'),
          cell('tr-c7', '____'),
          cell('tr-c8', '____'),
          cell('tr-c9', '____'),
          cell('tr-c10', '____'),
        ]),
        row('tr-r3', [
          cell('tr-c11', '____'),
          cell('tr-c12', '____'),
          cell('tr-c13', '____'),
          cell('tr-c14', '____'),
          cell('tr-c15', '____'),
        ]),
      ]),
      para('tracker-total', 'الإجمالي: ____', true),
      para('tracker-note', 'الفئات: طعام، مواصلات، ترفيه، فواتير، أخرى'),
    ],
  };

  return {
    id: 'calc-tracker-expense',
    name: 'تتبع المصروفات',
    domain: TemplateDomain.CALC,
    description: 'قالب تتبع المصروفات اليومية مع تصنيف حسب الفئة',
    category: 'تتبع',
    style: 'minimal',
    content,
    metadata: createMetadata(['tracker', 'expense', 'daily']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Statistics Template
// ─────────────────────────────────────────────────────────────────────────────

/** قالب تقرير إحصائي */
export function createStatisticsTemplate(): Template<DocNode> {
  const content: DocNode = {
    type: 'doc',
    id: 'stats-doc' as NodeId,
    content: [
      head('stats-title', 1, 'تقرير إحصائي'),
      head('stats-data-h', 2, 'البيانات'),
      tbl('stats-data', [
        row('st-r1', [
          cell('st-c1', 'العنصر', true),
          cell('st-c2', 'القيمة', true),
          cell('st-c3', 'النسبة %', true),
        ]),
        row('st-r2', [cell('st-c4', '____'), cell('st-c5', '____'), cell('st-c6', '____')]),
        row('st-r3', [cell('st-c7', '____'), cell('st-c8', '____'), cell('st-c9', '____')]),
        row('st-r4', [cell('st-c10', '____'), cell('st-c11', '____'), cell('st-c12', '____')]),
      ]),
      head('stats-summary-h', 2, 'الملخص الإحصائي'),
      tbl('stats-summary', [
        row('ss-r1', [cell('ss-c1', 'المقياس', true), cell('ss-c2', 'القيمة', true)]),
        row('ss-r2', [cell('ss-c3', 'المتوسط'), cell('ss-c4', '____')]),
        row('ss-r3', [cell('ss-c5', 'الوسيط'), cell('ss-c6', '____')]),
        row('ss-r4', [cell('ss-c7', 'الانحراف المعياري'), cell('ss-c8', '____')]),
        row('ss-r5', [cell('ss-c9', 'المجموع'), cell('ss-c10', '____')]),
      ]),
      para('stats-note', 'ملاحظة: يتم حساب الإحصاءات تلقائياً عند إدخال البيانات'),
    ],
  };

  return {
    id: 'calc-statistics-report',
    name: 'تقرير إحصائي',
    domain: TemplateDomain.CALC,
    description: 'قالب تقرير إحصائي مع جدول بيانات وملخص إحصائي',
    category: 'إحصاء',
    style: 'professional',
    content,
    metadata: createMetadata(['statistics', 'report', 'analysis']),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-Registration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * تسجيل جميع قوالب Calc في السجل
 * @returns عدد القوالب المسجلة بنجاح
 */
export function registerCalcTemplates(registry: TemplateRegistry<DocNode>): number {
  const templates = [createBudgetTemplate(), createTrackerTemplate(), createStatisticsTemplate()];

  let registered = 0;
  for (const template of templates) {
    try {
      registry.register(template);
      registered++;
    } catch (error) {
      console.warn(`Failed to register Calc template "${template.id}":`, error);
    }
  }
  return registered;
}

/** قائمة بجميع قوالب Calc المتاحة */
export function getCalcTemplates(): readonly Template<DocNode>[] {
  return [createBudgetTemplate(), createTrackerTemplate(), createStatisticsTemplate()];
}
