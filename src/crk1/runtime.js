/**
 * CRK-1 runtime — constitutional operations for federation substrations
 */

import { computeGlobalRoot, updateNodeRoot } from "../federation/frs_continuity/continuity.js";
import {
  detectConflicts,
  proposeReconciliation,
  applyReconciliation,
  validateReconciliationPlan,
} from "../federation/frs_reconcile/reconcile.js";
import { proposeGenesis } from "../federation/frs_genesis/genesis.js";
import { foldSingularity } from "../singularity/absoluteSingularity.js";
import {
  checkIntentAgainstInvariants,
  checkActionAgainstInvariants as invariantCheck,
  checkActionFull,
} from "./invariants.js";

/**
 * @param {object} options
 * @param {any} options.baseLedger
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} options.cosmicLedger
 * @param {() => any} options.getContinuity
 * @param {(state: any) => void} options.setContinuity
 * @param {string} [options.nodeId]
 */
export function createCrk1Runtime({ baseLedger, cosmicLedger, getContinuity, setContinuity, nodeId = "local" }) {
  return {
  async recomputeGlobalRoot() {
    const continuity = getContinuity();
    if (!continuity) return null;
    const globalRoot = computeGlobalRoot(continuity);
    const next = { ...continuity, globalRoot };
    setContinuity(next);
    cosmicLedger.log("RECOMPUTE_GLOBAL_ROOT", { globalRoot, timestamp: Date.now() });
    return globalRoot;
  },

  async runReconciliationCycle() {
    const continuity = getContinuity();
    if (!continuity) return [];
    const conflicts = detectConflicts(continuity);
    const results = [];
    for (const conflict of conflicts) {
      const plan = proposeReconciliation(conflict);
      if (!validateReconciliationPlan(plan)) {
        cosmicLedger.log("RECONCILIATION_VETOED", { conflict, plan });
        continue;
      }
      const final = applyReconciliation(continuity, plan);
      cosmicLedger.log("RECONCILIATION_APPLIED", { conflict, plan, final });
      results.push(final);
    }
    return results;
  },

  async repairLineage(lineageId) {
    const entries = baseLedger?.entries ?? [];
    const sliceEntries = entries.filter(
      (e) => e.lineageId === lineageId || e.output?.lineageId === lineageId,
    );
    const fold = foldSingularity(sliceEntries.length ? sliceEntries : entries);
    cosmicLedger.log("REPAIR_LINEAGE", {
      lineageId,
      repairedRoot: fold.merkle?.globalRoot,
      receiptCount: sliceEntries.length,
      timestamp: Date.now(),
    });
    return { lineageId, merkleRoot: fold.merkle?.globalRoot };
  },

  async evaluateGenesisCandidate(params = {}) {
    const continuity = getContinuity();
    const drift = params.drift ?? continuity?.drift ?? 0;
    const instabilityTrend = params.instabilityTrend ?? "stable";
    const threshold = params.driftThreshold ?? 0.5;

    const candidate = instabilityTrend === "rising" && drift > threshold;
    if (!candidate) {
      return { candidate: false, reason: "Thresholds not met" };
    }

    let nodes = (continuity?.nodeRoots ?? []).map((r) => r.nodeId);
    const preStateFingerprints = {};
    for (const root of continuity?.nodeRoots ?? []) {
      preStateFingerprints[root.nodeId] = root.globalMerkleRoot;
    }
    if (nodes.length === 0) nodes = [nodeId];

    const event = proposeGenesis(nodes, nodeId, (continuity?.epoch ?? 0) + 1, preStateFingerprints);
    cosmicLedger.log("GENESIS_CANDIDATE_NEED", { event, drift, instabilityTrend });
    return { candidate: true, event };
  },

  async checkIntent(goal, mustSatisfy = []) {
    const result = checkIntentAgainstInvariants(goal, mustSatisfy);
    if (!result.allowed) {
      cosmicLedger.log("CRK1_INTENT_VETOED", { goal, reason: result.reason });
    }
    return result.allowed;
  },

  async checkAction(task, ctx = {}) {
    const result = checkActionFull(task, { ...ctx, ledger: cosmicLedger });
    return result.allowed;
  },

  async checkActionAgainstInvariants(task, mustSatisfy, ctx = {}) {
    const result = invariantCheck(task, mustSatisfy, { ...ctx, ledger: cosmicLedger });
    return result.allowed ? true : result;
  },

  async checkMetaIntent(metaGoal, mustSatisfy = []) {
    const pseudoGoal = {
      id: metaGoal.id,
      domain: "governance",
      description: metaGoal.description,
      priority: "high",
      constraints: metaGoal.constraints ?? [],
      createdAt: metaGoal.createdAt,
    };
    const result = checkIntentAgainstInvariants(pseudoGoal, mustSatisfy);
    if (!result.allowed) {
      cosmicLedger.log("CRK1_META_INTENT_VETOED", { metaGoal, reason: result.reason });
    }
    return result;
  },

  async proposeRuleAmendment(rule, metaGoal) {
    cosmicLedger.log("CRK1_RULE_AMENDMENT", { ruleId: rule.id, metaGoal });
    return {
      ...rule,
      amendedAt: Date.now(),
      amendmentReason: metaGoal.description,
    };
  },
  };
}
