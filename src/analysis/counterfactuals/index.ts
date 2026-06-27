import type { CorStateVector } from "../../cor-suite/paths.js";
import type { LegacyCor } from "../../cor/loaders/repo.js";

export function runCounterfactuals(
  cor: CorStateVector,
  legacy: LegacyCor | null,
): AnalysisClaim[] {
  const claims: AnalysisClaim[] = [];
  if (legacy?.summary.proof_closure === "fail") {
    claims.push({
      claimId: "CF-proof-closure",
      type: "counterfactual.proof_closure",
      summary: "If proof_closure were pass, all non-research requirements would be complete with anchored provenance",
      severity: "warning",
      derivation: ["legacy COR summary.proof_closure === fail"],
    });
  }

  for (const req of cor.requirements.filter((r) => r.maturity === "verified" && r.provenance.length === 0)) {
    claims.push({
      claimId: `CF-${req.id}-provenance`,
      type: "counterfactual.provenance",
      summary: `Removing provenance for ${req.id} would block reproduced maturity`,
      severity: "error",
      derivation: [`${req.id} maturity=verified`, "provenance events empty"],
      relatedRequirements: [req.id],
    });
  }

  return claims;
}

export type AnalysisClaim = {
  claimId: string;
  type: string;
  summary: string;
  severity: "info" | "warning" | "error" | "critical";
  derivation: string[];
  relatedRequirements?: string[];
};
