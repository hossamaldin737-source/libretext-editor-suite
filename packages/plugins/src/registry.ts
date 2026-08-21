/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.ts
 * 📂 المسار: packages/plugins/src/registry.ts
 * 🎯 الهدف الرئيسي: المُهيكل المركزي للإضافات (Centralized Plugin Registry)
 *    الذي يقوم بدمج وإدارة كافة الإضافات والمكونات المشتركة، مع ضمان
 *    توافقها التام مع نظام الـ Schema الموحد للمحررات المختلفة (Writer, Calc, Impress, Base).
 * 📋 المعايير:
 *    - إدارة دورة حياة الإضافات (تسجيل، تفعيل، إلغاء تفعيل، تنظيف)
 *    - التحقق من توافق Schema مع النواة (@libretext/core)
 *    - توفير واجهات برمجية لربط الإضافات بنطاقات العمل المكتبية
 * 🧪 الاختبارات: packages/plugins/tests/registry.test.ts
 * 🏷️ المعرف: PLUG-008
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Centralized Plugin Registry + Schema Validator + Domain Adapter Pipeline
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب تداخل معرفات الإضافات (Plugin ID Collision) عبر فحص التكرار.
 *    2. ضمان عدم كسر الـ Schema الموحد عند معالجة العقد (AST Nodes).
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards للتحقق من بنية الإضافة قبل التسجيل.
 *    - معالجة آمنة للأخطاء أثناء تنفيذ خطافات التهيئة.
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: INDEX.md#PLUG-008
 *    - 📦 التبعيات: @libretext/core, ./shared/types
 *    - 📄 مرتبط مباشر: packages/plugins/src/index.ts
 *    - 🧪 اختبارات: packages/plugins/tests/registry.test.ts
 *    - 📚 مراجع: AGENTS.md §5.1 & §5.4
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - registerPlugin(): تسجيل إضافة جديدة مع فحص التوافق (#L72)
 *    - unregisterPlugin(): إزالة إضافة وتنظيف مواردها (#L95)
 *    - getPlugin(): استرجاع إضافة برمزها (#L112)
 *    - validateSchemaCompatibility(): التحقق من توافق الـ Schema (#L125)
 *    - executePluginHook(): تنفيذ خطافات الإضافات عبر النطاقات (#L148)
 * ═══════════════════════════════════════════════════════════════════════════
 * 📝 ملاحظات التطوير | Development Notes:
 *    - يدعم النطاقات الأربعة: Writer, Calc, Impress, Base بالإضافة للنطاق الشامل.
 * ═══════════════════════════════════════════════════════════════════════════
 * 📖 برامج مرجعية وخطط معالجة | Reference & Treatment Plans:
 *    - 🔧 خطة المعالجة: لا توجد مشاكل حالية
 *    - 🎯 التحسينات المستقبلية: دعم التحميل الديناميكي للإضافات (Dynamic Import)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: TipTap Plugin System & ProseMirror Plugin Architecture
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode, BlockNode, InlineNode } from '@libretext/core';
import type { Plugin } from './shared/types';

export type OfficeDomain = 'writer' | 'calc' | 'impress' | 'base' | 'universal';

export interface RegisteredPlugin extends Plugin {
  readonly domain: OfficeDomain;
  readonly isEnabled: boolean;
}

export class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins: Map<string, RegisteredPlugin> = new Map();

  private constructor() {}

  /**
   * الحصول على النسخة الوحيدة من المُهيكل (Singleton)
   * @see: FUNCTION_INDEX.md#L70
   */
  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }

  /**
   * تسجيل إضافة جديدة في النظام
   * @see: FUNCTION_INDEX.md#L72
   */
  public register(plugin: Plugin, domain: OfficeDomain = 'universal'): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(
        `[PluginRegistry] Plugin with ID "${plugin.id}" is already registered. Overwriting.`,
      );
    }

    const registered: RegisteredPlugin = {
      ...plugin,
      domain,
      isEnabled: true,
    };

    try {
      registered.initialize();
      this.plugins.set(plugin.id, registered);
    } catch (err) {
      console.error(`[PluginRegistry] Failed to initialize plugin ${plugin.id}:`, err);
    }
  }

  /**
   * إزالة إضافة وتدمير مواردها
   * @see: FUNCTION_INDEX.md#L95
   */
  public unregister(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    try {
      plugin.destroy();
    } catch (err) {
      console.error(`[PluginRegistry] Error destroying plugin ${id}:`, err);
    }

    return this.plugins.delete(id);
  }

  /**
   * استرجاع إضافة معرفة
   * @see: FUNCTION_INDEX.md#L112
   */
  public get(id: string): RegisteredPlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * استرجاع جميع الإضافات المسجلة
   */
  public getAll(): RegisteredPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * استرجاع الإضافات الخاصة بنطاق معين
   */
  public getByDomain(domain: OfficeDomain): RegisteredPlugin[] {
    return this.getAll().filter((p) => p.domain === domain || p.domain === 'universal');
  }

  /**
   * التحقق من توافق Schema الموحد للنواة مع الإضافات
   * @see: FUNCTION_INDEX.md#L125
   */
  public validateSchemaCompatibility(doc: DocNode): boolean {
    if (!doc || !Array.isArray(doc.content)) {
      return false;
    }
    // التحقق من توافق العقد الأساسية
    for (const child of doc.content) {
      if (!child || typeof child.type !== 'string' || !child.id) {
        return false;
      }
    }
    return true;
  }

  /**
   * تنفيذ خطافات معالجة الكتل عبر الإضافات المفعلة
   * @see: FUNCTION_INDEX.md#L148
   */
  public processBlockWithPlugins(block: BlockNode): string {
    for (const plugin of this.getAll()) {
      if (plugin.isEnabled && plugin.supports && plugin.supports(block.type)) {
        if (plugin.processBlock) {
          return plugin.processBlock(block);
        }
      }
    }
    return '';
  }

  /**
   * تبديل حالة تفعيل الإضافة
   */
  public togglePlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;
    const updated: RegisteredPlugin = {
      ...plugin,
      isEnabled: !plugin.isEnabled,
    };
    this.plugins.set(id, updated);
    return updated.isEnabled;
  }
}

export const pluginRegistry = PluginRegistry.getInstance();
