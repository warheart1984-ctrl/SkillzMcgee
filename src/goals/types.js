/**
 * @typedef {'continuity' | 'stability' | 'evolution' | 'governance' | 'sovereignty'} GoalDomain
 */

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} GoalPriority
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {GoalDomain} domain
 * @property {string} description
 * @property {GoalPriority} priority
 * @property {string[]} constraints
 * @property {number} createdAt
 * @property {string} [sourceRuleId]
 */

/**
 * @typedef {Object} GoalPlan
 * @property {string} goalId
 * @property {import('../substrations/types.js').SubstrationTask[]} tasks
 */

export {};
