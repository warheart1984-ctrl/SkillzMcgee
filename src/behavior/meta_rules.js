/**
 * Second-order meta-rules — govern evolution of behavior rules
 */

import { ORGANISM_INVARIANTS } from "../goals/invariants.js";

const I = ORGANISM_INVARIANTS;

/** @type {import('./meta_types.js').MetaBehaviorRule[]} */
export const metaBehaviorRules = [
  {
    id: "suspend_rules_causing_instability",
    when: (metrics) => metrics.ruleInstabilityScore > 0.7 && !!metrics.worstOffenderRuleId,
    then: (rules) => ({
      id: `meta:suspend:${Date.now()}`,
      description: "Suspend behavior rules correlated with instability spikes",
      action: "suspend_rule",
      targetRuleId: rules.find((r) => !r.suspended)?.id ?? "unknown",
      constraints: [I.CONTINUITY_FIRST, I.NO_SILENT_AUTHORITY_EXPANSION, I.CONSTITUTIONAL_BINDING],
      createdAt: Date.now(),
    }),
    mustSatisfy: [I.CONTINUITY_FIRST, I.NO_SILENT_AUTHORITY_EXPANSION],
  },

  {
    id: "amend_ineffective_rules",
    when: (metrics) => metrics.ruleEffectivenessScore < 0.3 && !!metrics.leastEffectiveRuleId,
    then: () => ({
      id: `meta:amend:${Date.now()}`,
      description: "Amend behavior rules that fail to achieve goals",
      action: "amend_rule",
      targetRuleId: "preemptive_stabilization_from_prediction",
      constraints: [I.CONTINUITY_FIRST, I.CONSTITUTIONAL_BINDING],
      createdAt: Date.now(),
    }),
    mustSatisfy: [I.CONTINUITY_FIRST, I.CONSTITUTIONAL_BINDING],
  },
];
