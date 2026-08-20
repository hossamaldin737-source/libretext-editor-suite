/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: find-replace.test.ts
 * 📂 المسار: packages/algorithms/tests/search/find-replace.test.ts
 * 🎯 الهدف الرئيسي: اختبارات محرك البحث والاستبدال الشامل والمتقدم
 * 📋 المعايير:
 *    - اختبار مطابقة النصوص العادية والكلمات الكاملة وحالة الأحرف والـ Regex.
 *    - اختبار الاستبدال الفردي والجماعي عبر أنواع العناصر المختلفة.
 * 🏷️ المعرف: TEST-ALGO-033
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  findMatches,
  replaceMatchInText,
  replaceAllInText,
  escapeRegExp,
  type SearchTargetItem,
} from '../../src/search';

describe('Universal Find & Replace Engine', () => {
  const sampleItems: SearchTargetItem[] = [
    { id: 'block-1', type: 'writer-block', text: 'LibreText is a modular TypeScript editor suite.' },
    { id: 'block-2', type: 'writer-block', text: 'The core provides zero-dependency state management.' },
    { id: 'cell-A1', type: 'calc-cell', text: 'LibreText Calc' },
    { id: 'slide-1', type: 'impress-element', text: 'Introduction to LibreText Suite' },
  ];

  it('يهرب من محارف التعبيرات النمطية الخاصة بشكل آمن', () => {
    const escaped = escapeRegExp('Hello. (World)? [*]');
    expect(escaped).toBe('Hello\\. \\(World\\)\\? \\[\\*\\]');
  });

  it('يعثر على جميع المطابقات البسيطة عبر كتل متعددة', () => {
    const matches = findMatches('LibreText', sampleItems);
    expect(matches.length).toBe(3);
    expect(matches[0].targetId).toBe('block-1');
    expect(matches[1].targetId).toBe('cell-A1');
    expect(matches[2].targetId).toBe('slide-1');
  });

  it('يدعم البحث مع حساسية حالة الأحرف', () => {
    const matchesCaseInsensitive = findMatches('libretext', sampleItems, { caseSensitive: false });
    expect(matchesCaseInsensitive.length).toBe(3);

    const matchesCaseSensitive = findMatches('libretext', sampleItems, { caseSensitive: true });
    expect(matchesCaseSensitive.length).toBe(0);
  });

  it('يدعم البحث بمطابقة الكلمة الكاملة (Whole Word)', () => {
    const customItems: SearchTargetItem[] = [
      { id: '1', type: 'writer-block', text: 'cat catalog concatenate cat' },
    ];
    const matches = findMatches('cat', customItems, { wholeWord: true });
    expect(matches.length).toBe(2);
    expect(matches[0].startIndex).toBe(0);
    expect(matches[1].startIndex).toBe(24);
  });

  it('يدعم البحث بالتعبيرات النمطية (Regex)', () => {
    const matches = findMatches('Libre[a-zA-Z]+', sampleItems, { useRegex: true });
    expect(matches.length).toBe(3);
    expect(matches[0].matchedText).toBe('LibreText');
  });

  it('يتعامل بأمان مع التعبيرات النمطية الخاطئة', () => {
    const matches = findMatches('[unclosed-bracket', sampleItems, { useRegex: true });
    expect(matches).toEqual([]);
  });

  it('يستبدل مطابقة واحدة في النص بدقة', () => {
    const text = 'Hello LibreText World';
    const matches = findMatches('LibreText', [{ id: '1', type: 'writer-block', text }]);
    expect(matches.length).toBe(1);

    const updated = replaceMatchInText(text, matches[0], 'WebPainter');
    expect(updated).toBe('Hello WebPainter World');
  });

  it('يستبدل كافة التواجدات مع حساب العداد', () => {
    const text = 'foo bar foo baz foo';
    const result = replaceAllInText(text, 'foo', 'qux');
    expect(result.count).toBe(3);
    expect(result.updatedText).toBe('qux bar qux baz qux');
  });
});
