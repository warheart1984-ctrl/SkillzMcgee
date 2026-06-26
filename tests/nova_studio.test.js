import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  bootStudioRuntime,
  clearLedger,
  appendReceipt,
  computeLiveMetrics,
  RUNTIME_DIR,
} from "../nova-studio/server/runtime/studioRuntime.mjs";
import { runGovernedPipeline } from "../nova-studio/server/runtime/governedPipeline.mjs";
import { executeCapability } from "../nova-studio/server/runtime/capabilities.mjs";
import {
  exportSpecimen,
  importSpecimen,
  replaySpecimen,
  verifySpecimen,
} from "../nova-studio/server/runtime/specimen.mjs";
import { getConstellation, exchangeWithPeer } from "../nova-studio/server/runtime/constellation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specimenRuntime = path.join(__dirname, "..", ".runtime", "nova-studio-test");

test("governed pipeline produces intent→plan→reasoning→capabilities→receipts", async () => {
  clearLedger();
  const result = await runGovernedPipeline({
    prompt: "read organism.py and list files",
  });
  assert.ok(result.pipeline.intent);
  assert.ok(result.pipeline.plan);
  assert.ok(result.pipeline.reasoning);
  assert.ok(result.pipeline.final);
  assert.ok(result.capabilityTable.length >= 1);
  assert.match(result.pipeline.final.id, /^REC-STUDIO-/);
});

test("capability read_file returns workspace content", async () => {
  const result = await executeCapability("read_file", { path: "organism.py" });
  assert.equal(result.ok, true);
  assert.match(result.output.content, /governed_action/);
});

test("live metrics derive from ledger not static copy", () => {
  clearLedger();
  const empty = computeLiveMetrics();
  assert.equal(empty.receiptCount, 0);

  appendReceipt({
    slice: "nova",
    intent: { type: "test" },
    output: "ok",
    phase: "intent",
    laws: { allowed: true, violations: [] },
  });
  const withData = computeLiveMetrics();
  assert.equal(withData.receiptCount, 1);
  assert.ok(withData.lawfulness >= 0);
  assert.ok(withData.fingerprint);
});

test("specimen round-trip export import replay verify", () => {
  clearLedger();
  appendReceipt({
    slice: "nova",
    intent: { type: "specimen" },
    output: "bundle",
    phase: "complete",
    laws: { allowed: true, violations: [] },
  });

  const exported = exportSpecimen("test-roundtrip");
  assert.ok(fs.existsSync(exported.filePath));

  clearLedger();
  importSpecimen(exported.id);
  bootStudioRuntime();

  const replay = replaySpecimen(exported.id);
  assert.ok(replay.deterministic);
  assert.ok(replay.fingerprint);

  const verify = verifySpecimen(exported.id);
  assert.equal(verify.ok, true, verify.errors?.join("; "));
});

test("federation constellation connects five runtimes", () => {
  const constellation = getConstellation();
  assert.equal(constellation.peers.length, 5);
  const ids = constellation.peers.map((p) => p.id).sort();
  assert.deepEqual(ids, ["aaes", "cab", "fos", "nova", "urg"]);

  const exchange = exchangeWithPeer("aaes");
  assert.equal(exchange.to, "aaes");
  assert.ok(exchange.envelope);
  assert.ok(exchange.peerResponse.kernel);
});

test.after(() => {
  if (fs.existsSync(specimenRuntime)) {
    fs.rmSync(specimenRuntime, { recursive: true, force: true });
  }
});
