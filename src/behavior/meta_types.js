/**
 * @typedef {Object} MetaGoal
 * @property {string} id
 * @property {string} description
 * @property {'suspend_rule' | 'amend_rule' | 'promote_rule'} action
 * @property {string} targetRuleId
 * @property {string[]} constraints
 * @property {number} createdAt
 */

/**
 * @typedef {Object} MetaBehaviorRule
 * @property {string} id
 * @property {(metrics: BehaviorMetrics) => boolean} when
 * @property {(rules: import('./grammar.js').BehaviorRule[]) => MetaGoal} then
 * @property {string[]} mustSatisfy
 */

/**
 * @typedef {Object} BehaviorMetrics
 * @property {number} ruleInstabilityScore
 * @property {string} [worstOffenderRuleId]
 * @property {number} ruleEffectivenessScore
 * @property {string} [leastEffectiveRuleId]
 * @property {Record<string, number>} ruleFireCounts
 */

export {};
