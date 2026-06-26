#!/usr/bin/env node
/**
 * Generate R001–R042 normative requirement markdown files from catalog.json.
 * Usage: node tools/generators/requirements-catalog.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");
const CATALOG_PATH = path.join(
  REPO_ROOT,
  "specification/normative-requirements/catalog.json",
);
const OUT_DIR = path.join(REPO_ROOT, "specification/normative-requirements");

function formatRequirement(r) {
  const num = r.id.replace("CRK1-R", "");
  return `# ${r.id} — ${r.title}

\`\`\`
Requirement ID: ${r.id}
Authority: CRK-1 Specification v1.0
Rationale: ${r.rationale}
Verification Method: ${r.verification}
Evidence Required: ${r.evidence}
Traceability Links: ${r.traceability}
Version: 1.0
Status: Normative
Invariant: ${r.invariant}
Series: ${r.series}-Series
\`\`\`

## Statement

${r.title}: ${r.rationale}

## Normative text

This requirement is **mandatory** for all CRK-1 compliant runtimes in Version 1.0.

## Conformance resolution

See [../../conformance/resolution-map.json](../../conformance/resolution-map.json) for CTS, MRI, and badge mappings.
`;
}

function buildReadme(catalog) {
  const bySeries = { M: [], S: [], E: [], H: [], B: [] };
  for (const r of catalog) {
    bySeries[r.series].push(r);
  }

  let md = `# CRK-1 Normative Requirements Catalog

**Authority:** CRK-1 Specification v1.0  
**Count:** 42 requirements (R001–R042)  
**Status:** Normative — frozen for V1

Each requirement carries the standardized metadata block (Dar-z pattern).

## Repository Invariant R-∞

For any verification artifact V: ∃R ∈ Requirements such that resolves(V, R).

## Series index

`;

  const seriesNames = {
    M: "Mechanical (K0–K3)",
    S: "Structural (K4–K6, COM, Contracts)",
    E: "Semantic (K7–K9, SRE)",
    H: "Historical (K10–K12, Provenance)",
    B: "Behavioral (Loop, Drift, Visibility)",
  };

  for (const [series, items] of Object.entries(bySeries)) {
    md += `\n### ${series}-Series — ${seriesNames[series]}\n\n`;
    md += "| ID | Title | Invariant |\n|----|-------|----------|\n";
    for (const r of items) {
      const num = r.id.replace("CRK1-R", "");
      md += `| [R${num}](./R${num.padStart(3, "0")}.md) | ${r.title} | ${r.invariant} |\n`;
    }
  }

  md += `\n## Machine-readable catalog\n\n[catalog.json](./catalog.json)\n\n## Regenerate files\n\n\`\`\`bash\nnode tools/generators/requirements-catalog.mjs\n\`\`\`\n`;

  return md;
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
if (catalog.length !== 42) {
  console.error(`Expected 42 requirements, got ${catalog.length}`);
  process.exit(1);
}

for (const r of catalog) {
  const num = r.id.replace("CRK1-R", "").padStart(3, "0");
  const outPath = path.join(OUT_DIR, `R${num}.md`);
  fs.writeFileSync(outPath, formatRequirement(r), "utf8");
  console.log("wrote", path.relative(REPO_ROOT, outPath));
}

fs.writeFileSync(path.join(OUT_DIR, "README.md"), buildReadme(catalog), "utf8");
console.log("wrote specification/normative-requirements/README.md");
