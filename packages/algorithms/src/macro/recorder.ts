/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: recorder.ts
 * 📂 المسار: packages/algorithms/src/macro/recorder.ts
 * 🎯 الهدف الرئيسي: مسجل إجراءات الماكرو (Macro Recorder) لالتقاط وتسجيل الأوامر
 * 📋 المعايير: حالة معزولة، لا اعتماديات خارجية، حماية من التجاوز
 * 🧪 الاختبارات: packages/algorithms/tests/macro/macro.test.ts
 * 🏷️ المعرف: ALGO-011
 * 📅 تاريخ الإنشاء: 2026-08-19
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Event-Driven Command Listener & Action Snapshot Buffer
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. منع تسجيل الأوامر أثناء تشغيل ماكرو آخر لتجنب التسجيل المتكرر
 *    2. تنظيف الذاكرة ومراعاة الحد الأقصى للخطوات
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - فحص الحالة قبل التسجيل
 *    - نسخ عميق للـ payload لمنع التأثر بالتعديلات الخارجية
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  MacroDefinition,
  MacroDomain,
  MacroStep,
  RecorderOptions,
  RecorderState,
} from './types';

export class MacroRecorder {
  private state: RecorderState = 'idle';
  private currentName = '';
  private currentDescription = '';
  private currentDomain: MacroDomain = 'universal';
  private steps: MacroStep[] = [];
  private readonly maxSteps: number;
  private startTime = 0;

  constructor(options: RecorderOptions = {}) {
    this.currentDomain = options.domain ?? 'universal';
    this.maxSteps = options.maxSteps ?? 500;
  }

  getState(): RecorderState {
    return this.state;
  }

  isRecording(): boolean {
    return this.state === 'recording';
  }

  isPaused(): boolean {
    return this.state === 'paused';
  }

  start(name: string, domain: MacroDomain = 'universal', description = ''): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Macro name is required');
    }
    this.currentName = name.trim();
    this.currentDomain = domain;
    this.currentDescription = description;
    this.steps = [];
    this.startTime = Date.now();
    this.state = 'recording';
  }

  pause(): void {
    if (this.state === 'recording') {
      this.state = 'paused';
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.state = 'recording';
    }
  }

  recordStep(commandType: string, payload: Record<string, unknown>, spatialTarget?: MacroStep['spatialTarget']): boolean {
    if (this.state !== 'recording') {
      return false;
    }
    if (this.steps.length >= this.maxSteps) {
      return false;
    }

    const safePayload = JSON.parse(JSON.stringify(payload));
    const step: MacroStep = {
      commandType,
      payload: safePayload,
      spatialTarget: spatialTarget ? JSON.parse(JSON.stringify(spatialTarget)) : undefined,
      timestamp: Date.now() - this.startTime,
    };

    this.steps.push(step);
    return true;
  }

  stop(): MacroDefinition {
    if (this.state === 'idle') {
      throw new Error('Recorder is not active');
    }

    const definition: MacroDefinition = {
      id: `macro_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: this.currentName,
      description: this.currentDescription,
      domain: this.currentDomain,
      steps: [...this.steps],
      createdAt: Date.now(),
      version: 1,
    };

    this.state = 'idle';
    this.steps = [];
    this.currentName = '';
    this.currentDescription = '';
    return definition;
  }

  cancel(): void {
    this.state = 'idle';
    this.steps = [];
    this.currentName = '';
    this.currentDescription = '';
  }

  getRecordedSteps(): readonly MacroStep[] {
    return [...this.steps];
  }
}
