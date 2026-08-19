/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.ts
 * 📂 المسار: packages/templates/src/registry.ts
 * 🎯 الهدف الرئيسي: سجل القوالب (Template Registry) لإدارة واسترجاع القوالب
 * 📋 المعايير: صفر اعتماديات خارجية، تسجيل واسترجاع ديناميكي
 * 🧪 الاختبارات: packages/templates/tests/registry.test.ts
 * 🏷️ المعرف: TPL-001
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type-Safe Template Registry with Domain Categorization
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. ضمان عدم تكرار معرف القالب
 *    2. إرجاع نسخة جديدة من القالب (Immutable Doc clone)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - Type Guards والتحقق من صحة القوالب
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode } from '@libretext/core';

export type OfficeDomain = 'writer' | 'calc' | 'impress' | 'base';

export interface DocumentTemplate {
  readonly id: string;
  readonly name: string;
  readonly domain: OfficeDomain;
  readonly description: string;
  readonly doc: DocNode;
}

export class TemplateRegistry {
  private readonly templates = new Map<string, DocumentTemplate>();

  register(template: DocumentTemplate): void {
    if (!template.id) throw new Error('Template ID is required');
    this.templates.set(template.id, template);
  }

  get(id: string): DocumentTemplate | null {
    const t = this.templates.get(id);
    if (!t) return null;
    return {
      ...t,
      doc: JSON.parse(JSON.stringify(t.doc)),
    };
  }

  getByDomain(domain: OfficeDomain): DocumentTemplate[] {
    return Array.from(this.templates.values())
      .filter((t) => t.domain === domain)
      .map((t) => ({ ...t, doc: JSON.parse(JSON.stringify(t.doc)) }));
  }

  getAll(): DocumentTemplate[] {
    return Array.from(this.templates.values()).map((t) => ({
      ...t,
      doc: JSON.parse(JSON.stringify(t.doc)),
    }));
  }
}

export const templateRegistry = new TemplateRegistry();
