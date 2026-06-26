import crypto from "node:crypto";
import { checkEnvelopePre, checkEnvelopePost } from "../services/governanceInvariants.mjs";

export function stableStringify(payload) {
  if (payload === null || typeof payload !== "object") {
    return JSON.stringify(payload);
  }
  if (Array.isArray(payload)) {
    return `[${payload.map(stableStringify).join(",")}]`;
  }
  const keys = Object.keys(payload).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(payload[key])}`).join(",")}}`;
}

export function stableHash(payload) {
  return `sha256:${crypto.createHash("sha256").update(stableStringify(payload)).digest("hex")}`;
}

export function createExecutionEnvelope(params) {
  const inputHash = stableHash(params.input);
  const capabilitySignatureHash = stableHash({
    id: params.capability.id,
    kind: params.capability.kind,
    inputSchema: params.capability.inputSchema,
    outputSchema: params.capability.outputSchema,
  });

  const env = {
    id: stableHash({
      operator: params.operator,
      capabilityId: params.capability.id,
      continuityCheckpoint: params.continuityCheckpoint,
      parentReceiptId: params.parentReceiptId,
      inputHash,
      capabilitySignatureHash,
    }),
    operator: params.operator,
    capabilityId: params.capability.id,
    capabilitySignatureHash,
    continuityCheckpoint: params.continuityCheckpoint,
    parentReceiptId: params.parentReceiptId,
    inputHash,
    timestamp: new Date().toISOString(),
    status: "pending",
  };

  const preIssues = checkEnvelopePre(env);
  if (preIssues.length) {
    env.status = "error";
    env.invariantViolations = preIssues;
  }
  return env;
}

export async function runSliceWithEnvelope(
  env,
  runSlice,
  previousCheckpoint,
  previousReceiptId,
  expectedOutputHash,
) {
  try {
    const value = await runSlice();
    env.value = value;
    env.outputHash = stableHash(value);
    env.continuityCheckpoint = nextCheckpoint(previousCheckpoint);
    const postIssues = checkEnvelopePost(
      env,
      previousCheckpoint,
      previousReceiptId,
      expectedOutputHash,
    );
    env.status = postIssues.length ? "error" : "ok";
    if (postIssues.length) {
      env.invariantViolations = [...(env.invariantViolations ?? []), ...postIssues];
    }
    return env;
  } catch (error) {
    env.continuityCheckpoint = nextCheckpoint(previousCheckpoint);
    env.status = "error";
    env.invariantViolations = [
      ...(env.invariantViolations ?? []),
      `execution-error:${error instanceof Error ? error.message : String(error)}`,
    ];
    return env;
  }
}

function nextCheckpoint(previous) {
  const n = Number.parseInt(previous || "0", 10);
  return String(n + 1).padStart(5, "0");
}
