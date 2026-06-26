/**
 * Proof graph visualizer data — nodes + edges for D3 force layout.
 */

import { loadCSR, loadProofGraph } from "./constitutionalData.mjs";

const EDGE_STYLES = {
  authorizes: { color: "#58a6ff", dash: "" },
  implements: { color: "#3fb950", dash: "4 2" },
  verifies: { color: "#d29922", dash: "2 2" },
  produces: { color: "#a371f7", dash: "" },
  "depends-on": { color: "#f85149", dash: "6 3" },
  "governed-by": { color: "#79c0ff", dash: "8 4" },
};

function claimStatus(csr, nodeId) {
  const claims = csr?.claims ?? {};
  if (claims[nodeId]) return claims[nodeId];
  const reqMatch = Object.keys(claims).find((k) => nodeId.includes(k) || k.includes(nodeId));
  return reqMatch ? claims[reqMatch] : "unknown";
}

export function buildGraphVisual(index = loadProofGraph(), csr = loadCSR()) {
  const nodes = new Map();
  const edges = [];

  const addNode = (id, type, meta = {}) => {
    if (!id || nodes.has(id)) return;
    nodes.set(id, {
      id,
      type,
      status: type === "normative" || type === "requirement" ? claimStatus(csr, id) : meta.status ?? "present",
      ...meta,
    });
  };

  const addEdge = (source, target, kind) => {
    if (!source || !target) return;
    edges.push({ source, target, kind, style: EDGE_STYLES[kind] ?? EDGE_STYLES["depends-on"] });
  };

  for (const [id, a] of Object.entries(index.authorities ?? {})) {
    addNode(id, "authority", { label: a.type ?? "authority" });
    for (const specId of a.authorizes_specs ?? []) {
      addNode(specId, "spec");
      addEdge(id, specId, "authorizes");
    }
  }

  for (const [id, s] of Object.entries(index.specifications ?? {})) {
    addNode(id, "spec");
    if (s.authorized_by) addEdge(s.authorized_by, id, "governed-by");
    for (const implId of s.implements ?? []) {
      addNode(implId, "implementation");
      addEdge(id, implId, "implements");
    }
    for (const reqId of s.requirements ?? []) {
      addNode(reqId, "normative");
      addEdge(id, reqId, "depends-on");
    }
  }

  for (const [id, impl] of Object.entries(index.implementations ?? {})) {
    addNode(id, "implementation");
    for (const reqId of impl.requirements ?? []) {
      addNode(reqId, "normative");
      addEdge(id, reqId, "verifies");
    }
  }

  for (const [id, req] of Object.entries(index.requirements ?? {})) {
    addNode(id, "normative");
    for (const evid of req.evidence ?? []) {
      addNode(evid, "evidence");
      addEdge(id, evid, "produces");
    }
    for (const rec of req.receipts ?? []) {
      addNode(rec, "receipt");
      addEdge(evidOr(id, rec), rec, "produces");
    }
    for (const specId of req.specifications ?? []) {
      addEdge(specId, id, "depends-on");
    }
  }

  for (const [id, v] of Object.entries(index.verifications ?? {})) {
    addNode(id, "evidence", { label: "verification" });
    for (const reqId of v.requirements ?? []) {
      addNode(reqId, "normative");
      addEdge(id, reqId, "verifies");
    }
  }

  for (const [id, p] of Object.entries(index.provenance ?? {})) {
    addNode(id, "evidence", { label: "provenance" });
    if (p.requirement) addEdge(id, p.requirement, "governed-by");
  }

  return {
    version: "1.0",
    nodeCount: nodes.size,
    edgeCount: edges.length,
    nodes: [...nodes.values()],
    edges,
    edgeStyles: EDGE_STYLES,
  };
}

function evidOr(reqId, recId) {
  return recId.replace(/^REC-/, "EVID-") || reqId;
}

export function getProofGraphVisual() {
  return buildGraphVisual();
}
