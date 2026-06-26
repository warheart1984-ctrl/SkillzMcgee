/**
 * Canonical v1.0 artifact paths (Derived + Governance layers).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const CONFORMANCE_PATHS = {
  cor: path.join(ROOT, "conformance/cor/cor-1.0.json"),
  corMeta: path.join(ROOT, "meta/COR-1.0.json"),
  csr: path.join(ROOT, "conformance/csr/csr-1.0.json"),
  csrRegistry: path.join(ROOT, "conformance/observability/CSR-1.0/registry.json"),
  dra: path.join(ROOT, "conformance/dra/dra-1.0.json"),
  draMeta: path.join(ROOT, "meta/DRA-1.0.json"),
  graph: path.join(ROOT, "conformance/proof-graph/graph.json"),
  graphIndex: path.join(ROOT, "conformance/proof-graph/index.json"),
  cav: path.join(ROOT, "conformance/counterfactual/cav-1.0.json"),
  glLedger: path.join(ROOT, "governance/ledger/ledger.jsonl"),
  glSchema: path.join(ROOT, "governance/ledger/schema.json"),
  glStewards: path.join(ROOT, "governance/ledger/stewards.json"),
  continuityCheckpoint: path.join(ROOT, ".runtime/continuity/checkpoint"),
};

export const ROOT_DIR = ROOT;

export function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function mirrorJson(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) return false;
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  writeJson(targetPath, data);
  return true;
}
