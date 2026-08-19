/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: generate-header.ts
 * 📂 المسار: scripts/generate-header.ts
 * 🎯 الهدف الرئيسي: سكربت توليد الترويسة العربية الإلزامية وإضافتها
 *    إلى أعلى أي ملف موجود في المشروع.
 * 📋 المعايير:
 *    - يجب قراءة محتوى الملف لفهم وظيفته.
 *    - يجب إضافة الترويسة في الأعلى دون تغيير المحتوى.
 *    - يجب التحقق من عدم وجود ترويسة مسبقاً.
 * 🧪 الاختبارات: لا توجد اختبارات (سكربت إداري).
 * 🏷️ المعرف: INFRA-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Non-destructive Header Injection
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تغيير محتوى الملف الأصلي.
 *    2. التحقق من عدم وجود ترويسة مسبقاً.
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

const HEADER_MARKER = '═══════════════════════════════════════════════════════════════════════════';

const generateHeader = (name: string, filePath: string, id: string, goal: string): string =>
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

async function main() {
  console.log('📝 سكربت توليد الترويسة | Header Generator Script');
  console.log('─'.repeat(50));

  const filePath = await ask('📂 المسار النسبي للملف: ');
  const id = await ask('🏷️  المعرف الفريد (ID): ');
  const goal = await ask('🎯 الهدف الرئيسي: ');

  const fullPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ الملف غير موجود: ${filePath}`);
    rl.close();
    process.exit(1);
  }

  const content = fs.readFileSync(fullPath, 'utf-8');

  if (content.includes(HEADER_MARKER)) {
    console.log(`⚠️  الترويسة موجودة مسبقاً: ${filePath}`);
    rl.close();
    process.exit(0);
  }

  const name = path.basename(fullPath);
  const header = generateHeader(name, filePath, id, goal);
  const newContent = header + '\n' + content;

  fs.writeFileSync(fullPath, newContent, 'utf-8');
  console.log(`✅ تم إضافة الترويسة: ${filePath}`);
  console.log(`🏷️  المعرف: ${id}`);

  rl.close();
}

main().catch(console.error);
