#!/usr/bin/env node
/**
 * Explain-This-Node engine — EXPLAIN NODE <NODE_ID>
 * Usage: node tools/generators/explain-node.mjs <NODE_ID>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function resolveNode(id, graph) {
  if (graph.requirements[id]) return { type: "Requirement", node: graph.requirements[id] };
  if (graph.authorities[id]) return { type: "Authority", node: graph.authorities[id] };
  if (graph.specifications[id]) return { type: "Specification", node: graph.specifications[id] };
  if (graph.implementations[id]) return { type: "Implementation", node: graph.implementations[id] };
  if (graph.verifications?.[id]) return { type: "Verification", node: graph.verifications[id] };
  if (graph.transformations?.[id]) return { type: "Transformation", node: graph.transformations[id] };
  if (graph.provenance?.[id]) return { type: "Provenance", node: graph.provenance[id] };
  if (id.startsWith("EVID-")) return { type: "Evidence", node: { id } };
  if (id.startsWith("REC-")) return { type: "Receipt", node: { id } };
  return null;
}

function downstreamRequirements(id, resolved, graph) {
  const reqs = new Set();
  if (resolved.type === "Requirement") reqs.add(id);
  if (resolved.type === "Authority") {
    for (const spec of resolved.node.authorizes_specs ?? []) {
      for (const r of graph.specifications[spec]?.requirements ?? []) reqs.add(r);
    }
  }
  if (resolved.type === "Specification") {
    for (const r of resolved.node.requirements ?? []) reqs.add(r);
  }
  if (resolved.type === "Implementation") {
    for (const r of resolved.node.requirements ?? []) reqs.add(r);
  }
  if (resolved.type === "Verification") {
    for (const r of resolved.node.requirements ?? []) reqs.add(r);
  }
  return [...reqs];
}

function buildExplanation(id, graph, cor, csr) {
  const resolved = resolveNode(id, graph);
  if (!resolved) {
    console.error(JSON.stringify({ error: `unknown node: ${id}` }, null, 2));
    process.exit(2);
  }

  const claim_status = csr.claims[id] ?? (resolved.type === "Requirement" ? csr.claims[id] : undefined);
  const corRow = cor?.requirements?.find((r) => r.requirement_id === id);

  const exists_because = [];
  const authorized_by = [];
  const defined_by_spec = [];
  const depends_on = [];
  const supports = [];
  const evidence_supporting = [];
  const would_fail_if_removed = [];

  if (resolved.type === "Requirement") {
    const n = resolved.node;
    exists_because.push(`required_by ${id}`);
    authorized_by.push(...(n.authority ?? []));
    defined_by_spec.push(...(n.specifications ?? []));
    depends_on.push(...(n.authority ?? []), ...(n.specifications ?? []), ...(n.verification_methods ?? []));
    supports.push(...(n.implementations ?? []));
    evidence_supporting.push(...(n.evidence ?? []));
    if (n.receipts?.length) supports.push(...n.receipts);
    if (n.provenance?.length) supports.push(...n.provenance);
    would_fail_if_removed.push(`Proof closure fails for ${id}`);
    if (claim_status === "verified") would_fail_if_removed.push(`${id} loses verified status`);
  } else if (resolved.type === "Authority") {
    exists_because.push("root governance authority");
    supports.push(...(resolved.node.authorizes_specs ?? []));
    would_fail_if_removed.push("All authorized specifications become illegitimate");
  } else if (resolved.type === "Specification") {
    exists_because.push(`authorized_by ${resolved.node.authorized_by}`);
    authorized_by.push(resolved.node.authorized_by);
    depends_on.push(resolved.node.authorized_by);
    supports.push(...(resolved.node.requirements ?? []), ...(resolved.node.implements ?? []));
    would_fail_if_removed.push(`Implementations claiming ${id} become untrusted`);
  } else if (resolved.type === "Implementation") {
    exists_because.push(`claims_conformance_to ${resolved.node.claims_conformance_to}`);
    defined_by_spec.push(resolved.node.claims_conformance_to);
    depends_on.push(resolved.node.claims_conformance_to);
    supports.push(...(resolved.node.requirements ?? []));
    would_fail_if_removed.push("Implementation becomes untrusted for all covered requirements");
  } else if (resolved.type === "Verification") {
    exists_because.push("defined in CTS-1.0 / resolution-map");
    supports.push(...(resolved.node.requirements ?? []));
    for (const r of resolved.node.requirements ?? []) {
      would_fail_if_removed.push(`Requirement ${r.replace("CRK1-", "")} loses verification`);
    }
  }

  const impacted = downstreamRequirements(id, resolved, graph);
  for (const r of impacted) {
    if (!would_fail_if_removed.some((w) => w.includes(r))) {
      would_fail_if_removed.push(`Downstream requirement ${r} loses proof path`);
    }
  }

  return {
    node_id: id,
    node_type: resolved.type,
    exists_because,
    authorized_by,
    defined_by_spec,
    depends_on: [...new Set(depends_on)],
    supports: [...new Set(supports)],
    evidence_supporting,
    would_fail_if_removed,
    claim_status: claim_status ?? corRow?.claim_status ?? "normative",
    cor_context: corRow
      ? {
          implementation_status: corRow.implementation_status,
          verification_status: corRow.verification_status,
          evidence_status: corRow.evidence_status,
          receipt_status: corRow.receipt_status,
          provenance_status: corRow.provenance_status,
          exceptions: corRow.exceptions ?? [],
        }
      : undefined,
  };
}

const nodeId = process.argv[2];
if (!nodeId) {
  console.error("Usage: explain-node.mjs <NODE_ID>");
  process.exit(2);
}

const graphPath = path.join(ROOT, "conformance/proof-graph/index.json");
if (!fs.existsSync(graphPath)) {
  console.error("Proof graph missing. Run: node tools/generators/proof-graph-index.mjs");
  process.exit(3);
}

const graph = loadJson(graphPath);
const csr = loadJson(path.join(ROOT, "conformance/observability/CSR-1.0/registry.json"));
const corPath = path.join(ROOT, "meta/COR-1.0.json");
const cor = fs.existsSync(corPath) ? loadJson(corPath) : null;

console.log(JSON.stringify(buildExplanation(nodeId, graph, cor, csr), null, 2));
