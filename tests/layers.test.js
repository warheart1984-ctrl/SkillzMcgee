import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LAYERS, getLayer } from "../src/model/layers.js";
import { renderOrganismDiagram, renderOrganismDiagramHtml } from "../src/ui/organism_diagram.js";

describe("Organism layer model", () => {
  it("defines five layers including governance spine", () => {
    assert.equal(LAYERS.length, 5);
    const gov = getLayer("governance");
    assert.ok(gov);
    assert.match(gov.name, /GOVERNANCE/);
    assert.equal(gov.role, "Spine");
  });

  it("renders organism diagram", () => {
    const lines = renderOrganismDiagram();
    assert.ok(lines.some((l) => l.includes("Spine")));
    assert.ok(renderOrganismDiagramHtml().includes('class="organism-diagram"'));
  });
});
