/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: localStorage.ts
 * 📂 المسار: packages/storage/src/localStorage.ts
 * 🎯 الهدف الرئيسي: محول تخزين محلي (localStorage Adapter) لحفظ التفضيلات
 * 📋 المعايير: التعامل الآمن مع البيئات التي لا تدعم localStorage (Node.js/SSR)
 * 🧪 الاختبارات: packages/storage/tests/localStorage.test.ts
 * 🏷️ المعرف: STORE-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Graceful Fallback Adapter with Prefix Namespacing
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب خطأ SecurityError عند حظر ملفات تعريف الارتباط
 *    2. حماية الذاكرة من تجاوز حصة التخزين (QuotaExceededError)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - try/catch حول جميع عمليات التخزين
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export class LocalStorageStore {
  private readonly prefix: string;

  constructor(prefix = 'libretext:') {
    this.prefix = prefix;
  }

  private isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable() || !key) return null;
    try {
      const raw = window.localStorage.getItem(this.prefix + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<boolean> {
    if (!this.isAvailable() || !key) return false;
    try {
      window.localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.isAvailable() || !key) return false;
    try {
      window.localStorage.removeItem(this.prefix + key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    if (!this.isAvailable()) return;
    try {
      const keys = Object.keys(window.localStorage).filter((k) => k.startsWith(this.prefix));
      keys.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      // Ignored defensively
    }
  }
}

export const localStorageStore = new LocalStorageStore();
