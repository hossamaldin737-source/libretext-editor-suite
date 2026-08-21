/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry-types.ts
 * 📂 المسار: packages/templates/src/registry-types.ts
 * 🎯 الهدف الرئيسي: أنواع وواجهات وثوابت نظام القوالب (فصل عن المنطق)
 * 📋 المعايير: Generics, Open Domains, Pluggable Strategies
 * 🧪 الاختبارات: packages/templates/tests/registry.test.ts
 * 🏷️ المعرف: TPL-010
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Separation of Concerns — Types vs Logic split for maintainability
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. TemplateDomainValue هو string حر — ليس enum مغلق
 *    2. ContentGuard الافتراضي يتحقق من بنية DocNode الدنيا فقط
 *    3. structuredClone قد يفشل مع الدوال — استخدم cloneContent مخصصة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - defaultContentGuard يتحقق من type field
 *    - defaultCloneContent مع JSON fallback
 *    - resolveConfig يضمن وجود جميع الحقول
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: @libretext/core (DocNode)
 *    - 📄 مرتبط مباشر: registry.ts (TPL-001)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - defaultContentGuard(): حارس نوع افتراضي (#L155)
 *    - defaultCloneContent(): استنساخ افتراضي (#L170)
 *    - resolveConfig(): حل الإعدادات (#L195)
 *    - escapeRegExp(): تنظيف RegExp (#L215)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode } from '@libretext/core';

// ─────────────────────────────────────────────────────────────────────────────
// النطاقات المكتبية (Office Domains) — مفتوحة للتوسع
// ─────────────────────────────────────────────────────────────────────────────

/** النطاقات المعروفة افتراضياً (اقتراحات وليست قائمة مقفولة) */
export const TemplateDomain = {
  WRITER: 'writer',
  CALC: 'calc',
  IMPRESS: 'impress',
  BASE: 'base',
} as const;

/** أي نص يمكن أن يكون نطاقاً — القائمة أعلاه مجرد قيم افتراضية */
export type TemplateDomainValue = string;
export type OfficeDomain = 'writer' | 'calc' | 'impress' | 'base' | string;

// ─────────────────────────────────────────────────────────────────────────────
// أنواع الأحداث (Event Types)
// ─────────────────────────────────────────────────────────────────────────────

export const TemplateEventType = {
  ADDED: 'template_added',
  UPDATED: 'template_updated',
  REMOVED: 'template_removed',
  APPLIED: 'template_applied',
  CLEARED: 'template_cleared',
  DOMAIN_REGISTERED: 'domain_registered',
} as const;

export type TemplateEventTypeValue = (typeof TemplateEventType)[keyof typeof TemplateEventType];

// ─────────────────────────────────────────────────────────────────────────────
// أنماط القوالب (Template Styles)
// ─────────────────────────────────────────────────────────────────────────────

export const TemplateStyle = {
  PROFESSIONAL: 'professional',
  MODERN: 'modern',
  MINIMAL: 'minimal',
  CREATIVE: 'creative',
  ACADEMIC: 'academic',
  CUSTOM: 'custom',
} as const;

export type TemplateStyleValue = (typeof TemplateStyle)[keyof typeof TemplateStyle];

// ─────────────────────────────────────────────────────────────────────────────
// أنواع البيانات العامة (Generic Data Types)
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateMetadata {
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly version: number;
  readonly tags?: readonly string[];
  readonly author?: string;
  readonly license?: string;
  readonly language?: string;
}

export interface Template<TContent = DocNode> {
  readonly id: string;
  readonly name: string;
  readonly domain: TemplateDomainValue;
  readonly style?: TemplateStyleValue;
  readonly category?: string;
  readonly description?: string;
  readonly preview?: string;
  readonly content?: TContent;
  readonly doc?: TContent;
  readonly metadata?: TemplateMetadata;
}

export type DocumentTemplate = Template<DocNode>;

export interface TemplateEvent<TContent = DocNode> {
  readonly type: TemplateEventTypeValue;
  readonly template?: Template<TContent>;
  readonly domain?: TemplateDomainValue;
  readonly totalTemplates: number;
  readonly timestamp: number;
}

export type TemplateEventListener<TContent = DocNode> = (event: TemplateEvent<TContent>) => void;

export type TemplateUnsubscribeFn = () => void;

// ─────────────────────────────────────────────────────────────────────────────
// نظام الاستعلام (Query Pattern)
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateQuery<TContent = DocNode> {
  readonly domain?: TemplateDomainValue;
  readonly tags?: readonly string[];
  readonly namePattern?: string | RegExp;
  readonly predicate?: (template: Template<TContent>) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// التحقق القابل للتوصيل (Pluggable Validation)
// ─────────────────────────────────────────────────────────────────────────────

export type ContentGuard<TContent = DocNode> = (content: unknown) => content is TContent;

export const defaultContentGuard: ContentGuard<DocNode> = (content): content is DocNode => {
  if (content === null || typeof content !== 'object') return false;
  const node = content as Record<string, unknown>;
  return typeof node.type === 'string' && node.type.trim().length > 0;
};

export type DomainValidator<TContent = DocNode> = (template: Template<TContent>) => void;

// ─────────────────────────────────────────────────────────────────────────────
// استراتيجية الاستنساخ القابلة للتوصيل (Pluggable Clone Strategy)
// ─────────────────────────────────────────────────────────────────────────────

export type CloneContentFn<TContent = DocNode> = (content: TContent) => TContent;

export function defaultCloneContent<TContent>(content: TContent): TContent {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(content);
    } catch {
      // Fallback below
    }
  }
  return JSON.parse(JSON.stringify(content)) as TContent;
}

// ─────────────────────────────────────────────────────────────────────────────
// طبقة التخزين القابلة للحقن (Injectable Storage)
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateStorage<TContent = DocNode> {
  save(template: Template<TContent>): Promise<void> | void;
  remove(id: string): Promise<void> | void;
  clear(): Promise<void> | void;
}

// ─────────────────────────────────────────────────────────────────────────────
// الإعدادات (Configuration)
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateRegistryConfig<TContent = DocNode> {
  readonly enableEvents?: boolean;
  readonly maxTemplates?: number;
  readonly strictDomains?: boolean;
  readonly contentGuard?: ContentGuard<TContent>;
  readonly cloneContent?: CloneContentFn<TContent>;
  readonly storage?: TemplateStorage<TContent>;
  readonly onStorageError?: (error: unknown, operation: string) => void;
}

export interface ResolvedConfig<TContent> {
  readonly enableEvents: boolean;
  readonly maxTemplates: number;
  readonly strictDomains: boolean;
  readonly contentGuard: ContentGuard<TContent>;
  readonly cloneContent: CloneContentFn<TContent>;
  readonly storage?: TemplateStorage<TContent>;
  readonly onStorageError: (error: unknown, operation: string) => void;
}

export function resolveConfig<TContent>(
  config: TemplateRegistryConfig<TContent>,
): ResolvedConfig<TContent> {
  return {
    enableEvents: config.enableEvents ?? true,
    maxTemplates: config.maxTemplates ?? 1000,
    strictDomains: config.strictDomains ?? false,
    contentGuard:
      (config.contentGuard as ContentGuard<TContent> | undefined) ??
      (defaultContentGuard as unknown as ContentGuard<TContent>),
    cloneContent: config.cloneContent ?? defaultCloneContent,
    storage: config.storage,
    onStorageError:
      config.onStorageError ??
      ((error, operation) => {
        console.error(`TemplateStorage error during "${operation}":`, error);
      }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// أدوات مساعدة (Helpers)
// ─────────────────────────────────────────────────────────────────────────────

export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
