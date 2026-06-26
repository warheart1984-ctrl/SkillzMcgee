import {
  bootGovernedRuntime,
  getRuntime,
  _resetRuntimeForTests,
} from "../runtime/boot.js";
import { clearStoredReceipts } from "../storage/db.js";
import { prepareReceiptForAppend } from "../singularity/receiptHash.js";

/**
 * @deprecated Prefer appendGovernedReceipt via intentRouter; kept for CTS/dashboard imports.
 */
export function createReceipt(intent, output, lawsResult) {
  const rt = getRuntime();
  const slice =
    typeof intent === "object" &&
    intent !== null &&
    "type" in intent &&
    typeof intent.type === "string"
      ? intent.type
      : "nova";

  const draft = {
    id: `REC-NOVA-${crypto.randomUUID()}`,
    timestamp: new Date().toISOString(),
    actor: "skillz",
    slice,
    intent,
    output,
    status: lawsResult.allowed === false ? "error" : "ok",
    laws: lawsResult,
  };

  const entry = prepareReceiptForAppend(draft, rt.ledger.all());
  rt.ledger.append(entry);
  rt.accumulator.applyEntry(entry);
  return entry;
}

export function getReceipts() {
  return getRuntime().ledger.all();
}

export async function clearReceipts() {
  await clearStoredReceipts();
  _resetRuntimeForTests();
  bootGovernedRuntime([]);
}
