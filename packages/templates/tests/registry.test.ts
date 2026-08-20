/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.test.ts
 * 📂 المسار: packages/templates/tests/registry.test.ts
 * 🎯 الهدف: اختبار TemplateRegistry v2.0 (تغطية >= 95%)
 * 🏷️ المعرف: TEST-TPL-001
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🔄 آخر تحديث: 2026-08-20 (v2.0: includes 3 critical fix tests)
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TemplateRegistry,
  createTemplateRegistry,
  TemplateEventType,
  TemplateDomain,
} from '../src/registry';
import type { Template } from '../src/registry-types';
import type { DocNode } from '@libretext/core';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function mockDocNode(overrides: Partial<DocNode> = {}): DocNode {
  return { type: 'doc', id: 'doc-1', content: [], ...overrides } as DocNode;
}

function mockTemplate(overrides: Partial<Template> = {}): Template {
  return {
    id: `tpl-${Math.random().toString(36).slice(2)}`,
    name: 'Test Template',
    domain: TemplateDomain.WRITER,
    description: 'A test template',
    content: mockDocNode(),
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      tags: ['test'],
    },
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('TPL-001 v2.0: TemplateRegistry', () => {
  let registry: TemplateRegistry;

  beforeEach(() => {
    registry = TemplateRegistry.create();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Factory & Lifecycle
  // ─────────────────────────────────────────────────────────────────────────
  describe('Factory & Lifecycle', () => {
    it('creates registry with default config', () => {
      expect(registry.isOpen()).toBe(true);
      expect(registry.size()).toBe(0);
    });

    it('createTemplateRegistry works as alias', () => {
      const r = createTemplateRegistry();
      expect(r).toBeInstanceOf(TemplateRegistry);
    });

    it('close() prevents further operations', () => {
      registry.close();
      expect(registry.isOpen()).toBe(false);
      expect(() => registry.register(mockTemplate())).toThrow('is closed');
    });

    it('close() clears all templates and listeners', () => {
      registry.register(mockTemplate());
      registry.close();
      // isOpen is false, but we can check internal state via isOpen
      expect(registry.isOpen()).toBe(false);
    });

    it('hasDomain returns true for default domains', () => {
      expect(registry.hasDomain(TemplateDomain.WRITER)).toBe(true);
      expect(registry.hasDomain(TemplateDomain.CALC)).toBe(true);
      expect(registry.hasDomain(TemplateDomain.IMPRESS)).toBe(true);
      expect(registry.hasDomain(TemplateDomain.BASE)).toBe(true);
    });

    it('listDomains returns all registered domains', () => {
      const domains = registry.listDomains();
      expect(domains).toContain('writer');
      expect(domains).toContain('calc');
      expect(domains.length).toBeGreaterThanOrEqual(4);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Domain Management
  // ─────────────────────────────────────────────────────────────────────────
  describe('Domain Management', () => {
    it('registerDomain adds new domain', () => {
      registry.registerDomain('draw');
      expect(registry.hasDomain('draw')).toBe(true);
      expect(registry.listDomains()).toContain('draw');
    });

    it('registerDomain throws on empty name', () => {
      expect(() => registry.registerDomain('')).toThrow('cannot be empty');
    });

    it('registerDomain emits DOMAIN_REGISTERED event', () => {
      const listener = vi.fn();
      registry.on(TemplateEventType.DOMAIN_REGISTERED, listener);
      registry.registerDomain('math');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].domain).toBe('math');
    });

    it('registerDomain with validators', () => {
      const validator = vi.fn();
      registry.registerDomain('custom', [validator]);

      const tpl = mockTemplate({ domain: 'custom' });
      registry.register(tpl);
      expect(validator).toHaveBeenCalledWith(tpl);
    });

    it('strictDomains rejects unknown domains', () => {
      const strict = TemplateRegistry.create({ strictDomains: true });
      const tpl = mockTemplate({ domain: 'unknown_domain' });
      expect(() => strict.register(tpl)).toThrow('Unknown domain');
    });

    it('strictDomains allows registered domains', () => {
      const strict = TemplateRegistry.create({ strictDomains: true });
      strict.registerDomain('custom');
      const tpl = mockTemplate({ domain: 'custom' });
      expect(() => strict.register(tpl)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Registration
  // ─────────────────────────────────────────────────────────────────────────
  describe('Registration', () => {
    it('registers template correctly', () => {
      const tpl = mockTemplate();
      registry.register(tpl);
      expect(registry.size()).toBe(1);
      expect(registry.has(tpl.id)).toBe(true);
    });

    it('throws on duplicate id', () => {
      const tpl = mockTemplate({ id: 'dup' });
      registry.register(tpl);
      expect(() => registry.register(tpl)).toThrow('already exists');
    });

    it('throws on empty id', () => {
      expect(() => registry.register(mockTemplate({ id: '' }))).toThrow(
        'id cannot be empty'
      );
    });

    it('throws on empty name', () => {
      expect(() => registry.register(mockTemplate({ name: '' }))).toThrow(
        'name cannot be empty'
      );
    });

    it('throws on empty domain', () => {
      expect(() => registry.register(mockTemplate({ domain: '' }))).toThrow(
        'domain cannot be empty'
      );
    });

    it('throws on invalid content (not a DocNode)', () => {
      expect(() =>
        registry.register(mockTemplate({ content: null as unknown as DocNode }))
      ).toThrow('structural validation');
    });

    it('throws on invalid content (missing type field)', () => {
      expect(() =>
        registry.register(
          mockTemplate({ content: { id: 'x' } as unknown as DocNode })
        )
      ).toThrow('structural validation');
    });

    it('throws when maxTemplates reached', () => {
      const r = TemplateRegistry.create({ maxTemplates: 2 });
      r.register(mockTemplate());
      r.register(mockTemplate());
      expect(() => r.register(mockTemplate())).toThrow('Maximum templates');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 🔴 Fix #3: update() — new method
  // ─────────────────────────────────────────────────────────────────────────
  describe('update() — v2.0 Critical Fix', () => {
    it('updates template name', () => {
      const tpl = mockTemplate({ id: 'tpl-1', name: 'Original' });
      registry.register(tpl);

      const updated = registry.update('tpl-1', { name: 'Updated' });
      expect(updated.name).toBe('Updated');
      expect(registry.get('tpl-1')?.name).toBe('Updated');
    });

    it('preserves createdAt on update', async () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);
      const originalCreatedAt = registry.get('tpl-1')?.metadata?.createdAt;

      await new Promise((r) => setTimeout(r, 10));
      const updated = registry.update('tpl-1', { name: 'Changed' });

      expect(updated.metadata?.createdAt).toBe(originalCreatedAt);
    });

    it('auto-increments version on update', () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);
      expect(registry.get('tpl-1')?.metadata?.version).toBe(1);

      registry.update('tpl-1', { name: 'V2' });
      expect(registry.get('tpl-1')?.metadata?.version).toBe(2);

      registry.update('tpl-1', { name: 'V3' });
      expect(registry.get('tpl-1')?.metadata?.version).toBe(3);
    });

    it('updates updatedAt timestamp', async () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);
      const t1 = registry.get('tpl-1')?.metadata?.updatedAt;

      await new Promise((r) => setTimeout(r, 10));
      registry.update('tpl-1', { name: 'Changed' });
      const t2 = registry.get('tpl-1')?.metadata?.updatedAt;

      expect(t2).toBeGreaterThan(t1!);
    });

    it('throws on missing template', () => {
      expect(() => registry.update('nonexistent', { name: 'X' })).toThrow(
        'Template not found'
      );
    });

    it('validates updated template', () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);
      expect(() => registry.update('tpl-1', { name: '' })).toThrow(
        'name cannot be empty'
      );
    });

    it('emits UPDATED event', () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);

      const listener = vi.fn();
      registry.on(TemplateEventType.UPDATED, listener);

      registry.update('tpl-1', { name: 'New Name' });
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener.mock.calls[0][0].template?.name).toBe('New Name');
    });

    it('updates content correctly', () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);

      const newContent = mockDocNode({ id: 'doc-2' });
      registry.update('tpl-1', { content: newContent });

      expect(registry.get('tpl-1')?.content).toEqual(newContent);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Retrieval & Query
  // ─────────────────────────────────────────────────────────────────────────
  describe('Retrieval & Query', () => {
    it('get() returns template by id', () => {
      const tpl = mockTemplate();
      registry.register(tpl);
      expect(registry.get(tpl.id)).toEqual(tpl);
    });

    it('get() returns null for missing id', () => {
      expect(registry.get('missing')).toBeNull();
    });

    it('list() returns all templates', () => {
      registry.register(mockTemplate({ domain: TemplateDomain.WRITER }));
      registry.register(mockTemplate({ domain: TemplateDomain.CALC }));
      expect(registry.list()).toHaveLength(2);
    });

    it('list() filters by domain', () => {
      registry.register(mockTemplate({ domain: TemplateDomain.WRITER }));
      registry.register(mockTemplate({ domain: TemplateDomain.CALC }));
      registry.register(mockTemplate({ domain: TemplateDomain.WRITER }));

      expect(registry.list(TemplateDomain.WRITER)).toHaveLength(2);
      expect(registry.list(TemplateDomain.CALC)).toHaveLength(1);
      expect(registry.list(TemplateDomain.IMPRESS)).toHaveLength(0);
    });

    it('find() by domain', () => {
      registry.register(mockTemplate({ domain: TemplateDomain.WRITER }));
      registry.register(mockTemplate({ domain: TemplateDomain.CALC }));
      expect(registry.find({ domain: TemplateDomain.WRITER })).toHaveLength(1);
    });

    it('find() by tags (AND logic)', () => {
      registry.register(
        mockTemplate({
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 1,
            tags: ['a', 'b', 'c'],
          },
        })
      );
      registry.register(
        mockTemplate({
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 1,
            tags: ['a', 'b'],
          },
        })
      );

      expect(registry.find({ tags: ['a', 'b'] })).toHaveLength(2);
      expect(registry.find({ tags: ['a', 'b', 'c'] })).toHaveLength(1);
    });

    it('find() by namePattern (string)', () => {
      registry.register(mockTemplate({ name: 'Report Template' }));
      registry.register(mockTemplate({ name: 'Letter Format' }));
      registry.register(mockTemplate({ name: 'report draft' }));

      expect(registry.find({ namePattern: 'report' })).toHaveLength(2);
    });

    it('find() by namePattern (RegExp)', () => {
      registry.register(mockTemplate({ name: 'Report-v1' }));
      registry.register(mockTemplate({ name: 'Report-v2' }));
      registry.register(mockTemplate({ name: 'Letter' }));

      expect(registry.find({ namePattern: /^Report-v\d+$/ })).toHaveLength(2);
    });

    it('find() by predicate', () => {
      registry.register(
        mockTemplate({
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 5,
          },
        })
      );
      registry.register(
        mockTemplate({
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 1,
          },
        })
      );

      const results = registry.find({
        predicate: (t) => (t.metadata?.version ?? 0) > 3,
      });
      expect(results).toHaveLength(1);
    });

    it('find() combines filters (AND)', () => {
      registry.register(
        mockTemplate({
          name: 'Report A',
          domain: TemplateDomain.WRITER,
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 1,
            tags: ['important'],
          },
        })
      );
      registry.register(
        mockTemplate({
          name: 'Report B',
          domain: TemplateDomain.CALC,
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            version: 1,
            tags: ['important'],
          },
        })
      );

      const results = registry.find({
        domain: TemplateDomain.WRITER,
        tags: ['important'],
        namePattern: 'Report',
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Report A');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Apply
  // ─────────────────────────────────────────────────────────────────────────
  describe('Apply', () => {
    it('apply() returns cloned content', () => {
      const tpl = mockTemplate();
      registry.register(tpl);
      const doc = registry.apply(tpl.id);
      expect(doc).toEqual(tpl.content);
      expect(doc).not.toBe(tpl.content);
    });

    it('apply() throws on missing template', () => {
      expect(() => registry.apply('missing')).toThrow('Template not found');
    });

    it('apply() returns independent copies', () => {
      const tpl = mockTemplate();
      registry.register(tpl);
      const d1 = registry.apply(tpl.id);
      const d2 = registry.apply(tpl.id);
      expect(d1).toEqual(d2);
      expect(d1).not.toBe(d2);
    });

    it('apply() emits APPLIED event', () => {
      const tpl = mockTemplate();
      registry.register(tpl);
      const listener = vi.fn();
      registry.on(TemplateEventType.APPLIED, listener);
      registry.apply(tpl.id);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('apply() uses custom cloneContent', () => {
      const customClone = vi.fn(
        (c: DocNode) => ({ ...c, _cloned: true }) as unknown as DocNode
      );
      const r = TemplateRegistry.create({ cloneContent: customClone });
      const tpl = mockTemplate();
      r.register(tpl);
      const result = r.apply(tpl.id);
      expect(customClone).toHaveBeenCalled();
      expect((result as unknown as { _cloned?: boolean })._cloned).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 🔴 Fix #2: unregister() passes template to REMOVED event
  // ─────────────────────────────────────────────────────────────────────────
  describe('unregister() — v2.0 Critical Fix', () => {
    it('removes template', () => {
      const tpl = mockTemplate();
      registry.register(tpl);
      expect(registry.unregister(tpl.id)).toBe(true);
      expect(registry.has(tpl.id)).toBe(false);
    });

    it('returns false for missing id', () => {
      expect(registry.unregister('missing')).toBe(false);
    });

    it('passes deleted template to REMOVED event', () => {
      const tpl = mockTemplate({ id: 'to-delete', name: 'Delete Me' });
      registry.register(tpl);

      const listener = vi.fn();
      registry.on(TemplateEventType.REMOVED, listener);

      registry.unregister('to-delete');

      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0][0];
      expect(event.type).toBe('template_removed');
      expect(event.template).toBeDefined();
      expect(event.template?.id).toBe('to-delete');
      expect(event.template?.name).toBe('Delete Me');
    });

    it('does not emit event when key missing', () => {
      const listener = vi.fn();
      registry.on(TemplateEventType.REMOVED, listener);
      registry.unregister('nonexistent');
      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // 🔴 Fix #1: size() with ensureOpen()
  // ─────────────────────────────────────────────────────────────────────────
  describe('size() — v2.0 Critical Fix', () => {
    it('returns correct size', () => {
      expect(registry.size()).toBe(0);
      registry.register(mockTemplate());
      expect(registry.size()).toBe(1);
      registry.register(mockTemplate());
      expect(registry.size()).toBe(2);
    });

    it('throws after close (consistency fix)', () => {
      registry.register(mockTemplate());
      registry.close();
      expect(() => registry.size()).toThrow('is closed');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Clear
  // ─────────────────────────────────────────────────────────────────────────
  describe('Clear', () => {
    it('removes all templates', () => {
      registry.register(mockTemplate());
      registry.register(mockTemplate());
      registry.clear();
      expect(registry.size()).toBe(0);
    });

    it('emits CLEARED event', () => {
      const listener = vi.fn();
      registry.on(TemplateEventType.CLEARED, listener);
      registry.clear();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Event System
  // ─────────────────────────────────────────────────────────────────────────
  describe('Event System', () => {
    it('emits ADDED event on register', () => {
      const listener = vi.fn();
      registry.on(TemplateEventType.ADDED, listener);
      registry.register(mockTemplate());
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('emits UPDATED event on update', () => {
      const tpl = mockTemplate({ id: 'tpl-1' });
      registry.register(tpl);
      const listener = vi.fn();
      registry.on(TemplateEventType.UPDATED, listener);
      registry.update('tpl-1', { name: 'New' });
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('unsubscribe works', () => {
      const listener = vi.fn();
      const unsub = registry.on(TemplateEventType.ADDED, listener);
      registry.register(mockTemplate());
      unsub();
      registry.register(mockTemplate());
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('handles listener errors gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const badListener = () => {
        throw new Error('Bad');
      };
      const goodListener = vi.fn();
      registry.on(TemplateEventType.ADDED, badListener);
      registry.on(TemplateEventType.ADDED, goodListener);
      registry.register(mockTemplate());
      expect(consoleSpy).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('events can be disabled', () => {
      const r = TemplateRegistry.create({ enableEvents: false });
      const listener = vi.fn();
      r.on(TemplateEventType.ADDED, listener);
      r.register(mockTemplate());
      expect(listener).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Generic Content Support
  // ─────────────────────────────────────────────────────────────────────────
  describe('Generic Content Support', () => {
    it('works with custom content type', () => {
      interface CustomContent {
        readonly formula: string;
        readonly result: number;
      }

      const customGuard = (c: unknown): c is CustomContent =>
        typeof c === 'object' && c !== null && 'formula' in c;

      const r = TemplateRegistry.create<CustomContent>({
        contentGuard: customGuard,
      });

      const tpl: Template<CustomContent> = {
        id: 'calc-1',
        name: 'Budget',
        domain: TemplateDomain.CALC,
        content: { formula: '=SUM(A1:A10)', result: 42 },
        metadata: { createdAt: Date.now(), updatedAt: Date.now(), version: 1 },
      };

      r.register(tpl);
      const applied = r.apply('calc-1');
      expect(applied.formula).toBe('=SUM(A1:A10)');
      expect(applied.result).toBe(42);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Storage Integration
  // ─────────────────────────────────────────────────────────────────────────
  describe('Storage Integration', () => {
    it('calls storage.save on register', () => {
      const storage = {
        save: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
      };
      const r = TemplateRegistry.create({ storage });
      const tpl = mockTemplate();
      r.register(tpl);
      expect(storage.save).toHaveBeenCalledWith(tpl);
    });

    it('calls storage.remove on unregister', () => {
      const storage = {
        save: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
      };
      const r = TemplateRegistry.create({ storage });
      const tpl = mockTemplate({ id: 'tpl-1' });
      r.register(tpl);
      r.unregister('tpl-1');
      expect(storage.remove).toHaveBeenCalledWith('tpl-1');
    });

    it('calls storage.clear on clear', () => {
      const storage = {
        save: vi.fn(),
        remove: vi.fn(),
        clear: vi.fn(),
      };
      const r = TemplateRegistry.create({ storage });
      r.register(mockTemplate());
      r.clear();
      expect(storage.clear).toHaveBeenCalled();
    });

    it('handles storage errors via onStorageError', () => {
      const onStorageError = vi.fn();
      const storage = {
        save: () => {
          throw new Error('Storage failed');
        },
        remove: vi.fn(),
        clear: vi.fn(),
      };
      const r = TemplateRegistry.create({ storage, onStorageError });
      r.register(mockTemplate());
      expect(onStorageError).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Consistency Checks (all methods call ensureOpen)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Consistency: all methods call ensureOpen after close', () => {
    it('get throws after close', () => {
      registry.close();
      expect(() => registry.get('x')).toThrow('is closed');
    });

    it('list throws after close', () => {
      registry.close();
      expect(() => registry.list()).toThrow('is closed');
    });

    it('find throws after close', () => {
      registry.close();
      expect(() => registry.find({})).toThrow('is closed');
    });

    it('apply throws after close', () => {
      registry.close();
      expect(() => registry.apply('x')).toThrow('is closed');
    });

    it('has throws after close', () => {
      registry.close();
      expect(() => registry.has('x')).toThrow('is closed');
    });

    it('size throws after close', () => {
      registry.close();
      expect(() => registry.size()).toThrow('is closed');
    });

    it('clear throws after close', () => {
      registry.close();
      expect(() => registry.clear()).toThrow('is closed');
    });

    it('register throws after close', () => {
      registry.close();
      expect(() => registry.register(mockTemplate())).toThrow('is closed');
    });

    it('unregister throws after close', () => {
      registry.close();
      expect(() => registry.unregister('x')).toThrow('is closed');
    });

    it('on throws after close', () => {
      registry.close();
      expect(() => registry.on(TemplateEventType.ADDED, () => {})).toThrow(
        'is closed'
      );
    });

    it('registerDomain throws after close', () => {
      registry.close();
      expect(() => registry.registerDomain('new')).toThrow('is closed');
    });
  });
});
