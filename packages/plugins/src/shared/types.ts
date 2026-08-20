/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: types.ts
 * 📂 المسار: packages/plugins/src/shared/types.ts
 * 🎯 الهدف الرئيسي: تعريف واجهات الإضافات المشتركة.
 * 📋 المعايير:
 *    - يجب أن تتوافق جميع الإضافات مع الواجهة المحددة.
 * 🏷️ المعرف: PLUG-003
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Plugin Interface — واجهة موحدة لجميع الإضافات.
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {BlockNode, DocNode, InlineNode} from '@libretext/core';

/**
 * واجهة الإضافة الأساسية.
 */
export interface Plugin {
  /** معرف فريد للإضافة */
  readonly id: string;
  /** اسم الإضافة */
  readonly name: string;
  /** وصف الإضافة */
  readonly description: string;
  /** إصدار الإضافة */
  readonly version: string;

  /**
   * تهيئة الإضافة.
   */
  initialize(): void;

  /**
   * تنظيف موارد الإضافة.
   */
  destroy(): void;

  /**
   * معالجة كتلة AST.
   */
  processBlock?(block: BlockNode): string;

  /**
   * معالجة عنصر مضمن.
   */
  processInline?(node: InlineNode): string;

  /**
   * التحقق من دعم نوع معين.
   */
  supports?(type: string): boolean;
}

/**
 * خيارات الإضافة.
 */
export interface PluginOptions {
  /** مسار المكتبة الخارجية (اختياري) */
  libraryUrl?: string;
  /** إعدادات مخصصة */
  settings?: Record<string, unknown>;
}

/**
 * نتيجة معالجة الإضافة.
 */
export interface PluginResult {
  /** المحتوى المُعالج */
  content: string;
  /** هل تم التحقق بنجاح */
  success: boolean;
  /** رسالة خطأ اختيارية */
  error?: string;
}

/**
 * سياق الإضافة الموسّع.
 */
export interface PluginContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerCommand(command: {id: string; name: string; handler: (...args: any[]) => any}): void;
  getDocument?(): DocNode;
  setDocument?(doc: DocNode): void;
}

/**
 * واجهة الإضافة الموسّعة (للإضافات المتقدمة).
 */
export interface EditorPlugin {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  init?(context: PluginContext): void;
  destroy?(): void;
  hooks?: {
    beforeRender?(node: BlockNode): BlockNode;
    afterRender?(html: string): string;
  };
}
