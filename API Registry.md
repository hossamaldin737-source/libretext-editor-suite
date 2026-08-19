/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: API Registry.md
 * 📂 المسار: API Registry.md
 * 🎯 الهدف الرئيسي: سجل شامل لجميع الـ APIs والخوارزميات في المشروع
 *    مع معلماتها والقيم المُعادة وأمثلة الاستخدام.
 * 📋 المعايير:
 *    - يجب تحديث هذا الملف عند إضافة أي API جديد.
 *    - يجب تسجيل: الاسم، المعرف، المعلمات، القيمة المُعادة، أمثلة.
 * 🧪 الاختبارات: لا توجد اختبارات (ملف إداري).
 * 🏷️ المعرف: DOC-ADMIN-07
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    API-First Design + Type-Safe Contracts
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. عدم تسجيل API قبل كتابة اختبارات له.
 *    2. التأكد من وثائق JSDoc كاملة لكل API.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - webpainter-next Algorithms and Math Registry.md - النمط الأساسي.
 * ═══════════════════════════════════════════════════════════════════════════
 */

# سجل الـ APIs والخوارزميات - API Registry
# مشروع LibreText Editor Suite

---

## فهرس APIs العامة
## General API Index

| البادئة Prefix | المجال Domain | الوصف Arabic | Description English |
|----------------|---------------|-------------|---------------------|
| `CORE-API-*` | APIs النواة | create, apply, undo, redo | Core APIs |
| `SER-API-*` | APIs المحولات | serialize, deserialize | Serializer APIs |
| `PLUG-API-*` | APIs الإضافات | register, unregister | Plugin APIs |
| `ADAP-API-*` | APIs طبقات التكيف | useEditor, Provider | Adapter APIs |
| `UTIL-API-*` | APIs الأدوات المساعدة | generateId, validate | Utility APIs |

---

## 1. Core APIs — APIs النواة
## packages/core/src/

### 1.1 Editor State APIs

| المعرف ID | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|-----------|-------------|----------------|------------------------|---------------|
| `CORE-API-001` | `createEditorState` | إنشاء حالة محرر جديدة | `doc?: DocNode, options?: StateOptions` | `EditorState` | لم يبدأ |
| `CORE-API-002` | `applyOperation` | تطبيق عملية على الحالة | `state: EditorState, op: Operation` | `EditorState` | لم يبدأ |
| `CORE-API-003` | `getDocument` | استخراج المستند من الحالة | `state: EditorState` | `DocNode` | لم يبدأ |
| `CORE-API-004` | `getStateSnapshot` | أخذ لقطة للحالة | `state: EditorState` | `StateSnapshot` | لم يبدأ |

### 1.2 History APIs

| المعرف ID | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|-----------|-------------|----------------|------------------------|---------------|
| `CORE-API-005` | `undo` | التراجع عن آخر عملية | `state: EditorState` | `EditorState` | لم يبدأ |
| `CORE-API-006` | `redo` | إعادة العملية المحذوفة | `state: EditorState` | `EditorState` | لم يبدأ |
| `CORE-API-007` | `canUndo` | التحقق من إمكانية التراجع | `state: EditorState` | `boolean` | لم يبدأ |
| `CORE-API-008` | `canRedo` | التحقق من إمكانية الإعادة | `state: EditorState` | `boolean` | لم يبدأ |

### 1.3 Indexer APIs

| المعرف ID | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|-----------|-------------|----------------|------------------------|---------------|
| `CORE-API-009` | `createIndexer` | إنشاء فهرس جديد | `doc: DocNode` | `Indexer` | لم يبدأ |
| `CORE-API-010` | `search` | بحث في المستند | `indexer: Indexer, query: string` | `SearchResult[]` | لم يبدأ |
| `CORE-API-011` | `getNodeById` | البحث عن عقدة بالمعرف | `indexer: Indexer, id: string` | `NodeInfo \| null` | لم يبدأ |
| `CORE-API-012` | `getNodesByType` | البحث عن عقد حسب النوع | `indexer: Indexer, type: string` | `NodeInfo[]` | لم يبدأ |

---

## 2. Serializer APIs — APIs المحولات
## packages/serializers/

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|---------------|-----------|-------------|----------------|------------------------|---------------|
| `SER-API-001` | `serializers-basic` | `MarkdownSerializer.serialize` | تحويل إلى Markdown | `doc: DocNode` | `string` | لم يبدأ |
| `SER-API-002` | `serializers-basic` | `MarkdownSerializer.parse` | تحليل Markdown | `md: string` | `DocNode` | لم يبدأ |
| `SER-API-003` | `serializers-basic` | `HtmlSerializer.serialize` | تحويل إلى HTML | `doc: DocNode, options?: HtmlOptions` | `string` | لم يبدأ |
| `SER-API-004` | `serializers-basic` | `HtmlSerializer.parse` | تحليل HTML | `html: string` | `DocNode` | لم يبدأ |
| `SER-API-005` | `serializers-basic` | `TxtSerializer.serialize` | تحويل إلى نص عادي | `doc: DocNode` | `string` | لم يبدأ |
| `SER-API-006` | `serializers-advanced` | `PdfSerializer.serialize` | تحويل إلى PDF | `doc: DocNode, options?: PdfOptions` | `Uint8Array` | لم يبدأ |
| `SER-API-007` | `serializers-advanced` | `LatexSerializer.serialize` | تحويل إلى LaTeX | `doc: DocNode` | `string` | لم يبدأ |

---

## 3. Plugin APIs — APIs الإضافات
## packages/plugins/

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|---------------|-----------|-------------|----------------|------------------------|---------------|
| `PLUG-API-001` | `plugins` | `createPlugin` | إنشاء إضافة جديدة | `config: PluginConfig` | `Plugin` | لم يبدأ |
| `PLUG-API-002` | `plugins` | `registerPlugin` | تسجيل إضافة | `state: EditorState, plugin: Plugin` | `EditorState` | لم يبدأ |
| `PLUG-API-003` | `plugins` | `unregisterPlugin` | إلغاء تسجيل إضافة | `state: EditorState, pluginId: string` | `EditorState` | لم يبدأ |
| `PLUG-API-004` | `plugins` | `getPlugin` | جلب إضافة بالمعرف | `state: EditorState, pluginId: string` | `Plugin \| null` | لم يبدأ |
| `PLUG-API-005` | `plugins-mermaid` | `MermaidPlugin.render` | رسم مخطط | `code: string` | `string (SVG)` | لم يبدأ |
| `PLUG-API-006` | `plugins-math` | `MathPlugin.render` | رسم معادلة LaTeX | `formula: string` | `string (HTML)` | لم يبدأ |

---

## 4. Adapter APIs — APIs طبقات التكيف
## packages/adapters/

| المعرف ID | الحزمة Package | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|---------------|-----------|-------------|----------------|------------------------|---------------|
| `ADAP-API-001` | `adapters-react` | `useEditor` | React Hook للمحرر | `options: UseEditorOptions` | `EditorInstance` | لم يبدأ |
| `ADAP-API-002` | `adapters-react` | `EditorProvider` | React Provider | `children, options: EditorProviderProps` | `JSX.Element` | لم يبدأ |
| `ADAP-API-003` | `adapters-vue` | `useEditor` | Vue Composable | `options: UseEditorOptions` | `EditorInstance` | لم يبدأ |
| `ADAP-API-004` | `adapters-web-component` | `<libre-text-editor>` | Web Component | `attributes: EditorAttributes` | `HTMLElement` | لم يبدأ |
| `ADAP-API-005` | `adapters-vanilla` | `createEditor` | Vanilla JS API | `element: HTMLElement, options: EditorOptions` | `EditorInstance` | لم يبدأ |

---

## 5. Utility APIs — APIs الأدوات المساعدة
## packages/core/src/utils/

| المعرف ID | الملف File | الاسم Name | الوصف Arabic | المعلمات Params | القيمة المُعادة Returns | الحالة Status |
|-----------|-----------|-----------|-------------|----------------|------------------------|---------------|
| `UTIL-API-001` | `id.ts` | `generateId` | توليد معرف فريد | `prefix?: string` | `string` | لم يبدأ |
| `UTIL-API-002` | `validation.ts` | `validateDocument` | التحقق من صحة المستند | `doc: DocNode` | `ValidationResult` | لم يبدأ |
| `UTIL-API-003` | `validation.ts` | `validateNode` | التحقق من صحة عقدة | `node: BlockNode` | `ValidationResult` | لم يبدأ |
| `UTIL-API-004` | `validation.ts` | `sanitizeHtml` | تنقية HTML | `html: string, options?: SanitizeOptions` | `string` | لم يبدأ |

---

## 6. الخوارزميات والتحويلات
## Algorithms & Transformations

| المعرف ID | الاسم Name | الوصف Arabic | المدخلات Input | المخرجات Output | الحالة Status |
|-----------|-----------|-------------|---------------|----------------|---------------|
| `ALGO-001` | AST Diff Algorithm | خوارزمية فروقات AST | `oldDoc: DocNode, newDoc: DocNode` | `Operation[]` | لم يبدأ |
| `ALGO-002` | Node Traversal | اجتياز العقد | `doc: DocNode, visitor: VisitorFn` | `void` | لم يبدأ |
| `ALGO-003` | Text Search (BM) | بحث نصي (Boyer-Moore) | `text: string, pattern: string` | `number[]` | لم ي早晚 |
| `ALGO-004` | Markdown Parsing | تحليل Markdown | `md: string` | `DocNode` | لم يبدأ |
| `ALGO-005` | HTML Sanitization | تنقية HTML | `html: string` | `string` | لم يبدأ |

---

## إحصائيات التسجيل
## Registration Statistics

| الفئة Category | العدد Count | مكتمل Completed | قيد العمل In Progress | لم يبدأ Not Started |
|----------------|-------------|-----------------|----------------------|---------------------|
| Core APIs | 12 | 0 | 0 | 12 |
| Serializer APIs | 7 | 0 | 0 | 7 |
| Plugin APIs | 6 | 0 | 0 | 6 |
| Adapter APIs | 5 | 0 | 0 | 5 |
| Utility APIs | 4 | 0 | 0 | 4 |
| Algorithms | 5 | 0 | 0 | 5 |
| **المجموع Total** | **39** | **0** | **0** | **39** |
