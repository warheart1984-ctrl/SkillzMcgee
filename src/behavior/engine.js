/**
 * Behavior engine — law-bound goal/decision layer
 */

import { proposeGoal } from "../goals/engine.js";
import { executeTask } from "../substrations/actions.js";

/**
 * @param {import('../substrations/types.js').SubstrationContext} ctx
 * @param {any} crk1
 * @param {import('./grammar.js').BehaviorRule[]} rules
 * @returns {Promise<{ goals: import('../goals/types.js').Goal[]; executed: number; blocked: number }>}
 */
export async function behaviorTick(ctx, crk1, rules) {
  const goals = [];
  let executed = 0;
  let blocked = 0;

  for (const rule of rules) {
    if (rule.suspended) continue;
    if (!rule.when(ctx)) continue;

    const goal = rule.then(ctx);
    goal.sourceRuleId = rule.id;
    goals.push(goal);

    ctx.ledger.log("BEHAVIOR_GOAL_PROPOSED", { ruleId: rule.id, goal });

    const plan = await proposeGoal(crk1, goal, rule.mustSatisfy, ctx);
    if (!plan) {
      blocked += 1;
      ctx.ledger.log("BEHAVIOR_GOAL_VETOED", { ruleId: rule.id, goalId: goal.id });
      continue;
    }

    for (const task of plan.tasks) {
      let allowed = true;
      if (crk1.checkActionAgainstInvariants) {
        const check = await crk1.checkActionAgainstInvariants(task, rule.mustSatisfy, ctx);
        allowed = check === true;
        if (!allowed) {
          blocked += 1;
          ctx.ledger.log("BEHAVIOR_TASK_BLOCKED", {
            ruleId: rule.id,
            task,
            reason: check?.reason ?? "invariant_violation",
          });
          continue;
        }
      }

      await executeTask(ctx, task);
      executed += 1;
      ctx.ledger.log("BEHAVIOR_TASK_EXECUTED", {
        ruleId: rule.id,
        goalId: goal.id,
        task,
        timestamp: Date.now(),
      });
    }
  }

  return { goals, executed, blocked };
}
