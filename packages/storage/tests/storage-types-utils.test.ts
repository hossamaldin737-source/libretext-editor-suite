/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: storage-types-utils.test.ts
 * 📂 المسار: packages/storage/tests/storage-types-utils.test.ts
 * 🎯 الهدف الرئيسي: اختبارات Store interface + storage-utils + indexeddb-utils
 * 🏷️ المعرف: TEST-STORE-TYPES
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  isValidKey,
  validateKey,
  createStoreEntry,
  isStoreEntry,
  deepClone,
  DEFAULT_STORE_CONFIG,
  StoreEventType,
} from '../src/types';
import {
  QuotaExceededError,
  StorageUnavailableError,
  isQuotaExceededError,
  isLocalStorageAvailable,
  safeJsonParse,
  safeJsonStringify,
  prefixKey,
  unprefixKey,
} from '../src/storage-utils';
import { isIndexedDBAvailable } from '../src/indexeddb-utils';

// ─── Store Types ────────────────────────────────────────────────────────────
describe('Store Types', () => {
  describe('StoreEventType', () => {
    it('has correct values', () => {
      expect(StoreEventType.SAVE).toBe('save');
      expect(StoreEventType.DELETE).toBe('delete');
      expect(StoreEventType.CLEAR).toBe('clear');
    });
  });

  describe('DEFAULT_STORE_CONFIG', () => {
    it('has sensible defaults', () => {
      expect(DEFAULT_STORE_CONFIG.name).toBe('default');
      expect(DEFAULT_STORE_CONFIG.version).toBe(1);
      expect(DEFAULT_STORE_CONFIG.maxEntries).toBe(10000);
      expect(DEFAULT_STORE_CONFIG.enableEvents).toBe(true);
      expect(DEFAULT_STORE_CONFIG.cloneStrategy).toBe('structuredClone');
    });
  });

  describe('isValidKey', () => {
    it('validates string keys', () => {
      expect(isValidKey('hello')).toBe(true);
      expect(isValidKey('a')).toBe(true);
    });

    it('rejects empty strings', () => {
      expect(isValidKey('')).toBe(false);
      expect(isValidKey('   ')).toBe(false);
    });

    it('rejects non-strings', () => {
      expect(isValidKey(123)).toBe(false);
      expect(isValidKey(null)).toBe(false);
      expect(isValidKey(undefined)).toBe(false);
    });
  });

  describe('validateKey', () => {
    it('passes for valid key', () => {
      expect(() => validateKey('valid')).not.toThrow();
    });

    it('throws for invalid key', () => {
      expect(() => validateKey('')).toThrow('Invalid store key');
    });
  });

  describe('createStoreEntry', () => {
    it('creates entry with metadata', () => {
      const entry = createStoreEntry('k1', 'value', ['tag1']);
      expect(entry.key).toBe('k1');
      expect(entry.data).toBe('value');
      expect(entry.metadata.tags).toEqual(['tag1']);
      expect(entry.metadata.version).toBe(1);
      expect(entry.metadata.createdAt).toBeGreaterThan(0);
      expect(entry.metadata.updatedAt).toBeGreaterThan(0);
    });

    it('increments version on existing metadata', () => {
      const existing = createStoreEntry('k1', 'v1');
      const updated = createStoreEntry('k1', 'v2', [], existing.metadata);
      expect(updated.metadata.version).toBe(2);
      expect(updated.metadata.createdAt).toBe(existing.metadata.createdAt);
    });
  });

  describe('isStoreEntry', () => {
    it('returns true for valid StoreEntry', () => {
      const entry = createStoreEntry('k1', 'v1');
      expect(isStoreEntry(entry)).toBe(true);
    });

    it('returns false for plain objects', () => {
      expect(isStoreEntry({ key: 'k1', data: 'v1' })).toBe(false);
    });

    it('returns false for null', () => {
      expect(isStoreEntry(null)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('clones with structuredClone', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    it('clones with JSON strategy', () => {
      const obj = { a: 1 };
      const clone = deepClone(obj, 'json');
      expect(clone).toEqual(obj);
    });

    it('returns same reference with none strategy', () => {
      const obj = { a: 1 };
      const clone = deepClone(obj, 'none');
      expect(clone).toBe(obj);
    });
  });
});

// ─── Storage Utils ──────────────────────────────────────────────────────────
describe('Storage Utils', () => {
  describe('QuotaExceededError', () => {
    it('creates error with message', () => {
      const err = new QuotaExceededError('quota exceeded');
      expect(err.message).toBe('quota exceeded');
      expect(err.name).toBe('QuotaExceededError');
    });

    it('stores bytesAttempted', () => {
      const err = new QuotaExceededError('quota', 1024);
      expect(err.bytesAttempted).toBe(1024);
    });
  });

  describe('StorageUnavailableError', () => {
    it('creates error with storage type', () => {
      const err = new StorageUnavailableError('indexedDB');
      expect(err.message).toContain('indexedDB');
      expect(err.storageType).toBe('indexedDB');
    });
  });

  describe('isQuotaExceededError', () => {
    it('detects QuotaExceededError name', () => {
      expect(isQuotaExceededError({ name: 'QuotaExceededError' })).toBe(true);
    });

    it('detects code 22', () => {
      expect(isQuotaExceededError({ code: 22 })).toBe(true);
    });

    it('returns false for unrelated errors', () => {
      expect(isQuotaExceededError({ name: 'TypeError' })).toBe(false);
    });

    it('returns false for null', () => {
      expect(isQuotaExceededError(null)).toBe(false);
    });
  });

  describe('isLocalStorageAvailable', () => {
    it('returns boolean', () => {
      expect(typeof isLocalStorageAvailable()).toBe('boolean');
    });
  });

  describe('safeJsonParse', () => {
    it('parses valid JSON', () => {
      const result = safeJsonParse('{"a":1}');
      expect(result.success).toBe(true);
      if (result.success) expect(result.value).toEqual({ a: 1 });
    });

    it('handles null input', () => {
      const result = safeJsonParse(null);
      expect(result.success).toBe(false);
    });

    it('handles invalid JSON', () => {
      const result = safeJsonParse('not-json');
      expect(result.success).toBe(false);
    });
  });

  describe('safeJsonStringify', () => {
    it('stringifies valid objects', () => {
      expect(safeJsonStringify({ a: 1 })).toBe('{"a":1}');
    });

    it('returns null for circular refs', () => {
      const obj: Record<string, unknown> = {};
      obj.self = obj;
      expect(safeJsonStringify(obj)).toBeNull();
    });
  });

  describe('prefixKey / unprefixKey', () => {
    it('adds and removes prefix', () => {
      const prefixed = prefixKey('app_', 'key1');
      expect(prefixed).toBe('app_key1');
      expect(unprefixKey('app_', prefixed)).toBe('key1');
    });

    it('returns original if prefix mismatch', () => {
      expect(unprefixKey('wrong_', 'app_key1')).toBe('app_key1');
    });
  });
});

// ─── IndexedDB Utils ────────────────────────────────────────────────────────
describe('IndexedDB Utils', () => {
  describe('isIndexedDBAvailable', () => {
    it('returns boolean', () => {
      expect(typeof isIndexedDBAvailable()).toBe('boolean');
    });
  });
});
