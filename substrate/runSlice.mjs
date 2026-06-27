/**
 * Slice executor — Codex constitutional run path (CRK-2 + continuity + drift).
 */
import { executeCapability } from "../nova-studio/server/runtime/capabilities.mjs";
import {
  appendReceipt,
  getLedger,
  patchReceipt,
} from "../nova-studio/server/runtime/studioRuntime.mjs";
import { evaluateLawKernel } from "../nova-studio/server/runtime/lawKernel.mjs";
import { computeProvenance } from "../nova-studio/server/runtime/provenance.mjs";
import { recordSessionEvent } from "../nova-studio/server/runtime/sessionRecorder.mjs";
import { getAllCapabilities } from "./capabilities-registry.mjs";
import {
  stableHash,
  capabilitySignatureHash,
  mapReceiptToEnvelope,
} from "../nova-studio/server/runtime/substrateState.mjs";
import { evaluateCrk2Invariants } from "./crk2-invariants.mjs";
import {
  appendContinuityEvents,
  loadContinuityState,
  persistContinuityArtifact,
  persistContinuityReceipt,
} from "./continuity-substrate.mjs";
import { recordDriftPoint, getDriftPoints } from "./drift-engine.mjs";
import { buildSliceRuntime } from "./executor/slices.mjs";

function findCapability(capabilityId) {
  return getAllCapabilities().find((c) => c.id === capabilityId);
}

async function executeSliceBody(cap, input) {
  const capabilityId = cap.id;
  if (capabilityId === "slice_math") {
    const value = Number(input?.value ?? 0) + 1;
    return { ok: true, output: { value }, deterministic: true };
  }
  if (cap.kind === "llm") {
    const runtime = buildSliceRuntime(cap);
    const output = await runtime.run(input);
    return { ok: true, output, deterministic: false };
  }
  const result = await executeCapability(capabilityId, input);
  return { ...result, deterministic: capabilityId !== "llm" };
}

/**
 * @param {{ operator: string, capabilityId: string, input: object, continuityState?: { checkpoint: string, events: unknown[] }, parentReceiptId?: string }} params
 */
export async function runSlice({ operator, capabilityId, input, continuityState, parentReceiptId }) {
  const cap = findCapability(capabilityId);
  if (!cap) {
    throw new Error(`Unknown capability: ${capabilityId}`);
  }

  const priorContinuity = continuityState ?? loadContinuityState();
  const ledger = getLedger();
  const parentReceipt = parentReceiptId
    ? ledger.find((r) => r.id === parentReceiptId) ?? ledger.at(-1)
    : ledger.at(-1);
  const inputHash = stableHash(input);
  const sigHash = capabilitySignatureHash(cap);
  const timestamp = new Date().toISOString();

  const preViolations = evaluateCrk2Invariants({
    operator,
    capabilityId,
    input,
    inputHash,
    capabilitySignatureHash: sigHash,
    parentReceiptId: parentReceipt?.id,
    expectedParentReceiptId: parentReceipt?.id,
    previousCheckpoint: priorContinuity.checkpoint,
    continuityCheckpoint: timestamp,
    requireParent: false,
  });

  const execResult = await executeSliceBody(cap, input);
  const output = execResult.output;
  const outputHash = output !== undefined && output !== null ? stableHash(output) : undefined;

  const previousSameCap = [...ledger].reverse().find((r) => (r.capability ?? r.slice) === capabilityId);
  const previousOutputHash = previousSameCap?.outputHash ?? previousSameCap?.output
    ? stableHash(previousSameCap.output)
    : undefined;

  const expectedDriftValue =
    capabilityId === "slice_math" ? Number(input?.value ?? 0) + 1 : 100;
  const actualDriftValue =
    capabilityId === "slice_math" ? output?.value : execResult.ok ? 100 : 95;

  const driftRecord = recordDriftPoint({
    t: Date.now(),
    expected: expectedDriftValue,
    actual: actualDriftValue,
    capabilityId,
  });

  const postViolations = evaluateCrk2Invariants({
    operator,
    capabilityId,
    input,
    inputHash,
    output,
    outputHash,
    capabilitySignatureHash: sigHash,
    parentReceiptId: parentReceipt?.id,
    expectedParentReceiptId: parentReceipt?.id,
    previousCheckpoint: priorContinuity.checkpoint,
    continuityCheckpoint: timestamp,
    deterministic: execResult.deterministic,
    previousOutputHash,
    expectedOutputHash: execResult.deterministic ? outputHash : undefined,
    driftPoint: driftRecord.point,
    previousDriftActual: getDriftPoints().at(-2)?.actual,
  });

  const violations = [...new Set([...preViolations, ...postViolations])];
  const allowed = execResult.ok && violations.length === 0;

  const receipt = appendReceipt({
    actor: operator,
    capability: capabilityId,
    slice: capabilityId,
    intent: input,
    output,
    status: allowed ? "ok" : "error",
    laws: { allowed, violations },
    parentId: parentReceiptId ?? parentReceipt?.id ?? null,
    phase: "capability_run",
    inputHash,
    outputHash,
  });

  const envelope = mapReceiptToEnvelope(receipt);
  const verdict = evaluateLawKernel({
    capabilityId,
    output,
    outputHash,
    timestamp: receipt.timestamp,
    envelope,
  });
  const provenance = await computeProvenance({ receipt, envelope, capabilityId });
  patchReceipt(receipt.id, { verdict, provenance });

  recordSessionEvent({
    kind: "slice_run",
    capabilityId,
    receiptId: receipt.id,
    operator,
    ok: allowed,
    driftCount: verdict.drift?.length ?? 0,
  });
  persistContinuityReceipt(receipt.id, envelope);

  const eventId = `CE-${receipt.id}`;
  const continuityEvents = [
    {
      id: `${eventId}-evt`,
      kind: "EVENT",
      timestamp,
      label: `run:${capabilityId}`,
      receiptId: receipt.id,
    },
    {
      id: `${eventId}-dec`,
      kind: "DECISION",
      timestamp,
      label: allowed ? "approve" : "reject",
      receiptId: receipt.id,
    },
    {
      id: `${eventId}-art`,
      kind: "ARTIFACT",
      timestamp,
      label: capabilityId,
      receiptId: receipt.id,
      artifactId: receipt.id,
    },
  ];

  const continuity = appendContinuityEvents(continuityEvents);
  persistContinuityArtifact(receipt.id, { envelope, output, input });

  return {
    envelope,
    output: envelope,
    value: output,
    receipt: { ...receipt, verdict, provenance },
    continuity,
    drift: driftRecord,
    violations,
    verdict,
    provenance,
    ok: allowed,
  };
}
