/**
 * Cockpit ASCII panels — cosmic-navy grid, JetBrains Mono terminal mode.
 */

import { buildStanceStripModel, WAVE_PERIOD_MS } from "./stance_models.js";
import { getEscalationState } from "../governance/escalation.js";

/**
 * @param {import('./stance_models.js').StanceStripModel} [model]
 * @returns {string[]}
 */
export function renderCockpitScreenshotMock(model = buildStanceStripModel()) {
  const { lawContext, missionThread, tension, escalation } = model;
  const progress = "█".repeat(Math.round(missionThread.progressPct / 25)) +
    "▒".repeat(4 - Math.round(missionThread.progressPct / 25));
  const lineage = missionThread.lineage
    .map((_, i) => {
      const lit = i <= Math.floor((missionThread.progressPct / 100) * (missionThread.lineage.length - 1));
      return lit ? "●" : "○";
    })
    .join(" ");
  const breathe = escalation.mode === "S3" ? "Strobe" : "Breathing";
  const nextMode = escalation.mode === "S0" ? "S1" : escalation.mode === "S1" ? "S2" : "S3";

  return [
    "┌──────────────────────────────────────────────────────────────────────────────┐",
    "│ NOVA OPERATOR COCKPIT — GOVERNANCE STANCE STRIP (ASCII MODE)                │",
    "├──────────────────────────────────────────────────────────────────────────────┤",
    "│ LAW CONTEXT        │ MISSION THREAD        │ TENSION INDEX     │ ESCALATION │",
    "│────────────────────┼───────────────────────┼────────────────────┼────────────│",
    `│ ${lawContext.charterId} / ${lawContext.subsystem}`.padEnd(19) +
      `│ Thread: Re‑Anchoring │ Drift: ${tension.index.toFixed(2)}`.padEnd(21) +
      `│   ${escalation.mode}`.padEnd(13) + "│",
    `│ Indigo/Gold Spine  │ Progress: ${progress}   │ Waveform: ~~~—~—~~ │ (${breathe})`.padEnd(13) + "│",
    `│ Charter: Active    │ Lineage: ${lineage}   │ Status: ${tension.status}`.padEnd(19) +
      `│ Click→${nextMode}`.padEnd(13) + "│",
    "└──────────────────────────────────────────────────────────────────────────────┘",
    "",
    `Continuity Rhythm: ${WAVE_PERIOD_MS / 1000}s  |  Receipts: ENABLED  |  Trace Spans: JSONL`,
    "Cosmic Grid: ON        |  Escalation Chime: ENABLED",
  ];
}

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderContinuityWaveformMock(opts = {}) {
  const period = opts.period ?? WAVE_PERIOD_MS / 1000;
  const drift = opts.drift ?? 0.12;
  const integrity = opts.integrity ?? 0.998;
  const frames = opts.frames ?? [
    "~~~~‾‾~~‾~~~~~‾~‾~~~~‾‾~~~~",
    "~~~‾~‾~~~~‾‾~~~~~‾‾~‾~~~~~~",
    "~~‾~~~~‾‾~~~~~‾~~~~‾‾~~~~~~",
    "~‾~~~~~‾~~~~‾‾~~~~~~‾‾~~~~~",
    "~~~~‾‾~~~~~‾‾~~~~~‾~~~~‾~~~",
    "~~~~~‾~~~~‾‾~~~~~~‾‾~~~~~~~",
  ];

  const lines = [
    "CONTINUITY WAVEFORM — LIVE FEED (ASCII MODE)",
    `Period: ${period.toFixed(1)}s   |   Drift: ${drift.toFixed(2)}   |   Integrity: ${integrity.toFixed(3)}`,
    "",
  ];
  frames.forEach((frame, i) => {
    lines.push(`t=${(i * 0.5).toFixed(1)}s   ${frame}`);
  });
  lines.push(
    `t=${period.toFixed(1)}s   (cycle resets)`,
    "",
    "Amplitude: ▂▄▆█▆▄▂   (stable)",
    "Phase Drift: +0.003 rad   (nominal)",
    "Wave Health: GREEN",
  );
  return lines;
}

/**
 * @returns {string[]}
 */
export function renderLawSpineRotationDiagram() {
  return [
    "LAW SPINE — CKCE‑1 ROTATION (INDIGO/GOLD)",
    "",
    "           ╭──────────╮",
    "           │  ●   ●   │   ← Charter Nodes",
    "           │    ●     │",
    "           ╰──────────╯",
    "",
    "Rotation Axis: vertical",
    "Angular Velocity: 0.33 rad/s",
    "Pulse: every charter change (gold flash)",
    "",
    "Frame Sample:",
    "",
    "   [0°]      [45°]      [90°]      [135°]     [180°]",
    "    ●          ●          ●          ●          ●",
    "   ● ●        ● ●        ● ●        ● ●        ● ●",
    "    ●          ●          ●          ●          ●",
    "",
    "Law Context: ACTIVE",
    "Continuity Binding: TRUE",
    "Charter Integrity: 1.000",
  ];
}

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderLineageGraphAscii(opts = {}) {
  const threadId = opts.threadId ?? "T982";
  const continuity = opts.continuity ?? 0.998;
  const branchDrift = opts.branchDrift ?? 0.03;
  const focus = opts.focus ?? "Re‑Anchoring Sequence";

  return [
    `LINEAGE GRAPH — THREAD ${threadId} (ASCII MODE)`,
    "",
    "          ●───●───●───○───○",
    "           \\         /",
    "            \\       /",
    "             ●────●",
    "             |",
    "             ●",
    "             |",
    "          ●──●──○",
    "          |",
    "          ●",
    "",
    "Legend:",
    "  ●  realized node",
    "  ○  pending node",
    "  ─  coherent link",
    "  \\  branch divergence",
    "  /  branch convergence",
    "",
    `Continuity: ${continuity}`,
    `Branch Drift: ${branchDrift}`,
    `Thread Focus: ${focus}`,
  ];
}

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderMissionCorridor(opts = {}) {
  const coherence = opts.coherence ?? 99.6;
  const drift = opts.drift ?? 0.12;
  const objective = opts.objective ?? "unify runtime";
  const operator = opts.operator ?? "jon";

  return [
    "MISSION CORRIDOR — ACTIVE THREAD",
    "",
    "   ════════════════════════════════════════",
    "      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "      ░   ●────●────●────●────○     ░",
    "      ░     (progress corridor)      ░",
    `      ░   coherence: ${coherence}%           ░`,
    `      ░   drift: ${drift}                ░`,
    `      ░   objective: ${objective}   ░`,
    "      ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
    "   ════════════════════════════════════════",
    "",
    "Corridor Light: cyan→violet",
    `Pulse Period: ${WAVE_PERIOD_MS / 1000}s (continuity rhythm)`,
    `Operator: ${operator}`,
  ];
}

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderOperatorHealthPanel(opts = {}) {
  return [
    "┌──────────────────────────────────────────────┐",
    "│ OPERATOR HEALTH — LIVE TELEMETRY             │",
    "├──────────────────────────────────────────────┤",
    `│ Cognitive Load:      ▓▓▓░░░░░░  ${opts.cognitiveLoad ?? 32}%          │`,
    `│ Focus Stability:      ████▓▓░░░  ${opts.focusStability ?? 78}%         │`,
    `│ Stress Index:         ▓░░░░░░░░  ${opts.stressIndex ?? 8}%         │`,
    `│ Rhythm Alignment:     ${(opts.rhythmSec ?? WAVE_PERIOD_MS / 1000).toFixed(1)}s (in phase)        │`,
    "│ Interaction Cadence:  steady                 │",
    "│ Drift Influence:      negligible (<0.01)     │",
    "│                                                      ",
    "│ Status: OPERATOR COHERENT                     │",
    "└──────────────────────────────────────────────┘",
    "",
    "Notes:",
    "• Health metrics sync to continuity rhythm",
    "• Stress Index modulates cockpit color temperature",
    "• Drift Influence feeds into Tension Index panel",
  ];
}

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderFaultInjectionPanel(opts = {}) {
  const escalation = getEscalationState();
  return [
    "┌────────────────────────────────────────────────────────────┐",
    "│ FAULT INJECTION SIMULATOR — RUNTIME SAFETY HARNESS         │",
    "├────────────────────────────────────────────────────────────┤",
    `│ Mode:        ${opts.mode ?? "MANUAL / SCRIPTED / RANDOM"}                    │`,
    "│ Target:      continuity | governance | lineage | adapter   │",
    `│ Intensity:   ▓▓░░░░░░░░  ${opts.intensity ?? 22}%                                 │`,
    `│ Duration:    ${opts.durationSec ?? 5.0}s                                           │`,
    `│ Rhythm Sync: ${(opts.rhythmSec ?? WAVE_PERIOD_MS / 1000).toFixed(1)}s (locked)                                  │`,
    "│                                                            │",
    "│ Inject Fault:  [ ENTER ]                                    │",
    "│                                                            │",
    "│ Last Injection:                                             │",
    "│   • Type: drift_spike                                       │",
    "│   • Amplitude: 0.42                                         │",
    `│   • Response: ${opts.lastResponse ?? "S1 → S2 escalation"}                            │`,
    "│   • Status: resolved                                        │",
    "└────────────────────────────────────────────────────────────┘",
    "",
    "Notes:",
    "• All injections emit receipts",
    "• Escalation ring flashes on S2/S3 triggers",
    "• Waveform panel shows induced amplitude spikes",
    `Current posture: ${escalation.mode}`,
  ];
}

/**
 * @param {object} [opts]
 * @returns {string[]}
 */
export function renderSpecimenFreezerPanel(opts = {}) {
  const slotsUsed = opts.slotsUsed ?? 12;
  const slotsTotal = opts.slotsTotal ?? 20;
  const bar = "█".repeat(Math.round((slotsUsed / slotsTotal) * 7)) +
    "▓".repeat(7 - Math.round((slotsUsed / slotsTotal) * 7));

  return [
    "┌──────────────────────────────────────────────────────┐",
    "│ SPECIMEN EXPORT / LAB FREEZER — CSS‑1 / CSL‑1       │",
    "├──────────────────────────────────────────────────────┤",
    `│ Freezer Slots:   [${bar}]  ${slotsUsed} / ${slotsTotal}                 │`,
    `│ Active Specimens:  ${opts.activeSpecimens ?? 4}                                │`,
    "│                                                      │",
    "│ Slot 03:  T982-waveform-snapshot.jsonl              │",
    "│   • Type: continuity trace                          │",
    "│   • Status: FROZEN (CSL‑1)                          │",
    "│                                                      │",
    "│ Slot 07:  ckce1-law-spine-resonance.yaml            │",
    "│   • Type: governance profile                        │",
    "│   • Status: FROZEN (CSS‑1)                          │",
    "│                                                      │",
    "│ [ E ] Export Specimen   [ I ] Import to Runtime     │",
    "└──────────────────────────────────────────────────────┘",
    "",
    "Notes:",
    "• All exports emit receipts",
    "• Lab freezer is continuity‑aware (linked to ledger)",
  ];
}

/**
 * @returns {string[]}
 */
export function renderLawSpineResonanceMap() {
  return [
    "LAW SPINE RESONANCE MAP — CKCE‑1",
    "",
    "   Frequency Axis: low → high",
    "   Amplitude Axis: weak → strong",
    "",
    "        high amp",
    "           ▲",
    "           │        ✶",
    "           │      ✶   ✶",
    "           │    ✶       ✶",
    "           │  ✶           ✶",
    "           └──────────────────► frequency",
    "",
    "Bands:",
    "  • Continuity Band: stable (indigo)",
    "  • Governance Band: strong (gold)",
    "  • Drift Band: low (faint red)",
    "",
    "Resonance State: HARMONIC",
    "Charter Integrity: 1.000",
  ];
}

/**
 * Full terminal cockpit composite (stance strip + waveform + health).
 * @param {import('./stance_models.js').StanceStripModel} [model]
 */
export function renderFullCockpitConsole(model = buildStanceStripModel()) {
  return [
    ...renderCockpitScreenshotMock(model),
    "",
    ...renderContinuityWaveformMock({ drift: model.tension.index }),
    "",
    ...renderOperatorHealthPanel(),
  ];
}
