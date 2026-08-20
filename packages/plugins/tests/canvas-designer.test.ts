/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: canvas-designer.test.ts
 * 📂 المسار: packages/plugins/tests/canvas-designer.test.ts
 * 🎯 الهدف الرئيسي: اختبارات شمولية لنظام الـ 23 Schema ومحرك الطبقات والتجميع.
 * 🏷️ المعرف: TEST-PLUG-003
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect } from 'vitest';
import {
  getAllSchemas,
  getSchemaForType,
  createDefaultElement,
  LayerTreeEngine,
  createCanvasDesignerPlugin,
  type CanvasElementInstance,
} from '../src';

describe('Canvas Designer Plugin - 23 Elements Schema & Layer Engine', () => {
  it('should register exactly 23 distinct element schemas', () => {
    const schemas = getAllSchemas();
    expect(schemas.length).toBe(23);

    const types = schemas.map((s) => s.type);
    expect(types).toContain('rect');
    expect(types).toContain('circle');
    expect(types).toContain('diamond');
    expect(types).toContain('parallelogram');
    expect(types).toContain('trapezoid');
    expect(types).toContain('cylinder');
    expect(types).toContain('star');
    expect(types).toContain('flowchart-process');
    expect(types).toContain('flowchart-decision');
    expect(types).toContain('flowchart-data');
    expect(types).toContain('cloud');
    expect(types).toContain('actor');
    expect(types).toContain('sticky-note');
    expect(types).toContain('callout');
    expect(types).toContain('image-frame');
    expect(types).toContain('freehand-path');
    expect(types).toContain('bezier-curve');
    expect(types).toContain('smart-connector');
    expect(types).toContain('group-container');
  });

  it('should instantiate default element correctly based on schema', () => {
    const el = createDefaultElement('test-1', 'star', 50, 60, 2);
    expect(el.id).toBe('test-1');
    expect(el.type).toBe('star');
    expect(el.x).toBe(50);
    expect(el.y).toBe(60);
    expect(el.zIndex).toBe(2);
    expect(el.width).toBe(110);
    expect(el.height).toBe(110);
  });

  describe('LayerTreeEngine - Z-Index & Hierarchy', () => {
    const initialElements: CanvasElementInstance[] = [
      { id: 'el-1', type: 'rect', x: 0, y: 0, width: 100, height: 100, zIndex: 0 },
      { id: 'el-2', type: 'circle', x: 50, y: 50, width: 80, height: 80, zIndex: 1 },
      { id: 'el-3', type: 'diamond', x: 100, y: 100, width: 90, height: 90, zIndex: 2 },
    ];

    it('should bring element to front', () => {
      const updated = LayerTreeEngine.bringToFront(initialElements, 'el-1');
      const el1 = updated.find((e) => e.id === 'el-1');
      expect(el1?.zIndex).toBe(2);
    });

    it('should send element to back', () => {
      const updated = LayerTreeEngine.sendToBack(initialElements, 'el-3');
      const el3 = updated.find((e) => e.id === 'el-3');
      expect(el3?.zIndex).toBe(0);
    });

    it('should step forward and backward correctly', () => {
      const forward = LayerTreeEngine.bringForward(initialElements, 'el-1');
      expect(forward.find((e) => e.id === 'el-1')?.zIndex).toBe(1);

      const backward = LayerTreeEngine.sendBackward(initialElements, 'el-3');
      expect(backward.find((e) => e.id === 'el-3')?.zIndex).toBe(1);
    });

    it('should group and ungroup elements accurately', () => {
      const grouped = LayerTreeEngine.groupElements(initialElements, ['el-1', 'el-2'], 'grp-1');
      expect(grouped.find((e) => e.id === 'el-1')?.groupId).toBe('grp-1');
      expect(grouped.find((e) => e.id === 'el-2')?.groupId).toBe('grp-1');
      expect(grouped.find((e) => e.id === 'el-3')?.groupId).toBeUndefined();

      const ungrouped = LayerTreeEngine.ungroupElements(grouped, 'grp-1');
      expect(ungrouped.find((e) => e.id === 'el-1')?.groupId).toBeNull();
      expect(ungrouped.find((e) => e.id === 'el-2')?.groupId).toBeNull();
    });

    it('should construct hierarchical layer tree with groups', () => {
      const grouped = LayerTreeEngine.groupElements(initialElements, ['el-1', 'el-2'], 'grp-1');
      const tree = LayerTreeEngine.buildLayerTree(grouped);

      expect(tree.length).toBe(2); // 'el-3' and 'grp-1'
      const groupNode = tree.find((n) => n.id === 'grp-1');
      expect(groupNode?.children?.length).toBe(2);
    });
  });

  it('should initialize CanvasDesignerPlugin and register commands', () => {
    const plugin = createCanvasDesignerPlugin();
    const registeredCommands: any[] = [];
    const mockContext = {
      registerCommand: (cmd: any) => registeredCommands.push(cmd),
      getEditorState: () => ({}),
      dispatch: () => {},
    };

    plugin.init(mockContext as any);
    expect(registeredCommands.length).toBeGreaterThanOrEqual(27); // 23 add + 4 layer commands
    expect(registeredCommands.some((c) => c.id === 'canvas:add-star')).toBe(true);
    expect(registeredCommands.some((c) => c.id === 'canvas:layer-group')).toBe(true);
  });
});
