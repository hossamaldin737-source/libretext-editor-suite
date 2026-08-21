/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: functions-text.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/functions-text.test.ts
 * 🎯 الهدف الرئيسي: اختبارات وحدة شاملة لدوال النصوص المعيارية
 * 📋 المعايير: تغطية 100%، اختبار الفراغات، الحالات الحدية، الترقيم 1-based
 * 🏷️ المعرف: TEST-ALGO-014
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  TRIM,
  CLEAN,
  LEFT,
  RIGHT,
  MID,
  LEN,
  LOWER,
  UPPER,
  PROPER,
  SUBSTITUTE,
  REPLACE,
  TEXTJOIN,
  EXACT,
  REPT,
} from '../../src/formula/functions-text';

describe('ALGO-014: Standard Text Functions', () => {
  describe('TRIM & CLEAN', () => {
    it('trims leading, trailing and duplicate spaces', () => {
      expect(TRIM('   مرحبا    بك   في   محررنا   ')).toBe('مرحبا بك في محررنا');
    });

    it('cleans non-printable control characters', () => {
      expect(CLEAN('Hello\x00\x08World\x1F')).toBe('HelloWorld');
    });
  });

  describe('LEFT, RIGHT, MID, LEN', () => {
    it('extracts characters from LEFT', () => {
      expect(LEFT('LibreText', 5)).toBe('Libre');
      expect(LEFT('الرياض', 2)).toBe('ال');
      expect(LEFT('Test')).toBe('T');
    });

    it('extracts characters from RIGHT', () => {
      expect(RIGHT('LibreText', 4)).toBe('Text');
      expect(RIGHT('القاهرة', 3)).toBe('هرة');
    });

    it('extracts substring using 1-based MID', () => {
      expect(MID('LibreText', 6, 4)).toBe('Text');
      expect(MID('عبد الرحمن', 5, 6)).toBe('الرحمن');
    });

    it('calculates correct LEN with unicode support', () => {
      expect(LEN('Hello')).toBe(5);
      expect(LEN('مرحبا')).toBe(5);
      expect(LEN('🚀🎉')).toBe(2);
    });
  });

  describe('Case Transformations (LOWER, UPPER, PROPER)', () => {
    it('converts to LOWER and UPPER', () => {
      expect(LOWER('LibreText Suite')).toBe('libretext suite');
      expect(UPPER('LibreText Suite')).toBe('LIBRETEXT SUITE');
    });

    it('converts to PROPER case', () => {
      expect(PROPER('hello world from libretext')).toBe('Hello World From Libretext');
    });
  });

  describe('SUBSTITUTE & REPLACE', () => {
    it('substitutes all occurrences by default', () => {
      expect(SUBSTITUTE('2025/01/01', '/', '-')).toBe('2025-01-01');
      expect(SUBSTITUTE('مرحبا بكم، أهلاً بكم', 'بكم', 'بالجميع')).toBe(
        'مرحبا بالجميع، أهلاً بالجميع',
      );
    });

    it('substitutes specific instance when provided', () => {
      expect(SUBSTITUTE('A-B-C-D', '-', ':', 2)).toBe('A-B:C-D');
    });

    it('replaces by position and length', () => {
      expect(REPLACE('ABCDEF', 3, 2, '1234')).toBe('AB1234EF');
      expect(REPLACE('تقرير عام 2024', 11, 4, '2026')).toBe('تقرير عام 2026');
    });
  });

  describe('TEXTJOIN, EXACT, REPT', () => {
    it('joins text with delimiter and ignores empty strings', () => {
      expect(TEXTJOIN(' - ', true, 'أحمد', '', 'محمد', 'علي')).toBe('أحمد - محمد - علي');
      expect(TEXTJOIN(', ', false, ['A', '', 'B'])).toBe('A, , B');
    });

    it('performs EXACT case-sensitive comparison', () => {
      expect(EXACT('Libre', 'Libre')).toBe(true);
      expect(EXACT('Libre', 'libre')).toBe(false);
      expect(EXACT('مصر', 'مصر')).toBe(true);
    });

    it('repeats text with REPT', () => {
      expect(REPT('*-', 3)).toBe('*-*-*-');
    });
  });
});
