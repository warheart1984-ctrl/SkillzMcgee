#!/usr/bin/env node
/**
 * Counterfactual Analysis Engine
 * Usage:
 *   counterfactual.mjs remove NODE <ID>
 *   counterfactual.mjs downgrade CLAIM <REQ_ID> <FROM> <TO>
 *   counterfactual.mjs remove EVIDENCE <EVID_ID>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function explainImpact(nodeId) {
  const r = spawnSync(process.execPath, [path.join(ROOT, "tools/generators/explain-node.mjs"), nodeId], {
    encoding: "utf8",
  });
  if (r.status !== 0) return { would_fail_if_removed: [], supports: [] };
  return JSON.parse(r.stdout);
}

function counterfactualRemoveNode(nodeId, graph, csr) {
  const explanation = explainImpact(nodeId);
  const impacted_requirements = [];
  const impacted_implementations = [];
  const regressed_claims = [];
  const failed_release_gates = ["proof_closure"];
  const notes = [];

  if (graph.requirements[nodeId]) {
    impacted_requirements.push(nodeId);
    const claim = csr.claims[nodeId];
    if (claim === "verified" || claim === "reproduced") {
      regressed_claims.push({ requirement_id: nodeId, from: claim, to: "implemented" });
    } else if (claim === "implemented") {
      regressed_claims.push({ requirement_id: nodeId, from: claim, to: "normative" });
    }
    notes.push(`Removing ${nodeId} orphans its evidence and provenance edges`);
  }

  for (const w of explanation.would_fail_if_removed ?? []) {
    notes.push(w);
    const m = w.match(/CRK1-R\d+/);
    if (m && !impacted_requirements.includes(m[0])) impacted_requirements.push(m[0]);
  }

  for (const s of explanation.supports ?? []) {
    if (graph.implementations[s]) impacted_implementations.push(s);
  }

  if (graph.authorities[nodeId]) {
    failed_release_gates.push("specification_legitimacy");
    notes.push("Authority removal illegitimizes all downstream specifications");
  }

  if (impacted_requirements.some((r) => csr.claims[r] === "verified")) {
    failed_release_gates.push("reproduction");
  }

  return {
    scenario: `REMOVE NODE ${nodeId}`,
    impacted_requirements: [...new Set(impacted_requirements)],
    impacted_implementations: [...new Set(impacted_implementations)],
    regressed_claims,
    failed_release_gates: [...new Set(failed_release_gates)],
    notes,
  };
}

function counterfactualDowngradeClaim(reqId, fromStatus, toStatus, csr) {
  const current = csr.claims[reqId];
  const notes = [];
  const failed_release_gates = [];

  if (!current) notes.push(`Requirement ${reqId} not in CSR`);
  if (current && current !== fromStatus) {
    notes.push(`CSR has ${current}, not ${fromStatus} — scenario is hypothetical`);
  }

  if (toStatus === "normative" || toStatus === "research") failed_release_gates.push("proof_closure");
  if (fromStatus === "reproduced" && toStatus !== "reproduced") failed_release_gates.push("reproduction");

  return {
    scenario: `DOWNGRADE CLAIM ${reqId} FROM ${fromStatus} TO ${toStatus}`,
    impacted_requirements: [reqId],
    impacted_implementations: [],
    regressed_claims: [{ requirement_id: reqId, from: fromStatus, to: toStatus }],
    failed_release_gates,
    notes: [
      ...notes,
      `Claim ${reqId} would no longer satisfy ${fromStatus} release criteria`,
    ],
  };
}

function counterfactualRemoveEvidence(evidId, graph) {
  const impacted_requirements = [];
  for (const [reqId, node] of Object.entries(graph.requirements)) {
    if (node.evidence?.includes(evidId)) impacted_requirements.push(reqId);
  }
  return {
    scenario: `REMOVE EVIDENCE ${evidId}`,
    impacted_requirements,
    impacted_implementations: [],
    regressed_claims: impacted_requirements.map((r) => ({
      requirement_id: r,
      from: "verified",
      to: "implemented",
    })),
    failed_release_gates: impacted_requirements.length ? ["proof_closure", "verification"] : [],
    notes: impacted_requirements.map(
      (r) => `Removing ${evidId} breaks verification for ${r}`
    ),
  };
}

const [action, kind, ...rest] = process.argv.slice(2);
const graphPath = path.join(ROOT, "conformance/proof-graph/index.json");

if (!fs.existsSync(graphPath)) {
  console.error("Proof graph missing. Run: node tools/generators/proof-graph-index.mjs");
  process.exit(3);
}

const graph = loadJson(graphPath);
const csrPath = path.join(ROOT, "conformance/observability/CSR-1.0/registry.json");
const csr = fs.existsSync(csrPath) ? loadJson(csrPath) : { claims: {} };

let result;
if (action === "remove" && kind === "NODE" && rest[0]) {
  result = counterfactualRemoveNode(rest[0], graph, csr);
} else if (action === "downgrade" && kind === "CLAIM" && rest.length >= 3) {
  result = counterfactualDowngradeClaim(rest[0], rest[1], rest[2], csr);
} else if (action === "remove" && kind === "EVIDENCE" && rest[0]) {
  result = counterfactualRemoveEvidence(rest[0], graph);
} else {
  console.error(`Usage:
  counterfactual.mjs remove NODE <ID>
  counterfactual.mjs downgrade CLAIM <REQ_ID> <FROM> <TO>
  counterfactual.mjs remove EVIDENCE <EVID_ID>`);
  process.exit(2);
}

console.log(JSON.stringify(result, null, 2));
