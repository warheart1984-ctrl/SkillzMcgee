import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");

export const GOVERNANCE_PATHS = {
  glLedger: path.join(REPO_ROOT, "governance/ledger/ledger.jsonl"),
  glSchema: path.join(REPO_ROOT, "governance/ledger/schema.json"),
  glStewards: path.join(REPO_ROOT, "governance/ledger/stewards.json"),
  glsLedger: path.join(REPO_ROOT, "governance/governance-ledger/ledger.jsonl"),
  glsSchema: path.join(REPO_ROOT, "governance/governance-ledger/schema.json"),
  cor: path.join(REPO_ROOT, "conformance/cor/cor-1.0.json"),
  corMeta: path.join(REPO_ROOT, "meta/COR-1.0.json"),
  csr: path.join(REPO_ROOT, "conformance/csr/csr-1.0.json"),
  csrRegistry: path.join(REPO_ROOT, "conformance/observability/CSR-1.0/registry.json"),
  dra: path.join(REPO_ROOT, "conformance/dra/dra-1.0.json"),
  draMeta: path.join(REPO_ROOT, "meta/DRA-1.0.json"),
  proofGraph: path.join(REPO_ROOT, "conformance/proof-graph/graph.json"),
} as const;
