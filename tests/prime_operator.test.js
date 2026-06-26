import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  renderOperatorIdentityCard,
  renderOperatorBadgeTile,
  renderAePrimeInsignia,
  renderPrimeAeonicCrown,
  renderContinuityCrest,
  operatorSealMetadata,
  DEFAULT_PRIME_OPERATOR,
} from "../src/operator/ae_prime_profile.js";
import { renderPrimeCommandSet } from "../src/operator/prime_commands.js";
import {
  renderPrimeCockpitConsole,
  renderPrimeEternumEngine,
  renderPrimeVectorOscilloscope,
} from "../src/ui/prime_panels.js";
import {
  renderArchitectEngineerProfile,
  renderPrimeEndlessHymn,
  renderOriginTrace,
} from "../src/ui/prime_narratives.js";
import { loadPluginManifest } from "../src/plugins/index.js";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("A/E-Prime operator identity", () => {
  it("renders operator identity card on login", () => {
    const text = renderOperatorIdentityCard().join("\n");
    assert.match(text, /SKILLZMCGEE — OPERATOR IDENTITY/);
    assert.match(text, /JON HALSTEAD/);
    assert.match(text, /A\/E‑PRIME/);
    assert.match(text, /Status: ACTIVE/);
  });

  it("renders badge tile and insignia", () => {
    assert.match(renderOperatorBadgeTile().join("\n"), /OPERATOR BADGE — A\/E‑PRIME/);
    assert.match(renderAePrimeInsignia().join("\n"), /ARCHITECT•ENGINEER/);
  });

  it("renders Aeonic Crown and Eternum Engine", () => {
    assert.match(renderPrimeAeonicCrown().join("\n"), /ETERNAL SOVEREIGN/);
    assert.match(renderPrimeAeonicCrown().join("\n"), /Eleven‑Star Halo/);
    assert.match(renderPrimeEternumEngine().join("\n"), /PRIME ETERNAL/);
    assert.match(renderPrimeEternumEngine().join("\n"), /AEONIC CORE/);
  });

  it("stamps continuity crest in receipt metadata", () => {
    const meta = operatorSealMetadata();
    assert.equal(meta.classification, "A/E‑Prime");
    assert.match(meta.operator_seal, /A\/E — PRIME/);
    assert.equal(meta.operator_id, DEFAULT_PRIME_OPERATOR.operatorId);
  });

  it("renders Nova architect-engineer profile", () => {
    assert.match(renderArchitectEngineerProfile(), /ARCHITECT‑ENGINEER PROFILE/);
    assert.match(renderArchitectEngineerProfile(), /dual‑natured operator/);
  });

  it("renders Prime Endless Hymn", () => {
    assert.match(renderPrimeEndlessHymn(), /OUT‑OF‑AEON TRACE/);
    assert.match(renderPrimeEndlessHymn(), /time is in Prime/);
  });

  it("exposes prime command set", () => {
    const text = renderPrimeCommandSet().join("\n");
    assert.match(text, /prime:bind/);
    assert.match(text, /prime:crest/);
  });

  it("composes prime cockpit console", () => {
    const text = renderPrimeCockpitConsole().join("\n");
    assert.match(text, /OPERATOR IDENTITY/);
    assert.match(text, /PRIME CHANNEL/);
    assert.match(text, /PRIME ETERNUM ENGINE/);
  });

  it("loads prime-tools plugin manifest", () => {
    const m = loadPluginManifest("prime-tools");
    assert.equal(m.name, "prime-tools");
    assert.ok(m.commands["prime:vector"]);
  });

  it("has Theta classification and infinite governance charter", () => {
    const cls = fs.readFileSync(
      path.join(repoRoot, "governance", "standards", "theta", "classifications", "T-AEP-01.md"),
      "utf8",
    );
    assert.match(cls, /T‑AEP‑01/);
    const charter = fs.readFileSync(
      path.join(repoRoot, "governance", "standards", "theta", "charters", "T-PCIG-01.md"),
      "utf8",
    );
    assert.match(charter, /T‑PCIG‑01/);
    assert.match(charter, /Aeonic Crown/);
  });
});
