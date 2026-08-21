/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: unified-tools-registry.ts
 * 📂 المسار: packages/plugins/src/shared-tools/unified-tools-registry.ts
 * 🎯 الهدف الرئيسي: سجل الأدوات الموحد المشترك لكافة المحررات (Writer/Markdown/Doc,
 *                    Calc, Impress, Base, Draw/Canvas, PDF, LaTeX, Media/Images).
 * 📋 المعايير:
 *    - فهرسة وتصنيف الأدوات الموحدة (Text, Math, Diagrams, Tables, Vector, Media, Export).
 *    - دعم فحص توفر الأداة حسب النطاق (Domain Context Filtering).
 *    - دعم الأفعال الموحدة (Unified Action Handlers).
 * 🏷️ المعرف: PLUG-014
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unified Shared Tool Registry + Cross-Domain Capability Matcher.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بحدود الأسطر (<400 سطر).
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type DomainType = 'writer' | 'calc' | 'impress' | 'base' | 'draw' | 'all';

export type ToolCategory =
  | 'formatting'
  | 'math-latex'
  | 'diagrams'
  | 'tables'
  | 'vector-shapes'
  | 'media-images'
  | 'alignment-layers'
  | 'export-convert'
  | 'history-search';

export interface UnifiedToolDefinition {
  readonly id: string;
  readonly nameAr: string;
  readonly nameEn: string;
  readonly category: ToolCategory;
  readonly iconName: string;
  readonly supportedDomains: readonly DomainType[];
  readonly descriptionAr: string;
  readonly descriptionEn: string;
  readonly isStateful?: boolean;
}

export const UNIFIED_TOOLS: readonly UnifiedToolDefinition[] = [
  // Formatting & Text (Writer, Impress, Draw, Base)
  {
    id: 'format-bold',
    nameAr: 'غامق',
    nameEn: 'Bold',
    category: 'formatting',
    iconName: 'Bold',
    supportedDomains: ['writer', 'impress', 'draw', 'calc'],
    descriptionAr: 'تطبيق التنسيق الغامق على النص المحدد',
    descriptionEn: 'Apply bold formatting to selected text',
    isStateful: true,
  },
  {
    id: 'format-italic',
    nameAr: 'مائل',
    nameEn: 'Italic',
    category: 'formatting',
    iconName: 'Italic',
    supportedDomains: ['writer', 'impress', 'draw', 'calc'],
    descriptionAr: 'تطبيق التنسيق المائل على النص المحدد',
    descriptionEn: 'Apply italic formatting to selected text',
    isStateful: true,
  },
  {
    id: 'format-underline',
    nameAr: 'تسطير',
    nameEn: 'Underline',
    category: 'formatting',
    iconName: 'Underline',
    supportedDomains: ['writer', 'impress', 'draw', 'calc'],
    descriptionAr: 'تسطير النص المحدد',
    descriptionEn: 'Underline selected text',
    isStateful: true,
  },
  {
    id: 'format-code',
    nameAr: 'كود سطري',
    nameEn: 'Inline Code',
    category: 'formatting',
    iconName: 'Code',
    supportedDomains: ['writer', 'draw'],
    descriptionAr: 'تنسيق ككود برمجي مضمن',
    descriptionEn: 'Format as inline code block',
    isStateful: true,
  },
  {
    id: 'format-heading-1',
    nameAr: 'عنوان رئيسي H1',
    nameEn: 'Heading 1',
    category: 'formatting',
    iconName: 'Heading1',
    supportedDomains: ['writer', 'impress'],
    descriptionAr: 'تحويل الفقرة إلى عنوان رئيسي أول',
    descriptionEn: 'Set paragraph as Heading 1',
  },
  {
    id: 'format-heading-2',
    nameAr: 'عنوان فرعي H2',
    nameEn: 'Heading 2',
    category: 'formatting',
    iconName: 'Heading2',
    supportedDomains: ['writer', 'impress'],
    descriptionAr: 'تحويل الفقرة إلى عنوان فرعي ثانٍ',
    descriptionEn: 'Set paragraph as Heading 2',
  },
  {
    id: 'format-bullet-list',
    nameAr: 'قائمة نقطية',
    nameEn: 'Bullet List',
    category: 'formatting',
    iconName: 'List',
    supportedDomains: ['writer', 'impress', 'draw'],
    descriptionAr: 'إنشاء قائمة نقطية',
    descriptionEn: 'Create bulleted list',
  },

  // Math & LaTeX
  {
    id: 'math-formula-editor',
    nameAr: 'معادلة رياضية / LaTeX',
    nameEn: 'Math / LaTeX Equation',
    category: 'math-latex',
    iconName: 'FunctionSquare',
    supportedDomains: ['writer', 'calc', 'impress', 'draw'],
    descriptionAr: 'إدراج صيغة رياضية ورموز KaTeX / LaTeX',
    descriptionEn: 'Insert mathematical formula and LaTeX expression',
  },

  // Diagrams & Mermaid
  {
    id: 'diagram-mermaid',
    nameAr: 'مخطط Mermaid',
    nameEn: 'Mermaid Diagram',
    category: 'diagrams',
    iconName: 'GitFork',
    supportedDomains: ['writer', 'draw', 'impress'],
    descriptionAr: 'إدراج رسم بياني أو تدفقي بلغة Mermaid',
    descriptionEn: 'Insert interactive Mermaid diagram',
  },

  // Tables & Calculations
  {
    id: 'table-insert',
    nameAr: 'إدراج جدول',
    nameEn: 'Insert Table',
    category: 'tables',
    iconName: 'Table',
    supportedDomains: ['writer', 'calc', 'impress', 'draw'],
    descriptionAr: 'إدراج جدول تفاعلي منظم',
    descriptionEn: 'Insert interactive data table',
  },

  // Vector Shapes & 23 Elements
  {
    id: 'vector-23-shapes',
    nameAr: 'الأشكال المتجهة الـ 23',
    nameEn: '23 Vector Shapes & Blocks',
    category: 'vector-shapes',
    iconName: 'Shapes',
    supportedDomains: ['draw', 'impress', 'writer'],
    descriptionAr: 'المكتبة الهندسية الشاملة للأشكال المتجهة والمخططات',
    descriptionEn: 'Comprehensive library of 23 vector shapes and flowchart blocks',
  },

  // Alignment, Distribution & Layers
  {
    id: 'align-distribute-tools',
    nameAr: 'المحاذاة والتوزيع الذكي',
    nameEn: 'Smart Alignment & Distribution',
    category: 'alignment-layers',
    iconName: 'AlignLeft',
    supportedDomains: ['draw', 'impress', 'calc'],
    descriptionAr: 'محاذاة العناصر وتوزيع المسافات بدقة',
    descriptionEn: 'Align and distribute elements with smart precision',
  },
  {
    id: 'boolean-path-ops',
    nameAr: 'العمليات البولية على المسارات',
    nameEn: 'Boolean Path Operations',
    category: 'alignment-layers',
    iconName: 'Combine',
    supportedDomains: ['draw', 'impress'],
    descriptionAr: 'دمج وطرح وتقاطع الأشكال المتجهة',
    descriptionEn: 'Union, Subtract, Intersect, and Exclude vector paths',
  },
  {
    id: 'layer-hierarchy-tools',
    nameAr: 'إدارة الطبقات والمجموعات',
    nameEn: 'Layer Hierarchy & Grouping',
    category: 'alignment-layers',
    iconName: 'Layers',
    supportedDomains: ['draw', 'impress'],
    descriptionAr: 'تقديم، تأخير، تجميع وفك تجميع الطبقات',
    descriptionEn: 'Manage Z-index layers, arrange, group and ungroup',
  },

  // Media & Images
  {
    id: 'media-image-manager',
    nameAr: 'إدراج وضبط الصور',
    nameEn: 'Media & Image Processing',
    category: 'media-images',
    iconName: 'Image',
    supportedDomains: ['writer', 'draw', 'impress', 'base'],
    descriptionAr: 'إدراج الصور والتحكم في الفلاتر والقص والشفافية',
    descriptionEn: 'Insert images, adjust brightness, contrast, blur, and crop',
  },

  // Multi-format Serializers & Export
  {
    id: 'export-multi-format',
    nameAr: 'تصدير المستند بصيغ متعددة',
    nameEn: 'Multi-Format Serializers',
    category: 'export-convert',
    iconName: 'Download',
    supportedDomains: ['writer', 'calc', 'impress', 'base', 'draw', 'all'],
    descriptionAr: 'تصدير بصيغ Markdown, HTML, TXT, PDF, LaTeX, JSON AST, SVG',
    descriptionEn: 'Export to Markdown, HTML, TXT, PDF, LaTeX, JSON AST, SVG',
  },

  // Search & Find/Replace
  {
    id: 'search-find-replace',
    nameAr: 'البحث والاستبدال',
    nameEn: 'Find & Replace',
    category: 'history-search',
    iconName: 'Search',
    supportedDomains: ['writer', 'calc', 'impress', 'base', 'draw', 'all'],
    descriptionAr: 'البحث والتنقل والاستبدال مع دعم Regex',
    descriptionEn: 'Search, navigate, and replace text with regex support',
  },
];

export class UnifiedToolsRegistry {
  /**
   * استرجاع جميع الأدوات المدعومة لنطاق معين
   */
  static getToolsForDomain(domain: DomainType): readonly UnifiedToolDefinition[] {
    return UNIFIED_TOOLS.filter(
      (tool) => tool.supportedDomains.includes(domain) || tool.supportedDomains.includes('all'),
    );
  }

  /**
   * استرجاع الأدوات حسب الفئة
   */
  static getToolsByCategory(category: ToolCategory): readonly UnifiedToolDefinition[] {
    return UNIFIED_TOOLS.filter((tool) => tool.category === category);
  }

  /**
   * البحث عن أداة بواسطة المعرف
   */
  static getToolById(toolId: string): UnifiedToolDefinition | undefined {
    return UNIFIED_TOOLS.find((tool) => tool.id === toolId);
  }
}
