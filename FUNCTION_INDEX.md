/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: FUNCTION_INDEX.md
 * 📂 المسار: FUNCTION_INDEX.md
 * 🎯 الهدف الرئيسي: فهرس شامل ومُحدَّث لكل الدوال والخوارزميات والأنواع
 *    والثوابت في المشروع — يُحدَّث تلقائياً عند كل تعديل.
 * 📋 المعايير: تحديث فوري عند إضافة/حذف أي عنصر، تبعيات مرجحة
 * 🧪 الاختبارات: لا توجد اختبارات (ملف توثيق)
 * 🏷️ المعرف: DOC-ADMIN-09
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Living Index — فهرس حي يُحدَّث تلقائياً مع كل تعديل على الكود
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. يجب تحديث هذا الملف عند كل تعديل على أي دالة
 *    2. يجب الحفاظ على تنسيق الأرقام التسلسلية #N/M
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - لا يُسمح بحذف أي عنصر من الفهرس دون تحديث الأرقام
 *    - يجب التحقق من صحة الروابط الداخلية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 فهرس المكونات: Components Registry.md
 *    - 📇 فهرس APIs: API Registry.md
 *    - 📇 فهرس النظام: SystemInventory.json
 *    - 📄 التوثيق: INDEX.md
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الإحصائيات | Statistics:
 *    - إجمالي الدوال: [يُحدَّث تلقائياً]
 *    - إجمالي الخوارزميات: [يُحدَّث تلقائياً]
 *    - إجمالي الأنواع: [يُحدَّث تلقائياً]
 *    - آخر تحديث: [YYYY-MM-DD]
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد
 * ═══════════════════════════════════════════════════════════════════════════
 */

# 📇 فهرس الدوال والخوارزميات الشامل
# Comprehensive Function & Algorithm Index

> **تاريخ آخر تحديث:** 2026-08-19
> **عدد الحزم:** 7 حزم
> **إجمالي العناصر المفهرسة:** [يُحدَّث تلقائياً]

---

## 📦 packages/core — النواة المجردة

### 📁 ast/ — تعريفات AST

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/8 | CORE-001 | `NodeId` | Type | `types.ts:37` | المعرف الفريد للعقد (Branded String) | — | `string & {__brand: 'NodeId'}` | لا شيء |
| 2/8 | CORE-001 | `LogicalPosition` | Interface | `types.ts:42` | الموقع المكاني (لـ Impress) | `x: number, y: number, unit?: string` | `LogicalPosition` | لا شيء |
| 3/8 | CORE-001 | `InlineNode` | Type | `types.ts:135` | اتحاد العناصر المضمنة | — | `TextNode | BoldNode | ...` | لا شيء |
| 4/8 | CORE-001 | `BlockNode` | Type | `types.ts:243` | اتحاد الكتل | — | `ParagraphNode | HeadingNode | ...` | لا شيء |
| 5/8 | CORE-001 | `DocNode` | Interface | `types.ts:258` | المستند الجذري | `type, id, content` | `DocNode` | `NodeId, BlockNode` |
| 6/8 | CORE-001 | `SearchResult` | Interface | `types.ts:265` | نتيجة البحث | `nodeId, text, startIndex, endIndex, path` | `SearchResult` | `NodeId` |
| 7/8 | CORE-001 | `ValidationResult` | Interface | `types.ts:282` | نتيجة التحقق | `valid, errors` | `ValidationResult` | `ValidationError` |
| 8/8 | CORE-001 | `ValidationError` | Interface | `types.ts:287` | خطأ التحقق | `nodeId, message, severity` | `ValidationError` | `NodeId` |

### 📁 ast/ — بناء AST

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/16 | CORE-003 | `text()` | Function | `builder.ts:63` | بناء عقدة نصية | `content: string, marks?: Mark[]` | `TextNode` | `generateId` |
| 2/16 | CORE-003 | `bold()` | Function | `builder.ts:72` | بناء عقدة غامقة | `content: InlineNode[]` | `BoldNode` | `generateId` |
| 3/16 | CORE-003 | `italic()` | Function | `builder.ts:76` | بناء عقدة مائلة | `content: InlineNode[]` | `ItalicNode` | `generateId` |
| 4/16 | CORE-003 | `underline()` | Function | `builder.ts:80` | بناء عقدة تحتها خط | `content: InlineNode[]` | `UnderlineNode` | `generateId` |
| 5/16 | CORE-003 | `strikethrough()` | Function | `builder.ts:84` | بناء عقدة مشطوبة | `content: InlineNode[]` | `StrikethroughNode` | `generateId` |
| 6/16 | CORE-003 | `codeInline()` | Function | `builder.ts:88` | بناء عقدة كود مضمن | `code: string` | `CodeNode` | `generateId` |
| 7/16 | CORE-003 | `link()` | Function | `builder.ts:92` | بناء عقدة رابط | `href: string, content: InlineNode[]` | `LinkNode` | `generateId` |
| 8/16 | CORE-003 | `mention()` | Function | `builder.ts:96` | بناء عقدة إشارة | `userId: string, label: string` | `MentionNode` | `generateId` |
| 9/16 | CORE-003 | `paragraph()` | Function | `builder.ts:102` | بناء فقرة | `content: InlineNode[]` | `ParagraphNode` | `generateId` |
| 10/16 | CORE-003 | `heading()` | Function | `builder.ts:106` | بناء عنوان | `level: 1-6, content: InlineNode[]` | `HeadingNode` | `generateId` |
| 11/16 | CORE-003 | `codeBlock()` | Function | `builder.ts:110` | بناء كتلة كود | `language: string, code: string` | `CodeBlockNode` | `generateId` |
| 12/16 | CORE-003 | `blockquote()` | Function | `builder.ts:114` | بناء اقتباس | `content: BlockNode[]` | `BlockquoteNode` | `generateId` |
| 13/16 | CORE-003 | `horizontalRule()` | Function | `builder.ts:118` | بناء خط أفقي | — | `HorizontalRuleNode` | `generateId` |
| 14/16 | CORE-003 | `image()` | Function | `builder.ts:122` | بناء صورة | `src, alt, width?, height?` | `ImageNode` | `generateId` |
| 15/16 | CORE-003 | `embed()` | Function | `builder.ts:126` | بناء تضمين | `embedType: string, url: string` | `EmbedNode` | `generateId` |
| 16/16 | CORE-003 | `doc()` | Function | `builder.ts:160` | بناء مستند | `content: BlockNode[]` | `DocNode` | `generateId` |

### 📁 state/ — الحالة والعمليات

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/10 | CORE-004 | `createEditorState()` | Function | `editor-state.ts:87` | إنشاء حالة محرر جديدة | `doc?: DocNode` | `FullEditorState` | `generateId, DocNode` |
| 2/10 | CORE-004 | `canUndo()` | Function | `editor-state.ts:106` | التحقق من إمكانية التراجع | `state: FullEditorState` | `boolean` | `FullEditorState` |
| 3/10 | CORE-004 | `canRedo()` | Function | `editor-state.ts:113` | التحقق من إمكانية الإعادة | `state: FullEditorState` | `boolean` | `FullEditorState` |
| 4/10 | CORE-004 | `getDocument()` | Function | `editor-state.ts:120` | استخراج المستند الحالي | `state: FullEditorState` | `DocNode` | `FullEditorState` |
| 5/10 | CORE-004 | `apply()` | Function | `editor-state.ts:128` | تطبيق عملية على الحالة | `state: FullEditorState, operation: Operation` | `FullEditorState` | `applyOperation` |
| 6/10 | CORE-004 | `undo()` | Function | `editor-state.ts:158` | التراجع | `state: FullEditorState` | `FullEditorState` | `FullEditorState` |
| 7/10 | CORE-004 | `redo()` | Function | `editor-state.ts:186` | الإعادة | `state: FullEditorState` | `FullEditorState` | `FullEditorState` |
| 8/10 | CORE-005 | `applyOperation()` | Function | `operations.ts:140` | تطبيق عملية على المستند | `doc: DocNode, operation: Operation` | `DocNode` | `tree.*` |
| 9/10 | CORE-005 | `applyOperations()` | Function | `operations.ts:226` | سلسلة عمليات | `doc: DocNode, operations: Operation[]` | `DocNode` | `applyOperation` |
| 10/10 | CORE-012 | `findAndUpdateBlock()` | Function | `tree.ts:90` | البحث عن كتلة وتحديثها | `blocks, targetId, updater` | `BlockNode[]` | لا شيء |

### 📁 indexer/ — الفهرسة والبحث

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/3 | CORE-008 | `search()` | Function | `search.ts:48` | بحث نصي بالفهرس | `indexer, query, options?` | `SearchResult[]` | `Indexer` |
| 2/3 | CORE-008 | `simpleSearch()` | Function | `search.ts:100` | بحث بسيط | `indexer, query, caseSensitive?` | `SearchResult[]` | `search` |
| 3/3 | CORE-007 | `buildIndexer()` | Function | `indexer.ts` | بناء الفهرس | `doc: DocNode` | `Indexer` | `DocNode` |

### 📁 utils/ — الأدوات المساعدة

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/2 | CORE-009 | `generateId()` | Function | `id.ts:52` | توليد معرف فريد | `prefix?: string` | `NodeId` | لا شيء |
| 2/2 | CORE-010 | `validateDocument()` | Function | `validation.ts:45` | التحقق من صحة المستند | `doc: DocNode` | `ValidationResult` | `DocNode` |

---

## 📦 packages/algorithms — طبقة المنطق والخوارزميات

### 📁 command/ — نمط الأوامر

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/8 | ALGO-001 | `SpatialCommand` | Type | `types.ts:56` | أمر مكاني | `type, targetId, payload` | `SpatialCommand` | لا شيء |
| 2/8 | ALGO-001 | `TextCommand` | Type | `types.ts:72` | أمر نصي | `type, targetId, payload` | `TextCommand` | لا شيء |
| 3/8 | ALGO-001 | `FormulaCommand` | Type | `types.ts:85` | أمر صيغة | `type, targetId, payload` | `FormulaCommand` | لا شيء |
| 4/8 | ALGO-002 | `CommandExecutor.execute()` | Method | `executor.ts:142` | تنفيذ أمر | `cmd: Command, state: FullEditorState` | `CommandResult` | `applyOperation` |
| 5/8 | ALGO-002 | `CommandExecutor.undo()` | Method | `executor.ts:168` | التراجع عن أمر | `cmd: Command, state: FullEditorState` | `CommandResult` | `applyOperation` |
| 6/8 | ALGO-002 | `CommandExecutor.undoMany()` | Method | `executor.ts:207` | التراجع عن عدة أوامر | `count: number, state: FullEditorState` | `CommandResult` | `undo` |
| 7/8 | ALGO-002 | `executeCommand()` | Function | `executor.ts:240` | تنفيذ أمر ( stehenalone) | `cmd: Command, state: FullEditorState` | `CommandResult` | `CommandExecutor` |
| 8/8 | ALGO-003 | `CommandRegistry.register()` | Method | `registry.ts:56` | تسجيل معالج | `type: string, handler` | `void` | لا شيء |

### 📁 formula/ — محلل الصيغ

| # | الم�عرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|---------|-------|-------|-----------|-------|----------|---------|----------|
| 1/8 | ALGO-010 | `tokenize()` | Function | `tokenizer.ts:202` | تحويل نص لرموز | `input: string` | `Token[]` | لا شيء |
| 2/8 | ALGO-004 | `parseFormula()` | Function | `parser.ts` | تحليل صيغة لـ AST | `tokens: Token[]` | `FormulaAST` | `tokenize` |
| 3/8 | ALGO-005 | `FormulaEvaluator.evaluate()` | Method | `evaluator.ts:82` | تقييم صيغة | `ast: FormulaAST` | `EvaluationResult` | `visit*` |
| 4/8 | ALGO-006 | `SUM` | Function | `functions.ts` | مجموع | `args: number[]` | `number` | لا شيء |
| 5/8 | ALGO-006 | `AVERAGE` | Function | `functions.ts` | متوسط | `args: number[]` | `number` | لا شيء |
| 6/8 | ALGO-006 | `IF` | Function | `functions.ts` | شرطي | `condition, then, else` | `EvaluationResult` | لا شيء |
| 7/8 | ALGO-011 | `columnToIndex()` | Function | `cell-utils.ts` | تحويل حرف لرقم | `col: string` | `number` | لا شيء |
| 8/8 | ALGO-012 | `FunctionRegistry.register()` | Method | `registry.ts` | تسجيل دالة مخصصة | `name, handler` | `void` | لا شيء |

### 📁 spatial/ — الترجمة المكانية

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/19 | ALGO-007 | `LogicalCoordinate` | Interface | `types.ts:47` | إحداثيات ديكارتية | `x, y, unit` | `LogicalCoordinate` | لا شيء |
| 2/19 | ALGO-007 | `GridCoordinate` | Interface | `types.ts:60` | إحداثيات شبكية | `row, col` | `GridCoordinate` | لا شيء |
| 3/19 | ALGO-007 | `createLogicalCoordinate()` | Function | `types.ts:102` | إنشاء إحداثيات ديكارتية | `x, y, unit?` | `LogicalCoordinate` | لا شيء |
| 4/19 | ALGO-007 | `createGridCoordinate()` | Function | `types.ts:115` | إنشاء إحداثيات شبكية | `row, col` | `GridCoordinate` | لا شيء |
| 5/19 | ALGO-007 | `gridToLabel()` | Function | `types.ts:131` | تحويل شبكية لاسم خلية | `coord` | `string` | `indexToColumnLabel` |
| 6/19 | ALGO-007 | `labelToGrid()` | Function | `types.ts:142` | تحويل اسم خلية لشبكية | `label` | `GridCoordinate` | `columnLabelToIndex` |
| 7/19 | ALGO-007 | `isValidCellLabel()` | Function | `types.ts:167` | التحقق من صحة اسم خلية | `label` | `boolean` | لا شيء |
| 8/19 | ALGO-008 | `convertLength()` | Function | `mapper.ts:121` | تحويل بين وحدتين | `value, from, to` | `number` | `unitToPx, pxToUnit` |
| 9/19 | ALGO-008 | `translateToLogical()` | Function | `mapper.ts:145` | تحويل لماوس إلى ديكارتي | `raw, viewport, unit?` | `LogicalCoordinate` | `createLogicalCoordinate` |
| 10/19 | ALGO-008 | `translateToGrid()` | Function | `mapper.ts:169` | تحويل لماوس إلى شبكي | `raw, viewport, grid` | `GridCoordinate` | `createGridCoordinate` |
| 11/19 | ALGO-008 | `translateCoords()` | Function | `mapper.ts:200` | الدالة الرئيسية للترجمة | `raw, domain, config` | `SpatialCoordinate` | `translateToGrid, translateToLogical` |
| 12/19 | ALGO-008 | `getDomainDefaultUnit()` | Function | `mapper.ts:223` | الوحدة الافتراضية للنطاق | `domain` | `LengthUnitValue` | لا شيء |
| 13/19 | ALGO-009 | `createMoveCommand()` | Function | `commands.ts:107` | مصنع أمر التحريك | `targetId, from, to` | `MoveCommand` | `validateCoordinateTypesMatch` |
| 14/19 | ALGO-009 | `createResizeCommand()` | Function | `commands.ts:117` | مصنع أمر التحجيم | `targetId, position, width, height` | `ResizeCommand` | `validatePositiveDimensions` |
| 15/19 | ALGO-009 | `createSelectCommand()` | Function | `commands.ts:128` | مصنع أمر التحديد | `targetIds, addToSelection?` | `SelectCommand` | لا شيء |
| 16/19 | ALGO-009 | `createDeleteCommand()` | Function | `commands.ts:141` | مصنع أمر الحذف | `targetIds` | `DeleteCommand` | لا شيء |
| 17/19 | ALGO-009 | `createCreateCommand()` | Function | `commands.ts:148` | مصنع أمر الإنشاء | `position, content, width?, height?` | `CreateCommand` | `validatePositiveDimensions` |
| 18/19 | ALGO-009 | `computeMoveDelta()` | Function | `commands.ts:172` | حساب إزاحة التحريك | `from, to` | `MoveDelta` | `validateCoordinateTypesMatch` |
| 19/19 | ALGO-009 | `toBoundingBox()` | Function | `commands.ts:195` | تحويل لـ BoundingBox | `cmd: ResizeCommand` | `BoundingBox` | `isLogicalCoordinate` |

---

## 📦 packages/serializers — المحولات

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/5 | SER-001 | `MarkdownSerializer.serialize()` | Method | `markdown-serializer.ts` | تحويل لـ Markdown | `doc: DocNode` | `string` | `DocNode` |
| 2/5 | SER-002 | `HtmlSerializer.serialize()` | Method | `html-serializer.ts` | تحويل لـ HTML | `doc: DocNode` | `string` | `DocNode` |
| 3/5 | SER-003 | `TxtSerializer.serialize()` | Method | `txt-serializer.ts` | تحويل لنص عادي | `doc: DocNode` | `string` | `DocNode` |
| 4/5 | SER-004 | `PdfSerializer.serialize()` | Method | `pdf-serializer.ts` | تحويل لـ PDF | `doc: DocNode` | `string` | `DocNode` |
| 5/5 | SER-005 | `LatexSerializer.serialize()` | Method | `latex-serializer.ts` | تحويل لـ LaTeX | `doc: DocNode` | `string` | `DocNode` |

---

## 📦 packages/plugins — الإضافات

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/2 | PLUG-001 | `MermaidPlugin` | Class | `mermaid-plugin.ts` | إضافة Mermaid | `options?` | `Plugin` | لا شيء |
| 2/2 | PLUG-002 | `MathPlugin` | Class | `math-plugin.ts` | إضافة رياضيات | `options?` | `Plugin` | لا شيء |

---

## 📦 packages/adapters — طبقات التكيف

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/4 | ADAP-001 | `ReactAdapter` | Class | `react-adapter.ts` | محور React | `options?` | `EditorAdapter` | `@libretext/core` |
| 2/4 | ADAP-002 | `VueAdapter` | Class | `vue-adapter.ts` | محور Vue | `options?` | `EditorAdapter` | `@libretext/core` |
| 3/4 | ADAP-003 | `WebComponentAdapter` | Class | `web-component-adapter.ts` | محور Web Component | `options?` | `EditorAdapter` | `@libretext/core` |
| 4/4 | ADAP-004 | `VanillaAdapter` | Class | `vanilla-adapter.ts` | محور Vanilla JS | `options?` | `EditorAdapter` | `@libretext/core` |

---

## 📊 ملخص التبعيات (Dependency Graph)

```
core (صفر اعتماديات)
  ↑
algorithms (يعتمد على core)
  ↑
serializers (يعتمد على core)
  ↑
plugins (يعتمد على core)
  ↑
adapters (يعتمد على core + algorithms)
  ↑
storage (يعتمد على core + algorithms) [لم يبدأ بعد]
  ↑
templates (يعتمد على storage) [لم يبدأ بعد]
```

---

## 📝 تعليمات الفهرسة (Index Instructions)

```typescript
// @function-index: 1/16 — text() — بناء عقدة نصية
// @see: FUNCTION_INDEX.md#L50 — packages/core/ast/builder.ts
// @depends: generateId()
// @used-by: parsers, serializers, tests
```

**كل دالة جديدة يجب أن تحتوي تعليمات `@function-index` فوقها.**
