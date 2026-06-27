import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runProofAnalysis } from "../src/analysis/index.js";
import { generateCor } from "../src/cor/index.js";
import { emitCavValidation, validateCarRegistry } from "../src/cor-suite/car/validate.js";
import { loadCarRegistry } from "../src/cor-suite/car/registry.js";
import { emitDraReport } from "../src/cor-suite/dra/index.js";
import { COR_SUITE_PATHS, REPO_ROOT } from "../src/cor-suite/paths.js";
import { emitProofGraphIndex } from "../src/cor-suite/pgi/index.js";
import { hygienePasses, scanRepoHygiene } from "../src/hygiene/scanner.js";
import { runCorSuitePipeline } from "../src/hygiene/pipeline.js";
import { computeMaturityVector } from "../src/maturity/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("COR Suite schemas exist under spec/", () => {
  for (const schema of Object.values(COR_SUITE_PATHS.schemas)) {
    assert.ok(fs.existsSync(schema), `missing schema ${schema}`);
  }
});

test("CAR registry validates registered artifacts and hashes", () => {
  assert.ok(fs.existsSync(COR_SUITE_PATHS.inputs.carRegistry));
  const registry = loadCarRegistry();
  assert.equal(registry.carVersion, "CAR-1.0");
  assert.ok(registry.artifacts.some((artifact) => artifact.id === "CORSUITE.REQ-001"));
  const validation = validateCarRegistry(registry);
  assert.equal(validation.ok, true, JSON.stringify(validation.findings, null, 2));
  const out = emitCavValidation(validation);
  assert.ok(fs.existsSync(out));
});

test("repo hygiene scan produces status", () => {
  const status = scanRepoHygiene();
  assert.equal(status.repoId, "skillzmcgee");
  assert.ok(fs.existsSync(COR_SUITE_PATHS.outputs.repoHygiene));
  assert.ok(typeof hygienePasses(status) === "boolean");
});

test("cor to pgi to dra to analyze to maturity pipeline (skip generators)", () => {
  const corPath = generateCor({ skipGenerators: true });
  assert.ok(fs.existsSync(corPath));
  const cor = JSON.parse(fs.readFileSync(corPath, "utf8"));
  assert.equal(cor.corVersion, "COR-1.0");
  assert.ok(Array.isArray(cor.requirements));
  assert.ok(cor.requirements.length > 0);
  assert.ok(cor.requirements.some((req) => req.id === "CORSUITE.REQ-001"));

  const pgiPath = emitProofGraphIndex();
  assert.ok(fs.existsSync(pgiPath));
  const pgi = JSON.parse(fs.readFileSync(pgiPath, "utf8"));
  assert.equal(pgi.pgiVersion, "PGI-1.0");
  assert.ok(pgi.nodes.some((node) => node.id === "CORSUITE.REQ-001"));

  const draPath = emitDraReport();
  assert.ok(fs.existsSync(draPath));
  const dra = JSON.parse(fs.readFileSync(draPath, "utf8"));
  assert.equal(dra.draVersion, "DRA-1.0");
  assert.ok(dra.risk["CORSUITE.REQ-001"]);

  const analysisPath = runProofAnalysis(cor);
  assert.ok(fs.existsSync(analysisPath));
  const analysis = JSON.parse(fs.readFileSync(analysisPath, "utf8"));
  assert.ok(analysis.claims.length >= 0);

  const maturityPath = computeMaturityVector(cor);
  assert.ok(fs.existsSync(maturityPath));
  const maturity = JSON.parse(fs.readFileSync(maturityPath, "utf8"));
  assert.equal(maturity.requirements.length, cor.requirements.length);
});

test("full pipeline orchestration", () => {
  const result = runCorSuitePipeline({ skipGenerators: true, steward: "test" });
  assert.ok(result.corPath);
  assert.ok(result.cavPath);
  assert.ok(result.pgiPath);
  assert.ok(result.draPath);
  assert.ok(result.analysisPath);
  assert.ok(result.maturityPath);
  assert.ok(["approve", "reject", "require_fixes", "escalate", "freeze", "retire"].includes(result.governance.decision));
  assert.ok(fs.existsSync(result.governance.receiptPath));
});

test("repo root resolves", () => {
  assert.ok(fs.existsSync(path.join(REPO_ROOT, "package.json")));
  assert.equal(root, REPO_ROOT);
});
