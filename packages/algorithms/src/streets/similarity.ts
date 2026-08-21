/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: similarity.ts
 * 📂 المسار: src/algorithms/streets/similarity.ts
 * 🎯 الهدف الرئيسي: خوارزميات كشف التكرار والتشابه اللفظي لأسماء الشوارع
 * 📋 المعايير: حساب Levenshtein Distance و Jaccard Similarity للغة العربية
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-023-SIMILARITY
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Dual Metric String Distance & Neighborhood Frequency Clustered Analyzer
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { CityStreet, DuplicateNameReport, SimilarityMatch } from './types';
import { normalizeArabicText } from './arabic-utils';

/**
 * حساب مسافة ليفنشتاين (Levenshtein Distance) بين سلسلتين نصيتين
 * @param s1 السلسلة الأولى
 * @param s2 السلسلة الثانية
 * @returns عدد العمليات المطلوبة للتحويل
 */
export function calculateLevenshteinDistance(s1: string, s2: string): number {
  const a = normalizeArabicText(s1);
  const b = normalizeArabicText(s2);

  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const row = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) {
    row[j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = row[j]!;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + cost);
      prev = temp;
    }
  }

  return row[b.length] ?? 0;
}

/**
 * حساب نسبة التشابه بين 0 و 1
 * @param s1 النص الأول
 * @param s2 النص الثاني
 * @returns قيمة بين 0 و 1 (1 تطابق تام)
 */
export function calculateStringSimilarity(s1: string, s2: string): number {
  const norm1 = normalizeArabicText(s1);
  const norm2 = normalizeArabicText(s2);

  if (norm1 === norm2) return 1.0;
  const maxLen = Math.max(norm1.length, norm2.length);
  if (maxLen === 0) return 1.0;

  const distance = calculateLevenshteinDistance(norm1, norm2);
  return Math.max(0, 1 - distance / maxLen);
}

/**
 * تحليل شامل لتكرار أسماء الشوارع عبر الأحياء والمناطق
 * @param streets قائمة الشوارع
 * @returns تقرير بأسماء الشوارع المكررة وأماكن وجودها
 */
export function analyzeDuplicateStreetNames(
  streets: readonly CityStreet[],
): readonly DuplicateNameReport[] {
  const nameMap = new Map<string, { originalName: string; list: CityStreet[] }>();

  for (const street of streets) {
    const norm = normalizeArabicText(street.name);
    if (!norm) continue;

    const existing = nameMap.get(norm);
    if (existing) {
      existing.list.push(street);
    } else {
      nameMap.set(norm, { originalName: street.name, list: [street] });
    }
  }

  const reports: DuplicateNameReport[] = [];

  for (const [norm, data] of nameMap.entries()) {
    if (data.list.length > 1) {
      reports.push({
        normalizedName: norm,
        originalName: data.originalName,
        count: data.list.length,
        occurrences: data.list.map((st) => ({
          id: st.id,
          name: st.name,
          city: st.city,
          neighborhood: st.neighborhood,
          region: st.region,
          branchedFrom: st.branchedFrom,
        })),
      });
    }
  }

  // ترتيب التكرارات من الأكثر تكراراً للأقل
  return reports.sort((a, b) => b.count - a.count);
}

/**
 * كشف الأزواج المتشابهة جداً في الأسماء لاكتشاف الأخطاء أو التشابه الحرج
 * @param streets قائمة الشوارع
 * @param threshold عتبة التشابه (افتراضياً 0.7)
 * @returns قائمة بالتطابقات المكتشفة
 */
export function findSimilarStreetPairs(
  streets: readonly CityStreet[],
  threshold = 0.75,
): readonly SimilarityMatch[] {
  const matches: SimilarityMatch[] = [];

  for (let i = 0; i < streets.length; i++) {
    for (let j = i + 1; j < streets.length; j++) {
      const sA = streets[i]!;
      const sB = streets[j]!;

      const score = calculateStringSimilarity(sA.name, sB.name);

      if (score >= threshold) {
        let matchType: SimilarityMatch['matchType'] = 'تشابه طفيف';
        let explanation = '';

        if (score === 1.0) {
          matchType = 'تطابق تام';
          explanation = `تطابق تام في الاسم بين ${sA.neighborhood} و ${sB.neighborhood}`;
        } else if (score >= 0.85) {
          matchType = 'تشابه مرتفع';
          explanation = `تشابه مرتفع جداً (قد يكون خطأ إملائي أو شارع مماثل)`;
        } else {
          matchType = 'تطابق جزئي';
          explanation = `تشابه في جذور الاسم مع اختلاف طفيف`;
        }

        matches.push({
          streetA: sA,
          streetB: sB,
          score: Math.round(score * 100) / 100,
          matchType,
          explanation,
        });
      }
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}
