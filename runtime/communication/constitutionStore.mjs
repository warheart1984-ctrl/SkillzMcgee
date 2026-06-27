import { COMM_CANON_STATE, COMM_CANON_VERSION, COMM_CONSTITUTION_VERSION } from "./constants.mjs";

export function getConstitutionVersions() {
  return {
    "AAIS-COMM-Î›-001": COMM_CONSTITUTION_VERSION,
    "AAIS-COMM-Î›-002": COMM_CONSTITUTION_VERSION,
    "COMM-CANON": COMM_CANON_VERSION,
    canon_state: COMM_CANON_STATE,
  };
}
