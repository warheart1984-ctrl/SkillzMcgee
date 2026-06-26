import { ContinuityLedger } from "../../governance/continuityLedger.js";
import { StateAccumulator } from "../../governance/stateAccumulator.js";
import { prepareReceiptForAppend } from "../../singularity/receiptHash.js";

/**
 * Continuity-aware LLM adapter (K3): every call is logged to the ledger.
 */
export class LLMAdapter {
  /**
   * @param {(prompt: string) => Promise<unknown>} llmFn
   * @param {ContinuityLedger} ledger
   * @param {StateAccumulator} accumulator
   * @param {import("../../governance/types.js").GovernedReceipt["laws"]} lawsResult
   * @param {(entry: import("../../governance/types.js").GovernedReceipt) => Promise<void>} [onPersist]
   * @param {() => void} [onAfterAppend]
   */
  constructor(llmFn, ledger, accumulator, lawsResult, onPersist, onAfterAppend) {
    this.llmFn = llmFn;
    this.ledger = ledger;
    this.accumulator = accumulator;
    this.lawsResult = lawsResult;
    this.onPersist = onPersist ?? (async () => {});
    this.onAfterAppend = onAfterAppend ?? (() => {});
  }

  /**
   * @param {string} prompt
   * @param {{ sliceId?: string, actor?: string, intent?: unknown, parentId?: string }} [opts]
   */
  async ask(prompt, opts = {}) {
    const sliceId = opts.sliceId ?? "llm";
    const actor = opts.actor ?? "skillz";
    const context = this.accumulator.getSliceState(sliceId);
    const contextBlock =
      context && Object.keys(context).length > 0
        ? `Prior slice state (${sliceId}): ${JSON.stringify(context)}\n\n`
        : "";

    const fullPrompt = `${contextBlock}Question: ${prompt}`;
    let output;
    let status = "ok";

    try {
      output = await this.llmFn(fullPrompt);
    } catch (err) {
      status = "error";
      output = {
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const draft = {
      id: `REC-LLM-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      actor,
      slice: sliceId,
      intent: opts.intent ?? { type: "llm", prompt },
      output,
      status,
      laws: this.lawsResult,
      parentId: opts.parentId,
    };

    const entry = prepareReceiptForAppend(draft, this.ledger.all());
    this.ledger.append(entry);
    this.accumulator.applyEntry(entry);
    this.onAfterAppend();
    await this.onPersist(entry);

    return { output, receipt: entry };
  }
}
