/**
 * ============================================================
 * 📄 الملف: INDEX.md
 * 📂 المسار: INDEX.md
 * 🎯 الهدف الرئيسي: فهرس شامل لكل ملفات المشروع مع
 *    المعرفات والمسارات والأوصاف لسهولة التنقل والبحث.
 * 📋 المعايير:
 *    - يجب تحديث الفهرس عند إضافة ملف جديد.
 *    - يجب أن يحتوي على جميع الملفات مع مساراتها.
 *    - يجب أن يكون المعرف فريداً لكل ملف.
 * 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
 * 🏷️ المعرف: DOC-ADMIN-03
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ============================================================
 */

# فهرس مشروع LibreText Editor Suite
# LibreText Editor Suite - Project Index

---

## جدول فهرس المعرفات العامة
## General ID Reference Table

| البادئة Prefix | المجال Domain | الوصف Arabic | Description English |
|----------------|---------------|-------------|---------------------|
| `INFRA-*` | البنية التحتية | ملفات الإعداد، الأدوات، السكربتات | Configuration files, tools, scripts |
| `CORE-*` | النواة | AST، State، Operations، Indexer | AST, State, Operations, Indexer |
| `SER-*` | المحولات | Markdown، HTML، PDF، LaTeX، إلخ | Markdown, HTML, PDF, LaTeX, etc. |
| `PLUG-*` | الإضافات | Plugin API، الإضافات الرسمية | Plugin API, Official plugins |
| `ADAP-*` | طبقات التكيف | React، Vue، Web Components | React, Vue, Web Components |
| `PLAY-*` | الملعب التجريبي | Playground، CLI | Playground, CLI |
| `DOC-*` | التوثيق | API، أدلة، أمثلة | API docs, guides, examples |
| `SEC-*` | الأمان | Sanitization، التدقيق | Sanitization, Auditing |
| `TEST-*` | الاختبارات | Unit، Integration، E2E | Unit, Integration, E2E |
| `LEGAL-*` | التراخيص | تراخيص المصادر المفتوحة | Open source licenses |

---

## الشجرة الكاملة للمشروع مع المعرفات
## Complete Project Tree with File IDs

```
libretext-editor-suite/
│
├── [DOC-000] README.md                          # الملف التعريفي الرئيسي / Main project README
├── [DOC-ADMIN-01] PLAN.md                       # خطة المشروع / Project plan
├── [DOC-ADMIN-02] JOURNAL.md                    # يوميات العمل / Work journal
├── [DOC-ADMIN-03] INDEX.md                      # فهرس المشروع / This file (Project index)
├── [DOC-ADMIN-04] CHANGELOG.md                  # سجل التغييرات / Changelog
├── [DOC-GUIDE-01] CONTRIBUTING.md               # دليل المساهمة / Contribution guide
├── [LEGAL-001] LICENSE                          # ترخيص MIT / MIT License
├── [INFRA-001] package.json                     # الحزمة الجذرية / Root package
├── [INFRA-002] tsconfig.base.json               # إعدادات TypeScript الأساسية / Base TS config
├── [INFRA-006] pnpm-workspace.yaml              # إعدادات pnpm Workspace / pnpm workspace config
│
├── 📁 packages/
│   │
│   ├── 📁 core/                                # [CORE] النواة المجردة / Headless Core
│   │   ├── [INFRA-005] package.json             # إعدادات حزمة النواة / Core package config
│   │   ├── [INFRA-012] vite.config.ts           # إعدادات Vite / Vite build config
│   │   │
│   │   ├── 📁 src/
│   │   │   ├── [CORE-011] index.ts              # التصدير العام / Public exports
│   │   │   │
│   │   │   ├── 📁 ast/                          # [CORE-001..003] تعريفات AST / AST definitions
│   │   │   │   ├── [CORE-001] types.ts          # تعريفات الأنواع / Type definitions
│   │   │   │   ├── [CORE-002] schema.ts         # مخطط AST / AST schema
│   │   │   │   └── [CORE-003] builder.ts        # بناء الكتل / Block builder
│   │   │   │
│   │   │   ├── 📁 state/                        # [CORE-004..006] الحالة والعمليات / State & Operations
│   │   │   │   ├── [CORE-004] editor-state.ts   # حالة المحرر / Editor state
│   │   │   │   ├── [CORE-005] operations.ts     # عمليات التحرير / Edit operations
│   │   │   │   └── [CORE-006] history.ts        # التراجع والإعادة / Undo/Redo history
│   │   │   │
│   │   │   ├── 📁 indexer/                      # [CORE-007..008] نظام الفهرسة / Indexing system
│   │   │   │   ├── [CORE-007] indexer.ts        # الفهرسة / Indexer
│   │   │   │   └── [CORE-008] search.ts         # واجهة البحث / Search interface
│   │   │   │
│   │   │   └── 📁 utils/                        # [CORE-009..010] دوال مساعدة / Utility functions
│   │   │       ├── [CORE-009] id.ts             # توليد المعرفات / ID generation
│   │   │       └── [CORE-010] validation.ts     # التحقق من الصحة / Validation
│   │   │
│   │   └── 📁 tests/                            # [TEST-CORE] اختبارات النواة / Core tests
│   │       ├── [TEST-CORE-001] ast/types.test.ts          # اختبارات AST / AST tests
│   │       └── [TEST-CORE-002] state/editor-state.test.ts # اختبارات الحالة / State tests
│   │
│   ├── 📁 serializers/                          # [SER] المحولات / Serializers
│   │   ├── 📁 markdown/                         # [SER-001] محول Markdown / Markdown serializer
│   │   │   ├── [SER-001-01] markdown-serializer.ts
│   │   │   └── [SER-001-02] index.ts
│   │   ├── 📁 html/                             # [SER-002] محول HTML / HTML serializer
│   │   │   ├── [SER-002-01] html-serializer.ts
│   │   │   └── [SER-002-02] index.ts
│   │   ├── 📁 txt/                              # [SER-003] محول TXT / TXT serializer
│   │   │   ├── [SER-003-01] txt-serializer.ts
│   │   │   └── [SER-003-02] index.ts
│   │   ├── 📁 pdf/                              # [SER-004] محول PDF / PDF serializer
│   │   │   ├── [SER-004-01] pdf-serializer.ts
│   │   │   └── [SER-004-02] index.ts
│   │   └── 📁 latex/                            # [SER-005] محول LaTeX / LaTeX serializer
│   │       ├── [SER-005-01] latex-serializer.ts
│   │       └── [SER-005-02] index.ts
│   │
│   ├── 📁 adapters/                             # [ADAP] طبقات التكيف / Adapters
│   │   ├── 📁 react/                            # [ADAP-001] React Adapter
│   │   │   ├── [ADAP-001-01] use-editor.ts      # React Hook
│   │   │   ├── [ADAP-001-02] editor-provider.tsx # React Provider
│   │   │   └── [ADAP-001-03] index.ts
│   │   ├── 📁 vue/                              # [ADAP-002] Vue Adapter
│   │   │   ├── [ADAP-002-01] use-editor.ts
│   │   │   └── [ADAP-002-02] index.ts
│   │   ├── 📁 web-component/                    # [ADAP-003] Web Component
│   │   │   ├── [ADAP-003-01] libre-text-editor.ts
│   │   │   └── [ADAP-003-02] index.ts
│   │   └── 📁 vanilla/                          # [ADAP-004] Vanilla JS
│   │       ├── [ADAP-004-01] vanilla-editor.ts
│   │       └── [ADAP-004-02] index.ts
│   │
│   ├── 📁 plugins/                              # [PLUG] الإضافات الرسمية / Official Plugins
│   │   ├── 📁 mermaid/                          # [PLUG-001] رسوم بيانية / Diagrams
│   │   │   ├── [PLUG-001-01] mermaid-plugin.ts
│   │   │   └── [PLUG-001-02] index.ts
│   │   └── 📁 math/                             # [PLUG-002] معادلات LaTeX / LaTeX equations
│   │       ├── [PLUG-002-01] math-plugin.ts
│   │       └── [PLUG-002-02] index.ts
│   │
│   └── 📁 playground/                           # [PLAY] الملعب التجريبي / Interactive Playground
│       ├── [PLAY-001] index.html                 # الصفحة الرئيسية / Main page
│       ├── [PLAY-002] main.ts                    # نقطة الدخول / Entry point
│       └── [PLAY-003] examples.ts                # أمثلة تفاعلية / Interactive examples
│
├── 📁 docs/                                     # [DOC] التوثيق / Documentation
│   ├── 📁 api/                                  # [DOC-API] وثائق API / API Reference
│   │   └── [DOC-API-001] api-reference.md
│   ├── 📁 guides/                               # [DOC-GUIDE] أدلة المستخدم / User Guides
│   │   ├── [DOC-GUIDE-002] getting-started.md
│   │   ├── [DOC-GUIDE-003] architecture.md
│   │   └── [DOC-GUIDE-004] plugin-development.md
│   └── 📁 examples/                             # [DOC-EX] أمثلة عملية / Code Examples
│       ├── [DOC-EX-001] basic-usage.md
│       └── [DOC-EX-002] advanced-usage.md
│
├── 📁 scripts/                                  # [INFRA-003..004] سكربتات البناء / Build scripts
│   ├── [INFRA-003] generate-file.ts             # سكربت توليد الملفات / File generator
│   ├── [INFRA-004] generate-header.ts           # سكربت توليد الترويسة / Header generator
│   └── [INFRA-004] README.md                    # دليل استخدام السكربت / Scripts guide
│
├── 📁 .github/                                  # [INFRA-007] CI/CD
│   ├── [INFRA-007-01] workflows/ci.yml          # سير عمل التحقق / CI workflow
│   ├── [INFRA-007-02] workflows/release.yml     # سير عمل الإصدار / Release workflow
│   └── [INFRA-007-03] ISSUE_TEMPLATE/           # قوالب Issues / Issue templates
│
└── 📁 .opencode/                                # [INFRA-008] إعدادات OpenCode / OpenCode config
    └── [INFRA-008-01] opencode.jsonc
```

---

## جدول الملفات المرجعي الكامل
## Complete File Reference Table

### البنية التحتية - Infrastructure

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `INFRA-001` | `/package.json` | الحزمة الجذرية | Root package.json | تم |
| `INFRA-002` | `/tsconfig.base.json` | إعدادات TypeScript الأساسية | Base TypeScript config | تم |
| `INFRA-003` | `/scripts/generate-file.ts` | سكربت توليد الملفات | File generator script | لم يبدأ |
| `INFRA-004` | `/scripts/generate-header.ts` | سكربت توليد الترويسة | Header generator script | لم يبدأ |
| `INFRA-004` | `/scripts/README.md` | دليل استخدام السكربت | Scripts usage guide | لم يبدأ |
| `INFRA-005` | `packages/core/package.json` | إعدادات حزمة النواة | Core package config | لم يبدأ |
| `INFRA-006` | `/pnpm-workspace.yaml` | إعدادات pnpm Workspace | pnpm workspace config | تم |
| `INFRA-007-01` | `/.github/workflows/ci.yml` | سير عمل التحقق | CI workflow | لم يبدأ |
| `INFRA-007-02` | `/.github/workflows/release.yml` | سير عمل الإصدار | Release workflow | لم يبدأ |
| `INFRA-007-03` | `/.github/ISSUE_TEMPLATE/` | قوالب Issues | Issue templates | لم يبدأ |
| `INFRA-008-01` | `/.opencode/opencode.jsonc` | إعدادات OpenCode | OpenCode config | لم يبدأ |
| `INFRA-012` | `packages/core/vite.config.ts` | إعدادات Vite | Vite build config | لم يبدأ |

### النواة - Core

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `CORE-001` | `packages/core/src/ast/types.ts` | تعريفات الأنواع | Type definitions | لم يبدأ |
| `CORE-002` | `packages/core/src/ast/schema.ts` | مخطط AST | AST schema | لم يبدأ |
| `CORE-003` | `packages/core/src/ast/builder.ts` | بناء الكتل | Block builder | لم يبدأ |
| `CORE-004` | `packages/core/src/state/editor-state.ts` | حالة المحرر | Editor state | لم يبدأ |
| `CORE-005` | `packages/core/src/state/operations.ts` | عمليات التحرير | Edit operations | لم يبدأ |
| `CORE-006` | `packages/core/src/state/history.ts` | التراجع والإعادة | Undo/Redo history | لم يبدأ |
| `CORE-007` | `packages/core/src/indexer/indexer.ts` | الفهرسة | Indexer | لم يبدأ |
| `CORE-008` | `packages/core/src/indexer/search.ts` | واجهة البحث | Search interface | لم يبدأ |
| `CORE-009` | `packages/core/src/utils/id.ts` | توليد المعرفات | ID generation | لم يبدأ |
| `CORE-010` | `packages/core/src/utils/validation.ts` | التحقق من الصحة | Validation | لم يبدأ |
| `CORE-011` | `packages/core/src/index.ts` | التصدير العام | Public exports | لم يبدأ |

### المحولات - Serializers

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `SER-001` | `packages/serializers/markdown/` | محول Markdown | Markdown serializer | لم يبدأ |
| `SER-002` | `packages/serializers/html/` | محول HTML | HTML serializer | لم يبدأ |
| `SER-003` | `packages/serializers/txt/` | محول TXT | TXT serializer | لم يبدأ |
| `SER-004` | `packages/serializers/pdf/` | محول PDF | PDF serializer | لم يبدأ |
| `SER-005` | `packages/serializers/latex/` | محول LaTeX | LaTeX serializer | لم يبدأ |

### طبقات التكيف - Adapters

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `ADAP-001` | `packages/adapters/react/` | React Adapter | React adapter | لم يبدأ |
| `ADAP-002` | `packages/adapters/vue/` | Vue Adapter | Vue adapter | لم يبدأ |
| `ADAP-003` | `packages/adapters/web-component/` | Web Component | Web Component adapter | لم يبدأ |
| `ADAP-004` | `packages/adapters/vanilla/` | Vanilla JS | Vanilla JS adapter | لم يبدأ |

### الإضافات - Plugins

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `PLUG-001` | `packages/plugins/mermaid/` | رسوم بيانية | Diagram plugin | لم يبدأ |
| `PLUG-002` | `packages/plugins/math/` | معادلات LaTeX | Math/LaTeX plugin | لم يبدأ |

### الملعب التجريبي - Playground

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `PLAY-001` | `packages/playground/index.html` | الصفحة الرئيسية | Main page | لم يبدأ |
| `PLAY-002` | `packages/playground/main.ts` | نقطة الدخول | Entry point | لم يبدأ |
| `PLAY-003` | `packages/playground/examples.ts` | أمثلة تفاعلية | Interactive examples | لم يبدأ |

### التوثيق - Documentation

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `DOC-000` | `/README.md` | الملف التعريفي الرئيسي | Main project README | تم |
| `DOC-ADMIN-01` | `/PLAN.md` | خطة المشروع | Project plan | تم |
| `DOC-ADMIN-02` | `/JOURNAL.md` | يوميات العمل | Work journal | تم |
| `DOC-ADMIN-03` | `/INDEX.md` | فهرس المشروع | Project index | تم |
| `DOC-ADMIN-04` | `/CHANGELOG.md` | سجل التغييرات | Changelog | تم |
| `DOC-ADMIN-05` | `/AGENTS.md` | تعليمات العميل التنفيذي | Executive agent instructions | تم |
| `DOC-ADMIN-06` | `/Components Registry.md` | سجل المكونات | Components registry | تم |
| `DOC-ADMIN-07` | `/API Registry.md` | سجل الـ APIs والخوارزميات | API & algorithms registry | تم |
| `DOC-ADMIN-08` | `/SystemInventory.json` | جرد النظام | System inventory | تم |
| `DOC-GUIDE-01` | `/CONTRIBUTING.md` | دليل المساهمة | Contribution guide | تم |
| `DOC-GUIDE-002` | `docs/guides/getting-started.md` | دليل البدء السريع | Getting started guide | لم يبدأ |
| `DOC-GUIDE-003` | `docs/guides/architecture.md` | دليل المعمارية | Architecture guide | لم يبدأ |
| `DOC-GUIDE-004` | `docs/guides/plugin-development.md` | دليل تطوير الإضافات | Plugin development guide | لم يبدأ |
| `DOC-API-001` | `docs/api/api-reference.md` | وثائق API | API reference | لم يبدأ |
| `DOC-EX-001` | `docs/examples/basic-usage.md` | مثال أساسي | Basic usage example | لم يبدأ |
| `DOC-EX-002` | `docs/examples/advanced-usage.md` | مثال متقدم | Advanced usage example | لم يبدأ |

### الاختبارات - Tests

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `TEST-CORE-001` | `packages/core/tests/ast/types.test.ts` | اختبارات AST | AST tests | لم يبدأ |
| `TEST-CORE-002` | `packages/core/tests/state/editor-state.test.ts` | اختبارات الحالة | State tests | لم يبدأ |

### التراخيص - Legal

| المعرف ID | المسار Path | الوصف Arabic | Description English | الحالة Status |
|-----------|-------------|-------------|---------------------|---------------|
| `LEGAL-001` | `/LICENSE` | ترخيص MIT | MIT License | تم |

---

## البروميت الإلزامي للعميل التنفيذي
## Mandatory Prompt for Executive Agent

> **ملاحظة:** يجب على أي عميل تنفيذي (AI Agent) يعمل على هذا الالتزام بتطبيق الترويسة التالية على **كل ملف** في المشروع.

> **Note:** Any executive agent (AI Agent) working on this project **MUST** apply the following header to **every file**.

---

### بروميت فهرسة الملفات بالعربية
### File Indexing Prompt (Arabic)

```markdown
# بروميت العميل التنفيذي: فهرسة الملفات

أنت عميل تنفيذي (AI Agent) متخصص في تنظيم وإدارة مشاريع البرمجيات.
مهمتك هي إضافة ترويسة (Header) باللغة العربية إلى أعلى كل ملف في المشروع،
وفق المعايير التالية:

## الترويسة القياسية (يجب إضافتها في بداية كل ملف)

/**
 * ============================================================
 * 📄 الملف: [اسم الملف]
 * 📂 المسار: [المسار الكامل للملف]
 * 🎯 الهدف الرئيسي: [وصف دقيق لما يفعله هذا الملف]
 * 📋 المعايير: [معايير القبول الخاصة بهذا الملف]
 * 🧪 الاختبارات: [الاختبارات المرتبطة بهذا الملف]
 * 🏷️ المعرف: [معرف فريد للملف حسب فهرسة المشروع]
 * 📅 تاريخ الإنشاء: [YYYY-MM-DD]
 * 👤 المالك: [Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved]
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: [المصادر المفتوحة التي استفدت منها]
 * ============================================================
 */

## التعليمات الإلزامية:

1. اقرأ محتوى كل ملف لفهم وظيفته بدقة.
2. اكتب الترويسة بالعربية الفصحى مع محتوى مفيد.
3. حدد المعرف الفريد لكل ملف وفق فهرسة المشروع أعلاه.
4. اذكر المصادر المفتوحة التي استفدت منها بدقة.
5. اكتب اسم المالك (اسمك الكامل) وبيان الترخيص (MIT).
6. إذا كان الملف يحتوي على اختبارات، اذكرها في حقل 🧪 الاختبارات.
7. لا تغير محتوى الملف الأصلي، فقط أضف الترويسة في الأعلى.

## قائمة الملفات المستهدفة (حسب الأولوية):

### المرحلة 0: البنية التحتية (INFRA)
1. /package.json [INFRA-001]
2. /tsconfig.base.json [INFRA-002]
3. /scripts/generate-file.ts [INFRA-003]
4. /scripts/README.md [INFRA-004]
5. packages/core/package.json [INFRA-005]
6. /pnpm-workspace.yaml [INFRA-006]

### المرحلة 1: النواة (CORE)
7. packages/core/src/ast/types.ts [CORE-001]
8. packages/core/src/ast/schema.ts [CORE-002]
9. packages/core/src/ast/builder.ts [CORE-003]
10. packages/core/src/state/editor-state.ts [CORE-004]
11. packages/core/src/state/operations.ts [CORE-005]
12. packages/core/src/state/history.ts [CORE-006]
13. packages/core/src/indexer/indexer.ts [CORE-007]
14. packages/core/src/indexer/search.ts [CORE-008]
15. packages/core/src/utils/id.ts [CORE-009]
16. packages/core/src/utils/validation.ts [CORE-010]
17. packages/core/src/index.ts [CORE-011]
18. packages/core/vite.config.ts [INFRA-012]

### الاختبارات
19. packages/core/tests/ast/types.test.ts [TEST-CORE-001]
20. packages/core/tests/state/editor-state.test.ts [TEST-CORE-002]

### ملفات الإدارة
21. PLAN.md [DOC-ADMIN-01]
22. JOURNAL.md [DOC-ADMIN-02]
23. INDEX.md [DOC-ADMIN-03]
24. LICENSE [LEGAL-001]
25. CONTRIBUTING.md [DOC-GUIDE-01]
```

---

## مثال تطبيقي للترويسة
## Header Application Example

```typescript
/**
 * ============================================================
 * 📄 الملف: editor-state.ts
 * 📂 المسار: packages/core/src/state/editor-state.ts
 * 🎯 الهدف الرئيسي: إدارة حالة المستند في المحرر، وتوفير واجهة
 *    للتعامل مع الكتل (Blocks) والفهرسة (Indexer) بطريقة غير
 *    قابلة للتغيير (Immutable).
 * 📋 المعايير:
 *    - يجب أن تكون الحالة غير قابلة للتغيير (Immutable).
 *    - يجب أن تعمل في بيئة Node.js والمتصفح.
 *    - يجب أن تُعيد حالة جديدة عند كل تطبيق لعملية.
 * 🧪 الاختبارات:
 *    - packages/core/tests/state/editor-state.test.ts
 *    - اختبار إنشاء حالة فارغة
 *    - اختبار تطبيق العمليات
 *    - اختبار الفهرسة التلقائية
 * 🏷️ المعرف: CORE-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - ProseMirror (https://prosemirror.net/) - الإلهام لنظام الحالة.
 *    - Quill.js (https://quilljs.com/) - الإلهام لنظام العمليات.
 * ============================================================
 */
```
