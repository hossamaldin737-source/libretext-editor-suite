/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: Components Registry.md
 * 📂 المسار: Components Registry.md
 * 🎯 الهدف الرئيسي: سجل شامل لجميع مكونات المشروع (AST Nodes,
 *    Serializers, Adapters, Plugins, Core Types) مع مساراتها ومعرفاتها
 *    وخصائصها واعتمادياتها.
 * 📋 المعايير:
 *    - يجب تحديث هذا الملف عند إضافة أي مكون جديد.
 *    - يجب تسجيل: الاسم، المسار، المعرف، الوصف، الخصائص، الاعتماديات.
 *    - يجب أن يتوافق مع شجرة الملفات في INDEX.md.
 * 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
 * 🏷️ المعرف: DOC-ADMIN-06
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Zero-Dependency Component Registry + ID-based Tracking
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تسجيل مكون قبل كتابة الاختبارات له.
 *    2. التأكد من عدم تداخل المعرفات (Unique IDs).
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - webpainter-next Components and Properties.md - النمط الأساسي.
 * ═══════════════════════════════════════════════════════════════════════════
 */

# سجل المكونات - Components Registry
# مشروع LibreText Editor Suite

---

## فهرس المكونات العامة
## General Components Index

| البادئة Prefix | المجال Domain | الوصف Arabic | Description English |
|----------------|---------------|-------------|---------------------|
| `AST-*` | أنواع AST | أنواع الكتل والعقد | Block & Node types |
| `STATE-*` | الحالة | حالة المحرر والعمليات | State & Operations |
| `SER-*` | المحولات | محولات التحويل | Serializers |
| `ADAP-*` | طبقات التكيف | React, Vue, WC, Vanilla | Adapters |
| `PLUG-*` | الإضافات | إضافات رسمية | Official Plugins |
| `UTIL-*` | الأدوات المساعدة | ID, Validation, Search | Utilities |

---

## 1. أنواع AST — AST Node Types
## [CORE-001..003] packages/core/src/ast/

### 1.1 أنواع الكتل الأساسية — Base Block Types

| المعرف ID | الاسم Name | الوصف Arabic | Description English | الخصائص Required Props | الحالة Status |
|-----------|-----------|-------------|---------------------|------------------------|---------------|
| `AST-BLOCK-001` | `ParagraphNode` | فقرة نصية | Text paragraph | `id: string`, `content: InlineNode[]` | لم يبدأ |
| `AST-BLOCK-002` | `HeadingNode` | عنوان | Heading | `id: string`, `level: 1-6`, `content: InlineNode[]` | لم يبدأ |
| `AST-BLOCK-003` | `ListNode` | قائمة | List | `id: string`, `ordered: boolean`, `items: ListItemNode[]` | لم يبدأ |
| `AST-BLOCK-004` | `ListItemNode` | عنصر قائمة | List item | `id: string`, `content: BlockNode[]`, `nested?: BlockNode[]` | لم يبدأ |
| `AST-BLOCK-005` | `CodeBlockNode` | كتلة كود | Code block | `id: string`, `language: string`, `code: string` | لم يبدأ |
| `AST-BLOCK-006` | `BlockquoteNode` | اقتباس | Blockquote | `id: string`, `content: BlockNode[]` | لم يبدأ |
| `AST-BLOCK-007` | `TableNode` | جدول | Table | `id: string`, `rows: TableRowNode[]` | لم يبدأ |
| `AST-BLOCK-008` | `TableRowNode` | صف جدول | Table row | `id: string`, `cells: TableCellNode[]` | لم يبدأ |
| `AST-BLOCK-009` | `TableCellNode` | خلية جدول | Table cell | `id: string`, `content: BlockNode[]`, `colspan?: number`, `rowspan?: number` | لم يبدأ |
| `AST-BLOCK-010` | `HorizontalRuleNode` | خط أفقي | Horizontal rule | `id: string` | لم يبدأ |
| `AST-BLOCK-011` | `ImageNode` | صورة | Image | `id: string`, `src: string`, `alt: string`, `width?: number`, `height?: number` | لم يبدأ |
| `AST-BLOCK-012` | `EmbedNode` | تضمين | Embedded content | `id: string`, `type: string`, `url: string` | لم يبدأ |

### 1.2 أنواع العناصر المضمنة — Inline Node Types

| المعرف ID | الاسم Name | الوصف Arabic | Description English | الخصائص Required Props | الحالة Status |
|-----------|-----------|-------------|---------------------|------------------------|---------------|
| `AST-INLINE-001` | `TextNode` | نص | Text | `text: string`, `marks?: Mark[]` | لم يبدأ |
| `AST-INLINE-002` | `BoldNode` | غامق | Bold | `content: InlineNode[]` | لم يبدأ |
| `AST-INLINE-003` | `ItalicNode` | مائل | Italic | `content: InlineNode[]` | لم يبدأ |
| `AST-INLINE-004` | `UnderlinedNode` | تحته خط | Underline | `content: InlineNode[]` | لم يبدأ |
| `AST-INLINE-005` | `StrikethroughNode` | يتوسطه خط | Strikethrough | `content: InlineNode[]` | لم يبدأ |
| `AST-INLINE-006` | `CodeNode` | كود مضمن | Inline code | `code: string` | لم يبدأ |
| `AST-INLINE-007` | `LinkNode` | رابط | Link | `href: string`, `content: InlineNode[]` | لم يبدأ |
| `AST-INLINE-008` | `MentionNode` | إشارة | Mention | `userId: string`, `label: string` | لم يبدأ |

### 1.3 أنماط العرض — Mark Types

| المعرف ID | الاسم Name | الوصف Arabic | Description English | الخصائص Properties | الحالة Status |
|-----------|-----------|-------------|---------------------|-------------------|---------------|
| `AST-MARK-001` | `BoldMark` | غامق | Bold | `type: 'bold'` | لم يبدأ |
| `AST-MARK-002` | `ItalicMark` | مائل | Italic | `type: 'italic'` | لم يبدأ |
| `AST-MARK-003` | `UnderlineMark` | تحته خط | Underline | `type: 'underline'` | لم يبدأ |
| `AST-MARK-004` | `StrikethroughMark` | يتوسطه خط | Strikethrough | `type: 'strikethrough'` | لم يبدأ |
| `AST-MARK-005` | `CodeMark` | كود | Code | `type: 'code'` | لم يبدأ |
| `AST-MARK-006` | `LinkMark` | رابط | Link | `type: 'link'`, `href: string` | لم يبدأ |

---

## 2. المحولات — Serializers
## [SER-001..005] packages/serializers/

### 2.1 المحولات الأساسية — Basic Serializers

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | Description English | الـ API الأساسي | الحالة Status |
|-----------|---------------|-----------|-------------|---------------------|----------------|---------------|
| `SER-001` | `@libretext/serializers-basic` | `MarkdownSerializer` | محول Markdown | Markdown serializer | `serialize(doc) → string`, `parse(md) → DocNode` | لم يبدأ |
| `SER-002` | `@libretext/serializers-basic` | `HtmlSerializer` | محول HTML | HTML serializer | `serialize(doc) → string`, `parse(html) → DocNode` | لم يبدأ |
| `SER-003` | `@libretext/serializers-basic` | `TxtSerializer` | محول TXT | Plain text serializer | `serialize(doc) → string` | لم يبدأ |

### 2.2 المحولات المتقدمة — Advanced Serializers

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | Description English | الـ API الأساسي | الحالة Status |
|-----------|---------------|-----------|-------------|---------------------|----------------|---------------|
| `SER-004` | `@libretext/serializers-advanced` | `PdfSerializer` | محول PDF | PDF serializer (jsPDF) | `serialize(doc) → Uint8Array` | لم يبدأ |
| `SER-005` | `@libretext/serializers-advanced` | `LatexSerializer` | محول LaTeX | LaTeX serializer | `serialize(doc) → string` | لم يبدأ |

---

## 3. طبقات التكيف — Adapters
## [ADAP-001..004] packages/adapters/

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | Description English | الـ API الرئيسي | الحالة Status |
|-----------|---------------|-----------|-------------|---------------------|----------------|---------------|
| `ADAP-001` | `@libretext/adapters` | React Adapter | طبقة React | React adapter | `useEditor()`, `EditorProvider` | لم يبدأ |
| `ADAP-002` | `@libretext/adapters` | Vue Adapter | طبقة Vue | Vue adapter | `useEditor()`, `EditorProvider` | لم يبدأ |
| `ADAP-003` | `@libretext/adapters` | Web Component | مكون ويب | Web Component adapter | `<libre-text-editor>` | لم يبدأ |
| `ADAP-004` | `@libretext/adapters` | Vanilla JS | عادي | Vanilla JS adapter | `createEditor(element)` | لم يبدأ |

---

## 4. الإضافات الرسمية — Official Plugins
## [PLUG-001..002] packages/plugins/

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | Description English | الـ API الرئيسي | الحالة Status |
|-----------|---------------|-----------|-------------|---------------------|----------------|---------------|
| `PLUG-001` | `@libretext/plugins` | Mermaid Plugin | رسوم بيانية | Diagram plugin (Mermaid.js) | `register()`, `render(diagram)` | لم يبدأ |
| `PLUG-002` | `@libretext/plugins` | Math Plugin | معادلات LaTeX | Math/LaTeX plugin (KaTeX) | `register()`, `render(formula)` | لم يبدأ |

---

## 5. النواة — Core
## [CORE-001..011] packages/core/src/

### 5.1 أنواع الحالة والعمليات — State & Operations

| المعرف ID | الملف File | الاسم Name | الوصف Arabic | Description English | الحالة Status |
|-----------|-----------|-----------|-------------|---------------------|---------------|
| `CORE-004` | `state/editor-state.ts` | `EditorState` | حالة المحرر | Editor state (Immutable) | لم يبدأ |
| `CORE-005` | `state/operations.ts` | `Operation` | عمليات التحرير | Edit operations (Insert, Delete, Update, Move) | لم يبدأ |
| `CORE-006` | `state/history.ts` | `History` | التراجع والإعادة | Undo/Redo history (Stack-based) | لم يبدأ |

### 5.2 نظام الفهرسة — Indexing System

| المعرف ID | الملف File | الاسم Name | الوصف Arabic | Description English | الحالة Status |
|-----------|-----------|-----------|-------------|---------------------|---------------|
| `CORE-007` | `indexer/indexer.ts` | `Indexer` | الفهرسة | Document indexer | لم يبدأ |
| `CORE-008` | `indexer/search.ts` | `Search` | واجهة البحث | Search interface | لم يبدأ |

### 5.3 الأدوات المساعدة — Utilities

| المعرف ID | الملف File | الاسم Name | الوصف Arabic | Description English | الحالة Status |
|-----------|-----------|-----------|-------------|---------------------|---------------|
| `CORE-009` | `utils/id.ts` | `generateId` | توليد المعرفات | Unique ID generator (nanoid) | لم يبدأ |
| `CORE-010` | `utils/validation.ts` | `validate` | التحقق من الصحة | AST validation utilities | لم يبدأ |
| `CORE-011` | `index.ts` | `exports` | التصدير العام | Public API exports | لم يبدأ |

---

## 6. الملعب التجريبي — Playground
## [PLAY-001..003] packages/playground/

| المعرف ID | الملف File | الاسم Name | الوصف Arabic | Description English | الحالة Status |
|-----------|-----------|-----------|-------------|---------------------|---------------|
| `PLAY-001` | `index.html` | `index.html` | الصفحة الرئيسية | Main HTML page | لم يبدأ |
| `PLAY-002` | `main.ts` | `main.ts` | نقطة الدخول | Entry point | لم يبدأ |
| `PLAY-003` | `examples.ts` | `examples.ts` | أمثلة تفاعلية | Interactive examples | لم يبدأ |

---

## إحصائيات التسجيل
## Registration Statistics

| الفئة Category | العدد Count | مكتمل Completed | قيد العمل In Progress | لم يبدأ Not Started |
|----------------|-------------|-----------------|----------------------|---------------------|
| AST Nodes | 20 | 0 | 0 | 20 |
| Serializers | 5 | 0 | 0 | 5 |
| Adapters | 4 | 0 | 0 | 4 |
| Plugins | 2 | 0 | 0 | 2 |
| Core | 8 | 0 | 0 | 8 |
| Playground | 3 | 0 | 0 | 3 |
| **المجموع Total** | **42** | **0** | **0** | **42** |
