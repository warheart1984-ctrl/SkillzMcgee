/**
 * Law-bound goal system — constitutional intents only.
 */

import { planTasksForGoal } from "./planner.js";
import { isValidInvariant } from "./invariants.js";

/**
 * @param {any} crk1
 * @param {import('./types.js').Goal} goal
 * @param {string[]} [mustSatisfy]
 * @param {import('../substrations/types.js').SubstrationContext} [ctx]
 * @returns {Promise<import('./types.js').GoalPlan | null>}
 */
export async function proposeGoal(crk1, goal, mustSatisfy = [], ctx = { continuityState: {} }) {
  if (!crk1?.checkIntent) return null;

  const allowed = await crk1.checkIntent(goal, mustSatisfy);
  if (!allowed) return null;

  const tasks = planTasksForGoal(goal, ctx);
  return { goalId: goal.id, tasks };
}

/**
 * Validate goal shape (no CRK-1 required).
 * @param {import('./types.js').Goal} goal
 */
export function validateGoalShape(goal) {
  if (!goal?.id || !goal.domain || !goal.description) return false;
  if (!Array.isArray(goal.constraints)) return false;
  return goal.constraints.every((c) => isValidInvariant(c));
}
