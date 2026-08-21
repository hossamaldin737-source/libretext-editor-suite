/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: storage-utils.ts
 * 📂 المسار: packages/storage/src/storage-utils.ts
 * 🎯 الهدف الرئيسي: دوال مساعدة لطبقة التخزين (فحص الحصة، التوفر، JSON الآمن)
 * 📋 المعايير: zero-external-dependencies، آمن تماماً ضد الاستثناءات
 * 🧪 الاختبارات: packages/storage/tests/localStorage.test.ts
 * 🏷️ المعرف: STORE-011
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Defensive Storage Utilities + Custom Typed Error Classes
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. فحص التوفر يجب أن يتعامل مع حظر الـ Storage في Safari Private Mode
 *    2. حماية JSON stringify من الحلقات التكرارية (circular references)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص دقيق عبر try-catch
 *    - خطأ QuotaExceeded مخصص مع حجم البيانات
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** خطأ مخصص عند تجاوز مساحة التخزين */
export class QuotaExceededError extends Error {
  readonly bytesAttempted?: number;

  constructor(message: string, bytesAttempted?: number) {
    super(message);
    this.name = 'QuotaExceededError';
    this.bytesAttempted = bytesAttempted;
  }
}

/** خطأ مخصص عند عدم توفر محرك التخزين في البيئة الحالية */
export class StorageUnavailableError extends Error {
  readonly storageType: string;

  constructor(storageType = 'localStorage') {
    super(`Storage engine "${storageType}" is not available in the current environment`);
    this.name = 'StorageUnavailableError';
    this.storageType = storageType;
  }
}

/**
 * فحص ما إذا كان كائن الخطأ ناتج عن تجاوز الحصة
 */
export function isQuotaExceededError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; code?: number; number?: number };
  return (
    e.name === 'QuotaExceededError' ||
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    e.code === 22 ||
    e.code === 1014 ||
    e.number === -2147024882
  );
}

/**
 * فحص توفر localStorage في البيئة الحالية
 */
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__libretext_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * نتيجة تحليل JSON الآمن
 */
export type SafeJsonResult<T> = { success: true; value: T } | { success: false; error: Error };

/**
 * تحليل آمن للنص كـ JSON دون رمي استثناءات
 */
export function safeJsonParse<T>(raw: string | null): SafeJsonResult<T> {
  if (raw === null || raw === undefined) {
    return { success: false, error: new Error('Empty input') };
  }
  try {
    const value = JSON.parse(raw) as T;
    return { success: true, value };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * تحويل آمن للكائن إلى JSON مع حماية من المراجع الدائرية
 */
export function safeJsonStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

/**
 * إضافة بادئة للمفتاح
 */
export function prefixKey(prefix: string, key: string): string {
  return `${prefix}${key}`;
}

/**
 * إزالة البادئة من المفتاح
 */
export function unprefixKey(prefix: string, prefixedKey: string): string {
  if (prefixedKey.startsWith(prefix)) {
    return prefixedKey.slice(prefix.length);
  }
  return prefixedKey;
}
