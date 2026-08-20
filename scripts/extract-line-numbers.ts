/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: extract-line-numbers.ts
 * 📂 المسار: scripts/extract-line-numbers.ts
 * 🎯 الهدف الرئيسي: استخراج أرقام الأسطر الحقيقية لكل دالة/كلاس/method
 *    مُصدَّرة أو خاصة من ملفات TypeScript، لاستخدامها في تحديث ترويسة
 *    الملف (قسم "📊 الدوال والخوارزميات") بدقة بدل التقدير اليدوي.
 * 📋 المعايير:
 *    - دعم TypeScript و Node.js CLI
 *    - استخراج الدوال والكلاسات و arrow functions والـ methods بدقة
 *    - توفير تنسيقات متعددة: header, json, table
 * 🧪 الاختبارات: لا توجد اختبارات (سكربت إداري وتطويري).
 * 🏷️ المعرف: INFRA-013
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Multi-format Symbol Line Extractor + Header Formatter
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يعتمد على regex وليس AST كامل عبر TypeScript Compiler API، لذا قد
 *       يخطئ مع التوقيعات الممتدة لعدة أسطر أو overloads المعقدة.
 *    2. تشغيل السكربت من جذر المشروع أو مسار صالح.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من وجود الملف قبل القراءة
 *    - معالجة خيارات المدخلات غير الصالحة وتوضيح رسالة الاستخدام
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#INFRA-013
 *    - 📦 التبعيات: fs, path
 *    - 📄 مرتبط مباشر: scripts/README.md, package.json
 *    - 📚 مراجع: AGENTS.md §1 & §10
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - extractSymbols(): استخراج الرموز وأرقام أسطرها (#L64)
 *    - formatAsHeader(): تنسيق الرموز لقسم الترويسة (#L178)
 *    - formatAsTable(): تنسيق الرموز كجدول Markdown (#L189)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم توفير السكربت بصيغة TypeScript متوافقة مع tsx وأيضاً يمكن تشغيله كـ CLI
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل حالية
 *    - 🎯 التحسينات المستقبلية: نسخة AST مبنية على ts.createSourceFile
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';

export interface ExtractedSymbol {
  name: string;
  type: 'class' | 'function' | 'arrow-function' | 'method' | 'static-method' | 'constructor';
  line: number;
  exported: boolean;
  scope: string;
}

export function extractSymbols(filePath: string): ExtractedSymbol[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const symbols: ExtractedSymbol[] = [];

  let currentClass: string | null = null;
  let classBraceDepth = 0;
  let braceDepth = 0;

  const classDeclRe = /^\s*export\s+(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/;
  const funcDeclRe = /^\s*export\s+(?:default\s+)?(?:async\s+)?function\s*\*?\s+(\w+)\s*\(/;
  const privateFuncDeclRe = /^\s*(?:async\s+)?function\s*\*?\s+(\w+)\s*\(/;
  const arrowConstRe = /^\s*export\s+(?:default\s+)?const\s+(\w+)\s*(?::\s*[^=]+)?=\s*(?:async\s*)?\(?[^=]*\)?\s*=>/;
  const privateArrowConstRe = /^\s*const\s+(\w+)\s*(?::\s*[^=]+)?=\s*(?:async\s*)?\(?[^=]*\)?\s*=>/;
  const methodRe = /^\s*(?:private\s+|public\s+|protected\s+|static\s+|readonly\s+|async\s+|get\s+|set\s+)*(\w+)\s*(?:<[^>]*>)?\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\s*\{/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (typeof line !== 'string') continue;
    const lineNo = i + 1;

    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;

    let m: RegExpExecArray | null;

    if ((m = classDeclRe.exec(line)) && m[1]) {
      symbols.push({
        name: m[1],
        type: 'class',
        line: lineNo,
        exported: true,
        scope: 'top-level'
      });
      currentClass = m[1];
      classBraceDepth = braceDepth;
    } else if (!currentClass && (m = funcDeclRe.exec(line)) && m[1]) {
      symbols.push({
        name: m[1],
        type: 'function',
        line: lineNo,
        exported: true,
        scope: 'top-level'
      });
    } else if (!currentClass && !line.trim().startsWith('export') && (m = privateFuncDeclRe.exec(line)) && m[1]) {
      symbols.push({
        name: m[1],
        type: 'function',
        line: lineNo,
        exported: false,
        scope: 'top-level'
      });
    } else if (!currentClass && (m = arrowConstRe.exec(line)) && m[1]) {
      symbols.push({
        name: m[1],
        type: 'arrow-function',
        line: lineNo,
        exported: true,
        scope: 'top-level'
      });
    } else if (!currentClass && !line.trim().startsWith('export') && (m = privateArrowConstRe.exec(line)) && m[1]) {
      symbols.push({
        name: m[1],
        type: 'arrow-function',
        line: lineNo,
        exported: false,
        scope: 'top-level'
      });
    } else if (currentClass && braceDepth === classBraceDepth + 1) {
      if ((m = methodRe.exec(line)) && m[1]) {
        const reserved = ['if', 'for', 'while', 'switch', 'catch', 'constructor'];
        if (!reserved.includes(m[1])) {
          const isPrivate = /private\s/.test(line);
          const isStatic = /static\s/.test(line);
          symbols.push({
            name: `${currentClass}.${m[1]}`,
            type: isStatic ? 'static-method' : 'method',
            line: lineNo,
            exported: !isPrivate,
            scope: currentClass
          });
        } else if (m[1] === 'constructor') {
          symbols.push({
            name: `${currentClass}.constructor`,
            type: 'constructor',
            line: lineNo,
            exported: true,
            scope: currentClass
          });
        }
      }
    }

    braceDepth += opens - closes;

    if (currentClass && braceDepth <= classBraceDepth && (opens > 0 || closes > 0)) {
      if (braceDepth === classBraceDepth) {
        currentClass = null;
      }
    }
  }

  return symbols;
}

export function formatAsHeader(symbols: ExtractedSymbol[]): string {
  const lines = [
    ' * 📊 الدوال والخوارزميات | Functions & Algorithms:',
  ];
  for (const s of symbols) {
    const visibility = s.exported ? '' : ' — private';
    lines.push(` *    - ${s.name}()${visibility} (#L${s.line})`);
  }
  return lines.join('\n');
}

export function formatAsTable(symbols: ExtractedSymbol[]): string {
  const header = '| الاسم | النوع | السطر | مُصدَّرة؟ |\n|---|---|---|---|';
  const rows = symbols.map(
    s => `| ${s.name}() | ${s.type} | L${s.line} | ${s.exported ? 'نعم' : 'لا'} |`
  );
  return [header, ...rows].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────
// نقطة الدخول عند التشغيل المباشر
// ─────────────────────────────────────────────────────────────────────────
if (process.argv[1] && (process.argv[1].endsWith('extract-line-numbers.ts') || process.argv[1].endsWith('extract-line-numbers.js'))) {
  const args = process.argv.slice(2);
  const filePath = args.find(a => !a.startsWith('--'));
  const formatArg = args.find(a => a.startsWith('--format='));
  const format = formatArg ? formatArg.split('=')[1] : 'header';

  if (!filePath) {
    console.error('الاستخدام: npx tsx scripts/extract-line-numbers.ts <path-to-file.ts> [--format=header|json|table]');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`الملف غير موجود: ${filePath}`);
    process.exit(1);
  }

  const symbols = extractSymbols(filePath);

  console.log(`\n📄 الملف: ${path.basename(filePath)}`);
  console.log(`🔢 عدد الرموز المكتشفة: ${symbols.length}\n`);

  if (format === 'json') {
    console.log(JSON.stringify(symbols, null, 2));
  } else if (format === 'table') {
    console.log(formatAsTable(symbols));
  } else {
    console.log(formatAsHeader(symbols));
  }

  console.log('\n⚠️ تنبيه: هذا الاستخراج يعتمد على regex وليس AST كامل.');
  console.log('   راجع النتائج يدوياً قبل اعتمادها، خصوصاً مع:');
  console.log('   - دوال متعددة الأسطر (توقيع طويل يمتد لعدة أسطر)');
  console.log('   - overloads (نفس الاسم بتوقيعات متعددة)');
  console.log('   - arrow functions معقدة التوقيع (generics متداخلة)');
}
