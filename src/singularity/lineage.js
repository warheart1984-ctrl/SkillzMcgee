/**
 * AS-2 — ParentId lineage chains.
 */

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function indexById(entries) {
  return new Map(entries.map((e) => [e.id, e]));
}

/**
 * Resolve lineageId (root ancestor) and depth from parentId chain.
 * @param {import("../governance/types.js").GovernedReceipt} receipt
 * @param {Map<string, import("../governance/types.js").GovernedReceipt>} byId
 */
export function resolveLineageFields(receipt, byId) {
  if (!receipt.parentId) {
    return { lineageId: receipt.id, depth: 0 };
  }
  const parent = byId.get(receipt.parentId);
  if (!parent) {
    return { lineageId: receipt.id, depth: 0 };
  }
  return {
    lineageId: parent.lineageId ?? parent.id,
    depth: (parent.depth ?? 0) + 1,
  };
}

/**
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function groupByLineage(entries) {
  /** @type {Map<string, import("../governance/types.js").GovernedReceipt[]>} */
  const map = new Map();
  for (const entry of entries) {
    const lid = entry.lineageId ?? entry.id;
    if (!map.has(lid)) map.set(lid, []);
    map.get(lid).push(entry);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }
  return map;
}

/**
 * Fork detection — multiple children sharing one parentId.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function detectBranches(entries) {
  /** @type {Map<string, string[]>} */
  const byParent = new Map();
  for (const entry of entries) {
    if (!entry.parentId) continue;
    if (!byParent.has(entry.parentId)) byParent.set(entry.parentId, []);
    byParent.get(entry.parentId).push(entry.id);
  }
  return [...byParent.entries()]
    .filter(([, children]) => children.length > 1)
    .map(([parentId, children]) => ({ parentId, children }));
}

/**
 * Build worldlines — ordered paths per lineage root.
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function buildWorldlines(entries) {
  const lineages = groupByLineage(entries);
  return [...lineages.entries()].map(([lineageId, chain]) => ({
    lineageId,
    depth: Math.max(...chain.map((c) => c.depth ?? 0)),
    path: chain.map((c) => c.id),
    branchCount: detectBranches(chain).length,
  }));
}

/**
 * Enrich all entries with lineage fields (batch replay).
 * @param {import("../governance/types.js").GovernedReceipt[]} entries
 */
export function enrichAllLineage(entries) {
  const sorted = [...entries].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );
  /** @type {import("../governance/types.js").GovernedReceipt[]} */
  const enriched = [];
  const byId = new Map();

  for (const entry of sorted) {
    const fields = resolveLineageFields(entry, byId);
    const next = { ...entry, ...fields };
    enriched.push(next);
    byId.set(next.id, next);
  }
  return enriched;
}
