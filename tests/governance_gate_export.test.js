import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  classifyDependencies,
  exportSubstrationRegistry,
  ALL_SUBSTRATION_CONTRACTS,
  SUBSTRATIONS_BY_ID,
} from "../src/substrations/registry.js";
import { GOVERNANCE_OBJECTIVE_IDS } from "../src/governance/objectives.js";

describe("Python governance gate export", () => {
  it("exports full contracts with traceability and classified deps", () => {
    const { byObjective, byId } = exportSubstrationRegistry();
    assert.equal(Object.keys(byId).length, 42);

    for (const oid of GOVERNANCE_OBJECTIVE_IDS) {
      const subs = byObjective[oid] ?? [];
      assert.ok(subs.length >= 1, `no export for ${oid}`);
      for (const s of subs) {
        const links = s.governance.traceabilityLinks;
        assert.ok(links.ctsId, s.runtime.id);
        assert.ok(links.adrId, s.runtime.id);
        assert.ok(links.requirementId, s.runtime.id);
        assert.ok(Array.isArray(s.runtime.optionalDependencies));
      }
    }
  });

  it("classifyDependencies splits substration vs external deps", () => {
    const ids = new Set(Object.keys(SUBSTRATIONS_BY_ID));
    const sample = ALL_SUBSTRATION_CONTRACTS.find(
      (c) => c.runtime.dependencies.includes("continuity_needs_engine"),
    );
    assert.ok(sample);
    const { dependencies, optionalDependencies } = classifyDependencies(
      sample.runtime.dependencies,
      ids,
    );
    assert.ok(dependencies.includes("continuity_needs_engine"));
    assert.ok(optionalDependencies.length >= 0);
    for (const d of dependencies) {
      assert.ok(ids.has(d));
    }
    for (const d of optionalDependencies) {
      assert.ok(!ids.has(d));
    }
  });

  it("substration dependency graph has no cycles", () => {
    const graph = {};
    const ids = new Set(Object.keys(SUBSTRATIONS_BY_ID));
    for (const [sid, c] of Object.entries(SUBSTRATIONS_BY_ID)) {
      graph[sid] = c.runtime.dependencies.filter((d) => ids.has(d));
    }

    function dfs(node, path) {
      assert.ok(!path.includes(node), `cycle: ${[...path, node].join(" -> ")}`);
      for (const dep of graph[node] ?? []) {
        dfs(dep, [...path, node]);
      }
    }

    for (const sid of Object.keys(graph)) {
      dfs(sid, []);
    }
  });
});
