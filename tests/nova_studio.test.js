import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  bootStudioRuntime,
  clearLedger,
  appendReceipt,
  computeLiveMetrics,
  getNovaRuntimeState,
  getStudioState,
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
import {
  handleStudioEventsUpgrade,
  parseWebSocketFrame,
} from "../nova-studio/server/runtime/events.mjs";
import { getNovaStateData } from "../api/state/nova.mjs";
import { runSlice } from "../substrate/runSlice.mjs";
import { loadContinuityState } from "../services/continuityService.mjs";
import { loadDriftPoints } from "../services/driftService.mjs";
import { loadLedgerReceipts } from "../services/ledgerService.mjs";
import { getSubstratePayload } from "../nova-studio/server/runtime/substrateState.mjs";
import {
  appendCommunicationGovernanceTick,
  appendCommunicationTick,
  freezeCommunicationCanon,
  getCommunicationState,
  getParsedCommunicationCanon,
  listCommunicationTicks,
  replayCommunication,
} from "../runtime/communication/communicationRuntime.mjs";
import { upsertLaneContract } from "../runtime/communication/laneRegistry.mjs";
import { reloadFreezeState } from "../nova-studio/server/runtime/canonFreeze.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const specimenRuntime = path.join(__dirname, "..", ".runtime", "nova-studio-test");
const communicationCanonPath = path.join(__dirname, "..", "governance", "communication", "COMM-CANON.md");
const communicationGovDir = path.join(__dirname, "..", ".runtime", "communication-governance");

function readOptionalFile(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function restoreOptionalFile(filePath, contents) {
  if (contents === null) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return;
  }
  fs.writeFileSync(filePath, contents, "utf8");
}

function clearCommunicationFreezeArtifacts() {
  for (const name of [
    "canon-freeze.json",
    "canon-freeze-ticks.jsonl",
    "COMM-CANON@1.0.0.md",
    "constitution.runtime.json",
  ]) {
    const artifactPath = path.join(communicationGovDir, name);
    if (fs.existsSync(artifactPath)) fs.unlinkSync(artifactPath);
  }
  reloadFreezeState();
}

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

test("studio state exposes live stance strip, wave, DAR-Z, lineage, and replay checkpoints", () => {
  clearLedger();
  appendReceipt({
    id: "REC-STUDIO-PHASE1",
    slice: "nova",
    intent: { type: "phase-1" },
    output: "alive",
    phase: "complete",
    laws: { allowed: true, violations: [] },
  });

  const state = getStudioState();
  assert.equal(state.stanceStrip.ledger, "live");
  assert.equal(state.stanceStrip.receiptCount, 1);
  assert.ok(state.wave);
  assert.ok(state.darz);
  assert.ok(state.lineage);
  assert.equal(state.replayCheckpoints.length, 1);
  assert.equal(state.replayCheckpoints[0].receiptId, "REC-STUDIO-PHASE1");

  const novaState = getNovaRuntimeState();
  const apiState = getNovaStateData();
  assert.equal(novaState.runtime_id, "nova-rt-001");
  assert.equal(apiState.runtime_id, "nova-rt-001");
  assert.equal(novaState.stance.operator_id, "op-001");
  assert.equal(apiState.stance.operator_id, "op-001");
  assert.equal(novaState.stance.stance, "monitoring");
  assert.equal(novaState.waves.length, 1);
  assert.equal(apiState.waves.length, 1);
  assert.equal(novaState.waves[0].runtime_id, "nova-rt-001");
  assert.equal(novaState.waves[0].phase, "act");
  assert.equal(novaState.folds[0].receipts[0], "REC-STUDIO-PHASE1");
});

test("studio event websocket emits contract envelopes for stance, event, and wave", async () => {
  clearLedger();
  const server = http.createServer();
  server.on("upgrade", (req, socket, head) => {
    if (req.url === "/events") {
      handleStudioEventsUpgrade(req, socket, head);
      return;
    }
    socket.destroy();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  let socket;

  try {
    socket = await openRawWebSocket(port, "/events");
    const initial = await readWebSocketJson(socket);
    assert.equal(initial.type, "stance");
    assert.equal(initial.runtime_id, "nova-rt-001");
    assert.equal(initial.payload.operator_id, "op-001");
    assert.equal(initial.payload.stance, "idle");

    appendReceipt({
      id: "REC-STUDIO-WS",
      slice: "nova",
      intent: { type: "ws" },
      output: "event",
      phase: "complete",
      laws: { allowed: true, violations: [] },
    });

    const update = await readWebSocketJson(socket);
    assert.equal(update.type, "event");
    assert.equal(update.runtime_id, "nova-rt-001");
    assert.equal(update.payload.event_type, "receipt_appended");
    assert.equal(update.payload.receipt_id, "REC-STUDIO-WS");

    const wave = await readWebSocketJson(socket);
    assert.equal(wave.type, "wave");
    assert.equal(wave.payload.phase, "act");
    assert.equal(wave.payload.runtime_id, "nova-rt-001");
  } finally {
    if (socket) {
      await closeRawSocket(socket);
    }
    await closeTestServer(server);
  }
});

test("run slice executes capability, appends receipt, continuity, and drift", async () => {
  clearLedger();
  const startState = { checkpoint: "00000", events: [] };

  const result = await runSlice({
    operator: "operator:test",
    capabilityId: "slice_math",
    input: { value: 41 },
    continuityState: startState,
  });

  assert.equal(result.output.status, "ok");
  assert.equal(result.output.capabilityId, "slice_math");
  assert.equal(result.value.value, 42);
  assert.equal(result.continuity.checkpoint, "00003");
  assert.deepEqual(
    result.continuity.events.map((event) => event.kind),
    ["EVENT", "DECISION", "ARTIFACT"],
  );
  assert.equal(result.continuity.events[1].receiptId, result.output.id);

  const receipts = await loadLedgerReceipts();
  assert.ok(receipts.some((receipt) => receipt.id === result.output.id));

  const persistedContinuity = await loadContinuityState();
  assert.equal(persistedContinuity.checkpoint, "00003");

  const drift = await loadDriftPoints();
  assert.ok(drift.some((point) => point.actual === 42 && point.expected === 42));

  const substrate = await getSubstratePayload();
  assert.ok(substrate.capabilities.some((cap) => cap.id === "slice_math"));
  assert.ok(substrate.receipts.some((receipt) => receipt.id === result.output.id));
  assert.ok(substrate.continuity.some((event) => event.kind === "ARTIFACT"));
});

test("communication ticks are lane-scoped, budgeted, replayable, and canon-bound", async () => {
  const canonBefore = readOptionalFile(communicationCanonPath);
  clearCommunicationFreezeArtifacts();

  try {
  const laneId = `test-comm-${Date.now()}`;
  upsertLaneContract({
    lane_id: laneId,
    participants: ["jon", "darz"],
    allowed_categories: ["human"],
    allowed_altitudes: ["human"],
    max_impact: "none",
    human_bandwidth: "high",
    continuity_budget: {
      max_composite: 0.5,
      session_budget: 1,
      session_spent: 0,
      reset_policy: "per-epoch",
    },
    drift_thresholds: { warn: 0.05, notify: 0.15, contain: 0.3, fail_closed: 0.5 },
    comm_constitution_version: "1.0.0",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  });

  const result = appendCommunicationTick({
    entry_type: "communicationTick",
    lane_id: laneId,
    direction: "jon->darz",
    category: "human",
    altitude: "human",
    impact: "none",
    core_claim: "Testing governed communication lane isolation.",
    required_action: "none",
    targets: [],
    latency: "whenever",
    drift_vector: { semantic: 0, altitude: 0, impact: 0, latency: 0, composite: 0.02 },
  });

  assert.equal(result.status, "ok");
  assert.equal(result.tick.lane_id, laneId);
  assert.equal(result.tick.comm_constitution_version, "1.0.0");
  assert.ok(result.sideEffects.some((entry) => entry.entry_type === "communicationBudgetTick"));

  const governance = appendCommunicationGovernanceTick({
    communication_id: result.tick.id,
    decision_type: "ack",
    rationale: "test acknowledgement",
    operator_id: "jon",
    receipts: [],
  });
  assert.equal(governance.entry_type, "communicationGovernanceTick");

  const filtered = listCommunicationTicks({ lane_id: laneId });
  assert.ok(filtered.some((tick) => tick.id === result.tick.id));
  const replayed = replayCommunication({ lane_id: laneId });
  assert.ok(replayed.some((tick) => tick.id === result.tick.id));

  const state = getCommunicationState();
  assert.ok(state.lanes.some((lane) => lane.lane_id === laneId));
  assert.ok(state.epochs.some((epoch) => epoch.lane_id === laneId));
  assert.ok(state.continuity.communication_drift >= 0);

  const parsed = await getParsedCommunicationCanon();
  assert.ok(parsed["ACTIVE LANES"]);
  const frozen = await freezeCommunicationCanon("jon");
  assert.match(frozen.hash, /^sha256:/);
  assert.equal(frozen.tick.entry_type, "communicationCanonFreezeTick");
  } finally {
    restoreOptionalFile(communicationCanonPath, canonBefore);
    clearCommunicationFreezeArtifacts();
  }
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

function openRawWebSocket(port, route) {
  return new Promise((resolve, reject) => {
    const key = Buffer.from("nova-studio-phase-1").toString("base64").slice(0, 24);
    const socket = new net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("Timed out waiting for WebSocket handshake"));
    }, 2000);
    socket.__wsBuffer = Buffer.alloc(0);
    socket.__wsMessages = [];
    socket.__wsResolvers = [];
    socket.once("error", reject);
    socket.connect(port, "127.0.0.1", () => {
      socket.write(
        [
          `GET ${route} HTTP/1.1`,
          `Host: 127.0.0.1:${port}`,
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Key: ${key}`,
          "Sec-WebSocket-Version: 13",
          "\r\n",
        ].join("\r\n"),
      );
    });
    let buffer = Buffer.alloc(0);
    socket.on("data", function onHandshake(chunk) {
      buffer = Buffer.concat([buffer, chunk]);
      const marker = buffer.indexOf("\r\n\r\n");
      if (marker === -1) return;
      const header = buffer.subarray(0, marker).toString("utf8");
      if (!header.includes("101 Switching Protocols")) {
        clearTimeout(timer);
        reject(new Error(header));
        return;
      }
      clearTimeout(timer);
      socket.off("data", onHandshake);
      const rest = buffer.subarray(marker + 4);
      socket.on("data", (chunk) => queueWebSocketData(socket, chunk));
      if (rest.length) queueWebSocketData(socket, rest);
      resolve(socket);
    });
  });
}

function readWebSocketJson(socket) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for WebSocket frame")), 2000);
    if (socket.__wsMessages.length) {
      clearTimeout(timer);
      resolve(JSON.parse(socket.__wsMessages.shift()));
      return;
    }
    socket.once("error", reject);
    socket.__wsResolvers.push((message) => {
      clearTimeout(timer);
      resolve(JSON.parse(message));
    });
  });
}

function closeRawSocket(socket) {
  return new Promise((resolve) => {
    if (socket.destroyed) {
      resolve();
      return;
    }
    socket.once("close", resolve);
    socket.end();
    setTimeout(() => {
      if (!socket.destroyed) socket.destroy();
      resolve();
    }, 100);
  });
}

function closeTestServer(server) {
  return new Promise((resolve) => {
    server.closeAllConnections?.();
    server.close(() => resolve());
    setTimeout(resolve, 100);
  });
}

function queueWebSocketData(socket, chunk) {
  socket.__wsBuffer = Buffer.concat([socket.__wsBuffer, chunk]);
  let frame;
  while ((frame = parseWebSocketFrame(socket.__wsBuffer))?.message) {
    socket.__wsBuffer = socket.__wsBuffer.subarray(frame.bytesRead);
    const resolver = socket.__wsResolvers.shift();
    if (resolver) {
      resolver(frame.message);
    } else {
      socket.__wsMessages.push(frame.message);
    }
  }
}
