import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCanon } from "../nova-studio/server/runtime/canonParser.mjs";
import { diffCanons } from "../nova-studio/server/runtime/canonDiffEngine.mjs";
import {
  generateCommunicationCanon,
  buildCanonData,
  writeCommunicationCanon,
} from "../nova-studio/server/runtime/canonGenerator.mjs";
import { reloadFreezeState } from "../nova-studio/server/runtime/canonFreeze.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GOV_DIR = path.join(path.resolve(__dirname, ".."), ".runtime/communication-governance");

function clearCanonFreezeArtifacts() {
  for (const name of ["canon-freeze.json", "canon-freeze-ticks.jsonl", "COMM-CANON@1.0.0.md", "constitution.runtime.json"]) {
    const p = path.join(GOV_DIR, name);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  reloadFreezeState();
}

test.beforeEach(() => {
  clearCanonFreezeArtifacts();
});

test("parseCanon extracts JSON sections from markdown", () => {
  const md = generateCommunicationCanon();
  const parsed = parseCanon(md);

  assert.ok(parsed["ACTIVE LANES"]);
  assert.ok(parsed["EPOCHS"]);
  assert.ok(parsed["CONTINUITY BUDGETS"]);
  assert.ok(parsed["DRIFT THRESHOLDS"]);
  assert.ok(parsed["CROSS-LANE INVARIANTS"]);
  assert.ok(parsed["ROUTING RULES"]);
  assert.ok(parsed["CONSTITUTION VERSIONS"]);
  assert.ok(parsed["LANE TOPOLOGY"]);

  assert.ok(Array.isArray(parsed["ACTIVE LANES"].lanes));
});

test("diffCanons detects structural section changes", () => {
  const md = generateCommunicationCanon();
  const parsed = parseCanon(md);

  const modified = {
    ...parsed,
    "DRIFT THRESHOLDS": {
      drift_thresholds: { warn: 0.1, notify: 0.2, contain: 0.4, fail_closed: 0.6 },
    },
  };

  const diff = diffCanons(parsed, modified);
  assert.ok(diff.change_count >= 1);
  assert.ok(diff.diffs["DRIFT THRESHOLDS"]);
  assert.deepEqual(diff.diffs["DRIFT THRESHOLDS"].before, parsed["DRIFT THRESHOLDS"]);
});

test("generateCommunicationCanon includes all eight sections", () => {
  const md = generateCommunicationCanon();
  for (let i = 1; i <= 8; i += 1) {
    assert.ok(md.includes(`Â§${i} â€”`), `missing section ${i}`);
  }
  assert.ok(md.includes("```json"));
});

test("writeCommunicationCanon persists markdown and JSON", async () => {
  const result = await writeCommunicationCanon();
  assert.ok(result.markdown.includes("COMM-CANON"));
  assert.equal(result.data.doc_id, "COMM-CANON");
  assert.ok(Object.keys(result.parsed).length >= 8);
});

test("buildCanonData aligns budgets with lanes", () => {
  const data = buildCanonData();
  for (const lane of data.lanes) {
    assert.ok(data.budgets[lane.lane_id]);
  }
});
