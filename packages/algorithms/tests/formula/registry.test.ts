/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.test.ts
 * 📂 المسار: packages/algorithms/tests/formula/registry.test.ts
 * 🎯 الهدف الرئيسي: اختبار سجل الدوال و registerOrReplace
 * 📋 المعايير: تغطية 100%
 * 🏷️ المعرف: TEST-ALGO-012
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  FunctionRegistry,
  createFunctionRegistry,
  getDefaultFunctionRegistry,
  getBuiltinFunction,
} from '../../src/formula/registry';

describe('ALGO-012: FunctionRegistry', () => {
  it('registers and retrieves functions case-insensitively', () => {
    const registry = new FunctionRegistry();
    registry.register('myFunc', () => 42);
    expect(registry.has('MYFUNC')).toBe(true);
    expect(registry.get('myfunc')!()).toBe(42);
  });

  it('lists registered functions', () => {
    const registry = new FunctionRegistry();
    registry.register('FN1', () => 1);
    registry.register('FN2', () => 2);
    expect(registry.list()).toEqual(['FN1', 'FN2']);
  });

  it('default registry contains standard functions', () => {
    const registry = getDefaultFunctionRegistry();
    expect(registry.has('SUM')).toBe(true);
    expect(registry.has('AVERAGE')).toBe(true);
    expect(registry.has('IF')).toBe(true);
    expect(getBuiltinFunction('SUM')).toBeDefined();
  });
});

describe('ALGO-012 v2: registerOrReplace', () => {
  it('register throws on duplicate', () => {
    const registry = createFunctionRegistry();
    expect(() => registry.register('SUM', () => 0)).toThrow('already registered');
  });

  it('registerOrReplace allows duplicate', () => {
    const registry = createFunctionRegistry();
    registry.registerOrReplace('SUM', () => 999);
    expect(registry.get('SUM')!()).toBe(999);
  });

  it('registerOrReplace adds new function', () => {
    const registry = createFunctionRegistry();
    registry.registerOrReplace('CUSTOM', (x: number) => x * 3);
    expect(registry.get('CUSTOM')!(5)).toBe(15);
  });

  it('registerBuiltins returns this for chaining', () => {
    const registry = new FunctionRegistry();
    const result = registry.registerBuiltins();
    expect(result).toBe(registry);
  });
});
