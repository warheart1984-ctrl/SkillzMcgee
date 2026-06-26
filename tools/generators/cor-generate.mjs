#!/usr/bin/env node
/**
 * Generate Constitutional Observability Report (COR-1.0).
 * Usage: node tools/generators/cor-generate.mjs [--out path] [--explain ID] [--counterfactual ID]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { CONFORMANCE_PATHS, writeJson } from "../lib/conformance-paths.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const PATHS = {
  matrix: path.join(ROOT, "conformance/traceability-matrix.json"),
  csr: path.join(ROOT, "conformance/observability/CSR-1.0/registry.json"),
  catalog: path.join(ROOT, "specification/normative-requirements/catalog.json"),
  ledger: path.join(ROOT, ".runtime/nova-studio/ledger.jsonl"),
};

const CLAIM_ORDER = ["normative", "implemented", "verified", "reproduced", "research"];

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function parseArgs(argv) {
  const opts = {
    out: path.join(ROOT, "meta/COR-1.0.json"),
    failOnIncomplete: false,
    includeResearch: true,
    explain: null,
    counterfactual: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--out" && argv[i + 1]) opts.out = path.resolve(argv[++i]);
    else if (a === "--fail-on-incomplete") opts.failOnIncomplete = true;
    else if (a === "--include-research") opts.includeResearch = true;
    else if (a === "--explain" && argv[i + 1]) opts.explain = argv[++i];
    else if (a === "--counterfactual" && argv[i + 1]) opts.counterfactual = argv[++i];
  }
  return opts;
}

function ledgerEntryCount() {
  if (!fs.existsSync(PATHS.ledger)) return 0;
  return fs
    .readFileSync(PATHS.ledger, "utf8")
    .split("\n")
    .filter((l) => l.trim()).length;
}

function deriveRow(row, claimStatus) {
  const exceptions = [];
  const hasCts = row.cts_tests?.length > 0;
  const hasTests = row.repo_tests?.length > 0;
  const hasEvidence = row.evidence && row.evidence !== "N/A";
  const hasReceipt = row.receipts && row.receipts !== "N/A";
  const hasProvenance = row.provenance && row.provenance !== "N/A";
  const ledgerCount = ledgerEntryCount();

  const authority_status = "present";
  const specification_status = "present";

  let implementation_status = "missing";
  if (row.mri_component && row.mri_component !== "N/A") {
    implementation_status = hasTests ? "complete" : "partial";
  }

  let verification_status = "missing";
  if (hasCts && hasTests) verification_status = "complete";
  else if (hasCts || hasTests) verification_status = "partial";

  let evidence_status = "missing";
  if (hasEvidence) evidence_status = hasTests ? "complete" : "partial";

  let receipt_status = hasReceipt ? "complete" : "missing";
  if (hasReceipt && ledgerCount === 0) {
    receipt_status = "missing";
    exceptions.push("receipt type mapped but runtime ledger empty");
  }

  let provenance_status = "missing";
  if (hasProvenance && ledgerCount > 0) provenance_status = "unanchored";
  if (hasProvenance && ledgerCount > 0 && claimStatus === "verified") {
    provenance_status = "anchored";
  }

  let reproduction_status = "missing";
  if (claimStatus === "reproduced") reproduction_status = "reproduced";
  else if (claimStatus === "verified" || claimStatus === "implemented") reproduction_status = "pending";

  if (claimStatus === "research") {
    exceptions.push("classified as research — outside v1.0 guarantee boundary");
  }
  if (claimStatus === "normative" && implementation_status !== "missing") {
    exceptions.push("implementation partial but claim remains normative");
  }
  if (claimStatus === "verified" && provenance_status !== "anchored") {
    exceptions.push("CSR claims verified but provenance not fully anchored");
  }
  if (!hasTests && claimStatus !== "research" && claimStatus !== "normative") {
    exceptions.push("no automated repo tests mapped");
  }

  const complete =
    authority_status === "present" &&
    specification_status === "present" &&
    implementation_status === "complete" &&
    verification_status === "complete" &&
    evidence_status === "complete" &&
    receipt_status === "complete" &&
    provenance_status === "anchored" &&
    reproduction_status === "reproduced" &&
    claimStatus !== "research";

  return {
    requirement_id: row.requirement_id,
    authority_status,
    specification_status,
    implementation_status,
    verification_status,
    evidence_status,
    receipt_status,
    provenance_status,
    reproduction_status,
    claim_status: claimStatus,
    exceptions,
    _complete: complete,
  };
}

function buildReport() {
  const matrix = JSON.parse(fs.readFileSync(PATHS.matrix, "utf8"));
  const csr = JSON.parse(fs.readFileSync(PATHS.csr, "utf8"));

  const requirements = matrix.rows.map((row) => {
    const claim = csr.claims[row.requirement_id] ?? "normative";
    const derived = deriveRow(row, claim);
    const { _complete, ...rest } = derived;
    return { ...rest, _complete };
  });

  let orphaned_requirements = 0;
  let missing_evidence = 0;
  let missing_receipts = 0;
  let unanchored_receipts = 0;
  let broken_provenance = 0;
  let unreproduced_claims = 0;

  for (const r of requirements) {
    if (r.authority_status === "missing" || r.specification_status === "missing") orphaned_requirements++;
    if (r.evidence_status === "missing") missing_evidence++;
    if (r.receipt_status === "missing") missing_receipts++;
    if (r.provenance_status === "unanchored") unanchored_receipts++;
    if (r.provenance_status === "missing" && r.claim_status !== "research" && r.claim_status !== "normative") {
      broken_provenance++;
    }
    if (r.reproduction_status !== "reproduced" && r.claim_status === "verified") unreproduced_claims++;
    if (!r._complete && r.claim_status !== "research") orphaned_requirements++;
  }

  const proof_closure = requirements.every((r) => r._complete || r.claim_status === "research") ? "pass" : "fail";

  const cleanReqs = requirements.map(({ _complete, ...r }) => r);

  return {
    generated_at: new Date().toISOString(),
    commit: gitCommit(),
    version: "COR-1.0",
    requirements: cleanReqs,
    summary: {
      orphaned_requirements,
      orphaned_specs: 0,
      orphaned_implementations: requirements.filter((r) => r.implementation_status === "missing").length,
      missing_evidence,
      missing_receipts,
      unanchored_receipts,
      broken_provenance,
      unreproduced_claims,
      unresolved_assumptions: requirements.filter((r) => r.exceptions.some((e) => e.includes("assumption"))).length,
      proof_closure,
    },
    _rows: requirements,
  };
}

function toPublicCor(report) {
  const verified = report.requirements.filter((r) =>
    ["verified", "reproduced"].includes(r.claim_status),
  ).length;
  const implemented = report.requirements.filter((r) =>
    ["implemented", "verified", "reproduced"].includes(r.claim_status),
  ).length;
  const reproduced = report.requirements.filter((r) => r.claim_status === "reproduced").length;
  const risk =
    report.summary.proof_closure !== "pass"
      ? "high"
      : report.summary.unanchored_receipts > 10
        ? "medium"
        : "low";
  return {
    version: "1.0",
    timestamp: report.generated_at,
    generated_at: report.generated_at,
    commit: report.commit,
    requirements: report.requirements,
    summary: report.summary,
    canonicalIntegrity: {
      authorities: report.summary.orphaned_requirements === 0 ? "ok" : "needs-review",
      specifications: "ok",
      normativeRequirements: "ok",
      contracts: "ok",
      implementations: report.summary.orphaned_implementations === 0 ? "ok" : "needs-review",
    },
    evidenceCoverage: {
      implemented,
      verified,
      reproduced,
      missing: report.summary.missing_evidence + report.summary.missing_receipts,
    },
    proofGraphStatus: {
      unresolved: report.summary.unanchored_receipts,
      cycles: 0,
    },
    dependencyRisk: risk,
    releaseReadiness: report.summary.proof_closure === "pass" ? "pass" : "fail",
  };
}

function explain(id, report, matrix) {
  const row = report._rows.find((r) => r.requirement_id === id);
  if (!row) {
    console.error(`Unknown requirement: ${id}`);
    process.exit(2);
  }
  console.log(`# Explanation: ${id}`);
  console.log(`Claim status (CSR): ${row.claim_status}`);
  console.log(`Complete: ${row._complete}`);
  if (row.exceptions.length) {
    console.log("\nExceptions:");
    for (const e of row.exceptions) console.log(`  - ${e}`);
  }
  const m = matrix.rows.find((r) => r.requirement_id === id);
  if (m) {
    console.log("\nTraceability:");
    console.log(`  CTS: ${m.cts_tests?.join(", ") || "none"}`);
    console.log(`  Repo tests: ${m.repo_tests?.join(", ") || "none"}`);
    console.log(`  MRI: ${m.mri_component}`);
    console.log(`  Evidence: ${m.evidence}`);
    console.log(`  Receipt: ${m.receipts}`);
    console.log(`  Provenance: ${m.provenance}`);
  }
}

function counterfactual(id, matrix) {
  const dependents = matrix.rows.filter(
    (r) =>
      r.traceability_chain?.includes(id) ||
      r.requirement_id === id
  );
  console.log(`# Counterfactual: remove ${id}`);
  console.log(`Affected traceability rows: ${dependents.length}`);
  for (const d of dependents.slice(0, 12)) {
    console.log(`  - ${d.requirement_id}: ${d.title}`);
  }
  if (dependents.length > 12) console.log(`  ... and ${dependents.length - 12} more`);
  console.log("\nRegressions:");
  console.log("  - Proof-graph forward closure breaks for dependent requirements");
  console.log("  - Receipt and provenance chains may orphan downstream evidence");
  console.log("  - COR proof_closure would remain fail until edges restored");
}

const opts = parseArgs(process.argv);

if (!fs.existsSync(PATHS.csr)) {
  console.error("CSR-1.0 registry missing. Run: node tools/generators/csr-registry.mjs");
  process.exit(3);
}

const report = buildReport();
const matrix = JSON.parse(fs.readFileSync(PATHS.matrix, "utf8"));

if (opts.explain) {
  explain(opts.explain, report, matrix);
  process.exit(0);
}
if (opts.counterfactual) {
  counterfactual(opts.counterfactual, matrix);
  process.exit(0);
}

const { _rows, ...output } = report;
fs.mkdirSync(path.dirname(opts.out), { recursive: true });
fs.writeFileSync(opts.out, `${JSON.stringify(output, null, 2)}\n`);
writeJson(CONFORMANCE_PATHS.cor, toPublicCor(output));
console.log(`wrote ${opts.out}`);
console.log(`wrote ${CONFORMANCE_PATHS.cor}`);
console.log(`proof_closure: ${output.summary.proof_closure}`);

if (opts.failOnIncomplete && output.summary.proof_closure === "fail") {
  process.exit(1);
}
process.exit(0);
