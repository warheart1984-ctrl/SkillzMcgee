import { execSync } from "node:child_process";
import fs from "node:fs";
import { COR_SUITE_PATHS, REPO_ROOT } from "../cor-suite/paths.js";
import type {
  CarArtifact,
  CorRequirement,
  CorStateVector,
  MaturityLevel,
  ReproductionStatus,
} from "../cor-suite/paths.js";
import { artifactRefFromCar, loadCarRegistry, relatedToRequirement } from "../cor-suite/car/registry.js";
import { validateCarRegistry } from "../cor-suite/car/validate.js";
import { artifactRef } from "./loaders/hash.js";
import {
  loadCsrClaims,
  loadGraphIndex,
  loadLegacyCor,
  loadMatrix,
  type LegacyCorRow,
  type MatrixRow,
} from "./loaders/repo.js";
import { emitCorState } from "./emitters/json.js";

function gitCommit(): string {
  try {
    return execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function runLegacyGenerators(): void {
  execSync(`node "${COR_SUITE_PATHS.generators.csrRegistry}"`, { cwd: REPO_ROOT, stdio: "pipe" });
  execSync(`node "${COR_SUITE_PATHS.generators.proofGraph}"`, { cwd: REPO_ROOT, stdio: "pipe" });
  execSync(
    `node "${COR_SUITE_PATHS.generators.corGenerate}" --out meta/COR-1.0.json`,
    { cwd: REPO_ROOT, stdio: "pipe" },
  );
}

function mapMaturity(claim: string): MaturityLevel {
  if (claim === "reproduced") return "reproduced";
  if (claim === "verified") return "verified";
  if (claim === "implemented") return "implemented";
  return "normative";
}

function mapReproduction(status: string, claim: string): ReproductionStatus {
  if (status === "reproduced" || claim === "reproduced") return "succeeded";
  if (status === "pending") return "in_progress";
  if (status === "missing" && (claim === "verified" || claim === "implemented")) return "not_attempted";
  return "not_attempted";
}

function buildRequirement(
  row: MatrixRow,
  legacy: LegacyCorRow | undefined,
  claims: Record<string, string>,
): CorRequirement {
  const graph = loadGraphIndex();
  const g = graph.requirements?.[row.requirement_id];
  const claim = legacy?.claim_status ?? claims[row.requirement_id] ?? "normative";

  const specArtifacts = (g?.specifications ?? []).map((p) =>
    artifactRef(REPO_ROOT, p, "specification"),
  );
  const implArtifacts = (g?.implementations ?? []).map((p) =>
    artifactRef(REPO_ROOT, p, "implementation"),
  );
  const verificationArtifacts = [
    ...(g?.verification_methods ?? []),
    ...(row.cts_tests ?? []).map((t) => `conformance/CTS-1.0/${t}`),
    ...(row.repo_tests ?? []).map((t) => `tests/${t}`),
  ].map((p) => artifactRef(REPO_ROOT, p, "verification"));

  const evidenceId = row.evidence && row.evidence !== "N/A" ? row.evidence : row.requirement_id;
  const evidence = row.evidence && row.evidence !== "N/A"
    ? [{
        id: evidenceId,
        type: "evidence",
        artifact: artifactRef(REPO_ROOT, `conformance/evidence-requirements/${row.requirement_id}`, "evidence"),
      }]
    : [];

  return {
    id: row.requirement_id,
    authority: g?.authority?.[0] ?? "CRK-1 Specification v1.0",
    specArtifacts,
    implArtifacts,
    verificationArtifacts,
    evidence,
    provenance: [],
    reproductionStatus: mapReproduction(legacy?.reproduction_status ?? "missing", claim),
    maturity: mapMaturity(claim),
  };
}

function buildStructuralIntegrity(
  requirements: CorRequirement[],
  legacy: ReturnType<typeof loadLegacyCor>,
): CorStateVector["structuralIntegrity"] {
  const orphans = {
    requirements: [] as string[],
    implementations: [] as string[],
    verifications: [] as string[],
  };
  const missingArtifacts: CorStateVector["structuralIntegrity"]["missingArtifacts"] = [];
  const brokenLineage: CorStateVector["structuralIntegrity"]["brokenLineage"] = [];
  const unresolvedAssumptions: string[] = [];

  for (const req of requirements) {
    const leg = legacy?.requirements.find((r) => r.requirement_id === req.id);
    if (leg?.authority_status === "missing" || leg?.specification_status === "missing") {
      orphans.requirements.push(req.id);
    }
    if (leg?.implementation_status === "missing") orphans.implementations.push(req.id);
    if (leg?.verification_status === "missing") orphans.verifications.push(req.id);
    if (leg?.evidence_status === "missing") {
      missingArtifacts.push({ expectedForRequirement: req.id, kind: "evidence" });
    }
    if (leg?.provenance_status === "unanchored" || leg?.provenance_status === "missing") {
      brokenLineage.push({
        fromId: req.id,
        toId: "provenance-chain",
        issueType: leg.provenance_status,
      });
    }
    for (const ex of leg?.exceptions ?? []) {
      if (ex.toLowerCase().includes("assumption")) unresolvedAssumptions.push(`${req.id}: ${ex}`);
    }
  }

  if (legacy?.summary.unresolved_assumptions) {
    unresolvedAssumptions.push(`summary_count:${legacy.summary.unresolved_assumptions}`);
  }

  return { orphans, missingArtifacts, brokenLineage, unresolvedAssumptions };
}

function carMaturity(related: CarArtifact[]): MaturityLevel {
  if (related.some((a) => a.kind === "governance_receipt")) return "reproduced";
  if (related.some((a) => a.kind === "verification")) return "verified";
  if (related.some((a) => a.kind === "implementation")) return "implemented";
  return "normative";
}

function carRequirement(
  requirement: CarArtifact,
  related: CarArtifact[],
): CorRequirement {
  return {
    id: requirement.id,
    authority: requirement.authority ?? "CAR-1.0",
    specArtifacts: related
      .filter((a) => a.kind === "specification" || a.kind === "schema")
      .map(artifactRefFromCar),
    implArtifacts: related
      .filter((a) => a.kind === "implementation")
      .map(artifactRefFromCar),
    verificationArtifacts: related
      .filter((a) => a.kind === "verification")
      .map(artifactRefFromCar),
    evidence: related
      .filter((a) => a.kind === "evidence" || a.kind === "governance_receipt")
      .map((a) => ({
        id: a.id,
        type: a.kind,
        artifact: artifactRefFromCar(a),
      })),
    provenance: [{
      eventId: `CAR-${requirement.id}`,
      actor: "CAR-1.0",
      timestamp: requirement.lifecycle?.updatedAt ?? requirement.lifecycle?.createdAt ?? new Date(0).toISOString(),
      action: "registered-requirement",
      details: requirement.path,
    }],
    reproductionStatus: related.some((a) => a.kind === "governance_receipt")
      ? "succeeded"
      : "not_attempted",
    maturity: carMaturity(related),
  };
}

function buildStructuralIntegrityFromCar(
  requirements: CorRequirement[],
  artifacts: CarArtifact[],
): CorStateVector["structuralIntegrity"] {
  const requirementIds = new Set(requirements.map((r) => r.id));
  const activeArtifacts = artifacts.filter((a) => a.status === "active");
  const orphans = {
    requirements: [] as string[],
    implementations: [] as string[],
    verifications: [] as string[],
  };
  const missingArtifacts: CorStateVector["structuralIntegrity"]["missingArtifacts"] = [];
  const brokenLineage: CorStateVector["structuralIntegrity"]["brokenLineage"] = [];

  for (const req of requirements) {
    if (req.specArtifacts.length === 0) {
      missingArtifacts.push({ expectedForRequirement: req.id, kind: "spec" });
    }
    if (req.implArtifacts.length === 0) {
      missingArtifacts.push({ expectedForRequirement: req.id, kind: "impl" });
      orphans.implementations.push(req.id);
    }
    if (req.verificationArtifacts.length === 0) {
      missingArtifacts.push({ expectedForRequirement: req.id, kind: "verification" });
      orphans.verifications.push(req.id);
    }
    if (req.evidence.length === 0) {
      missingArtifacts.push({ expectedForRequirement: req.id, kind: "evidence" });
    }
  }

  for (const artifact of activeArtifacts) {
    if (artifact.kind === "requirement") continue;
    const related = artifact.links?.related ?? [];
    if (related.length === 0) {
      const bucket = artifact.kind === "implementation"
        ? orphans.implementations
        : artifact.kind === "verification"
          ? orphans.verifications
          : orphans.requirements;
      bucket.push(artifact.id);
    }
    for (const target of related) {
      if (!requirementIds.has(target)) {
        brokenLineage.push({
          fromId: artifact.id,
          toId: target,
          issueType: "missing-related-requirement",
        });
      }
    }
  }

  return {
    orphans,
    missingArtifacts,
    brokenLineage,
    unresolvedAssumptions: [],
  };
}

export function buildCorStateVectorFromCar(): CorStateVector {
  const registry = loadCarRegistry();
  const validation = validateCarRegistry(registry);
  if (!validation.ok) {
    const blockers = validation.findings.filter((f) => f.blocking);
    throw new Error(`CAR validation failed: ${blockers.map((f) => f.findingId).join(", ")}`);
  }

  const activeArtifacts = registry.artifacts.filter((a) => a.status === "active");
  const requirementArtifacts = activeArtifacts.filter((a) => a.kind === "requirement");
  const requirements = requirementArtifacts.map((req) => {
    const related = activeArtifacts.filter((a) => relatedToRequirement(a, req.id));
    return carRequirement(req, related);
  });

  return {
    corVersion: "COR-1.0",
    generatedAt: new Date().toISOString(),
    commit: gitCommit(),
    requirements,
    structuralIntegrity: buildStructuralIntegrityFromCar(requirements, activeArtifacts),
  };
}

export function buildCorStateVector(options?: { skipGenerators?: boolean }): CorStateVector {
  if (fs.existsSync(COR_SUITE_PATHS.inputs.carRegistry)) {
    return buildCorStateVectorFromCar();
  }

  if (!options?.skipGenerators) runLegacyGenerators();

  const matrix = loadMatrix();
  const claims = loadCsrClaims();
  const legacy = loadLegacyCor();

  const requirements = matrix.rows.map((row) => {
    const leg = legacy?.requirements.find((r) => r.requirement_id === row.requirement_id);
    return buildRequirement(row, leg, claims);
  });

  return {
    corVersion: "COR-1.0",
    generatedAt: new Date().toISOString(),
    commit: legacy?.commit ?? gitCommit(),
    requirements,
    structuralIntegrity: buildStructuralIntegrity(requirements, legacy),
  };
}

export function generateCor(options?: { skipGenerators?: boolean }): string {
  const vector = buildCorStateVector(options);
  return emitCorState(vector);
}

export { loadLegacyCor };
