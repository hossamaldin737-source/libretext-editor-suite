/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: index.ts
 * 📂 المسار: packages/templates/src/writer/index.ts
 * 🎯 الهدف الرئيسي: قوالب مستندات الكاتب (Writer Templates) — Barrel Export
 * 🏷️ المعرف: TPL-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔗 الملفات المرتبطة: writer-templates.ts
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export {
  createLetterTemplate,
  createReportTemplate,
  createEssayTemplate,
  createResumeTemplate,
  registerWriterTemplates,
  getWriterTemplates,
} from './writer-templates';
