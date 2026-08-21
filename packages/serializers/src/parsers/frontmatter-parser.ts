/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: frontmatter-parser.ts
 * 📂 المسار: packages/serializers/src/parsers/frontmatter-parser.ts
 * 🎯 الهدف الرئيسي: استخراج وتحليل بيانات YAML FrontMatter الوصفية
 * 📋 المعايير: Zero external dependencies, pure TypeScript
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-converter.test.ts
 * 🏷️ المعرف: SER-006-07
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Header FrontMatter Extractor & Key-Value Matcher
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface DocumentMetadata {
  title?: string;
  author?: string;
  creator?: string;
  description?: string;
  subject?: string;
  keywords?: string[];
  date?: string;
  category?: string;
  language?: string;
}

export interface ParsedFrontMatterResult {
  metadata: DocumentMetadata | null;
  content: string;
  warnings: string[];
}

export function parseFrontMatter(text: string): ParsedFrontMatterResult {
  const warnings: string[] = [];
  const trimmed = text.trimStart();

  if (!trimmed.startsWith('---')) {
    return { metadata: null, content: text, warnings };
  }

  const endIdx = trimmed.indexOf('\n---', 3);
  if (endIdx === -1) {
    warnings.push('FrontMatter opening delimiter found without matching closing delimiter');
    return { metadata: null, content: text, warnings };
  }

  const yamlContent = trimmed.slice(3, endIdx).trim();
  const remainingContent = trimmed.slice(endIdx + 4).trimStart();
  const metadata = parseYamlKeyValues(yamlContent);

  return { metadata, content: remainingContent, warnings };
}

function parseYamlKeyValues(yaml: string): DocumentMetadata {
  const meta: DocumentMetadata = {};
  const lines = yaml.split(/\r?\n/);

  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const rawVal = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^['"](.*)['"]$/, '$1');

    assignMetadataField(meta, key, rawVal);
  }

  return meta;
}

function assignMetadataField(meta: DocumentMetadata, key: string, val: string): void {
  if (key === 'title') meta.title = val;
  else if (key === 'author' || key === 'creator') {
    meta.author = val;
    meta.creator = val;
  } else if (key === 'description') meta.description = val;
  else if (key === 'subject') meta.subject = val;
  else if (key === 'category') meta.category = val;
  else if (key === 'date') meta.date = val;
  else if (key === 'language') meta.language = val;
  else if (key === 'keywords' || key === 'tags') {
    meta.keywords = val
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }
}
