import test from "node:test";
import assert from "node:assert/strict";

import { clearLedger, appendReceipt } from "../nova-studio/server/runtime/studioRuntime.mjs";
import { evaluateLawKernel } from "../nova-studio/server/runtime/lawKernel.mjs";
import { computeProvenance } from "../nova-studio/server/runtime/provenance.mjs";
import {
  buildReceiptLineage,
  computeDriftAnomalies,
  computeDriftHistory,
  diffReceipts,
  investigateReceipt,
  replayContinuityFromCheckpoint,
} from "../nova-studio/server/runtime/forensics.mjs";
import { runSlice } from "../substrate/runSlice.mjs";

test("law kernel detects output shape drift", () => {
  const ok = evaluateLawKernel({
    capabilityId: "slice_math",
    output: { value: 42 },
    outputHash: "abc",
    timestamp: new Date().toISOString(),
  });
  assert.equal(ok.ok, true);
  assert.equal(ok.drift.length, 0);

  const drift = evaluateLawKernel({
    capabilityId: "slice_math",
    output: { wrong: 1 },
    outputHash: "abc",
    timestamp: new Date().toISOString(),
  });
  assert.ok(drift.drift.some((d) => d.type === "missingFields"));
  assert.ok(drift.drift.some((d) => d.type === "extraFields"));
});

test("runSlice attaches verdict and provenance to receipt", async () => {
  clearLedger();
  const result = await runSlice({
    operator: "operator:test",
    capabilityId: "slice_math",
    input: { value: 1 },
    continuityState: { checkpoint: "00000", events: [] },
  });

  assert.ok(result.verdict);
  assert.equal(result.verdict.ok, true);
  assert.ok(result.provenance?.proofGraph?.implementation);
  assert.ok(result.receipt.verdict);
  assert.ok(result.receipt.provenance);
});

test("receipt diff and lineage", async () => {
  clearLedger();
  const a = appendReceipt({
    capability: "slice_math",
    slice: "slice_math",
    intent: { value: 1 },
    output: { value: 2 },
    laws: { allowed: true, violations: [] },
    outputHash: "h1",
  });
  const b = appendReceipt({
    capability: "slice_math",
    slice: "slice_math",
    intent: { value: 2 },
    output: { value: 3 },
    laws: { allowed: true, violations: [] },
    parentId: a.id,
    outputHash: "h2",
  });

  const diff = diffReceipts(a.id, b.id);
  assert.deepEqual(diff.changedFields, [{ field: "value", before: 2, after: 3 }]);

  const tree = buildReceiptLineage(a.id);
  assert.equal(tree.id, a.id);
  assert.equal(tree.children[0].id, b.id);
});

test("drift history and investigation aggregator", async () => {
  clearLedger();
  const result = await runSlice({
    operator: "operator:test",
    capabilityId: "slice_math",
    input: { value: 10 },
    continuityState: { checkpoint: "00000", events: [] },
  });

  const history = computeDriftHistory();
  assert.ok(history.some((h) => h.id === result.receipt.id));

  const anomalies = computeDriftAnomalies();
  assert.ok(anomalies.length >= 1);

  const dossier = await investigateReceipt(result.receipt.id);
  assert.equal(dossier.type, "receipt");
  assert.ok(dossier.lineage);
  assert.ok(Array.isArray(dossier.impact));
  assert.ok(dossier.continuity);
});

test("continuity replay from checkpoint", () => {
  const replay = replayContinuityFromCheckpoint("00000");
  assert.ok(replay.events !== undefined);
});

test("provenance links proof graph implementation", async () => {
  clearLedger();
  const receipt = appendReceipt({
    capability: "slice_math",
    slice: "slice_math",
    intent: { value: 1 },
    output: { value: 2 },
    laws: { allowed: true, violations: [] },
  });
  const provenance = await computeProvenance({
    receipt,
    envelope: { continuityCheckpoint: receipt.timestamp },
    capabilityId: "slice_math",
  });
  assert.ok(provenance.proofGraph.implementation);
  assert.ok(Array.isArray(provenance.proofGraph.dependencies));
});
