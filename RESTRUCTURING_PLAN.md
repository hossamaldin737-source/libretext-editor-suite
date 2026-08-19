# 📌 خطة إعادة الهيكلة الشاملة | Comprehensive Restructuring Plan

> **تاريخ الإنشاء:** 2026-08-19
> **الحالة:** مسودة معمارية
> **المشروع:** LibreText Editor Suite

---

## 🎯 المشاكل المُكتشفة

| # | المشكلة | الحالة الحالية | المطلوب |
|---|---------|---------------|---------|
| 1 | **لا توجد طبقة منطق** | لا خوارزميات، لا صيغ، لا ماكرو | محرك حسابي كامل |
| 2 | **لا توجد ذاكرة** | لا In-Memory، لا Persistence | IndexedDB + snapshots |
| 3 | **لا توجد قوالب** | لا Template System | مكتبة قوالب متعددة |
| 4 | **نطاقات مفقودة** | لا Office، لا DB | توسيع النطاق |
| 5 | **بعض الملفات كبيرة** | types.ts (271 سطر) | تقسيم < 150 سطر/ملف |

---

## 🏗️ المعمارية الجديدة المقترحة

### الشجرة الهيكلية المعتمدة (الجديدة + الموجودة)

```
packages/
├── core/                          # [CORE] النواة المجردة (موجود - محفوظ)
│   ├── src/
│   │   ├── ast/                   # CORE-001..003 (موجود - محفوظ)
│   │   ├── state/                 # CORE-004..006 (موجود - محفوظ)
│   │   ├── indexer/               # CORE-007..008 (موجود - محفوظ)
│   │   └── utils/                 # CORE-009..010 (موجود - محفوظ)
│
├── algorithms/                    # [ALGO] طبقة الخوارزميات والمنطق (جديد)
│   ├── src/
│   │   ├── formula/               # ALGO-001..003 محلل الصيغ
│   │   │   ├── parser.ts          # محلل تنازلي (Recursive Descent)
│   │   │   ├── evaluator.ts       # مُقيّم التعابير
│   │   │   └── functions.ts       # دوال مدمجة (SUM, AVG, IF, etc.)
│   │   ├── text/                  # ALGO-004..006 خوارزميات النص
│   │   │   ├── diff.ts            # خوارزمية المقارنة (Diff)
│   │   │   ├── search.ts          # بحث متقدم (Regex, Fuzzy)
│   │   │   └── sort.ts            # ترتيب متعدد المعايير
│   │   ├── math/                  # ALGO-007..009 رياضيات
│   │   │   ├── statistics.ts      # إحصائيات (Mean, Median, StdDev)
│   │   │   ├── units.ts           # تحويل الوحدات
│   │   │   └── date.ts            # حسابات التاريخ والوقت
│   │   └── index.ts               # Barrel Export
│
├── storage/                       # [STORE] طبقة التخزين (جديد)
│   ├── src/
│   │   ├── memory.ts              # STORE-001 In-Memory Store
│   │   ├── indexeddb.ts           # STORE-002 IndexedDB Adapter
│   │   ├── localStorage.ts        # STORE-003 localStorage Adapter
│   │   ├── snapshots.ts           # STORE-004 Undo/Redo Snapshots
│   │   └── index.ts               # Barrel Export
│
├── templates/                     # [TPL] نظام القوالب (جديد)
│   ├── src/
│   │   ├── registry.ts            # TPL-001 Template Registry
│   │   ├── markdown/              # TPL-002 قوالب Markdown
│   │   ├── html/                  # TPL-003 قوالب HTML
│   │   ├── pdf/                   # TPL-004 قوالب PDF
│   │   ├── latex/                 # TPL-005 قوالب LaTeX
│   │   ├── office/                # TPL-006 قوالب Office
│   │   └── index.ts               # Barrel Export
│
├── serializers/                   # [SER] المحولات (موجود - محفوظ)
│   ├── src/
│   │   ├── basic/                 # SER-001..003 (موجود - محفوظ)
│   │   └── advanced/              # SER-004..005 (موجود - محفوظ)
│
├── plugins/                       # [PLUG] الإضافات (موجود - محفوظ)
│   ├── src/
│   │   ├── mermaid/               # PLUG-001 (موجود - محفوظ)
│   │   └── math/                  # PLUG-002 (موجود - محفوظ)
│
├── adapters/                      # [ADAP] طبقات التكيف (موجود - محفوظ)
│   ├── src/
│   │   ├── react/                 # ADAP-001 (موجود - محفوظ)
│   │   ├── vue/                   # ADAP-002 (موجود - محفوظ)
│   │   ├── web-component/         # ADAP-003 (موجود - محفوظ)
│   │   └── vanilla/               # ADAP-004 (موجود - محفوظ)
│
└── docs/                          # [DOC] التوثيق (موجود - محفوظ)
```

---

## 📋 المراحل الجديدة

### المرحلة A: طبقة الخوارزميات (ALGO) — الأولوية القصوى

| المعرف | المكون | الوصف | سطر/ملف |
|--------|--------|-------|---------|
| ALGO-001 | `formula/parser.ts` | محلل تنازلي للصيغ (PEMDAS) | < 150 |
| ALGO-002 | `formula/evaluator.ts` | مُقيّم التعابير الحسابية | < 150 |
| ALGO-003 | `formula/functions.ts` | دوال مدمجة (SUM, AVG, IF, CONCAT) | < 150 |
| ALGO-004 | `text/diff.ts` | خوارزمية المقارنة (Myers/LCS) | < 150 |
| ALGO-005 | `text/search.ts` | بحث متقدم (Regex, Fuzzy) | < 150 |
| ALGO-006 | `text/sort.ts` | ترتيب متعدد المعايير | < 150 |
| ALGO-007 | `math/statistics.ts` | إحصائيات وصفية | < 150 |
| ALGO-008 | `math/units.ts` | تحويل الوحدات | < 150 |
| ALGO-009 | `math/date.ts` | حسابات التاريخ | < 150 |

### المرحلة B: طبقة التخزين (STORE)

| المعرف | المكون | الوصف | سطر/ملف |
|--------|--------|-------|---------|
| STORE-001 | `memory.ts` | In-Memory Store مع CRUD | < 150 |
| STORE-002 | `indexeddb.ts` | IndexedDB Adapter | < 150 |
| STORE-003 | `localStorage.ts` | localStorage Adapter | < 150 |
| STORE-004 | `snapshots.ts` | Undo/Redo Snapshots | < 150 |

### المرحلة C: نظام القوالب (TPL)

| المعرف | المكون | الوصف | سطر/ملف |
|--------|--------|-------|---------|
| TPL-001 | `registry.ts` | Template Registry | < 150 |
| TPL-002 | `markdown/` | قوالب Markdown (أكاديمي، تقني، مدونة) | < 150 |
| TPL-003 | `html/` | قوالب HTML (صفحة، نموذج، بطاقة) | < 150 |
| TPL-004 | `pdf/` | قوالب PDF (شهادة، تقرير، سيرة ذاتية) | < 150 |
| TPL-005 | `latex/` | قوالب LaTeX (ورقة بحثية، كتاب) | < 150 |
| TPL-006 | `office/` | قوالب Office (Word, Excel, PPT) | < 150 |

### المرحلة D: نطاقات إضافية (POST-PONE)

| النطاق | الوصف |
|--------|-------|
| Office Format Support | قراءة/كتابة Word, Excel, PPT |
| Database Connector | ربط مع SQLite, JSON DB |
| Collaboration Engine | تعاون لحظي |
| Version Control | نظام إصدارات |

---

## 📏 قيود الصيانة

1. **حد أقصى 150 سطر لكل ملف** — تقسيم الملفات الكبيرة
2. **لا اعتماديات خارجية في Core/Algorithms** — Zero-Dependency
3. **كل خوارزمية لها بطاقة في Algorithms Registry** — التوثيق الإلزامي
4. **كل قالب له معرف فريد** — التسجيل في Template Registry
5. **كل تخزين له واجهة موحّدة** — StorageAdapter Interface

---

## 🔄 خارطة الطريق التنفيذية

```
المرحلة A (الخوارزميات) → المرحلة B (التخزين) → المرحلة C (القوالب) → المرحلة D (النطاقات)
         ↓                        ↓                        ↓                        ↓
    27 ملف جديد              4 ملفات جديدة           6 مجلدات جديدة         تخطيط لاحق
    < 4,050 سطر             < 600 سطر               < 900 سطر
```

---

## ⚠️ نقاط الخطر الإلزامية

1. **لا حذف أي كود موجود** — كل كود مكتوب هو ثروة
2. **إضافة فقط** — لا تعديل على الكود الموجود
3. **اختبارات لكل خوارزمية** — تغطية >= 95%
4. **توثيق كل معادلة** — في Algorithms Registry
5. **فصل التبعيات** — لا دورة بين الحزم

---

## 📊 الإحصائيات المتوقعة بعد إعادة الهيكلة

| البند | الحالي | بعد إعادة الهيكلة |
|-------|--------|-------------------|
| عدد الحزم | 5 | 8 |
| عدد الملفات | 36 | ~73 |
| إجمالي الأسطر | 3,903 | ~9,453 |
| حد أقصى سطر/ملف | 271 | ≤ 150 |
| عدد الاختبارات | 120 | ~250+ |
