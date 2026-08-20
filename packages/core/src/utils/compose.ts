/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: compose.ts
 * 📂 المسار: packages/core/src/utils/compose.ts
 * 🎯 الهدف الرئيسي: تكوين دوال متعددة في دالة واحدة (Right-to-Left).
 *    مثال: compose(f, g, h) تعني f(g(h(x))).
 * 📋 المعايير:
 *    - صفر اعتماديات خارجية.
 *    - دعم الأنواع العامة (Generics).
 *    - يجب أن تحتوي على أقل من 10 أسطر.
 * 🧪 الاختبارات: packages/core/tests/utils/compose.test.ts
 * 🏷️ المعرف: CORE-013
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Right-to-Left Function Composition
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function compose<T>(
  ...fns: ReadonlyArray<(v: T) => T>
): (v: T) => T {
  return (value: T) => fns.reduceRight((acc, fn) => fn(acc), value);
}
