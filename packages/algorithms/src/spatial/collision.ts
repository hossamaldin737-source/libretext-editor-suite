/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: collision.ts
 * 📂 المسار: packages/algorithms/src/spatial/collision.ts
 * 🎯 الهدف الرئيسي: كشف التصادم الهندسي والمكاني
 *    - AABB collision detection (O(1))
 *    - Intersection area calculation (O(1))
 *    - Magnetic snap to nearest element (O(n))
 * 📋 المعايير: صفر اعتماديات خارجية، دوال نقية، برمجة دفاعية صارمة
 * 🧪 الاختبارات: packages/algorithms/tests/spatial/collision.test.ts
 * 🏷️ المعرف: ALGO-020
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pure Function Pipeline + Clamped Intersection + Euclidean Distance
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. AABB لا تدعم المستطيلات المُدارة (rotated) — قيد معماري صريح
 *    2. snapToNearestElement بتعقيد O(n) خطي — قد يبطئ مع مئات العناصر
 *    3. دقة الفاصلة العائمة في getIntersectionArea — لا تقريب افتراضي
 *    4. checkCollision تستخدم < صارمة (التلامس على الحافة ≠ تصادم)،
 *       لكن isPointInRect تستخدم <= شاملة (نقطة على الحافة = داخل المستطيل).
 *       هذا تباين متعمد بين "تصادم مساحي" و"احتواء نقطي" — وليس خطأ.
 *       لا تفترض تطابق سلوك الحافة بين الدالتين.
 *    5. snapToNearestElement تتجاهل بصمت (silent skip) أي عنصر بـ bounds
 *       غير صالحة (بدل رمي استثناء) — قرار متعمد لتفادي كسر الجذب
 *       المغناطيسي بالكامل بسبب عنصر واحد فاسد ضمن قائمة كبيرة.
 *       هذا استثناء صريح لقاعدة "throw عند أي مدخل غير صالح" المتبعة
 *       في بقية الملف.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من width > 0 && height > 0 وإلا throw
 *    - رفض NaN / Infinity في أي إحداثي أو threshold
 *    - threshold <= 0 → throw
 *    - استخدام Number.isFinite() لجميع القيم العددية
 *    - استثناء: snapToNearestElement تتجاهل (لا ترمي) عناصر bounds فاسدة
 *      داخل القائمة — انظر Gotcha #5
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#ALGO-020
 *    - 📦 التبعيات: لا توجد (أنواع Rect, Point, SnappableElement, SnapResult
 *      معرّفة محلياً في هذا الملف)
 *    - 🧪 اختبارات: tests/spatial/collision.test.ts
 *    - 📚 مراجع: RESTRUCTURING_PLAN.md §2 (Spatial Translation Engine)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - clamp(): دالة مساعدة للحد من القيم (#L115)
 *    - isValidPoint(): التحقق من صحة النقطة Type Guard (#L120)
 *    - isValidRect(): التحقق من صحة المستطيل Type Guard (#L132)
 *    - validateRect(): التحقق الدفاعي من المستطيل (#L150)
 *    - validatePoint(): التحقق الدفاعي من النقطة (#L172)
 *    - checkCollision(): كشف تصادم AABB، O(1) (#L183)
 *    - getIntersectionArea(): حساب مساحة التقاطع، O(1) (#L200)
 *    - getOverlapRatio(): نسبة تداخل A مع B (0-1)، O(1) (#L215)
 *    - isPointInRect(): هل نقطة داخل مستطيل (حافة شاملة)، O(1) (#L228)
 *    - distanceToRect(): مسافة نقطة إلى أقرب حافة مستطيل، O(1) (#L244)
 *    - findNearestPointOnRect(): حساب أقرب نقطة على محيط أو داخل المستطيل — private (#L260)
 *    - snapToNearestElement(): الجذب المغناطيسي، O(n) (#L303)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - getIntersectionArea لا تستدعي checkCollision لتجنب ازدواج المنطق
 *    - snapToNearestElement تقيس المسافة إلى أقرب حافة وليس المركز
 *    - عند التعادل في snapToNearestElement: أول عنصر بترتيب المصفوفة
 *      (الشرط < وليس <= يضمن ذلك)
 *    - getOverlapRatio وisPointInRect أُضيفتا كدوال مساعدة عامة لم تكن
 *      في الطلب الأصلي؛ تُستخدمان مستقبلاً في محرك الترتيب الطبقي (z-order)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل معروفة حالياً
 *    - 📖 مرجع تقني: AABB Collision Detection
 *      (Real-Time Collision Detection, Christer Ericson)
 *    - 🎯 التحسينات المستقبلية:
 *      1. Spatial Hashing / Quadtree لتقليل snapToNearestElement إلى O(log n)
 *      2. دمج اختياري مستقبلي مع spatial/types.ts (ALGO-007) إن استُحدث
 *         نوع Rect/Point مركزي مشترك عبر الحزمة — غير مطبّق حالياً؛
 *         لا تبعية فعلية قائمة اليوم
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة:
 *    - Real-Time Collision Detection (Christer Ericson) — AABB Algorithm
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** مستطيل متراصف مع المحاور (AABB) */
export interface Rect {
  readonly x: number;      // الزاوية العلوية اليسرى
  readonly y: number;      // نظام إحداثيات: Y يتجه لأسفل
  readonly width: number;  // > 0 إلزامي
  readonly height: number; // > 0 إلزامي
}

/** نقطة ثنائية الأبعاد */
export interface Point {
  readonly x: number;
  readonly y: number;
}

/** عنصر قابل للجذب المغناطيسي */
export interface SnappableElement {
  readonly id: string;
  readonly bounds: Rect;
}

/** نتيجة عملية الجذب المغناطيسي */
export interface SnapResult {
  readonly element: SnappableElement | null;
  readonly point: Point;      // النقطة بعد الجذب (= الأصلية إن لم يوجد جذب)
  readonly snapped: boolean;
}

/** حصر القيمة ضمن حد أدنى وأعلى */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/** Type Guard للتحقق من صحة النقطة */
export function isValidPoint(p: unknown): p is Point {
  if (!p || typeof p !== 'object') return false;
  const candidate = p as Record<string, unknown>;
  return (
    typeof candidate.x === 'number' &&
    typeof candidate.y === 'number' &&
    Number.isFinite(candidate.x) &&
    Number.isFinite(candidate.y)
  );
}

/** Type Guard للتحقق من صحة المستطيل وأبعاده الموجبة */
export function isValidRect(r: unknown): r is Rect {
  if (!r || typeof r !== 'object') return false;
  const candidate = r as Record<string, unknown>;
  return (
    typeof candidate.x === 'number' &&
    typeof candidate.y === 'number' &&
    typeof candidate.width === 'number' &&
    typeof candidate.height === 'number' &&
    Number.isFinite(candidate.x) &&
    Number.isFinite(candidate.y) &&
    Number.isFinite(candidate.width) &&
    Number.isFinite(candidate.height) &&
    candidate.width > 0 &&
    candidate.height > 0
  );
}

/** التحقق الدفاعي من صحة المستطيل وأبعاده مع رسائل خطأ تفصيلية */
export function validateRect(r: Rect, name = 'rect'): void {
  if (
    typeof r.x !== 'number' ||
    typeof r.y !== 'number' ||
    typeof r.width !== 'number' ||
    typeof r.height !== 'number' ||
    !Number.isFinite(r.x) ||
    !Number.isFinite(r.y) ||
    !Number.isFinite(r.width) ||
    !Number.isFinite(r.height)
  ) {
    throw new Error(`Invalid ${name}: coordinates and dimensions must be finite numbers.`);
  }
  if (r.width <= 0) {
    throw new Error(`Invalid ${name} width: must be strictly positive (> 0).`);
  }
  if (r.height <= 0) {
    throw new Error(`Invalid ${name} height: must be strictly positive (> 0).`);
  }
}

/** التحقق الدفاعي من صحة النقطة */
export function validatePoint(p: Point): void {
  if (!isValidPoint(p)) {
    throw new Error('Invalid point: x and y coordinates must be finite numbers.');
  }
}

/**
 * فحص تصادم مستطيلين باستخدام خوارزمية AABB
 * ⚠️ ملاحظة: التلامس على الحافة فقط (<) يُعتبر عدم تصادم
 * تعقيد زمني: O(1)
 */
export function checkCollision(a: Rect, b: Rect): boolean {
  validateRect(a, 'rect A');
  validateRect(b, 'rect B');

  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * حساب مساحة التقاطع بين مستطيلين
 * تُعيد 0 عند عدم وجود تقاطع
 * تعقيد زمني: O(1)
 */
export function getIntersectionArea(a: Rect, b: Rect): number {
  validateRect(a, 'rect A');
  validateRect(b, 'rect B');

  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));

  return xOverlap * yOverlap;
}

/**
 * حساب نسبة تداخل المستطيل A مع المستطيل B بالنسبة لمساحة A
 * القيمة تتراوح بين 0.0 (لا تداخل) إلى 1.0 (تداخل كامل لـ A)
 * تعقيد زمني: O(1)
 */
export function getOverlapRatio(a: Rect, b: Rect): number {
  validateRect(a, 'rect A');
  validateRect(b, 'rect B');

  const intersection = getIntersectionArea(a, b);
  const areaA = a.width * a.height;
  return areaA > 0 ? intersection / areaA : 0;
}

/**
 * فحص ما إذا كانت النقطة تقع داخل المستطيل أو على حدوده (شاملة الحدود)
 * تعقيد زمني: O(1)
 */
export function isPointInRect(point: Point, rect: Rect): boolean {
  validatePoint(point);
  validateRect(rect);

  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * حساب أقصر مسافة إقليدية من نقطة إلى مستطيل (0 إذا كانت النقطة داخله)
 * تعقيد زمني: O(1)
 */
export function distanceToRect(point: Point, rect: Rect): number {
  validatePoint(point);
  validateRect(rect);

  const clampedX = clamp(point.x, rect.x, rect.x + rect.width);
  const clampedY = clamp(point.y, rect.y, rect.y + rect.height);
  const dx = point.x - clampedX;
  const dy = point.y - clampedY;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * حساب أقرب نقطة على محيط أو داخل المستطيل بالنسبة لنقطة معينة
 * مع حساب المسافة الإقليدية إلى حافة المستطيل
 */
function findNearestPointOnRect(point: Point, rect: Rect): { nearest: Point; distance: number } {
  const clampedX = clamp(point.x, rect.x, rect.x + rect.width);
  const clampedY = clamp(point.y, rect.y, rect.y + rect.height);

  const isInside = point.x >= rect.x && point.x <= rect.x + rect.width &&
                   point.y >= rect.y && point.y <= rect.y + rect.height;

  if (!isInside) {
    const dx = point.x - clampedX;
    const dy = point.y - clampedY;
    return {
      nearest: { x: clampedX, y: clampedY },
      distance: Math.sqrt(dx * dx + dy * dy),
    };
  }

  // داخل المستطيل: أقرب حافة من الحواف الأربعة
  const distToLeft = point.x - rect.x;
  const distToRight = (rect.x + rect.width) - point.x;
  const distToTop = point.y - rect.y;
  const distToBottom = (rect.y + rect.height) - point.y;

  const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

  let snapX = point.x;
  let snapY = point.y;

  if (minDist === distToLeft) snapX = rect.x;
  else if (minDist === distToRight) snapX = rect.x + rect.width;
  else if (minDist === distToTop) snapY = rect.y;
  else snapY = rect.y + rect.height;

  return {
    nearest: { x: snapX, y: snapY },
    distance: minDist,
  };
}

/**
 * الجذب المغناطيسي للنقطة إلى أقرب حافة لأحد العناصر المحيطة
 * تعقيد زمني: O(n)
 * يتخطى صامتاً أي عنصر ذي حدود غير صالحة لضمان سلاسة السحب والإفلات
 */
export function snapToNearestElement(
  point: Point,
  elements: readonly SnappableElement[],
  threshold: number
): SnapResult {
  validatePoint(point);

  if (typeof threshold !== 'number' || !Number.isFinite(threshold) || threshold <= 0) {
    throw new Error('Threshold must be a strictly positive finite number (> 0).');
  }

  let bestElement: SnappableElement | null = null;
  let bestPoint: Point = point;
  let minDistance = Infinity;

  for (const element of elements) {
    if (!element || !isValidRect(element.bounds)) {
      // تخطي صامت للعناصر غير الصالحة وفق Gotcha #5
      continue;
    }
    const { nearest, distance } = findNearestPointOnRect(point, element.bounds);

    if (distance <= threshold && distance < minDistance) {
      minDistance = distance;
      bestElement = element;
      bestPoint = nearest;
    }
  }

  if (bestElement !== null) {
    return {
      element: bestElement,
      point: bestPoint,
      snapped: true,
    };
  }

  return {
    element: null,
    point,
    snapped: false,
  };
}
