/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: canvas-designer-plugin.ts
 * 📂 المسار: packages/plugins/src/canvas-designer/canvas-designer-plugin.ts
 * 🎯 الهدف الرئيسي: الإضافة المركزية لمصمم الكانفا (Canvas Designer Plugin) لربط النواة بالمحررات.
 * 📋 المعايير:
 *    - تنفيذ معايير EditorPlugin للنواة.
 *    - تسجيل الأوامر الشاملة (23 Schema + Layer Tree + Grouping).
 * 🏷️ المعرف: PLUG-012
 * 📅 تاريخ الإنشاء: 2026-08-20
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Unified Canvas Designer Core Plugin with Integrated Layer Control & 23 Element Blueprints.
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. الالتزام بحدود الأسطر (<400 سطر).
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { type EditorPlugin, type PluginContext } from '../shared/types';
import { getAllSchemas, getSchemaForType, createDefaultElement } from './schema-registry';
import { LayerTreeEngine } from './layer-tree-engine';
import type { CanvasElementType, CanvasElementInstance } from './schema-types';

export interface CanvasDesignerPluginOptions {
  enableSmartGuides?: boolean;
  defaultGridSize?: number;
}

export function createCanvasDesignerPlugin(
  options: CanvasDesignerPluginOptions = {},
): EditorPlugin {
  return {
    id: 'plugin-canvas-designer',
    name: 'مصمم الكانفا والرسوم المتجهة والمخططات الشامل',
    version: '1.0.0',
    description: 'نظام كتل هندسية، كتل تدفقية، مسارات حرة، وإدارة متقدمة للطبقات والتجميع',

    init(context: PluginContext) {
      // 1. تسجيل أوامر إنشاء عناصر الكانفا
      for (const schema of getAllSchemas()) {
        context.registerCommand({
          id: `canvas:add-${schema.type}`,
          name: `إضافة ${schema.nameAr}`,
          handler: (params?: any) => {
            const x = params?.x ?? 100;
            const y = params?.y ?? 100;
            const id = params?.id ?? `canvas-el-${Date.now()}`;
            const el = createDefaultElement(id, schema.type, x, y);
            return { success: true, element: el };
          },
        });
      }

      // 2. تسجيل أوامر إدارة الطبقات
      context.registerCommand({
        id: 'canvas:layer-bring-front',
        name: 'جلب للمقدمة',
        handler: (params: { elements: CanvasElementInstance[]; elementId: string }) => ({
          success: true,
          elements: LayerTreeEngine.bringToFront(params.elements, params.elementId),
        }),
      });

      context.registerCommand({
        id: 'canvas:layer-send-back',
        name: 'إرسال للخلفية',
        handler: (params: { elements: CanvasElementInstance[]; elementId: string }) => ({
          success: true,
          elements: LayerTreeEngine.sendToBack(params.elements, params.elementId),
        }),
      });

      context.registerCommand({
        id: 'canvas:layer-group',
        name: 'تجميع العناصر',
        handler: (params: {
          elements: CanvasElementInstance[];
          selectedIds: string[];
          groupId: string;
        }) => ({
          success: true,
          elements: LayerTreeEngine.groupElements(
            params.elements,
            params.selectedIds,
            params.groupId,
          ),
        }),
      });

      context.registerCommand({
        id: 'canvas:layer-ungroup',
        name: 'فك التجميع',
        handler: (params: { elements: CanvasElementInstance[]; groupId: string }) => ({
          success: true,
          elements: LayerTreeEngine.ungroupElements(params.elements, params.groupId),
        }),
      });
    },

    hooks: {
      beforeRender(node) {
        return node;
      },
    },
  };
}
