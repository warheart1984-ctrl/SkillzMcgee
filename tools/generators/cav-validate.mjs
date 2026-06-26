#!/usr/bin/env node
/**
 * CAV-1.0 — Canonical Artifact Validator
 * Usage: node tools/generators/cav-validate.mjs [--fail-on-error]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REGISTRY = path.join(ROOT, "conformance/proof-graph/canonical-derived-registry.json");
const GRAPH = path.join(ROOT, "conformance/proof-graph/index.json");
const CATALOG = path.join(ROOT, "specification/normative-requirements/catalog.json");
const CONTRACTS_DIR = path.join(ROOT, "specification/transformation-contracts");

const errors = [];
const warnings = [];

function err(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function fileExists(p) {
  return fs.existsSync(p);
}

function validateIdentity() {
  if (!fileExists(CATALOG)) {
    err("catalog.json missing at specification/normative-requirements/");
    return;
  }
  const catalog = JSON.parse(fs.readFileSync(CATALOG, "utf8"));
  const entries = Array.isArray(catalog) ? catalog : catalog.requirements ?? catalog.entries ?? [];
  const ids = new Set();
  for (const entry of entries) {
    const id = entry.requirement_id ?? entry.id;
    if (!id) {
      err("catalog entry missing requirement_id");
      continue;
    }
    if (!/^CRK1-R\d{3}$/.test(id)) {
      err(`${id} does not match CRK1-R### naming convention`);
    }
    if (ids.has(id)) err(`duplicate requirement ID: ${id}`);
    ids.add(id);
    const mdPath = path.join(ROOT, "specification/normative-requirements", `${id.replace("CRK1-", "")}.md`);
    if (!fileExists(mdPath) && !fileExists(path.join(ROOT, "specification/normative-requirements", `${id}.md`))) {
      warn(`${id} listed in catalog but normative markdown not found`);
    }
  }
}

function validateContracts() {
  if (!fileExists(CONTRACTS_DIR)) {
    err("transformation-contracts directory missing");
    return;
  }
  const slugs = [
    "decision-to-outcome",
    "outcome-to-evidence",
    "evidence-to-interpretation",
    "interpretation-to-policy-eval",
    "policy-eval-to-policy-outcome",
    "policy-outcome-to-governance-decision",
    "governance-decision-to-execution-plan",
    "execution-plan-to-state-transition",
    "state-transition-to-receipt",
    "receipt-to-provenance",
    "provenance-to-lineage",
    "lineage-to-drift-update",
  ];
  const files = fs.readdirSync(CONTRACTS_DIR);
  for (let i = 0; i < slugs.length; i++) {
    const tn = `T${String(i + 1).padStart(2, "0")}`;
    const slug = slugs[i];
    if (!files.some((f) => f.includes(slug))) warn(`no transformation contract found for ${tn} (${slug})`);
  }
}

function validateReferentialIntegrity(graph) {
  if (!graph) {
    err("proof-graph index missing — run graph refresh");
    return;
  }
  const specIds = new Set(Object.keys(graph.specifications ?? {}));
  const implIds = new Set(Object.keys(graph.implementations ?? {}));
  const authIds = new Set(Object.keys(graph.authorities ?? {}));
  const reqIds = new Set(Object.keys(graph.requirements ?? {}));

  for (const [specId, spec] of Object.entries(graph.specifications ?? {})) {
    if (!authIds.has(spec.authorized_by)) {
      err(`${specId} references missing authority ${spec.authorized_by}`);
    }
    for (const impl of spec.implements ?? []) {
      if (!implIds.has(impl)) err(`${specId} references missing implementation ${impl}`);
    }
    for (const req of spec.requirements ?? []) {
      if (!reqIds.has(req)) err(`${specId} references missing requirement ${req}`);
    }
  }

  for (const [implId, impl] of Object.entries(graph.implementations ?? {})) {
    if (impl.claims_conformance_to && !specIds.has(impl.claims_conformance_to)) {
      err(`${implId} claims conformance to missing spec ${impl.claims_conformance_to}`);
    }
    for (const req of impl.requirements ?? []) {
      if (!reqIds.has(req)) err(`${implId} references missing requirement ${req}`);
    }
  }

  for (const [reqId, req] of Object.entries(graph.requirements ?? {})) {
    for (const spec of req.specifications ?? []) {
      if (!specIds.has(spec)) err(`${reqId} references missing spec ${spec}`);
    }
    for (const impl of req.implementations ?? []) {
      if (!implIds.has(impl)) err(`${reqId} references missing implementation ${impl}`);
    }
    for (const auth of req.authority ?? []) {
      if (!authIds.has(auth)) err(`${reqId} references missing authority ${auth}`);
    }
  }

  for (const [trId, tr] of Object.entries(graph.transformations ?? {})) {
    if (tr.spec && !specIds.has(tr.spec)) err(`${trId} references missing spec ${tr.spec}`);
    if (tr.authority && !authIds.has(tr.authority)) err(`${trId} references missing authority ${tr.authority}`);
    if (tr.implementation && !implIds.has(tr.implementation)) err(`${trId} references missing implementation ${tr.implementation}`);
  }
}

function validateConstitutional(registry) {
  if (!registry) {
    err("canonical-derived-registry.json missing");
    return;
  }
  if (!registry.rules?.derived_non_authoritative) {
    warn("registry should declare derived_non_authoritative: true");
  }
  const derivedPaths = Object.values(registry.derived ?? {});
  for (const canonKey of ["requirements", "contracts"]) {
    const val = registry.canonical?.[canonKey];
    if (typeof val === "string" && derivedPaths.some((d) => val.includes(d))) {
      err(`canonical ${canonKey} must not point to derived artifact path`);
    }
  }
}

function validateDerivedDrift(registry) {
  const corPath = path.join(ROOT, registry?.derived?.cor_report ?? "meta/COR-1.0.json");
  if (fileExists(corPath)) {
    const cor = JSON.parse(fs.readFileSync(corPath, "utf8"));
    if (!cor.generated_at) warn("COR-1.0 missing generated_at — may be hand-edited");
  }
}

const graph = fileExists(GRAPH) ? JSON.parse(fs.readFileSync(GRAPH, "utf8")) : null;
const registry = fileExists(REGISTRY) ? JSON.parse(fs.readFileSync(REGISTRY, "utf8")) : null;

validateIdentity();
validateContracts();
validateReferentialIntegrity(graph);
validateConstitutional(registry);
validateDerivedDrift(registry);

const result = {
  version: "CAV-1.0",
  status: errors.length === 0 ? "pass" : "fail",
  validated_at: new Date().toISOString(),
  errors,
  warnings,
};

console.log(JSON.stringify(result, null, 2));

if (process.argv.includes("--fail-on-error") && errors.length > 0) {
  process.exit(1);
}
process.exit(errors.length > 0 ? 1 : 0);
