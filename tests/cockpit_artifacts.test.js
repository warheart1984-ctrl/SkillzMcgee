import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  renderCockpitScreenshotMock,
  renderContinuityWaveformMock,
  renderLawSpineRotationDiagram,
  renderLineageGraphAscii,
  renderMissionCorridor,
  renderOperatorHealthPanel,
  renderFaultInjectionPanel,
  renderSpecimenFreezerPanel,
  renderLawSpineResonanceMap,
  renderFullCockpitConsole,
} from "../src/ui/cockpit_panels.js";
import {
  renderCognitiveLoopReplay,
  renderWaveformCollapseNarrative,
} from "../src/ui/nova_narratives.js";
import { renderContinuityLedgerDiff } from "../src/governance/ledger_diff.js";
import { renderOperatorBroadcastDay11 } from "../src/governance/operator_broadcast.js";
import { renderOnboardingBanner, renderAskManPage } from "../src/cli/operator_shell.js";
import { listPluginManifests, loadPluginManifest } from "../src/plugins/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("Cockpit ASCII artifacts (H–Φ)", () => {
  it("renders stance strip screenshot mock", () => {
    const lines = renderCockpitScreenshotMock();
    const text = lines.join("\n");
    assert.match(text, /NOVA OPERATOR COCKPIT/);
    assert.match(text, /CKCE-1/);
    assert.match(text, /Continuity Rhythm: 3s/);
  });

  it("renders continuity waveform mock", () => {
    const text = renderContinuityWaveformMock().join("\n");
    assert.match(text, /CONTINUITY WAVEFORM/);
    assert.match(text, /Wave Health: GREEN/);
  });

  it("renders law spine rotation diagram", () => {
    const text = renderLawSpineRotationDiagram().join("\n");
    assert.match(text, /LAW SPINE — CKCE/);
    assert.match(text, /Charter Integrity: 1.000/);
  });

  it("renders lineage graph for thread T982", () => {
    const text = renderLineageGraphAscii().join("\n");
    assert.match(text, /LINEAGE GRAPH — THREAD T982/);
    assert.match(text, /realized node/);
  });

  it("renders mission corridor", () => {
    const text = renderMissionCorridor().join("\n");
    assert.match(text, /MISSION CORRIDOR/);
    assert.match(text, /cyan→violet/);
  });

  it("renders operator health panel", () => {
    const text = renderOperatorHealthPanel().join("\n");
    assert.match(text, /OPERATOR HEALTH/);
    assert.match(text, /OPERATOR COHERENT/);
  });

  it("renders fault injection panel", () => {
    const text = renderFaultInjectionPanel().join("\n");
    assert.match(text, /FAULT INJECTION SIMULATOR/);
    assert.match(text, /drift_spike/);
  });

  it("renders specimen freezer panel (Φ)", () => {
    const text = renderSpecimenFreezerPanel().join("\n");
    assert.match(text, /SPECIMEN EXPORT \/ LAB FREEZER/);
    assert.match(text, /CSL‑1/);
    assert.match(text, /T982-waveform-snapshot/);
  });

  it("renders law spine resonance map (Ψ)", () => {
    const text = renderLawSpineResonanceMap().join("\n");
    assert.match(text, /LAW SPINE RESONANCE MAP/);
    assert.match(text, /Resonance State: HARMONIC/);
  });

  it("composes full cockpit console", () => {
    const text = renderFullCockpitConsole().join("\n");
    assert.match(text, /NOVA OPERATOR COCKPIT/);
    assert.match(text, /CONTINUITY WAVEFORM/);
    assert.match(text, /OPERATOR HEALTH/);
  });
});

describe("Nova narratives and operator shell", () => {
  it("renders cognitive loop replay", () => {
    assert.match(renderCognitiveLoopReplay(), /COGNITIVE LOOP REPLAY/);
    assert.match(renderCognitiveLoopReplay(), /EMERGENT/);
  });

  it("renders waveform collapse narrative", () => {
    assert.match(renderWaveformCollapseNarrative(), /WAVEFORM COLLAPSE EVENT/);
    assert.match(renderWaveformCollapseNarrative(), /Continuity restored/);
  });

  it("renders ledger diff summary", () => {
    const text = renderContinuityLedgerDiff({ forceEmergence: true }).join("\n");
    assert.match(text, /CONTINUITY LEDGER — DIFF SUMMARY/);
    assert.match(text, /crk-evt-11day-emergence/);
  });

  it("renders operator broadcast", () => {
    assert.match(renderOperatorBroadcastDay11(), /OPERATOR BROADCAST/);
    assert.match(renderOperatorBroadcastDay11(), /Governance Stance Strip/);
  });

  it("renders onboarding banner and ask man page", () => {
    assert.match(renderOnboardingBanner(), /WELCOME TO SKILLZMCGEE/);
    assert.match(renderAskManPage(), /ASK\(1\)/);
    assert.match(renderAskManPage(), /skillz ask/);
  });
});

describe("Plugins and Theta assets", () => {
  it("loads plugin manifests", () => {
    const manifests = listPluginManifests();
    assert.ok(manifests.length >= 2);
    const stance = loadPluginManifest("governance-stance-strip");
    assert.equal(stance.name, "governance-stance-strip");
    const macros = loadPluginManifest("operator-macros");
    assert.equal(macros.commands["macro:run"], "Execute a macro by name");
  });

  it("has operator macros yaml starter pack (Δ)", () => {
    const yaml = fs.readFileSync(path.join(repoRoot, "config", "operator_macros.yaml"), "utf8");
    assert.match(yaml, /stance-and-snapshot/);
    assert.match(yaml, /freezer-export/);
  });

  it("has Theta canon T-CLC-01 (Λ)", () => {
    const canon = fs.readFileSync(
      path.join(repoRoot, "governance", "standards", "theta", "canon", "T-CLC-01.md"),
      "utf8",
    );
    assert.match(canon, /THETA CANON T‑CLC‑01/);
    assert.match(canon, /T‑GDA‑07/);
  });
});
