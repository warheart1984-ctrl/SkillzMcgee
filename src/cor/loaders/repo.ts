import fs from "node:fs";
import { COR_SUITE_PATHS, REPO_ROOT } from "../../cor-suite/paths.js";

export function loadJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function loadMatrix() {
  return loadJson<{ rows: MatrixRow[] }>(COR_SUITE_PATHS.inputs.matrix);
}

export function loadCsrClaims(): Record<string, string> {
  const raw = loadJson<{ claims: Record<string, string> }>(COR_SUITE_PATHS.inputs.csrRegistry);
  return raw.claims ?? {};
}

export function loadGraphIndex() {
  return loadJson<{ requirements?: Record<string, GraphRequirement> }>(
    COR_SUITE_PATHS.inputs.graphIndex,
  );
}

export function loadLegacyCor() {
  if (!fs.existsSync(COR_SUITE_PATHS.inputs.legacyCor)) return null;
  return loadJson<LegacyCor>(COR_SUITE_PATHS.inputs.legacyCor);
}

export interface MatrixRow {
  requirement_id: string;
  title?: string;
  cts_tests?: string[];
  repo_tests?: string[];
  mri_component?: string;
  evidence?: string;
  receipts?: string;
  provenance?: string;
}

export interface GraphRequirement {
  authority?: string[];
  specifications?: string[];
  implementations?: string[];
  verification_methods?: string[];
  evidence?: string[];
}

export interface LegacyCorRow {
  requirement_id: string;
  authority_status: string;
  specification_status: string;
  implementation_status: string;
  verification_status: string;
  evidence_status: string;
  receipt_status: string;
  provenance_status: string;
  reproduction_status: string;
  claim_status: string;
  exceptions?: string[];
}

export interface LegacyCor {
  version: string;
  generated_at: string;
  commit?: string;
  requirements: LegacyCorRow[];
  summary: {
    orphaned_requirements: number;
    orphaned_implementations: number;
    missing_evidence: number;
    missing_receipts: number;
    unanchored_receipts: number;
    broken_provenance: number;
    unreproduced_claims: number;
    unresolved_assumptions: number;
    proof_closure: string;
  };
}

export { REPO_ROOT };
