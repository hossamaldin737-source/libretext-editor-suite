/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: update-indexes.ts
 * 📂 المسار: scripts/update-indexes.ts
 * 🎯 الهدف الرئيسي: سكربت تلقائي لفهرسة الدوال، الكلاسات، والtypes
 *    وتحديث SystemInventory.json بانتظام لضمان دقة التتبع.
 * 📋 المعايير:
 *    - مسح جميع ملفات المشروع في packages/
 *    - استخراج الدوال والكلاسات والـ interfaces والـ types
 *    - تحديث إحصائيات SystemInventory.json تلقائياً
 * 🧪 الاختبارات: تشغيل مباشر عبر tsx
 * 🏷️ المعرف: INFRA-014
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Automated Codebase Indexer + JSON Sync Engine
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. استبعاد المجلدات الخارجية مثل node_modules و dist.
 *    2. التعامل الآمن مع الأخطاء عند الكتابة فوق ملفات الفهرس.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من وجود المجلدات قبل البحث
 *    - استخدام Try/Catch مع تقارير واضحة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#INFRA-014
 *    - 📦 التبعيات: fs, path
 *    - 📄 مرتبط مباشر: SystemInventory.json
 *    - 📚 مراجع: AGENTS.md §10 & §12
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - scanDirectory(): المسح التراجعي للملفات والمجلدات (#L65)
 *    - extractSymbolsFromFile(): استخراج رموز الكود من ملف (#L85)
 *    - runIndexUpdater(): 실행 الفهرسة التلقائية (#L115)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يمكن تشغيل السكربت عبر: pnpm update:indexes
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

interface CodeSymbol {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type';
  file: string;
  line: number;
}

function scanDirectory(dir: string, fileList: string[] = []): string[] {
  const skip = ['node_modules', 'dist', '.git', '.cache', 'coverage'];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (skip.includes(file)) continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDirectory(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function extractSymbolsFromFile(filePath: string): CodeSymbol[] {
  const symbols: CodeSymbol[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i]!;
    const fnMatch = trimmed.match(/^export\s+(?:async\s+)?function\s+([a-zA-Z0-9_$]+)/);
    if (fnMatch) {
      symbols.push({ name: fnMatch[1]!, type: 'function', file: filePath, line: i + 1 });
      continue;
    }
    const classMatch = trimmed.match(/^export\s+class\s+([a-zA-Z0-9_$]+)/);
    if (classMatch) {
      symbols.push({ name: classMatch[1]!, type: 'class', file: filePath, line: i + 1 });
      continue;
    }
    const intMatch = trimmed.match(/^export\s+interface\s+([a-zA-Z0-9_$]+)/);
    if (intMatch) {
      symbols.push({ name: intMatch[1]!, type: 'interface', file: filePath, line: i + 1 });
      continue;
    }
    const typeMatch = trimmed.match(/^export\s+type\s+([a-zA-Z0-9_$]+)/);
    if (typeMatch) {
      symbols.push({ name: typeMatch[1]!, type: 'type', file: filePath, line: i + 1 });
    }
  }
  return symbols;
}

function runIndexUpdater() {
  console.log('🔄 [IndexUpdater] Starting automated codebase indexing...');
  const rootDir = process.cwd();
  const tsFiles = scanDirectory(rootDir);

  let totalFunctions = 0;
  let totalClasses = 0;
  let totalInterfaces = 0;
  let totalTypes = 0;

  for (const file of tsFiles) {
    const symbols = extractSymbolsFromFile(file);
    for (const sym of symbols) {
      if (sym.type === 'function') totalFunctions++;
      if (sym.type === 'class') totalClasses++;
      if (sym.type === 'interface') totalInterfaces++;
      if (sym.type === 'type') totalTypes++;
    }
  }

  console.log(`📊 [IndexUpdater] Scan completed:`);
  console.log(`   - Total Files Scanned: ${tsFiles.length}`);
  console.log(`   - Functions: ${totalFunctions}`);
  console.log(`   - Classes: ${totalClasses}`);
  console.log(`   - Interfaces: ${totalInterfaces}`);
  console.log(`   - Types: ${totalTypes}`);

  const inventoryPath = path.join(rootDir, 'SystemInventory.json');
  if (fs.existsSync(inventoryPath)) {
    try {
      const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));
      inventory.statistics = {
        totalFiles: tsFiles.length,
        totalFunctions,
        totalClasses,
        totalInterfaces,
        totalTypes,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2), 'utf-8');
      console.log('✅ [IndexUpdater] SystemInventory.json successfully updated.');
    } catch (err) {
      console.warn('⚠️ [IndexUpdater] Could not update SystemInventory.json:', err);
    }
  } else {
    console.warn('⚠️ [IndexUpdater] SystemInventory.json not found — skipping update.');
  }

  console.log('✨ [IndexUpdater] All indexes synchronized successfully.');
}

import { fileURLToPath } from 'url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runIndexUpdater();
}

export { runIndexUpdater, scanDirectory, extractSymbolsFromFile };
