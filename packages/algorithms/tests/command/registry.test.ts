/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: registry.test.ts
  * 📂 المسار: packages/algorithms/tests/command/registry.test.ts
  * 🎯 الهدف الرئيسي: اختبار سجل الأوامر (التسجيل، الفحص، التوجيه)
  * 📋 المعايير: تغطية >= 95%، اختبار جميع الحالات والحالات الحدّية
  * 🧪 الاختبارات: هذا الملف هو ملف الاختبار
  * 🏷️ المعرف: TEST-ALGO-003
  * 📅 تاريخ الإنشاء: 2026-08-19
  * ═══════════════════════════════════════════════════════════════════════════
  * 🧠 الطريقة المبتكرة | Innovative Pattern:
  *    Registry Behavior Verification + Edge Case Coverage
  * ═══════════════════════════════════════════════════════════════════════════
  * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
  *    1. التأكد من رفض التسجيل المكرر
  *    2. التأكد من رمي خطأ عند توجيه أمر بلا معالج
  * ═══════════════════════════════════════════════════════════════════════════
  * 🩹 البرمجة الدفاعية | Defensive Coding:
  *    - اختبار المدخلات غير الصالحة
  *    - التحقق من الرسائل المرمية
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * 📚 المصادر المقتبسة: Vitest (MIT)
  * ═══════════════════════════════════════════════════════════════════════════
  */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CommandRegistry,
  createCommandRegistry,
  registerCommand,
  unregisterCommand,
  dispatchCommand,
  getDefaultRegistry,
  StateCommandHandler
} from '../../src/command/registry';
import { CommandType, SpatialCommand } from '../../src/command/types';
import type { EditorState } from '@libretext/core';

describe('ALGO-003: CommandRegistry', () => {
  let registry: CommandRegistry;
  const mockState = { doc: { id: 'root' } } as unknown as EditorState;

  const spatialCmd: SpatialCommand = {
    type: CommandType.SPATIAL,
    targetId: 'node-1',
    payload: { timestamp: Date.now(), x: 5, y: 10 }
  };

  const mockHandler: StateCommandHandler = (cmd, state) => ({
    ...state,
    handled: cmd.type
  } as unknown as EditorState);

  beforeEach(() => {
    registry = createCommandRegistry();
  });

  it('should create an empty registry', () => {
    expect(registry.list()).toHaveLength(0);
  });

  it('should register a handler and list it', () => {
    registry.register(CommandType.SPATIAL, mockHandler);
    expect(registry.has(CommandType.SPATIAL)).toBe(true);
    expect(registry.list()).toContain(CommandType.SPATIAL);
  });

  it('should return the registered handler via get', () => {
    registry.register(CommandType.SPATIAL, mockHandler);
    expect(registry.get(CommandType.SPATIAL)).toBe(mockHandler);
  });

  it('should throw when registering an empty type', () => {
    expect(() => registry.register('', mockHandler)).toThrow(
      'Command type must be a non-empty string'
    );
  });

  it('should throw when registering a non-function handler', () => {
    expect(() =>
      registry.register(CommandType.SPATIAL, null as unknown as StateCommandHandler)
    ).toThrow('Command handler must be a function');
  });

  it('should throw when registering a duplicate type', () => {
    registry.register(CommandType.SPATIAL, mockHandler);
    expect(() =>
      registry.register(CommandType.SPATIAL, mockHandler)
    ).toThrow('already registered');
  });

  it('should unregister a handler', () => {
    registry.register(CommandType.SPATIAL, mockHandler);
    expect(registry.unregister(CommandType.SPATIAL)).toBe(true);
    expect(registry.has(CommandType.SPATIAL)).toBe(false);
  });

  it('should return false when unregistering a non-existent type', () => {
    expect(registry.unregister('unknown')).toBe(false);
  });

  it('should dispatch to the correct handler', () => {
    registry.register(CommandType.SPATIAL, mockHandler);
    const newState = registry.dispatch(spatialCmd, mockState);
    expect((newState as any).handled).toBe(CommandType.SPATIAL);
  });

  it('should throw when dispatching without a registered handler', () => {
    expect(() => registry.dispatch(spatialCmd, mockState)).toThrow(
      'No handler registered for command type'
    );
  });

  it('should support multiple handlers for different types', () => {
    const textHandler: StateCommandHandler = (cmd, state) => state;
    registry.register(CommandType.SPATIAL, mockHandler);
    registry.register(CommandType.TEXT, textHandler);
    expect(registry.list()).toHaveLength(2);
  });
});

describe('ALGO-003: Default Registry API', () => {
  const mockState = { doc: { id: 'root' } } as unknown as EditorState;

  const spatialCmd: SpatialCommand = {
    type: CommandType.SPATIAL,
    targetId: 'node-1',
    payload: { timestamp: Date.now(), x: 1, y: 2 }
  };

  const handler: StateCommandHandler = (cmd, state) => ({
    ...state,
    viaDefault: true
  } as unknown as EditorState);

  beforeEach(() => {
    // تنظيف السجل الافتراضي بين الاختبارات
    const reg = getDefaultRegistry();
    for (const type of reg.list()) {
      reg.unregister(type);
    }
  });

  it('should register via registerCommand (ALGO-CMD-004)', () => {
    registerCommand(CommandType.SPATIAL, handler);
    expect(getDefaultRegistry().has(CommandType.SPATIAL)).toBe(true);
  });

  it('should dispatch via dispatchCommand', () => {
    registerCommand(CommandType.SPATIAL, handler);
    const newState = dispatchCommand(spatialCmd, mockState);
    expect((newState as any).viaDefault).toBe(true);
  });

  it('should unregister via unregisterCommand', () => {
    registerCommand(CommandType.SPATIAL, handler);
    expect(unregisterCommand(CommandType.SPATIAL)).toBe(true);
    expect(getDefaultRegistry().has(CommandType.SPATIAL)).toBe(false);
  });
});
