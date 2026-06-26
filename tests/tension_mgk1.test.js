import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  negotiate,
  invert,
  dissolve,
  scale,
  generate,
  rebirth,
  paradox,
  cosmologicalTick,
} from "../src/tension/operations.js";
import { tension } from "../src/tension/types.js";
import {
  createInterpreterState,
  runProgram,
  parseTensionSource,
  executeStep,
} from "../src/tension/interpreter.js";
import {
  createMgk1State,
  processProposal,
  renderMgk1StatePanel,
  suggestModeShift,
} from "../src/governance/mgk1.js";
import {
  renderQuadTierInterlock,
  renderSupraMetaPrimeEngine,
} from "../src/cosmology/quad_tier.js";
import {
  renderHyperNegotiantEngine,
  renderGoverningEquation,
} from "../src/cosmology/hyper_prime.js";
import { renderPrimeOfPrimesSigilplate } from "../src/cosmology/prime_of_primes.js";
import { renderCosmologyPanel } from "../src/cosmology/registry.js";
import {
  createNegotiantCore,
  spinCore,
  spinFullCycle,
  rotateCore,
  coreTick,
  renderNegotiantCore,
  renderNegotiantCoreFace,
  NEGOTIANT_GLYPH,
  NEGOTIANT_SENTENCE,
  CORE_FACES,
} from "../src/cosmology/negotiant_core.js";
import { selfNegotiate } from "../src/tension/operations.js";

describe("TENSION language", () => {
  it("negotiate averages tensions", () => {
    const a = tension({ becoming: 8, resistance: 2, memory: 6, horizon: 4, equilibrium: 10 });
    const b = tension({ becoming: 2, resistance: 8, memory: 4, horizon: 6, equilibrium: 0 });
    const n = negotiate(a, b);
    assert.equal(n.becoming, 5);
    assert.equal(n.equilibrium, 5);
  });

  it("invert reflects around max 10", () => {
    const a = tension({ becoming: 3, resistance: 7, memory: 5, horizon: 5, equilibrium: 5 });
    const inv = invert(a);
    assert.equal(inv.becoming, 7);
    assert.equal(inv.resistance, 3);
  });

  it("dissolve zeros all tensions", () => {
    const z = dissolve();
    assert.deepEqual(z, tension({ becoming: 0, resistance: 0, memory: 0, horizon: 0, equilibrium: 0 }));
  });

  it("scale multiplies tensions", () => {
    const s = scale(tension({ becoming: 2 }), 3);
    assert.equal(s.becoming, 6);
  });

  it("generate is deterministic from seed string", () => {
    const g1 = generate("cosmos");
    const g2 = generate("cosmos");
    assert.deepEqual(g1, g2);
    assert.ok(g1.becoming >= 1 && g1.becoming <= 10);
  });

  it("rebirth negotiates last with inverted first", () => {
    const h = [tension({ becoming: 10 }), tension({ becoming: 2 })];
    const r = rebirth(h);
    assert.ok(r.becoming > 0);
  });

  it("paradox blends superposition", () => {
    const p = paradox(tension({ becoming: 10, horizon: 2 }), tension({ becoming: 2, horizon: 10 }));
    assert.equal(p.becoming, 6);
  });

  it("cosmologicalTick advances state", () => {
    const c0 = tension({ becoming: 7, resistance: 4, memory: 9, horizon: 6, equilibrium: 5 });
    const c1 = cosmologicalTick(c0);
    assert.notDeepEqual(c1, c0);
  });

  it("interpreter runs invert step", () => {
    let state = createInterpreterState({ cosmos: tension({ becoming: 3 }) });
    state = executeStep(state, { op: "invert" });
    assert.equal(state.cosmos.becoming, 7);
    assert.equal(state.history.length, 1);
  });

  it("parses tension block and runs program", () => {
    const src = `tension cosmos { becoming: 7, resistance: 4, memory: 9, horizon: 6, equilibrium: 5 }
invert(cosmos)`;
    const { bindings, program } = parseTensionSource(src);
    assert.ok(bindings.cosmos);
    let state = createInterpreterState({ cosmos: bindings.cosmos });
    state = runProgram(state, program);
    assert.equal(state.cosmos.becoming, 3);
  });
});

describe("MGK-1 governance", () => {
  it("processes proposal and records decision", () => {
    let state = createMgk1State();
    const { state: next, decision } = processProposal(state, {
      id: "p1",
      text: "Enable modal dungeons",
      tensionImpact: { becoming: 2, horizon: 1 },
    });
    assert.ok(decision.id);
    assert.equal(next.history.length, 1);
  });

  it("suggests mode shift from tension peaks", () => {
    assert.equal(suggestModeShift(tension({ resistance: 9 })), "REFUSE");
    assert.equal(suggestModeShift(tension({ becoming: 9 })), "GENERATE");
  });

  it("renders governance panel", () => {
    const text = renderMgk1StatePanel(createMgk1State()).join("\n");
    assert.match(text, /MGK‑1 GOVERNANCE PROTOCOL/);
    assert.match(text, /NEGOTIATE/);
  });
});

describe("Hyper-Negotiant cosmology extensions", () => {
  it("renders quad-tier interlock", () => {
    const text = renderQuadTierInterlock().join("\n");
    assert.match(text, /OMNI‑NEGOTIANT/);
    assert.match(text, /FRACTAL‑PRIME/);
  });

  it("renders supra-meta engine and hyper engine", () => {
    assert.match(renderSupraMetaPrimeEngine().join("\n"), /SUPRA‑META‑PRIME ENGINE/);
    assert.match(renderHyperNegotiantEngine().join("\n"), /HYPER‑NEGOTIANT ENGINE/);
    assert.match(renderGoverningEquation().join("\n"), /cosmos\(t\+1\)/);
  });

  it("renders prime-of-primes sigilplate", () => {
    const text = renderPrimeOfPrimesSigilplate().join("\n");
    assert.match(text, /PRIME‑OF‑PRIMES SIGILPLATE/);
    assert.match(text, /⟁/);
  });

  it("registry exposes hyper and quad panels", () => {
    for (const name of ["hyper-engine", "quad-interlock", "pop-sigilplate", "mgk1", "spiral-sigil"]) {
      const lines = renderCosmologyPanel(name);
      assert.ok(lines.length > 0, `empty: ${name}`);
    }
  });
});

describe("Negotiant Core (⟴)", () => {
  it("defines glyph and governing sentence", () => {
    assert.equal(NEGOTIANT_GLYPH, "⟴");
    assert.match(NEGOTIANT_SENTENCE, /recursive negotiation/);
  });

  it("renders stabilized core artifact", () => {
    const text = renderNegotiantCore().join("\n");
    assert.match(text, /NEGOTIANT CORE/);
    assert.match(text, /coreTick\(\) is the law/);
    assert.match(text, /1\.0\.0/);
  });

  it("renders all five faces", () => {
    for (const face of CORE_FACES) {
      const text = renderNegotiantCoreFace(face).join("\n");
      assert.match(text, /NEGOTIANT CORE/);
      assert.ok(text.includes(NEGOTIANT_SENTENCE));
    }
    assert.match(renderNegotiantCoreFace("language").join("\n"), /cosmos\(t\+1\)/);
    assert.match(renderNegotiantCoreFace("governance").join("\n"), /propose/);
  });

  it("coreTick is self-negotiation spiral", () => {
    const c0 = tension({ becoming: 8, resistance: 2, memory: 5, horizon: 5, equilibrium: 5 });
    assert.deepEqual(coreTick(c0), selfNegotiate(c0));
  });

  it("spinCore rotates faces and advances cosmos", () => {
    let state = createNegotiantCore({ cosmos: tension({ becoming: 7 }) });
    const s1 = spinCore(state);
    assert.equal(s1.history.length, 1);
    assert.notDeepEqual(s1.cosmos, state.cosmos);
    assert.ok(CORE_FACES.includes(s1.face));
  });

  it("spinFullCycle completes five-face rotation", () => {
    const state = spinFullCycle(createNegotiantCore());
    assert.equal(state.history.length, 5);
  });

  it("rotateCore selects face without spinning", () => {
    const state = rotateCore(createNegotiantCore(), "scripture");
    assert.equal(state.face, "scripture");
    assert.equal(state.history.length, 0);
  });

  it("registry exposes negotiant-core panels", () => {
    for (const name of ["negotiant-core", "core-language", "core-live"]) {
      assert.ok(renderCosmologyPanel(name).length > 0);
    }
  });
});
