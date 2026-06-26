import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  renderGovernanceStanceStrip,
  renderGovernanceStanceStripHtml,
  renderGovernanceCockpitPage,
  buildStanceStripModel,
  stanceFromCosmic,
} from "../src/ui/governance_stance_strip.js";
import { cycleEscalation, getEscalationState } from "../src/governance/escalation.js";
import { setSafeMode } from "../src/governance/safe_mode.js";

describe("Governance Stance Strip", () => {
  it("renders ASCII strip with four cells", () => {
    const lines = renderGovernanceStanceStrip(buildStanceStripModel());
    const text = lines.join("\n");
    assert.match(text, /LAW/);
    assert.match(text, /MISSION/);
    assert.match(text, /TENSION/);
    assert.match(text, /ESCALATION/);
    assert.match(text, /CKCE-1/);
  });

  it("renders HTML with cockpit grid areas", () => {
    const html = renderGovernanceStanceStripHtml();
    assert.match(html, /law-context/);
    assert.match(html, /mission-thread/);
    assert.match(html, /tension-indicator/);
    assert.match(html, /escalation-state/);
    assert.match(html, /data-wave-period="3000"/);
  });

  it("full cockpit page includes lawful wave period and escalation button", () => {
    const page = renderGovernanceCockpitPage();
    assert.match(page, /JetBrains Mono/);
    assert.match(page, /escalation-ring/);
    assert.match(page, /--wave-period: 3000ms/);
  });

  it("derives stance from cosmic snapshot", () => {
    const model = stanceFromCosmic({
      tick: 3,
      tickResult: { ok: false, needCount: 2, taskCount: 0 },
      fold: { globalRootValid: false, drift: 0.7 },
    });
    assert.equal(model.tension.band, "crimson");
    assert.ok(model.missionThread.focus.includes("abort"));
  });

  it("cycleEscalation logs receipt and advances mode", () => {
    setSafeMode("S0");
    const before = getEscalationState().mode;
    const result = cycleEscalation({ cause: "test", actor: "test" });
    assert.notEqual(result.previous, result.current);
    assert.equal(result.receipt.policyOutcome, "escalation");
    assert.equal(getEscalationState().mode, result.current);
    setSafeMode(before);
  });
});
