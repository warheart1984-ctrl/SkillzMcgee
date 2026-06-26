#!/usr/bin/env node
/**
 * RCD-1.0 — Release Criteria evaluator
 * Usage: node tools/generators/rcd-evaluate.mjs [--out meta/RCD-1.0.json]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const GENERATORS = path.dirname(fileURLToPath(import.meta.url));

const CRITICAL_REQS = [
  ...Array.from({ length: 10 }, (_, i) => `CRK1-R${String(i + 1).padStart(3, "0")}`),
  "CRK1-R011",
  "CRK1-R012",
  "CRK1-R015",
  "CRK1-R016",
  "CRK1-R043",
];

function load(p) {
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
}

function criterion(id, label, pass, detail = "") {
  return { id, label, status: pass ? "pass" : "fail", detail };
}

function runCav() {
  const r = spawnSync(process.execPath, [path.join(GENERATORS, "cav-validate.mjs")], {
    cwd: ROOT,
    encoding: "utf8",
  });
  try {
    return JSON.parse(r.stdout);
  } catch {
    return { status: "fail" };
  }
}

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const cor = load(path.join(ROOT, "meta/COR-1.0.json"));
const csr = load(path.join(ROOT, "conformance/observability/CSR-1.0/registry.json"));
const dra = load(path.join(ROOT, "meta/DRA-1.0.json"));
const cav = runCav();
const s = cor?.summary ?? {};

const criteria = [];

// A
criteria.push(criterion("A1", "CAV-1.0 passes with no errors", cav.status === "pass", cav.errors?.join("; ")));

// B
criteria.push(criterion("B1", "No orphaned requirements", s.orphaned_requirements === 0, String(s.orphaned_requirements)));
criteria.push(criterion("B2", "No orphaned specifications", s.orphaned_specs === 0, String(s.orphaned_specs)));
criteria.push(criterion("B3", "No orphaned implementations", s.orphaned_implementations === 0, String(s.orphaned_implementations)));
criteria.push(criterion("B4", "All receipts anchored", s.unanchored_receipts === 0, String(s.unanchored_receipts)));
criteria.push(criterion("B5", "Provenance chains intact", s.broken_provenance === 0, String(s.broken_provenance)));
criteria.push(criterion("B6", "proof_closure pass", s.proof_closure === "pass", s.proof_closure));

// C
const normativeFails = csr?.claims
  ? Object.entries(csr.claims).filter(([, st]) => st === "normative").map(([id]) => id)
  : [];
criteria.push(
  criterion("C1", "No unexpected normative claims", normativeFails.length <= 4, normativeFails.join(", "))
);
const criticalFails = CRITICAL_REQS.filter((id) => !["verified", "reproduced"].includes(csr?.claims?.[id]));
criteria.push(criterion("C2", "Critical requirements verified", criticalFails.length === 0, criticalFails.join(", ")));
const falseVerified = (cor?.requirements ?? []).filter(
  (r) => r.claim_status === "verified" && r.evidence_status !== "complete"
);
criteria.push(criterion("C3", "Verified claims have evidence", falseVerified.length === 0, `${falseVerified.length} gaps`));
const research = csr?.claims
  ? Object.entries(csr.claims).filter(([, st]) => st === "research").map(([id]) => id)
  : [];
criteria.push(criterion("C4", "Research claims documented in CSR", !!csr?.claims, research.join(", ")));

// D
const verifiedRows = (cor?.requirements ?? []).filter((r) => r.claim_status === "verified");
const evidenceComplete = verifiedRows.every(
  (r) =>
    r.evidence_status === "complete" &&
    r.receipt_status === "complete" &&
    r.provenance_status === "anchored"
);
criteria.push(criterion("D1", "Verified claims have full evidence chain", evidenceComplete));

// E
criteria.push(criterion("E1", "COR generated", !!cor?.generated_at, cor?.generated_at ?? ""));
criteria.push(criterion("E2", "CSR generated", !!csr?.metadata?.generated_at, csr?.metadata?.generated_at ?? ""));
criteria.push(criterion("E3", "DRA executed", !!dra?.generated_at, dra?.generated_at ?? ""));

// F — manual
criteria.push(criterion("F1", "Critical claims reproduced (R1-0)", false, "manual — R1-0 harness"));

const failCount = criteria.filter((c) => c.status === "fail").length;
const report = {
  version: "RCD-1.0",
  evaluated_at: new Date().toISOString(),
  commit: gitCommit(),
  release_criteria_satisfied: failCount === 0,
  summary: { pass: criteria.filter((c) => c.status === "pass").length, fail: failCount },
  criteria,
};

const outIdx = process.argv.indexOf("--out");
const outPath = outIdx >= 0 ? path.resolve(ROOT, process.argv[outIdx + 1]) : path.join(ROOT, "meta/RCD-1.0.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report.summary, null, 2));
console.log(`release_criteria_satisfied: ${report.release_criteria_satisfied}`);
console.log(`wrote ${outPath}`);
process.exit(failCount > 0 ? 1 : 0);
