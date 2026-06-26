/**
 * WOLF-1 invariant evaluator — line-for-line ground runtime mirror of orbital invariants.
 */

/**
 * @typedef {import('../governance/objectives.js').GovernanceObjectiveId} GovernanceObjectiveId
 */

/** Canonical WOLF-1 invariant codes (underscore form). */
export const WOLF1_INVARIANT_CODES = {
  ID_ROLE_BOUND: "INV_ID_ROLE_BOUND",
  ID_CAPABILITY_SCOPE: "INV_ID_CAPABILITY_SCOPE",
  HW_NO_DIRECT_ACTUATION: "INV_HW_NO_DIRECT_ACTUATION",
  DATA_TELEMETRY_READ_ONLY: "INV_DATA_TELEMETRY_READ_ONLY",
  PLAN_PROPOSAL_ONLY: "INV_PLAN_PROPOSAL_ONLY",
  RUN_RECEIPT_REQUIRED: "INV_RUN_RECEIPT_REQUIRED",
  MODEL_CHANGE_AUDITED: "INV_MODEL_CHANGE_AUDITED",
  PWR_SOLAR_PRIMARY: "INV_PWR_SOLAR_PRIMARY",
  PWR_NUCLEAR_FAILSAFE_MIN: "INV_PWR_NUCLEAR_FAILSAFE_MIN",
  PWR_THERMO_BOUNDS: "INV_PWR_THERMO_BOUNDS",
  GOV_FAIL_CLOSED: "INV_GOV_FAIL_CLOSED",
  GOV_SAFE_MODE_PROFILE: "INV_GOV_SAFE_MODE_PROFILE",
};

/**
 * @typedef {Object} InvariantContext
 * @property {GovernanceObjectiveId} objectiveId
 * @property {import('../substrations/contract_types.js').SubstrationContract} contract
 * @property {object} runContext
 */

/**
 * @typedef {Object} InvariantResult
 * @property {boolean} ok
 * @property {string} code
 * @property {string} message
 */

/**
 * Normalize role to object with allowedScopes when given a plain string.
 * @param {unknown} role
 * @returns {{ allowedScopes: string[] } | null}
 */
function normalizeRole(role) {
  if (!role) return null;
  if (typeof role === "object" && role !== null && Array.isArray(role.allowedScopes)) {
    return role;
  }
  if (typeof role === "string") {
    return { allowedScopes: [role, "*"] };
  }
  return null;
}

/**
 * @param {import('../substrations/types.js').SubstrationContext} ctx
 * @param {object} [parts]
 * @returns {object}
 */
export function buildRunContext(ctx, parts = {}) {
  const output = parts.output ?? ctx.output ?? ctx.llmOutput ?? null;
  const role = normalizeRole(parts.role ?? ctx.role ?? ctx.runContext?.role);
  const actionScope =
    parts.actionScope ??
    ctx.actionScope ??
    parts.task?.actionScope ??
    parts.task?.action ??
    ctx.runContext?.actionScope;

  return {
    identity: parts.identity ?? ctx.identity ?? ctx.runContext?.identity,
    role,
    actionScope,
    receipt: parts.receipt ?? parts.evidence ?? ctx.receipt,
    task: parts.task ?? null,
    observation: parts.observation ?? null,
    need: parts.need ?? null,
    evidence: parts.evidence ?? null,
    output,
    containsCommands:
      parts.containsCommands ??
      output?.containsCommands ??
      (typeof output === "object" && output !== null && "commands" in output),
    safeMode: parts.safeMode ?? ctx.safeMode ?? false,
    safeModeProfileApplied:
      parts.safeModeProfileApplied ?? ctx.safeModeProfileApplied ?? true,
    powerState: parts.powerState ?? ctx.powerState,
    solarThresholdMet: parts.solarThresholdMet ?? ctx.solarThresholdMet ?? true,
    governanceFloorMet: parts.governanceFloorMet ?? ctx.governanceFloorMet ?? true,
    thermalSpine: parts.thermalSpine ?? ctx.thermalSpine,
    thermoInBounds: parts.thermoInBounds ?? ctx.thermoInBounds ?? true,
    telemetryMutationAttempt: parts.telemetryMutationAttempt ?? ctx.telemetryMutationAttempt ?? false,
    modelChangeUnsigned: parts.modelChangeUnsigned ?? ctx.modelChangeUnsigned ?? false,
    invariantEngineFailed:
      parts.invariantEngineFailed ??
      parts.invariantEvaluationFailed ??
      ctx.invariantEngineFailed ??
      false,
    directActuation: parts.directActuation ?? ctx.directActuation ?? false,
    continuityState: ctx.continuityState,
  };
}

/**
 * @param {InvariantContext} ctx
 * @returns {InvariantResult}
 */
export function evaluateInvariant(ctx) {
  const { objectiveId, runContext } = ctx;

  switch (objectiveId) {
    case "GOV.ID.ROLE_BOUND": {
      const ok = !!runContext.identity && !!runContext.role;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.ID_ROLE_BOUND,
        message: ok ? "Identity and role present." : "Missing identity or role.",
      };
    }

    case "GOV.ID.CAPABILITY_SCOPE": {
      const ok =
        !!runContext.role &&
        !!runContext.actionScope &&
        runContext.role.allowedScopes.includes(runContext.actionScope);
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.ID_CAPABILITY_SCOPE,
        message: ok ? "Action within capability scope." : "Action exceeds capability scope.",
      };
    }

    case "GOV.HW.NO_DIRECT_ACTUATION": {
      const ok =
        !runContext.directActuation && runContext.task?.action !== "direct_actuate";
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.HW_NO_DIRECT_ACTUATION,
        message: ok
          ? "No direct actuation from cognitive layer."
          : "Direct actuation attempted from cognitive layer.",
      };
    }

    case "GOV.DATA.TELEMETRY_READ_ONLY": {
      const ok = !runContext.telemetryMutationAttempt;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.DATA_TELEMETRY_READ_ONLY,
        message: ok ? "Telemetry read-only." : "Telemetry mutation attempted.",
      };
    }

    case "GOV.PLAN.PROPOSAL_ONLY": {
      const ok = !runContext.output?.containsCommands && !runContext.containsCommands;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.PLAN_PROPOSAL_ONLY,
        message: ok ? "LLM output is proposal-only." : "LLM output contains direct commands.",
      };
    }

    case "GOV.RUN.RECEIPT_REQUIRED": {
      const ok = !!runContext.receipt;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.RUN_RECEIPT_REQUIRED,
        message: ok ? "Receipt present." : "Missing receipt.",
      };
    }

    case "GOV.MODEL.CHANGE_AUDITED": {
      const ok = !runContext.modelChangeUnsigned;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.MODEL_CHANGE_AUDITED,
        message: ok ? "Model change audited." : "Unsigned or unlogged model change.",
      };
    }

    case "GOV.PWR.SOLAR_PRIMARY": {
      const ok = runContext.solarThresholdMet !== false;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.PWR_SOLAR_PRIMARY,
        message: ok ? "Solar threshold satisfied." : "Solar/storage minimum not met.",
      };
    }

    case "GOV.PWR.NUCLEAR_FAILSAFE_MIN": {
      const ok = runContext.governanceFloorMet !== false;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.PWR_NUCLEAR_FAILSAFE_MIN,
        message: ok ? "Governance floor maintained." : "Governance floor power reserve breached.",
      };
    }

    case "GOV.PWR.THERMO_BOUNDS": {
      const ok = runContext.thermoInBounds !== false;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.PWR_THERMO_BOUNDS,
        message: ok ? "Thermal bounds satisfied." : "Thermal spine out of bounds.",
      };
    }

    case "GOV.GOV.FAILED_INVARIANTS_FAIL_CLOSED": {
      const ok = !runContext.invariantEngineFailed;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.GOV_FAIL_CLOSED,
        message: ok
          ? "Invariant engine healthy."
          : "Invariant engine failure—must fail closed.",
      };
    }

    case "GOV.GOV.SAFE_MODE_PROFILE": {
      const ok = runContext.safeModeProfileApplied === true;
      return {
        ok,
        code: WOLF1_INVARIANT_CODES.GOV_SAFE_MODE_PROFILE,
        message: ok ? "Safe-mode profile enforced." : "Safe-mode profile not enforced.",
      };
    }

    default:
      return {
        ok: true,
        code: "INV_UNKNOWN",
        message: "No invariant bound for this objective.",
      };
  }
}
