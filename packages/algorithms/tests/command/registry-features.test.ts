/**
  * ═══════════════════════════════════════════════════════════════════════════
  * 📌 ملخص توجيهي | Guiding Summary
  * ═══════════════════════════════════════════════════════════════════════════
  * 📄 الملف: registry-features.test.ts
  * 📂 المسار: packages/algorithms/tests/command/registry-features.test.ts
  * 🎯 الهدف الرئيسي: اختبار canExecute + isEnabled + on() في CommandRegistry
  * 📋 المعايير: تغطية 100% لجميع الفروع الحدية
  * 🏷️ المعرف: TEST-ALGO-003-FEAT
  * 📅 تاريخ الإنشاء: 2026-08-19
  * ═══════════════════════════════════════════════════════════════════════════
  * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
  * ⚖️ الترخيص: MIT License
  * ═══════════════════════════════════════════════════════════════════════════
  */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CommandRegistry,
  createCommandRegistry,
  type StateCommandHandler,
  type CommandEvent,
} from '../../src/command/registry';
import { CommandType, SpatialCommand } from '../../src/command/types';
import type { EditorState } from '@libretext/core';

describe('ALGO-003: CommandRegistry Features', () => {
  let registry: CommandRegistry;
  const mockState = { doc: { id: 'root' } } as unknown as EditorState;

  const spatialCmd: SpatialCommand = {
    type: CommandType.SPATIAL,
    targetId: 'node-1',
    payload: { timestamp: Date.now(), x: 5, y: 10 }
  };

  const handler: StateCommandHandler = (_cmd, state) => ({
    ...state,
    handled: true
  } as unknown as EditorState);

  beforeEach(() => {
    registry = createCommandRegistry();
  });

  describe('canExecute', () => {
    it('returns false when no handler registered', () => {
      expect(registry.canExecute(spatialCmd, mockState)).toBe(false);
    });

    it('returns true when handler registered with no guards', () => {
      registry.register(CommandType.SPATIAL, handler);
      expect(registry.canExecute(spatialCmd, mockState)).toBe(true);
    });

    it('returns true when canExecute returns true', () => {
      registry.register(CommandType.SPATIAL, handler, {
        canExecute: () => true
      });
      expect(registry.canExecute(spatialCmd, mockState)).toBe(true);
    });

    it('returns false when canExecute returns false', () => {
      registry.register(CommandType.SPATIAL, handler, {
        canExecute: () => false
      });
      expect(registry.canExecute(spatialCmd, mockState)).toBe(false);
    });

    it('returns false when isEnabled returns false', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => false
      });
      expect(registry.canExecute(spatialCmd, mockState)).toBe(false);
    });

    it('returns false when canExecute throws', () => {
      registry.register(CommandType.SPATIAL, handler, {
        canExecute: () => { throw new Error('boom'); }
      });
      expect(registry.canExecute(spatialCmd, mockState)).toBe(false);
    });
  });

  describe('isEnabled', () => {
    it('returns false when no handler registered', () => {
      expect(registry.isEnabled(spatialCmd, mockState)).toBe(false);
    });

    it('returns true when no isEnabled guard', () => {
      registry.register(CommandType.SPATIAL, handler);
      expect(registry.isEnabled(spatialCmd, mockState)).toBe(true);
    });

    it('returns true when isEnabled returns true', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => true
      });
      expect(registry.isEnabled(spatialCmd, mockState)).toBe(true);
    });

    it('returns false when isEnabled returns false', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => false
      });
      expect(registry.isEnabled(spatialCmd, mockState)).toBe(false);
    });

    it('returns false when isEnabled throws', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => { throw new Error('crash'); }
      });
      expect(registry.isEnabled(spatialCmd, mockState)).toBe(false);
    });
  });

  describe('dispatch with isEnabled guard', () => {
    it('dispatches when isEnabled returns true', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => true
      });
      const result = registry.dispatch(spatialCmd, mockState);
      expect((result as any).handled).toBe(true);
    });

    it('throws when isEnabled returns false', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => false
      });
      expect(() => registry.dispatch(spatialCmd, mockState)).toThrow(
        'is disabled'
      );
    });
  });

  describe('on() event callbacks', () => {
    it('calls listener on dispatch (before + after)', () => {
      registry.register(CommandType.SPATIAL, handler);
      const events: CommandEvent[] = [];
      registry.on((e) => events.push(e));

      registry.dispatch(spatialCmd, mockState);

      expect(events).toHaveLength(2);
      expect(events[0]!.type).toBe('before');
      expect(events[1]!.type).toBe('after');
      expect(events[0]!.command.type).toBe(CommandType.SPATIAL);
    });

    it('does not call listener when dispatch throws', () => {
      const events: CommandEvent[] = [];
      registry.on((e) => events.push(e));

      expect(() => registry.dispatch(spatialCmd, mockState)).toThrow();
      expect(events).toHaveLength(0);
    });

    it('does not call listener when isEnabled blocks dispatch', () => {
      registry.register(CommandType.SPATIAL, handler, {
        isEnabled: () => false
      });
      const events: CommandEvent[] = [];
      registry.on((e) => events.push(e));

      expect(() => registry.dispatch(spatialCmd, mockState)).toThrow();
      expect(events).toHaveLength(0);
    });

    it('unsubscribe removes listener', () => {
      registry.register(CommandType.SPATIAL, handler);
      const events: CommandEvent[] = [];
      const unsub = registry.on((e) => events.push(e));

      registry.dispatch(spatialCmd, mockState);
      expect(events).toHaveLength(2);

      unsub();
      registry.dispatch(spatialCmd, mockState);
      expect(events).toHaveLength(2);
    });

    it('swallows listener errors without crashing', () => {
      registry.register(CommandType.SPATIAL, handler);
      const badListener = () => { throw new Error('listener crash'); };
      const goodEvents: CommandEvent[] = [];

      registry.on(badListener);
      registry.on((e) => goodEvents.push(e));

      expect(() => registry.dispatch(spatialCmd, mockState)).not.toThrow();
      expect(goodEvents).toHaveLength(2);
    });
  });

  describe('get()', () => {
    it('returns handler for registered type', () => {
      registry.register(CommandType.SPATIAL, handler);
      expect(registry.get(CommandType.SPATIAL)).toBe(handler);
    });

    it('returns undefined for unregistered type', () => {
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });
});
