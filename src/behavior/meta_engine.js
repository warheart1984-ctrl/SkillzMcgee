/**
 * Meta-behavior engine — constitutional governance of behavior rules
 */

import { metaBehaviorRules } from "./meta_rules.js";
import { checkIntentAgainstInvariants } from "../crk1/invariants.js";

/**
 * @param {any[]} cosmicStream
 * @returns {import('./meta_types.js').BehaviorMetrics}
 */
export function computeBehaviorMetrics(cosmicStream) {
  /** @type {Record<string, number>} */
  const ruleFireCounts = {};
  let instabilityAfterBehavior = 0;
  let behaviorFires = 0;
  let goalsVetoed = 0;

  for (const entry of cosmicStream ?? []) {
    if (entry.type === "BEHAVIOR_TASK_EXECUTED") {
      const ruleId = entry.payload?.ruleId;
      if (ruleId) {
        ruleFireCounts[ruleId] = (ruleFireCounts[ruleId] ?? 0) + 1;
        behaviorFires += 1;
      }
    }
    if (entry.type === "BEHAVIOR_GOAL_VETOED") goalsVetoed += 1;
    if (entry.type === "META_CONTINUITY_TICK") {
      const health = entry.payload?.health;
      if (health?.status === "critical" || health?.status === "degraded") {
        instabilityAfterBehavior += 1;
      }
    }
  }

  const ruleIds = Object.keys(ruleFireCounts);
  const worstOffenderRuleId = ruleIds.sort((a, b) => ruleFireCounts[b] - ruleFireCounts[a])[0];
  const leastEffectiveRuleId = ruleIds.sort((a, b) => ruleFireCounts[a] - ruleFireCounts[b])[0];

  const ruleInstabilityScore =
    behaviorFires === 0 ? 0 : Math.min(1, instabilityAfterBehavior / Math.max(1, behaviorFires));
  const ruleEffectivenessScore =
    behaviorFires === 0 ? 1 : Math.max(0, 1 - goalsVetoed / Math.max(1, behaviorFires));

  return {
    ruleInstabilityScore,
    worstOffenderRuleId,
    ruleEffectivenessScore,
    leastEffectiveRuleId,
    ruleFireCounts,
  };
}

/**
 * @param {import('./meta_types.js').MetaGoal} metaGoal
 * @param {import('./grammar.js').BehaviorRule[]} behaviorRules
 * @param {any} crk1
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 */
export async function applyMetaGoal(metaGoal, behaviorRules, crk1, ledger) {
  const ruleIndex = behaviorRules.findIndex((r) => r.id === metaGoal.targetRuleId);
  if (ruleIndex === -1) return false;

  switch (metaGoal.action) {
    case "suspend_rule":
      behaviorRules[ruleIndex].suspended = true;
      break;
    case "amend_rule":
      if (crk1.proposeRuleAmendment) {
        behaviorRules[ruleIndex] = await crk1.proposeRuleAmendment(behaviorRules[ruleIndex], metaGoal);
      }
      break;
    case "promote_rule":
      behaviorRules[ruleIndex].priorityBoost = true;
      break;
    default:
      return false;
  }

  ledger.log("META_BEHAVIOR_CHANGE", {
    metaGoal,
    targetRuleId: metaGoal.targetRuleId,
    timestamp: Date.now(),
  });
  return true;
}

/**
 * @param {any} crk1
 * @param {import('./grammar.js').BehaviorRule[]} behaviorRules
 * @param {any[]} cosmicStream
 * @param {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 */
export async function metaBehaviorTick(crk1, behaviorRules, cosmicStream, ledger) {
  const metrics = computeBehaviorMetrics(cosmicStream);
  let applied = 0;

  for (const rule of metaBehaviorRules) {
    if (!rule.when(metrics)) continue;

    const metaGoal = rule.then(behaviorRules);
    metaGoal.targetRuleId = metrics.worstOffenderRuleId ?? metrics.leastEffectiveRuleId ?? metaGoal.targetRuleId;

    const check = crk1.checkMetaIntent
      ? await crk1.checkMetaIntent(metaGoal, rule.mustSatisfy)
      : checkIntentAgainstInvariants(
          { ...metaGoal, domain: "governance", priority: "high", constraints: metaGoal.constraints },
          rule.mustSatisfy,
        );

    if (!check?.allowed && check !== true) {
      ledger.log("META_BEHAVIOR_VETOED", { metaGoal, reason: check?.reason });
      continue;
    }

    const ok = await applyMetaGoal(metaGoal, behaviorRules, crk1, ledger);
    if (ok) applied += 1;
  }

  return { metrics, applied };
}
