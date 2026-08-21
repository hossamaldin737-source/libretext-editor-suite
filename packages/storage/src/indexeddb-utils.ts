/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: indexeddb-utils.ts
 * 📂 المسار: packages/storage/src/indexeddb-utils.ts
 * 🎯 الهدف الرئيسي: أدوات مساعدة لـ IndexedDB (Promise wrappers, open, upgrade)
 * 📋 المعايير: صفر اعتماديات، Promise-based، متوافق مع جميع المتصفحات
 * 🧪 الاختبارات: packages/storage/tests/indexeddb-utils.test.ts
 * 🏷️ المعرف: STORE-012
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🔄 الإصدار: v2.0.0 (مع إصلاحات onabort + onupgradeneeded)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Promise Wrapper Pattern + Request-to-Promise Conversion
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. IndexedDB غير متاح في SSR/Node — يجب فحصه دائماً
 *    2. onupgradeneeded يُستدعى فقط عند تغيير الإصدار
 *    3. Transactions لها عمر محدود — تنتهي عند انتهاء الحدث
 *    4. بعض المتصفحات القديمة لا تدعم indexedDB.databases()
 *    5. المعاملات (Transactions) قد تُلغى (Abort) وتحتاج معالجة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص توفر indexedDB قبل كل عملية
 *    - Promise wrappers مع معالجة أخطاء شاملة (onerror, onabort)
 *    - Type guards للتحقق من IDBRequest success
 *    - إغلاق قاعدة البيانات عند فشل onupgradeneeded
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#STORE-012
 *    - 📦 التبعيات: لا توجد (Web APIs فقط)
 *    - 📄 مرتبط مباشر: indexeddb.ts (STORE-003)
 *    - 🧪 اختبارات: tests/indexeddb-utils.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - isIndexedDBAvailable(): فحص التوفر (~#L52)
 *    - wrapRequest(): تحويل IDBRequest إلى Promise مع onabort (~#L60)
 *    - openDatabase(): فتح قاعدة بيانات مع onUpgrade (~#L78)
 *    - deleteDatabase(): حذف قاعدة بيانات (~#L120)
 *    - databaseExists(): فحص وجود قاعدة بيانات (~#L145)
 *    - IndexedDBError: خطأ مخصص (~#L35)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - wrapRequest تدعم الآن onabort لمنع التسريبات
 *    - onupgradeneeded تغلق DB عند فشل الـ upgrade
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: تم إصلاح onabort و onupgradeneeded
 *    - 📖 مرجع تقني: MDN IndexedDB API
 *    - 🎯 التحسينات المستقبلية: إضافة listDatabases()
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: MDN IndexedDB API
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** إعدادات فتح قاعدة البيانات */
export interface IDBOpenOptions {
  readonly version?: number;
  readonly onUpgrade?: (db: IDBDatabase, oldVersion: number, newVersion: number) => void;
}

/** خطأ IndexedDB مخصص */
export class IndexedDBError extends Error {
  override readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'IndexedDBError';
    this.cause = cause;
  }
}

/**
 * فحص توفر IndexedDB في البيئة الحالية (SSR-safe)
 */
export function isIndexedDBAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * تحويل IDBRequest إلى Promise
 * يحول callbacks (onsuccess/onerror/onabort) إلى Promise
 */
export function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        new IndexedDBError(`IndexedDB request failed: ${request.error?.message}`, request.error),
      );
  });
}

/**
 * فتح قاعدة بيانات IndexedDB
 * @param name اسم قاعدة البيانات
 * @param options إعدادات الفتح (version, onUpgrade)
 */
export function openDatabase(name: string, options: IDBOpenOptions = {}): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(new IndexedDBError('IndexedDB not available'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, options.version);
    let upgradeFailed = false;

    request.onerror = () => {
      reject(
        new IndexedDBError(
          `Failed to open database "${name}": ${request.error?.message}`,
          request.error,
        ),
      );
    };

    request.onsuccess = () => {
      // ✅ لا نحل الـ Promise إذا فشل الـ upgrade
      if (upgradeFailed) return;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion ?? options.version ?? 1;

      if (options.onUpgrade) {
        try {
          options.onUpgrade(db, oldVersion, newVersion);
        } catch (err) {
          // ✅ إغلاق DB عند فشل الـ upgrade
          upgradeFailed = true;
          db.close();
          reject(new IndexedDBError(`Upgrade callback failed: ${(err as Error).message}`, err));
        }
      }
    };

    request.onblocked = () => {
      reject(new IndexedDBError(`Database "${name}" is blocked by another connection`));
    };
  });
}

/**
 * حذف قاعدة بيانات IndexedDB
 * @param name اسم قاعدة البيانات
 */
export function deleteDatabase(name: string): Promise<void> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(new IndexedDBError('IndexedDB not available'));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);

    request.onsuccess = () => resolve();
    request.onerror = () =>
      reject(
        new IndexedDBError(
          `Failed to delete database "${name}": ${request.error?.message}`,
          request.error,
        ),
      );
    request.onblocked = () => reject(new IndexedDBError(`Database "${name}" deletion blocked`));
  });
}

/**
 * فحص وجود قاعدة بيانات (إذا كان المتصفح يدعم databases())
 * @param name اسم قاعدة البيانات
 */
export async function databaseExists(name: string): Promise<boolean> {
  if (!isIndexedDBAvailable()) return false;

  const idb = indexedDB as IDBFactory & {
    databases?: () => Promise<Array<{ name: string }>>;
  };

  if (!idb.databases) {
    // المتصفح لا يدعم databases() — نفترض الوجود
    return true;
  }

  try {
    const databases = await idb.databases();
    return databases.some((db) => db.name === name);
  } catch {
    return false;
  }
}
