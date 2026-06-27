import fs from "node:fs";
import { COR_SUITE_PATHS } from "../cor-suite/paths.js";
import type { CorStateVector } from "../cor-suite/paths.js";
import { loadLegacyCor } from "../cor/loaders/repo.js";
import { emitArtifact } from "../cor/emitters/json.js";
import { runCounterfactuals } from "./counterfactuals/index.js";
import { runDependencyMaps } from "./dependencies/index.js";
import { runRegressions } from "./regressions/index.js";

export interface ProofAnalysisResult {
  analysisId: string;
  corStateRef: string;
  generatedAt: string;
  claims: Array<{
    claimId: string;
    type: string;
    summary: string;
    severity: "info" | "warning" | "error" | "critical";
    derivation: string[];
    relatedRequirements?: string[];
  }>;
  dependencyMaps?: Array<{ rootRequirementId: string; dependencies: string[] }>;
  regressions?: Array<{
    regressionId: string;
    kind: "implementation" | "verification" | "evidence";
    requirementId: string;
    description: string;
  }>;
}

function loadCorState(): CorStateVector {
  const p = COR_SUITE_PATHS.outputs.corState;
  if (!fs.existsSync(p)) throw new Error(`COR state missing — run: cor-suite cor (${p})`);
  return JSON.parse(fs.readFileSync(p, "utf8")) as CorStateVector;
}

function loadLegacyCorForActiveMode() {
  if (fs.existsSync(COR_SUITE_PATHS.inputs.carRegistry)) return null;
  return loadLegacyCor();
}

export function runProofAnalysis(corState?: CorStateVector): string {
  const cor = corState ?? loadCorState();
  const legacy = loadLegacyCorForActiveMode();
  const analysisId = `PA-${cor.generatedAt.replace(/[:.]/g, "-")}`;

  const claims = [
    ...runCounterfactuals(cor, legacy),
    ...runDependencyMaps(cor, legacy).claims,
    ...runRegressions(cor, legacy),
  ];

  const dependencyMaps = runDependencyMaps(cor, legacy).maps;
  const regressions = claims
    .filter((c) => c.type.startsWith("regression"))
    .map((c, i) => ({
      regressionId: `REG-${i + 1}`,
      kind: c.type.replace("regression.", "") as "implementation" | "verification" | "evidence",
      requirementId: c.relatedRequirements?.[0] ?? "unknown",
      description: c.summary,
    }));

  const result: ProofAnalysisResult = {
    analysisId,
    corStateRef: COR_SUITE_PATHS.outputs.corState,
    generatedAt: new Date().toISOString(),
    claims,
    dependencyMaps,
    regressions,
  };

  return emitArtifact(COR_SUITE_PATHS.outputs.proofAnalysis, result, [
    "analysisId",
    "corStateRef",
    "generatedAt",
    "claims",
  ]);
}
