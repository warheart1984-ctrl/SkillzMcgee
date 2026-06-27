import { COR_SUITE_PATHS, type CarArtifact, type CarArtifactKind } from "../paths.js";
import { emitArtifact } from "../../cor/emitters/json.js";
import { loadCarRegistry } from "../car/registry.js";

export type PgiNodeKind = CarArtifactKind;

export interface ProofGraphNode {
  id: string;
  kind: PgiNodeKind;
  path: string;
}

export type ProofGraphRelation =
  | "implements"
  | "verifies"
  | "evidences"
  | "supersedes"
  | "related";

export interface ProofGraphEdge {
  from: string;
  to: string;
  relation: ProofGraphRelation;
}

export interface ProofGraphIndex {
  pgiVersion: "PGI-1.0";
  generatedAt: string;
  nodes: ProofGraphNode[];
  edges: ProofGraphEdge[];
}

function relationFor(artifact: CarArtifact, target: CarArtifact | undefined): ProofGraphRelation {
  if (artifact.kind === "implementation" && target?.kind === "requirement") return "implements";
  if (artifact.kind === "verification" && target?.kind === "requirement") return "verifies";
  if ((artifact.kind === "evidence" || artifact.kind === "governance_receipt") && target?.kind === "requirement") {
    return "evidences";
  }
  return "related";
}

function addEdge(edges: ProofGraphEdge[], from: string, to: string, relation: ProofGraphRelation): void {
  if (from === to) return;
  if (edges.some((edge) => edge.from === from && edge.to === to && edge.relation === relation)) return;
  edges.push({ from, to, relation });
}

export function buildProofGraphIndex(artifacts = loadCarRegistry().artifacts): ProofGraphIndex {
  const activeArtifacts = artifacts.filter((artifact) => artifact.status !== "retired");
  const byId = new Map(activeArtifacts.map((artifact) => [artifact.id, artifact]));
  const nodes = activeArtifacts.map((artifact) => ({
    id: artifact.id,
    kind: artifact.kind,
    path: artifact.path,
  }));
  const edges: ProofGraphEdge[] = [];

  for (const artifact of activeArtifacts) {
    for (const targetId of artifact.links?.related ?? []) {
      addEdge(edges, artifact.id, targetId, relationFor(artifact, byId.get(targetId)));
    }
    for (const targetId of artifact.links?.supersedes ?? []) {
      addEdge(edges, artifact.id, targetId, "supersedes");
    }
    for (const targetId of artifact.links?.supersededBy ?? []) {
      addEdge(edges, targetId, artifact.id, "supersedes");
    }
  }

  return {
    pgiVersion: "PGI-1.0",
    generatedAt: new Date().toISOString(),
    nodes,
    edges,
  };
}

export function emitProofGraphIndex(index = buildProofGraphIndex()): string {
  return emitArtifact(COR_SUITE_PATHS.outputs.pgi, index, [
    "pgiVersion",
    "generatedAt",
    "nodes",
    "edges",
  ]);
}
