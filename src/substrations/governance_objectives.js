/**
 * Re-export WOLF-1 governance objectives from canonical module.
 */
export {
  GOVERNANCE_OBJECTIVES,
  GOVERNANCE_OBJECTIVE_IDS,
  GOVERNANCE_OBJECTIVES_LIST,
  GOVERNANCE_OBJECTIVES_BY_ID,
  GOV,
  GOV as GOVERNANCE_OBJECTIVE_KEYS,
  WOLF1_INVARIANT_TO_OBJECTIVE,
  INVARIANT_TO_OBJECTIVE,
  CLUSTER_GOVERNANCE_OBJECTIVE,
  isValidGovernanceObjective,
  getGovernanceObjective,
  printObjectivesCli,
} from "../governance/objectives.js";
