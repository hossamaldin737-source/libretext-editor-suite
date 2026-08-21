/**

- ═══════════════════════════════════════════════════════════════════════════
- 📌 ملخص توجيهي | Guiding Summary
- ═══════════════════════════════════════════════════════════════════════════
- 📄 الملف: Components Registry.md
- 📂 المسار: Components Registry.md
- 🎯 الهدف الرئيسي: سجل شامل لجميع مكونات المشروع (AST Nodes,
- Serializers, Adapters, Plugins, Algorithms, Storage, Templates)
- مع مساراتها ومعرفاتها وخصائصها وopardياتها.
- 📋 المعايير:
- - يجب تحديث هذا الملف عند إضافة أي مكون جديد.
- - يجب تسجيل: الاسم، المسار، المعرف، الوصف، الخصائص، الopardيات.
- - يجب أن يتوافق مع شجرة الملفات في INDEX.md.
- 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
- 🏷️ المعرف: DOC-ADMIN-06
- 📅 تاريخ الإنشاء: 2026-08-19
- 🧠 الطريقة المبتكرة | Innovative Pattern:
- Zero-Dependency Component Registry + ID-based Tracking
- ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
- 1. عدم تسجيل مكون قبل كتابة الاختبارات له.
- 2. التأكد من عدم تداخل المعرفات (Unique IDs).
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة:
- - webpainter-next Components and Properties.md - النمط الأساسي.
- ═══════════════════════════════════════════════════════════════════════════
  */

# سجل المكونات - Components Registry

# مشروع LibreText Editor Suite

---

## فهرس المكونات العامة

## General Components Index

| البادئة Prefix | المجال Domain    | الوصف Arabic                                   | Description English                 |
| -------------- | ---------------- | ---------------------------------------------- | ----------------------------------- |
| `AST-*`        | أنواع AST        | أنواع الكتل والعقد                             | Block & Node types                  |
| `STATE-*`      | الحالة           | حالة المحرر والعمليات                          | State & Operations                  |
| `ALGO-*`       | الخوارزميات      | Command Pattern، Expression Evaluator، Spatial | Algorithms, Formulas, Spatial       |
| `STORE-*`      | التخزين          | In-Memory، localStorage، IndexedDB             | Memory, localStorage, IndexedDB     |
| `TPL-*`        | القوالب          | Template Registry، قوالب النطاقات              | Template Registry, Domain Templates |
| `SER-*`        | المحولات         | محولات التحويل                                 | Serializers                         |
| `ADAP-*`       | طبقات التكيف     | React, Vue, WC, Vanilla                        | Adapters                            |
| `PLUG-*`       | الإضافات         | إضافات رسمية                                   | Official Plugins                    |
| `UTIL-*`       | الأدوات المساعدة | ID, Validation, Search                         | Utilities                           |

---

## 1. أنواع AST — AST Node Types

## [CORE-001..003] packages/core/src/ast/

### 1.1 أنواع الكتل الأساسية — Base Block Types

| المعرف ID       | الاسم Name           | الوصف Arabic | Description English | الخصائص Required Props                                                          | الحالة Status |
| --------------- | -------------------- | ------------ | ------------------- | ------------------------------------------------------------------------------- | ------------- |
| `AST-BLOCK-001` | `ParagraphNode`      | فقرة نصية    | Text paragraph      | `id: string`, `content: InlineNode[]`                                           | تم            |
| `AST-BLOCK-002` | `HeadingNode`        | عنوان        | Heading             | `id: string`, `level: 1-6`, `content: InlineNode[]`                             | تم            |
| `AST-BLOCK-003` | `ListNode`           | قائمة        | List                | `id: string`, `ordered: boolean`, `items: ListItemNode[]`                       | تم            |
| `AST-BLOCK-004` | `ListItemNode`       | عنصر قائمة   | List item           | `id: string`, `content: BlockNode[]`, `nested?: BlockNode[]`                    | تم            |
| `AST-BLOCK-005` | `CodeBlockNode`      | كتلة كود     | Code block          | `id: string`, `language: string`, `code: string`                                | تم            |
| `AST-BLOCK-006` | `BlockquoteNode`     | اقتباس       | Blockquote          | `id: string`, `content: BlockNode[]`                                            | تم            |
| `AST-BLOCK-007` | `TableNode`          | جدول         | Table               | `id: string`, `rows: TableRowNode[]`                                            | تم            |
| `AST-BLOCK-008` | `TableRowNode`       | صف جدول      | Table row           | `id: string`, `cells: TableCellNode[]`                                          | تم            |
| `AST-BLOCK-009` | `TableCellNode`      | خلية جدول    | Table cell          | `id: string`, `content: BlockNode[]`, `colspan?: number`, `rowspan?: number`    | تم            |
| `AST-BLOCK-010` | `HorizontalRuleNode` | خط أفقي      | Horizontal rule     | `id: string`                                                                    | تم            |
| `AST-BLOCK-011` | `ImageNode`          | صورة         | Image               | `id: string`, `src: string`, `alt: string`, `width?: number`, `height?: number` | تم            |
| `AST-BLOCK-012` | `EmbedNode`          | تضمين        | Embedded content    | `id: string`, `type: string`, `url: string`                                     | تم            |

### 1.2 أنواع العناصر المضمنة — Inline Node Types

| المعرف ID        | الاسم Name          | الوصف Arabic | Description English | الخصائص Required Props                  | الحالة Status |
| ---------------- | ------------------- | ------------ | ------------------- | --------------------------------------- | ------------- |
| `AST-INLINE-001` | `TextNode`          | نص           | Text                | `text: string`, `marks?: Mark[]`        | تم            |
| `AST-INLINE-002` | `BoldNode`          | غامق         | Bold                | `content: InlineNode[]`                 | تم            |
| `AST-INLINE-003` | `ItalicNode`        | مائل         | Italic              | `content: InlineNode[]`                 | تم            |
| `AST-INLINE-004` | `UnderlinedNode`    | تحته خط      | Underline           | `content: InlineNode[]`                 | تم            |
| `AST-INLINE-005` | `StrikethroughNode` | يتوسطه خط    | Strikethrough       | `content: InlineNode[]`                 | تم            |
| `AST-INLINE-006` | `CodeNode`          | كود مضمن     | Inline code         | `code: string`                          | تم            |
| `AST-INLINE-007` | `LinkNode`          | رابط         | Link                | `href: string`, `content: InlineNode[]` | تم            |
| `AST-INLINE-008` | `MentionNode`       | إشارة        | Mention             | `userId: string`, `label: string`       | تم            |

---

## 2. طبقة المنطق والخوارزميات — Algorithms Layer

## [ALGO-001..010] packages/algorithms/src/

### 2.1 Command Pattern — نمط الأوامر

| المعرف ID  | الملف File            | الاسم Name        | الوصف Arabic | Description English | الخصائص Properties          | الحالة Status |
| ---------- | --------------------- | ----------------- | ------------ | ------------------- | --------------------------- | ------------- |
| `ALGO-001` | `command/types.ts`    | `SpatialCommand`  | أمر مكاني    | Spatial command     | `type, targetId, payload`   | لم يبدأ       |
| `ALGO-002` | `command/executor.ts` | `CommandExecutor` | منفذ الأوامر | Command executor    | `execute(cmd)`, `undo(cmd)` | لم يبدأ       |
| `ALGO-003` | `command/registry.ts` | `CommandRegistry` | سجل الأوامر  | Command registry    | `register(name, handler)`   | لم يبدأ       |

### 2.2 Expression Evaluator — محلل التعابير

| المعرف ID  | الملف File             | الاسم Name         | الوصف Arabic    | Description English      | الخصائص Properties            | الحالة Status |
| ---------- | ---------------------- | ------------------ | --------------- | ------------------------ | ----------------------------- | ------------- |
| `ALGO-004` | `formula/parser.ts`    | `FormulaParser`    | محلل تنازلي     | Recursive descent parser | `parse(expr) → AST`           | لم يبدأ       |
| `ALGO-005` | `formula/evaluator.ts` | `FormulaEvaluator` | مُقيّم التعابير | Expression evaluator     | `evaluate(ast, ctx) → number` | لم يبدأ       |
| `ALGO-006` | `formula/functions.ts` | Built-in Functions | دوال مدمجة      | SUM, AVERAGE, IF, etc.   | `SUM()`, `AVERAGE()`, `IF()`  | لم يبدأ       |

### 2.3 Spatial Translation — الترجمة المكانية

| المعرف ID  | الملف File            | الاسم Name          | الوصف Arabic      | Description English             | الخصائص Properties                   | الحالة Status |
| ---------- | --------------------- | ------------------- | ----------------- | ------------------------------- | ------------------------------------ | ------------- |
| `ALGO-007` | `spatial/types.ts`    | `LogicalCoordinate` | إحداثيات ديكارتية | Cartesian coordinates           | `x: number, y: number`               | لم يبدأ       |
| `ALGO-007` | `spatial/types.ts`    | `GridCoordinate`    | إحداثيات شبكية    | Grid coordinates                | `row: number, col: number`           | لم يبدأ       |
| `ALGO-008` | `spatial/mapper.ts`   | `SpatialMapper`     | المترجم المكاني   | Spatial mapper                  | `translate(raw) → logical`           | لم يبدأ       |
| `ALGO-009` | `spatial/commands.ts` | Spatial Commands    | أوامر مكانية      | Spatial command implementations | `create`, `move`, `resize`, `select` | لم يبدأ       |

---

## 3. طبقة التخزين — Storage Layer

## [STORE-001..005] packages/storage/src/

| المعرف ID   | الملف File        | الاسم Name          | الوصف Arabic         | Description English  | الخصائص Properties                          | الحالة Status |
| ----------- | ----------------- | ------------------- | -------------------- | -------------------- | ------------------------------------------- | ------------- |
| `STORE-001` | `memory.ts`       | `MemoryStore`       | In-Memory Store      | In-memory store      | `get()`, `set()`, `delete()`, `list()`      | لم يبدأ       |
| `STORE-002` | `localStorage.ts` | `LocalStorageStore` | localStorage Adapter | localStorage adapter | `save()`, `load()`, `remove()`              | لم يبدأ       |
| `STORE-003` | `indexeddb.ts`    | `IndexedDBStore`    | IndexedDB Adapter    | IndexedDB adapter    | `open()`, `put()`, `get()`, `delete()`      | لم يبدأ       |
| `STORE-004` | `snapshots.ts`    | `SnapshotManager`   | Undo/Redo Snapshots  | Undo/redo snapshots  | `push()`, `pop()`, `canUndo()`, `canRedo()` | لم يبدأ       |

---

## 4. نظام القوالب — Template System

## [TPL-001..006] packages/templates/src/

| المعرف ID | الملف File    | الاسم Name         | الوصف Arabic      | Description English | الخصائص Properties                         | الحالة Status |
| --------- | ------------- | ------------------ | ----------------- | ------------------- | ------------------------------------------ | ------------- |
| `TPL-001` | `registry.ts` | `TemplateRegistry` | Template Registry | Template registry   | `register()`, `get()`, `list()`, `apply()` | لم يبدأ       |
| `TPL-002` | `writer/`     | Writer Templates   | قوالب Writer      | Writer templates    | `letter`, `report`, `essay`                | لم يبدأ       |
| `TPL-003` | `calc/`       | Calc Templates     | قوالب Calc        | Calc templates      | `budget`, `tracker`, `statistics`          | لم يبدأ       |
| `TPL-004` | `impress/`    | Impress Templates  | قوالب Impress     | Impress templates   | `presentation`, `slide`                    | لم يبدأ       |
| `TPL-005` | `base/`       | Base Templates     | قوالب Base        | Base templates      | `record`, `index`, `query`                 | لم يبدأ       |

---

## 5. المحولات — Serializers

## [SER-001..005] packages/serializers/

### 5.1 المحولات الأساسية — Basic Serializers

| المعرف ID | الحزمة Package                 | الاسم Name           | الوصف Arabic  | Description English   | الـ API الأساسي           | الحالة Status |
| --------- | ------------------------------ | -------------------- | ------------- | --------------------- | ------------------------- | ------------- |
| `SER-001` | `@libretext/serializers-basic` | `MarkdownSerializer` | محول Markdown | Markdown serializer   | `serialize(doc) → string` | تم            |
| `SER-002` | `@libretext/serializers-basic` | `HtmlSerializer`     | محول HTML     | HTML serializer       | `serialize(doc) → string` | تم            |
| `SER-003` | `@libretext/serializers-basic` | `TxtSerializer`      | محول TXT      | Plain text serializer | `serialize(doc) → string` | تم            |

### 5.2 المحولات المتقدمة — Advanced Serializers

| المعرف ID | الحزمة Package                    | الاسم Name        | الوصف Arabic | Description English    | الـ API الأساسي               | الحالة Status |
| --------- | --------------------------------- | ----------------- | ------------ | ---------------------- | ----------------------------- | ------------- |
| `SER-004` | `@libretext/serializers-advanced` | `PdfSerializer`   | محول PDF     | PDF serializer (jsPDF) | `serialize(doc) → Uint8Array` | تم            |
| `SER-005` | `@libretext/serializers-advanced` | `LatexSerializer` | محول LaTeX   | LaTeX serializer       | `serialize(doc) → string`     | تم            |

---

## 6. طبقات التكيف — Adapters

## [ADAP-001..004] packages/adapters/

| المعرف ID  | الحزمة Package        | الاسم Name    | الوصف Arabic | Description English   | الـ API الرئيسي                 | الحالة Status |
| ---------- | --------------------- | ------------- | ------------ | --------------------- | ------------------------------- | ------------- |
| `ADAP-001` | `@libretext/adapters` | React Adapter | طبقة React   | React adapter         | `useEditor()`, `EditorProvider` | تم            |
| `ADAP-002` | `@libretext/adapters` | Vue Adapter   | طبقة Vue     | Vue adapter           | `useEditor()`, `EditorProvider` | تم            |
| `ADAP-003` | `@libretext/adapters` | Web Component | مكون ويب     | Web Component adapter | `<libre-text-editor>`           | تم            |
| `ADAP-004` | `@libretext/adapters` | Vanilla JS    | عادي         | Vanilla JS adapter    | `createEditor(element)`         | تم            |

---

## 7. الإضافات الرسمية — Official Plugins

## [PLUG-001..002] packages/plugins/

| المعرف ID  | الحزمة Package       | الاسم Name     | الوصف Arabic  | Description English         | الـ API الرئيسي                 | الحالة Status |
| ---------- | -------------------- | -------------- | ------------- | --------------------------- | ------------------------------- | ------------- |
| `PLUG-001` | `@libretext/plugins` | Mermaid Plugin | رسوم بيانية   | Diagram plugin (Mermaid.js) | `register()`, `render(diagram)` | تم            |
| `PLUG-002` | `@libretext/plugins` | Math Plugin    | معادلات LaTeX | Math/LaTeX plugin (KaTeX)   | `register()`, `render(formula)` | تم            |

---

## إحصائيات التسجيل

## Registration Statistics

| الفئة Category    | العدد Count | مكتمل Completed | قيد العمل In Progress | لم يبدأ Not Started |
| ----------------- | ----------- | --------------- | --------------------- | ------------------- |
| AST Nodes         | 20          | 20              | 0                     | 0                   |
| Algorithms        | 10          | 0               | 0                     | 10                  |
| Storage           | 5           | 0               | 0                     | 5                   |
| Templates         | 6           | 0               | 0                     | 6                   |
| Serializers       | 5           | 5               | 0                     | 0                   |
| Adapters          | 4           | 4               | 0                     | 0                   |
| Plugins           | 2           | 2               | 0                     | 0                   |
| Core              | 8           | 8               | 0                     | 0                   |
| **المجموع Total** | **60**      | **39**          | **0**                 | **21**              |
