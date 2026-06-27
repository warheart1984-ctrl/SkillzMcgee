import test from "node:test";
import assert from "node:assert/strict";

test("communicationTick requires lane_id", async () => {
  const { appendCommunicationTick } = await import(
    "../nova-studio/server/runtime/communicationLedger.mjs"
  );
  assert.throws(
    () =>
      appendCommunicationTick({
        entry_type: "communicationTick",
        direction: "darz->jon",
        category: "normative",
        core_claim: "test",
      }),
    /lane_id is mandatory/,
  );
});

test("communicationTick stamps comm_constitution_version and drift_vector", async () => {
  const { appendCommunicationTick } = await import(
    "../nova-studio/server/runtime/communicationLedger.mjs"
  );
  const record = appendCommunicationTick({
    entry_type: "communicationTick",
    lane_id: "jon-darz-architecture",
    direction: "darz->jon",
    category: "normative",
    core_claim: "invariant check",
    impact: "spec",
    required_action: "review",
    targets: [],
    altitude: "constitutional",
    latency: "whenever",
  });
  assert.equal(record.comm_constitution_version, "1.0.0");
  assert.ok(record.drift_vector);
  assert.equal(typeof record.drift_vector.composite, "number");
  assert.equal(record.drift_vector.composite, 0);
});

test("drift_vector composite triggers containment thresholds", async () => {
  const { computeDriftVector, evaluateDriftContainment } = await import(
    "../nova-studio/server/runtime/communicationGovernance.mjs"
  );
  const { getLane } = await import(
    "../nova-studio/server/runtime/communicationGovernance.mjs"
  );
  const lane = getLane("jon-darz-architecture");
  const tick = {
    category: "human",
    altitude: "human",
    impact: "ops",
  };
  const violations = [{ type: "communicationCorridorDrift" }];
  const vector = computeDriftVector(tick, lane, violations);
  assert.ok(vector.composite > 0.05);
  const action = evaluateDriftContainment(vector);
  assert.ok(["warning", "notify_operator", "containment_epoch", "fail_closed"].includes(action));
});

test("corridor drift logged for out-of-corridor category", async () => {
  const { appendCommunicationTick } = await import(
    "../nova-studio/server/runtime/communicationLedger.mjs"
  );
  const record = appendCommunicationTick({
    entry_type: "communicationTick",
    lane_id: "jon-darz-spec",
    direction: "darz->jon",
    category: "human",
    core_claim: "venting in spec lane",
    impact: "neither",
    required_action: "none",
    targets: [],
    altitude: "human",
    latency: "whenever",
  });
  assert.equal(record.lane_id, "jon-darz-human");
  assert.equal(record.rerouted_from, "jon-darz-spec");
});

test("identity drift on cross-lane source without receipt", async () => {
  const { appendCommunicationTick } = await import(
    "../nova-studio/server/runtime/communicationLedger.mjs"
  );
  const record = appendCommunicationTick({
    entry_type: "communicationTick",
    lane_id: "jon-darz-architecture",
    source_lane_id: "jon-internal",
    direction: "darz->jon",
    category: "normative",
    core_claim: "copied spec",
    impact: "spec",
    required_action: "review",
    targets: [],
    altitude: "constitutional",
    latency: "whenever",
  });
  assert.equal(record.corridor_status, "identity_drift");
});

test("lane-scoped queries reject global fetch", async () => {
  const { listCommunicationTicksFiltered } = await import(
    "../nova-studio/server/runtime/communicationGovernance.mjs"
  );
  assert.throws(
    () => listCommunicationTicksFiltered({ governanceOverride: false }),
    /lane_id required/,
  );
});

test("amendment propose and approve flow", async () => {
  const { proposeAmendment, approveAmendment, getConstitutionVersion } = await import(
    "../nova-studio/server/runtime/communicationGovernance.mjs"
  );
  const before = getConstitutionVersion();
  const proposal = proposeAmendment({
    proposal: { change: "test corridor tweak" },
    affected_lanes: ["jon-darz-architecture"],
  });
  assert.equal(proposal.decision_type, "propose-amendment");
  const approval = approveAmendment({ proposal_id: proposal.id });
  assert.equal(approval.decision_type, "approve-amendment");
  assert.ok(getConstitutionVersion() >= before);
});

test("GET communication lanes returns jon-darz-architecture", async () => {
  const { listLanes, getLaneContext } = await import(
    "../nova-studio/server/runtime/communicationGovernance.mjs"
  );
  const lanes = listLanes();
  assert.ok(lanes.some((l) => l.lane_id === "jon-darz-architecture"));
  const ctx = getLaneContext("jon-darz-architecture");
  assert.ok(ctx.corridor_summary.includes("normative"));
});
