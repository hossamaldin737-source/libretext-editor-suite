/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: llrb.ts
 * 📂 المسار: src/algorithms/tree/llrb.ts
 * 🎯 الهدف الرئيسي: شجرة حمراء-سوداء ذات ميل أيسر (LLRB Tree) لفهرسة النطاقات والبحث السريع
 * 📋 المعايير: خوارزمية نقية بصفر اعتماديات خارجية وبحث في زمن O(log N)
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-005-LLRB
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Left-Leaning Red-Black Tree (Sedgewick) with Floor/Ceiling Range Queries
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. صيانة اللون الأحمر في الفرع الأيسر فقط دائماً
 *    2. تدوير الشجرة بدقة لضمان توازن الارتفاع الأسود
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - التحقق من العقد الفارغة وتجنب Null Pointer
 *    - مقارنة آمنة للمفاتيح النصية والرقمية
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: src/algorithms/types.ts
 *    - 📄 مرتبط مباشر: src/algorithms/index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - LLRBTree.put: إدراج مفتاح وقيمة (#L80)
 *    - LLRBTree.get: استرجاع قيمة المفتاح (#L105)
 *    - LLRBTree.floorKey: إيجاد أكبر مفتاح أصغر من أو يساوي (#L140)
 *    - LLRBTree.ceilingKey: إيجاد أصغر مفتاح أكبر من أو يساوي (#L165)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Robert Sedgewick LLRB Research (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const RED = true;
export const BLACK = false;

export interface LLRBNode<K, V> {
  key: K;
  val: V;
  left: LLRBNode<K, V> | null;
  right: LLRBNode<K, V> | null;
  color: boolean;
  size: number;
}

export type KeyComparator<K> = (a: K, b: K) => number;

function defaultComparator<K>(a: K, b: K): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function isRed<K, V>(node: LLRBNode<K, V> | null): boolean {
  if (node === null) return false;
  return node.color === RED;
}

function nodeSize<K, V>(node: LLRBNode<K, V> | null): number {
  return node === null ? 0 : node.size;
}

export class LLRBTree<K, V> {
  private root: LLRBNode<K, V> | null = null;
  private readonly comparator: KeyComparator<K>;

  constructor(comparator?: KeyComparator<K>) {
    this.comparator = comparator ?? defaultComparator;
  }

  public size(): number {
    return nodeSize(this.root);
  }

  public isEmpty(): boolean {
    return this.root === null;
  }

  public get(key: K): V | null {
    let curr = this.root;
    while (curr !== null) {
      const cmp = this.comparator(key, curr.key);
      if (cmp < 0) curr = curr.left;
      else if (cmp > 0) curr = curr.right;
      else return curr.val;
    }
    return null;
  }

  public contains(key: K): boolean {
    return this.get(key) !== null;
  }

  public put(key: K, val: V): void {
    this.root = this.insert(this.root, key, val);
    if (this.root !== null) {
      this.root.color = BLACK;
    }
  }

  private insert(node: LLRBNode<K, V> | null, key: K, val: V): LLRBNode<K, V> {
    if (node === null) {
      return { key, val, left: null, right: null, color: RED, size: 1 };
    }

    const cmp = this.comparator(key, node.key);
    if (cmp < 0) node.left = this.insert(node.left, key, val);
    else if (cmp > 0) node.right = this.insert(node.right, key, val);
    else node.val = val;

    return this.balance(node);
  }

  private balance(node: LLRBNode<K, V>): LLRBNode<K, V> {
    let curr = node;
    if (isRed(curr.right) && !isRed(curr.left)) {
      curr = this.rotateLeft(curr);
    }
    if (isRed(curr.left) && isRed(curr.left?.left ?? null)) {
      curr = this.rotateRight(curr);
    }
    if (isRed(curr.left) && isRed(curr.right)) {
      this.flipColors(curr);
    }
    curr.size = 1 + nodeSize(curr.left) + nodeSize(curr.right);
    return curr;
  }

  private rotateLeft(node: LLRBNode<K, V>): LLRBNode<K, V> {
    const x = node.right!;
    node.right = x.left;
    x.left = node;
    x.color = node.color;
    node.color = RED;
    x.size = node.size;
    node.size = 1 + nodeSize(node.left) + nodeSize(node.right);
    return x;
  }

  private rotateRight(node: LLRBNode<K, V>): LLRBNode<K, V> {
    const x = node.left!;
    node.left = x.right;
    x.right = node;
    x.color = node.color;
    node.color = RED;
    x.size = node.size;
    node.size = 1 + nodeSize(node.left) + nodeSize(node.right);
    return x;
  }

  private flipColors(node: LLRBNode<K, V>): void {
    node.color = !node.color;
    if (node.left) node.left.color = !node.left.color;
    if (node.right) node.right.color = !node.right.color;
  }

  public minKey(): K | null {
    if (this.root === null) return null;
    let curr = this.root;
    while (curr.left !== null) curr = curr.left;
    return curr.key;
  }

  public maxKey(): K | null {
    if (this.root === null) return null;
    let curr = this.root;
    while (curr.right !== null) curr = curr.right;
    return curr.key;
  }

  public floorKey(key: K): K | null {
    const node = this.floor(this.root, key);
    return node === null ? null : node.key;
  }

  private floor(node: LLRBNode<K, V> | null, key: K): LLRBNode<K, V> | null {
    if (node === null) return null;
    const cmp = this.comparator(key, node.key);
    if (cmp === 0) return node;
    if (cmp < 0) return this.floor(node.left, key);
    const t = this.floor(node.right, key);
    return t !== null ? t : node;
  }

  public ceilingKey(key: K): K | null {
    const node = this.ceiling(this.root, key);
    return node === null ? null : node.key;
  }

  private ceiling(node: LLRBNode<K, V> | null, key: K): LLRBNode<K, V> | null {
    if (node === null) return null;
    const cmp = this.comparator(key, node.key);
    if (cmp === 0) return node;
    if (cmp > 0) return this.ceiling(node.right, key);
    const t = this.ceiling(node.left, key);
    return t !== null ? t : node;
  }

  public toInOrderArray(): Array<{ key: K; val: V; color: string }> {
    const result: Array<{ key: K; val: V; color: string }> = [];
    const traverse = (n: LLRBNode<K, V> | null) => {
      if (n === null) return;
      traverse(n.left);
      result.push({ key: n.key, val: n.val, color: n.color === RED ? 'RED' : 'BLACK' });
      traverse(n.right);
    };
    traverse(this.root);
    return result;
  }

  public getRoot(): LLRBNode<K, V> | null {
    return this.root;
  }

  public clear(): void {
    this.root = null;
  }
}
