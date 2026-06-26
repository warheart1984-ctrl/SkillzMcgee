import fs from "node:fs";
import path from "node:path";
import { GOVERNANCE_PATHS, REPO_ROOT } from "./paths.js";
import type { Gl1Entry } from "./gl1.js";
import type { Gls1Entry } from "./gls1.js";

export function validateGl1Evidence(entry: Gl1Entry): string[] {
  const evidence = entry.evidence ?? {};
  const checks: Array<[string, string]> = [
    ["cor", path.join(REPO_ROOT, "conformance/cor", evidence.cor)],
    ["csr", path.join(REPO_ROOT, "conformance/csr", evidence.csr)],
    ["dra", path.join(REPO_ROOT, "conformance/dra", evidence.dra)],
    ["cor-meta", GOVERNANCE_PATHS.corMeta],
    ["csr-registry", GOVERNANCE_PATHS.csrRegistry],
    ["dra-meta", GOVERNANCE_PATHS.draMeta],
  ];

  const missing: string[] = [];
  for (const [name, filePath] of checks) {
    if (!fs.existsSync(filePath)) missing.push(name);
  }
  return missing.length ? [`missing evidence: ${missing.join(", ")}`] : [];
}

export function validateGls1Evidence(entry: Gls1Entry): string[] {
  const errors: string[] = [];
  if (!Array.isArray(entry.rationale) || entry.rationale.length === 0) {
    errors.push("empty rationale");
  }
  if (!Array.isArray(entry.steward_votes) || entry.steward_votes.length === 0) {
    errors.push("empty steward_votes");
  }
  const inputs = entry.inputs ?? {};
  if (inputs.canonical_commit && typeof inputs.canonical_commit === "string") {
    const commit = inputs.canonical_commit;
    if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
      errors.push("invalid canonical_commit reference");
    }
  }
  return errors;
}
