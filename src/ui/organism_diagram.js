/**
 * Organism diagram — renders the five-layer architecture model.
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
    lines.push(`[${layer.role}] ${layer.name}`);
    lines.push(`  ${layer.description}`);
    lines.push(`  id: ${layer.id}`);
  }
  lines.push("");
  lines.push("Governance (Spine) binds: Mind · Body · Memory · Heart via CRK-1");
  return lines;
}

/**
 * Minimal HTML fragment (no React dependency).
 * @returns {string}
 */
export function renderOrganismDiagramHtml() {
  const cards = LAYERS.map(
    (layer) => `
    <div class="layer layer-${layer.id}" data-role="${layer.role}">
      <h3>${layer.name}</h3>
      <p>${layer.description}</p>
      <span class="layer-role">${layer.role}</span>
    </div>`,
  ).join("\n");

  return `<div class="organism-diagram">${cards}</div>`;
}
