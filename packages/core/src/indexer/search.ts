/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: search.ts
 * 📂 المسار: packages/core/src/indexer/search.ts
 * 🎯 الهدف الرئيسي: توفير واجهة بحث نصي فعالة في المستند
 *    مع دعم البحث الجزئي والبحث عن طريق التعبيرات النمطية.
 * 📋 المعايير:
 *    - يجب أن يدعم البحث النصي البسيط.
 *    - يجب أن يدعم البحث بالتعبيرات النمطية (Regex).
 *    - يجب أن يُعيد نتائج مع المسار الكامل.
 * 🧪 الاختبارات:
 *    - packages/core/tests/indexer/search.test.ts
 *    - اختبار البحث البسيط
 *    - اختبار البحث بـ Regex
 *    - اختبار البحث في مستند فارغ
 * 🏷️ المعرف: CORE-008
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Index-based Full-Text Search — بحث نصي كامل مبني على الفهرس.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التعامل مع الحروف الكبيرة والصغيرة.
 *    2. منع ReDoS عبر تقييد طول التعبير النمطي.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - try/catch حول التعبيرات النمطية.
 *    - تقييد طول نتائج البحث.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {NodeId, SearchResult} from '../ast/types';
import type {Indexer} from './indexer';

export interface SearchOptions {
  readonly caseSensitive?: boolean;
  readonly useRegex?: boolean;
  readonly maxResults?: number;
}

const DEFAULT_MAX_RESULTS = 100;

/**
 * بحث نصي في المستند باستخدام الفهرس.
 */
export function search(
  indexer: Indexer,
  query: string,
  options: SearchOptions = {},
): readonly SearchResult[] {
  const {caseSensitive = false, useRegex = false, maxResults = DEFAULT_MAX_RESULTS} = options;

  if (!query || query.length === 0) return [];

  let matcher: (text: string) => boolean;

  if (useRegex) {
    try {
      const flags = caseSensitive ? '' : 'i';
      const regex = new RegExp(query, flags);
      matcher = (text: string) => {
        regex.lastIndex = 0;
        return regex.test(text);
      };
    } catch {
      return [];
    }
  } else {
    const lowerQuery = caseSensitive ? query : query.toLowerCase();
    matcher = (text: string) => {
      const lowerText = caseSensitive ? text : text.toLowerCase();
      return lowerText.includes(lowerQuery);
    };
  }

  const results: SearchResult[] = [];

  for (const textNode of indexer.textNodes) {
    if (results.length >= maxResults) break;

    if (matcher(textNode.text)) {
      results.push({
        nodeId: textNode.id,
        text: textNode.text,
        startIndex: 0,
        endIndex: textNode.text.length,
        path: textNode.path,
      });
    }
  }

  return results;
}

/**
 * بحث بسيط (بدون Regex).
 */
export function simpleSearch(
  indexer: Indexer,
  query: string,
  caseSensitive: boolean = false,
): readonly SearchResult[] {
  return search(indexer, query, {caseSensitive, useRegex: false});
}
