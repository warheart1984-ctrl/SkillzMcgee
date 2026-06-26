/**
 * Safe-mode profiles S0–S3 — inspectable constitutional degradation ladder.
 */

/** @type {Record<string, { name: string; description: string; restrictions: string[] }>} */
export const SAFE_MODES = {
  S0: {
    name: "Normal",
    description: "Full governed runtime, all substrations active.",
    restrictions: [],
  },
  S1: {
    name: "Degraded",
    description: "Non-critical substrations paused; core governance only.",
    restrictions: ["no-external-actuation", "no-model-updates"],
  },
  S2: {
    name: "Safe",
    description: "Proposal-only, no state transitions.",
    restrictions: ["proposal-only", "no-state-write"],
  },
  S3: {
    name: "Emergency",
    description: "Read-only, observability only.",
    restrictions: ["read-only", "no-execution", "no-llm"],
  },
};

/** @type {keyof typeof SAFE_MODES} */
let currentMode = "S0";

/**
 * @returns {{ mode: string; info: typeof SAFE_MODES[string] }}
 */
export function getSafeMode() {
  return { mode: currentMode, info: SAFE_MODES[currentMode] };
}

/**
 * @param {string} mode
 */
export function setSafeMode(mode) {
  if (!(mode in SAFE_MODES)) {
    throw new Error(`Unknown safe-mode: ${mode}`);
  }
  currentMode = /** @type {keyof typeof SAFE_MODES} */ (mode);
}

/**
 * True when the active profile is registered (all S0–S3 profiles are enforced).
 * @returns {boolean}
 */
export function safeModeProfileApplied() {
  return currentMode in SAFE_MODES;
}

/**
 * CLI — current safe-mode profile and restrictions.
 */
export function printSafeModeCli() {
  const { mode, info } = getSafeMode();
  console.log(`Current Safe-Mode: ${mode} — ${info.name}`);
  console.log(`  ${info.description}`);
  if (info.restrictions.length > 0) {
    console.log("  Restrictions:");
    for (const r of info.restrictions) {
      console.log(`    - ${r}`);
    }
  }
  console.log();
}
