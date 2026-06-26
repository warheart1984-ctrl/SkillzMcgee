import type { CapabilitySignature, GovernanceEnvelope } from "./receiptTypes";
import { stableHash } from "../lib/hash";
import { checkEnvelopePost, checkEnvelopePre } from "./invariants";

export function createPendingEnvelope(params: {
  operator: string;
  capability: CapabilitySignature;
  continuityCheckpoint: string;
  parentReceiptId?: string;
  input: unknown;
}): GovernanceEnvelope {
  const inputHash = stableHash(params.input);
  const capabilitySignatureHash = stableHash({
    id: params.capability.id,
    inputSchema: params.capability.inputSchema,
    outputSchema: params.capability.outputSchema,
  });
  const timestamp = new Date().toISOString();

  const env: GovernanceEnvelope = {
    id: stableHash({
      operator: params.operator,
      capabilityId: params.capability.id,
      continuityCheckpoint: params.continuityCheckpoint,
      parentReceiptId: params.parentReceiptId,
      inputHash,
      capabilitySignatureHash,
      timestamp,
    }),
    operator: params.operator,
    capabilityId: params.capability.id,
    capabilitySignatureHash,
    continuityCheckpoint: params.continuityCheckpoint,
    parentReceiptId: params.parentReceiptId,
    inputHash,
    timestamp,
    status: "pending",
  };

  const preIssues = checkEnvelopePre(env);
  if (preIssues.length) {
    env.status = "error";
    env.invariantViolations = preIssues;
  }
  return env;
}

export function finalizeEnvelope(
  env: GovernanceEnvelope,
  output: unknown,
  previousCheckpoint: string,
  previousReceiptId?: string,
): GovernanceEnvelope {
  const outputHash = stableHash(output);
  env.outputHash = outputHash;

  const postIssues = checkEnvelopePost(env, previousCheckpoint, previousReceiptId);
  if (postIssues.length) {
    env.status = "error";
    env.invariantViolations = [...(env.invariantViolations ?? []), ...postIssues];
  } else {
    env.status = "ok";
  }
  return env;
}
