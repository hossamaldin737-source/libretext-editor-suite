/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/algorithms/src/search/types.ts
 * 🎯 الهدف الرئيسي: تعريف أنواع وهياكل محرك البحث والاستبدال الشامل والمتقدم
 * 📋 المعايير:
 *    - أنواع مطابقة البحث، خيارات التعبيرات النمطية، والكلمات الكاملة.
 * 🧪 الاختبارات: packages/algorithms/tests/search/find-replace.test.ts
 * 🏷️ المعرف: ALGO-031
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Universal Search Match Target Mapping across documents, cells, and slides.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان ثبات أنواع الكتل والعناصر المستهدفة.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - تفصيل SearchOptions و SearchMatch مع فهارس دقيقة.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md
 *    - 📦 التبعيات: لا توجد
 *    - 📄 مرتبط مباشر: packages/algorithms/src/search/find-replace-engine.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/search/find-replace.test.ts
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Find & Replace Engine Pattern
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SearchOptions {
  readonly caseSensitive?: boolean;
  readonly wholeWord?: boolean;
  readonly useRegex?: boolean;
}

export type SearchTargetType =
  'writer-block' | 'calc-cell' | 'impress-element' | 'base-record' | 'generic-text';

export interface SearchTargetItem {
  readonly id: string;
  readonly type: SearchTargetType;
  readonly text: string;
  readonly label?: string;
}

export interface SearchMatch {
  readonly id: string;
  readonly targetId: string;
  readonly targetType: SearchTargetType;
  readonly textSnippet: string;
  readonly startIndex: number;
  readonly endIndex: number;
  readonly matchedText: string;
  readonly label?: string;
}

export interface ReplaceAllResult {
  readonly updatedText: string;
  readonly count: number;
}
