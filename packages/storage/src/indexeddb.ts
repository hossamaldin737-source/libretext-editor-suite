/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: indexeddb.ts
 * 📂 المسار: packages/storage/src/indexeddb.ts
 * 🎯 الهدف الرئيسي: محول تخزين دائم (IndexedDB Adapter) للمستندات الكبيرة
 * 📋 المعايير: دعم العمليات غير المتزامنة الآمنة والتراجع عند عدم التوفر
 * 🧪 الاختبارات: packages/storage/tests/indexeddb.test.ts
 * 🏷️ المعرف: STORE-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Promise-wrapped IndexedDB Transaction Pipeline
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دعم بيئات عدم توفر IndexedDB (Fall back gracefully)
 *    2. إغلاق المعاملات (Transactions) تلقائياً لتجنب تسريب الموارد
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية الأخطاء وإرجاع وعود آمنة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { memoryStore } from './memory';

export class IndexedDBStore {
  private readonly dbName: string;
  private readonly storeName: string;

  constructor(dbName = 'LibreTextDB', storeName = 'documents') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable()) {
      return memoryStore.get<T>(key);
    }
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(this.dbName, 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore(this.storeName);
        };
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(this.storeName, 'readonly');
          const getReq = tx.objectStore(this.storeName).get(key);
          getReq.onsuccess = () => resolve((getReq.result as T) ?? null);
          getReq.onerror = () => resolve(null);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    if (!this.isAvailable()) {
      return memoryStore.set<T>(key, value);
    }
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(this.dbName, 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore(this.storeName);
        };
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(this.storeName, 'readwrite');
          const putReq = tx.objectStore(this.storeName).put(value, key);
          putReq.onsuccess = () => resolve(true);
          putReq.onerror = () => resolve(false);
        };
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return memoryStore.delete(key);
    }
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(this.dbName, 1);
        req.onsuccess = () => {
          const tx = req.result.transaction(this.storeName, 'readwrite');
          const delReq = tx.objectStore(this.storeName).delete(key);
          delReq.onsuccess = () => resolve(true);
          delReq.onerror = () => resolve(false);
        };
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }
}

export const indexedDBStore = new IndexedDBStore();
