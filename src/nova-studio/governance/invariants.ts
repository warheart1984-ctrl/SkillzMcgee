import type { GovernanceEnvelope } from "./receiptTypes";

export function checkEnvelopePre(env: GovernanceEnvelope): string[] {
  const issues: string[] = [];
  if (!env.operator) issues.push("missing-operator");
  if (!env.capabilityId) issues.push("missing-capability");
  if (!env.inputHash) issues.push("missing-input-hash");
  if (!env.capabilitySignatureHash) issues.push("missing-capability-signature");
  if (!env.continuityCheckpoint) issues.push("missing-continuity-checkpoint");
  return issues;
}

export function checkEnvelopePost(
  env: GovernanceEnvelope,
  previousCheckpoint: string,
  previousReceiptId?: string,
  expectedOutputHash?: string,
): string[] {
  const issues: string[] = [];
  if (!env.outputHash) issues.push("missing-output-hash");
  if (env.parentReceiptId !== previousReceiptId) {
    issues.push("lineage-parent-mismatch");
  }
  if (env.continuityCheckpoint <= previousCheckpoint) {
    issues.push("non-monotonic-continuity");
  }
  if (expectedOutputHash && env.outputHash !== expectedOutputHash) {
    issues.push("signature-mismatch-output");
  }
  return issues;
}

/** @deprecated use checkEnvelopePre */
export function checkInvariants(env: {
  operator: string;
  capability?: string;
  capabilityId?: string;
  inputHash: string;
}): string[] {
  const issues: string[] = [];
  if (!env.operator) issues.push("missing-operator");
  if (!env.capabilityId && !env.capability) issues.push("missing-capability");
  if (!env.inputHash) issues.push("missing-input-hash");
  return issues;
}
