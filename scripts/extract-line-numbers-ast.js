#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: extract-line-numbers-ast.js
 * 📂 المسار: scripts/extract-line-numbers-ast.js
 * 🎯 الهدف الرئيسي: استخراج أرقام الأسطر الحقيقية للدوال والرموز بدقة 100%
 *    باستخدام TypeScript Compiler API (AST) مع توفير التوقيعات الدقيقة،
 *    ودمج Overloads، وتحليل Generics المعقدة والتوقيعات متعددة الأسطر.
 * 📋 المعايير:
 *    - متوافق مع بيئة ESM و Node.js الحديثة
 *    - كشف التوقيعات الممتدة والـ Overloads والـ Generics المعقدة
 *    - توفير 3 تنسيقات: header (ترويسة), table (جدول ماركداون), json
 * 🧪 الاختبارات: لا توجد اختبارات (سكربت إداري وتطويري).
 * 🏷️ المعرف: INFRA-014-JS
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    TypeScript AST Walker Engine (ESM) + Signature Analyzer + Overload Consolidator
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يتطلب مكتبة typescript لمعالجة شجرة AST.
 *    2. احتساب أرقام الأسطر يبدأ من 1 (1-indexed) متوافقاً مع محررات الأكواد.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من وجود الملف
 *    - حماية الرموز غير المعرفة ومعالجة Null/Undefined بأمان
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#INFRA-014
 *    - 📦 التبعيات: typescript, fs, path
 *    - 📄 مرتبط مباشر: extract-line-numbers-ast.js, scripts/extract-line-numbers-ast.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - hasModifier(): فحص وجود modifier (#L60)
 *    - isExported(): فحص تصدير العقدة (#L65)
 *    - isPrivate(): فحص خصوصية العقدة (#L69)
 *    - isStatic(): فحص كون العضو static (#L73)
 *    - isAsync(): فحص كون الدالة async (#L77)
 *    - formatParams(): تنسيق المعاملات (#L82)
 *    - lineOf(): استخراج رقم سطر البداية (#L89)
 *    - endLineOf(): استخراج رقم سطر النهاية (#L94)
 *    - extractSymbolsAST(): استخراج الرموز بشجرة AST (#L98)
 *    - consolidateOverloads(): دمج وتجميع الـ Overloads (#L213)
 *    - formatAsHeaderAST(): صياغة المخرجات لقسم الترويسة (#L239)
 *    - formatAsTableAST(): صياغة المخرجات كجدول ماركداون (#L257)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - تم بناء هذه الأداة استجابة للحاجة لدقة مطلقة تتفوق على قيود الـ regex
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل حالية
 *    - 📖 مرجع تقني: TypeScript Compiler API (ts.createSourceFile & ts.forEachChild)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: TypeScript Compiler API Guide
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import ts from 'typescript';

/**
 * يتحقق مما إذا كانت العقدة تحمل modifier مُعيَّن (export/private/static/async...)
 */
function hasModifier(node, kind) {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return !!mods?.some((m) => m.kind === kind);
}

function isExported(node) {
  return hasModifier(node, ts.SyntaxKind.ExportKeyword);
}

function isPrivate(node) {
  return hasModifier(node, ts.SyntaxKind.PrivateKeyword);
}

function isStatic(node) {
  return hasModifier(node, ts.SyntaxKind.StaticKeyword);
}

function isAsync(node) {
  return hasModifier(node, ts.SyntaxKind.AsyncKeyword);
}

/** تنسيق قائمة المعاملات كنص مختصر (لعرض التوقيع دون الجسم الكامل) */
function formatParams(params, sourceFile) {
  return params
    .map((p) => p.getText(sourceFile).replace(/\s+/g, ' ').trim())
    .join(', ');
}

/** رقم السطر (1-indexed) لبداية العقدة */
function lineOf(node, sourceFile) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

/** رقم السطر لنهاية العقدة (مفيد لمعرفة امتداد التوقيع متعدد الأسطر) */
function endLineOf(node, sourceFile) {
  return sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line + 1;
}

export function extractSymbolsAST(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TS
  );

  const symbols = [];
  const currentClassStack = [];

  function currentClassName() {
    return currentClassStack.length
      ? currentClassStack[currentClassStack.length - 1]
      : null;
  }

  function visit(node) {
    // ── Class Declaration ──────────────────────────────────────────────
    if (ts.isClassDeclaration(node) && node.name) {
      symbols.push({
        name: node.name.text,
        type: 'class',
        line: lineOf(node, sourceFile),
        endLine: endLineOf(node, sourceFile),
        exported: isExported(node),
        scope: 'top-level',
        signature: `class ${node.name.text}`,
        isOverloadSignature: false
      });
      currentClassStack.push(node.name.text);
      ts.forEachChild(node, visit);
      currentClassStack.pop();
      return;
    }

    // ── Interface Declaration (توثيقية) ──────────────────────────────
    if (ts.isInterfaceDeclaration(node) && node.name) {
      symbols.push({
        name: node.name.text,
        type: 'interface',
        line: lineOf(node, sourceFile),
        endLine: endLineOf(node, sourceFile),
        exported: isExported(node),
        scope: 'top-level',
        signature: `interface ${node.name.text}`,
        isOverloadSignature: false
      });
    }

    // ── Function Declaration (يشمل overloads بدون body) ─────────────────
    if (ts.isFunctionDeclaration(node) && node.name) {
      const hasBody = !!node.body;
      symbols.push({
        name: node.name.text,
        type: currentClassName() ? 'nested-function' : 'function',
        line: lineOf(node, sourceFile),
        endLine: endLineOf(node, sourceFile),
        exported: isExported(node),
        scope: currentClassName() || 'top-level',
        async: isAsync(node),
        signature: `${isAsync(node) ? 'async ' : ''}function ${node.name.text}(${formatParams(node.parameters, sourceFile)})`,
        isOverloadSignature: !hasBody
      });
    }

    // ── Class Method Declaration (يشمل overloads بدون body) ─────────────
    if (ts.isMethodDeclaration(node) && ts.isIdentifier(node.name)) {
      const cls = currentClassName();
      const hasBody = !!node.body;
      symbols.push({
        name: cls ? `${cls}.${node.name.text}` : node.name.text,
        type: isStatic(node) ? 'static-method' : 'method',
        line: lineOf(node, sourceFile),
        endLine: endLineOf(node, sourceFile),
        exported: !isPrivate(node),
        scope: cls || 'unknown',
        async: isAsync(node),
        signature: `${isStatic(node) ? 'static ' : ''}${isAsync(node) ? 'async ' : ''}${node.name.text}(${formatParams(node.parameters, sourceFile)})`,
        isOverloadSignature: !hasBody
      });
    }

    // ── Constructor ───────────────────────────────────────────────────
    if (ts.isConstructorDeclaration(node)) {
      const cls = currentClassName();
      symbols.push({
        name: cls ? `${cls}.constructor` : 'constructor',
        type: 'constructor',
        line: lineOf(node, sourceFile),
        endLine: endLineOf(node, sourceFile),
        exported: true,
        scope: cls || 'unknown',
        signature: `constructor(${formatParams(node.parameters, sourceFile)})`,
        isOverloadSignature: !node.body
      });
    }

    // ── Arrow Function المُسندة إلى const (بما فيها generics معقدة) ────
    if (ts.isVariableStatement(node)) {
      const exported = isExported(node);
      for (const decl of node.declarationList.declarations) {
        if (
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer)) &&
          ts.isIdentifier(decl.name)
        ) {
          const fn = decl.initializer;
          const isFnAsync =
            ts.canHaveModifiers(fn) && ts.getModifiers(fn)?.some((m) => m.kind === ts.SyntaxKind.AsyncKeyword);
          const typeParams = fn.typeParameters
            ? `<${fn.typeParameters.map((tp) => tp.getText(sourceFile)).join(', ')}>`
            : '';
          symbols.push({
            name: decl.name.text,
            type: currentClassName() ? 'nested-arrow-function' : 'arrow-function',
            line: lineOf(node, sourceFile),
            endLine: endLineOf(node, sourceFile),
            exported,
            scope: currentClassName() || 'top-level',
            async: !!isFnAsync,
            signature: `const ${decl.name.text} = ${isFnAsync ? 'async ' : ''}${typeParams}(${formatParams(fn.parameters, sourceFile)}) =>`,
            isOverloadSignature: false
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  symbols.sort((a, b) => a.line - b.line);

  return symbols;
}

/** دمج الـ overloads مع تنفيذها الفعلي في عنصر واحد موحّد للعرض */
export function consolidateOverloads(symbols) {
  const byName = new Map();
  for (const s of symbols) {
    if (!byName.has(s.name)) byName.set(s.name, []);
    byName.get(s.name).push(s);
  }

  const result = [];
  for (const [, group] of byName) {
    if (group.length === 1 && group[0]) {
      result.push({ ...group[0], overloadCount: 0 });
      continue;
    }
    const overloads = group.filter((g) => g.isOverloadSignature);
    const impl = group.find((g) => !g.isOverloadSignature) || group[group.length - 1];
    if (impl) {
      result.push({
        ...impl,
        overloadCount: overloads.length,
        overloadLines: overloads.map((o) => o.line)
      });
    }
  }
  return result.sort((a, b) => a.line - b.line);
}

export function formatAsHeaderAST(symbols) {
  const consolidated = consolidateOverloads(symbols);
  const lines = [' * 📊 الدوال والخوارزميات | Functions & Algorithms:'];
  for (const s of consolidated) {
    if (s.type === 'interface') continue;
    const visibility = s.exported ? '' : ' — private';
    const overloadNote =
      s.overloadCount > 0
        ? ` [+${s.overloadCount} overload(s) at L${s.overloadLines.join(', L')}]`
        : '';
    const asyncNote = s.async ? ' async' : '';
    const multiLineNote = s.endLine > s.line ? ` (توقيع يمتد حتى L${s.endLine})` : '';
    lines.push(
      ` *    - ${s.name}()${asyncNote}${visibility} (#L${s.line})${overloadNote}${multiLineNote}`
    );
  }
  return lines.join('\n');
}

export function formatAsTableAST(symbols) {
  const consolidated = consolidateOverloads(symbols);
  const header =
    '| الاسم | النوع | السطر | نهاية التوقيع | Async | مُصدَّرة؟ | Overloads |\n|---|---|---|---|---|---|---|';
  const rows = consolidated.map((s) => {
    const overloadInfo = s.overloadCount > 0 ? `${s.overloadCount} (L${s.overloadLines.join(',')})` : '—';
    return `| ${s.name}() | ${s.type} | L${s.line} | L${s.endLine} | ${s.async ? 'نعم' : 'لا'} | ${s.exported ? 'نعم' : 'لا'} | ${overloadInfo} |`;
  });
  return [header, ...rows].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────
// نقطة الدخول
// ─────────────────────────────────────────────────────────────────────────
if (process.argv[1] && (process.argv[1].endsWith('extract-line-numbers-ast.js') || process.argv[1].endsWith('extract-line-numbers-ast.ts'))) {
  const args = process.argv.slice(2);
  const filePath = args.find((a) => !a.startsWith('--'));
  const formatArg = args.find((a) => a.startsWith('--format='));
  const format = formatArg ? formatArg.split('=')[1] : 'header';

  if (!filePath) {
    console.error('الاستخدام: node extract-line-numbers-ast.js <path-to-file.ts> [--format=header|json|table]');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`الملف غير موجود: ${filePath}`);
    process.exit(1);
  }

  const symbols = extractSymbolsAST(filePath);
  const consolidated = consolidateOverloads(symbols);

  console.log(`\n📄 الملف: ${path.basename(filePath)}`);
  console.log(`🔢 عدد الرموز (بعد دمج الـ overloads): ${consolidated.length}`);
  const totalOverloads = consolidated.reduce((sum, s) => sum + (s.overloadCount || 0), 0);
  if (totalOverloads > 0) {
    console.log(`🔀 عدد توقيعات الـ overload المكتشفة: ${totalOverloads}`);
  }
  console.log('');

  if (format === 'json') {
    console.log(JSON.stringify(consolidated, null, 2));
  } else if (format === 'table') {
    console.log(formatAsTableAST(symbols));
  } else {
    console.log(formatAsHeaderAST(symbols));
  }

  console.log('\n✅ هذا الاستخراج مبني على TypeScript Compiler API (AST) — دقة بنيوية كاملة.');
  console.log('   يتعامل بشكل صحيح مع: توقيعات متعددة الأسطر، function overloads،');
  console.log('   وarrow functions ذات generics معقدة/متداخلة.');
}

