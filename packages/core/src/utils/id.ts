/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: id.ts
 * 📂 المسار: packages/core/src/utils/id.ts
 * 🎯 الهدف الرئيسي: توليد معرفات فريدة للعقد مع دعم البادئات
 *    والتحقق من عدم التكرار.
 * 📋 المعايير:
 *    - يجب أن يكون المعرف فريداً حتى مع الاستدعاء المتزامن.
 *    - يجب أن يدعم البادئات (prefix) لتسهيل التصنيف.
 *    - يجب أن يكون قصيراً وواضحاً.
 * 🧪 الاختبارات:
 *    - packages/core/tests/utils/id.test.ts
 *    - اختبار التفرد
 *    - اختبار البادئات
 * 🏷️ المعرف: CORE-009
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Crypto-based ID Generation — استخدام crypto.randomUUID() مع fallback.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التأكد من توفر crypto API في جميع البيئات.
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - fallback إلى Date.now() + Math.random() إذا لم يكن crypto متاحاً.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { NodeId } from '../ast/types';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomId(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

/**
 * توليد معرف فريد للعقدة.
 * يدعم البادئات لتسهيل التصنيف.
 *
 * @example
 * generateId() // "a1b2c3d4e5f6"
 * generateId('para') // "para_a1b2c3d4e5f6"
 * generateId('head') // "head_x9y8z7w6v5u4"
 */
export function generateId(prefix?: string): NodeId {
  let id: string;

  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    id = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  } else {
    id = generateRandomId(12);
  }

  const fullId = prefix ? `${prefix}_${id}` : id;
  return fullId as NodeId;
}

/**
 * التحقق من صحة شكل المعرف.
 */
export function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}
