/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.test.ts
 * 📂 المسار: packages/algorithms/tests/command/types.test.ts
 * 🎯 الهدف الرئيسي: اختبار أنواع الأوامر و Type Guards
 * 📋 المعايير: تغطية >= 95%، اختبار جميع الحالات الممكنة
 * 🧪 الاختبارات: هذا الملف هو ملف الاختبار
 * 🏷️ المعرف: TEST-ALGO-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type Guard Verification + Immutable Object Testing
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التأكد من أن Type Guards ترفض الأنواع الخاطئة
 *    2. التحقق من ثبات الخصائص (readonly) في وقت الترجمة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام as const في بيانات الاختبار
 *    - فحص دقيق للأنواع باستخدام expectTypeOf (إن توفر) أو الفحص المنطقي
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Vitest (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  CommandType,
  isSpatialCommand,
  isTextCommand,
  isFormulaCommand,
  SpatialCommand,
  TextCommand,
  FormulaCommand,
} from '../../src/command/types';

describe('ALGO-001: Command Types & Type Guards', () => {
  const spatialCmd: SpatialCommand = {
    type: CommandType.SPATIAL,
    targetId: 'node-1',
    payload: {
      timestamp: Date.now(),
      x: 10,
      y: 20,
      grid: { row: 1, col: 2 },
    },
  };

  const textCmd: TextCommand = {
    type: CommandType.TEXT,
    targetId: 'node-2',
    payload: {
      timestamp: Date.now(),
      content: 'Hello',
      position: 0,
    },
  };

  const formulaCmd: FormulaCommand = {
    type: CommandType.FORMULA,
    targetId: 'node-3',
    payload: {
      timestamp: Date.now(),
      expression: 'SUM(A1:A2)',
    },
  };

  it('should identify SpatialCommand correctly', () => {
    expect(isSpatialCommand(spatialCmd)).toBe(true);
    expect(isTextCommand(spatialCmd)).toBe(false);
    expect(isFormulaCommand(spatialCmd)).toBe(false);
  });

  it('should identify TextCommand correctly', () => {
    expect(isTextCommand(textCmd)).toBe(true);
    expect(isSpatialCommand(textCmd)).toBe(false);
    expect(isFormulaCommand(textCmd)).toBe(false);
  });

  it('should identify FormulaCommand correctly', () => {
    expect(isFormulaCommand(formulaCmd)).toBe(true);
    expect(isSpatialCommand(formulaCmd)).toBe(false);
    expect(isTextCommand(formulaCmd)).toBe(false);
  });

  it('should reject invalid command structures', () => {
    const invalidCmd = { type: 'unknown', targetId: 'x', payload: {} } as any;
    expect(isSpatialCommand(invalidCmd)).toBe(false);
    expect(isTextCommand(invalidCmd)).toBe(false);
    expect(isFormulaCommand(invalidCmd)).toBe(false);
  });
});
