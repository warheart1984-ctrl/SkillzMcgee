import test from "node:test";
import assert from "node:assert/strict";

test("continuity fold includes communication_drift", async () => {
  const { computeContinuityMetrics, evaluateContinuity } = await import(
    "../nova-studio/server/runtime/continuityFold.mjs"
  );
  const metrics = computeContinuityMetrics();
  assert.equal(typeof metrics.communication_drift, "number");
  assert.equal(typeof metrics.continuity_score, "number");
  const evalResult = evaluateContinuity(metrics);
  assert.ok(["OK", "WARN", "NOTIFY", "CONTAINMENT_EPOCH", "FAIL_CLOSED"].includes(evalResult.state));
});

test("communication kill switch halts IO", async () => {
  const { activateCommunicationKillSwitch, deactivateCommunicationKillSwitch, guardCommunicationIO } =
    await import("../nova-studio/server/runtime/communicationControl.mjs");
  activateCommunicationKillSwitch("operator:test", "test halt");
  assert.throws(() => guardCommunicationIO(), /Kill Switch/);
  deactivateCommunicationKillSwitch("operator:test", "test release");
  assert.doesNotThrow(() => guardCommunicationIO());
});

test("spec lane reroutes human category", async () => {
  const { routeMessage } = await import(
    "../nova-studio/server/runtime/communicationEnforcement.mjs"
  );
  const { getLane } = await import("../nova-studio/server/runtime/communicationGovernance.mjs");
  const lane = getLane("jon-darz-spec");
  assert.ok(lane);
  const tick = routeMessage(
    {
      lane_id: "jon-darz-spec",
      category: "human",
      core_claim: "venting",
      timestamp: new Date().toISOString(),
    },
    lane,
  );
  assert.equal(tick.lane_id, "jon-darz-human");
  assert.equal(tick.rerouted_from, "jon-darz-spec");
});

test("epoch tracks session_spent on tick", async () => {
  const { ensureActiveEpoch, recordTickInEpoch } = await import(
    "../nova-studio/server/runtime/communicationEpochs.mjs"
  );
  const epoch = ensureActiveEpoch("jon-darz-human");
  assert.equal(epoch.status, "ACTIVE");
  const updated = recordTickInEpoch("jon-darz-human", 0.05);
  assert.ok(updated.session_spent >= 0.05);
  assert.equal(updated.ticks_count, epoch.ticks_count + 1);
});

test("cross-lane invariants registry includes X-1 X-2 X-3", async () => {
  const { getCrossLaneInvariantRegistry } = await import(
    "../nova-studio/server/runtime/communicationInvariants.mjs"
  );
  const registry = getCrossLaneInvariantRegistry();
  const ids = registry.map((r) => r.invariant_id);
  assert.ok(ids.includes("X-1"));
  assert.ok(ids.includes("X-2"));
  assert.ok(ids.includes("X-3"));
});

test("communication canon generates living artifact", async () => {
  const { regenerateCommunicationCanon } = await import(
    "../nova-studio/server/runtime/communicationCanon.mjs"
  );
  const canon = await regenerateCommunicationCanon();
  assert.equal(canon.doc_id, "COMM-CANON");
  assert.ok(Array.isArray(canon.lanes));
  assert.ok(canon.continuity_fold);
});

test("canGenerateReply blocks high projected drift", async () => {
  const { canGenerateReply } = await import(
    "../nova-studio/server/runtime/communicationEnforcement.mjs"
  );
  const { getLane } = await import("../nova-studio/server/runtime/communicationGovernance.mjs");
  const lane = getLane("jon-darz-spec");
  const result = canGenerateReply(lane, { composite: 0.4 }, {
    category: "human",
    altitude: "human",
    impact: "ops",
    projected_drift: 0.55,
  });
  assert.equal(result.ok, false);
});
