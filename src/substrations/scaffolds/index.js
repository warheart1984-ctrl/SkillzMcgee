/**
 * WOLF-1 foundational substration scaffolds — one per governance objective axis.
 */

import { IDENTITY_GUARD } from "./identity_guard.substration.js";
import { CAPABILITY_GUARD } from "./capability_guard.substration.js";
import { ACTUATION_GUARD } from "./actuation_guard.substration.js";
import { TELEMETRY_GUARD } from "./telemetry_guard.substration.js";
import { PROPOSAL_GUARD } from "./proposal_guard.substration.js";
import { RECEIPT_ENFORCER } from "./receipt_enforcer.substration.js";
import { MODEL_AUDIT_GUARD } from "./model_audit_guard.substration.js";
import { SOLAR_POWER_GUARD } from "./solar_power_guard.substration.js";
import { NUCLEAR_FAILSAFE_GUARD } from "./nuclear_failsafe_guard.substration.js";
import { THERMO_BOUNDS_GUARD } from "./thermo_bounds_guard.substration.js";
import { FAIL_CLOSED_GUARD } from "./fail_closed_guard.substration.js";
import { SAFE_MODE_GUARD } from "./safe_mode_guard.substration.js";

/** @type {import('../contract_types.js').SubstrationContract[]} */
export const WOLF1_SCAFFOLD_CONTRACTS = [
  IDENTITY_GUARD,
  CAPABILITY_GUARD,
  ACTUATION_GUARD,
  TELEMETRY_GUARD,
  PROPOSAL_GUARD,
  RECEIPT_ENFORCER,
  MODEL_AUDIT_GUARD,
  SOLAR_POWER_GUARD,
  NUCLEAR_FAILSAFE_GUARD,
  THERMO_BOUNDS_GUARD,
  FAIL_CLOSED_GUARD,
  SAFE_MODE_GUARD,
];

export {
  IDENTITY_GUARD,
  CAPABILITY_GUARD,
  ACTUATION_GUARD,
  TELEMETRY_GUARD,
  PROPOSAL_GUARD,
  RECEIPT_ENFORCER,
  MODEL_AUDIT_GUARD,
  SOLAR_POWER_GUARD,
  NUCLEAR_FAILSAFE_GUARD,
  THERMO_BOUNDS_GUARD,
  FAIL_CLOSED_GUARD,
  SAFE_MODE_GUARD,
};
