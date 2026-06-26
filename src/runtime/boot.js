import { ContinuityLedger } from "../governance/continuityLedger.js";
import { StateAccumulator } from "../governance/stateAccumulator.js";
import { LLMAdapter } from "../core/adapters/llmAdapter.js";
import { foldAbsoluteSingularity } from "../singularity/absoluteSingularity.js";
import { enrichReceiptChain, prepareReceiptForAppend } from "../singularity/receiptHash.js";
import { callFreeLLM } from "../runtime/webRuntime.js";
import { saveReceipt } from "../storage/db.js";

/** @type {GovernedRuntime | null} */
let runtime = null;

/**
 * @typedef {Object} GovernedRuntime
 * @property {ContinuityLedger} ledger
 * @property {StateAccumulator} accumulator
 * @property {import("../singularity/absoluteSingularity.js").AbsoluteSingularity | null} singularity
 * @property {boolean} booted
 */

/**
 * Normalize legacy receipts from IndexedDB into governed shape.
 * @param {Record<string, unknown>} raw
 * @returns {import("../governance/types.js").GovernedReceipt | null}
 */
export function normalizeReceipt(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = typeof raw.id === "string" ? raw.id : null;
  const timestamp = typeof raw.timestamp === "string" ? raw.timestamp : null;
  if (!id || !timestamp) return null;

  const laws = raw.laws;
  if (!laws || typeof laws !== "object" || typeof laws.allowed !== "boolean") {
    return null;
  }

  const intent = raw.intent ?? { type: "unknown" };
  const slice =
    typeof raw.slice === "string"
      ? raw.slice
      : typeof intent === "object" &&
          intent !== null &&
          "type" in intent &&
          typeof intent.type === "string"
        ? intent.type
        : "nova";

  const status =
    raw.status === "error" || raw.status === "ok"
      ? raw.status
      : laws.allowed === false
        ? "error"
        : "ok";

  return {
    id,
    timestamp,
    actor: typeof raw.actor === "string" ? raw.actor : "skillz",
    slice,
    intent,
    output: raw.output,
    status,
    laws: /** @type {import("../governance/types.js").LawsResult} */ (laws),
    parentId: typeof raw.parentId === "string" ? raw.parentId : undefined,
    lineageId: typeof raw.lineageId === "string" ? raw.lineageId : undefined,
    depth: typeof raw.depth === "number" ? raw.depth : undefined,
    receiptHash: typeof raw.receiptHash === "string" ? raw.receiptHash : undefined,
    parentHash: typeof raw.parentHash === "string" ? raw.parentHash : undefined,
  };
}

/**
 * Boot governed runtime: ledger → validator → accumulator → adapters.
 * @param {import("../governance/types.js").GovernedReceipt[]} [persistedReceipts]
 */
export function bootGovernedRuntime(persistedReceipts = []) {
  const ledger = new ContinuityLedger();
  const accumulator = new StateAccumulator();

  const sorted = [...persistedReceipts].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  const normalized = sorted
    .map((raw) => normalizeReceipt(raw))
    .filter((entry) => entry !== null);
  const enriched = enrichReceiptChain(normalized);

  for (const entry of enriched) {
    try {
      ledger.append(entry);
      accumulator.applyEntry(entry);
    } catch {
      // Skip corrupt legacy rows; do not break boot.
    }
  }

  runtime = {
    ledger,
    accumulator,
    singularity: foldAbsoluteSingularity(ledger.all()),
    booted: true,
  };

  return runtime;
}

/**
 * Re-fold Absolute Singularity from current ledger (after append).
 */
export function refreshSingularity() {
  const rt = getRuntime();
  rt.singularity = foldAbsoluteSingularity(rt.ledger.all());
  return rt.singularity;
}

/** @alias bootGovernedRuntime */
export const bootstrapGovernedRuntime = bootGovernedRuntime;

/**
 * @returns {GovernedRuntime}
 */
export function getRuntime() {
  if (!runtime) {
    return bootGovernedRuntime([]);
  }
  return runtime;
}

/**
 * @param {import("../governance/types.js").GovernedReceipt} entry
 */
async function persistReceipt(entry) {
  try {
    await saveReceipt(entry);
  } catch {
    // IndexedDB optional when storage blocked.
  }
}

/**
 * Build a governed receipt and append to ledger + state.
 * @param {unknown} intent
 * @param {unknown} output
 * @param {import("../governance/types.js").LawsResult} lawsResult
 * @param {{ slice?: string, actor?: string, parentId?: string }} [meta]
 */
export async function appendGovernedReceipt(intent, output, lawsResult, meta = {}) {
  const rt = getRuntime();
  const slice =
    meta.slice ??
    (typeof intent === "object" &&
    intent !== null &&
    "type" in intent &&
    typeof intent.type === "string"
      ? intent.type
      : "nova");

  const draft = {
    id: `REC-NOVA-${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    actor: meta.actor ?? "skillz",
    slice,
    intent,
    output,
    status: lawsResult.allowed === false ? "error" : "ok",
    laws: lawsResult,
    parentId: meta.parentId,
  };

  const entry = prepareReceiptForAppend(draft, rt.ledger.all());

  rt.ledger.append(entry);
  rt.accumulator.applyEntry(entry);
  rt.singularity = foldAbsoluteSingularity(rt.ledger.all());
  await persistReceipt(entry);

  return entry;
}

/**
 * @param {import("../governance/types.js").LawsResult} lawsResult
 */
export function createLLMAdapter(lawsResult) {
  const rt = getRuntime();
  return new LLMAdapter(
    callFreeLLM,
    rt.ledger,
    rt.accumulator,
    lawsResult,
    persistReceipt,
    () => {
      rt.singularity = foldAbsoluteSingularity(rt.ledger.all());
    }
  );
}

/** @internal */
export function _resetRuntimeForTests() {
  runtime = null;
}
