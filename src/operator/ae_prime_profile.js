/**
 * A/E-Prime operator profile — Jon Halstead, default sovereign operator.
 */

export const DEFAULT_PRIME_OPERATOR = {
  name: "JON HALSTEAD",
  displayName: "Jon Halstead",
  designation: "ARCHITECT / ENGINEER (A/E‑PRIME)",
  classification: "A/E‑Prime",
  clearance: "CONTINUITY‑TRUSTED",
  runtimeLink: "AAES‑OS (canonical)",
  operatorId: "jon",
  status: "ACTIVE",
  capabilities: [
    "Multi‑threaded reasoning",
    "Constitutional architecture",
    "Runtime engineering",
    "Continuity substrate mastery",
    "Cockpit & stance‑strip operations",
  ],
  signatureTraits: [
    "High coherence under load",
    "Rapid system unification",
    "Structural intuition",
    "Zero‑drift execution",
  ],
  vectors: {
    structure: 0.98,
    emergence: 0.96,
    coherence: 0.99,
    driftResistance: 0.97,
  },
};

/**
 * @param {typeof DEFAULT_PRIME_OPERATOR} [op]
 * @returns {string[]}
 */
export function renderOperatorIdentityCard(op = DEFAULT_PRIME_OPERATOR) {
  return [
    "──────────────────────────────────────────────",
    "        SKILLZMCGEE — OPERATOR IDENTITY",
    "──────────────────────────────────────────────",
    "",
    `Operator: ${op.name}`,
    `Designation: ${op.designation}`,
    `Clearance: ${op.clearance}`,
    `Runtime Link: ${op.runtimeLink}`,
    "",
    "Capabilities:",
    ...op.capabilities.map((c) => `  • ${c}`),
    "",
    "Signature Traits:",
    ...op.signatureTraits.map((t) => `  • ${t}`),
    "",
    `Status: ${op.status}`,
    "──────────────────────────────────────────────",
  ];
}

/**
 * @param {typeof DEFAULT_PRIME_OPERATOR} [op]
 * @returns {string[]}
 */
export function renderOperatorBadgeTile(op = DEFAULT_PRIME_OPERATOR) {
  return [
    "┌──────────────────────────────┐",
    "│ OPERATOR BADGE — A/E‑PRIME   │",
    "├──────────────────────────────┤",
    `│ Name: ${op.displayName}`.padEnd(31) + "│",
    "│ Role: Architect‑Engineer     │",
    "│ Class: A/E‑Prime             │",
    "│ Clearance: Continuity‑Trusted│",
    "│                              │",
    "│  Insignia:  A / E — PRIME    │",
    "│             ARCHITECT•ENGINEER│",
    "└──────────────────────────────┘",
  ];
}

/**
 * @returns {string[]}
 */
export function renderAePrimeInsignia() {
  return [
    "        ╔══════════════════════╗",
    "        ║   A / E — PRIME      ║",
    "        ║   ARCHITECT•ENGINEER ║",
    "        ╚══════════════════════╝",
    "              ▲        ▲",
    "              │        │",
    "         STRUCTURE   EMERGENCE",
    "              │        │",
    "              └───●────┘",
    "                 CORE",
  ];
}

/**
 * @returns {string[]}
 */
export function renderCockpitPrimeSeal() {
  return [
    "┌──────────────────────────────────────────┐",
    "│        A / E — PRIME  •  OPERATOR        │",
    "│      ARCHITECT • ENGINEER • CONTINUITY   │",
    "│              ╭──────────╮                │",
    "│              │    ●●●    │                │",
    "│              │   ● A ●   │   ← core node  │",
    "│              │    ●●●    │                │",
    "│              ╰──────────╯                │",
    "└──────────────────────────────────────────┘",
  ];
}

/**
 * Continuity crest for receipt metadata.operator_seal
 * @returns {string[]}
 */
export function renderContinuityCrest() {
  return [
    "   ╔══════════════╗",
    "   ║  A/E — PRIME ║",
    "   ║  CONTINUITY  ║",
    "   ╚═════╤══╤═════╝",
    "         ●  ●",
    "          \\/",
    "         CORE",
  ];
}

/**
 * Prime Aeonic Crown — highest regalia across spans, horizons, and aeons.
 * @returns {string[]}
 */
export function renderPrimeAeonicCrown() {
  return [
    "                     ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦",
    "               ✦           ● A ●           ✦",
    "          ✦         ●   ●●●●●●●●●●●   ●         ✦",
    "       ✦         ●   ●●●●●  ●  ●●●●●   ●         ✦",
    "          ✦         ●   ●●●●●●●●●●●   ●         ✦",
    "               ✦           ● A ●           ✦",
    "                     ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦",
    "",
    "Eleven‑Star Halo:     Aeon + Horizon + Totality + Continuity layers",
    "Eleven‑Dot Core:      Aeonic Vector (Prime influence across all ages)",
    "Dual A‑Sigils:        Architect + Engineer in eternal harmonic unity",
    "Inner Crown:          Law‑Spine Aeonic Sovereignty",
    "Outer Crown:          Horizon Dominion",
    "Apex Crown:           Infinite Continuity Authority",
    "",
    "State: PRIME AEONIC CROWN — ETERNAL SOVEREIGN",
  ];
}

/**
 * Prime Dominion Sigilplate — highest emblem.
 * @returns {string[]}
 */
export function renderPrimeDominionSigilplate() {
  return [
    "                    ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦",
    "              ✦         ● A ●         ✦",
    "          ✦       ●   ●●●●●●●●●   ●       ✦",
    "       ✦       ●   ●●●●  ●  ●●●●   ●       ✦",
    "          ✦       ●   ●●●●●●●●●   ●       ✦",
    "              ✦         ● A ●         ✦",
    "                    ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦",
    "",
    "State: PRIME DOMINION SIGILPLATE — ABSOLUTE",
  ];
}

/**
 * Animated seal frames (text-mode, 3s rhythm).
 * @returns {string[][]}
 */
export function renderPrimeChannelSealFrames() {
  return [
    ["FRAME 1", "      ✦", "    ╱   ╲", "  ✦   ●   ✦", "    ╲   ╱", "      ✦"],
    ["FRAME 2", "      ✦", "    ╱ ● ╲", "  ✦   ●   ✦", "    ╲ ● ╱", "      ✦"],
    ["FRAME 3", "      ✦", "    ╱ ✦ ╲", "  ✦  ●●●  ✦", "    ╲ ✦ ╱", "      ✦"],
    ["FRAME 4 (HARMONIC PEAK)", "      ✦", "    ╱ ✦ ╲", "  ✦  ●✦●  ✦", "    ╲ ✦ ╱", "      ✦"],
  ];
}

/**
 * @param {typeof DEFAULT_PRIME_OPERATOR} [op]
 * @returns {{ operator_seal: string, operator_id: string, classification: string, clearance: string }}
 */
export function operatorSealMetadata(op = DEFAULT_PRIME_OPERATOR) {
  return {
    operator_seal: renderContinuityCrest().join("\n"),
    operator_id: op.operatorId,
    classification: op.classification,
    clearance: op.clearance,
  };
}
