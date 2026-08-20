/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/storage/src/types.ts
 * 🎯 الهدف الرئيسي: تعريف الواجهات المشتركة لجميع أنواع التخزين
 *                    (Memory, LocalStorage, IndexedDB, Snapshots)
 * 📋 المعايير: Generic Types, Event System, Zero Runtime Dependencies
 * 🧪 الاختبارات: packages/storage/tests/types.test.ts
 * 🏷️ المعرف: STORE-010
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🔄 آخر تحديث: 2026-08-20 (v2: Strict isStoreEntry Validation)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Generic Store Interface + Event-Driven Architecture + Metadata Wrapping
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تخزين المراجع المباشرة قد يسبب طفرات خارجية (External Mutations)
 *    2. Event Listeners قد تسبب Memory Leaks إذا لم تُزال
 *    3. structuredClone غير متاح في Node < 17 وبعض المتصفحات القديمة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Deep Clone للقيم المدخلة والمُسترجعة (عبر structuredClone)
 *    - Validation للمفاتيح (non-empty strings)
 *    - Type Guards صارمة تتحقق من البنية الكاملة للـ metadata
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#STORE-010
 *    - 📦 التبعيات: @libretext/core (type-only import لـ DocNode)
 *    - 📄 مرتبط مباشر: memory.ts (STORE-001), localStorage.ts (STORE-002)
 *    - 🧪 اختبارات: tests/types.test.ts
 *    - 📚 مراجع: RESTRUCTURING_PLAN.md §4 (Storage & Templates)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - isValidKey(): التحقق من صحة المفتاح (#L120)
 *    - validateKey(): تحقق مع رمي استثناء (#L125)
 *    - createStoreEntry(): إنشاء إدخال مخزن مع metadata (#L130)
 *    - isStoreEntry(): Type Guard كامل للتحقق من StoreEntry ومتغيراته (#L145)
 *    - deepClone(): نسخ عميق حسب الاستراتيجية (#L165)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - استخدام structuredClone (Node 17+) بدلاً من JSON.parse/stringify
 *    - Generic T يسمح بتخزين أي نوع (DocNode, Template, UserSettings, etc.)
 *    - Event System بسيط (بدون RxJS) لتقليل التبعيات
 *    - @libretext/core هي تبعية type-only (DocNode) ولا تُحدث cycle
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل معروفة حالياً
 *    - 📖 مرجع تقني: Web Storage API, IndexedDB API
 *    - 🎯 التحسينات المستقبلية: دعم Transactions، دعم TTL (Time-To-Live)
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode } from '@libretext/core';

// ─────────────────────────────────────────────────────────────────────────────
// الأنواع الأساسية (Core Types)
// ─────────────────────────────────────────────────────────────────────────────

/** أنواع الأحداث المدعومة في المخزن */
export const StoreEventType = {
  SAVE: 'save',
  DELETE: 'delete',
  CLEAR: 'clear'
} as const;

export type StoreEventTypeValue = typeof StoreEventType[keyof typeof StoreEventType];

/** حدث المخزن */
export interface StoreEvent<T = unknown> {
  readonly type: StoreEventTypeValue;
  readonly key: string;
  readonly value?: T;
  readonly timestamp: number;
}

/** مستمع أحداث المخزن */
export type StoreEventListener<T = unknown> = (event: StoreEvent<T>) => void;

/** دالة إلغاء الاشتراك في الأحداث */
export type UnsubscribeFn = () => void;

// ─────────────────────────────────────────────────────────────────────────────
// واجهة StoreEntry (إدخال المخزن مع Metadata)
// ─────────────────────────────────────────────────────────────────────────────

/** Metadata للإدخال */
export interface StoreMetadata {
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly version: number;
  readonly tags?: readonly string[];
}

/** إدخال المخزن (يغلف البيانات مع metadata) */
export interface StoreEntry<T = unknown> {
  readonly key: string;
  readonly data: T;
  readonly metadata: StoreMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// واجهة StoreConfig (إعدادات المخزن)
// ─────────────────────────────────────────────────────────────────────────────

/** إعدادات المخزن */
export interface StoreConfig {
  readonly name?: string;
  readonly version?: number;
  readonly maxEntries?: number;
  readonly enableEvents?: boolean;
  readonly cloneStrategy?: 'structuredClone' | 'json' | 'none';
}

/** الإعدادات الافتراضية */
export const DEFAULT_STORE_CONFIG: Required<StoreConfig> = {
  name: 'default',
  version: 1,
  maxEntries: 10000,
  enableEvents: true,
  cloneStrategy: 'structuredClone'
};

// ─────────────────────────────────────────────────────────────────────────────
// واجهة Store (الواجهة الموحدة لجميع أنواع التخزين)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * الواجهة الموحدة للمخزن (Store Interface)
 * Generic T: نوع البيانات المخزنة (DocNode, Template, etc.)
 */
export interface Store<T = unknown> {
  readonly name: string;
  readonly version: number;
  get(key: string): T | undefined;
  getEntry(key: string): StoreEntry<T> | undefined;
  set(key: string, value: T, tags?: readonly string[]): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  keys(): readonly string[];
  entries(): readonly StoreEntry<T>[];
  size(): number;
  clear(): void;
  on(eventType: StoreEventTypeValue, listener: StoreEventListener<T>): UnsubscribeFn;
  close(): void;
}

/**
 * الواجهة الموحدة للمخزن غير المتزامن (Async Store Interface)
 * Generic T: نوع البيانات المخزنة (DocNode, Template, etc.)
 */
export interface AsyncStore<T = unknown> {
  readonly name: string;
  readonly version: number;
  get(key: string): Promise<T | undefined>;
  getEntry(key: string): Promise<StoreEntry<T> | undefined>;
  set(key: string, value: T, tags?: readonly string[]): Promise<void>;
  has(key: string): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  keys(): Promise<readonly string[]>;
  entries(): Promise<readonly StoreEntry<T>[]>;
  size(): Promise<number>;
  clear(): Promise<void>;
  on(eventType: StoreEventTypeValue, listener: StoreEventListener<T>): UnsubscribeFn;
  close(): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// الدوال المساعدة (Helper Functions)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * التحقق من صحة مفتاح المخزن
 * @returns true إذا كان المفتاح صالحاً (string غير فارغة)
 */
export function isValidKey(key: unknown): key is string {
  return typeof key === 'string' && key.trim().length > 0;
}

/**
 * التحقق من صحة المفتاح مع رمي استثناء عند الفشل
 * @throws Error إذا كان المفتاح فارغاً أو غير صالح
 */
export function validateKey(key: unknown): asserts key is string {
  if (!isValidKey(key)) {
    throw new Error(`Invalid store key: ${String(key)}`);
  }
}

/** إنشاء إدخال مخزن مع metadata */
export function createStoreEntry<T>(
  key: string,
  data: T,
  tags?: readonly string[],
  existingMetadata?: StoreMetadata
): StoreEntry<T> {
  const now = Date.now();
  return {
    key,
    data,
    metadata: {
      createdAt: existingMetadata?.createdAt ?? now,
      updatedAt: now,
      version: (existingMetadata?.version ?? 0) + 1,
      tags
    }
  };
}

/**
 * Type Guard للتحقق من StoreEntry (مع التحقق من بنية metadata كاملة)
 * ⚠️ يتحقق من الحقول الثلاثة الإلزامية: createdAt, updatedAt, version
 */
export function isStoreEntry(value: unknown): value is StoreEntry<unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;

  if (typeof entry.key !== 'string') return false;
  if (!('data' in entry)) return false;

  const meta = entry.metadata;
  if (typeof meta !== 'object' || meta === null) return false;
  const metaObj = meta as Record<string, unknown>;

  return (
    typeof metaObj.createdAt === 'number' &&
    typeof metaObj.updatedAt === 'number' &&
    typeof metaObj.version === 'number'
  );
}

/** نسخ قيمة عميقة حسب الاستراتيجية المختارة */
export function deepClone<T>(
  value: T,
  strategy: 'structuredClone' | 'json' | 'none' = 'structuredClone'
): T {
  if (strategy === 'none') return value;
  if (strategy === 'json') return JSON.parse(JSON.stringify(value));
  return structuredClone(value);
}

/** نوع المتجر المحدد لـ DocNode (للراحة) */
export type DocStore = Store<DocNode>;
