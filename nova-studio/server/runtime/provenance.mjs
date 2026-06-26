/**
 * Receipt provenance — proof-graph links for implementation and dependencies.
 */

import crypto from "node:crypto";
import { stableHash } from "./substrateState.mjs";
import {
  buildDependencyIndex,
  nodeById,
  resolveImplementationNode,
} from "./proofGraphForensics.mjs";
import { loadProofGraph } from "./constitutionalData.mjs";

/**
 * @param {{
 *   receipt: { id: string, capability?: string, slice?: string, timestamp?: string },
 *   envelope?: { continuityCheckpoint?: string },
 *   capabilityId?: string,
 * }} params
 */
export async function computeProvenance({ receipt, envelope, capabilityId }) {
  const graph = loadProofGraph();
  const capId = capabilityId ?? receipt.capability ?? receipt.slice ?? "nova";
  const implNode = resolveImplementationNode(capId, graph);
  const deps = buildDependencyIndex(graph)[implNode.id] ?? [];

  const governanceDecisions = Object.keys(graph.authorities ?? {}).map((id) => ({
    id,
    type: graph.authorities[id]?.type ?? "authority",
  }));

  return {
    receiptId: receipt.id,
    hash: crypto.createHash("sha256").update(JSON.stringify(receipt)).digest("hex"),
    canonicalRoot: stableHash({ graphVersion: graph.version ?? "1.0" }),
    continuityCheckpoint: envelope?.continuityCheckpoint ?? receipt.timestamp,
    proofGraph: {
      implementation: implNode,
      dependencies: deps.map((d) => ({ id: d, node: nodeById(d, graph) })),
      evidence: (implNode.requirements ?? [])
        .flatMap((reqId) => graph.requirements?.[reqId]?.evidence ?? [])
        .map((id) => ({ id, node: nodeById(id, graph) })),
      governance: governanceDecisions,
    },
  };
}
