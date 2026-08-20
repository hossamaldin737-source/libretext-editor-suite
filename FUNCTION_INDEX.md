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

> **تاريخ آخر تحديث:** 2026-08-20 (v4: Lookup/Date + Macro + Storage Utils synced)
> **عدد الحزم:** 7 حزم
> **إجمالي العناصر المفهرسة:** 180 عنصر (was 139)

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
| 1/12 | ALGO-001 | `SpatialCommand` | Type | `types.ts:56` | أمر مكاني | `type, targetId, payload` | `SpatialCommand` | لا شيء |
| 2/12 | ALGO-001 | `TextCommand` | Type | `types.ts:72` | أمر نصي | `type, targetId, payload` | `TextCommand` | لا شيء |
| 3/12 | ALGO-001 | `FormulaCommand` | Type | `types.ts:85` | أمر صيغة | `type, targetId, payload` | `FormulaCommand` | لا شيء |
| 4/12 | ALGO-002 | `CommandExecutor.execute()` | Method | `executor.ts:142` | تنفيذ أمر | `cmd, state` | `CommandResult` | `applyOperation` |
| 5/12 | ALGO-002 | `CommandExecutor.undo()` | Method | `executor.ts:168` | التراجع عن أمر | `cmd, state` | `CommandResult` | `applyOperation` |
| 6/12 | ALGO-002 | `CommandExecutor.undoMany()` | Method | `executor.ts:207` | التراجع عن عدة أوامر | `count, state` | `CommandResult` | `undo` |
| 7/12 | ALGO-002 | `executeCommand()` | Function | `executor.ts:240` | تنفيذ أمر | `cmd, state` | `CommandResult` | `CommandExecutor` |
| 8/8 | ALGO-003 | `CommandRegistry.register()` | Method | `registry.ts:72` | تسجيل معالج مع canExecute/isEnabled | `type, handler, opts?` | `void` | لا شيء |
| 9/12 | ALGO-003 | `CommandRegistry.get()` | Method | `registry.ts:100` | الحصول على معالج مسجل | `type` | `handler?` | لا شيء |
| 10/12 | ALGO-003 | `CommandRegistry.canExecute()` | Method | `registry.ts:120` | فحص قابلية التنفيذ | `cmd, state` | `boolean` | `isEnabled` |
| 11/12 | ALGO-003 | `CommandRegistry.isEnabled()` | Method | `registry.ts:136` | فحص تنشيط الأمر | `cmd, state` | `boolean` | لا شيء |
| 12/12 | ALGO-003 | `CommandRegistry.on()` | Method | `registry.ts:160` | تسجيل مستمع لأحداث الأوامر | `listener` | `unsubscribe: () => void` | لا شيء |

### 📁 formula/ — محلل الصيغ

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/27 | ALGO-010 | `tokenize()` | Function | `tokenizer.ts:202` | تحويل نص لرموز | `input: string` | `Token[]` | لا شيء |
| 2/27 | ALGO-004 | `parseFormula()` | Function | `parser.ts` | تحليل صيغة لـ AST | `tokens: Token[]` | `FormulaAST` | `tokenize` |
| 3/27 | ALGO-005 | `FormulaEvaluator.evaluate()` | Method | `evaluator.ts:82` | تقييم صيغة | `ast: FormulaAST` | `EvaluationResult` | `visit*` |
| 4/27 | ALGO-006 | `FormulaError` | Class | `functions.ts:36` | خطأ صيغة بأكواد Excel | `code, message` | `FormulaError` | لا شيء |
| 5/27 | ALGO-006 | `isFormulaError()` | Function | `functions.ts:44` | فحص خطأ صيغة | `val: unknown` | `boolean` | لا شيء |
| 6/27 | ALGO-006 | `SUM` | Function | `functions.ts:130` | مجموع | `...args` | `number` | لا شيء |
| 7/27 | ALGO-006 | `AVERAGE` | Function | `functions.ts:136` | متوسط | `...args` | `number` | لا شيء |
| 8/27 | ALGO-006 | `COUNT` | Function | `functions.ts:144` | عدد القيم الرقمية | `...args` | `number` | لا شيء |
| 9/27 | ALGO-006 | `COUNTA` | Function | `functions.ts:148` | عدد القيم غير الفارغة | `...args` | `number` | لا شيء |
| 10/27 | ALGO-006 | `MIN` | Function | `functions.ts:153` | أدنى قيمة | `...args` | `number` | لا شيء |
| 11/27 | ALGO-006 | `MAX` | Function | `functions.ts:160` | أعلى قيمة | `...args` | `number` | لا شيء |
| 12/27 | ALGO-006 | `PRODUCT` | Function | `functions.ts:167` | جداء | `...args` | `number` | لا شيء |
| 13/27 | ALGO-006 | `ABS` | Function | `functions.ts:173` | القيمة المطلقة | `value` | `number` | لا شيء |
| 14/27 | ALGO-006 | `ROUND` | Function | `functions.ts:181` | تقريب آمن | `value, decimals?` | `number` | لا شيء |
| 15/27 | ALGO-006 | `FLOOR` | Function | `functions.ts:188` | تقريب للأسفل | `value` | `number` | لا شيء |
| 16/27 | ALGO-006 | `CEIL` | Function | `functions.ts:192` | تقريب للأعلى | `value` | `number` | لا شيء |
| 17/27 | ALGO-006 | `SQRT` | Function | `functions.ts:196` | الجذر التربيعي | `value` | `number` | لا شيء |
| 18/27 | ALGO-006 | `POWER` | Function | `functions.ts:202` | القوة | `base, exp` | `number` | لا شيء |
| 19/27 | ALGO-006 | `MOD` | Function | `functions.ts:206` | باقي القسمة | `dividend, divisor` | `number` | لا شيء |
| 20/27 | ALGO-006 | `IF` | Function | `functions.ts:213` | شرطي | `condition, trueVal, falseVal` | `T` | لا شيء |
| 21/27 | ALGO-006 | `AND` | Function | `functions.ts:217` | ومنطقية | `...args` | `boolean` | لا شيء |
| 22/27 | ALGO-006 | `OR` | Function | `functions.ts:221` | أو منطقية | `...args` | `boolean` | لا شيء |
| 23/27 | ALGO-006 | `NOT` | Function | `functions.ts:225` | نفي منطقية | `value` | `boolean` | لا شيء |
| 24/27 | ALGO-006 | `CONCAT` | Function | `functions.ts:231` | وصل نصوص | `...args` | `string` | لا شيء |
| 25/27 | ALGO-006 | `CONCATENATE` | Function | `functions.ts:235` | وصل نصوص (بديل) | `...args` | `string` | لا شيء |
| 26/27 | ALGO-006 | `LEN` | Function | `functions.ts:239` | طول النص | `value` | `number` | لا شيء |
| 27/27 | ALGO-006 | `UPPER/LOWER/TRIM` | Function | `functions.ts:243-255` | تحويل حالة/قص | `value` | `string` | لا شيء |

### 📁 formula/ — Arabic Functions (ALGO-013)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/8 | ALGO-013 | `TAFQEET` | Function | `functions-arabic.ts:141` | تفقيط مبالغ بأرقام عربية | `amount, currencyCode?, prefix?, suffix?` | `string` | `convertThreeDigits, formatScaleGroup` |
| 2/8 | ALGO-013 | `STRIP_TASHKEEL` | Function | `functions-arabic.ts:202` | إزالة حركات التشكيل | `text` | `string` | لا شيء |
| 3/8 | ALGO-013 | `NORMALIZE_ARABIC` | Function | `functions-arabic.ts:212` | توحيد أشكال الحروف العربية | `text, normalizeTaa?` | `string` | `STRIP_TASHKEEL` |
| 4/8 | ALGO-013 | `TO_ARABIC_NUMERALS` | Function | `functions-arabic.ts:235` | تحويل لأرقام مشرقية | `input` | `string` | لا شيء |
| 5/8 | ALGO-013 | `TO_WESTERN_NUMERALS` | Function | `functions-arabic.ts:243` | تحويل لأرقام لاتينية | `input` | `string` | لا شيء |
| 6/8 | ALGO-013 | `ARABIC_LEN` | Function | `functions-arabic.ts:256` | طول النص مع تجاهل التشكيل | `text, ignoreTashkeel?` | `number` | `STRIP_TASHKEEL` |
| 7/8 | ALGO-013 | `ARABIC_MATCH` | Function | `functions-arabic.ts:266` | مطابقة ذكية للنصوص العربية | `text, pattern, isPartial?` | `boolean` | `NORMALIZE_ARABIC` |
| 8/8 | ALGO-013 | `CurrencyConfig` | Interface | `functions-arabic.ts:48` | إعدادات العملة | `primary, primaryDual?, secondary, decimals` | `CurrencyConfig` | لا شيء |

### 📁 formula/ — Text Functions (ALGO-014)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/14 | ALGO-014 | `CLEAN` | Function | `functions-text.ts:76` | إزالة أحرف التحكم | `text` | `string` | لا شيء |
| 2/14 | ALGO-014 | `LEFT` | Function | `functions-text.ts:81` | اقتطاع من اليسار | `text, numChars?` | `string` | لا شيء |
| 3/14 | ALGO-014 | `RIGHT` | Function | `functions-text.ts:89` | اقتطاع من اليمين | `text, numChars?` | `string` | لا شيء |
| 4/14 | ALGO-014 | `MID` | Function | `functions-text.ts:99` | اقتطاع من موضع محدد (1-based) | `text, startNum, numChars` | `string` | لا شيء |
| 5/14 | ALGO-014 | `PROPER` | Function | `functions-text.ts:127` | تحويل لحالة العنوان | `text` | `string` | لا شيء |
| 6/14 | ALGO-014 | `SUBSTITUTE` | Function | `functions-text.ts:132` | استبدال نص بنص جديد | `text, old, new, instanceNum?` | `string` | لا شيء |
| 7/14 | ALGO-014 | `REPLACE` | Function | `functions-text.ts:158` | استبدال حسب الموضع والطول | `oldText, startNum, numChars, newText` | `string` | لا شيء |
| 8/14 | ALGO-014 | `TEXTJOIN` | Function | `functions-text.ts:179` | دمج نصوص مع فاصل | `delimiter, ignoreEmpty, ...args` | `string` | لا شيء |
| 9/14 | ALGO-014 | `EXACT` | Function | `functions-text.ts:188` | مقارنة مطابقة تامة | `text1, text2` | `boolean` | لا شيء |
| 10/14 | ALGO-014 | `REPT` | Function | `functions-text.ts:193` | تكرار نص | `text, numberTimes` | `string` | لا شيء |
| 11/14 | ALGO-014 | `SEARCH` | Function | `functions-text.ts:201` | بحث غير حساس للحالة (1-based) | `findText, withinText, startNum?` | `number` | لا شيء |
| 12/14 | ALGO-014 | `FIND` | Function | `functions-text.ts:211` | بحث حساس للحالة (1-based) | `findText, withinText, startNum?` | `number` | لا شيء |
| 13/14 | ALGO-014 | `TRIM` | Function | `functions-text.ts:70` | إزالة المسافات الزائدة | `text` | `string` | لا شيء |
| 14/14 | ALGO-014 | `LEN/LOWER/UPPER` | Function | `functions-text.ts:112-124` | حسابطول/تحويل حالة | `text` | `string/number` | لا شيء |

### 📁 formula/ — Math & Statistics Functions (ALGO-015)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/12 | ALGO-015 | `POWER` | Function | `functions-math.ts:74` | الرفع للقوة | `number, power` | `number` | لا شيء |
| 2/12 | ALGO-015 | `SQRT` | Function | `functions-math.ts:82` | الجذر التربيعي | `number` | `number` | لا شيء |
| 3/12 | ALGO-015 | `MOD` | Function | `functions-math.ts:90` | باقي القسمة | `number, divisor` | `number` | لا شيء |
| 4/12 | ALGO-015 | `FLOOR` | Function | `functions-math.ts:99` | تقريب للأسفل مع significance | `number, significance?` | `number` | لا شيء |
| 5/12 | ALGO-015 | `CEILING` | Function | `functions-math.ts:109` | تقريب للأعلى مع significance | `number, significance?` | `number` | لا شيء |
| 6/12 | ALGO-015 | `TRUNC` | Function | `functions-math.ts:119` | بتر الأرقام العشرية | `number, numDigits?` | `number` | لا شيء |
| 7/12 | ALGO-015 | `MEDIAN` | Function | `functions-math.ts:128` | الوسيط الحسابي | `...args` | `number` | لا شيء |
| 8/12 | ALGO-015 | `MODE` | Function | `functions-math.ts:142` | القيمة الأكثر تكراراً | `...args` | `number` | لا شيء |
| 9/12 | ALGO-015 | `COUNTA` | Function | `functions-math.ts:166` | عدد القيم غير الفارغة | `...args` | `number` | لا شيء |
| 10/12 | ALGO-015 | `COUNTBLANK` | Function | `functions-math.ts:172` | عدد القيم الفارغة | `...args` | `number` | لا شيء |
| 11/12 | ALGO-015 | `COUNTIF` | Function | `functions-math.ts:210` | عدد المطابقات الشرطية | `range, criteria` | `number` | `matchCriteria` |
| 12/12 | ALGO-015 | `SUMIF` | Function | `functions-math.ts:216` | مجموع المطابقات الشرطية | `range, criteria, sumRange?` | `number` | `matchCriteria` |

### 📁 formula/ — Lookup & Date Functions (ALGO-016)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/11 | ALGO-016 | `MATCH` | Function | `functions-lookup-date.ts:48` | بحث عن موضع في مصفوفة | `lookupValue, lookupArray, matchType?` | `number` | لا شيء |
| 2/11 | ALGO-016 | `INDEX` | Function | `functions-lookup-date.ts:86` | استرجاع قيمة من مصفوفة | `array, rowNum, colNum?` | `unknown` | لا شيء |
| 3/11 | ALGO-016 | `VLOOKUP` | Function | `functions-lookup-date.ts:111` | البحث العمودي | `lookupValue, tableArray, colIndex, rangeLookup?` | `unknown` | لا شيء |
| 4/11 | ALGO-016 | `XLOOKUP` | Function | `functions-lookup-date.ts:163` | البحث المتقدم ثنائي الاتجاه | `lookupValue, lookupArray, returnArray, ifNotFound?` | `unknown` | لا شيء |
| 5/11 | ALGO-016 | `IFS` | Function | `functions-lookup-date.ts:190` | شروط متعددة | `...args` | `unknown` | لا شيء |
| 6/11 | ALGO-016 | `SWITCH` | Function | `functions-lookup-date.ts:205` | مطابقة تعبير | `expression, ...args` | `unknown` | لا شيء |
| 7/11 | ALGO-016 | `DATE` | Function | `functions-lookup-date.ts:227` | إنشاء تاريخ ISO | `year, month, day` | `string` | لا شيء |
| 8/11 | ALGO-016 | `TODAY` | Function | `functions-lookup-date.ts:242` | تاريخ اليوم | — | `string` | لا شيء |
| 9/11 | ALGO-016 | `NOW` | Function | `functions-lookup-date.ts:251` | تاريخ ووقت اللحظة | — | `string` | لا شيء |
| 10/11 | ALGO-016 | `DATEDIF` | Function | `functions-lookup-date.ts:256` | الفرق بين تاريخين | `startDate, endDate, unit?` | `number` | لا شيء |
| 11/11 | ALGO-016 | `flatten` | Helper | `functions-lookup-date.ts:27` | تسطيح مصفوفات متداخلة | `args: unknown[]` | `unknown[]` | لا شيء |

### 📁 formula/ — Registry with Arabic Aliases (ALGO-012)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/5 | ALGO-012 | `FunctionRegistry.register()` | Method | `registry.ts:47` | تسجيل دالة | `name, handler` | `void` | لا شيء |
| 2/5 | ALGO-012 | `FunctionRegistry.registerOrReplace()` | Method | `registry.ts:56` | تسجيل/استبدال (آمن لـ HMR) | `name, handler` | `void` | لا شيء |
| 3/5 | ALGO-012 | `FunctionRegistry.registerBuiltins()` | Method | `registry.ts:76` | تسجيل جميع الدوال + المرادفات العربية | — | `this` | لا شيء |
| 4/5 | ALGO-012 | `getBuiltinFunction()` | Function | `registry.ts:212` | استرجاع دالة من السجل الافتراضي | `name` | `FunctionHandler?` | لا شيء |
| 5/5 | ALGO-012 | `createFunctionRegistry()` | Function | `registry.ts:196` | إنشاء سجل جديد بالدوال المدمجة | — | `FunctionRegistry` | لا شيء |

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
| 17/19 | ALGO-009 | `createCreateCommand()` | Function | `commands.ts:148` | مصنع أمر الإنشاء | `position, content, w?, h?` | `CreateCommand` | `validatePositiveDimensions` |
| 18/19 | ALGO-009 | `computeMoveDelta()` | Function | `commands.ts:172` | حساب إزاحة التحريك | `from, to` | `MoveDelta` | `validateCoordinateTypesMatch` |
| 19/19 | ALGO-009 | `toBoundingBox()` | Function | `commands.ts:195` | تحويل لـ BoundingBox | `cmd: ResizeCommand` | `BoundingBox` | `isLogicalCoordinate` |

### 📁 spatial/ — Coordinate Transformer (ALGO-010)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/17 | ALGO-010 | `screenToDocument()` | Function | `transformer.ts:80` | تحويل شاشة لمستند | `screenX, screenY, offset, zoom` | `Point2D` | لا شيء |
| 2/17 | ALGO-010 | `documentToScreen()` | Function | `transformer.ts:99` | تحويل مستند لشاشة | `docX, docY, offset, zoom` | `Point2D` | لا شيء |
| 3/17 | ALGO-010 | `applyLinearTransform()` | Function | `transformer.ts:118` | تطبيق تحويل خطي 2D | `pt, matrix` | `Point2D` | لا شيء |
| 4/17 | ALGO-010 | `translateMatrix()` | Function | `transformer.ts:130` | مصفوفة إزاحة | `tx, ty` | `TransformMatrix` | لا شيء |
| 5/17 | ALGO-010 | `rotationMatrix()` | Function | `transformer.ts:135` | مصفوفة دوران | `angleRad` | `TransformMatrix` | لا شيء |
| 6/17 | ALGO-010 | `rotationAroundPointMatrix()` | Function | `transformer.ts:144` | دوران حول نقطة | `angleRad, cx, cy` | `TransformMatrix` | لا شيء |
| 7/17 | ALGO-010 | `snapToGrid()` | Function | `transformer.ts:166` | تقريب لخط شبكية | `value, step` | `number` | لا شيء |
| 8/17 | ALGO-010 | `snapPointToGrid()` | Function | `transformer.ts:173` | تقريب نقطة للشبكة | `pt, snap` | `Point2D` | `snapToGrid` |
| 9/17 | ALGO-010 | `rotatePoint()` | Function | `transformer.ts:183` | دوران نقطة حول مركز | `pt, angleRad, center` | `Point2D` | `rotationAroundPointMatrix` |
| 10/17 | ALGO-010 | `getBoundingBox()` | Function | `transformer.ts:203` | حساب Bounding Box | `points` | `BBox` | لا شيء |
| 11/17 | ALGO-010 | `getRotatedBoundingBox()` | Function | `transformer.ts:220` | BBox مع دوران | `corners, angleRad` | `BBox` | `rotatePoint, getBoundingBox` |
| 12/17 | ALGO-010 | `getBBoxEdges()` | Function | `transformer.ts:235` | حافة BBox | `bbox` | `BBoxEdges` | لا شيء |
| 13/17 | ALGO-010 | `getResizeHandles()` | Function | `transformer.ts:244` | 8 نقاط تحكم سحب | `bbox` | `ResizeHandle[]` | لا شيء |
| 14/17 | ALGO-010 | `distance()` | Function | `transformer.ts:265` | المسافة بين نقطتين | `a, b` | `number` | لا شيء |
| 15/17 | ALGO-010 | `createBBox()` | Function | `transformer.ts:270` | إنشاء BBox | `x, y, w, h` | `BBox` | لا شيء |
| 16/17 | ALGO-010 | `radToDeg()` | Function | `transformer.ts:195` | راديان لدرجات | `rad` | `number` | لا شيء |
| 17/17 | ALGO-010 | `degToRad()` | Function | `transformer.ts:200` | درجات لراديان | `deg` | `number` | لا شيء |

### 📁 macro/ — نظام الماكرو (ALGO-017)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/12 | ALGO-017 | `MacroDomain` | Type | `macro/types.ts:44` | نطاق الماكرو | — | `'writer' | 'calc' | ...` | لا شيء |
| 2/12 | ALGO-017 | `MacroStep` | Interface | `macro/types.ts:53` | خطوة الماكرو | `commandType, payload, spatialTarget?, timestamp` | `MacroStep` | لا شيء |
| 3/12 | ALGO-017 | `MacroDefinition` | Interface | `macro/types.ts:60` | تعريف الماكرو | `id, name, domain, steps, parameters?` | `MacroDefinition` | `MacroStep` |
| 4/12 | ALGO-017 | `isMacroDefinition()` | Function | `macro/types.ts:98` | Type Guard للتعريف | `value: unknown` | `boolean` | لا شيء |
| 5/12 | ALGO-017 | `isMacroStep()` | Function | `macro/types.ts:113` | Type Guard للخطوة | `value: unknown` | `boolean` | لا شيء |
| 6/12 | ALGO-017 | `MacroRecorder` | Class | `macro/recorder.ts:37` | مسجل الإجراءات | `options?` | `MacroRecorder` | `MacroDefinition` |
| 7/12 | ALGO-017 | `MacroRecorder.start()` | Method | `macro/recorder.ts:63` | بدء التسجيل | `name, domain?, description?` | `void` | لا شيء |
| 8/12 | ALGO-017 | `MacroRecorder.stop()` | Method | `macro/recorder.ts:107` | إيقاف وتصدير | — | `MacroDefinition` | لا شيء |
| 9/12 | ALGO-017 | `MacroRunner` | Class | `macro/runner.ts:38` | محرك التشغيل | — | `MacroRunner` | لا شيء |
| 10/12 | ALGO-017 | `MacroRunner.run()` | Method | `macro/runner.ts:57` | تشغيل ماكرو | `macro, dispatcher, options?` | `Promise<MacroExecutionResult>` | `CommandDispatcher` |
| 11/12 | ALGO-017 | `MacroRegistry` | Class | `macro/registry.ts:28` | سجل الماكرو | — | `MacroRegistry` | `MacroDefinition` |
| 12/12 | ALGO-017 | `macroRegistry` | Instance | `macro/registry.ts:88` | السجل الافتراضي | — | `MacroRegistry` | لا شيء |

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

## 📦 packages/storage — طبقة التخزين

### 📁 src/ — Types & Interfaces (STORE-010)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/10 | STORE-010 | `Store` | Interface | `types.ts:136` | الواجهة الموحدة للمخزن | `name, version, get, set, ...` | `Store<T>` | لا شيء |
| 2/10 | STORE-010 | `AsyncStore` | Interface | `types.ts:156` | واجهة المخزن غير المتزامن | `name, version, get, set, ...` | `AsyncStore<T>` | لا شيء |
| 3/10 | STORE-010 | `StoreEntry` | Interface | `types.ts:100` | إدخال المخزن مع metadata | `key, data, metadata` | `StoreEntry<T>` | `StoreMetadata` |
| 4/10 | STORE-010 | `StoreEvent` | Interface | `types.ts:74` | حدث المخزن | `type, key, value?, timestamp` | `StoreEvent<T>` | لا شيء |
| 5/10 | STORE-010 | `isValidKey()` | Function | `types.ts:180` | التحقق من صحة المفتاح | `key: unknown` | `boolean` | لا شيء |
| 6/10 | STORE-010 | `validateKey()` | Function | `types.ts:188` | التحقق مع رمي استثناء | `key: unknown` | `void` | لا شيء |
| 7/10 | STORE-010 | `createStoreEntry()` | Function | `types.ts:195` | إنشاء إدخال مخزن | `key, data, tags?, existingMetadata?` | `StoreEntry<T>` | لا شيء |
| 8/10 | STORE-010 | `isStoreEntry()` | Function | `types.ts:218` | Type Guard كامل | `value: unknown` | `boolean` | لا شيء |
| 9/10 | STORE-010 | `deepClone()` | Function | `types.ts:237` | نسخ عميق حسب الاستراتيجية | `value, strategy?` | `T` | لا شيء |
| 10/10 | STORE-010 | `DEFAULT_STORE_CONFIG` | Constant | `types.ts:120` | الإعدادات الافتراضية | — | `Required<StoreConfig>` | لا شيء |

### 📁 src/ — Storage Utilities (STORE-011)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/7 | STORE-011 | `QuotaExceededError` | Class | `storage-utils.ts:30` | خطأ تجاوز الحصة | `message, bytesAttempted?` | `QuotaExceededError` | لا شيء |
| 2/7 | STORE-011 | `StorageUnavailableError` | Class | `storage-utils.ts:41` | خطأ عدم التوفر | `storageType?` | `StorageUnavailableError` | لا شيء |
| 3/7 | STORE-011 | `isQuotaExceededError()` | Function | `storage-utils.ts:54` | فحص خطأ الحصة | `err: unknown` | `boolean` | لا شيء |
| 4/7 | STORE-011 | `isLocalStorageAvailable()` | Function | `storage-utils.ts:69` | فحص توفر localStorage | — | `boolean` | لا شيء |
| 5/7 | STORE-011 | `safeJsonParse()` | Function | `storage-utils.ts:93` | تحليل JSON آمن | `raw: string | null` | `SafeJsonResult<T>` | لا شيء |
| 6/7 | STORE-011 | `safeJsonStringify()` | Function | `storage-utils.ts:111` | تحويل JSON آمن مع حماية من الحلقات | `value: unknown` | `string | null` | لا شيء |
| 7/7 | STORE-011 | `prefixKey()` | Function | `storage-utils.ts:122` | إضافة/إزالة بادئة | `prefix, key` | `string` | لا شيء |

### 📁 src/ — IndexedDB Utilities (STORE-012)

| # | المعرف | الاسم | النوع | الملف:سطر | الوصف | المعلمات | المُعاد | التبعيات |
|---|--------|-------|-------|-----------|-------|----------|---------|----------|
| 1/5 | STORE-012 | `IndexedDBError` | Class | `indexeddb-utils.ts:66` | خطأ IndexedDB مخصص | `message, cause?` | `IndexedDBError` | لا شيء |
| 2/5 | STORE-012 | `isIndexedDBAvailable()` | Function | `indexeddb-utils.ts:79` | فحص توفر IndexedDB | — | `boolean` | لا شيء |
| 3/5 | STORE-012 | `wrapRequest()` | Function | `indexeddb-utils.ts:91` | تحويل IDBRequest لـ Promise | `request: IDBRequest<T>` | `Promise<T>` | لا شيء |
| 4/5 | STORE-012 | `openDatabase()` | Function | `indexeddb-utils.ts:111` | فتح قاعدة بيانات | `name, options?` | `Promise<IDBDatabase>` | `isIndexedDBAvailable` |
| 5/5 | STORE-012 | `deleteDatabase()` | Function | `indexeddb-utils.ts:168` | حذف قاعدة بيانات | `name: string` | `Promise<void>` | `isIndexedDBAvailable` |

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
storage (يعتمد على core + algorithms)
  ↑
templates (يعتمد على storage)
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
