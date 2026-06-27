import type { CorStateVector } from "../../cor-suite/paths.js";
import type { LegacyCor } from "../../cor/loaders/repo.js";

export function runRegressions(
  cor: CorStateVector,
  legacy: LegacyCor | null,
): Array<{
  claimId: string;
  type: string;
  summary: string;
  severity: "info" | "warning" | "error" | "critical";
  derivation: string[];
  relatedRequirements?: string[];
}> {
  const claims: Array<{
    claimId: string;
    type: string;
    summary: string;
    severity: "info" | "warning" | "error" | "critical";
    derivation: string[];
    relatedRequirements?: string[];
  }> = [];

  for (const leg of legacy?.requirements ?? []) {
    if (leg.verification_status !== "complete") {
      claims.push({
        claimId: `REG-V-${leg.requirement_id}`,
        type: "regression.verification",
        summary: `${leg.requirement_id} verification_status=${leg.verification_status}`,
        severity: "warning",
        derivation: ["legacy COR verification_status !== complete"],
        relatedRequirements: [leg.requirement_id],
      });
    }
    if (leg.evidence_status !== "complete") {
      claims.push({
        claimId: `REG-E-${leg.requirement_id}`,
        type: "regression.evidence",
        summary: `${leg.requirement_id} evidence_status=${leg.evidence_status}`,
        severity: "warning",
        derivation: ["legacy COR evidence_status !== complete"],
        relatedRequirements: [leg.requirement_id],
      });
    }
  }

  for (const miss of cor.structuralIntegrity.missingArtifacts) {
    claims.push({
      claimId: `REG-M-${miss.expectedForRequirement}-${miss.kind}`,
      type: `regression.${miss.kind === "verification" ? "verification" : miss.kind === "impl" ? "implementation" : "evidence"}`,
      summary: `Missing ${miss.kind} artifact for ${miss.expectedForRequirement}`,
      severity: "error",
      derivation: ["COR structuralIntegrity.missingArtifacts"],
      relatedRequirements: [miss.expectedForRequirement],
    });
  }

  return claims;
}
