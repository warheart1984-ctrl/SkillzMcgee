import fs from "node:fs";
import { COR_SUITE_PATHS } from "../../cor-suite/paths.js";
import type { CorStateVector } from "../../cor-suite/paths.js";
import type { LegacyCor } from "../../cor/loaders/repo.js";

export function runDependencyMaps(
  cor: CorStateVector,
  _legacy: LegacyCor | null,
): {
  maps: Array<{ rootRequirementId: string; dependencies: string[] }>;
  claims: Array<{
    claimId: string;
    type: string;
    summary: string;
    severity: "info" | "warning" | "error" | "critical";
    derivation: string[];
    relatedRequirements?: string[];
  }>;
} {
  const graphPath = COR_SUITE_PATHS.inputs.graphIndex;
  const graph = fs.existsSync(graphPath)
    ? (JSON.parse(fs.readFileSync(graphPath, "utf8")) as {
        requirements?: Record<string, { traceability?: string[] }>;
      })
    : { requirements: {} };

  const maps: Array<{ rootRequirementId: string; dependencies: string[] }> = [];
  const claims: Array<{
    claimId: string;
    type: string;
    summary: string;
    severity: "info" | "warning" | "error" | "critical";
    derivation: string[];
    relatedRequirements?: string[];
  }> = [];

  for (const req of cor.requirements.slice(0, 50)) {
    const deps = graph.requirements?.[req.id]?.traceability ?? [
      ...req.specArtifacts.map((a) => a.path),
      ...req.implArtifacts.map((a) => a.path),
    ];
    maps.push({ rootRequirementId: req.id, dependencies: deps });

    if (req.implArtifacts.some((a) => a.hash === "missing")) {
      claims.push({
        claimId: `DEP-${req.id}-impl-gap`,
        type: "dependency.implementation",
        summary: `${req.id} has missing implementation artifact on disk`,
        severity: "error",
        derivation: ["implArtifacts hash === missing"],
        relatedRequirements: [req.id],
      });
    }
  }

  return { maps, claims };
}
