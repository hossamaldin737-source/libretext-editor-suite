/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: registry.ts
 * 📂 المسار: packages/algorithms/src/formula/registry.ts
 * 🎯 الهدف الرئيسي: سجل الدوال مع دعم كامل للدوال العربية والإنجليزية والأسماء المستعارة
 * 📋 المعايير: صفر اعتماديات، Singleton موثق، registerOrReplace، مرادفات عربية
 * 🧪 الاختبارات: packages/algorithms/tests/formula/registry.test.ts
 * 🏷️ المعرف: ALGO-012
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 آخر تحديث: 2026-08-19 (v3: Extended Arabic & Bilingual Formula Registry)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Registry Pattern + Module-Level Singleton + Bilingual Alias Mapping
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. defaultRegistry هو Singleton على مستوى الموديول
 *    2. استخدام registerOrReplace لتجنب الأخطاء في HMR
 *    3. تطبيع أسماء الدوال العربية (حذف الفراغات وتحويل لحروف موحدة)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - registerOrReplace بدلاً من register للتسجيل الآمن
 *    - استرجاع آمن للدوال غير الحساس لحالة الأحرف
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد
 * ═══════════════════════════════════════════════════════════════════════════
 */

import * as builtins from './functions';
import * as arabicFuncs from './functions-arabic';
import * as textFuncs from './functions-text';
import * as mathFuncs from './functions-math';
import type { FunctionHandler } from './evaluator';

/** سجل الدوال المدمجة والموسعة */
export class FunctionRegistry {
  private readonly functions: Map<string, FunctionHandler>;

  constructor() {
    this.functions = new Map<string, FunctionHandler>();
  }

  /** تسجيل دالة (يرمي إذا كان الاسم مسجلاً مسبقاً) */
  register(name: string, handler: FunctionHandler): void {
    const upper = name.toUpperCase().trim();
    if (this.functions.has(upper)) {
      throw new Error(`Function "${upper}" is already registered`);
    }
    this.functions.set(upper, handler);
  }

  /** تسجيل أو استبدال دالة (آمن لـ HMR) */
  registerOrReplace(name: string, handler: FunctionHandler): void {
    this.functions.set(name.toUpperCase().trim(), handler);
  }

  /** استرجاع دالة */
  get(name: string): FunctionHandler | undefined {
    return this.functions.get(name.toUpperCase().trim());
  }

  /** التحقق من وجود دالة */
  has(name: string): boolean {
    return this.functions.has(name.toUpperCase().trim());
  }

  /** قائمة بجميع الدوال المسجلة */
  list(): readonly string[] {
    return Array.from(this.functions.keys());
  }

  /** تسجيل جميع الدوال المدمجة مع المرادفات العربية */
  registerBuiltins(): this {
    // 1. الدوال الأساسية
    this.registerOrReplace('SUM', builtins.SUM);
    this.registerOrReplace('مجموع', builtins.SUM);
    this.registerOrReplace('AVERAGE', builtins.AVERAGE);
    this.registerOrReplace('متوسط', builtins.AVERAGE);
    this.registerOrReplace('COUNT', builtins.COUNT);
    this.registerOrReplace('عدد', builtins.COUNT);
    this.registerOrReplace('MIN', builtins.MIN);
    this.registerOrReplace('أصغر', builtins.MIN);
    this.registerOrReplace('اصغر', builtins.MIN);
    this.registerOrReplace('MAX', builtins.MAX);
    this.registerOrReplace('أكبر', builtins.MAX);
    this.registerOrReplace('اكبر', builtins.MAX);
    this.registerOrReplace('ABS', builtins.ABS);
    this.registerOrReplace('مطلق', builtins.ABS);
    this.registerOrReplace('ROUND', builtins.ROUND);
    this.registerOrReplace('تقريب', builtins.ROUND);
    this.registerOrReplace('CONCAT', builtins.CONCAT);
    this.registerOrReplace('دمج', builtins.CONCAT);
    this.registerOrReplace('IF', builtins.IF);
    this.registerOrReplace('شرط', builtins.IF);
    this.registerOrReplace('إذا', builtins.IF);
    this.registerOrReplace('اذا', builtins.IF);

    // 2. دوال المعالجة العربية والتفقيط
    this.registerOrReplace('TAFQEET', arabicFuncs.TAFQEET);
    this.registerOrReplace('تفقيط', arabicFuncs.TAFQEET);
    this.registerOrReplace('STRIP_TASHKEEL', arabicFuncs.STRIP_TASHKEEL);
    this.registerOrReplace('حذف_التشكيل', arabicFuncs.STRIP_TASHKEEL);
    this.registerOrReplace('ازالة_التشكيل', arabicFuncs.STRIP_TASHKEEL);
    this.registerOrReplace('NORMALIZE_ARABIC', arabicFuncs.NORMALIZE_ARABIC);
    this.registerOrReplace('توحيد_الحروف', arabicFuncs.NORMALIZE_ARABIC);
    this.registerOrReplace('TO_ARABIC_NUMERALS', arabicFuncs.TO_ARABIC_NUMERALS);
    this.registerOrReplace('تحويل_لارقام_عربية', arabicFuncs.TO_ARABIC_NUMERALS);
    this.registerOrReplace('TO_WESTERN_NUMERALS', arabicFuncs.TO_WESTERN_NUMERALS);
    this.registerOrReplace('تحويل_لارقام_انجليزية', arabicFuncs.TO_WESTERN_NUMERALS);
    this.registerOrReplace('ARABIC_LEN', arabicFuncs.ARABIC_LEN);
    this.registerOrReplace('طول_عربي', arabicFuncs.ARABIC_LEN);
    this.registerOrReplace('ARABIC_MATCH', arabicFuncs.ARABIC_MATCH);
    this.registerOrReplace('مطابقة_عربية', arabicFuncs.ARABIC_MATCH);
    this.registerOrReplace('بحث_عربي', arabicFuncs.ARABIC_MATCH);

    // 3. دوال النصوص المعيارية
    this.registerOrReplace('TRIM', textFuncs.TRIM);
    this.registerOrReplace('مسح_الفراغات', textFuncs.TRIM);
    this.registerOrReplace('CLEAN', textFuncs.CLEAN);
    this.registerOrReplace('تنظيف', textFuncs.CLEAN);
    this.registerOrReplace('LEFT', textFuncs.LEFT);
    this.registerOrReplace('يسار', textFuncs.LEFT);
    this.registerOrReplace('RIGHT', textFuncs.RIGHT);
    this.registerOrReplace('يمين', textFuncs.RIGHT);
    this.registerOrReplace('MID', textFuncs.MID);
    this.registerOrReplace('وسط', textFuncs.MID);
    this.registerOrReplace('LEN', textFuncs.LEN);
    this.registerOrReplace('طول', textFuncs.LEN);
    this.registerOrReplace('SEARCH', textFuncs.SEARCH);
    this.registerOrReplace('بحث', textFuncs.SEARCH);
    this.registerOrReplace('FIND', textFuncs.FIND);
    this.registerOrReplace('إيجاد', textFuncs.FIND);
    this.registerOrReplace('ايجاد', textFuncs.FIND);
    this.registerOrReplace('LOWER', textFuncs.LOWER);
    this.registerOrReplace('أحرف_صغيرة', textFuncs.LOWER);
    this.registerOrReplace('احرف_صغيرة', textFuncs.LOWER);
    this.registerOrReplace('UPPER', textFuncs.UPPER);
    this.registerOrReplace('أحرف_كبيرة', textFuncs.UPPER);
    this.registerOrReplace('احرف_كبيرة', textFuncs.UPPER);
    this.registerOrReplace('PROPER', textFuncs.PROPER);
    this.registerOrReplace('حالة_العنوان', textFuncs.PROPER);
    this.registerOrReplace('SUBSTITUTE', textFuncs.SUBSTITUTE);
    this.registerOrReplace('استبدال', textFuncs.SUBSTITUTE);
    this.registerOrReplace('REPLACE', textFuncs.REPLACE);
    this.registerOrReplace('تبديل', textFuncs.REPLACE);
    this.registerOrReplace('TEXTJOIN', textFuncs.TEXTJOIN);
    this.registerOrReplace('دمج_نصوص', textFuncs.TEXTJOIN);
    this.registerOrReplace('EXACT', textFuncs.EXACT);
    this.registerOrReplace('تطابق', textFuncs.EXACT);
    this.registerOrReplace('تطابق_تام', textFuncs.EXACT);
    this.registerOrReplace('REPT', textFuncs.REPT);
    this.registerOrReplace('تكرار', textFuncs.REPT);

    // 4. دوال الحساب والإحصاء الوصفي
    this.registerOrReplace('POWER', mathFuncs.POWER);
    this.registerOrReplace('أس', mathFuncs.POWER);
    this.registerOrReplace('اس', mathFuncs.POWER);
    this.registerOrReplace('SQRT', mathFuncs.SQRT);
    this.registerOrReplace('جذر', mathFuncs.SQRT);
    this.registerOrReplace('MOD', mathFuncs.MOD);
    this.registerOrReplace('باقي', mathFuncs.MOD);
    this.registerOrReplace('باقي_القسمة', mathFuncs.MOD);
    this.registerOrReplace('FLOOR', mathFuncs.FLOOR);
    this.registerOrReplace('أدنى', mathFuncs.FLOOR);
    this.registerOrReplace('ادنى', mathFuncs.FLOOR);
    this.registerOrReplace('CEILING', mathFuncs.CEILING);
    this.registerOrReplace('أعلى', mathFuncs.CEILING);
    this.registerOrReplace('اعلى', mathFuncs.CEILING);
    this.registerOrReplace('TRUNC', mathFuncs.TRUNC);
    this.registerOrReplace('بتر', mathFuncs.TRUNC);
    this.registerOrReplace('MEDIAN', mathFuncs.MEDIAN);
    this.registerOrReplace('وسيط', mathFuncs.MEDIAN);
    this.registerOrReplace('MODE', mathFuncs.MODE);
    this.registerOrReplace('منوال', mathFuncs.MODE);
    this.registerOrReplace('COUNTA', mathFuncs.COUNTA);
    this.registerOrReplace('عدد_القيم', mathFuncs.COUNTA);
    this.registerOrReplace('COUNTBLANK', mathFuncs.COUNTBLANK);
    this.registerOrReplace('عدد_الفارغ', mathFuncs.COUNTBLANK);
    this.registerOrReplace('COUNTIF', mathFuncs.COUNTIF);
    this.registerOrReplace('عد_بشرط', mathFuncs.COUNTIF);
    this.registerOrReplace('احصاء_بشرط', mathFuncs.COUNTIF);
    this.registerOrReplace('حساب_الحالات', mathFuncs.COUNTIF);
    this.registerOrReplace('SUMIF', mathFuncs.SUMIF);
    this.registerOrReplace('مجموع_بشرط', mathFuncs.SUMIF);
    this.registerOrReplace('جمع_بشرط', mathFuncs.SUMIF);


    return this;
  }
}

/** إنشاء سجل دوال مع الدوال المدمجة مسجّلة */
export function createFunctionRegistry(): FunctionRegistry {
  return new FunctionRegistry().registerBuiltins();
}

/**
 * السجل الافتراضي العام (Module-Level Singleton)
 * ⚠️ تحذير: هذا كائن واحد مشترك عبر جميع الاستيرادات في نفس الموديول
 */
const defaultRegistry = createFunctionRegistry();

/** الحصول على السجل الافتراضي */
export function getDefaultFunctionRegistry(): FunctionRegistry {
  return defaultRegistry;
}

/** استرجاع دالة من السجل الافتراضي */
export function getBuiltinFunction(name: string): FunctionHandler | undefined {
  return defaultRegistry.get(name);
}
