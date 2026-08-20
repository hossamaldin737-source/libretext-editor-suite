/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.ts
 * 📂 المسار: packages/algorithms/src/macro/registry.ts
 * 🎯 الهدف الرئيسي: سجل الماكرو (Macro Registry) لتخزين واسترجاع وإدارة الماكرو
 * 📋 المعايير: تخزين معزول، دعم الفلترة حسب النطاق، استيراد وتصدير JSON
 * 🧪 الاختبارات: packages/algorithms/tests/macro/macro.test.ts
 * 🏷️ المعرف: ALGO-013
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Type-Safe Macro Catalog & Serialization Layer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التحقق من صحة بنية الماكرو قبل التسجيل
 *    2. منع الكتابة فوق الماكرو المحمي دون إذن صريح
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { MacroDefinition, MacroDomain } from './types';
import { isMacroDefinition } from './types';

export class MacroRegistry {
  private readonly macros = new Map<string, MacroDefinition>();

  register(macro: MacroDefinition): void {
    if (!isMacroDefinition(macro)) {
      throw new Error('Invalid macro definition structure');
    }
    this.macros.set(macro.id, JSON.parse(JSON.stringify(macro)));
  }

  get(id: string): MacroDefinition | null {
    const macro = this.macros.get(id);
    if (!macro) return null;
    return JSON.parse(JSON.stringify(macro));
  }

  has(id: string): boolean {
    return this.macros.has(id);
  }

  delete(id: string): boolean {
    return this.macros.delete(id);
  }

  getByDomain(domain: MacroDomain): MacroDefinition[] {
    return Array.from(this.macros.values())
      .filter((m) => m.domain === domain || m.domain === 'universal')
      .map((m) => JSON.parse(JSON.stringify(m)));
  }

  getAll(): MacroDefinition[] {
    return Array.from(this.macros.values()).map((m) =>
      JSON.parse(JSON.stringify(m))
    );
  }

  exportJson(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  importJson(jsonString: string): number {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      throw new Error('Import payload must be an array of macros');
    }
    let count = 0;
    for (const item of parsed) {
      if (isMacroDefinition(item)) {
        this.register(item);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.macros.clear();
  }
}

export const macroRegistry = new MacroRegistry();
