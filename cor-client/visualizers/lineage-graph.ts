/** Lineage graph data from COR structural integrity + requirements. */
export interface LineageNode {
  id: string;
  kind: "requirement" | "implementation" | "verification" | "orphan";
  label: string;
}

export interface LineageEdge {
  from: string;
  to: string;
  kind: string;
}

export function buildLineageGraph(cor: {
  requirements?: Array<{
    id: string;
    implArtifacts?: Array<{ path: string }>;
    verificationArtifacts?: Array<{ path: string }>;
  }>;
  structuralIntegrity?: {
    orphans?: { implementations?: string[]; verifications?: string[] };
  };
}): { nodes: LineageNode[]; edges: LineageEdge[] } {
  const nodes: LineageNode[] = [];
  const edges: LineageEdge[] = [];

  for (const req of cor.requirements ?? []) {
    nodes.push({ id: req.id, kind: "requirement", label: req.id });
    for (const impl of req.implArtifacts ?? []) {
      const id = `impl:${impl.path}`;
      nodes.push({ id, kind: "implementation", label: impl.path });
      edges.push({ from: req.id, to: id, kind: "implements" });
    }
    for (const ver of req.verificationArtifacts ?? []) {
      const id = `ver:${ver.path}`;
      nodes.push({ id, kind: "verification", label: ver.path });
      edges.push({ from: req.id, to: id, kind: "verifies" });
    }
  }

  for (const path of cor.structuralIntegrity?.orphans?.implementations ?? []) {
    nodes.push({ id: `orphan:${path}`, kind: "orphan", label: path });
  }

  return { nodes, edges };
}
