/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-arabic.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/functions-arabic.test.ts
 * 🎯 الهدف الرئيسي: اختبارات وحدة شاملة لدوال معالجة النصوص والتفقيط المالي العربي
 * 📋 المعايير: تغطية 100%، اختبار العملات، الأعداد المركبة، التشكيل، التطبيع، الأرقام
 * 🏷️ المعرف: TEST-ALGO-013
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  TAFQEET,
  STRIP_TASHKEEL,
  NORMALIZE_ARABIC,
  TO_ARABIC_NUMERALS,
  TO_WESTERN_NUMERALS,
  ARABIC_LEN,
  ARABIC_MATCH,
} from '../../src/formula/functions-arabic';

describe('ALGO-013: Arabic Functions & Tafqeet', () => {
  describe('TAFQEET (Financial & General Number to Arabic Words)', () => {
    it('handles zero correctly', () => {
      expect(TAFQEET(0)).toBe('صفر');
    });

    it('converts basic single & two digits', () => {
      expect(TAFQEET(1, '', '', '')).toBe('واحد');
      expect(TAFQEET(2, '', '', '')).toBe('اثنان');
      expect(TAFQEET(15, '', '', '')).toBe('خمسة عشر');
      expect(TAFQEET(20, '', '', '')).toBe('عشرون');
      expect(TAFQEET(99, '', '', '')).toBe('تسعة وتسعون');
    });

    it('converts hundreds and thousands', () => {
      expect(TAFQEET(100, '', '', '')).toBe('مائة');
      expect(TAFQEET(250, '', '', '')).toBe('مائتان وخمسون');
      expect(TAFQEET(1000, '', '', '')).toBe('ألف');
      expect(TAFQEET(2000, '', '', '')).toBe('ألفان');
      expect(TAFQEET(5000, '', '', '')).toBe('خمسة آلاف');
      expect(TAFQEET(15420, '', '', '')).toBe('خمسة عشر ألفاً وأربعمائة وعشرون');
    });

    it('converts millions and billions', () => {
      expect(TAFQEET(1000000, '', '', '')).toBe('مليون');
      expect(TAFQEET(2000000, '', '', '')).toBe('مليونان');
      expect(TAFQEET(3000000, '', '', '')).toBe('ثلاثة ملايين');
      expect(TAFQEET(1000000000, '', '', '')).toBe('مليار');
    });

    it('formats with Arabic currencies and subunits', () => {
      // SAR
      expect(TAFQEET(1500, 'SAR', 'فقط', 'لا غير')).toBe('فقط ألف وخمسمائة ريال سعودي لا غير');
      expect(TAFQEET(2, 'SAR', 'فقط', 'لا غير')).toBe('فقط ريالان سعوديان لا غير');
      expect(TAFQEET(5, 'SAR', 'فقط', 'لا غير')).toBe('فقط خمسة ريالات سعودية لا غير');
      expect(TAFQEET(100.5, 'SAR', 'فقط', 'لا غير')).toBe('فقط مائة ريال سعودي وخمسون هللة لا غير');

      // EGP
      expect(TAFQEET(250.75, 'EGP', 'المبلغ:', 'فقط')).toBe(
        'المبلغ: مائتان وخمسون جنيه مصري وخمسة وسبعون قرش فقط',
      );

      // KWD (3 decimals)
      expect(TAFQEET(120.25, 'KWD', '', '')).toBe('مائة وعشرون دينار كويتي ومائتان وخمسون فلس');
    });

    it('handles negative numbers', () => {
      expect(TAFQEET(-500, 'SAR', '', '')).toBe('سالب خمسمائة ريال سعودي');
    });

    it('returns empty string for invalid numbers', () => {
      expect(TAFQEET('invalid')).toBe('');
    });
  });

  describe('STRIP_TASHKEEL', () => {
    it('removes fatha, damma, kasra, tanwin, shadda, and sukoon', () => {
      const textWithTashkeel = 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ';
      const clean = STRIP_TASHKEEL(textWithTashkeel);
      expect(clean).toBe('الله لا إله إلا هو الحي القيوم');
    });

    it('removes kashida / tatweel', () => {
      expect(STRIP_TASHKEEL('مــحــمــد')).toBe('محمد');
    });

    it('handles null or undefined gracefully', () => {
      expect(STRIP_TASHKEEL(null)).toBe('');
      expect(STRIP_TASHKEEL(undefined)).toBe('');
    });
  });

  describe('NORMALIZE_ARABIC', () => {
    it('normalizes alef variants and yaa', () => {
      const raw = 'أحمد وإبراهيم وآمنة هدى';
      const normalized = NORMALIZE_ARABIC(raw);
      expect(normalized).toBe('احمد وابراهيم وامنه هدي'.replace('امنه', 'امنة')); // taa preserved by default
    });

    it('normalizes taa marbuta when requested', () => {
      expect(NORMALIZE_ARABIC('مكتبة', true)).toBe('مكتبه');
    });
  });

  describe('Numeral Conversions (TO_ARABIC_NUMERALS & TO_WESTERN_NUMERALS)', () => {
    it('converts Western numbers to Eastern Arabic numerals', () => {
      expect(TO_ARABIC_NUMERALS('رقم الهاتف 0501234567')).toBe('رقم الهاتف ٠٥٠١٢٣٤٥٦٧');
      expect(TO_ARABIC_NUMERALS(2026)).toBe('٢٠٢٦');
    });

    it('converts Eastern Arabic and Persian numerals to Western digits', () => {
      expect(TO_WESTERN_NUMERALS('المجموع: ١٤٥٠ ريال')).toBe('المجموع: 1450 ريال');
      expect(TO_WESTERN_NUMERALS('تاریخ: ۱۳۸۰')).toBe('تاریخ: 1380');
    });
  });

  describe('ARABIC_LEN', () => {
    it('calculates length excluding tashkeel by default', () => {
      const withTashkeel = 'كِتَابٌ';
      expect(ARABIC_LEN(withTashkeel)).toBe(4); // ك ت ا ب
      expect(ARABIC_LEN(withTashkeel, false)).toBe(7); // with 3 diacritics
    });
  });

  describe('ARABIC_MATCH', () => {
    it('matches Arabic names ignoring tashkeel, hamza variants, and taa marbuta', () => {
      expect(ARABIC_MATCH('أحمد', 'احمد')).toBe(true);
      expect(ARABIC_MATCH('إسماعيل', 'اسماعيل')).toBe(true);
      expect(ARABIC_MATCH('فاطمة', 'فاطمه')).toBe(true);
      expect(ARABIC_MATCH('مُحَمَّد', 'محمد')).toBe(true);
      expect(ARABIC_MATCH('هدى', 'هدي')).toBe(true);
    });

    it('supports partial matching for search queries', () => {
      expect(ARABIC_MATCH('مؤسسة الأمل للتجارة', 'الأمل', true)).toBe(true);
      expect(ARABIC_MATCH('مؤسسة الأمل للتجارة', 'الامل', true)).toBe(true);
      expect(ARABIC_MATCH('سارة إبراهيم', 'ابراهيم', true)).toBe(true);
      expect(ARABIC_MATCH('سارة إبراهيم', 'خالد', true)).toBe(false);
    });
  });
});
