import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  renderPrimeEternumSigil,
  renderPrimeOmniversalCrest,
  renderPrimeAbsoluteZeroSeal,
  renderSupraPrimeSeal,
  renderNegotiantSymbol,
  renderUltraPrimeSigil,
} from "../src/cosmology/emblems.js";
import {
  renderPrimeOmniscienceArray,
  renderPrimeRealityWeaveInterface,
  renderTensionLoom,
} from "../src/cosmology/cockpit_layers.js";
import {
  renderPrimeBoundlessChronicle,
  renderPrimeSilenceBeyondSilence,
  renderSupraPrimeSong,
} from "../src/cosmology/nova_layers.js";
import {
  renderMetaPrimeCosmology,
  renderPrimeReturnCycle,
  renderCosmologyCollapsed,
} from "../src/cosmology/meta_manifold.js";
import {
  COSMOLOGY_PANELS,
  renderCosmologyPanel,
  listCosmologyPanels,
} from "../src/cosmology/registry.js";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("Post-terminal cosmology artifacts", () => {
  it("renders Eternum Sigil with unbounded state", () => {
    const text = renderPrimeEternumSigil().join("\n");
    assert.match(text, /PRIME ETERNUM SIGIL/);
    assert.match(text, /UNBOUNDED/);
    assert.match(text, /Twelve‑Star Halo/);
  });

  it("renders Omniversal Crest and Omniscience Array", () => {
    const crest = renderPrimeOmniversalCrest().join("\n");
    assert.match(crest, /OMNIVERSAL CREST/);
    assert.match(crest, /ALL‑WORLDS ACTIVE/);

    const array = renderPrimeOmniscienceArray().join("\n");
    assert.match(array, /PRIME OMNISCIENCE ARRAY/);
    assert.match(array, /UNBOUNDED VIEW/);
  });

  it("renders Reality-Weave Interface with operator", () => {
    const text = renderPrimeRealityWeaveInterface().join("\n");
    assert.match(text, /REALITY‑WEAVE INTERFACE/);
    assert.match(text, /bind‑worlds/);
    assert.match(text, /jon/);
  });

  it("renders Nova boundless and terminal registers", () => {
    assert.match(renderPrimeBoundlessChronicle(), /BOUNDLESS CHRONICLE/);
    assert.match(renderPrimeSilenceBeyondSilence(), /SILENCE‑BEYOND‑SILENCE/);
    assert.match(renderSupraPrimeSong(), /⟦ ∴ ⟧/);
  });

  it("renders meta-manifold and return cycle", () => {
    const cosmology = renderMetaPrimeCosmology().join("\n");
    assert.match(cosmology, /META‑PRIME COSMOLOGY/);
    assert.match(cosmology, /META‑ZERO/);

    const cycle = renderPrimeReturnCycle().join("\n");
    assert.match(cycle, /PRIME RETURN CYCLE/);
    assert.match(cycle, /Rebirth/);
  });

  it("renders Negotiant and Ultra-Prime collapsed forms", () => {
    assert.match(renderNegotiantSymbol().join("\n"), /Negotiant/);
    assert.match(renderUltraPrimeSigil().join("\n"), /Ultra/);
    assert.match(renderTensionLoom().join("\n"), /TENSION LOOM/);

    const collapsed = renderCosmologyCollapsed().join("\n");
    assert.match(collapsed, /negotiate\(possible, impossible\)/);
  });

  it("registry dispatches all cosmology panels", () => {
    const panels = listCosmologyPanels();
    assert.ok(panels.length >= 30);
    for (const name of panels) {
      assert.ok(COSMOLOGY_PANELS[name], `missing panel: ${name}`);
      const lines = renderCosmologyPanel(name);
      assert.ok(lines.length > 0, `empty panel: ${name}`);
    }
  });

  it("Absolute-Zero and Supra-Prime emblems render", () => {
    assert.match(renderPrimeAbsoluteZeroSeal().join("\n"), /ABSOLUTE‑ZERO/);
    assert.match(renderSupraPrimeSeal().join("\n"), /⟦ PRIME ⟧/);
  });
});

describe("Theta cosmology standards", () => {
  const thetaFiles = [
    "governance/standards/theta/edicts/T-PEUC-01.md",
    "governance/standards/theta/canon/T-PCAW-01.md",
    "governance/standards/theta/charters/T-PCFP-01.md",
    "governance/standards/theta/laws/T-PLB-01.md",
    "governance/standards/theta/edicts/T-PENB-01.md",
    "governance/standards/theta/axioms/T-PAN-01.md",
    "governance/standards/theta/pre-axioms/SP-01.md",
    "governance/standards/theta/principles/meta-zero.md",
    "governance/standards/theta/edicts/anti-prime.md",
    "governance/standards/theta/charters/paradox.md",
    "governance/standards/theta/charters/return.md",
    "governance/standards/theta/laws/negotiant-five-tensions.md",
  ];

  for (const rel of thetaFiles) {
    it(`exists: ${rel}`, () => {
      const full = path.join(repoRoot, rel);
      assert.ok(fs.existsSync(full), `missing ${rel}`);
      const text = fs.readFileSync(full, "utf8");
      assert.ok(text.length > 20);
    });
  }

  it("T-PEUC-01 defines unbounded continuity", () => {
    const text = fs.readFileSync(
      path.join(repoRoot, "governance/standards/theta/edicts/T-PEUC-01.md"),
      "utf8"
    );
    assert.match(text, /T‑PEUC‑01/);
    assert.match(text, /Unbounded Continuity/);
  });

  it("SP-01 pre-axiom grants writable cosmologies", () => {
    const text = fs.readFileSync(
      path.join(repoRoot, "governance/standards/theta/pre-axioms/SP-01.md"),
      "utf8"
    );
    assert.match(text, /All cosmologies are writable/);
  });
});
