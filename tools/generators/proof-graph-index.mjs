#!/usr/bin/env node
/**
 * Build Proof-Graph Index from traceability matrix + transformation contracts.
 * Usage: node tools/generators/proof-graph-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { CONFORMANCE_PATHS, writeJson } from "../lib/conformance-paths.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MATRIX = path.join(ROOT, "conformance/traceability-matrix.json");
const INDEX_OUT = path.join(ROOT, "conformance/proof-graph/index.json");
const META_OUT = path.join(ROOT, "meta/proof-graph-index.json");

const AUTHORITY_ID = "steward-council/v1.0";
const IMPL_ID = "MRI-1.0/nova-studio-pipeline/1.0.0";

const T_SPECS = [
  ["T01", "decision-to-outcome"],
  ["T02", "outcome-to-evidence"],
  ["T03", "evidence-to-interpretation"],
  ["T04", "interpretation-to-policy-eval"],
  ["T05", "policy-eval-to-policy-outcome"],
  ["T06", "policy-outcome-to-governance-decision"],
  ["T07", "governance-decision-to-execution-plan"],
  ["T08", "execution-plan-to-state-transition"],
  ["T09", "state-transition-to-receipt"],
  ["T10", "receipt-to-provenance"],
  ["T11", "provenance-to-lineage"],
  ["T12", "lineage-to-drift-update"],
];

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const matrix = JSON.parse(fs.readFileSync(MATRIX, "utf8"));

const authorities = {
  [AUTHORITY_ID]: {
    authority_id: AUTHORITY_ID,
    type: "StewardCouncilDecision",
    authorizes_specs: T_SPECS.map(([tn, slug]) => `${tn}/${slug}/v1.0`),
  },
};

const specifications = {};
for (const [tn, slug] of T_SPECS) {
  const spec_id = `${tn}/${slug}/v1.0`;
  specifications[spec_id] = {
    spec_id,
    authorized_by: AUTHORITY_ID,
    implements: [IMPL_ID],
    requirements: [],
    transformations: [`TR-${tn}`],
  };
}

const implementations = {
  [IMPL_ID]: {
    implementation_id: IMPL_ID,
    claims_conformance_to: "T01/decision-to-outcome/v1.0",
    executions: T_SPECS.map(([tn]) => `TR-${tn}`),
    requirements: [],
  },
};

const verifications = {};
const transformations = {};
const provenance = {};
const requirements = {};

for (const row of matrix.rows) {
  const reqId = row.requirement_id;
  const evidId = `EVID-${row.requirement_num}`;
  const recId = row.receipts && row.receipts !== "N/A" ? `REC-${row.requirement_num}` : null;
  const provId = row.provenance ? `PROV-${row.requirement_num}` : null;

  const specs = [];
  for (const [tn, slug] of T_SPECS) {
    if (row.mri_component?.includes(slug.replace(/-/g, "→")) || row.traceability_chain?.includes(tn)) {
      specs.push(`${tn}/${slug}/v1.0`);
    }
  }
  if (specs.length === 0 && row.mri_component) {
    const tn = T_SPECS.find(([, s]) => row.mri_component.includes(s.split("-")[0]))?.[0];
    if (tn) specs.push(`${tn}/${T_SPECS.find(([t]) => t === tn)[1]}/v1.0`);
  }

  const vMethods = [...(row.cts_tests ?? [])];
  for (const v of vMethods) {
    if (!verifications[v]) verifications[v] = { id: v, requirements: [] };
    if (!verifications[v].requirements.includes(reqId)) verifications[v].requirements.push(reqId);
  }

  requirements[reqId] = {
    requirement_id: reqId,
    authority: [AUTHORITY_ID],
    specifications: specs.length ? specs : [`T01/decision-to-outcome/v1.0`],
    implementations: [IMPL_ID],
    verification_methods: vMethods,
    evidence: [evidId],
    receipts: recId ? [recId] : [],
    provenance: provId ? [provId] : [],
  };

  if (!implementations[IMPL_ID].requirements.includes(reqId)) {
    implementations[IMPL_ID].requirements.push(reqId);
  }

  for (const specId of requirements[reqId].specifications) {
    if (specifications[specId] && !specifications[specId].requirements.includes(reqId)) {
      specifications[specId].requirements.push(reqId);
    }
  }

  if (provId) {
    const trId = specs[0] ? `TR-${specs[0].split("/")[0]}` : `TR-${reqId}`;
    provenance[provId] = {
      id: provId,
      parent: null,
      transformation: trId,
      requirement: reqId,
    };
    transformations[trId] = {
      id: trId,
      spec: specs[0] ?? "T01/decision-to-outcome/v1.0",
      authority: AUTHORITY_ID,
      implementation: IMPL_ID,
      input: `ART-${row.requirement_num}-in`,
      output: `ART-${row.requirement_num}-out`,
      receipt: recId,
      provenance: provId,
    };
  }
}

const index = {
  version: "1.0",
  generated_at: new Date().toISOString(),
  commit: gitCommit(),
  authorities,
  specifications,
  implementations,
  requirements,
  verifications,
  transformations,
  provenance,
};

for (const out of [INDEX_OUT, META_OUT]) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(index, null, 2)}\n`);
}
writeJson(CONFORMANCE_PATHS.graph, index);
console.log(`wrote ${INDEX_OUT}`);
console.log(`wrote ${META_OUT}`);
console.log(`wrote ${CONFORMANCE_PATHS.graph}`);
