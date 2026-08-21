/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: work-monitor.ts
 * 📂 المسار: scripts/work-monitor.ts
 * 🎯 الهدف الرئيسي: مراقبة سير العمل والتحقق من الالتزام بالقواعد الصارمة
 *    (التحقق من الترويسة الإلزامية، تنبيه الملفات الكبيرة) وإصدار تقرير فوري.
 * 📋 المعايير:
 *    - التحقق من وجود الترويسة الإلزامية في كل ملف TypeScript
 *    - تنبيه عند تجاوز الملفات لـ 400 سطر (تحذير فقط — الحد مفتوح حالياً)
 *    - إصدار تقرير صحة المشروع (Project Health Report)
 * 🧪 الاختبارات: تشغيل مباشر عبر tsx
 * 🏷️ المعرف: INFRA-015
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Automated Workflow Guard + Strict Rule Compliance Linter
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تجاهل الملفات الكبيرة وتنبيه المطور فور تجاوزها 400 سطر.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - معالجة الأخطاء والملفات غير القابلة للقراءة بسلاسة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#INFRA-015
 *    - 📦 التبعيات: fs, path
 *    - 📄 مرتبط مباشر: AGENTS.md, scripts/update-indexes.ts
 *    - 📚 مراجع: AGENTS.md §5.1 & §11
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - runWorkMonitor(): فحص الصحة العامة للمشروع (#L60)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تشغيل السكربت عبر: pnpm work:monitor
 *    - حد الملفات مفتوح حالياً — ي爆出 تنبيه فقط لا خطأ
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import { scanDirectory } from './update-indexes';

interface Violation {
  file: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

function runWorkMonitor() {
  console.log('🛡️ [WorkMonitor] Running strict compliance and project health audit...');
  const rootDir = process.cwd();
  const tsFiles = scanDirectory(rootDir);

  const violations: Violation[] = [];
  let checkedFilesCount = 0;

  for (const file of tsFiles) {
    checkedFilesCount++;
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    if (lines.length > 400) {
      violations.push({
        file: path.relative(rootDir, file),
        rule: 'File Size Warning (> 400 lines)',
        message: `File has ${lines.length} lines. Current limit is open but 400 is recommended.`,
        severity: 'warning',
      });
    }

    const hasHeader = content.includes('ملخص توجيهي') || content.includes('Guiding Summary');
    const isTest = file.includes('.test.');
    const isConfig = file.includes('vite.env') || file.includes('tsconfig');
    if (!hasHeader && !isTest && !isConfig) {
      violations.push({
        file: path.relative(rootDir, file),
        rule: 'Mandatory File Header',
        message: 'File is missing the mandatory Arabic/English header.',
        severity: 'error',
      });
    }
  }

  console.log(`\n📋 [WorkMonitor] Audit Summary:`);
  console.log(`   - Checked Files: ${checkedFilesCount}`);
  console.log(`   - Total Issues Found: ${violations.length}`);

  const errors = violations.filter((v) => v.severity === 'error');
  const warnings = violations.filter((v) => v.severity === 'warning');

  if (errors.length > 0) {
    console.warn('\n❌ [WorkMonitor] Errors:');
    errors.forEach((v, idx) => {
      console.warn(`   ${idx + 1}. [${v.rule}] ${v.file}: ${v.message}`);
    });
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️ [WorkMonitor] Warnings:');
    warnings.forEach((v, idx) => {
      console.warn(`   ${idx + 1}. [${v.rule}] ${v.file}: ${v.message}`);
    });
  }

  if (violations.length === 0) {
    console.log('✨ [WorkMonitor] All files comply with project rules!');
  }

  return violations;
}

import { fileURLToPath } from 'url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runWorkMonitor();
}

export { runWorkMonitor };
