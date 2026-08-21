/**

- ============================================================
- 📄 الملف: CHANGELOG.md
- 📂 المسار: CHANGELOG.md
- 🎯 الهدف الرئيسي: سجل التغييرات الرسمي للمشروع، يتبع
- معايير Keep a Changelog وإصدار Semantic Versioning.
- 📋 المعايير:
- - يجب توثيق كل تغيير جوهري في الإصدارات.
- - يجب استخدام تنسيق [Added], [Changed], [Deprecated],
-      [Removed], [Fixed], [Security].
- - يجب ربط كل تغيير بتعريف (PHASE/ID).
- 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
- 🏷️ المعرف: DOC-ADMIN-04
- 📅 تاريخ الإنشاء: 2026-08-19
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة: لا توجد.
- ============================================================
  */

# سجل التغييرات - LibreText Editor Suite

كل التغييرات المهمة في هذا المشروع ستُوثق في هذا الملف.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/),
والإصدار يتبع [Semantic Versioning](https://semver.org/).

## [لم يُصدر بعد]

### Added (تمت الإضافة)

- إنشاء الخطة المعمارية النهائية (Blueprint).
- تعريف فهرس المعرفات الكامل (INFRA, CORE, SER, PLUG, ADAP, PLAY, DOC, SEC, TEST).
- تحديد هيكل المشروع النهائي.
- إنشاء ملفات الإدارة الأساسية (PLAN.md, JOURNAL.md, INDEX.md, LICENSE, CONTRIBUTING.md, README.md, CHANGELOG.md).
- إنشاء AGENTS.md [DOC-ADMIN-05] — تعليمات العميل التنفيذي.
- إنشاء Components Registry.md [DOC-ADMIN-06] — سجل المكونات.
- إنشاء API Registry.md [DOC-ADMIN-07] — سجل الـ APIs والخوارزميات.
- إنشاء SystemInventory.json [DOC-ADMIN-08] — جرد النظام.
- إضافة القواعد الصارمة: الثيم الفاتح النقي، التفاعل بالماوس، السبورة البيضاء.

### High Priority Engines Integration — تكامل المحركات ذات الأولوية العالية (2026-08-21)

- ✅ `packages/core/src/engines/html-pipeline.ts` — محرك HTMLPipeline: sanitizeHtml, toRichTextDocument, exportToCleanHtml [CORE-ENG-001]
- ✅ `packages/core/src/engines/file-type-detection.ts` — محرك التعرف على أنواع الملفات متعدد الإشارات [CORE-ENG-002]
- ✅ `packages/core/src/engines/unified-ingestion.ts` — خط أنابيب الاستيراد الموحد مع إصلاح Mojibake [CORE-ENG-003]
- ✅ `packages/core/src/engines/image-pipeline.ts` — محرك الصور: EXIF Orientation, Crop, Filters, Compress, Thumbnail [CORE-ENG-004]
- ✅ `packages/core/src/engines/validation.ts` — محرك فحص وتعقيم HTML مع فحص توازن الوسوم [CORE-016]
- ✅ `packages/core/src/converters/universal-format-converter.ts` — محول 20+ صيغة: استيراد وتصدير [CORE-017]
- ✅ `packages/core/src/types.ts` — أنواع المستندات: DocumentModel, EditorPlugin, SharedFormattingState [CORE-018]
- ✅ `packages/algorithms/src/formula/latex-engine.ts` — محرك LaTeX: Recursive Descent Parser → SVG/HTML [ALGO-031]
- ✅ `packages/algorithms/src/formula/markdown-engine.ts` — محرك Markdown: تحويل ثنائي الاتجاه MD↔HTML [ALGO-032]
- ✅ تحديث Barrel Export + 0 type errors + 856 tests pass

### Fifth Backup Integration — تكامل النسخة الاحتياطية الخامسة (2026-08-21)

- ✅ `packages/core/src/utils/arabic-text.ts` — أدوات النص العربي (RTL, Numerals, Diacritics) [UTIL-AR-001]
- ✅ `packages/core/src/utils/formula-parser.ts` — محلل صيغ Excel ثنائية اللغة [UTIL-FORM-001]
- ✅ `packages/core/src/utils/content-validator.ts` — validators لكل نوع ContentBlock [CORE-013]
- ✅ `packages/core/src/utils/document-validator.ts` — التحقق الشامل للمستندات [UTIL-VAL-002]
- ✅ `packages/core/src/parsers/frontmatter-parser.ts` — محلل YAML FrontMatter [SER-006-07]
- ✅ `packages/core/src/parsers/markdown.ts` — محلل Markdown إلى ContentBlock [SER-006-06]
- ✅ `packages/algorithms/src/formula/functions-matrix.ts` — دوال المصفوفات والـ Lambda [ALGO-018]
- ✅ `packages/algorithms/src/formula/markdown-formula.ts` — محرك الصيغ [ALGO-019]
- ✅ `packages/serializers/src/docx/` — محول DOCX completo (7 ملفات) [SER-006-01..05]
- ✅ `packages/serializers/src/parsers/` — محلل frontmatter + markdown [SER-006-06..07]
- ✅ جميع الأخطاء النوعية مُصلحة — صفر أخطاء tsc
- ✅ 856 اختبار ناجح — لا تراجعات

### PHASE-00 — بيئة التطوير (2026-08-19)

- ✅ إنشاء `package.json` الجذري مع جميع السكربتات.
- ✅ إنشاء `tsconfig.base.json` + `tsconfig.json` مع TypeScript صارم.
- ✅ إنشاء `pnpm-workspace.yaml` لإدارة Monorepo.
- ✅ إنشاء `packages/core/package.json` مع Vite Library Mode.
- ✅ إنشاء `packages/core/vite.config.ts` مع dts plugin.
- ✅ إنشاء `scripts/generate-file.ts` — سكربت توليد ملفات جديدة.
- ✅ إنشاء `scripts/generate-header.ts` — سكربت توليد الترويسة.
- ✅ إنشاء `vitest.config.ts` مع تغطية 95%.
- ✅ إنشاء `turbo.json` لإدارة المهام.
- ✅ إنشاء `eslint.config.js` + `.prettierrc`.
- ✅ تثبيت جميع الاعتماديات بنجاح.

### Algorithms Studio Integration — تكامل مكتبة الخوارزميات (2026-08-21)

- ✅ `packages/algorithms/src/graph/dependency.ts` — كشف التبعيات الدائرية + الفرز الجغرافي [ALGO-020]
- ✅ `packages/algorithms/src/graph/routing.ts` — توجيه محاذاةOrthogonal + A* [ALGO-021]
- ✅ `packages/algorithms/src/graph/routing-types.ts` — أنواع التوجيه [ALGO-022]
- ✅ `packages/algorithms/src/graph/orthogonal-router.ts` — مُوجّه متقدم مع مسارات ملساء [ALGO-023]
- ✅ `packages/algorithms/src/tree/llrb.ts` — شجرة LLRB (Left-Leaning Red-Black) [ALGO-024]
- ✅ `packages/algorithms/src/structure/disjoint-set.ts` — مجموعة منفصلة Union-Find [ALGO-025]
- ✅ `packages/algorithms/src/sort/mergesort.ts` — خوارزمية الدمج with Arabic collation [ALGO-026]
- ✅ `packages/algorithms/src/lookup/hlookup.ts` — بحث أفقي HLOOKUP [ALGO-027]
- ✅ `packages/algorithms/src/formula/arabic-aliases.ts` — أسماء دوال عربية [ALGO-028]
- ✅ `packages/algorithms/src/streets/similarity.ts` — بحث أسماء شوارع [ALGO-029]
- ✅ `packages/algorithms/src/types.ts` — أنواع مشتركة (Point2D, AABB) [ALGO-030]
- ✅ تحديث Barrel Export + 0 type errors + 856 tests pass

### PHASE-01 — النواة Core (2026-08-19)

- ✅ `packages/core/src/ast/types.ts` — تعريفات AST (20+ نوع).
- ✅ `packages/core/src/ast/schema.ts` — مخطط AST مع التحقق.
- ✅ `packages/core/src/ast/builder.ts` — بناء الكتل (Builder Pattern).
- ✅ `packages/core/src/state/editor-state.ts` — حالة المحرر (Immutable).
- ✅ `packages/core/src/state/operations.ts` — عمليات التحرير.
- ✅ `packages/core/src/state/history.ts` — التراجع والإعادة.
- ✅ `packages/core/src/indexer/indexer.ts` — نظام الفهرسة.
- ✅ `packages/core/src/indexer/search.ts` — واجهة البحث النصي.
- ✅ `packages/core/src/utils/id.ts` — توليد المعرفات.
- ✅ `packages/core/src/utils/validation.ts` — التحقق من الصحة.
- ✅ `packages/core/src/index.ts` — التصدير العام.
- ✅ اختبارات: 44 اختبار ناجح (تغطية 100%).
