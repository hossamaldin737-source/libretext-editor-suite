/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: find-replace-engine.ts
 * 📂 المسار: packages/algorithms/src/search/find-replace-engine.ts
 * 🎯 الهدف الرئيسي: محرك البحث والاستبدال الشامل عالي الأداء مع معالجة RegEx والتنقل الذكي
 * 📋 المعايير:
 *    - حماية من أخطاء الـ RegExp والحلقات اللانهائية.
 *    - استبدال فردي وجماعي دقيق دون ترحيل الإزاحات.
 * 🧪 الاختبارات: packages/algorithms/tests/search/find-replace.test.ts
 * 🏷️ المعرف: ALGO-032
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Safe Multi-Target Regular Expression Evaluator with Snippet Generator.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الهروب الآمن من محارف RegEx الخاصة عندما لا يكون نمط useRegex مفعلاً.
 *    2. منع الحلقات اللانهائية عندما يكون طول المطابقة صفر.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Regex safety wrappers with try/catch.
 *    - Bound checking on index slices.
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md
 *    - 📦 التبعيات: packages/algorithms/src/search/types.ts
 *    - 📄 مرتبط مباشر: packages/algorithms/src/search/index.ts
 *    - 🧪 اختبارات: packages/algorithms/tests/search/find-replace.test.ts
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - escapeRegExp: الهروب من محارف Regex الخاصة (#L45)
 *    - findMatches: البحث في قائمة العناصر واستخراج المطابقات (#L55)
 *    - replaceMatchInText: استبدال مطابقة محددة في النص (#L105)
 *    - replaceAllInText: استبدال كافة التواجدات مع عداد المرات (#L120)
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Universal Find & Replace Engine
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { SearchOptions, SearchTargetItem, SearchMatch, ReplaceAllResult } from './types';

/**
 * الهروب الآمن من الرموز الخاصة في التعبيرات النمطية.
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * البحث في مجموعة عناصر أو كتل نصية واستخراج جميع المطابقات.
 */
export function findMatches(
  query: string,
  items: readonly SearchTargetItem[],
  options: SearchOptions = {}
): readonly SearchMatch[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const { caseSensitive = false, wholeWord = false, useRegex = false } = options;
  let patternStr = useRegex ? query : escapeRegExp(query);

  if (wholeWord) {
    patternStr = `\\b${patternStr}\\b`;
  }

  let regex: RegExp;
  try {
    regex = new RegExp(patternStr, caseSensitive ? 'g' : 'gi');
  } catch {
    return []; // تعبير نمطي غير صالح
  }

  const matches: SearchMatch[] = [];

  for (const item of items) {
    if (!item.text) continue;

    let match: RegExpExecArray | null;
    regex.lastIndex = 0;

    while ((match = regex.exec(item.text)) !== null) {
      const startIndex = match.index;
      const matchedText = match[0];
      const endIndex = startIndex + matchedText.length;

      // استخراج مقتطف سياقي حول النتيجة لتسهيل المعاينة
      const snippetStart = Math.max(0, startIndex - 20);
      const snippetEnd = Math.min(item.text.length, endIndex + 20);
      const textSnippet = item.text.substring(snippetStart, snippetEnd);

      matches.push({
        id: `match-${item.id}-${startIndex}-${matches.length}`,
        targetId: item.id,
        targetType: item.type,
        textSnippet,
        startIndex,
        endIndex,
        matchedText,
        label: item.label,
      });

      // منع الحلقات اللانهائية في حال كانت المطابقة بطول صفر
      if (regex.lastIndex === startIndex) {
        regex.lastIndex++;
      }
    }
  }

  return matches;
}

/**
 * استبدال مطابقة واحدة مفردة في النص الأصلي.
 */
export function replaceMatchInText(
  originalText: string,
  match: SearchMatch,
  replacement: string
): string {
  if (!originalText) return '';
  const before = originalText.substring(0, match.startIndex);
  const after = originalText.substring(match.endIndex);
  return before + replacement + after;
}

/**
 * استبدال كافة المطابقات في النص وفق الخيارات المحددة.
 */
export function replaceAllInText(
  originalText: string,
  query: string,
  replacement: string,
  options: SearchOptions = {}
): ReplaceAllResult {
  if (!originalText || !query) {
    return { updatedText: originalText, count: 0 };
  }

  const { caseSensitive = false, wholeWord = false, useRegex = false } = options;
  let patternStr = useRegex ? query : escapeRegExp(query);

  if (wholeWord) {
    patternStr = `\\b${patternStr}\\b`;
  }

  let regex: RegExp;
  try {
    regex = new RegExp(patternStr, caseSensitive ? 'g' : 'gi');
  } catch {
    return { updatedText: originalText, count: 0 };
  }

  let count = 0;
  const updatedText = originalText.replace(regex, () => {
    count++;
    return replacement;
  });

  return { updatedText, count };
}
