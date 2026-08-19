/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: executor.test.ts
 * 📂 المسار: packages/algorithms/tests/command/executor.test.ts
 * 🎯 الهدف الرئيسي: اختبار تنفيذ الأوامر والتراجع عنها
 * 📋 المعايير: تغطية >= 95%، اختبار جميع الحالات الممكنة
 * 🧪 الاختبارات: هذا الملف هو ملف الاختبار
 * 🏷️ المعرف: TEST-ALGO-002
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Mock Core + Immutable State Verification
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. التأكد من أن applyOperation يُستدعى بالعملية الصحيحة
 *    2. التحقق من أن التراجع يعكس الإحداثيات المكانية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - استخدام vi.mock لعزل النواة
 *    - التحقق من ثبات الحالة الأصلية مع التوافق مع CommandResult
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Vitest (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { describe, it, expect, vi } from 'vitest';
import { executeCommand, undoCommand, CommandExecutor } from '../../src/command/executor';
import { CommandType, SpatialCommand, TextCommand } from '../../src/command/types';
import type { EditorState } from '@libretext/core';

// Mock the core module
vi.mock('@libretext/core', () => ({
  applyOperation: vi.fn((doc: any, op: any) => {
    if (op.type === 'ERROR_MOCK') {
      throw new Error('Simulated applyOperation error');
    }
    return {
      ...doc,
      lastOp: op,
    };
  }),
}));

describe('ALGO-002: CommandExecutor', () => {
  const mockDoc = { id: 'root', type: 'doc', content: [] };
  const mockState = { document: mockDoc, selection: null } as unknown as EditorState;

  const spatialCmdDelta: SpatialCommand = {
    type: CommandType.SPATIAL,
    targetId: 'node-1',
    payload: { timestamp: Date.now(), x: 10, y: 20 },
  };

  const spatialCmdAbsolute: SpatialCommand = {
    type: CommandType.SPATIAL,
    targetId: 'node-1',
    payload: { timestamp: Date.now(), x: 100, y: 200, previousX: 50, previousY: 60 },
  };

  const textCmd: TextCommand = {
    type: CommandType.TEXT,
    targetId: 'node-2',
    payload: { timestamp: Date.now(), content: 'Hello', position: 0 },
  };

  it('should execute SpatialCommand and return new state with success', () => {
    const result = executeCommand(spatialCmdDelta, mockState);
    expect(result.success).toBe(true);
    expect(result.state).not.toBe(mockState);
    expect((result.state.document as any).lastOp).toMatchObject({
      type: 'SPATIAL_MOVE',
      id: 'node-1',
      x: 10,
      y: 20,
    });
  });

  it('should undo SpatialCommand by inverting coordinates when no previous values', () => {
    const result = undoCommand(spatialCmdDelta, mockState);
    expect(result.success).toBe(true);
    expect((result.state.document as any).lastOp).toMatchObject({
      type: 'SPATIAL_MOVE',
      id: 'node-1',
      x: -10,
      y: -20,
    });
  });

  it('should undo SpatialCommand using previousX/previousY if provided', () => {
    const result = undoCommand(spatialCmdAbsolute, mockState);
    expect(result.success).toBe(true);
    expect((result.state.document as any).lastOp).toMatchObject({
      type: 'SPATIAL_MOVE',
      id: 'node-1',
      x: 50,
      y: 60,
    });
  });

  it('should execute TextCommand correctly', () => {
    const result = executeCommand(textCmd, mockState);
    expect(result.success).toBe(true);
    expect((result.state.document as any).lastOp).toMatchObject({
      type: 'TEXT_UPDATE',
      content: 'Hello',
    });
  });

  it('should fail to undo TextCommand gracefully', () => {
    const result = undoCommand(textCmd, mockState);
    expect(result.success).toBe(false);
    expect(result.state).toBe(mockState);
    expect(result.error).toContain('Undo not supported');
  });

  it('should handle batch undo via CommandExecutor instance safely', () => {
    const executor = new CommandExecutor();
    let state = mockState;

    // Execute first two valid spatial commands
    const exec1 = executor.execute(spatialCmdAbsolute, state);
    expect(exec1.success).toBe(true);
    state = exec1.state;

    const exec2 = executor.execute(spatialCmdDelta, state);
    expect(exec2.success).toBe(true);
    state = exec2.state;

    // Push an invalid text command
    const exec3 = executor.execute(textCmd, state);
    expect(exec3.success).toBe(true);
    state = exec3.state;

    // Try batch undo 3 commands
    // The text command will fail to undo, so the batch undo should abort
    // and history should remain intact for the remaining commands.
    const batchResult = executor.undoMany(3, state);
    expect(batchResult.success).toBe(false);
    expect(batchResult.error).toContain('Undo not supported for TextCommand yet');
    
    // Check that history size is 3 (nothing got popped because the first undo failed)
    expect(executor.getHistoryLength()).toBe(3);

    // If we undoLast on a spatial command directly (bypassing the text command for testing),
    // we can verify the history length decreases appropriately on success.
    const executor2 = new CommandExecutor();
    executor2.execute(spatialCmdDelta, mockState);
    expect(executor2.getHistoryLength()).toBe(1);
    
    const undoRes = executor2.undoLast(exec2.state);
    expect(undoRes.success).toBe(true);
    expect(executor2.getHistoryLength()).toBe(0);
    expect((undoRes.state.document as any).lastOp).toMatchObject({
      x: -10,
      y: -20,
    });
  });

  it('should return error for unsupported commands safely without modifying history', () => {
    const invalidCmd = { type: 'unknown', targetId: '1', payload: {} } as any;
    const result = executeCommand(invalidCmd, mockState);
    expect(result.success).toBe(false);
    expect(result.state).toBe(mockState); // No changes
    expect(result.error).toContain('No handler found');
  });

  it('should catch exceptions thrown by applyOperation and return error', () => {
    const errorCmd: SpatialCommand = {
      type: CommandType.SPATIAL,
      targetId: 'node-1',
      payload: { timestamp: Date.now(), x: 0, y: 0 },
    };
    
    // We mocked applyOperation to throw on ERROR_MOCK
    const executor = new CommandExecutor();
    // Temporarily override toOperation to inject an error
    const handler = executor.findHandler(errorCmd);
    vi.spyOn(handler!, 'toOperation').mockReturnValueOnce({
      success: true,
      value: { type: 'ERROR_MOCK' } as any
    });

    const result = executor.execute(errorCmd, mockState);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Simulated applyOperation error');
  });
});
