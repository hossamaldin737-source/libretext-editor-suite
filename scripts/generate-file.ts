/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: generate-file.ts
 * 📂 المسار: scripts/generate-file.ts
 * 🎯 الهدف الرئيسي: سكربت توليد ملفات جديدة في المشروع مع الترويسة
 *    العربية الإلزامية والمعرف الفريد وفق فهرسة المشروع.
 * 📋 المعايير:
 *    - يجب أن يولّد ملفاً بالترويسة الكاملة.
 *    - يجب أن يتحقق من عدم وجود الملف مسبقاً.
 *    - يجب أن يدعم جميع أنواع الملفات (.ts, .tsx, .json, .md).
 * 🧪 الاختبارات: لا توجد اختبارات (سكربت إداري).
 * 🏷️ المعرف: INFRA-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Template-based File Generator with Arabic Headers
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحقق من عدم تجاوز المعرف المكرر.
 *    2. إنشاء المجلدات الأب تلقائياً إذا لم تكن موجودة.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question: string): Promise<string> =>
  new Promise((resolve) => rl.question(question, resolve));

const TEMPLATE_HEADER = (name: string, filePath: string, id: string, goal: string): string =>
  `/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: ${name}
 * 📂 المسار: ${filePath}
 * 🎯 الهدف الرئيسي: ${goal}
 * 📋 المعايير: (يُضاف لاحقاً)
 * 🧪 الاختبارات: (يُضاف لاحقاً)
 * 🏷️ المعرف: ${id}
 * 📅 تاريخ الإنشاء: ${new Date().toISOString().split('T')[0]}
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    (يُضاف لاحقاً)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. (يُضاف لاحقاً)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - (يُضاف لاحقاً)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */
`;

const TEMPLATE_BODY: Record<string, string> = {
  '.ts': `\nexport {};\n`,
  '.tsx': `\nexport default function Component() {\n  return <div></div>;\n}\n`,
  '.json': `{\n  \n}\n`,
  '.md': `\n# (عنوان الملف)\n\n(المحتوى)\n`,
  '.yaml': `# (إعدادات YAML)\n`,
};

async function main() {
  console.log('🔧 سكربت توليد ملفات جديد | File Generator Script');
  console.log('─'.repeat(50));

  const filePath = await ask('📂 المسار النسبي للملف (relative path): ');
  const id = await ask('🏷️  المعرف الفريد (ID): ');
  const goal = await ask('🎯 الهدف الرئيسي: ');

  const fullPath = path.resolve(process.cwd(), filePath);

  if (fs.existsSync(fullPath)) {
    console.error(`❌ الملف موجود مسبقاً: ${filePath}`);
    rl.close();
    process.exit(1);
  }

  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
    console.log(`📁 تم إنشاء المجلد: ${dir}`);
  }

  const ext = path.extname(fullPath);
  const name = path.basename(fullPath);
  const body = TEMPLATE_BODY[ext] || '\n';
  const content = TEMPLATE_HEADER(name, filePath, id, goal) + body;

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ تم إنشاء الملف: ${filePath}`);
  console.log(`🏷️  المعرف: ${id}`);

  rl.close();
}

main().catch(console.error);
