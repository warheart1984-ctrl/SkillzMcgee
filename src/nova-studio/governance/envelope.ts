import type { GovernanceEnvelope } from "./receiptTypes";
import { checkInvariants } from "./invariants";

export function createEnvelope(params: {
  operator: string;
  capability: string;
  continuityCheckpoint: string;
  inputHash: string;
}): GovernanceEnvelope {
  const env: GovernanceEnvelope = {
    operator: params.operator,
    capability: params.capability,
    continuityCheckpoint: params.continuityCheckpoint,
    inputHash: params.inputHash,
    timestamp: new Date().toISOString(),
    status: "pending",
  };
  const issues = checkInvariants(env);
  if (issues.length) {
    env.status = "error";
  }
  return env;
}
