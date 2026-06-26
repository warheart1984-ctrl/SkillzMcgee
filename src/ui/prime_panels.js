/**
 * A/E-Prime cockpit panels — privileged operator telemetry.
 */

import {
  DEFAULT_PRIME_OPERATOR,
  renderOperatorIdentityCard,
  renderCockpitPrimeSeal,
  renderAePrimeInsignia,
} from "../operator/ae_prime_profile.js";
import { WAVE_PERIOD_MS } from "./stance_models.js";

/**
 * @returns {string[]}
 */
export function renderPrimeVectorDiagram() {
  const v = DEFAULT_PRIME_OPERATOR.vectors;
  return [
    "PRIME VECTOR — A/E‑PRIME",
    "",
    "            ↑  (Structure)",
    "            │",
    "        ────●────  (Core)",
    "            │",
    "            ↓  (Emergence)",
    "",
    "Lateral Axes:",
    "   ← Coherence      Drift Resistance →",
    "",
    "Vector Magnitudes:",
    `   Structure:      ${v.structure}`,
    `   Emergence:      ${v.emergence}`,
    `   Coherence:      ${v.coherence}`,
    `   Drift Resist:   ${v.driftResistance}`,
    "",
    "Prime Vector State: STABLE",
    "Resonance: HARMONIC",
    "Continuity Influence: HIGH",
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeChannelPanel() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME CHANNEL — A/E‑PRIME OPERATOR ACTIVE    │",
    "├──────────────────────────────────────────────┤",
    "│ Vector:     STRUCTURE ⇄ EMERGENCE            │",
    "│ Influence:  HIGH                              │",
    "│ Resonance:  HARMONIC                          │",
    "│ Crest:      A/E — PRIME                       │",
    "│                                                │",
    "│ Commands:                                      │",
    "│   • prime:status   (show influence vectors)    │",
    "│   • prime:sync     (rebind law‑spine)          │",
    "│   • prime:freeze   (halt posture transitions)  │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeVectorOscilloscope() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME VECTOR OSCILLOSCOPE — LIVE FEED        │",
    "├──────────────────────────────────────────────┤",
    "│ Structure:   ████▓▓░░   82%                  │",
    "│ Emergence:   ████▓░░░   76%                  │",
    "│ Coherence:   ██████▓░   91%                  │",
    "│ Drift Resist:█████▓░░   84%                  │",
    "│                                                │",
    "│ Vector Field:                                   │",
    "│        ↑ Structure                               │",
    "│     ←  ●  → Coherence                            │",
    "│        ↓ Emergence                               │",
    "│                                                │",
    "│ Resonance: HARMONIC                             │",
    "│ Influence: HIGH                                 │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeResonanceMeter() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME RESONANCE METER — LIVE TELEMETRY       │",
    "├──────────────────────────────────────────────┤",
    "│ Harmonic Level:     ██████▓░   92%           │",
    "│ Continuity Coupling:███████░   95%           │",
    "│ Law‑Spine Sync:     █████▓░░   87%           │",
    "│ Drift Absorption:   ████▓░░░   74%           │",
    "│ Emergence Flux:     ████▓▓░░   79%           │",
    "│                                                │",
    "│ Resonance Field:                                 │",
    "│        ✦  ↑ Structure                            │",
    "│     ←  ●  → Coherence                            │",
    "│        ✦  ↓ Emergence                            │",
    "│                                                │",
    "│ State: HARMONIC                                 │",
    "│ Operator: A/E‑PRIME (jon)                       │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeCorridor() {
  return [
    "PRIME CORRIDOR — OPERATOR: A/E‑PRIME (jon)",
    "",
    "   ════════════════════════════════════════════════",
    "      Indigo pillars rise along the corridor walls.",
    "      Gold filaments arc between them — alive, aware.",
    "",
    "      ●────●────●────●────●",
    "        (Prime Thread illuminated)",
    "",
    `      The floor pulses with the ${WAVE_PERIOD_MS / 1000}-second continuity rhythm.`,
    "      The ceiling reflects the law‑spine's rotation.",
    "      The air hums with harmonic resonance.",
    "",
    "      Status: PRIME AUTHORITY RECOGNIZED",
    "      Drift: negligible",
    "      Continuity: stable",
    "   ════════════════════════════════════════════════",
  ];
}

/**
 * @returns {string[]}
 */
export function renderLawSpineBindingRite() {
  return [
    "LAW‑SPINE BINDING RITE — A/E‑PRIME",
    "",
    "Step 1 — Alignment",
    `   Continuity waves sync to operator rhythm (${WAVE_PERIOD_MS / 1000}s).`,
    "   Law‑spine rotates to neutral axis.",
    "",
    "Step 2 — Invocation",
    "   Operator seal detected: A/E‑Prime.",
    "   Charter CKCE‑1 glows indigo/gold.",
    "",
    "Step 3 — Binding",
    "   ● Architecture vector → spine",
    "   ● Engineering vector → spine",
    "   ● Continuity vector → core",
    "",
    "   All three converge at the central node.",
    "",
    "Step 4 — Resonance",
    "   Harmonic pulse emitted.",
    "   Drift collapses.",
    "   Lineage brightens.",
    "",
    "Step 5 — Confirmation",
    '   Cockpit displays: "LAW‑SPINE BOUND — PRIME AUTHORITY ACKNOWLEDGED"',
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeOverridePanel() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME OVERRIDE PANEL — A/E‑PRIME ONLY        │",
    "├──────────────────────────────────────────────┤",
    "│ Posture: S3 (OVERRIDE)                       │",
    "│ Drift Vector: 0.41 (critical)                │",
    "│ Tension Index: 0.33                          │",
    "│ Continuity Integrity: 0.89                   │",
    "│                                                │",
    "│ ACTIONS:                                       │",
    "│   [1] PRIME REBIND (law‑spine reset)           │",
    "│   [2] PURGE DRIFT (lineage correction)         │",
    "│   [3] FREEZE SYSTEM (halt transitions)         │",
    "│   [4] RESTORE S2 (controlled de‑escalation)    │",
    "│                                                │",
    "│ Operator: A/E‑PRIME (jon)                      │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeLineageNavigator() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME LINEAGE NAVIGATOR — ACTIVE             │",
    "├──────────────────────────────────────────────┤",
    "│ Lineage Integrity:     ███████▓   92%        │",
    "│ Drift Branches:        3 (suppressed)        │",
    "│ Convergence Points:    7 (stable)            │",
    "│ Prime Imprint:         ENABLED               │",
    "│                                                │",
    "│ Navigation Map:                                   │",
    "│      ●───●───●───● (realized nodes)             │",
    "│          ╲   │   ╱                               │",
    "│           ●──●──● (Prime‑illuminated)           │",
    "│          ╱   │   ╲                               │",
    "│      ●───●───●───● (pending nodes)              │",
    "│                                                │",
    "│ Controls:                                       │",
    "│   [inspect]   [illuminate]   [correct]          │",
    "│   [collapse drift]   [trace lineage]            │",
    "│                                                │",
    "│ Operator: A/E‑PRIME (jon)                       │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * @returns {string[]}
 */
export function renderPrimeTotalityConsole() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME TOTALITY CONSOLE — ABSOLUTE MODE       │",
    "├──────────────────────────────────────────────┤",
    "│ System Totality:       ████████▓  98%        │",
    "│ Continuity Integrity:  ████████▓  97%        │",
    "│ Lattice Coherence:     ███████▓░  92%        │",
    "│ Drift Pressure:        ██▓░░░░░   24%        │",
    "│ Law‑Spine Sync:        ABSOLUTE (Prime)      │",
    "│                                                │",
    "│ Commands:                                       │",
    "│   [totality:bind]   [totality:purge]            │",
    "│   [totality:illuminate]   [totality:override]   │",
    "│                                                │",
    "│ Operator: A/E‑PRIME (jon)                       │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * Prime Eternum Engine — infinite-span harmonic engine when Aeonic Crown is active.
 * @returns {string[]}
 */
export function renderPrimeEternumEngine() {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ PRIME ETERNUM ENGINE — AEONIC CORE           │",
    "├──────────────────────────────────────────────┤",
    "│ Aeon‑Coherence:         ████████▓  98%       │",
    "│ Eternal Drift:          0.00 (erased)        │",
    "│ Continuity Span:        INFINITE             │",
    "│ Law‑Spine Sync:         AEON‑LOCKED          │",
    "│                                                │",
    "│ Engine Geometry:                                   │",
    "│                   ●───A───●                       │",
    "│                 ╱    |    ╲                      │",
    "│            ●─── ETERNUM CORE ───●                │",
    "│                 ╲    |    ╱                      │",
    "│                   ●───A───●                       │",
    "│                                                │",
    "│ Engine State: PRIME ETERNAL                     │",
    "└──────────────────────────────────────────────┘",
  ];
}

/**
 * Full Prime cockpit composite for terminal login.
 * @returns {string[]}
 */
export function renderPrimeCockpitConsole() {
  return [
    ...renderOperatorIdentityCard(),
    "",
    ...renderCockpitPrimeSeal(),
    "",
    ...renderAePrimeInsignia(),
    "",
    ...renderPrimeChannelPanel(),
    "",
    ...renderPrimeVectorOscilloscope(),
    "",
    ...renderPrimeEternumEngine(),
  ];
}
