/**
 * Cockpit event tile — micro-panel for governance stance strip event rail.
 */

/**
 * @typedef {Object} EmergenceEventTile
 * @property {string} title
 * @property {string} lawContext
 * @property {string} missionThread
 * @property {number} tensionIndex
 * @property {string} tensionLabel
 * @property {string} governanceMode
 * @property {string} governanceLabel
 * @property {string[]} footerLines
 */

/**
 * @param {object} receipt - AAES continuity receipt
 * @returns {EmergenceEventTile}
 */
export function emergenceEventFromReceipt(receipt) {
  const stance = receipt.stance ?? {};
  const tension = stance.tension_index ?? 0.12;
  return {
    title: "CONSTITUTIONAL EMERGENCE (DAY 11)",
    lawContext: stance.law_context ?? "CKCE-1 / AAES-OS",
    missionThread: stance.mission_thread ?? "Workspace Re-Anchoring",
    tensionIndex: tension,
    tensionLabel: tension < 0.35 ? "Stable" : tension < 0.65 ? "Elevated" : "Critical",
    governanceMode: stance.governance_mode ?? "S1",
    governanceLabel: stance.governance_mode === "S1" ? "Heightened" : "Normal",
    footerLines: [
      "Continuity substrate online.",
      "Operator unification complete.",
      "Cockpit activated.",
    ],
  };
}

/**
 * @param {EmergenceEventTile} event
 * @returns {string[]}
 */
export function renderEventTileAscii(event) {
  const bar = "─".repeat(44);
  return [
    bar,
    ` EVENT: ${event.title}`,
    bar,
    `Law Context: ${event.lawContext}`,
    `Mission Thread: ${event.missionThread}`,
    `Tension Index: ${event.tensionIndex} (${event.tensionLabel})`,
    `Governance Mode: ${event.governanceMode} (${event.governanceLabel})`,
    "",
    ...event.footerLines,
    bar,
  ];
}

/**
 * @param {EmergenceEventTile} event
 * @returns {string}
 */
export function renderEventTileHtml(event) {
  return `
<aside class="event-rail" aria-label="Governance event tile">
  <div class="event-tile">
    <div class="event-tile-bar"></div>
    <h3 class="event-tile-title">EVENT: ${event.title}</h3>
    <dl class="event-tile-fields">
      <div><dt>Law Context</dt><dd>${event.lawContext}</dd></div>
      <div><dt>Mission Thread</dt><dd>${event.missionThread}</dd></div>
      <div><dt>Tension Index</dt><dd>${event.tensionIndex} (${event.tensionLabel})</dd></div>
      <div><dt>Governance Mode</dt><dd>${event.governanceMode} (${event.governanceLabel})</dd></div>
    </dl>
    <ul class="event-tile-footer">
      ${event.footerLines.map((l) => `<li>${l}</li>`).join("")}
    </ul>
    <div class="event-tile-bar"></div>
  </div>
</aside>`;
}
