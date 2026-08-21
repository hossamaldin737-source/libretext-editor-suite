/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/adapters/src/shared/types.ts
 * 🎯 الهدف الرئيسي: تعريف واجهات المحاور المشتركة.
 * 📋 المعايير:
 *    - يجب أن تتوافق جميع المحاور مع الواجهة المحددة.
 * 🏷️ المعرف: ADAP-005
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Adapter Interface — واجهة موحدة لجميع المحاور.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode, BlockNode, InlineNode } from '@libretext/core';

/**
 * خيارات المحور.
 */
export interface AdapterOptions {
  /** المستند الأولي */
  initialDoc?: DocNode;
  /** وضع القراءة فقط */
  readOnly?: boolean;
  /** callbacks */
  onContentChange?: (doc: DocNode) => void;
  onSelectionChange?: (selection: Selection | null) => void;
}

/**
 * حالة التحديد.
 */
export interface Selection {
  /** معرف العقدة المحددة */
  nodeId: string;
  /** بداية التحديد */
  startOffset: number;
  /** نهاية التحديد */
  endOffset: number;
}

/**
 * واجهة المحور الأساسية.
 */
export interface EditorAdapter {
  /** تهيئة المحور */
  initialize(container: HTMLElement): void;
  /** تدمير المحور */
  destroy(): void;
  /** الحصول على المستند الحالي */
  getDocument(): DocNode;
  /** تعيين المستند */
  setDocument(doc: DocNode): void;
  /** الحصول على التحديد الحالي */
  getSelection(): Selection | null;
  /** تعيين التحديد */
  setSelection(selection: Selection): void;
  /** التحقق من حالة القراءة فقط */
  isReadOnly(): boolean;
  /** تغيير وضع القراءة فقط */
  setReadOnly(readOnly: boolean): void;
}

/**
 * مُهيئ المحور.
 */
export type AdapterFactory<T extends EditorAdapter = EditorAdapter> = (
  options?: AdapterOptions,
) => T;
