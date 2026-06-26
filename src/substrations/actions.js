/** Shared timestamp helper for substrations */
export const now = () => Date.now();

/**
 * Execute a substration or behavior task against runtime services.
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {import('./types.js').SubstrationTask} task
 */
export async function executeTask(ctx, task) {
  return executeContinuityAction(ctx, task);
}

/**
 * Execute continuity task actions against runtime services.
 * @param {import('./types.js').SubstrationContext} ctx
 * @param {import('./types.js').SubstrationTask} task
 */
export async function executeContinuityAction(ctx, task) {
  const { action, params } = task;
  const base = ctx.baseLedger;

  switch (action) {
    case "recompute_global_root":
      if (base?.recomputeGlobalRoot) await base.recomputeGlobalRoot();
      break;
    case "run_reconciliation":
      if (base?.runReconciliationCycle) await base.runReconciliationCycle();
      break;
    case "repair_lineage_chain":
      if (base?.repairLineage) await base.repairLineage(params?.lineageId);
      break;
    case "collapse_subsystem":
      if (ctx.asOmega?.collapseSubsystem) await ctx.asOmega.collapseSubsystem(params?.subsystemId);
      break;
    case "evaluate_genesis_candidate":
      if (ctx.crk1?.evaluateGenesisCandidate) await ctx.crk1.evaluateGenesisCandidate(params);
      break;
    case "increase_stability_pressure":
    case "scan_fork_conditions":
    case "evaluate_epoch_transition":
    case "restore_lineage_sovereignty":
      ctx.ledger.log("CONTINUITY_ACTION", { action, params, timestamp: now() });
      break;
    default:
      break;
  }

  ctx.ledger.log("CONTINUITY_TASK_EXECUTED", {
    task,
    continuityStateSnapshot: ctx.continuityState,
    timestamp: now(),
  });
}
