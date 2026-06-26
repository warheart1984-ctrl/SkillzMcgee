export function checkEnvelopePre(env) {
  const issues = [];
  if (!env.operator) issues.push("missing-operator");
  if (!env.capabilityId) issues.push("missing-capability");
  if (!env.inputHash) issues.push("missing-input-hash");
  if (!env.capabilitySignatureHash) issues.push("missing-capability-signature");
  if (!env.continuityCheckpoint) issues.push("missing-continuity-checkpoint");
  return issues;
}

export function checkEnvelopePost(
  env,
  previousCheckpoint,
  previousReceiptId,
  expectedOutputHash,
) {
  const issues = [];
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
