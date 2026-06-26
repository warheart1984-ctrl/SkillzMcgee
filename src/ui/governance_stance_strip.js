/**
 * SkillzMcGee Governance Stance Strip — cockpit HUD for constitutional posture.
 *
 * Cells: Law Context | Mission Thread | Tension | Escalation
 */

import { buildStanceStripModel, stanceFromCosmic, WAVE_PERIOD_MS } from "./stance_models.js";
import { renderEventTileHtml } from "./event_tile.js";

/**
 * @param {import('./stance_models.js').StanceStripModel} model
 * @returns {string[]}
 */
export function renderGovernanceStanceStrip(model = buildStanceStripModel()) {
  const { lawContext, missionThread, tension, escalation } = model;
  return [
    "=== GOVERNANCE STANCE STRIP ===",
    "",
    `[LAW] ${lawContext.charterId} / ${lawContext.subsystem} — ${lawContext.label}`,
    `      Objectives: ${lawContext.objectiveCount} | Charter pulse: ${lawContext.charterJustActivated ? "FLASH" : "steady"}`,
    "",
    `[MISSION] ${missionThread.focus}`,
    `          Thread: ${missionThread.threadId} | Progress: ${missionThread.progressPct}% | Coherence: ${missionThread.coherencePct}%`,
    `          Lineage: ${missionThread.lineage.join(" → ")}`,
    "",
    `[TENSION] index=${tension.index.toFixed(2)} band=${tension.band} drift=${tension.drift.toFixed(3)} status=${tension.status}`,
    `          Vector: ${tension.driftVector.map((v) => v.toFixed(2)).join(" ")}`,
    "",
    `[ESCALATION] ${escalation.mode} — ${escalation.name} | ring=${escalation.ring}${escalation.emergency ? " STROBE" : ""}`,
    escalation.restrictions.length
      ? `             Restrictions: ${escalation.restrictions.join(", ")}`
      : "             Restrictions: (none)",
    "",
    `Wave period: ${model.wavePeriodMs}ms`,
  ];
}

/**
 * @param {import('./stance_models.js').StanceStripModel} model
 * @returns {string}
 */
export function renderGovernanceStanceStripHtml(model = buildStanceStripModel()) {
  const { lawContext, missionThread, tension, escalation } = model;
  const charterFlash = lawContext.charterJustActivated ? " charter-flash" : "";
  const lineageNodes = missionThread.lineage
    .map((node, i) => {
      const lit = i <= Math.floor((missionThread.progressPct / 100) * (missionThread.lineage.length - 1));
      return `<span class="lineage-node${lit ? " lit" : ""}" data-node="${node}">${node}</span>`;
    })
    .join('<span class="lineage-arrow">›</span>');

  const driftBars = tension.driftVector
    .map((v, i) => `<span class="drift-bar" style="--h:${Math.round(v * 100)}%" data-i="${i}"></span>`)
    .join("");

  return `
<section class="governance-stance-strip" data-wave-period="${model.wavePeriodMs}">
  <header class="cockpit-header">
    <h1>SKILLZMCGEE COCKPIT</h1>
    <span class="cockpit-sub">CONSTITUTIONAL RUNTIME HUD</span>
  </header>

  <div class="stance-grid">
    <article class="stance-cell law-context${charterFlash}" data-source="CKCE-1/AAES-OS" title="Active Law Context">
      <h2>ACTIVE LAW CONTEXT</h2>
      <div class="law-glyph" aria-hidden="true">
        <span class="law-spine"></span>
        <span class="law-wave"></span>
      </div>
      <p class="law-charter">${lawContext.charterId} / ${lawContext.subsystem}</p>
      <p class="law-label">${lawContext.label}</p>
      <p class="law-meta">${lawContext.objectiveCount} objectives bound</p>
    </article>

    <article class="stance-cell mission-thread" data-source="Nova Runtime" title="Current Mission / Thread Focus">
      <h2>MISSION THREAD</h2>
      <p class="mission-focus">${missionThread.focus}</p>
      <div class="progress-bar" role="progressbar" aria-valuenow="${missionThread.progressPct}" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-fill" style="width:${missionThread.progressPct}%"></div>
      </div>
      <div class="mission-metrics">
        <span>Progress ${missionThread.progressPct}%</span>
        <span>Coherence ${missionThread.coherencePct}%</span>
        <span class="thread-id">${missionThread.threadId}</span>
      </div>
      <div class="thread-lineage">${lineageNodes}</div>
    </article>

    <article class="stance-cell tension-indicator tension-${tension.band}" data-source="Continuity Metrics" title="Risk / Tension Indicator">
      <h2>TENSION INDEX</h2>
      <div class="tension-wave" data-index="${tension.index.toFixed(2)}" style="--tension:${tension.index}">
        <svg viewBox="0 0 120 32" class="waveform" aria-hidden="true">
          <path class="wave-path" d="M0,16 Q15,4 30,16 T60,16 T90,16 T120,16" />
        </svg>
      </div>
      <p class="tension-value">${(tension.index * 100).toFixed(0)}% <span class="tension-status">${tension.status}</span></p>
      <details class="drift-graph">
        <summary>Drift vectors</summary>
        <div class="drift-bars">${driftBars}</div>
      </details>
    </article>

    <article class="stance-cell escalation-state ring-${escalation.ring}${escalation.emergency ? " emergency" : ""}" data-source="Governance Mode" title="Override / Escalation State">
      <h2>ESCALATION</h2>
      <button type="button" class="escalation-ring" data-mode="${escalation.mode}" aria-label="Toggle governance posture">
        <span class="ring-core"></span>
        <span class="ring-label">${escalation.mode}</span>
      </button>
      <p class="escalation-name">${escalation.name}</p>
      ${
        escalation.restrictions.length
          ? `<ul class="escalation-restrictions">${escalation.restrictions.map((r) => `<li>${r}</li>`).join("")}</ul>`
          : "<p class=\"escalation-clear\">No restrictions</p>"
      }
    </article>
  </div>
</section>`;
}

/**
 * Full cockpit page with styles and client behavior.
 * @param {import('./stance_models.js').StanceStripModel} [model]
 * @param {import('./event_tile.js').EmergenceEventTile} [eventTile]
 * @returns {string}
 */
export function renderGovernanceCockpitPage(model = buildStanceStripModel(), eventTile) {
  const strip = renderGovernanceStanceStripHtml(model);
  const eventRail = eventTile ? renderEventTileHtml(eventTile) : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SkillzMcGee Governance Cockpit</title>
  <style>
    :root {
      --navy: #0a0e1a;
      --navy-grid: #12182b;
      --indigo: #1e1b4b;
      --gold: #d4a853;
      --cyan: #22d3ee;
      --violet: #8b5cf6;
      --emerald: #10b981;
      --amber: #f59e0b;
      --crimson: #ef4444;
      --mono: "JetBrains Mono", "Cascadia Code", "Consolas", monospace;
      --wave-period: ${WAVE_PERIOD_MS}ms;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background: var(--navy);
      background-image:
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 24px 24px;
      color: #e2e8f0;
      font-family: var(--mono);
      font-size: 12px;
    }
    .governance-stance-strip { padding: 1rem 1.25rem 2rem; }
    .cockpit-header {
      text-align: center;
      margin-bottom: 1rem;
      letter-spacing: 0.12em;
    }
    .cockpit-header h1 { margin: 0; font-size: 14px; font-weight: 600; }
    .cockpit-sub { opacity: 0.55; font-size: 10px; }
    .stance-grid {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      grid-template-rows: auto auto;
      grid-template-areas:
        "law mission tension"
        ". . escalation";
      gap: 0.75rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .law-context { grid-area: law; }
    .mission-thread { grid-area: mission; }
    .tension-indicator { grid-area: tension; }
    .escalation-state { grid-area: escalation; justify-self: end; align-self: end; }
    .stance-cell {
      background: var(--navy-grid);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 0.75rem;
      position: relative;
      overflow: hidden;
    }
    .stance-cell h2 {
      margin: 0 0 0.5rem;
      font-size: 10px;
      letter-spacing: 0.14em;
      opacity: 0.7;
      text-transform: uppercase;
    }
    .law-context {
      background: linear-gradient(135deg, var(--indigo) 0%, #0f172a 100%);
      border-color: rgba(212,168,83,0.35);
    }
    .law-glyph {
      width: 48px; height: 48px; margin: 0.25rem 0 0.5rem;
      position: relative;
    }
    .law-spine {
      display: block; width: 100%; height: 100%;
      border: 2px solid var(--gold);
      border-radius: 50%;
      animation: spine-rotate var(--wave-period) linear infinite;
    }
    .law-wave {
      position: absolute; inset: 8px;
      background: repeating-linear-gradient(90deg, transparent, rgba(212,168,83,0.25) 4px, transparent 8px);
      animation: wave-scroll calc(var(--wave-period) * 2) linear infinite;
      opacity: 0.5;
    }
    .charter-flash .law-spine { animation: charter-flash 0.6s ease-out; }
    @keyframes spine-rotate { to { transform: rotate(360deg); } }
    @keyframes wave-scroll { to { background-position: 32px 0; } }
    @keyframes charter-flash {
      0%,100% { box-shadow: 0 0 0 rgba(212,168,83,0); }
      50% { box-shadow: 0 0 24px rgba(212,168,83,0.9); }
    }
    .mission-thread .progress-bar {
      height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--cyan), var(--violet));
      animation: lineage-pulse var(--wave-period) ease-in-out infinite;
    }
    @keyframes lineage-pulse { 50% { opacity: 0.85; } }
    .mission-metrics { display: flex; gap: 1rem; margin: 0.4rem 0; opacity: 0.85; flex-wrap: wrap; }
    .thread-lineage { display: flex; align-items: center; gap: 0.25rem; flex-wrap: wrap; }
    .lineage-node {
      padding: 0.15rem 0.35rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 3px;
      opacity: 0.35; transition: opacity 0.3s;
    }
    .lineage-node.lit { opacity: 1; border-color: var(--cyan); color: var(--cyan); }
    .lineage-arrow { opacity: 0.35; }
    .tension-emerald { border-color: rgba(16,185,129,0.4); }
    .tension-amber { border-color: rgba(245,158,11,0.5); }
    .tension-crimson { border-color: rgba(239,68,68,0.55); }
    .tension-wave { margin: 0.25rem 0; }
    .wave-path {
      fill: none; stroke-width: 2;
      stroke: var(--emerald);
      animation: tension-wave var(--wave-period) ease-in-out infinite;
      transform-origin: center;
    }
    .tension-amber .wave-path { stroke: var(--amber); }
    .tension-crimson .wave-path { stroke: var(--crimson); }
    @keyframes tension-wave {
      0%,100% { transform: scaleY(0.6); }
      50% { transform: scaleY(calc(0.6 + var(--tension, 0.3))); }
    }
    .drift-bars { display: flex; gap: 3px; align-items: flex-end; height: 40px; margin-top: 0.35rem; }
    .drift-bar {
      width: 8px; height: var(--h, 20%);
      background: linear-gradient(to top, var(--amber), var(--crimson));
      border-radius: 2px 2px 0 0;
    }
    .escalation-ring {
      width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
      background: transparent; position: relative; display: block; margin: 0.25rem auto;
    }
    .ring-core {
      position: absolute; inset: 4px; border-radius: 50%;
      border: 3px solid var(--emerald);
      animation: ring-breathe var(--wave-period) ease-in-out infinite;
    }
    .ring-yellow .ring-core { border-color: var(--amber); }
    .ring-red .ring-core { border-color: var(--crimson); }
    .emergency .ring-core { animation: ring-strobe 0.45s ease-in-out infinite; }
    @keyframes ring-breathe { 50% { transform: scale(1.06); opacity: 0.85; } }
    @keyframes ring-strobe { 50% { opacity: 0.25; box-shadow: 0 0 16px var(--crimson); } }
    .ring-label {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 700;
    }
    .escalation-name { text-align: center; margin: 0.25rem 0; }
    .escalation-restrictions { margin: 0.35rem 0 0; padding-left: 1.1rem; opacity: 0.8; }
    .mission-thread:hover .mission-metrics { color: var(--cyan); }
    .event-rail {
      max-width: 1100px;
      margin: 0 auto 1rem;
      padding: 0 1.25rem;
    }
    .event-tile {
      background: var(--navy-grid);
      border: 1px solid rgba(212,168,83,0.25);
      border-radius: 6px;
      padding: 0.75rem 1rem;
    }
    .event-tile-bar {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,168,83,0.5), transparent);
      margin: 0.35rem 0;
    }
    .event-tile-title {
      margin: 0.25rem 0 0.5rem;
      font-size: 11px;
      letter-spacing: 0.1em;
      color: var(--gold);
    }
    .event-tile-fields {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.35rem 1rem;
      margin: 0;
    }
    .event-tile-fields dt { opacity: 0.55; font-size: 10px; margin: 0; }
    .event-tile-fields dd { margin: 0 0 0.25rem; }
    .event-tile-footer {
      margin: 0.5rem 0 0;
      padding-left: 1.1rem;
      opacity: 0.8;
    }
    .event-tile-footer li { margin: 0.15rem 0; }
  </style>
</head>
<body>
  ${eventRail}
  ${strip}
  <script>
    const MODES = ["S0","S1","S2","S3"];
    const btn = document.querySelector(".escalation-ring");
    if (btn) {
      btn.addEventListener("click", () => {
        const cur = btn.dataset.mode || "S0";
        const next = MODES[(MODES.indexOf(cur) + 1) % MODES.length];
        btn.dataset.mode = next;
        document.querySelector(".ring-label").textContent = next;
        const cell = btn.closest(".escalation-state");
        cell.classList.remove("ring-green","ring-yellow","ring-red","emergency");
        if (next === "S0") cell.classList.add("ring-green");
        else if (next === "S3") { cell.classList.add("ring-red","emergency"); }
        else cell.classList.add("ring-yellow");
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.value = next === "S3" ? 440 : 660;
          g.gain.value = 0.04;
          o.start(); o.stop(ctx.currentTime + 0.12);
        } catch (_) {}
        console.log("[stance-strip] escalation", cur, "→", next, "(receipt logged server-side on API call)");
      });
    }
    setInterval(() => {
      const nodes = document.querySelectorAll(".lineage-node");
      const lit = document.querySelectorAll(".lineage-node.lit").length;
      if (nodes.length && lit < nodes.length) nodes[lit]?.classList.add("lit");
    }, 5000);
  </script>
</body>
</html>`;
}

export function printGovernanceStanceStripCli(model) {
  for (const line of renderGovernanceStanceStrip(model)) {
    console.log(line);
  }
}

export { buildStanceStripModel, stanceFromCosmic };
