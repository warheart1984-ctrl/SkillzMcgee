import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repository root (skillzmcgee). */
export const REPO_ROOT = path.resolve(__dirname, "../..");

export const COR_SUITE_PATHS = {
  specDir: path.join(REPO_ROOT, "spec"),
  carDir: path.join(REPO_ROOT, "cor-suite/car"),
  outputDir: path.join(REPO_ROOT, "meta/cor-suite"),
  schemas: {
    car: path.join(REPO_ROOT, "spec/car-1.0.schema.json"),
    cavValidation: path.join(REPO_ROOT, "spec/cav-validation.schema.json"),
    cavReport: path.join(REPO_ROOT, "spec/cav-report.schema.json"),
    corState: path.join(REPO_ROOT, "spec/cor-state-vector.schema.json"),
    csrReport: path.join(REPO_ROOT, "spec/csr-report.schema.json"),
    draReport: path.join(REPO_ROOT, "spec/dra-report.schema.json"),
    pgi: path.join(REPO_ROOT, "spec/pgi.schema.json"),
    proofAnalysis: path.join(REPO_ROOT, "spec/proof-analysis.schema.json"),
    governanceReceipt: path.join(REPO_ROOT, "spec/governance-receipt.schema.json"),
    maturityVector: path.join(REPO_ROOT, "spec/maturity-vector.schema.json"),
    repoHygiene: path.join(REPO_ROOT, "spec/repo-hygiene-status.schema.json"),
  },
  inputs: {
    carRegistry: path.join(REPO_ROOT, "cor-suite/car/car-1.0.json"),
    matrix: path.join(REPO_ROOT, "conformance/traceability-matrix.json"),
    csrRegistry: path.join(REPO_ROOT, "conformance/observability/CSR-1.0/registry.json"),
    graphIndex: path.join(REPO_ROOT, "conformance/proof-graph/index.json"),
    legacyCor: path.join(REPO_ROOT, "meta/COR-1.0.json"),
  },
  outputs: {
    cavValidation: path.join(REPO_ROOT, "meta/cor-suite/cav-validation.json"),
    cavReport: path.join(REPO_ROOT, "meta/cor-suite/cav-report.json"),
    corState: path.join(REPO_ROOT, "meta/cor-suite/cor-state.json"),
    csrReport: path.join(REPO_ROOT, "meta/cor-suite/csr-report.json"),
    draReport: path.join(REPO_ROOT, "meta/cor-suite/dra-report.json"),
    pgi: path.join(REPO_ROOT, "meta/cor-suite/pgi-1.0.json"),
    proofAnalysis: path.join(REPO_ROOT, "meta/cor-suite/proof-analysis.json"),
    governanceReceipt: path.join(REPO_ROOT, "meta/cor-suite/governance-receipt.json"),
    maturityVector: path.join(REPO_ROOT, "meta/cor-suite/maturity-vector.json"),
    repoHygiene: path.join(REPO_ROOT, "meta/cor-suite/repo-hygiene-status.json"),
  },
  generators: {
    corGenerate: path.join(REPO_ROOT, "tools/generators/cor-generate.mjs"),
    draAnalyze: path.join(REPO_ROOT, "tools/generators/dra-analyze.mjs"),
    csrRegistry: path.join(REPO_ROOT, "tools/generators/csr-registry.mjs"),
    proofGraph: path.join(REPO_ROOT, "tools/generators/proof-graph-index.mjs"),
  },
} as const;

export type MaturityLevel = "normative" | "implemented" | "verified" | "reproduced";

export type ReproductionStatus = "not_attempted" | "in_progress" | "failed" | "succeeded";

export interface ArtifactRef {
  path: string;
  type: string;
  hash: string;
  id?: string;
}

export type CarArtifactKind =
  | "requirement"
  | "specification"
  | "implementation"
  | "verification"
  | "evidence"
  | "governance_receipt"
  | "schema"
  | "registry";

export type CarArtifactStatus = "draft" | "active" | "deprecated" | "retired";

export interface CarArtifact {
  id: string;
  namespace: string;
  kind: CarArtifactKind;
  version: string;
  status: CarArtifactStatus;
  authority?: string;
  schemaRef?: string;
  path: string;
  hash: string;
  lifecycle?: {
    createdAt?: string;
    updatedAt?: string;
    deprecatedAt?: string;
    retiredAt?: string;
  };
  links?: {
    supersedes?: string[];
    supersededBy?: string[];
    related?: string[];
  };
}

export interface CarRegistry {
  carVersion: string;
  generatedAt: string;
  artifacts: CarArtifact[];
}

export interface CorRequirement {
  id: string;
  authority: string;
  specArtifacts: ArtifactRef[];
  implArtifacts: ArtifactRef[];
  verificationArtifacts: ArtifactRef[];
  evidence: Array<{ id: string; type: string; artifact: ArtifactRef }>;
  provenance: Array<{
    eventId: string;
    actor: string;
    timestamp: string;
    action: string;
    details?: string;
  }>;
  reproductionStatus: ReproductionStatus;
  maturity: MaturityLevel;
}

export interface CorStateVector {
  corVersion: string;
  generatedAt: string;
  commit: string;
  requirements: CorRequirement[];
  structuralIntegrity: {
    orphans: {
      requirements: string[];
      implementations: string[];
      verifications: string[];
    };
    missingArtifacts: Array<{ expectedForRequirement: string; kind: "spec" | "impl" | "verification" | "evidence" }>;
    brokenLineage: Array<{ fromId: string; toId: string; issueType: string; details?: string }>;
    unresolvedAssumptions: string[];
  };
}
