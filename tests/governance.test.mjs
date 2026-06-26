import test from "node:test";
import assert from "node:assert/strict";

import { ContinuityLedger } from "../src/governance/continuityLedger.js";
import { validateEntry } from "../src/governance/validator.js";
import { reduceLedger } from "../src/governance/reducer.js";
import {
  bootGovernedRuntime,
  appendGovernedReceipt,
  getRuntime,
  _resetRuntimeForTests,
} from "../src/runtime/boot.js";
import { clearReceipts } from "../src/nova/receipts.js";

function sampleReceipt(id, slice = "nova") {
  return {
    id,
    timestamp: new Date().toISOString(),
    actor: "skillz",
    slice,
    intent: { type: slice, text: "test" },
    output: "ok",
    status: "ok",
    laws: { allowed: true },
  };
}

test("ledger is append-only and rejects duplicate ids", () => {
  const ledger = new ContinuityLedger();
  ledger.append(sampleReceipt("r1"));
  assert.throws(() => ledger.append(sampleReceipt("r1")), /K1: duplicate receipt id/);
  assert.equal(ledger.all().length, 1);
});

test("validator rejects malformed receipts", () => {
  assert.throws(() => validateEntry({}), /K0/);
  assert.throws(
    () =>
      validateEntry({
        id: "x",
        timestamp: "t",
        slice: "nova",
        status: "error",
        output: null,
        laws: { allowed: false },
      }),
    /violations/
  );
});

test("reducer is deterministic from ledger order", () => {
  const ledger = new ContinuityLedger();
  ledger.append({ ...sampleReceipt("a"), output: "first" });
  ledger.append({ ...sampleReceipt("b"), output: "second" });
  const state = reduceLedger(ledger.all());
  assert.equal(state.nova.lastOutput, "second");
  assert.equal(state.nova.lastRunId, "b");
});

test("boot rebuilds accumulator from persisted receipts", () => {
  _resetRuntimeForTests();
  const rt = bootGovernedRuntime([
    sampleReceipt("persist-1"),
    { ...sampleReceipt("persist-2"), output: "rebuilt" },
  ]);
  assert.equal(rt.accumulator.getSliceState("nova").lastOutput, "rebuilt");
  assert.equal(rt.ledger.all().length, 2);
});

test("appendGovernedReceipt validates before append", async () => {
  _resetRuntimeForTests();
  bootGovernedRuntime([]);
  await assert.rejects(
    () =>
      appendGovernedReceipt(
        { type: "nova", text: "bad" },
        null,
        { allowed: false }
      ),
    /violations/
  );
  const entry = await appendGovernedReceipt(
    { type: "nova", text: "test" },
    "ok",
    { allowed: true }
  );
  assert.match(entry.id, /^REC-NOVA-/);
  assert.equal(getRuntime().ledger.all().length, 1);
});

test("clearReceipts resets runtime and storage", async () => {
  _resetRuntimeForTests();
  bootGovernedRuntime([]);
  await appendGovernedReceipt(
    { type: "nova", text: "test" },
    "ok",
    { allowed: true }
  );
  assert.equal(getRuntime().ledger.all().length, 1);
  await clearReceipts();
  assert.equal(getRuntime().ledger.all().length, 0);
  assert.equal(getRuntime().singularity?.receiptCount ?? 0, 0);
});
