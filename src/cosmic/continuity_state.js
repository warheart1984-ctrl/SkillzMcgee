/**
 * Real continuity state view for substration engine
 */

import { detectConflicts } from "../federation/frs_reconcile/reconcile.js";
import { verifyGlobalContinuity } from "../federation/frs_continuity/continuity.js";

function clusterConflicts(conflicts) {
  const clusters = [];
  const merkle = conflicts.filter((c) => c.type === "merkle_mismatch");
  if (merkle.length) clusters.push({ id: "merkle_cluster", count: merkle.length, type: "merkle_mismatch" });
  const lineage = conflicts.filter((c) => c.type === "lineage_divergence");
  if (lineage.length) clusters.push({ id: "lineage_cluster", count: lineage.length, type: "lineage_divergence" });
  return clusters;
}

function computeNodeCongestion(continuityState) {
  const congestion = {};
  for (const root of continuityState.nodeRoots ?? []) {
    congestion[root.nodeId] = Math.min(1, (root.height ?? 0) / 1000);
  }
  return congestion;
}

function computeDriftMetrics(continuityState) {
  const heights = (continuityState.nodeRoots ?? []).map((r) => r.height ?? 0);
  if (heights.length < 2) return 0;
  const max = Math.max(...heights);
  const min = Math.min(...heights);
  return max === 0 ? 0 : (max - min) / max;
}

function computeTimeSkew(continuityState) {
  const skew = {};
  const roots = continuityState.nodeRoots ?? [];
  if (roots.length === 0) return skew;
  const avgTs = roots.reduce((s, r) => s + (r.timestamp ?? 0), 0) / roots.length;
  for (const r of roots) {
    skew[r.nodeId] = (r.timestamp ?? 0) - avgTs;
  }
  return skew;
}

function summarizeHealth(conflicts, drift) {
  return {
    conflictCount: conflicts.length,
    drift,
    status: conflicts.length === 0 && drift < 0.3 ? "healthy" : conflicts.length > 2 ? "critical" : "degraded",
  };
}

function listLineages(continuityState) {
  return Object.entries(continuityState.federatedLineages ?? {}).map(([id, entry]) => ({
    id,
    originNode: entry.originNode,
    currentNode: entry.currentNode,
    migrations: entry.migrationHistory?.length ?? 0,
  }));
}

function computeInstabilityTrend(conflicts) {
  if (conflicts.length >= 3) return "rising";
  if (conflicts.length > 0) return "unstable";
  return "stable";
}

/**
 * Build enriched continuity state for substrations.
 * @param {any} baseLedger - receipt entries array or ledger object with entries
 * @param {any} continuityState - GlobalContinuityState from frs_continuity
 */
export function getContinuityState(baseLedger, continuityState) {
  const entries = baseLedger?.entries ?? baseLedger ?? [];
  const conflicts = detectConflicts(continuityState);
  const drift = computeDriftMetrics(continuityState);
  const globalRootValid = verifyGlobalContinuity(continuityState);
  const healthSummary = summarizeHealth(conflicts, drift);

  return {
    ...continuityState,
    conflicts,
    globalRootValid,
    drift,
    timeSkew: computeTimeSkew(continuityState),
    healthSummary,
    conflictClusters: clusterConflicts(conflicts),
    nodeCongestion: computeNodeCongestion(continuityState),
    mergeCandidates: [],
    collapseCandidates: drift > 0.9 ? [{ id: "high_drift_subsystem" }] : [],
    lineages: listLineages(continuityState),
    entanglementPairs: [],
    influenceLinks: [],
    instabilityTrend: computeInstabilityTrend(conflicts),
    harmfulPatterns:
      conflicts.length >= 2
        ? [{ id: "repeated_conflicts", count: conflicts.length }]
        : [],
    trend: computeInstabilityTrend(conflicts),
    ledgerHeight: entries.length,
    sovereigntyViolations: [],
    driftSignals: drift > 0.5 ? [{ node: "federation", drift }] : [],
    pendingDecisions: [],
    epochSignals: [],
    temporalConflicts: [],
    brokenLineages: detectBrokenLineages(continuityState),
    predictedInstability: computePredictedInstability(conflicts, drift),
    reconciliationExhausted: conflicts.length > 0 && drift > 0.6,
    collapseExhausted: drift > 0.9,
  };
}

function detectBrokenLineages(continuityState) {
  const broken = [];
  for (const [lineageId, entry] of Object.entries(continuityState.federatedLineages ?? {})) {
    const migrations = entry.migrationHistory ?? [];
    for (let i = 1; i < migrations.length; i++) {
      if (migrations[i].timestamp < migrations[i - 1].timestamp) {
        broken.push({ id: lineageId, reason: "timestamp_inversion" });
        break;
      }
    }
  }
  return broken;
}

function computePredictedInstability(conflicts, drift) {
  const level = Math.min(1, conflicts.length * 0.2 + drift * 0.5);
  return { level, horizon: "near_term" };
}
