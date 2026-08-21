/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: docx-converter.ts
 * 📂 المسار: packages/serializers/src/docx/docx-converter.ts
 * 🎯 الهدف الرئيسي: المحول الرئيسي لتحويل Markdown إلى مستندات Word DOCX
 * 📋 المعايير: Zero external dependencies, pure TypeScript, safe file handling
 * 🧪 الاختبارات: packages/serializers/tests/docx/docx-converter.test.ts
 * 🏷️ المعرف: SER-006-05
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Pipeline-Driven Multi-Stage OOXML Packager & Converter
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. دعم العمل في المتصفح والـ Node.js
 *    2. ضمان عدم تجاوز 50 سطر لكل دالة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import {
  Document,
  Packer,
  LevelFormat,
  AlignmentType,
  Paragraph,
  type ISectionOptions,
} from './docx-model';
import { parseMarkdown, type ContentBlock } from '../parsers/markdown';
import { parseFrontMatter, type DocumentMetadata } from '../parsers/frontmatter-parser';
import { shouldCreateSectionBreak } from './section-rules';
import { buildElements } from './docx-builders';
import {
  DEFAULTS,
  resolveMargins,
  validateInputPath,
  type DocxConversionOptions,
  type DocxConversionResult,
} from './docx-types';

export function splitIntoSections(
  content: ContentBlock[],
  options: DocxConversionOptions,
  metadata: DocumentMetadata | null,
): ISectionOptions[] {
  const sections: ISectionOptions[] = [];
  let currentBlocks: ContentBlock[] = [];
  const margins = resolveMargins(options.margins);
  const pageProps = { page: { margin: margins } };

  for (let i = 0; i < content.length; i++) {
    const block = content[i];
    if (!block) continue;
    if (block.type === 'hr' && shouldCreateSectionBreak(i, content, metadata)) {
      if (currentBlocks.length > 0) {
        sections.push({
          properties: pageProps,
          children: buildElements(currentBlocks, options),
        });
        currentBlocks = [];
      }
    } else {
      currentBlocks.push(block);
    }
  }

  const children =
    currentBlocks.length > 0
      ? buildElements(currentBlocks, options)
      : [new Paragraph({ text: '' })];

  sections.push({ properties: pageProps, children });
  return sections;
}

export function buildDocument(
  sections: ISectionOptions[],
  metadata: DocumentMetadata | null,
  inputTitle: string,
): Document {
  return new Document({
    creator: metadata?.author ?? 'LibreText Markdown Converter',
    title: metadata?.title ?? inputTitle,
    description: metadata?.description,
    subject: metadata?.subject,
    keywords: metadata?.keywords?.join(', '),
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: '%1.',
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 260 },
                },
              },
            },
          ],
        },
      ],
    },
    sections,
  });
}

/** تحويل نص Markdown مباشرة إلى مصفوفة بايتات DOCX في الذاكرة */
export async function convertMarkdownToDocxBuffer(
  markdown: string,
  options: DocxConversionOptions = {},
  defaultTitle: string = 'Untitled Document',
): Promise<{ buffer: Uint8Array; warnings: string[] }> {
  const warnings: string[] = [];
  const maxSize = options.maxFileSize ?? DEFAULTS.MAX_FILE_SIZE;

  if (markdown.length > maxSize) {
    warnings.push(`Input size (${markdown.length} bytes) exceeds recommended limit`);
  }

  const {
    metadata,
    content: markdownContent,
    warnings: parseWarnings,
  } = parseFrontMatter(markdown);
  warnings.push(...parseWarnings);

  const parsed = parseMarkdown(markdownContent);
  const sections = splitIntoSections(parsed.content, options, metadata);
  const doc = buildDocument(sections, metadata, defaultTitle);
  const buffer = await Packer.toBuffer(doc);

  return { buffer, warnings };
}

/** تحويل من نص Markdown وحفظ الملف (Node.js أو بيئات الملفات) */
export async function convertMarkdownToDocx(
  markdown: string,
  outputPath: string,
  options: DocxConversionOptions = {},
  defaultTitle: string = 'Untitled Document',
): Promise<DocxConversionResult> {
  try {
    const { buffer, warnings } = await convertMarkdownToDocxBuffer(markdown, options, defaultTitle);
    await writeDocxOutputFile(outputPath, buffer);

    return {
      success: true,
      outputPath,
      warnings,
      fileSize: buffer.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      outputPath,
      warnings: [`File write failed: ${message}`],
    };
  }
}

/** تحويل من ملف Markdown إلى ملف DOCX */
export async function convertToDocx(
  inputPath: string,
  outputPath?: string,
  options: DocxConversionOptions = {},
): Promise<DocxConversionResult> {
  validateInputPath(inputPath);

  const output = outputPath ?? inputPath.replace(/\.md$/i, '.docx');
  const defaultTitle = extractBaseFileName(inputPath);

  try {
    const markdown = await readDocxInputFile(inputPath);
    return await convertMarkdownToDocx(markdown, output, options, defaultTitle);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      outputPath: output,
      warnings: [`Failed to read input file: ${message}`],
    };
  }
}

async function writeDocxOutputFile(outputPath: string, buffer: Uint8Array): Promise<void> {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const fs = await import('fs/promises');
    const path = await import('path');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, buffer);
  }
}

async function readDocxInputFile(inputPath: string): Promise<string> {
  if (typeof process !== 'undefined' && process.versions?.node) {
    const fs = await import('fs/promises');
    return await fs.readFile(inputPath, 'utf-8');
  }
  throw new Error('File reading is only supported in Node.js environments');
}

function extractBaseFileName(filePath: string): string {
  const parts = filePath.split(/[/\\]/);
  const fileName = parts[parts.length - 1] || 'Document';
  return fileName.replace(/\.md$/i, '');
}
