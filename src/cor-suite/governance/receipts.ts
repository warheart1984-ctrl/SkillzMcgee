import crypto from "node:crypto";
import fs from "node:fs";
import { COR_SUITE_PATHS } from "../paths.js";
import type { GovernanceReceipt } from "./invariants.js";

export function emitGovernanceReceipt(receipt: GovernanceReceipt): string {
  fs.mkdirSync(COR_SUITE_PATHS.outputDir, { recursive: true });
  fs.writeFileSync(
    COR_SUITE_PATHS.outputs.governanceReceipt,
    `${JSON.stringify(receipt, null, 2)}\n`,
    "utf8",
  );
  return COR_SUITE_PATHS.outputs.governanceReceipt;
}

export function signReceiptPayload(receipt: Omit<GovernanceReceipt, "signature">): string {
  const payload = JSON.stringify({
    decisionId: receipt.decisionId,
    corStateRef: receipt.corStateRef,
    decision: receipt.decision,
    scope: receipt.scope,
    rationale: receipt.rationale,
    steward: receipt.steward,
    timestamp: receipt.timestamp,
  });
  return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
}
