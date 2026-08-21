/**

- ============================================================
- 📄 الملف: README.md
- 📂 المسار: README.md
- 🎯 الهدف الرئيسي: الملف التعريفي الرئيسي للمشروع، يتضمن
- نظرة عامة سريعة وتعريف بالمكتبة وأهم الميزات والتعليمات.
- 📋 المعايير:
- - يجب أن يكون واضحًا ومختصرًا.
- - يجب أن يحتوي على مثال سريع للاستخدام.
- - يجب أن يربط بملفات التوثيق الأخرى.
- 🧪 الاختبارات: لا توجد اختبارات (ملف تعريفي).
- 🏷️ المعرف: DOC-000
- 📅 تاريخ الإنشاء: 2026-08-19
- 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
- ⚖️ الترخيص: MIT License
- 📚 المصادر المقتبسة:
- - ProseMirror (https://prosemirror.net/) - الإلهام للنواة.
- - Quill.js (https://quilljs.com/) - الإلهام لنظام العمليات.
- - TipTap (https://tiptap.dev/) - الإلهام لنظام الإضافات.
- - Milkdown (https://milkdown.dev/) - الإلهام لمحول Markdown.
- ============================================================
  */

# LibreText Editor Suite

مكتبة محررات نصية متعددة الصيغ مبنية على TypeScript بمعمارية كتلية (Block-based).

## الميزات

- **متعددة الصيغ**: دعم تصدير Markdown, HTML, TXT, PDF, LaTeX
- **معمارية كتلية**: بناء المستندات من كتل (Blocks) مستقلة ومرنة
- **قفل للتوسع**: نظام إضافات (Plugin System) قابل للتوسع
- **نواة مجردة**: يمكن استخدامها مع أي واجهة مستخدم (Headless Core)
- **نظام فهرسة**: بحث وتصفح سريع للمستندات
- **أمان مضمون**: حماية من XSS وحقن الأكواد الضارة

## الأدوات التقنية

| الأداة     | الاستخدام                  |
| ---------- | -------------------------- |
| TypeScript | لغة البرمجة مع strict mode |
| pnpm       | مدير الحزم                 |
| Turborepo  | إدارة Monorepo             |
| Vite       | أداة البناء (Library Mode) |
| Vitest     | إطار الاختبارات            |

## التثبيت

```bash
pnpm install
```

## التشغيل

```bash
# بناء المشروع
pnpm build

# تشغيل الاختبارات
pnpm test

# تنسيق الكود
pnpm format

# التحقق من الكود
pnpm lint
```

## مثال سريع

```typescript
import { EditorState } from '@libretext/core';
import { MarkdownSerializer } from '@libretext/serializers-basic';

// إنشاء حالة جديدة
const state = EditorState.create();

// تصدير كـ Markdown
const serializer = new MarkdownSerializer();
const markdown = serializer.serialize(state.document);
```

## هيكل المشروع

```
libretext-editor-suite/
├── packages/
│   ├── core/           # النواة المجردة
│   ├── serializers/    # المحولات
│   ├── adapters/       # طبقات التكيف
│   ├── plugins/        # الإضافات
│   └── playground/     # الملعب التجريبي
├── docs/               # التوثيق
└── scripts/            # سكربتات البناء
```

## التوثيق

- [خطة المشروع](./PLAN.md)
- [فهرس المشروع](./INDEX.md)
- [سجل التغييرات](./CHANGELOG.md)
- [يوميات العمل](./JOURNAL.md)
- [دليل المساهمة](./CONTRIBUTING.md)

## الترخيص

MIT License - انظر [LICENSE](./LICENSE) للتفاصيل.
