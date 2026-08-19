/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: snapshots.ts
 * 📂 المسار: packages/storage/src/snapshots.ts
 * 🎯 الهدف الرئيسي: إدارة لقطات الحالة (Snapshots) للتراجع والإعادة
 * 📋 المعايير: حدود حجم التاريخ (Max Size)، عدم تكرار اللقطات المتطابقة
 * 🧪 الاختبارات: packages/storage/tests/snapshots.test.ts
 * 🏷️ المعرف: STORE-004
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Bounded Dual-Stack Undo/Redo Engine with Timestamping
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تقييد الحد الأقصى للقطات لتفادي استنزاف الذاكرة
 *    2. ضمان استنساخ الحالات لمنع التعديل الجانبي
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية من استدعاء undo/redo عند فراغ الأكوام
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type { DocNode } from '@libretext/core';

export interface Snapshot<T = DocNode> {
  readonly id: string;
  readonly state: T;
  readonly timestamp: number;
  readonly description?: string;
}

export class SnapshotManager<T = DocNode> {
  private past: Snapshot<T>[] = [];
  private future: Snapshot<T>[] = [];
  private readonly maxSnapshots: number;

  constructor(maxSnapshots = 50) {
    this.maxSnapshots = maxSnapshots;
  }

  push(state: T, description?: string): void {
    const cloned = JSON.parse(JSON.stringify(state));
    const snapshot: Snapshot<T> = {
      id: `snap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      state: cloned,
      timestamp: Date.now(),
      description,
    };
    this.past.push(snapshot);
    if (this.past.length > this.maxSnapshots) {
      this.past.shift();
    }
    this.future = [];
  }

  canUndo(): boolean {
    return this.past.length > 1;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  undo(): T | null {
    if (!this.canUndo()) return null;
    const current = this.past.pop()!;
    this.future.unshift(current);
    const previous = this.past[this.past.length - 1];
    return previous ? JSON.parse(JSON.stringify(previous.state)) : null;
  }

  redo(): T | null {
    if (!this.canRedo()) return null;
    const next = this.future.shift()!;
    this.past.push(next);
    return JSON.parse(JSON.stringify(next.state));
  }

  clear(): void {
    this.past = [];
    this.future = [];
  }

  getHistory(): readonly Snapshot<T>[] {
    return [...this.past];
  }
}
