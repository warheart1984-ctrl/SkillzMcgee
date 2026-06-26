#!/usr/bin/env node
/**
 * DRA-1.0 — Dependency-Risk Analyzer
 * Usage: node tools/generators/dra-analyze.mjs [--out meta/DRA-1.0.json] [query args]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const COR_PATH = path.join(ROOT, "meta/COR-1.0.json");
const GRAPH_PATH = path.join(ROOT, "conformance/proof-graph/index.json");
const CSR_PATH = path.join(ROOT, "conformance/observability/CSR-1.0/registry.json");

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function loadJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function reqNum(id) {
  const m = id.match(/CRK1-R(\d+)/);
  return m ? m[1].padStart(3, "0") : null;
}

function artifactGaps(row) {
  const n = reqNum(row.requirement_id);
  const gaps = [];
  if (row.evidence_status !== "complete") gaps.push(`EVID-${n}`);
  if (row.receipt_status !== "complete") gaps.push(`REC-${n}`);
  if (row.provenance_status !== "anchored") gaps.push(`PROV-${n}`);
  if (row.verification_status !== "complete") gaps.push(`VERIF-${n}`);
  if (row.implementation_status !== "complete") gaps.push(`IMPL-${n}`);
  if (row.authority_status !== "present") gaps.push(`AUTH-${n}`);
  if (row.specification_status !== "present") gaps.push(`SPEC-${n}`);
  return gaps;
}

function buildAnalysis(cor, graph, csr) {
  const blockers = new Map();

  for (const row of cor.requirements) {
    const gaps = artifactGaps(row);
    const blockedReqs = [];
    const blockedVerifs = [];
    const blockedProv = [];

    if (row.claim_status !== "verified" && row.claim_status !== "reproduced") {
      blockedReqs.push(row.requirement_id);
    }
    if (row.verification_status !== "complete") {
      for (const v of graph?.requirements?.[row.requirement_id]?.verification_methods ?? []) {
        blockedVerifs.push(v);
      }
    }
    if (row.provenance_status !== "anchored") {
      const n = reqNum(row.requirement_id);
      if (n) blockedProv.push(`PROV-${n}`);
    }

    for (const art of gaps) {
      if (!blockers.has(art)) {
        blockers.set(art, {
          artifact_id: art,
          impact_score: 0,
          blocked_requirements: [],
          blocked_verifications: [],
          blocked_provenance: [],
        });
      }
      const b = blockers.get(art);
      for (const r of blockedReqs) {
        if (!b.blocked_requirements.includes(r)) b.blocked_requirements.push(r);
      }
      for (const v of blockedVerifs) {
        if (!b.blocked_verifications.includes(v)) b.blocked_verifications.push(v);
      }
      for (const p of blockedProv) {
        if (!b.blocked_provenance.includes(p)) b.blocked_provenance.push(p);
      }
    }
  }

  const topBlockers = [...blockers.values()]
    .map((b) => ({
      ...b,
      impact_score:
        b.blocked_requirements.length +
        b.blocked_verifications.length +
        b.blocked_provenance.length,
    }))
    .filter((b) => b.impact_score > 0)
    .sort((a, b) => b.impact_score - a.impact_score);

  const assumptions = [];
  if (cor.summary?.unresolved_assumptions > 0) {
    assumptions.push({
      assumption: "unresolved_assumptions_in_cor",
      impact_score: cor.summary.unresolved_assumptions,
    });
  }
  if (cor.summary?.unanchored_receipts > 0) {
    assumptions.push({
      assumption: "PL-1.1 runtime provenance binding",
      impact_score: cor.summary.unanchored_receipts,
    });
  }
  if (cor.summary?.proof_closure === "fail") {
    assumptions.push({
      assumption: "proof_closure incomplete",
      impact_score: cor.requirements.filter((r) => r.claim_status !== "verified").length,
    });
  }
  const research = csr?.claims
    ? Object.entries(csr.claims)
        .filter(([, status]) => status === "research")
        .map(([requirement_id]) => ({ requirement_id }))
    : [];
  if (research.length) {
    assumptions.push({
      assumption: `research claims deferred (${research.map((c) => c.requirement_id).join(", ")})`,
      impact_score: research.length,
    });
  }
  assumptions.sort((a, b) => b.impact_score - a.impact_score);

  return {
    version: "DRA-1.0",
    generated_at: new Date().toISOString(),
    commit: gitCommit(),
    non_authoritative: true,
    top_blockers: topBlockers.slice(0, 20),
    top_unresolved_assumptions: assumptions.slice(0, 10),
    summary: {
      total_blockers: topBlockers.length,
      max_impact: topBlockers[0]?.impact_score ?? 0,
    },
  };
}

function impactOf(nodeId, analysis, graph) {
  const blocker = analysis.top_blockers.find((b) => b.artifact_id === nodeId);
  if (blocker) return blocker;
  const req = graph?.requirements?.[nodeId];
  if (req) {
    const gaps = [];
    for (const b of analysis.top_blockers) {
      if (b.blocked_requirements.includes(nodeId)) gaps.push(b.artifact_id);
    }
    return { node_id: nodeId, blocking_artifacts: gaps, requirement: req };
  }
  return { node_id: nodeId, error: "not found in DRA index" };
}

function whatUnblocks(reqId, cor) {
  const row = cor.requirements.find((r) => r.requirement_id === reqId);
  if (!row) return { requirement_id: reqId, error: "not found" };
  const n = reqNum(reqId);
  const unblock = [];
  if (row.evidence_status !== "complete") unblock.push({ artifact: `EVID-${n}`, action: "complete evidence" });
  if (row.receipt_status !== "complete") unblock.push({ artifact: `REC-${n}`, action: "emit receipt" });
  if (row.provenance_status !== "anchored") unblock.push({ artifact: `PROV-${n}`, action: "anchor provenance (PL-1.1)" });
  if (row.verification_status !== "complete") unblock.push({ artifact: `VERIF-${n}`, action: "run verification" });
  if (row.implementation_status !== "complete") unblock.push({ artifact: `IMPL-${n}`, action: "complete implementation" });
  return {
    requirement_id: reqId,
    claim_status: row.claim_status,
    unblock_actions: unblock,
    exceptions: row.exceptions ?? [],
  };
}

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outPath = outIdx >= 0 ? path.resolve(ROOT, args[outIdx + 1]) : path.join(ROOT, "meta/DRA-1.0.json");

const cor = loadJson(COR_PATH);
if (!cor) {
  console.error("COR not found. Run: npm run spec:cor");
  process.exit(3);
}
const graph = loadJson(GRAPH_PATH);
const csr = loadJson(CSR_PATH);
const analysis = buildAnalysis(cor, graph, csr);

if (args[0] === "top-blockers") {
  console.log(JSON.stringify(analysis.top_blockers, null, 2));
  process.exit(0);
}
if (args[0] === "unresolved-assumptions") {
  console.log(JSON.stringify(analysis.top_unresolved_assumptions, null, 2));
  process.exit(0);
}
if (args[0] === "impact-of" && args[1]) {
  console.log(JSON.stringify(impactOf(args[1], analysis, graph), null, 2));
  process.exit(0);
}
if (args[0] === "what-unblocks" && args[1]) {
  console.log(JSON.stringify(whatUnblocks(args[1], cor), null, 2));
  process.exit(0);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(analysis, null, 2)}\n`);
console.log(`wrote ${outPath}`);
