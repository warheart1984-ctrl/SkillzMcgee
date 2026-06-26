import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LAYERS, getLayer } from "../src/model/layers.js";
import { renderOrganismDiagram, renderOrganismDiagramHtml } from "../src/ui/organism_diagram.js";

describe("Organism layer model", () => {
  it("defines six layers in canonical order with will substrate", () => {
    assert.equal(LAYERS.length, 6);
    assert.deepEqual(
      LAYERS.map((l) => l.id),
      ["intelligence", "will", "structure", "narrative", "awareness", "governance"],
    );

    const will = getLayer("will");
    assert.ok(will);
    assert.equal(will.name, "Will / Agency");

    const gov = getLayer("governance");
    assert.ok(gov);
    assert.match(gov.name, /Spine/);
  });

  it("renders organism diagram", () => {
    const lines = renderOrganismDiagram();
    assert.ok(lines.some((l) => l.includes("Will / Agency")));
    assert.ok(lines.some((l) => l.includes("Mind thinks")));
    assert.ok(renderOrganismDiagramHtml().includes('class="organism-diagram"'));
  });
});
