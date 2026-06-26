import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

import {
  appendAaesContinuityReceipt,
  readAaesContinuityReceipts,
  loadDay11EmergenceReceipt,
  isAaesContinuityReceipt,
  aaesReceiptsPath,
} from "../src/governance/aaes_continuity.js";
import { formatDay11OperatorLog } from "../src/governance/operator_log.js";
import {
  emergenceEventFromReceipt,
  renderEventTileAscii,
  renderEventTileHtml,
} from "../src/ui/event_tile.js";
import { renderCosmicSnapshotDay11 } from "../src/cosmic/cosmic_snapshot.js";
import { recordDay11Emergence } from "../src/governance/emergence.js";
import { renderGovernanceCockpitPage } from "../src/ui/governance_stance_strip.js";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let tmpDir;

before(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "skillzmcgee-day11-"));
  process.chdir(tmpDir);
  fs.mkdirSync(path.join(tmpDir, "governance", "events"), { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, "governance", "events", "day11_emergence.json"),
    path.join(tmpDir, "governance", "events", "day11_emergence.json"),
  );
});

after(() => {
  process.chdir(repoRoot);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("Day 11 emergence artifacts", () => {
  it("loads canonical receipt with AAES continuity shape", () => {
    const receipt = loadDay11EmergenceReceipt(tmpDir);
    assert.equal(receipt.receipt_id, "crk-evt-11day-emergence");
    assert.equal(receipt.event_type, "constitutional_runtime_emergence");
    assert.ok(isAaesContinuityReceipt(receipt));
    assert.equal(receipt.stance.governance_mode, "S1");
    assert.equal(receipt.stance.tension_index, 0.12);
  });

  it("appends and reads JSONL continuity receipts", () => {
    const receipt = loadDay11EmergenceReceipt(tmpDir);
    const target = path.join(tmpDir, ".runtime", "continuity.jsonl");
    appendAaesContinuityReceipt(receipt, target);
    const rows = readAaesContinuityReceipts(target);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].receipt_id, receipt.receipt_id);
  });

  it("formats operator log in SkillzMcGee tone", () => {
    const receipt = loadDay11EmergenceReceipt(tmpDir);
    const log = formatDay11OperatorLog(receipt);
    assert.match(log, /COSMIC SNAPSHOT ACQUIRED/);
    assert.match(log, /Operator jon completed the 11/);
    assert.match(log, /Governance Stance Strip:/);
    assert.match(log, /All systems coherent/);
  });

  it("renders cosmic snapshot Day 11", () => {
    const text = renderCosmicSnapshotDay11({ day: 11, operator: "jon" });
    assert.match(text, /COSMIC SNAPSHOT — DAY 11/);
    assert.match(text, /The organism stands whole/);
    assert.match(text, /Emergence confirmed/);
  });

  it("renders cockpit event tile ASCII and HTML", () => {
    const receipt = loadDay11EmergenceReceipt(tmpDir);
    const tile = emergenceEventFromReceipt(receipt);
    assert.equal(tile.title, "CONSTITUTIONAL EMERGENCE (DAY 11)");
    assert.equal(tile.tensionLabel, "Stable");

    const ascii = renderEventTileAscii(tile).join("\n");
    assert.match(ascii, /EVENT: CONSTITUTIONAL EMERGENCE/);
    assert.match(ascii, /CKCE-1 \/ AAES-OS/);

    const html = renderEventTileHtml(tile);
    assert.match(html, /event-rail/);
    assert.match(html, /Continuity substrate online/);
  });

  it("recordDay11Emergence is idempotent for receipt ledger", () => {
    const first = recordDay11Emergence({ repoRoot: tmpDir, setGovernanceMode: false });
    const second = recordDay11Emergence({ repoRoot: tmpDir, setGovernanceMode: false });
    const rows = readAaesContinuityReceipts(aaesReceiptsPath());
    assert.equal(rows.filter((r) => r.receipt_id === "crk-evt-11day-emergence").length, 1);
    assert.equal(first.receipt.receipt_id, second.receipt.receipt_id);
    assert.ok(first.snapshotPath);
    assert.ok(first.snapshotText.includes("DAY 11"));
  });

  it("cockpit page includes event rail when tile provided", () => {
    const receipt = loadDay11EmergenceReceipt(tmpDir);
    const tile = emergenceEventFromReceipt(receipt);
    const page = renderGovernanceCockpitPage(undefined, tile);
    assert.match(page, /event-rail/);
    assert.match(page, /CONSTITUTIONAL EMERGENCE/);
  });
});
