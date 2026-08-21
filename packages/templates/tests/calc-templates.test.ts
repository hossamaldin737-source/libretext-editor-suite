/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: calc-templates.test.ts
 * 📂 المسار: packages/templates/tests/calc-templates.test.ts
 * 🎯 الهدف: اختبار قوالب Calc (تغطية >= 95%)
 * 🏷️ المعرف: TEST-TPL-003
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createBudgetTemplate,
  createTrackerTemplate,
  createStatisticsTemplate,
  registerCalcTemplates,
  getCalcTemplates,
} from '../src/calc/calc-templates';
import { TemplateRegistry, TemplateDomain } from '../src/registry';
import type { DocNode } from '@libretext/core';

describe('TPL-003: Calc Templates', () => {
  let registry: TemplateRegistry<DocNode>;

  beforeEach(() => {
    registry = TemplateRegistry.create<DocNode>();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Budget Template
  // ─────────────────────────────────────────────────────────────────────────
  describe('Budget Template', () => {
    it('creates budget template with correct structure', () => {
      const tpl = createBudgetTemplate();
      expect(tpl.id).toBe('calc-budget-monthly');
      expect(tpl.name).toBe('ميزانية شهرية');
      expect(tpl.domain).toBe(TemplateDomain.CALC);
      expect(tpl.category).toBe('مالية');
      expect(tpl.style).toBe('professional');
    });

    it('has valid DocNode content', () => {
      const tpl = createBudgetTemplate();
      expect(tpl.content.type).toBe('doc');
      expect(tpl.content.id).toBe('budget-doc');
      expect(Array.isArray(tpl.content.content)).toBe(true);
      expect(tpl.content.content!.length).toBeGreaterThan(0);
    });

    it('contains income and expense tables', () => {
      const tpl = createBudgetTemplate();
      const blocks = tpl.content.content!;
      const ids = blocks.map((b) => b.id);
      expect(ids).toContain('budget-income');
      expect(ids).toContain('budget-expense');
    });

    it('has correct metadata', () => {
      const tpl = createBudgetTemplate();
      expect(tpl.metadata.tags).toContain('budget');
      expect(tpl.metadata.tags).toContain('monthly');
      expect(tpl.metadata.author).toBe('LibreText Team');
      expect(tpl.metadata.version).toBe(1);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Tracker Template
  // ─────────────────────────────────────────────────────────────────────────
  describe('Tracker Template', () => {
    it('creates tracker template with correct structure', () => {
      const tpl = createTrackerTemplate();
      expect(tpl.id).toBe('calc-tracker-expense');
      expect(tpl.name).toBe('تتبع المصروفات');
      expect(tpl.domain).toBe(TemplateDomain.CALC);
      expect(tpl.category).toBe('تتبع');
    });

    it('contains tracker table with 5 columns', () => {
      const tpl = createTrackerTemplate();
      const blocks = tpl.content.content!;
      const ids = blocks.map((b) => b.id);
      expect(ids).toContain('tracker-table');
    });

    it('has correct metadata', () => {
      const tpl = createTrackerTemplate();
      expect(tpl.metadata.tags).toContain('tracker');
      expect(tpl.metadata.tags).toContain('expense');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Statistics Template
  // ─────────────────────────────────────────────────────────────────────────
  describe('Statistics Template', () => {
    it('creates statistics template with correct structure', () => {
      const tpl = createStatisticsTemplate();
      expect(tpl.id).toBe('calc-statistics-report');
      expect(tpl.name).toBe('تقرير إحصائي');
      expect(tpl.domain).toBe(TemplateDomain.CALC);
      expect(tpl.category).toBe('إحصاء');
    });

    it('contains data and summary tables', () => {
      const tpl = createStatisticsTemplate();
      const blocks = tpl.content.content!;
      const ids = blocks.map((b) => b.id);
      expect(ids).toContain('stats-data');
      expect(ids).toContain('stats-summary');
    });

    it('has correct metadata', () => {
      const tpl = createStatisticsTemplate();
      expect(tpl.metadata.tags).toContain('statistics');
      expect(tpl.metadata.tags).toContain('report');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Auto-Registration
  // ─────────────────────────────────────────────────────────────────────────
  describe('Auto-Registration', () => {
    it('registerCalcTemplates registers all templates', () => {
      const count = registerCalcTemplates(registry);
      expect(count).toBe(3);
      expect(registry.size()).toBe(3);
    });

    it('all registered templates are Calc domain', () => {
      registerCalcTemplates(registry);
      const templates = registry.list(TemplateDomain.CALC);
      expect(templates).toHaveLength(3);
      templates.forEach((t) => {
        expect(t.domain).toBe(TemplateDomain.CALC);
      });
    });

    it('handles duplicate registration gracefully', () => {
      registerCalcTemplates(registry);
      const count = registerCalcTemplates(registry);
      expect(count).toBe(0);
      expect(registry.size()).toBe(3);
    });

    it('getCalcTemplates returns all templates', () => {
      const templates = getCalcTemplates();
      expect(templates).toHaveLength(3);
      expect(templates[0].id).toBe('calc-budget-monthly');
      expect(templates[1].id).toBe('calc-tracker-expense');
      expect(templates[2].id).toBe('calc-statistics-report');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Template Application
  // ─────────────────────────────────────────────────────────────────────────
  describe('Template Application', () => {
    it('can apply budget template', () => {
      registerCalcTemplates(registry);
      const doc = registry.apply('calc-budget-monthly');
      expect(doc.type).toBe('doc');
      expect(doc.content).toBeDefined();
    });

    it('applied template is independent copy', () => {
      registerCalcTemplates(registry);
      const d1 = registry.apply('calc-budget-monthly');
      const d2 = registry.apply('calc-budget-monthly');
      expect(d1).toEqual(d2);
      expect(d1).not.toBe(d2);
    });

    it('can find templates by tag', () => {
      registerCalcTemplates(registry);
      const finance = registry.find({ tags: ['finance'] });
      expect(finance).toHaveLength(1);
      expect(finance[0].id).toBe('calc-budget-monthly');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DocNode Structure Validation
  // ─────────────────────────────────────────────────────────────────────────
  describe('DocNode Structure Validation', () => {
    it('all templates have valid DocNode structure', () => {
      const templates = getCalcTemplates();
      templates.forEach((tpl) => {
        expect(tpl.content.type).toBe('doc');
        expect(typeof tpl.content.id).toBe('string');
        expect(Array.isArray(tpl.content.content)).toBe(true);
      });
    });

    it('all blocks have valid ids', () => {
      const templates = getCalcTemplates();
      templates.forEach((tpl) => {
        tpl.content.content!.forEach((block) => {
          expect(typeof block.id).toBe('string');
          expect(block.id.length).toBeGreaterThan(0);
        });
      });
    });

    it('all templates have unique ids', () => {
      const templates = getCalcTemplates();
      const ids = templates.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
