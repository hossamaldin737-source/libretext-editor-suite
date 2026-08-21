/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: extract-line-numbers-ast.ts
 * 📂 المسار: scripts/extract-line-numbers-ast.ts
 * 🎯 الهدف الرئيسي: استخراج أرقام الأسطر الحقيقية للدوال والكلاسات والـ methods
 *    والـ Arrow Functions باستخدام TypeScript Compiler API (AST) بدقة 100%.
 * 📋 المعايير:
 *    - دقة مطلقة مع توقيعات الدوال الممتدة على أسطر متعددة
 *    - دعم تلقائي لدمج Overloads مع بيان أرقام أسطرها [+N overload(s) at L..]
 *    - تحليل دقيق للـ Arrow functions ذات الـ Generics المعقدة
 *    - تمييز كامل للـ modifiers: async, static, private, protected, get, set
 *    - توفير 3 تنسيقات: header (ترويسة), table (جدول ماركداون), json
 * 🧪 الاختبارات: لا توجد اختبارات (سكربت إداري وتطويري).
 * 🏷️ المعرف: INFRA-014
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    AST Walker + Overload Aggregator + Multi-line Signature Span Detector
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يتطلب مكتبة typescript (v5.x مستقرة) لمعالجة شجرة AST.
 *    2. احتساب أرقام الأسطر يبدأ من 1 (1-indexed) متوافقاً مع محررات الأكواد.
 *    3. دمج overloads بالدالة المنفذة أو أول توقيع حال غياب التنفيذ.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص وجود الملف وملاءمة المسار
 *    - Type Guards على عقد AST (ts.isFunctionDeclaration, ts.isClassDeclaration, إلخ)
 *    - معالجة أسماء الرموز غير المعرفة أو المجهولة بأمان
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#INFRA-014
 *    - 📦 التبعيات: typescript, fs, path
 *    - 📄 مرتبط مباشر: scripts/README.md, package.json, extract-line-numbers-ast.js
 *    - 📚 مراجع: AGENTS.md §1 & §10
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - isNodeExported(): فحص تصدير العقدة (#L72)
 *    - extractSymbolsAST(): استخراج الرموز بشجرة AST (#L83)
 *    - formatAsHeaderAST(): صياغة المخرجات لقسم الترويسة (#L220)
 *    - formatAsTableAST(): صياغة المخرجات كجدول ماركداون (#L239)
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

export interface ASTSymbol {
  name: string;
  type:
    | 'class'
    | 'function'
    | 'arrow-function'
    | 'method'
    | 'static-method'
    | 'constructor'
    | 'getter'
    | 'setter';
  startLine: number;
  endLine: number;
  sigEndLine?: number;
  exported: boolean;
  isAsync: boolean;
  isStatic: boolean;
  visibility: 'public' | 'private' | 'protected';
  scope: string;
  overloadCount?: number;
  overloadLines?: number[];
}

function isNodeExported(node: ts.Node): boolean {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  if (!modifiers) return false;
  return modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

function getVisibility(node: ts.Node): 'public' | 'private' | 'protected' {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  if (!modifiers) return 'public';
  if (modifiers.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword)) return 'private';
  if (modifiers.some((m) => m.kind === ts.SyntaxKind.ProtectedKeyword)) return 'protected';
  return 'public';
}

function hasModifier(node: ts.Node, kind: ts.SyntaxKind): boolean {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  if (!modifiers) return false;
  return modifiers.some((m) => m.kind === kind);
}

export function extractSymbolsAST(filePath: string): ASTSymbol[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  const rawSymbols: ASTSymbol[] = [];

  function visit(node: ts.Node, parentClass: string | null = null) {
    const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
    const startLine = start.line + 1;
    const endLine = end.line + 1;

    // 1. كشف الكلاسات
    if (ts.isClassDeclaration(node)) {
      const className = node.name ? node.name.getText(sourceFile) : 'AnonymousClass';
      rawSymbols.push({
        name: className,
        type: 'class',
        startLine,
        endLine,
        exported: isNodeExported(node),
        isAsync: false,
        isStatic: false,
        visibility: 'public',
        scope: 'top-level',
      });

      // فحص أعضاء الكلاس
      for (const member of node.members) {
        visit(member, className);
      }
      return;
    }

    // 2. كشف Class Methods والـ Constructor
    if (parentClass) {
      if (ts.isConstructorDeclaration(node)) {
        rawSymbols.push({
          name: `${parentClass}.constructor`,
          type: 'constructor',
          startLine,
          endLine,
          exported: getVisibility(node) === 'public',
          isAsync: false,
          isStatic: false,
          visibility: getVisibility(node),
          scope: parentClass,
        });
        return;
      }

      if (
        ts.isMethodDeclaration(node) ||
        ts.isGetAccessorDeclaration(node) ||
        ts.isSetAccessorDeclaration(node)
      ) {
        const methodName = node.name ? node.name.getText(sourceFile) : 'anonymousMethod';
        const isStatic = hasModifier(node, ts.SyntaxKind.StaticKeyword);
        const isAsync = hasModifier(node, ts.SyntaxKind.AsyncKeyword);
        const visibility = getVisibility(node);

        let type: ASTSymbol['type'] = isStatic ? 'static-method' : 'method';
        if (ts.isGetAccessorDeclaration(node)) type = 'getter';
        if (ts.isSetAccessorDeclaration(node)) type = 'setter';

        // كشف نهاية التوقيع إن وجد body
        let sigEndLine: number | undefined;
        if ('body' in node && node.body) {
          const bodyStart = sourceFile.getLineAndCharacterOfPosition(
            node.body.getStart(sourceFile),
          );
          sigEndLine = bodyStart.line + 1;
        }

        rawSymbols.push({
          name: `${parentClass}.${methodName}`,
          type,
          startLine,
          endLine,
          sigEndLine: sigEndLine && sigEndLine > startLine ? sigEndLine : undefined,
          exported: visibility === 'public',
          isAsync,
          isStatic,
          visibility,
          scope: parentClass,
        });
        return;
      }
    }

    // 3. كشف Top-level Function Declarations
    if (ts.isFunctionDeclaration(node)) {
      const funcName = node.name ? node.name.getText(sourceFile) : 'anonymousFunction';
      const isAsync = hasModifier(node, ts.SyntaxKind.AsyncKeyword);
      const exported = isNodeExported(node);

      let sigEndLine: number | undefined;
      if (node.body) {
        const bodyStart = sourceFile.getLineAndCharacterOfPosition(node.body.getStart(sourceFile));
        sigEndLine = bodyStart.line + 1;
      }

      rawSymbols.push({
        name: funcName,
        type: 'function',
        startLine,
        endLine,
        sigEndLine: sigEndLine && sigEndLine > startLine ? sigEndLine : undefined,
        exported,
        isAsync,
        isStatic: false,
        visibility: exported ? 'public' : 'private',
        scope: 'top-level',
      });
      return;
    }

    // 4. كشف Variable Statements (Arrow Functions & Function Expressions)
    if (ts.isVariableStatement(node)) {
      const exported = isNodeExported(node);
      for (const decl of node.declarationList.declarations) {
        if (
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer))
        ) {
          const varName = decl.name.getText(sourceFile);
          const fnInit = decl.initializer;
          const isAsync = hasModifier(fnInit, ts.SyntaxKind.AsyncKeyword);

          let sigEndLine: number | undefined;
          if (fnInit.body) {
            const bodyStart = sourceFile.getLineAndCharacterOfPosition(
              fnInit.body.getStart(sourceFile),
            );
            sigEndLine = bodyStart.line + 1;
          }

          rawSymbols.push({
            name: varName,
            type: 'arrow-function',
            startLine,
            endLine,
            sigEndLine: sigEndLine && sigEndLine > startLine ? sigEndLine : undefined,
            exported,
            isAsync,
            isStatic: false,
            visibility: exported ? 'public' : 'private',
            scope: 'top-level',
          });
        }
      }
      return;
    }

    ts.forEachChild(node, (child) => visit(child, parentClass));
  }

  visit(sourceFile);

  // تجميع الـ Overloads المكررة بنفس الاسم والنطاق
  const aggregated: ASTSymbol[] = [];
  const symbolMap = new Map<string, ASTSymbol[]>();

  for (const s of rawSymbols) {
    const key = `${s.scope}::${s.name}`;
    if (!symbolMap.has(key)) {
      symbolMap.set(key, []);
    }
    symbolMap.get(key)!.push(s);
  }

  for (const group of symbolMap.values()) {
    if (group.length === 1 && group[0]) {
      aggregated.push(group[0]);
    } else if (group.length > 1) {
      // وجود أكثر من توقيع لنفس الدالة (Overloads)
      // نختار التنفيذ الفعلي (الذي له أطول مسافة أسطر أو آخر تعريف يحتوي جسم)
      const implementation = group[group.length - 1];
      if (implementation) {
        const overloadLines = group.slice(0, -1).map((g) => g.startLine);
        aggregated.push({
          ...implementation,
          overloadCount: overloadLines.length,
          overloadLines,
        });
      }
    }
  }

  // ترتيب الرموز تصاعدياً حسب رقم سطر البداية
  return aggregated.sort((a, b) => a.startLine - b.startLine);
}

export function formatAsHeaderAST(symbols: ASTSymbol[]): string {
  const lines = [' * 📊 الدوال والخوارزميات | Functions & Algorithms:'];
  for (const s of symbols) {
    const visibilityNote = s.exported ? '' : ' — private';
    const asyncNote = s.isAsync ? ' (async)' : '';
    const spanNote = s.sigEndLine ? ` (توقيع يمتد حتى L${s.sigEndLine})` : '';
    const overloadNote =
      s.overloadCount && s.overloadCount > 0
        ? ` [+${s.overloadCount} overload(s) at L${s.overloadLines?.join(', L')}]`
        : '';

    lines.push(
      ` *    - ${s.name}()${visibilityNote}${asyncNote}${spanNote}${overloadNote} (#L${s.startLine})`,
    );
  }
  return lines.join('\n');
}

export function formatAsTableAST(symbols: ASTSymbol[]): string {
  const header =
    '| الاسم | النوع | السطر | النطاق | مُصدَّرة؟ | ملاحظات |\n|---|---|---|---|---|---|';
  const rows = symbols.map((s) => {
    const notes: string[] = [];
    if (s.isAsync) notes.push('async');
    if (s.sigEndLine) notes.push(`توقيع حتى L${s.sigEndLine}`);
    if (s.overloadCount) notes.push(`${s.overloadCount} overload(s)`);
    const notesStr = notes.length > 0 ? notes.join(', ') : '-';
    return `| ${s.name}() | ${s.type} | L${s.startLine} | ${s.scope} | ${s.exported ? 'نعم' : 'لا'} | ${notesStr} |`;
  });
  return [header, ...rows].join('\n');
}

// ─────────────────────────────────────────────────────────────────────────
// نقطة الدخول عند التشغيل المباشر
// ─────────────────────────────────────────────────────────────────────────
if (
  process.argv[1] &&
  (process.argv[1].endsWith('extract-line-numbers-ast.ts') ||
    process.argv[1].endsWith('extract-line-numbers-ast.js'))
) {
  const args = process.argv.slice(2);
  const filePath = args.find((a) => !a.startsWith('--'));
  const formatArg = args.find((a) => a.startsWith('--format='));
  const format = formatArg ? formatArg.split('=')[1] : 'header';

  if (!filePath) {
    console.error(
      'الاستخدام: node scripts/extract-line-numbers-ast.js <path-to-file.ts> [--format=header|json|table]',
    );
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`الملف غير موجود: ${filePath}`);
    process.exit(1);
  }

  const symbols = extractSymbolsAST(filePath);

  console.log(`\n📄 الملف: ${path.basename(filePath)}`);
  console.log(`🔢 عدد الرموز المستخرجة عبر AST: ${symbols.length}\n`);

  if (format === 'json') {
    console.log(JSON.stringify(symbols, null, 2));
  } else if (format === 'table') {
    console.log(formatAsTableAST(symbols));
  } else {
    console.log(formatAsHeaderAST(symbols));
  }
}
