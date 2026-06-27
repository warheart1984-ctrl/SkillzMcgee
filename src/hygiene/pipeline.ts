import fs from "node:fs";
import { generateCor } from "../cor/index.js";
import { runProofAnalysis } from "../analysis/index.js";
import { emitCavValidation } from "../cor-suite/car/validate.js";
import { registerGovernanceReceiptInCar } from "../cor-suite/car/governance.js";
import { emitDraReport } from "../cor-suite/dra/index.js";
import { runGovernanceEngine } from "../cor-suite/governance/engine.js";
import { emitProofGraphIndex } from "../cor-suite/pgi/index.js";
import { computeMaturityVector } from "../maturity/index.js";
import { hygienePasses, scanRepoHygiene } from "./scanner.js";

export interface PipelineResult {
  hygiene: ReturnType<typeof scanRepoHygiene>;
  cavPath: string;
  corPath: string;
  pgiPath: string;
  draPath: string;
  analysisPath: string;
  maturityPath: string;
  governance: ReturnType<typeof runGovernanceEngine>;
}

export function runCorSuitePipeline(options?: {
  skipGenerators?: boolean;
  steward?: string;
  failOnGovernanceReject?: boolean;
  registerGovernanceReceipt?: boolean;
}): PipelineResult {
  const hygiene = scanRepoHygiene();
  if (!hygienePasses(hygiene)) {
    throw new Error("Repo hygiene checks failed - see meta/cor-suite/repo-hygiene-status.json");
  }

  const cavPath = emitCavValidation();
  const cav = JSON.parse(fs.readFileSync(cavPath, "utf8")) as { ok: boolean };
  if (!cav.ok) {
    throw new Error("CAV validation failed - see meta/cor-suite/cav-validation.json");
  }

  const corPath = generateCor({ skipGenerators: options?.skipGenerators });
  const pgiPath = emitProofGraphIndex();
  const draPath = emitDraReport();
  const analysisPath = runProofAnalysis();
  const maturityPath = computeMaturityVector();
  const governance = runGovernanceEngine({ steward: options?.steward });

  if (options?.registerGovernanceReceipt) {
    const cor = JSON.parse(fs.readFileSync(corPath, "utf8"));
    registerGovernanceReceiptInCar(governance.receiptPath, cor);
    emitCavValidation();
  }

  if (options?.failOnGovernanceReject && ["reject", "freeze"].includes(governance.decision)) {
    throw new Error(`Governance decision blocked pipeline: ${governance.decision}`);
  }

  return { hygiene, cavPath, corPath, pgiPath, draPath, analysisPath, maturityPath, governance };
}

export function runHygieneGate(): void {
  const status = scanRepoHygiene();
  if (!hygienePasses(status)) {
    process.exitCode = 1;
    throw new Error("Hygiene gate failed");
  }
}

export function runCorOnly(skipGenerators?: boolean): string {
  return generateCor({ skipGenerators });
}

export function runAnalysisOnly(): string {
  return runProofAnalysis();
}

export function runMaturityOnly(): string {
  return computeMaturityVector();
}

export function runGovernOnly(steward?: string) {
  return runGovernanceEngine({ steward });
}

export function printPipelineSummary(result: PipelineResult): void {
  console.log(JSON.stringify({
    hygiene: result.hygiene.repoId,
    cav: result.cavPath,
    cor: result.corPath,
    pgi: result.pgiPath,
    dra: result.draPath,
    analysis: result.analysisPath,
    maturity: result.maturityPath,
    governance: result.governance.decision,
    receipt: result.governance.receiptPath,
  }, null, 2));
}
