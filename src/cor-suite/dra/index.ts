import fs from "node:fs";
import { COR_SUITE_PATHS } from "../paths.js";
import type { CarArtifact } from "../paths.js";
import { emitArtifact } from "../../cor/emitters/json.js";
import { loadCarRegistry } from "../car/registry.js";
import { buildProofGraphIndex, type ProofGraphIndex } from "../pgi/index.js";

export interface DraRiskRecord {
  requirementId: string;
  dependencyDepth: number;
  fanIn: number;
  fanOut: number;
  verificationGaps: number;
  deprecatedDependencies: number;
  score: number;
}

export interface DraReport {
  draVersion: "DRA-1.0";
  generatedAt: string;
  risk: Record<string, DraRiskRecord>;
}

function loadPgi(): ProofGraphIndex {
  if (!fs.existsSync(COR_SUITE_PATHS.outputs.pgi)) return buildProofGraphIndex();
  return JSON.parse(fs.readFileSync(COR_SUITE_PATHS.outputs.pgi, "utf8")) as ProofGraphIndex;
}

function dependencyDepth(requirementId: string, pgi: ProofGraphIndex): number {
  const queue: Array<{ id: string; depth: number }> = [{ id: requirementId, depth: 0 }];
  const seen = new Set<string>();
  let maxDepth = 0;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current.id)) continue;
    seen.add(current.id);
    maxDepth = Math.max(maxDepth, current.depth);
    for (const edge of pgi.edges.filter((e) => e.from === current.id || e.to === current.id)) {
      const next = edge.from === current.id ? edge.to : edge.from;
      if (!seen.has(next)) queue.push({ id: next, depth: current.depth + 1 });
    }
  }

  return maxDepth;
}

function hasVerification(requirementId: string, artifacts: CarArtifact[]): boolean {
  return artifacts.some((artifact) =>
    artifact.status === "active" &&
    artifact.kind === "verification" &&
    (artifact.links?.related ?? []).includes(requirementId)
  );
}

function deprecatedDependencies(requirementId: string, artifacts: CarArtifact[]): number {
  return artifacts.filter((artifact) =>
    artifact.status === "deprecated" &&
    (artifact.links?.related ?? []).includes(requirementId)
  ).length;
}

function score(record: Omit<DraRiskRecord, "score">): number {
  const weighted =
    record.dependencyDepth * 0.15 +
    record.fanIn * 0.1 +
    record.fanOut * 0.1 +
    record.verificationGaps * 0.4 +
    record.deprecatedDependencies * 0.25;
  return Number(Math.min(1, weighted).toFixed(4));
}

export function buildDraReport(
  artifacts = loadCarRegistry().artifacts,
  pgi = loadPgi(),
): DraReport {
  const requirements = artifacts.filter((artifact) =>
    artifact.status === "active" && artifact.kind === "requirement"
  );
  const risk: DraReport["risk"] = {};

  for (const requirement of requirements) {
    const incoming = pgi.edges.filter((edge) => edge.to === requirement.id);
    const outgoing = pgi.edges.filter((edge) => edge.from === requirement.id);
    const base = {
      requirementId: requirement.id,
      dependencyDepth: dependencyDepth(requirement.id, pgi),
      fanIn: incoming.length,
      fanOut: outgoing.length,
      verificationGaps: hasVerification(requirement.id, artifacts) ? 0 : 1,
      deprecatedDependencies: deprecatedDependencies(requirement.id, artifacts),
    };
    risk[requirement.id] = {
      ...base,
      score: score(base),
    };
  }

  return {
    draVersion: "DRA-1.0",
    generatedAt: new Date().toISOString(),
    risk,
  };
}

export function emitDraReport(report = buildDraReport()): string {
  return emitArtifact(COR_SUITE_PATHS.outputs.draReport, report, [
    "draVersion",
    "generatedAt",
    "risk",
  ]);
}
