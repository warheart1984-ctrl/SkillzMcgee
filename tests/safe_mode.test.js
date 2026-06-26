import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SAFE_MODES,
  getSafeMode,
  setSafeMode,
  safeModeProfileApplied,
} from "../src/governance/safe_mode.js";

describe("Safe-mode profiles S0–S3", () => {
  it("defines four degradation profiles", () => {
    assert.equal(Object.keys(SAFE_MODES).length, 4);
    assert.ok(SAFE_MODES.S0.restrictions.length === 0);
    assert.ok(SAFE_MODES.S3.restrictions.includes("read-only"));
  });

  it("defaults to S0 Normal", () => {
    setSafeMode("S0");
    const { mode, info } = getSafeMode();
    assert.equal(mode, "S0");
    assert.equal(info.name, "Normal");
    assert.equal(safeModeProfileApplied(), true);
  });

  it("reports S1 restrictions", () => {
    setSafeMode("S1");
    const { mode, info } = getSafeMode();
    assert.equal(mode, "S1");
    assert.ok(info.restrictions.includes("no-external-actuation"));
    setSafeMode("S0");
  });

  it("rejects unknown mode", () => {
    assert.throws(() => setSafeMode("S9"), /Unknown safe-mode/);
  });
});
