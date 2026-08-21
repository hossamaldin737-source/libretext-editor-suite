/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: tokenizer.ts
 * 📂 المسار: packages/algorithms/src/formula/tokenizer.ts
 * 🎯 الهدف الرئيسي: تحويل نص الصيغة إلى سلسلة رموز (Tokens) للمحلل التنازلي
 * 📋 المعايير: صفر اعتماديات، دعم الأرقام/النصوص/الخلايا/الدوال/المعاملات
 * 🧪 الاختبارات: packages/algorithms/tests/formula/parser.test.ts
 * 🏷️ المعرف: ALGO-010
 * 📅 تاريخ الإنشاء: 2026-08-19
 * 🔄 الإصدار: v1.0.0
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Single-Pass Lexer + Character-Class Dispatch
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. النصوص غير المنتهية (Unterminated Strings)
 *    2. التمييز بين مرجع الخلية (A1) واسم الدالة (SUM)
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - رمي خطأ واضح عند الأحرف غير المتوقعة
 *    - فحص حدود المدخل قبل كل قراءة
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: لا توجد
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** أنواع الرموز المدعومة في الصيغ */
export type TokenType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'cell'
  | 'ident'
  | 'op'
  | 'lparen'
  | 'rparen'
  | 'comma'
  | 'colon'
  | 'eof';

/** رمز واحد ناتج عن عملية التحليل */
export interface Token {
  readonly type: TokenType;
  readonly value: string;
  readonly pos: number;
}

/** نتيجة قراءة مقطع من المدخل */
interface ReadResult {
  readonly token: Token;
  readonly next: number;
}

const TWO_CHAR_OPS = ['<=', '>=', '<>'] as const;
const ONE_CHAR_OPS = ['+', '-', '*', '/', '^', '&', '=', '<', '>'] as const;

/** فحص أحرف المسافة */
function isWhitespace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

/** فحص الأرقام */
function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

/** فحص الحروف الإنجليزية والعربية والرموز المسموح بها في المعرفات */
function isLetter(ch: string): boolean {
  if (!ch) return false;
  return (
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= 'a' && ch <= 'z') ||
    ch === '_' ||
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(ch)
  );
}

/** قراءة رقم (صحيح أو عشري) */
function readNumber(input: string, start: number): ReadResult {
  let i = start;
  let num = '';

  while (i < input.length && isDigit(input[i]!)) {
    num += input[i];
    i++;
  }

  if (i < input.length && input[i] === '.') {
    num += '.';
    i++;
    while (i < input.length && isDigit(input[i]!)) {
      num += input[i];
      i++;
    }
    if (i < input.length && input[i] === '.') {
      throw new Error(`Invalid number format at position ${start}`);
    }
  }

  // التحقق من صحة الرقم (منع "." فقط)
  if (num === '.' || num === '') {
    throw new Error(`Invalid number format at position ${start}`);
  }

  return {
    token: { type: 'number', value: num, pos: start },
    next: i,
  };
}

/** قراءة نص داخل علامات اقتباس */
function readString(input: string, start: number): ReadResult {
  const quote = input[start]!;
  let i = start + 1;
  let str = '';

  while (i < input.length && input[i] !== quote) {
    str += input[i];
    i++;
  }

  if (i >= input.length) {
    throw new Error(`Unterminated string starting at position ${start}`);
  }

  return {
    token: { type: 'string', value: str, pos: start },
    next: i + 1,
  };
}

/** قراءة كلمة: اسم دالة، قيمة منطقية، أو مرجع خلية */
function readWord(input: string, start: number): ReadResult {
  let i = start;
  let letters = '';

  while (i < input.length && isLetter(input[i]!)) {
    letters += input[i];
    i++;
  }

  // مرجع خلية (حروف + أرقام)
  if (i < input.length && isDigit(input[i]!)) {
    let digits = '';
    while (i < input.length && isDigit(input[i]!)) {
      digits += input[i];
      i++;
    }
    const cell = letters.toUpperCase() + digits;
    return {
      token: { type: 'cell', value: cell, pos: start },
      next: i,
    };
  }

  const upper = letters.toUpperCase();
  const isBool = upper === 'TRUE' || upper === 'FALSE' || upper === 'صحيح' || upper === 'خطأ';

  return {
    token: {
      type: isBool ? 'boolean' : 'ident',
      value: upper,
      pos: start,
    },
    next: i,
  };
}

/** قراءة معامل أو علامة ترقيم (تُعيد ReadResult للاتساق) */
function readOperatorOrPunct(input: string, start: number): ReadResult {
  const ch = input[start]!;
  const two = input.slice(start, start + 2);
  let token: Token;
  let next: number;

  if ((TWO_CHAR_OPS as readonly string[]).includes(two)) {
    token = { type: 'op', value: two, pos: start };
    next = start + 2;
  } else if ((ONE_CHAR_OPS as readonly string[]).includes(ch)) {
    token = { type: 'op', value: ch, pos: start };
    next = start + 1;
  } else if (ch === '(') {
    token = { type: 'lparen', value: ch, pos: start };
    next = start + 1;
  } else if (ch === ')') {
    token = { type: 'rparen', value: ch, pos: start };
    next = start + 1;
  } else if (ch === ',') {
    token = { type: 'comma', value: ch, pos: start };
    next = start + 1;
  } else if (ch === ':') {
    token = { type: 'colon', value: ch, pos: start };
    next = start + 1;
  } else {
    class TokenizeError extends Error {
      position: number;
      constructor(msg: string, pos: number) {
        super(msg);
        this.position = pos;
        this.name = 'ParseError';
      }
    }
    throw new TokenizeError(`Unexpected character "${ch}" at position ${start}`, start);
  }

  return { token, next };
}

/** تحويل نص الصيغة إلى قائمة رموز */
export function tokenize(input: string): readonly Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i]!;

    // تخطي المسافات
    if (isWhitespace(ch)) {
      i++;
      continue;
    }

    // قراءة رقم
    const startsNumber = isDigit(ch) || ch === '.';
    if (startsNumber) {
      // If it's a dot but not followed by a digit and we haven't seen a digit, readNumber will throw "Invalid number format"
      const r = readNumber(input, i);
      tokens.push(r.token);
      i = r.next;
      continue;
    }

    // قراءة نص
    if (ch === '"' || ch === "'") {
      const r = readString(input, i);
      tokens.push(r.token);
      i = r.next;
      continue;
    }

    // قراءة كلمة
    if (isLetter(ch)) {
      const r = readWord(input, i);
      tokens.push(r.token);
      i = r.next;
      continue;
    }

    // قراءة معامل أو علامة ترقيم
    const r = readOperatorOrPunct(input, i);
    tokens.push(r.token);
    i = r.next;
  }

  tokens.push({ type: 'eof', value: 'eof', pos: i });
  return tokens;
}
