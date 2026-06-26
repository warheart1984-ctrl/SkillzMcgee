/**
 * Browser cockpit driver — imports constitutional Core + RPG face.
 * Served via scripts/serve_core_rpg.mjs (ES modules).
 */
import { coreTick } from "../../cosmology/negotiant_core.js";
import { cloneCosmos } from "../../cosmology/core_contract.js";
import { projectFace } from "../../faces/index.js";
import { archetypeForMode } from "../../faces/rpg/archetypes.js";
import { tension } from "../../tension/types.js";
import { DEFAULT_COSMOS } from "../constants.js";

/** @typedef {import("../../tension/types.js").Tension} Cosmos */

let cosmos = tension({ ...DEFAULT_COSMOS });

/**
 * @returns {{ cosmos: Cosmos, rpg: ReturnType<typeof projectFace>, archetype: string }}
 */
export function getState() {
  const rpg = projectFace("rpg", cosmos);
  return {
    cosmos: { ...cosmos },
    rpg,
    archetype: archetypeForMode(rpg.mode),
  };
}

/**
 * @param {number} n
 */
export function spin(n = 1) {
  for (let i = 0; i < n; i++) {
    cosmos = coreTick(cosmos);
  }
  return getState();
}

export function reset() {
  cosmos = tension({ ...DEFAULT_COSMOS });
  return getState();
}

/**
 * @param {Cosmos} next
 */
export function setCosmos(next) {
  cosmos = cloneCosmos(next);
  return getState();
}

function backlashBand(backlash) {
  if (backlash <= 2) return "stable";
  if (backlash <= 4) return "unstable";
  return "critical";
}

const BAND_COLOR = {
  stable: "#10b981",
  unstable: "#f59e0b",
  critical: "#ef4444",
};

const LABELS = [
  ["becoming", "Becoming"],
  ["resistance", "Resistance"],
  ["memory", "Memory"],
  ["horizon", "Horizon"],
  ["equilibrium", "Equilibrium"],
];

function render() {
  const { cosmos: c, rpg, archetype } = getState();
  const band = backlashBand(rpg.backlash);
  const scaleMax = Math.max(10, ...Object.values(c));

  const bars = document.getElementById("tension-bars");
  if (bars) {
    bars.innerHTML = LABELS.map(([key, label]) => {
      const value = c[key];
      const pct = Math.min(100, (value / scaleMax) * 100);
      const dominant = label === rpg.mode;
      return `
        <div class="bar-row">
          <div class="bar-label"><span>${label}</span><span>${value}</span></div>
          <div class="bar-track">
            <div class="bar-fill ${dominant ? "dominant" : ""}" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join("");
  }

  const modeEl = document.getElementById("mode-value");
  const archetypeEl = document.getElementById("archetype-value");
  const backlashEl = document.getElementById("backlash-value");
  const backlashBandEl = document.getElementById("backlash-band");
  const meterEl = document.getElementById("backlash-meter");
  const narrativeEl = document.getElementById("narrative-hook");
  const cycleEl = document.getElementById("cycle-list");

  if (modeEl) modeEl.textContent = rpg.mode;
  if (archetypeEl) archetypeEl.textContent = archetype;
  if (backlashEl) {
    backlashEl.textContent = String(rpg.backlash);
    backlashEl.style.color = BAND_COLOR[band];
  }
  if (backlashBandEl) backlashBandEl.textContent = band;
  if (meterEl) {
    meterEl.value = rpg.backlash;
    meterEl.style.accentColor = BAND_COLOR[band];
  }
  if (narrativeEl) narrativeEl.textContent = rpg.narrativeHook;

  if (cycleEl) {
    const sorted = LABELS.map(([key, label]) => ({ label, value: c[key] }))
      .sort((a, b) => b.value - a.value);
    cycleEl.innerHTML = sorted
      .map(
        ({ label, value }) =>
          `<li><span>${label}</span><span>${value}</span></li>`,
      )
      .join("");
  }
}

document.getElementById("spin-1")?.addEventListener("click", () => {
  spin(1);
  render();
});
document.getElementById("spin-5")?.addEventListener("click", () => {
  spin(5);
  render();
});
document.getElementById("reset")?.addEventListener("click", () => {
  reset();
  render();
});

render();
