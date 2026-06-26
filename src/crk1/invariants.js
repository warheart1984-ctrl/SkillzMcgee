/**
 * CRK-1 constitutional firewall — enforce organism invariants on intents and actions.
 */

import { ORGANISM_INVARIANTS, isValidInvariant } from "../goals/invariants.js";

const AUTHORITY_EXPANDING_ACTIONS = new Set([
  "harmonize_rules",
  "neutralize_pattern",
  "collapse_subsystem",
  "evaluate_genesis_candidate",
  "evaluate_epoch_transition",
]);

const SOVEREIGNTY_SENSITIVE_ACTIONS = new Set([
  "collapse_subsystem",
  "restore_lineage_sovereignty",
  "rebalance_lineages",
]);

const IRREVERSIBLE_WITHOUT_FLAG = new Set(["collapse_subsystem"]);

/**
 * @param {import('../goals/types.js').Goal} goal
 * @param {string[]} [mustSatisfy]
 */
export function checkIntentAgainstInvariants(goal, mustSatisfy = []) {
  if (!goal?.id || !goal.domain || !goal.description) {
    return { allowed: false, reason: "Malformed goal" };
  }

  const required = new Set([...(goal.constraints ?? []), ...mustSatisfy]);
  for (const inv of required) {
    if (!isValidInvariant(inv)) {
      return { allowed: false, reason: `Unknown invariant: ${inv}` };
    }
  }

  if (!required.has(ORGANISM_INVARIANTS.CONSTITUTIONAL_BINDING)) {
    return { allowed: false, reason: "Missing CONSTITUTIONAL_BINDING" };
  }

  if (goal.domain === "evolution" && !required.has(ORGANISM_INVARIANTS.NO_SILENT_AUTHORITY_EXPANSION)) {
    return { allowed: false, reason: "Evolution goals require NO_SILENT_AUTHORITY_EXPANSION" };
  }

  return { allowed: true };
}

/**
 * @param {import('../substrations/types.js').SubstrationTask} task
 * @param {string[]} mustSatisfy
 * @param {import('../substrations/types.js').SubstrationContext} [ctx]
 */
export function checkActionAgainstInvariants(task, mustSatisfy, ctx = {}) {
  const required = new Set(mustSatisfy);

  if (required.has(ORGANISM_INVARIANTS.CONTINUITY_FIRST)) {
    const state = ctx.continuityState ?? {};
    if (task.action === "collapse_subsystem" && (state.conflicts?.length ?? 0) === 0 && state.globalRootValid) {
      return { allowed: false, reason: "Collapse blocked: continuity is healthy" };
    }
  }

  if (required.has(ORGANISM_INVARIANTS.NO_SILENT_AUTHORITY_EXPANSION)) {
    if (AUTHORITY_EXPANDING_ACTIONS.has(task.action) && task.params?.authorityExpansion) {
      return { allowed: false, reason: "Silent authority expansion blocked" };
    }
  }

  if (required.has(ORGANISM_INVARIANTS.PRESERVE_LINEAGE_SOVEREIGNTY)) {
    if (SOVEREIGNTY_SENSITIVE_ACTIONS.has(task.action) && !task.params?.lineageId && !task.params?.reversible) {
      if (task.action === "collapse_subsystem" && !task.params?.sovereigntyAck) {
        return { allowed: false, reason: "Sovereignty acknowledgment required" };
      }
    }
  }

  if (required.has(ORGANISM_INVARIANTS.BIDIRECTIONAL_COHERENCE)) {
    if (IRREVERSIBLE_WITHOUT_FLAG.has(task.action) && task.params?.reversible !== true) {
      return { allowed: false, reason: "Action must be reversible" };
    }
  }

  if (required.has(ORGANISM_INVARIANTS.NO_UNLOGGED_MUTATION)) {
    if (!ctx.ledger?.log) {
      return { allowed: false, reason: "No cosmic ledger — mutation would be unlogged" };
    }
  }

  return { allowed: true };
}

/**
 * Full six-invariant check for any action.
 */
export function checkActionFull(task, ctx) {
  return checkActionAgainstInvariants(task, Object.values(ORGANISM_INVARIANTS), ctx);
}
