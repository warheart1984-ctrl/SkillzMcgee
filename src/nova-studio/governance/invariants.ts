import type { GovernanceEnvelope } from "./receiptTypes";

export function checkInvariants(env: GovernanceEnvelope): string[] {
  const issues: string[] = [];
  if (!env.operator) issues.push("missing-operator");
  if (!env.capability) issues.push("missing-capability");
  if (!env.inputHash) issues.push("missing-input-hash");
  return issues;
}
