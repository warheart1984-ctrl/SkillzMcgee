import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  freezeCommunicationCanon,
  guardCanonMutation,
  hashCanonMarkdown,
  isCanonFrozen,
  reloadFreezeState,
  getCanonFreezeState,
  readCanonBaseline,
} from "../nova-studio/server/runtime/canonFreeze.mjs";
import { writeCommunicationCanon } from "../nova-studio/server/runtime/canonGenerator.mjs";
import { diffCommunicationCanon } from "../nova-studio/server/runtime/communicationCanon.mjs";
import { splitLane } from "../nova-studio/server/runtime/communicationTopology.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const GOV_DIR = path.join(REPO_ROOT, ".runtime/communication-governance");

function clearCanonFreezeArtifacts() {
  const paths = [
    path.join(GOV_DIR, "canon-freeze.json"),
    path.join(GOV_DIR, "canon-freeze-ticks.jsonl"),
    path.join(GOV_DIR, "COMM-CANON@1.0.0.md"),
    path.join(GOV_DIR, "constitution.runtime.json"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  reloadFreezeState();
}

test.beforeEach(() => {
  clearCanonFreezeArtifacts();
});

test.afterEach(() => {
  clearCanonFreezeArtifacts();
});

test("freezeCommunicationCanon seals v1.0.0 with hash and ledger tick", async () => {
  const result = await freezeCommunicationCanon("jon", "1.0.0");

  assert.equal(result.freezeState.canon_state, "FROZEN");
  assert.equal(result.freezeState.canon_version, "1.0.0");
  assert.equal(result.freezeTick.entry_type, "communicationCanonFreezeTick");
  assert.equal(result.freezeTick.operator_id, "jon");
  assert.equal(result.hash, hashCanonMarkdown(result.markdown));
  assert.ok(result.markdown.includes("SEALED"));
  assert.ok(fs.existsSync(result.freezeState.baseline_path));
  assert.ok(isCanonFrozen());

  const freezeMeta = getCanonFreezeState();
  assert.equal(freezeMeta.required_amendment, "AAIS-COMM-Î›-003");
  assert.equal(freezeMeta.baseline_id, "COMM-CANON@1.0.0");
});

test("guardCanonMutation blocks writes while frozen", async () => {
  await freezeCommunicationCanon("jon", "1.0.0");

  assert.throws(
    () => guardCanonMutation("writeCommunicationCanon"),
    /Canon is FROZEN/,
  );

  await assert.rejects(
    () => writeCommunicationCanon(),
    /Canon is FROZEN/,
  );
});

test("guardCanonMutation allows unlock with AAIS-COMM-Î›-003", async () => {
  await freezeCommunicationCanon("jon", "1.0.0");

  assert.doesNotThrow(() =>
    guardCanonMutation("applyConstitutionUpdate", { amendment_unlock: "AAIS-COMM-Î›-003" }),
  );
});

test("diffCommunicationCanon uses frozen baseline mode", async () => {
  await freezeCommunicationCanon("jon", "1.0.0");
  const baseline = readCanonBaseline("1.0.0");
  assert.ok(baseline);

  const diff = diffCommunicationCanon(false);
  assert.equal(diff.mode, "frozen_baseline");
  assert.equal(diff.baseline_id, "COMM-CANON@1.0.0");
});

test("splitLane blocked without amendment while frozen", async () => {
  await freezeCommunicationCanon("jon", "1.0.0");

  assert.throws(
    () =>
      splitLane({
        source_lane_id: "jon-darz-spec",
        new_lanes: [{ lane_id: "jon-darz-spec-b", label: "Spec B" }],
        operator_id: "jon",
      }),
    /Canon is FROZEN/,
  );
});
