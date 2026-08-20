import { describe, it, expect } from 'vitest';
import { UnifiedToolsRegistry, UNIFIED_TOOLS } from '../src/shared-tools';

describe('UnifiedToolsRegistry', () => {
  it('contains all core unified tools', () => {
    expect(UNIFIED_TOOLS.length).toBeGreaterThanOrEqual(10);
  });

  it('filters tools for specific domains', () => {
    const writerTools = UnifiedToolsRegistry.getToolsForDomain('writer');
    expect(writerTools.some((t) => t.id === 'format-bold')).toBe(true);
    expect(writerTools.some((t) => t.id === 'export-multi-format')).toBe(true);

    const drawTools = UnifiedToolsRegistry.getToolsForDomain('draw');
    expect(drawTools.some((t) => t.id === 'vector-23-shapes')).toBe(true);
    expect(drawTools.some((t) => t.id === 'boolean-path-ops')).toBe(true);
  });

  it('retrieves tools by category', () => {
    const formattingTools = UnifiedToolsRegistry.getToolsByCategory('formatting');
    expect(formattingTools.length).toBeGreaterThan(0);
  });

  it('retrieves tool by ID', () => {
    const tool = UnifiedToolsRegistry.getToolById('math-formula-editor');
    expect(tool).toBeDefined();
    expect(tool?.category).toBe('math-latex');
  });
});
