# 📌 خطة إعادة الهيكلة الشاملة | Comprehensive Restructuring Plan

> **تاريخ الإنشاء:** 2026-08-19
> **آخر تحديث:** 2026-08-19
> **الحالة:** معتمدة ✓
> **المشروع:** LibreText Editor Suite

---

## 🎯 المشاكل المُكتشفة

| #   | المشكلة                | الحالة الحالية                 | المطلوب                                   |
| --- | ---------------------- | ------------------------------ | ----------------------------------------- |
| 1   | **لا توجد طبقة منطق**  | لا خوارزميات، لا صيغ، لا ماكرو | Command Pattern + Expression Evaluator    |
| 2   | **لا توجد ذاكرة**      | لا In-Memory، لا Persistence   | EditorState حي + LocalStorage + IndexedDB |
| 3   | **لا توجد قوالب**      | لا Template System             | Template Registry متعددة الصيغ            |
| 4   | **نطاقات مفقودة**      | لا Office، لا DB               | Writer, Calc, Impress, Base               |
| 5   | **لا يوجد محرك مكاني** | لا Spatial Translation         | Adapter → SpatialMapper → Core            |

---

## 🏗️ المعمارية الجديدة — قبول معماري معتمد

### 1. طبقة المنطق والدوال (Logic & Formula Engine)

```
Command Pattern → Expression Evaluator → Built-in Functions
```

- **Command Pattern:** كل عملية تحرير هي أمر نقي (SpatialCommand) يُنفذ على النواة
- **Expression Evaluator:** محلل تعبيرات تنازلي (Recursive Descent) لدوال جداول البيانات
- **Built-in Functions:** SUM, AVERAGE, IF, CONCAT, COUNT, MIN, MAX, ROUND, ABS

### 2. محرك الترجمة المكانية (Spatial Translation Engine)

```
Adapter (mouse coords) → SpatialMapper (logical coords) → Core (pure commands)
```

- **Adapter:** تلتقط إحداثيات الماوس الخام (clientX, clientY)
- **SpatialMapper:** يحولها إلى إحداثيات منطقية:
  - `LogicalCoordinate`: إحداثيات ديكارتية (لـ Impress)
  - `GridCoordinate`: إحداثيات شبكية (لـ Calc و Base)
- **Core:** تستقبل أمر نقي (SpatialCommand) دون معرفة تفاصيل الأجهزة

### 3. النطاقات المكتبية الأربعة (Full Office Suite)

| النطاق      | الوصف               | الإحداثيات                   |
| ----------- | ------------------- | ---------------------------- |
| **Writer**  | نصوص ومستندات       | Character/Paragraph Position |
| **Calc**    | جداول وحسابات       | GridCoordinate (A1, B2)      |
| **Impress** | شائح وعروض          | LogicalCoordinate (cm, inch) |
| **Base**    | سجلات وقواعد بيانات | GridCoordinate + Record ID   |

### 4. الذاكرة والقوالب (Storage & Templates)

```
EditorState (حي) → LocalStorage (مؤقت) → IndexedDB (دائم)
         ↓
Template Registry (قوالب جاهزة)
```

- **ذاكرة حية:** داخل `EditorState` (Immutable Snapshots)
- **مخزن مؤقت:** `localStorage` (تفضيلات المستخدم)
- **مخزن دائم:** `IndexedDB` (مستندات محفوظة)
- **سجل القوالب:** `Template Registry` (قوالب متعددة الصيغ)

### 5. قواعد الصيانة الصارمة

| القاعدة          | الحد                          |
| ---------------- | ----------------------------- |
| حد أقصى سطر/ملف  | **250 سطر**                   |
| حد أقصى سطر/دالة | **50 سطر**                    |
| الثيم            | **الفاتح النقي حصراً**        |
| التفاعل          | **الماوس فقط + قوائم سياقية** |

---

## 🌳 الشجرة الهيكلية الجديدة

```
packages/
├── core/                          # [CORE] النواة المجردة (موجود - محفوظ 100%)
│   ├── src/
│   │   ├── ast/                   # CORE-001..003
│   │   ├── state/                 # CORE-004..006
│   │   ├── indexer/               # CORE-007..008
│   │   └── utils/                 # CORE-009..010
│
├── algorithms/                    # [ALGO] طبقة المنطق والدوال (جديد)
│   ├── src/
│   │   ├── command/               # ALGO-001..003 Command Pattern
│   │   │   ├── types.ts           # أنواع الأوامر
│   │   │   ├── executor.ts        # منفذ الأوامر
│   │   │   └── registry.ts        # سجل الأوامر
│   │   ├── formula/               # ALGO-004..006 Expression Evaluator
│   │   │   ├── parser.ts          # محلل تنازلي (PEMDAS)
│   │   │   ├── evaluator.ts       # مُقيّم التعابير
│   │   │   └── functions.ts       # دوال مدمجة
│   │   ├── spatial/               # ALGO-007..009 Spatial Translation
│   │   │   ├── types.ts           # أنواع الإحداثيات
│   │   │   ├── mapper.ts          # المترجم المكاني
│   │   │   └── commands.ts        # أوامر مكانية
│   │   └── index.ts               # Barrel Export
│
├── storage/                       # [STORE] طبقة التخزين (جديد)
│   ├── src/
│   │   ├── memory.ts              # STORE-001 In-Memory Store
│   │   ├── localStorage.ts        # STORE-002 localStorage Adapter
│   │   ├── indexeddb.ts           # STORE-003 IndexedDB Adapter
│   │   ├── snapshots.ts           # STORE-004 Undo/Redo Snapshots
│   │   └── index.ts               # Barrel Export
│
├── templates/                     # [TPL] نظام القوالب (جديد)
│   ├── src/
│   │   ├── registry.ts            # TPL-001 Template Registry
│   │   ├── writer/                # TPL-002 قوالب Writer
│   │   ├── calc/                  # TPL-003 قوالب Calc
│   │   ├── impress/               # TPL-004 قوالب Impress
│   │   ├── base/                  # TPL-005 قوالب Base
│   │   └── index.ts               # Barrel Export
│
├── serializers/                   # [SER] المحولات (موجود - محفوظ 100%)
│   ├── src/basic/                 # SER-001..003
│   └── src/advanced/              # SER-004..005
│
├── plugins/                       # [PLUG] الإضافات (موجود - محفوظ 100%)
│   ├── src/mermaid/               # PLUG-001
│   └── src/math/                  # PLUG-002
│
├── adapters/                      # [ADAP] طبقات التكيف (موجود - محفوظ 100%)
│   ├── src/react/                 # ADAP-001
│   ├── src/vue/                   # ADAP-002
│   ├── src/web-component/         # ADAP-003
│   └── src/vanilla/               # ADAP-004
│
└── docs/                          # [DOC] التوثيق (موجود - محفوظ)
```

---

## 📋 المراحل الجديدة

### المرحلة A: طبقة المنطق والدوال (ALGO) — الأولوية القصوى

| المعرف   | المكون                 | الوصف                                       | سطر/ملف |
| -------- | ---------------------- | ------------------------------------------- | ------- |
| ALGO-001 | `command/types.ts`     | أنواع الأوامر (SpatialCommand, TextCommand) | ≤ 250   |
| ALGO-002 | `command/executor.ts`  | منفذ الأوامر (Command Executor)             | ≤ 250   |
| ALGO-003 | `command/registry.ts`  | سجل الأوامر (Command Registry)              | ≤ 250   |
| ALGO-004 | `formula/parser.ts`    | محلل تنازلي للصيغ (PEMDAS)                  | ≤ 250   |
| ALGO-005 | `formula/evaluator.ts` | مُقيّم التعابير الحسابية                    | ≤ 250   |
| ALGO-006 | `formula/functions.ts` | دوال مدمجة (SUM, AVG, IF)                   | ≤ 250   |
| ALGO-007 | `spatial/types.ts`     | أنواع الإحداثيات المكانية                   | ≤ 250   |
| ALGO-008 | `spatial/mapper.ts`    | المترجم المكاني (SpatialMapper)             | ≤ 250   |
| ALGO-009 | `spatial/commands.ts`  | أوامر مكانية (SpatialCommand)               | ≤ 250   |

### المرحلة B: طبقة التخزين (STORE)

| المعرف    | المكون            | الوصف                   | سطر/ملف |
| --------- | ----------------- | ----------------------- | ------- |
| STORE-001 | `memory.ts`       | In-Memory Store مع CRUD | ≤ 250   |
| STORE-002 | `localStorage.ts` | localStorage Adapter    | ≤ 250   |
| STORE-003 | `indexeddb.ts`    | IndexedDB Adapter       | ≤ 250   |
| STORE-004 | `snapshots.ts`    | Undo/Redo Snapshots     | ≤ 250   |

### المرحلة C: نظام القوالب (TPL)

| المعرف  | المكون        | الوصف                             | سطر/ملف |
| ------- | ------------- | --------------------------------- | ------- |
| TPL-001 | `registry.ts` | Template Registry                 | ≤ 250   |
| TPL-002 | `writer/`     | قوالب Writer (خطاب، تقرير، مقال)  | ≤ 250   |
| TPL-003 | `calc/`       | قوالب Calc (ميزانية، تتبع، إحصاء) | ≤ 250   |
| TPL-004 | `impress/`    | قوالب Impress (عرض تقديمي، سلايد) | ≤ 250   |
| TPL-005 | `base/`       | قوالب Base (سجل، فهرس، استعلام)   | ≤ 250   |

### المرحلة D: نطاقات مكتبية (OFFICE)

| النطاق  | الوصف                                          |
| ------- | ---------------------------------------------- |
| Writer  | معالج كلمات كامل (Format, Style, Table, Image) |
| Calc    | جداول حسابية (Formula, Chart, Pivot)           |
| Impress | عروض تقديمية (Slide, Theme, Animation)         |
| Base    | قواعد بيانات (Table, Query, Form, Report)      |

---

## 📊 الإحصائيات المتوقعة

| البند            | الحالي   | بعد إعادة الهيكلة |
| ---------------- | -------- | ----------------- |
| عدد الحزم        | 5        | 8                 |
| عدد الملفات      | 36       | ~55               |
| إجمالي الأسطر    | 3,903    | ~7,500            |
| حد أقصى سطر/ملف  | 271      | ≤ 250             |
| حد أقصى سطر/دالة | غير محدد | ≤ 50              |
| عدد الاختبارات   | 120      | ~200+             |

---

## 🔄 خارطة الطريق التنفيذية

```
المرحلة A (ALGO) → المرحلة B (STORE) → المرحلة C (TPL) → المرحلة D (OFFICE)
    9 ملفات            4 ملفات           5 مجلدات          4 نطاقات
   ≤ 2,250 سطر        ≤ 1,000 سطر       ≤ 1,250 سطر       تخطيط لاحق
```

---

## ⚠️ نقاط الخطر الإلزامية

1. **لا حذف أي كود موجود** — كل كود مكتوب هو ثروة
2. **إضافة فقط** — لا تعديل على الكود الموجود
3. **اختبارات لكل خوارزمية** — تغطية >= 95%
4. **توثيق كل معادلة** — في Algorithms Registry
5. **فصل التبعيات** — لا دورة بين الحزم
6. **حد 250 سطر/ملف** — تقسيم أي ملف يتجاوز الحد
7. **حد 50 سطر/دالة** — تقسيم أي دالة تتجاوز الحد
