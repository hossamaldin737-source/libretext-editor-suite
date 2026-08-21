/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.ts
 * 📂 المسار: packages/templates/src/registry.ts
 * 🎯 الهدف الرئيسي: سجل مركزي عام (Generic) وقابل للتوسع لإدارة واسترجاع القوالب
 * 📋 المعايير: Generics, Open Domains, Query Pattern, Pluggable Validation
 * 🧪 الاختبارات: packages/templates/tests/registry.test.ts
 * 🏷️ المعرف: TPL-001
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🔄 آخر تحديث: 2026-08-20 (v2.0: 3 Critical Fixes Applied)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Registry Pattern + Open Domain Registration + Query/Predicate Pattern
 *    + Event-Driven + Pluggable Validation + Pluggable Clone Strategy
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆘 الإصلاحات الحرجة المطبقة (v2.0):
 *    1. size() تستدعي ensureOpen() الآن (اتساق مع بقية الدوال)
 *    2. unregister() تمرر القالب المحذوف مع حدث REMOVED
 *    3. إضافة update() — يحافظ على createdAt ويزيد version تلقائياً
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. كل قالب يجب أن يكون له id فريد
 *    2. strictDomains يتطلب registerDomain() قبل استخدام النطاق
 *    3. apply() يعيد نسخة مستنسخة وليس مرجعاً مباشراً
 *    4. update() يحافظ على createdAt ويزيد version تلقائياً
 *    5. close() يمنع أي عمليات لاحقة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - validateTemplate() ثنائية الطبقة (بنيوي + مدققات النطاق)
 *    - Event listener isolation (try/catch لكل listener)
 *    - ensureOpen() في جميع الدوال العامة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📦 التبعيات: registry-types.ts (TPL-010), @libretext/core
 *    - 📄 مرتبط مباشر: writer/, calc/, impress/, base/ (TPL-002..005)
 *    - 🧪 اختبارات: tests/registry.test.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - TemplateRegistry.create(): مصنع ذكي (~#L105)
 *    - registerDomain(): تسجيل نطاق ديناميكي (~#L115)
 *    - register(): تسجيل قالب (~#L130)
 *    - update(): تحديث قالب مع الحفاظ على metadata (~#L155) ← جديد v2.0
 *    - get(): استرجاع قالب (~#L180)
 *    - list(): قائمة حسب نطاق (~#L185)
 *    - find(): استعلام متقدم (~#L195)
 *    - apply(): تطبيق مع استنساخ (~#L220)
 *    - unregister(): حذف مع تمرير القالب للحدث (~#L235) ← مُصلح v2.0
 *    - has(): فحص الوجود (~#L250)
 *    - size(): الحجم مع ensureOpen (~#L255) ← مُصلح v2.0
 *    - clear(): مسح (~#L260)
 *    - on(): اشتراك في الأحداث (~#L275)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: ALGO-002, STORE-010 Patterns
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { generateId } from '@libretext/core';
import {
  type Template,
  type TemplateEvent,
  type TemplateEventListener,
  type TemplateEventTypeValue,
  type TemplateUnsubscribeFn,
  type TemplateQuery,
  type TemplateRegistryConfig,
  type ResolvedConfig,
  type DomainValidator,
  type TemplateDomainValue,
  type OfficeDomain,
  type DocumentTemplate,
  TemplateEventType,
  TemplateDomain,
  resolveConfig,
  escapeRegExp,
} from './registry-types';

export * from './registry-types';

/**
 * سجل القوالب المركزي — عام (Generic) ومفتوح للتوسع.
 */
export class TemplateRegistry<TContent = import('@libretext/core').DocNode> {
  readonly name: string;

  private readonly config: ResolvedConfig<TContent>;
  private readonly templates: Map<string, Template<TContent>>;
  private readonly listeners: Map<TemplateEventTypeValue, Set<TemplateEventListener<TContent>>>;
  private readonly domainValidators: Map<TemplateDomainValue, DomainValidator<TContent>[]>;
  private closed: boolean;

  constructor(config: TemplateRegistryConfig<TContent> = {}) {
    this.config = resolveConfig(config);
    this.name = `template-registry-${generateId()}`;
    this.templates = new Map();
    this.listeners = new Map();
    this.domainValidators = new Map();
    this.closed = false;

    for (const domain of Object.values(TemplateDomain)) {
      this.domainValidators.set(domain, []);
    }
  }

  static create<T = import('@libretext/core').DocNode>(
    config: TemplateRegistryConfig<T> = {},
  ): TemplateRegistry<T> {
    return new TemplateRegistry<T>(config);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Domain Management
  // ─────────────────────────────────────────────────────────────────────────

  registerDomain(
    domain: TemplateDomainValue,
    validators: readonly DomainValidator<TContent>[] = [],
  ): void {
    this.ensureOpen();
    if (!domain || domain.trim().length === 0) {
      throw new Error('Domain name cannot be empty');
    }
    const existing = this.domainValidators.get(domain) ?? [];
    this.domainValidators.set(domain, [...existing, ...validators]);
    this.emitEvent(TemplateEventType.DOMAIN_REGISTERED, undefined, domain);
  }

  hasDomain(domain: TemplateDomainValue): boolean {
    return this.domainValidators.has(domain);
  }

  listDomains(): readonly TemplateDomainValue[] {
    return Array.from(this.domainValidators.keys());
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────────────

  register(template: Template<TContent>): void {
    this.ensureOpen();
    const normalized = this.normalizeTemplate(template);
    this.validateTemplate(normalized);

    if (this.templates.has(normalized.id)) {
      throw new Error(`Template with id "${normalized.id}" already exists`);
    }
    if (this.templates.size >= this.config.maxTemplates) {
      throw new Error(`Maximum templates limit: ${this.config.maxTemplates}`);
    }

    this.templates.set(normalized.id, normalized);
    this.runStorageHook('save', () => this.config.storage?.save(normalized));
    this.emitEvent(TemplateEventType.ADDED, normalized);
  }

  /**
   * تحديث قالب موجود (TPL-API-004) — جديد في v2.0
   * يحافظ على createdAt ويزيد version تلقائياً
   */
  update(
    id: string,
    patch: Partial<Pick<Template<TContent>, 'name' | 'description' | 'content' | 'doc'>>,
  ): Template<TContent> {
    this.ensureOpen();

    const existing = this.templates.get(id);
    if (!existing) {
      throw new Error(`Template not found: ${id}`);
    }

    const nextContent = patch.content ?? patch.doc ?? existing.content ?? existing.doc;
    const now = Date.now();
    const updated: Template<TContent> = {
      ...existing,
      ...patch,
      content: nextContent,
      doc: nextContent,
      metadata: {
        createdAt: existing.metadata?.createdAt ?? now,
        updatedAt: now,
        version: (existing.metadata?.version ?? 1) + 1,
        tags: existing.metadata?.tags,
        author: existing.metadata?.author,
        license: existing.metadata?.license,
        language: existing.metadata?.language,
      },
    };

    this.validateTemplate(updated);
    this.templates.set(id, updated);
    this.runStorageHook('save', () => this.config.storage?.save(updated));
    this.emitEvent(TemplateEventType.UPDATED, updated);
    return this.cloneTemplate(updated);
  }

  get(id: string): Template<TContent> | null {
    this.ensureOpen();
    const t = this.templates.get(id);
    if (!t) return null;
    return this.cloneTemplate(t);
  }

  list(domain?: TemplateDomainValue): readonly Template<TContent>[] {
    this.ensureOpen();
    if (!domain) {
      return Array.from(this.templates.values()).map((t) => this.cloneTemplate(t));
    }
    return this.find({ domain });
  }

  getByDomain(domain: TemplateDomainValue): Template<TContent>[] {
    return Array.from(this.list(domain));
  }

  getAll(): Template<TContent>[] {
    return Array.from(this.list());
  }

  find(query: TemplateQuery<TContent>): readonly Template<TContent>[] {
    this.ensureOpen();
    let results = Array.from(this.templates.values());

    if (query.domain) {
      results = results.filter((t) => t.domain === query.domain);
    }
    if (query.tags && query.tags.length > 0) {
      results = results.filter((t) => {
        const tplTags = t.metadata?.tags ?? [];
        return query.tags!.every((tag) => tplTags.includes(tag));
      });
    }
    if (query.namePattern) {
      const regex =
        query.namePattern instanceof RegExp
          ? query.namePattern
          : new RegExp(escapeRegExp(query.namePattern), 'i');
      results = results.filter((t) => regex.test(t.name));
    }
    if (query.predicate) {
      results = results.filter(query.predicate);
    }
    return results.map((t) => this.cloneTemplate(t));
  }

  apply(templateId: string): TContent {
    this.ensureOpen();
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    const content = (template.content ?? template.doc) as TContent;
    const cloned = this.config.cloneContent(content);
    this.emitEvent(TemplateEventType.APPLIED, template);
    return cloned;
  }

  /**
   * حذف قالب — مُصلح في v2.0: يمرر القالب المحذوف مع حدث REMOVED
   */
  unregister(id: string): boolean {
    this.ensureOpen();
    const existing = this.templates.get(id);
    if (!existing) return false;

    this.templates.delete(id);
    this.runStorageHook('remove', () => this.config.storage?.remove(id));
    this.emitEvent(TemplateEventType.REMOVED, existing);
    return true;
  }

  has(id: string): boolean {
    this.ensureOpen();
    return this.templates.has(id);
  }

  /** مُصلح في v2.0: يستدعي ensureOpen() للاتساق مع بقية الدوال */
  size(): number {
    this.ensureOpen();
    return this.templates.size;
  }

  clear(): void {
    this.ensureOpen();
    this.templates.clear();
    this.runStorageHook('clear', () => this.config.storage?.clear());
    this.emitEvent(TemplateEventType.CLEARED);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Event System
  // ─────────────────────────────────────────────────────────────────────────

  on(
    eventType: TemplateEventTypeValue,
    listener: TemplateEventListener<TContent>,
  ): TemplateUnsubscribeFn {
    this.ensureOpen();
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const set = this.listeners.get(eventType)!;
    set.add(listener);
    return () => {
      set.delete(listener);
    };
  }

  private emitEvent(
    type: TemplateEventTypeValue,
    template?: Template<TContent>,
    domain?: TemplateDomainValue,
  ): void {
    if (!this.config.enableEvents) return;
    const set = this.listeners.get(type);
    if (!set || set.size === 0) return;

    const event: TemplateEvent<TContent> = {
      type,
      template,
      domain,
      totalTemplates: this.templates.size,
      timestamp: Date.now(),
    };

    for (const listener of set) {
      try {
        listener(event);
      } catch (err) {
        console.error(`Template event listener error (${type}):`, err);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────

  close(): void {
    this.listeners.clear();
    this.templates.clear();
    this.domainValidators.clear();
    this.closed = true;
  }

  isOpen(): boolean {
    return !this.closed;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Internal Helpers
  // ─────────────────────────────────────────────────────────────────────────

  private normalizeTemplate(template: Template<TContent>): Template<TContent> {
    const content = template.content ?? template.doc;
    const now = Date.now();
    const normalized: Record<string, unknown> = {
      ...template,
      content,
      metadata: template.metadata ?? {
        createdAt: now,
        updatedAt: now,
        version: 1,
      },
    };
    if (template.doc !== undefined) {
      normalized.doc = template.doc;
    }
    return normalized as unknown as Template<TContent>;
  }

  private cloneTemplate(t: Template<TContent>): Template<TContent> {
    const rawContent = (t.content ?? t.doc) as TContent;
    const content = rawContent ? this.config.cloneContent(rawContent) : rawContent;
    const cloned: Record<string, unknown> = {
      ...t,
      content,
      metadata: t.metadata ? { ...t.metadata } : undefined,
    };
    if (t.doc !== undefined) {
      cloned.doc = t.doc ? this.config.cloneContent(t.doc) : t.doc;
    }
    return cloned as unknown as Template<TContent>;
  }

  private validateTemplate(template: Template<TContent>): void {
    if (!template.id || template.id.trim().length === 0) {
      throw new Error('Template id cannot be empty');
    }
    if (!template.name || template.name.trim().length === 0) {
      throw new Error('Template name cannot be empty');
    }
    if (!template.domain || template.domain.trim().length === 0) {
      throw new Error('Template domain cannot be empty');
    }
    if (this.config.strictDomains && !this.domainValidators.has(template.domain)) {
      throw new Error(
        `Unknown domain "${template.domain}". Register it first via registerDomain().`,
      );
    }
    const content = template.content ?? template.doc;
    if (!this.config.contentGuard(content)) {
      throw new Error('Template content failed structural validation');
    }

    const validators = this.domainValidators.get(template.domain) ?? [];
    for (const validate of validators) {
      validate(template);
    }
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new Error(`TemplateRegistry "${this.name}" is closed`);
    }
  }

  private runStorageHook(operation: string, fn: () => Promise<void> | void | undefined): void {
    if (!this.config.storage) return;
    try {
      const result = fn();
      if (result && typeof (result as Promise<void>).catch === 'function') {
        (result as Promise<void>).catch((err) => this.config.onStorageError(err, operation));
      }
    } catch (err) {
      this.config.onStorageError(err, operation);
    }
  }
}

/** دالة مساعدة لإنشاء TemplateRegistry */
export function createTemplateRegistry<TContent = import('@libretext/core').DocNode>(
  config: TemplateRegistryConfig<TContent> = {},
): TemplateRegistry<TContent> {
  return TemplateRegistry.create<TContent>(config);
}

/** السجل الافتراضي العام لمجموعة LibreText */
export const templateRegistry = new TemplateRegistry();
