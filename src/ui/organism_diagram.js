/**
 * Organism diagram — six-layer architecture (Mind → Will → Body → Memory → Heart → Spine).
 */

import { LAYERS } from "../model/layers.js";

/**
 * ASCII / CLI diagram for governance console and tests.
 * @returns {string[]}
 */
export function renderOrganismDiagram() {
  const lines = ["=== ORGANISM LAYERS ==="];
  for (const layer of LAYERS) {
    lines.push("");
    lines.push(`[${layer.name}]`);
    lines.push(`  ${layer.description}`);
    lines.push(`  id: ${layer.id}`);
  }
  lines.push("");
  lines.push("Tick: Mind thinks → Will acts → Spine binds (CRK-1)");
  return lines;
}

/**
 * Minimal HTML fragment (no React dependency).
 * @returns {string}
 */
export function renderOrganismDiagramHtml() {
  const cards = LAYERS.map(
    (layer) => `
    <div class="layer layer-${layer.id}" data-layer="${layer.id}">
      <h3>${layer.name}</h3>
      <p>${layer.description}</p>
    </div>`,
  ).join("\n");

  return `<div class="organism-diagram">${cards}</div>`;
}
