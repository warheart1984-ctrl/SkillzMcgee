import fs from "node:fs";
import { COR_SUITE_PATHS } from "../paths.js";
import type { CorStateVector } from "../paths.js";
import type { ProofAnalysisResult } from "../../analysis/index.js";
import { loadLegacyCor } from "../../cor/loaders/repo.js";
import {
  CONSTITUTIONAL_INVARIANTS,
  type GovernanceDecision,
  type GovernanceReceipt,
} from "./invariants.js";
import { emitGovernanceReceipt, signReceiptPayload } from "./receipts.js";

export interface GovernanceEngineResult {
  decision: GovernanceDecision;
  receiptPath: string;
  blockingClaims: number;
}

function loadAnalysis(): ProofAnalysisResult | null {
  const p = COR_SUITE_PATHS.outputs.proofAnalysis;
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8")) as ProofAnalysisResult;
}

function loadCorState(): CorStateVector {
  const p = COR_SUITE_PATHS.outputs.corState;
  if (!fs.existsSync(p)) throw new Error("COR state required before governance");
  return JSON.parse(fs.readFileSync(p, "utf8")) as CorStateVector;
}

function loadLegacyCorForActiveMode() {
  if (fs.existsSync(COR_SUITE_PATHS.inputs.carRegistry)) return null;
  return loadLegacyCor();
}

export function runGovernanceEngine(options?: {
  steward?: string;
  scope?: string[];
}): GovernanceEngineResult {
  const cor = loadCorState();
  const analysis = loadAnalysis();
  const legacy = loadLegacyCorForActiveMode();

  const criticalClaims =
    analysis?.claims.filter((c) => c.severity === "critical" || c.severity === "error").length ?? 0;
  const proofClosureFail = legacy?.summary.proof_closure === "fail";
  const brokenLineage = cor.structuralIntegrity.brokenLineage.length;

  let decision: GovernanceDecision = "approve";
  const rationaleParts: string[] = [];
  const invariantsEnforced = CONSTITUTIONAL_INVARIANTS.map((i) => i.id);

  if (proofClosureFail) {
    decision = "require_fixes";
    rationaleParts.push("COR legacy proof_closure is fail");
  }
  if (criticalClaims > 0) {
    decision = decision === "approve" ? "require_fixes" : decision;
    rationaleParts.push(`${criticalClaims} critical/error proof analysis claims`);
  }
  if (brokenLineage > 20) {
    decision = "escalate";
    rationaleParts.push(`${brokenLineage} broken lineage edges`);
  }

  if (rationaleParts.length === 0) {
    rationaleParts.push("No blocking invariants detected");
  }

  const timestamp = new Date().toISOString();
  const decisionId = `GOV-${timestamp.replace(/[:.]/g, "-")}`;
  const steward = options?.steward ?? "cor-suite-ci";

  const receiptBase: Omit<GovernanceReceipt, "signature"> = {
    decisionId,
    corStateRef: COR_SUITE_PATHS.outputs.corState,
    analysisRef: analysis ? COR_SUITE_PATHS.outputs.proofAnalysis : undefined,
    decision,
    scope: options?.scope ?? ["release:v1.0"],
    rationale: rationaleParts.join("; "),
    evidenceRefs: [
      COR_SUITE_PATHS.outputs.corState,
      ...(analysis ? [COR_SUITE_PATHS.outputs.proofAnalysis] : []),
      ...(legacy ? [COR_SUITE_PATHS.inputs.legacyCor] : []),
    ],
    invariantsEnforced,
    steward,
    timestamp,
  };

  const receipt: GovernanceReceipt = {
    ...receiptBase,
    signature: signReceiptPayload(receiptBase),
  };

  const receiptPath = emitGovernanceReceipt(receipt);
  return { decision, receiptPath, blockingClaims: criticalClaims };
}
