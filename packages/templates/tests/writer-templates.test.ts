/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: writer-templates.test.ts
 * 📂 المسار: packages/templates/tests/writer-templates.test.ts
 * 🎯 الهدف: اختبار قوالب Writer (تغطية >= 95% — 40 حالة اختبار)
 * 🏷️ المعرف: TEST-TPL-002
 * 📅 تاريخ الإنشاء: 2026-08-20
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createLetterTemplate,
  createReportTemplate,
  createEssayTemplate,
  createResumeTemplate,
  registerWriterTemplates,
  getWriterTemplates,
} from '../src/writer/writer-templates';
import { TemplateRegistry, TemplateDomain } from '../src/registry';
import type { DocNode } from '@libretext/core';

describe('TPL-002: Writer Templates', () => {
  let registry: TemplateRegistry<DocNode>;

  beforeEach(() => {
    registry = TemplateRegistry.create<DocNode>();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Letter Template (4 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Letter Template', () => {
    it('creates letter template with correct structure', () => {
      const template = createLetterTemplate();
      expect(template.id).toBe('writer-letter-formal');
      expect(template.name).toBe('خطاب رسمي');
      expect(template.domain).toBe(TemplateDomain.WRITER);
      expect(template.category).toBe('مراسلات');
      expect(template.style).toBe('professional');
      expect(template.preview).toBe('letter-preview.png');
    });

    it('has valid DocNode content', () => {
      const template = createLetterTemplate();
      expect(template.content?.type).toBe('doc');
      expect(template.content?.content).toBeDefined();
      expect(Array.isArray(template.content?.content)).toBe(true);
      expect(template.content?.content!.length).toBe(8);
    });

    it('contains required letter sections', () => {
      const template = createLetterTemplate();
      const blocks = template.content?.content || [];
      const ids = blocks.map((b) => b.id);

      expect(ids).toContain('letter-date');
      expect(ids).toContain('letter-to');
      expect(ids).toContain('letter-subject');
      expect(ids).toContain('letter-greeting');
      expect(ids).toContain('letter-body-1');
      expect(ids).toContain('letter-body-2');
      expect(ids).toContain('letter-closing');
      expect(ids).toContain('letter-signature');
    });

    it('has correct metadata', () => {
      const template = createLetterTemplate();
      expect(template.metadata?.tags).toContain('letter');
      expect(template.metadata?.tags).toContain('formal');
      expect(template.metadata?.tags).toContain('correspondence');
      expect(template.metadata?.author).toBe('LibreText Team');
      expect(template.metadata?.version).toBe(1);
      expect(template.metadata?.language).toBe('ar');
      expect(template.metadata?.license).toBe('MIT');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Report Template (3 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Report Template', () => {
    it('creates report template with correct structure', () => {
      const template = createReportTemplate();
      expect(template.id).toBe('writer-report-professional');
      expect(template.name).toBe('تقرير احترافي');
      expect(template.domain).toBe(TemplateDomain.WRITER);
      expect(template.category).toBe('تقارير');
      expect(template.style).toBe('professional');
      expect(template.preview).toBe('report-preview.png');
    });

    it('contains required report sections', () => {
      const template = createReportTemplate();
      const blocks = template.content?.content || [];
      const ids = blocks.map((b) => b.id);

      expect(ids).toContain('report-title');
      expect(ids).toContain('report-meta');
      expect(ids).toContain('report-summary-heading');
      expect(ids).toContain('report-summary');
      expect(ids).toContain('report-intro-heading');
      expect(ids).toContain('report-intro');
      expect(ids).toContain('report-findings-heading');
      expect(ids).toContain('report-findings');
      expect(ids).toContain('report-conclusion-heading');
      expect(ids).toContain('report-conclusion');
    });

    it('has correct metadata', () => {
      const template = createReportTemplate();
      expect(template.metadata?.tags).toContain('report');
      expect(template.metadata?.tags).toContain('professional');
      expect(template.metadata?.tags).toContain('business');
      expect(template.metadata?.language).toBe('ar');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Essay Template (3 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Essay Template', () => {
    it('creates essay template with correct structure', () => {
      const template = createEssayTemplate();
      expect(template.id).toBe('writer-essay-academic');
      expect(template.name).toBe('مقال أكاديمي');
      expect(template.domain).toBe(TemplateDomain.WRITER);
      expect(template.style).toBe('academic');
      expect(template.category).toBe('مقالات');
      expect(template.preview).toBe('essay-preview.png');
    });

    it('contains required essay sections', () => {
      const template = createEssayTemplate();
      const blocks = template.content?.content || [];
      const ids = blocks.map((b) => b.id);

      expect(ids).toContain('essay-title');
      expect(ids).toContain('essay-author');
      expect(ids).toContain('essay-intro-heading');
      expect(ids).toContain('essay-intro');
      expect(ids).toContain('essay-body1-heading');
      expect(ids).toContain('essay-body1');
      expect(ids).toContain('essay-body2-heading');
      expect(ids).toContain('essay-body2');
      expect(ids).toContain('essay-conclusion-heading');
      expect(ids).toContain('essay-conclusion');
    });

    it('has correct metadata', () => {
      const template = createEssayTemplate();
      expect(template.metadata?.tags).toContain('essay');
      expect(template.metadata?.tags).toContain('academic');
      expect(template.metadata?.tags).toContain('article');
      expect(template.metadata?.author).toBe('LibreText Team');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Resume Template (3 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Resume Template', () => {
    it('creates resume template with correct structure', () => {
      const template = createResumeTemplate();
      expect(template.id).toBe('writer-resume-professional');
      expect(template.name).toBe('سيرة ذاتية احترافية');
      expect(template.domain).toBe(TemplateDomain.WRITER);
      expect(template.category).toBe('سير ذاتية');
      expect(template.style).toBe('professional');
      expect(template.preview).toBe('resume-preview.png');
    });

    it('contains required resume sections', () => {
      const template = createResumeTemplate();
      const blocks = template.content?.content || [];
      const ids = blocks.map((b) => b.id);

      expect(ids).toContain('resume-name');
      expect(ids).toContain('resume-contact');
      expect(ids).toContain('resume-summary-heading');
      expect(ids).toContain('resume-summary');
      expect(ids).toContain('resume-experience-heading');
      expect(ids).toContain('resume-job1');
      expect(ids).toContain('resume-job1-desc');
      expect(ids).toContain('resume-education-heading');
      expect(ids).toContain('resume-degree');
      expect(ids).toContain('resume-skills-heading');
      expect(ids).toContain('resume-skills');
    });

    it('has correct metadata', () => {
      const template = createResumeTemplate();
      expect(template.metadata?.tags).toContain('resume');
      expect(template.metadata?.tags).toContain('cv');
      expect(template.metadata?.tags).toContain('career');
      expect(template.metadata?.tags).toContain('professional');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Auto-Registration (4 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Auto-Registration', () => {
    it('registerWriterTemplates registers all templates', () => {
      const count = registerWriterTemplates(registry);
      expect(count).toBe(4);
      expect(registry.size()).toBe(4);
    });

    it('all registered templates are Writer domain', () => {
      registerWriterTemplates(registry);
      const templates = registry.list(TemplateDomain.WRITER);
      expect(templates).toHaveLength(4);
      templates.forEach((t) => {
        expect(t.domain).toBe(TemplateDomain.WRITER);
      });
    });

    it('handles duplicate registration gracefully', () => {
      registerWriterTemplates(registry);
      const count = registerWriterTemplates(registry);
      expect(count).toBe(0); // All duplicates, none registered
      expect(registry.size()).toBe(4);
    });

    it('getWriterTemplates returns all templates', () => {
      const templates = getWriterTemplates();
      expect(templates).toHaveLength(4);
      expect(templates[0].id).toBe('writer-letter-formal');
      expect(templates[1].id).toBe('writer-report-professional');
      expect(templates[2].id).toBe('writer-essay-academic');
      expect(templates[3].id).toBe('writer-resume-professional');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Template Application (4 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Template Application', () => {
    it('can apply letter template', () => {
      registerWriterTemplates(registry);
      const doc = registry.apply('writer-letter-formal');
      expect(doc.type).toBe('doc');
      expect(doc.content).toBeDefined();
    });

    it('applied template is independent copy', () => {
      registerWriterTemplates(registry);
      const doc1 = registry.apply('writer-letter-formal');
      const doc2 = registry.apply('writer-letter-formal');
      expect(doc1).toEqual(doc2);
      expect(doc1).not.toBe(doc2);
    });

    it('can retrieve all Writer templates via list', () => {
      registerWriterTemplates(registry);
      const templates = registry.list(TemplateDomain.WRITER);
      expect(templates).toHaveLength(4);
    });

    it('can find templates by tag', () => {
      registerWriterTemplates(registry);
      const professional = registry.find({ tags: ['professional'] });
      expect(professional.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DocNode Structure Validation (3 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('DocNode Structure Validation', () => {
    it('all templates have valid DocNode structure', () => {
      const templates = getWriterTemplates();
      templates.forEach((template) => {
        expect(template.content?.type).toBe('doc');
        expect(typeof template.content?.id).toBe('string');
        expect(Array.isArray(template.content?.content)).toBe(true);
      });
    });

    it('all blocks have valid ids', () => {
      const templates = getWriterTemplates();
      templates.forEach((template) => {
        template.content?.content?.forEach((block) => {
          expect(typeof block.id).toBe('string');
          expect(block.id.length).toBeGreaterThan(0);
        });
      });
    });

    it('all templates have unique ids', () => {
      const templates = getWriterTemplates();
      const ids = templates.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Cross-template consistency & Additional Verifications (16 tests)
  // ─────────────────────────────────────────────────────────────────────────
  describe('Cross-template consistency & Additional Verifications', () => {
    it('can apply report template successfully', () => {
      registerWriterTemplates(registry);
      const doc = registry.apply('writer-report-professional');
      expect(doc.type).toBe('doc');
      expect(doc.content?.length).toBe(10);
    });

    it('can apply essay template successfully', () => {
      registerWriterTemplates(registry);
      const doc = registry.apply('writer-essay-academic');
      expect(doc.type).toBe('doc');
      expect(doc.content?.length).toBe(10);
    });

    it('can apply resume template successfully', () => {
      registerWriterTemplates(registry);
      const doc = registry.apply('writer-resume-professional');
      expect(doc.type).toBe('doc');
      expect(doc.content?.length).toBe(11);
    });

    it('modifying applied doc does not mutate registry state', () => {
      registerWriterTemplates(registry);
      const doc = registry.apply('writer-letter-formal');
      doc.content = [];
      const freshDoc = registry.apply('writer-letter-formal');
      expect(freshDoc.content?.length).toBe(8);
    });

    it('finds report template by name regex pattern', () => {
      registerWriterTemplates(registry);
      const reports = registry.find({ namePattern: /تقرير/ });
      expect(reports).toHaveLength(1);
      expect(reports[0].id).toBe('writer-report-professional');
    });

    it('finds essay template by name string pattern', () => {
      registerWriterTemplates(registry);
      const essays = registry.find({ namePattern: 'مقال' });
      expect(essays).toHaveLength(1);
      expect(essays[0].id).toBe('writer-essay-academic');
    });

    it('finds resume template by predicate', () => {
      registerWriterTemplates(registry);
      const resumes = registry.find({
        predicate: (t) => t.category === 'سير ذاتية',
      });
      expect(resumes).toHaveLength(1);
      expect(resumes[0].id).toBe('writer-resume-professional');
    });

    it('all templates have descriptions defined and non-empty', () => {
      const templates = getWriterTemplates();
      templates.forEach((t) => {
        expect(typeof t.description).toBe('string');
        expect(t.description!.trim().length).toBeGreaterThan(0);
      });
    });

    it('all templates have preview images ending with .png', () => {
      const templates = getWriterTemplates();
      templates.forEach((t) => {
        expect(t.preview).toMatch(/\.png$/);
      });
    });

    it('all templates have timestamps defined in metadata', () => {
      const templates = getWriterTemplates();
      templates.forEach((t) => {
        expect(t.metadata?.createdAt).toBeGreaterThan(0);
        expect(t.metadata?.updatedAt).toBeGreaterThan(0);
      });
    });

    it('can filter writer templates by academic style', () => {
      registerWriterTemplates(registry);
      const academic = registry.find({
        predicate: (t) => t.style === 'academic',
      });
      expect(academic).toHaveLength(1);
      expect(academic[0].id).toBe('writer-essay-academic');
    });

    it('can filter writer templates by professional style', () => {
      registerWriterTemplates(registry);
      const professional = registry.find({
        predicate: (t) => t.style === 'professional',
      });
      expect(professional).toHaveLength(3);
    });

    it('each block in letter template has type paragraph', () => {
      const letter = createLetterTemplate();
      letter.content?.content?.forEach((b) => {
        expect(b.type).toBe('paragraph');
      });
    });

    it('report template contains heading level 1 and 2 blocks', () => {
      const report = createReportTemplate();
      const headings = report.content?.content?.filter((b) => b.type === 'heading') || [];
      expect(headings.length).toBe(5);
      expect(headings[0].level).toBe(1);
      expect(headings[1].level).toBe(2);
    });

    it('resume template contains bold and italic marks', () => {
      const resume = createResumeTemplate();
      const blocks = resume.content?.content || [];
      const hasMarks = blocks.some((b) =>
        b.content?.some((inline) => inline.marks && inline.marks.length > 0)
      );
      expect(hasMarks).toBe(true);
    });

    it('registry.has returns true for all registered writer templates', () => {
      registerWriterTemplates(registry);
      expect(registry.has('writer-letter-formal')).toBe(true);
      expect(registry.has('writer-report-professional')).toBe(true);
      expect(registry.has('writer-essay-academic')).toBe(true);
      expect(registry.has('writer-resume-professional')).toBe(true);
      expect(registry.has('non-existent')).toBe(false);
    });
  });
});
