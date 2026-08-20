/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: macro.test.ts
 * 📂 المسار: packages/algorithms/tests/macro/macro.test.ts
 * 🎯 الهدف الرئيسي: اختبارات شاملة لنظام الماكرو (Types, Recorder, Runner, Registry)
 * 🏷️ المعرف: TEST-ALGO-MACRO
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi } from 'vitest';
import { isMacroDefinition, isMacroStep } from '../../src/macro/types';
import type { MacroDefinition, MacroStep } from '../../src/macro/types';
import { MacroRecorder } from '../../src/macro/recorder';
import { MacroRunner } from '../../src/macro/runner';
import { MacroRegistry, macroRegistry } from '../../src/macro/registry';

// ─── Type Guards ────────────────────────────────────────────────────────────
describe('Type Guards', () => {
  describe('isMacroDefinition', () => {
    it('returns true for valid MacroDefinition', () => {
      const def: MacroDefinition = {
        id: 'test-1',
        name: 'Test Macro',
        domain: 'universal',
        steps: [],
        createdAt: Date.now(),
      };
      expect(isMacroDefinition(def)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isMacroDefinition(null)).toBe(false);
    });

    it('returns false for missing id', () => {
      expect(isMacroDefinition({ name: 'test', domain: 'universal', steps: [], createdAt: 1 })).toBe(false);
    });

    it('returns false for missing name', () => {
      expect(isMacroDefinition({ id: '1', domain: 'universal', steps: [], createdAt: 1 })).toBe(false);
    });

    it('returns false for non-array steps', () => {
      expect(isMacroDefinition({ id: '1', name: 'test', domain: 'universal', steps: 'not-array', createdAt: 1 })).toBe(false);
    });
  });

  describe('isMacroStep', () => {
    it('returns true for valid MacroStep', () => {
      const step: MacroStep = {
        commandType: 'move',
        payload: { x: 10 },
        timestamp: Date.now(),
      };
      expect(isMacroStep(step)).toBe(true);
    });

    it('returns false for null', () => {
      expect(isMacroStep(null)).toBe(false);
    });

    it('returns false for missing commandType', () => {
      expect(isMacroStep({ payload: {}, timestamp: 1 })).toBe(false);
    });

    it('returns false for missing payload', () => {
      expect(isMacroStep({ commandType: 'move', timestamp: 1 })).toBe(false);
    });
  });
});

// ─── MacroRecorder ──────────────────────────────────────────────────────────
describe('MacroRecorder', () => {
  it('starts in idle state', () => {
    const recorder = new MacroRecorder();
    expect(recorder.getState()).toBe('idle');
    expect(recorder.isRecording()).toBe(false);
    expect(recorder.isPaused()).toBe(false);
  });

  it('starts recording', () => {
    const recorder = new MacroRecorder();
    recorder.start('Test');
    expect(recorder.getState()).toBe('recording');
    expect(recorder.isRecording()).toBe(true);
  });

  it('throws on empty name', () => {
    const recorder = new MacroRecorder();
    expect(() => recorder.start('')).toThrow('Macro name is required');
  });

  it('records steps', () => {
    const recorder = new MacroRecorder();
    recorder.start('Test');
    const result = recorder.recordStep('move', { x: 10 });
    expect(result).toBe(true);
    expect(recorder.getRecordedSteps()).toHaveLength(1);
  });

  it('returns false when not recording', () => {
    const recorder = new MacroRecorder();
    const result = recorder.recordStep('move', { x: 10 });
    expect(result).toBe(false);
  });

  it('respects maxSteps limit', () => {
    const recorder = new MacroRecorder({ maxSteps: 2 });
    recorder.start('Test');
    recorder.recordStep('move', { x: 1 });
    recorder.recordStep('move', { x: 2 });
    const result = recorder.recordStep('move', { x: 3 });
    expect(result).toBe(false);
    expect(recorder.getRecordedSteps()).toHaveLength(2);
  });

  it('pauses and resumes', () => {
    const recorder = new MacroRecorder();
    recorder.start('Test');
    recorder.pause();
    expect(recorder.getState()).toBe('paused');
    expect(recorder.isPaused()).toBe(true);
    recorder.resume();
    expect(recorder.getState()).toBe('recording');
  });

  it('does not record when paused', () => {
    const recorder = new MacroRecorder();
    recorder.start('Test');
    recorder.pause();
    const result = recorder.recordStep('move', { x: 10 });
    expect(result).toBe(false);
  });

  it('stops and returns MacroDefinition', () => {
    const recorder = new MacroRecorder();
    recorder.start('Test', 'calc', 'A test macro');
    recorder.recordStep('move', { x: 10 });
    const def = recorder.stop();
    expect(def.id).toMatch(/^macro_/);
    expect(def.name).toBe('Test');
    expect(def.domain).toBe('calc');
    expect(def.description).toBe('A test macro');
    expect(def.steps).toHaveLength(1);
    expect(recorder.getState()).toBe('idle');
  });

  it('throws on stop when idle', () => {
    const recorder = new MacroRecorder();
    expect(() => recorder.stop()).toThrow('Recorder is not active');
  });

  it('cancels recording', () => {
    const recorder = new MacroRecorder();
    recorder.start('Test');
    recorder.recordStep('move', { x: 10 });
    recorder.cancel();
    expect(recorder.getState()).toBe('idle');
    expect(recorder.getRecordedSteps()).toHaveLength(0);
  });
});

// ─── MacroRunner ────────────────────────────────────────────────────────────
describe('MacroRunner', () => {
  const createMacro = (steps: MacroStep[]): MacroDefinition => ({
    id: 'test-1',
    name: 'Test Macro',
    domain: 'universal',
    steps,
    createdAt: Date.now(),
  });

  it('runs a simple macro', async () => {
    const macro = createMacro([
      { commandType: 'move', payload: { x: 10 }, timestamp: 0 },
      { commandType: 'resize', payload: { w: 100 }, timestamp: 10 },
    ]);
    const dispatcher = vi.fn().mockResolvedValue(true);
    const runner = new MacroRunner();
    const result = await runner.run(macro, dispatcher);
    expect(result.success).toBe(true);
    expect(result.stepsExecuted).toBe(2);
    expect(dispatcher).toHaveBeenCalledTimes(2);
  });

  it('stops on error when stopOnError is true', async () => {
    const macro = createMacro([
      { commandType: 'move', payload: {}, timestamp: 0 },
      { commandType: 'fail', payload: {}, timestamp: 10 },
    ]);
    const dispatcher = vi.fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    const runner = new MacroRunner();
    const result = await runner.run(macro, dispatcher, { stopOnError: true });
    expect(result.success).toBe(false);
    expect(result.stepsExecuted).toBe(1);
  });

  it('respects timeout', async () => {
    const macro = createMacro([
      { commandType: 'slow', payload: {}, timestamp: 0 },
      { commandType: 'slow2', payload: {}, timestamp: 1 },
    ]);
    const dispatcher = vi.fn().mockImplementation(() => new Promise<boolean>(resolve => setTimeout(() => resolve(true), 50)));
    const runner = new MacroRunner();
    const result = await runner.run(macro, dispatcher, { timeoutMs: 10 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('timed out');
  });

  it('respects maxSteps', async () => {
    const macro = createMacro([
      { commandType: 'a', payload: {}, timestamp: 0 },
      { commandType: 'b', payload: {}, timestamp: 0 },
      { commandType: 'c', payload: {}, timestamp: 0 },
    ]);
    const dispatcher = vi.fn().mockResolvedValue(true);
    const runner = new MacroRunner();
    const result = await runner.run(macro, dispatcher, { maxSteps: 2 });
    expect(result.success).toBe(false);
    expect(result.stepsExecuted).toBe(2);
  });

  it('interpolates parameters in payload', async () => {
    const macro = createMacro([
      { commandType: 'move', payload: { x: '{{dx}}', y: '{{dy}}' }, timestamp: 0 },
    ]);
    const dispatcher = vi.fn().mockResolvedValue(true);
    const runner = new MacroRunner();
    await runner.run(macro, dispatcher, { parameters: { dx: 10, dy: 20 } });
    expect(dispatcher).toHaveBeenCalledWith('move', { x: '10', y: '20' }, undefined);
  });

  it('handles dispatcher exceptions', async () => {
    const macro = createMacro([
      { commandType: 'crash', payload: {}, timestamp: 0 },
    ]);
    const dispatcher = vi.fn().mockRejectedValue(new Error('boom'));
    const runner = new MacroRunner();
    const result = await runner.run(macro, dispatcher, { stopOnError: true });
    expect(result.success).toBe(false);
    expect(result.error).toContain('boom');
  });
});

// ─── MacroRegistry ──────────────────────────────────────────────────────────
describe('MacroRegistry', () => {
  const createMacro = (id: string, domain = 'universal'): MacroDefinition => ({
    id,
    name: `Macro ${id}`,
    domain: domain as MacroDefinition['domain'],
    steps: [],
    createdAt: Date.now(),
  });

  it('registers and retrieves macros', () => {
    const registry = new MacroRegistry();
    const macro = createMacro('m1');
    registry.register(macro);
    expect(registry.get('m1')).not.toBeNull();
    expect(registry.get('m1')?.name).toBe('Macro m1');
  });

  it('returns null for unknown id', () => {
    const registry = new MacroRegistry();
    expect(registry.get('unknown')).toBeNull();
  });

  it('checks existence', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1'));
    expect(registry.has('m1')).toBe(true);
    expect(registry.has('m2')).toBe(false);
  });

  it('deletes macros', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1'));
    expect(registry.delete('m1')).toBe(true);
    expect(registry.has('m1')).toBe(false);
  });

  it('filters by domain', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1', 'calc'));
    registry.register(createMacro('m2', 'writer'));
    registry.register(createMacro('m3', 'universal'));
    const calc = registry.getByDomain('calc');
    expect(calc).toHaveLength(2); // m1 + universal
  });

  it('returns all macros', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1'));
    registry.register(createMacro('m2'));
    expect(registry.getAll()).toHaveLength(2);
  });

  it('exports and imports JSON', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1'));
    registry.register(createMacro('m2'));
    const json = registry.exportJson();
    const registry2 = new MacroRegistry();
    const count = registry2.importJson(json);
    expect(count).toBe(2);
    expect(registry2.getAll()).toHaveLength(2);
  });

  it('throws on invalid import', () => {
    const registry = new MacroRegistry();
    expect(() => registry.importJson('not-json')).toThrow();
  });

  it('clears all macros', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1'));
    registry.clear();
    expect(registry.getAll()).toHaveLength(0);
  });

  it('throws on invalid macro definition', () => {
    const registry = new MacroRegistry();
    expect(() => registry.register({} as MacroDefinition)).toThrow('Invalid macro definition');
  });

  it('returns deep copies', () => {
    const registry = new MacroRegistry();
    registry.register(createMacro('m1'));
    const copy1 = registry.get('m1');
    const copy2 = registry.get('m1');
    expect(copy1).not.toBe(copy2);
  });
});
