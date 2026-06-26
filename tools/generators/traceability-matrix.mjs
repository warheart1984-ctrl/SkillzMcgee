#!/usr/bin/env node
/**
 * Generate CRK-1 Requirement → Test → Evidence traceability matrix.
 * Usage: node tools/generators/traceability-matrix.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const CATALOG_PATH = path.join(REPO_ROOT, "specification/normative-requirements/catalog.json");
const RESOLUTION_PATH = path.join(REPO_ROOT, "conformance/resolution-map.json");
const OUT_JSON = path.join(REPO_ROOT, "conformance/traceability-matrix.json");
const OUT_MD = path.join(REPO_ROOT, "conformance/traceability-matrix.md");

/** @type {Record<string, Partial<{ mri: string, evidence: string, receipt: string, provenance: string }>>} */
const ROW_OVERRIDES = {
  "CRK1-R001": { mri: "decision→outcome", evidence: "OutcomeObject", receipt: "invariant_block", provenance: "entry:decision/outcome" },
  "CRK1-R002": { mri: "outcome→evidence", evidence: "EvidenceObject", receipt: "evidence_block", provenance: "entry:evidence" },
  "CRK1-R003": { mri: "evidence→interpretation", evidence: "InterpretationObject", receipt: "traceability_block", provenance: "entry:interpretation" },
  "CRK1-R004": { mri: "replay engine", evidence: "Replay logs", receipt: "N/A", provenance: "entry:replay" },
  "CRK1-R010": { mri: "object schemas", evidence: "Object dumps", receipt: "invariant_block", provenance: "entry:object" },
  "CRK1-R011": { mri: "contract enforcement", evidence: "Contract logs", receipt: "invariant_block", provenance: "entry:contract" },
  "CRK1-R012": { mri: "traceability builder", evidence: "TraceabilityBlock", receipt: "traceability_block", provenance: "entry:trace" },
  "CRK1-R020": { mri: "frame set", evidence: "Frame list", receipt: "invariant_block", provenance: "entry:frames" },
  "CRK1-R021": { mri: "SRE", evidence: "Replay logs", receipt: "N/A", provenance: "entry:replay" },
  "CRK1-R022": { mri: "drift calculator", evidence: "Drift deltas", receipt: "drift_update", provenance: "entry:drift" },
  "CRK1-R030": { mri: "ledger", evidence: "Ledger hashes", receipt: "merkle_root", provenance: "entry:hash" },
  "CRK1-R031": { mri: "MRI, SRE", evidence: "FIA report", receipt: "N/A", provenance: "entry:audit" },
  "CRK1-R032": { mri: "all", evidence: "All", receipt: "invariant_block", provenance: "entry:all" },
  "CRK1-R040": { mri: "loop engine", evidence: "All objects", receipt: "invariant_block", provenance: "entry:loop" },
  "CRK1-R041": { mri: "drift engine", evidence: "Drift deltas", receipt: "drift_update", provenance: "entry:drift" },
  "CRK1-R042": { mri: "GEL-1", evidence: "Receipts", receipt: "receipt", provenance: "entry:receipt" },
};

function invertMap(section) {
  /** @type {Map<string, string[]>} */
  const byReq = new Map();
  for (const [key, reqs] of Object.entries(section)) {
    for (const req of reqs) {
      if (!byReq.has(req)) byReq.set(req, []);
      byReq.get(req).push(key);
    }
  }
  return byReq;
}

function defaultRow(req, series) {
  const base = {
    mri: "MRI-Loop",
    evidence: req.evidence,
    receipt: "invariant_block",
    provenance: "entry:governance",
  };
  if (series === "S") base.mri = "object schemas";
  if (series === "E") base.mri = "SRE";
  if (series === "H") base.mri = "ledger";
  if (series === "B") base.mri = "loop engine";
  return { ...base, ...ROW_OVERRIDES[req.id] };
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
const resolution = JSON.parse(fs.readFileSync(RESOLUTION_PATH, "utf8"));

const ctsByReq = invertMap(resolution.cts);
const mriByReq = invertMap(resolution.mri);
const testsByReq = invertMap(resolution.repo_tests);

const rows = catalog.map((req) => {
  const num = req.id.replace("CRK1-R", "");
  const defaults = defaultRow(req, req.series);
  const cts = ctsByReq.get(req.id) ?? [];
  const mriKeys = mriByReq.get(req.id) ?? [];
  const mri =
    ROW_OVERRIDES[req.id]?.mri ??
    (mriKeys.length ? mriKeys.join(", ") : defaults.mri);
  const repoTests = testsByReq.get(req.id) ?? [];

  return {
    requirement_id: req.id,
    requirement_num: `R${num.padStart(3, "0")}`,
    title: req.title,
    series: `${req.series}-Series`,
    invariant: req.invariant,
    cts_tests: cts,
    repo_tests: repoTests,
    mri_component: mri,
    evidence: defaults.evidence,
    receipts: defaults.receipt,
    provenance: defaults.provenance,
    traceability_chain: `${req.id} → ADR-${num} → Implementation → ${cts[0] ?? "CTS"} → Evidence → Receipt → Provenance`,
  };
});

const matrix = {
  version: "1.0",
  authority: "CRK-1 Specification v1.0",
  description: "Master traceability matrix — Requirement → CTS → MRI → Evidence → Receipt → Provenance",
  invariant: "R-infinity",
  generated_from: ["specification/normative-requirements/catalog.json", "conformance/resolution-map.json"],
  rows,
};

fs.writeFileSync(OUT_JSON, JSON.stringify(matrix, null, 2) + "\n", "utf8");

function seriesTable(seriesLabel, filter) {
  const items = rows.filter(filter);
  let md = `\n## ${seriesLabel}\n\n`;
  md += "| Requirement | CTS Tests | MRI Component | Evidence | Receipts | Provenance |\n";
  md += "|-------------|-----------|---------------|----------|----------|------------|\n";
  for (const r of items) {
    const cts = r.cts_tests.length ? r.cts_tests.join(", ") : "—";
    md += `| **${r.requirement_id}** — ${r.title} | ${cts} | ${r.mri_component} | ${r.evidence} | ${r.receipts} | ${r.provenance} |\n`;
  }
  return md;
}

let md = `# CRK-1 Requirement → Test → Evidence Traceability Matrix

**Authority:** CRK-1 Specification v1.0  
**Status:** Master audit artifact (R-∞ proof spine)  
**Machine-readable:** [traceability-matrix.json](./traceability-matrix.json)

This matrix links every normative requirement to:

- **CTS tests** that verify it
- **MRI behaviors** that implement it
- **Evidence artifacts** that prove it
- **Receipts** and **provenance entries** that record it

## Traceability chain (canonical)

\`Requirement → ADR → Implementation → CTS → Evidence → Receipt → Provenance\`

## Repository tests (implementation anchors)

| Test path | Requirements |
|-----------|----------------|
`;

for (const [test, reqs] of Object.entries(resolution.repo_tests)) {
  md += `| \`${test}\` | ${reqs.join(", ")} |\n`;
}

md += seriesTable("A1. Mechanical Requirements (R001–R009)", (r) => r.series.startsWith("M"));
md += seriesTable("A2. Structural Requirements (R010–R019)", (r) => r.series.startsWith("S"));
md += seriesTable("A3. Semantic Requirements (R020–R029)", (r) => r.series.startsWith("E"));
md += seriesTable("A4. Historical Requirements (R030–R039)", (r) => r.series.startsWith("H"));
md += seriesTable("A5. Behavioral Requirements (R040–R042)", (r) => r.series.startsWith("B"));

md += `\n## Regenerate\n\n\`\`\`bash\nnode tools/generators/traceability-matrix.mjs\n\`\`\`\n`;

fs.writeFileSync(OUT_MD, md, "utf8");
console.log("wrote conformance/traceability-matrix.json");
console.log("wrote conformance/traceability-matrix.md");
