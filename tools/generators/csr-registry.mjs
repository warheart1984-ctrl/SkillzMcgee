#!/usr/bin/env node
/**
 * Generate CSR-1.0 claim status registry from traceability matrix (honest derived defaults).
 * Usage: node tools/generators/csr-registry.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { CONFORMANCE_PATHS, writeJson } from "../lib/conformance-paths.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MATRIX = path.join(ROOT, "conformance/traceability-matrix.json");
const OUT = path.join(ROOT, "conformance/observability/CSR-1.0/registry.json");

/** Research: outside v1.0 guarantees */
const RESEARCH = new Set([
  "CRK1-R004",
  "CRK1-R031",
  "CRK1-R035",
  "CRK1-R038",
  "CRK1-R039",
]);

/** Reproduced: R1-0 independently confirmed */
const REPRODUCED = new Set([]);

/** Verified: repo tests + CTS mapping */
const VERIFIED = new Set([
  "CRK1-R011",
  "CRK1-R012",
  "CRK1-R018",
  "CRK1-R032",
  "CRK1-R036",
  "CRK1-R037",
]);

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const matrix = JSON.parse(fs.readFileSync(MATRIX, "utf8"));
const claims = {};

for (const row of matrix.rows) {
  const id = row.requirement_id;
  if (RESEARCH.has(id)) {
    claims[id] = "research";
    continue;
  }
  if (REPRODUCED.has(id)) {
    claims[id] = "reproduced";
    continue;
  }
  if (VERIFIED.has(id)) {
    claims[id] = "verified";
    continue;
  }
  const hasTests = row.repo_tests?.length > 0;
  const hasCts = row.cts_tests?.length > 0;
  if (hasTests || (hasCts && row.mri_component && row.mri_component !== "MRI-Loop")) {
    claims[id] = "implemented";
    continue;
  }
  claims[id] = "normative";
}

claims["CRK1-R043"] = "normative";

const registry = {
  claims,
  metadata: {
    generated_at: new Date().toISOString(),
    commit: gitCommit(),
    version: "CSR-1.0",
    note: "Honest derived registry. Verified/reproduced require explicit evidence — not aspirational.",
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`wrote ${OUT} (${Object.keys(claims).length} claims)`);

const canonicalCsr = {
  version: "1.0",
  timestamp: registry.metadata.generated_at,
  claims: Object.entries(claims).map(([id, status]) => ({
    id,
    type: id.match(/^CRK/) ? "normative-requirement" : "claim",
    status: status.charAt(0).toUpperCase() + status.slice(1),
    evidence: [],
  })),
};
writeJson(CONFORMANCE_PATHS.csr, canonicalCsr);
console.log(`wrote ${CONFORMANCE_PATHS.csr}`);
