/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: memory.ts
 * 📂 المسار: packages/storage/src/memory.ts
 * 🎯 الهدف الرئيسي: مخزن في الذاكرة (In-Memory Store) للمستندات والحالات
 * 📋 المعايير: صفر اعتماديات، سرعة استجابة، عزل الحالة
 * 🧪 الاختبارات: packages/storage/tests/memory.test.ts
 * 🏷️ المعرف: STORE-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Key-Value In-Memory Cache with Deep Clone Isolation
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الذاكرة مؤقتة وتضيع عند إعادة تشغيل التطبيق
 *    2. ضمان عزل الكائنات عبر الاستنساخ غير القابل للتعديل
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص المفاتيح الفارغة
 *    - معالجة الأخطاء وإرجاع null عند عدم العثور
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode } from '@libretext/core';

export interface StorageItem<T = unknown> {
  key: string;
  value: T;
  updatedAt: number;
}

export class MemoryStore {
  private readonly store = new Map<string, StorageItem>();

  async get<T = DocNode>(key: string): Promise<T | null> {
    if (!key) return null;
    const item = this.store.get(key);
    if (!item) return null;
    return JSON.parse(JSON.stringify(item.value)) as T;
  }

  async set<T = DocNode>(key: string, value: T): Promise<boolean> {
    if (!key || value === undefined) return false;
    this.store.set(key, {
      key,
      value: JSON.parse(JSON.stringify(value)),
      updatedAt: Date.now(),
    });
    return true;
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async size(): Promise<number> {
    return this.store.size;
  }
}

export const memoryStore = new MemoryStore();
