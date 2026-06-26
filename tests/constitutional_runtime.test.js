import test from "node:test";
import assert from "node:assert/strict";
import {
  computeQuorumState,
  quorumRequired,
  approvalRequired,
} from "../nova-studio/server/runtime/quorum.mjs";
import { evaluateReleaseReadiness } from "../nova-studio/server/runtime/releaseReadiness.mjs";
import {
  generateCanonicalManifest,
  validateCanonicalManifest,
} from "../nova-studio/server/runtime/canonicalManifest.mjs";
import { getProofGraphVisual } from "../nova-studio/server/runtime/proofGraphData.mjs";
import { executePgql } from "../nova-studio/server/runtime/pgql.mjs";
import { runGovernedCapability } from "../nova-studio/server/runtime/runGovernedCapability.mjs";

test("quorum formulas match SCC-1.0", () => {
  assert.equal(quorumRequired(5), 4);
  assert.equal(quorumRequired(3), 2);
  assert.equal(approvalRequired(4), 3);
  assert.equal(approvalRequired(0), 1);
});

test("computeQuorumState derives green/yellow/red status", () => {
  const stewards = [
    { id: "a", online: true },
    { id: "b", online: true },
    { id: "c", online: true },
    { id: "d", online: true },
    { id: "e", online: true },
  ];
  const green = computeQuorumState({
    stewards,
    votes: [
      { vote: "approve" },
      { vote: "approve" },
      { vote: "approve" },
      { vote: "approve" },
    ],
  });
  assert.equal(green.quorum_required, 4);
  assert.equal(green.approval_required, 3);
  assert.equal(green.status, "green");
  assert.equal(green.can_vote, true);
});

test("canonical manifest generates hash tree", () => {
  const manifest = generateCanonicalManifest({ write: false });
  assert.ok(manifest.rootHash.startsWith("sha256:"));
  assert.ok(manifest.files.length > 0);
  assert.equal(manifest.version, "1.0");
});

test("proof graph visual exposes nodes and styled edges", () => {
  const graph = getProofGraphVisual();
  assert.ok(graph.nodeCount > 0);
  assert.ok(graph.edgeCount > 0);
  assert.ok(graph.nodes.some((n) => n.type === "normative"));
  assert.ok(graph.edges.some((e) => e.kind === "authorizes" || e.kind === "depends-on"));
});

test("release readiness returns structured gate", () => {
  const r = evaluateReleaseReadiness({ release: "v1.0" });
  assert.equal(r.release, "v1.0");
  assert.ok(Array.isArray(r.reasons));
  assert.ok(Array.isArray(r.blockingIssues));
  assert.equal(typeof r.ready, "boolean");
});

test("PGQL SELECT claims executes", () => {
  const r = executePgql('SELECT claims WHERE status = "missing"');
  assert.ok(r.result);
  assert.equal(r.result.type, "claims");
});

test("runGovernedCapability returns receipt verdict and provenance", async () => {
  const result = await runGovernedCapability("slice_math", { value: 7 });
  assert.ok(result.receipt?.id);
  assert.ok(result.verdict);
  assert.ok(result.provenance?.receiptId);
  assert.equal(result.receipt.output?.value ?? result.value?.value, 8);
});
