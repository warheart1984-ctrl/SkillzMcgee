/**
 * Proof-graph traversal for provenance and impact analysis.
 */

import { loadProofGraph } from "./constitutionalData.mjs";

const DEFAULT_IMPL = "MRI-1.0/nova-studio-pipeline/1.0.0";

export function resolveImplementationNode(capabilityId, graph = loadProofGraph()) {
  const implementations = graph.implementations ?? {};
  if (implementations[capabilityId]) {
    return { id: capabilityId, ...implementations[capabilityId] };
  }
  for (const [id, impl] of Object.entries(implementations)) {
    if (id.includes(capabilityId) || impl.implementation_id === capabilityId) {
      return { id, ...impl };
    }
  }
  if (implementations[DEFAULT_IMPL]) {
    return { id: DEFAULT_IMPL, ...implementations[DEFAULT_IMPL] };
  }
  return { id: capabilityId, implementation_id: capabilityId, requirements: [] };
}

export function buildDependencyIndex(graph = loadProofGraph()) {
  /** @type {Record<string, string[]>} */
  const dependencies = {};

  const add = (from, to) => {
    if (!from || !to) return;
    if (!dependencies[from]) dependencies[from] = [];
    if (!dependencies[from].includes(to)) dependencies[from].push(to);
  };

  for (const [specId, spec] of Object.entries(graph.specifications ?? {})) {
    for (const implId of spec.implements ?? []) {
      add(implId, specId);
      if (spec.authorized_by) add(specId, spec.authorized_by);
    }
    for (const reqId of spec.requirements ?? []) {
      add(specId, reqId);
    }
  }

  for (const [implId, impl] of Object.entries(graph.implementations ?? {})) {
    for (const reqId of impl.requirements ?? []) {
      add(implId, reqId);
    }
  }

  for (const [reqId, req] of Object.entries(graph.requirements ?? {})) {
    for (const evid of req.evidence ?? []) {
      add(reqId, evid);
    }
    for (const specId of req.specifications ?? []) {
      add(reqId, specId);
    }
  }

  return dependencies;
}

export function transitiveClosure(rootId, graph = loadProofGraph()) {
  const deps = buildDependencyIndex(graph);
  const touched = new Set();
  const queue = [rootId];

  while (queue.length) {
    const id = queue.shift();
    if (!id || touched.has(id)) continue;
    touched.add(id);
    for (const d of deps[id] ?? []) {
      if (!touched.has(d)) queue.push(d);
    }
  }

  return [...touched];
}

export function nodeById(id, graph = loadProofGraph()) {
  return (
    graph.implementations?.[id] ??
    graph.specifications?.[id] ??
    graph.requirements?.[id] ??
    graph.authorities?.[id] ??
    graph.verifications?.[id] ??
    graph.provenance?.[id] ??
    null
  );
}
