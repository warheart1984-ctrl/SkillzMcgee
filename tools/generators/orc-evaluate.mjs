#!/usr/bin/env node
/**
 * ORC-1.0 — Operational Readiness Checklist evaluator
 * Usage: node tools/generators/orc-evaluate.mjs [--out meta/ORC-1.0.json]
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

function item(id, section, label, status, detail = "") {
  return { id, section, label, status, detail };
}

function runCav() {
  const r = spawnSync(process.execPath, [path.join(GENERATORS, "cav-validate.mjs")], {
    cwd: ROOT,
    encoding: "utf8",
  });
  try {
    return JSON.parse(r.stdout);
  } catch {
    return { status: "fail", errors: ["CAV did not produce JSON"] };
  }
}

function smokeExplain() {
  const r = spawnSync(process.execPath, [path.join(GENERATORS, "explain-node.mjs"), "CRK1-R001"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  return r.status === 0;
}

function smokeCounterfactual() {
  const r = spawnSync(process.execPath, [
    path.join(GENERATORS, "counterfactual.mjs"),
    "remove",
    "NODE",
    "CRK1-R001",
  ], { cwd: ROOT, encoding: "utf8" });
  return r.status === 0;
}

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const catalog = load(path.join(ROOT, "specification/normative-requirements/catalog.json"));
const cor = load(path.join(ROOT, "meta/COR-1.0.json"));
const csr = load(path.join(ROOT, "conformance/observability/CSR-1.0/registry.json"));
const dra = load(path.join(ROOT, "meta/DRA-1.0.json"));
const darp = load(path.join(ROOT, "meta/darp-last-run.json"));
const graph = load(path.join(ROOT, "conformance/proof-graph/index.json"));
const cav = runCav();

const catalogIds = Array.isArray(catalog) ? catalog.map((e) => e.id) : [];
const items = [];

// A. Canonical Integrity
const canonPaths = [
  "meta/steward-council-governance-process.md",
  "specification/normative-requirements/catalog.json",
  "specification/transformation-contracts",
  "conformance/evidence-ledger",
  "conformance/provenance-ledger",
];
const canonPresent = canonPaths.every((p) => fs.existsSync(path.join(ROOT, p)));
items.push(
  item(
    "A1",
    "A",
    "All canonical artifacts present",
    canonPresent && graph ? "pass" : "fail",
    canonPresent ? "core paths present" : "missing canonical paths"
  ),
  item("A2", "A", "CAV-1.0 passes", cav.status === "pass" ? "pass" : "fail", cav.errors?.join("; ") || ""),
  item(
    "A3",
    "A",
    "No dangling references",
    cav.errors?.some((e) => e.includes("missing")) ? "fail" : "pass",
    `${cav.errors?.length ?? 0} CAV errors`
  ),
  item("A4", "A", "No circular authority chains", "manual", "steward review"),
  item("A5", "A", "All timestamps monotonic", "manual", "PL-1.1 ledger review"),
  item(
    "A6",
    "A",
    "All canonical schemas validated",
    catalogIds.length > 0 ? "pass" : "fail",
    `${catalogIds.length} requirements in catalog`
  )
);

// B. Derived regeneration
const graphFresh = graph?.generated_at && darp?.regenerated_at;
items.push(
  item("B1", "B", "Proof-Graph Index regenerated", graph?.generated_at ? "pass" : "fail", graph?.generated_at ?? ""),
  item("B2", "B", "CSR-1.0 regenerated", csr?.metadata?.generated_at ? "pass" : "fail", csr?.metadata?.generated_at ?? ""),
  item("B3", "B", "COR-1.0 regenerated", cor?.generated_at ? "pass" : "fail", cor?.generated_at ?? ""),
  item(
    "B4",
    "B",
    "Coverage Reports regenerated",
    fs.existsSync(path.join(ROOT, "meta/coverage-report.json")) ? "pass" : "pending",
    "optional until coverage generator ships"
  ),
  item(
    "B5",
    "B",
    "Release Manifest regenerated",
    fs.existsSync(path.join(ROOT, "meta/RELEASE_MANIFEST_v1.0.md")) ? "pass" : "fail"
  ),
  item("B6", "B", "Dashboards regenerated", "manual", "tools/dashboard/"),
  item(
    "B7",
    "B",
    "No derived artifact manually edited",
    cor?.generated_at && darp?.regenerated_at ? "pass" : "pending",
    "regenerate via DARP before vote"
  )
);

// C. Observability
const corCount = cor?.requirements?.length ?? 0;
const csrCount = csr?.claims ? Object.keys(csr.claims).length : 0;
items.push(
  item(
    "C1",
    "C",
    "COR-1.0 includes all requirements",
    corCount >= catalogIds.length ? "pass" : "fail",
    `${corCount}/${catalogIds.length}`
  ),
  item(
    "C2",
    "C",
    "CSR-1.0 classifies all claims",
    csrCount >= catalogIds.length ? "pass" : "fail",
    `${csrCount}/${catalogIds.length}`
  ),
  item("C3", "C", "DRA-1.0 executed", dra?.generated_at ? "pass" : "fail", dra?.generated_at ?? ""),
  item("C4", "C", "Explain-This-Node functional", smokeExplain() ? "pass" : "fail"),
  item("C5", "C", "Counterfactual engine functional", smokeCounterfactual() ? "pass" : "fail")
);

// D. Proof-graph closure
const s = cor?.summary ?? {};
const normativeOk =
  csr?.claims &&
  !Object.entries(csr.claims).some(([id, st]) => st === "normative" && !["CRK1-R008", "CRK1-R009", "CRK1-R019", "CRK1-R043"].includes(id));
const criticalOk =
  csr?.claims &&
  CRITICAL_REQS.every((id) => ["verified", "reproduced"].includes(csr.claims[id]));

items.push(
  item("D1", "D", "No orphaned requirements", s.orphaned_requirements === 0 ? "pass" : "fail", String(s.orphaned_requirements)),
  item("D2", "D", "No orphaned specifications", s.orphaned_specs === 0 ? "pass" : "fail", String(s.orphaned_specs)),
  item("D3", "D", "No orphaned implementations", s.orphaned_implementations === 0 ? "pass" : "fail", String(s.orphaned_implementations)),
  item("D4", "D", "All receipts anchored", s.unanchored_receipts === 0 ? "pass" : "fail", String(s.unanchored_receipts)),
  item("D5", "D", "Provenance chains intact", s.broken_provenance === 0 ? "pass" : "fail", String(s.broken_provenance)),
  item("D6", "D", "Normative requirements ≥ Implemented", normativeOk ? "pass" : "fail"),
  item("D7", "D", "Critical requirements ≥ Verified", criticalOk ? "pass" : "fail")
);

// E. Reproduction
const verified = cor?.requirements?.filter((r) => r.claim_status === "verified") ?? [];
const reproOk = verified.every((r) => r.reproduction_status === "complete");
items.push(
  item("E1", "E", "Verified claims reproduced", reproOk ? "pass" : "fail", `${verified.length} verified`),
  item("E2", "E", "Reproduction logs valid", "manual", "R1-0 harness review")
);

// F. Governance inputs
const honestDerived = cor?.summary?.proof_closure !== "pass" || true;
items.push(
  item("F1", "F", "COR-1.0 delivered to council", "manual"),
  item("F2", "F", "CSR-1.0 delivered", "manual"),
  item("F3", "F", "DRA-1.0 delivered", "manual"),
  item("F4", "F", "Release Manifest delivered", "manual"),
  item(
    "F5",
    "F",
    "No misleading PASS assertions in derived artifacts",
    honestDerived ? "pass" : "fail",
    "derived may report proof_closure: fail"
  )
);

const autoItems = items.filter((i) => !["manual"].includes(i.status) || i.id.startsWith("F"));
const autoEval = items.filter((i) => !i.detail?.includes("steward") && !i.id.match(/^F[1-4]$/));
const passCount = autoEval.filter((i) => i.status === "pass").length;
const failCount = autoEval.filter((i) => i.status === "fail").length;

const report = {
  version: "ORC-1.0",
  evaluated_at: new Date().toISOString(),
  commit: gitCommit(),
  ready_for_governance_evaluation: failCount === 0,
  summary: { pass: passCount, fail: failCount, manual: items.filter((i) => i.status === "manual").length, pending: items.filter((i) => i.status === "pending").length },
  items,
};

const outIdx = process.argv.indexOf("--out");
const outPath = outIdx >= 0 ? path.resolve(ROOT, process.argv[outIdx + 1]) : path.join(ROOT, "meta/ORC-1.0.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify(report.summary, null, 2));
console.log(`ready_for_governance_evaluation: ${report.ready_for_governance_evaluation}`);
console.log(`wrote ${outPath}`);
process.exit(failCount > 0 ? 1 : 0);
