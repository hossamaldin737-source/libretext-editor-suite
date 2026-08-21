/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📌 ملخص توجيهي | Guiding Summary
 * ═══════════════════════════════════════════════════════════════════════════
 * 📄 الملف: disjoint-set.ts
 * 📂 المسار: src/algorithms/structure/disjoint-set.ts
 * 🎯 الهدف الرئيسي: بنية المجموعات المنفصلة (Disjoint-Set / Union-Find) لدمج خلايا الجداول
 * 📋 المعايير: ضغط المسارات (Path Compression) ودمج بالرتبة (Union by Rank)
 * 🧪 الاختبارات: src/algorithms/tests/test-runner.ts
 * 🏷️ المعرف: ALGO-006-UNION-FIND
 * 📅 تاريخ الإنشاء: 2026-08-21
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧠 الطريقة المبتكرة | Innovative Pattern:
 *    Disjoint Set Union-Find with Dynamic 2D Cell Grid Merging & Bounding Box
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚠️ نقاط الخطر الإلزامية | Mandatory Gotchas:
 *    1. تجنب الحلقات أثناء ضغط المسارات
 *    2. صيانة الممثل الأساسي (Canonical Cell / Top-Left) عند الدمج
 * ═══════════════════════════════════════════════════════════════════════════
 * 🩹 البرمجة الدفاعية | Defensive Coding:
 *    - حماية من الإحداثيات السالبة والمفاتيح غير الموجودة
 *    - التحقق من تكرار الدمج لنفس المجموعة
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔗 الملفات المرتبطة | Linked Files:
 *    - 📇 الفهرس: FUNCTION_INDEX.md
 *    - 📦 التبعيات: src/algorithms/types.ts
 *    - 📄 مرتبط مباشر: src/algorithms/index.ts
 * ═══════════════════════════════════════════════════════════════════════════
 * 📊 الدوال والخوارزميات | Functions & Algorithms:
 *    - DisjointSet.find: إيجاد ممثل المجموعة مع ضغط المسار (#L70)
 *    - DisjointSet.union: دمج مجموعتين وتحديث الرتبة (#L90)
 *    - DisjointSet.mergeRange: دمج نطاق خلايا شبكي (#L120)
 *    - DisjointSet.getMergedBounds: حساب الحدود المستطيلة للدمج (#L150)
 * ═══════════════════════════════════════════════════════════════════════════
 * 👤 المالك: Hossam El-Din Abdel-Moaty El-Khouly - All rights reserved
 * ⚖️ الترخيص: MIT License
 * 📚 المصادر المقتبسة: Robert Tarjan Union-Find Classic Analysis (MIT)
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface MergedCellBounds {
  readonly rootKey: string;
  readonly minRow: number;
  readonly maxRow: number;
  readonly minCol: number;
  readonly maxCol: number;
  readonly cellKeys: readonly string[];
  readonly rowSpan: number;
  readonly colSpan: number;
}

export class DisjointSet {
  private parent: Map<string, string> = new Map();
  private rank: Map<string, number> = new Map();
  private members: Map<string, Set<string>> = new Map();

  public makeSet(key: string): void {
    if (!this.parent.has(key)) {
      this.parent.set(key, key);
      this.rank.set(key, 0);
      this.members.set(key, new Set([key]));
    }
  }

  public find(key: string): string {
    this.makeSet(key);
    let root = key;
    while (this.parent.get(root) !== root) {
      root = this.parent.get(root)!;
    }
    // Path compression
    let curr = key;
    while (curr !== root) {
      const nxt = this.parent.get(curr)!;
      this.parent.set(curr, root);
      curr = nxt;
    }
    return root;
  }

  public connected(key1: string, key2: string): boolean {
    return this.find(key1) === this.find(key2);
  }

  public union(key1: string, key2: string): string {
    const root1 = this.find(key1);
    const root2 = this.find(key2);

    if (root1 === root2) return root1;

    const rank1 = this.rank.get(root1) || 0;
    const rank2 = this.rank.get(root2) || 0;

    let primaryRoot = root1;
    let secondaryRoot = root2;

    // We can prioritize top-left cell key lexicographically or by rank
    if (rank1 < rank2) {
      primaryRoot = root2;
      secondaryRoot = root1;
    } else if (rank1 === rank2) {
      this.rank.set(root1, rank1 + 1);
    }

    this.parent.set(secondaryRoot, primaryRoot);

    const primaryMembers = this.members.get(primaryRoot) || new Set([primaryRoot]);
    const secondaryMembers = this.members.get(secondaryRoot) || new Set([secondaryRoot]);

    secondaryMembers.forEach((m) => primaryMembers.add(m));
    this.members.delete(secondaryRoot);
    this.members.set(primaryRoot, primaryMembers);

    return primaryRoot;
  }

  public mergeRange(startRow: number, startCol: number, endRow: number, endCol: number): string {
    const minR = Math.min(startRow, endRow);
    const maxR = Math.max(startRow, endRow);
    const minC = Math.min(startCol, endCol);
    const maxC = Math.max(startCol, endCol);

    const primaryKey = `${minR}:${minC}`;
    this.makeSet(primaryKey);

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        const cellKey = `${r}:${c}`;
        this.makeSet(cellKey);
        this.union(primaryKey, cellKey);
      }
    }
    return this.find(primaryKey);
  }

  public unmerge(key: string): void {
    const root = this.find(key);
    const allMembers = Array.from(this.members.get(root) || [key]);

    for (const m of allMembers) {
      this.parent.set(m, m);
      this.rank.set(m, 0);
      this.members.set(m, new Set([m]));
    }
  }

  public getMergedBounds(key: string): MergedCellBounds | null {
    const root = this.find(key);
    const memberSet = this.members.get(root);
    if (!memberSet || memberSet.size <= 1) return null;

    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;
    const cellKeys: string[] = [];

    for (const cell of memberSet) {
      cellKeys.push(cell);
      const [rStr, cStr] = cell.split(':');
      const r = parseInt(rStr ?? '', 10);
      const c = parseInt(cStr ?? '', 10);
      if (!isNaN(r) && !isNaN(c)) {
        if (r < minRow) minRow = r;
        if (r > maxRow) maxRow = r;
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
      }
    }

    return {
      rootKey: root,
      minRow,
      maxRow,
      minCol,
      maxCol,
      cellKeys,
      rowSpan: maxRow - minRow + 1,
      colSpan: maxCol - minCol + 1,
    };
  }

  public getAllMergedClusters(): MergedCellBounds[] {
    const clusters: MergedCellBounds[] = [];
    const visitedRoots = new Set<string>();

    for (const root of this.members.keys()) {
      if (visitedRoots.has(root)) continue;
      visitedRoots.add(root);
      const bounds = this.getMergedBounds(root);
      if (bounds) {
        clusters.push(bounds);
      }
    }
    return clusters;
  }

  public clear(): void {
    this.parent.clear();
    this.rank.clear();
    this.members.clear();
  }
}
