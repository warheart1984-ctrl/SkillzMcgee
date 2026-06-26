/**
 * Federated constellation — Nova, AAES, URG, FOS, CAB as connected runtime peers.
 */

import { bootFederatedNode, foldFederatedSingularity } from "../../../src/federation/frs.js";
import { createEnvelopeFromIdentity } from "../../../src/federation/frs_exchange/index.js";
import { getLedger, computeLiveMetrics, bootStudioRuntime } from "./studioRuntime.mjs";
import { renderCosmicSnapshotDay11 } from "../../../src/cosmic/cosmic_snapshot.js";

const RUNTIMES = ["nova", "aaes", "urg", "fos", "cab"];

/**
 * @typedef {Object} RuntimePeer
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {"online"|"standby"|"offline"} status
 * @property {string|null} lastEnvelope
 * @property {number} receiptCount
 */

/** @type {Map<string, object>} */
const peerState = new Map();

function initPeers() {
  if (peerState.size > 0) return;
  const defs = [
    { id: "nova", name: "Nova Runtime", role: "Cognitive engine + governed pipeline" },
    { id: "aaes", name: "AAES CRK-1", role: "Constitutional kernel + invariant evaluation" },
    { id: "urg", name: "URG Substrate", role: "Universal runtime ground + continuity anchor" },
    { id: "fos", name: "FOS Founder Cognition", role: "Original cognitive seed + narrative continuity" },
    { id: "cab", name: "CAB Lineage", role: "Continuity archive backbone + specimen vault" },
  ];
  for (const d of defs) {
    peerState.set(d.id, { ...d, status: "online", lastEnvelope: null, receiptCount: 0 });
  }
}

/**
 * Exchange continuity envelope between local Nova and a peer runtime.
 * @param {string} peerId
 */
export function exchangeWithPeer(peerId) {
  initPeers();
  if (!RUNTIMES.includes(peerId)) {
    throw new Error(`Unknown runtime: ${peerId}`);
  }

  bootStudioRuntime();
  const ledger = getLedger();
  const metrics = computeLiveMetrics();

  const { identity, continuity } = bootFederatedNode();
  const asOmega = foldFederatedSingularity(ledger, identity, continuity);

  const envelope = createEnvelopeFromIdentity(identity, "snapshot", {
    peer: peerId,
    merkleRoot: asOmega.merkle?.globalRoot,
    fingerprint: asOmega.fingerprint,
    receiptCount: ledger.length,
    metrics: {
      coherence: metrics.coherence,
      lawfulness: metrics.lawfulness,
      drift: metrics.drift,
    },
  });

  const peer = peerState.get(peerId);
  peer.lastEnvelope = envelope.senderId ?? `ENV-${Date.now()}`;
  peer.receiptCount = ledger.length;
  peer.status = "online";

  let peerPayload = {};
  switch (peerId) {
    case "aaes":
      peerPayload = { kernel: "CRK-1", invariants: 12, posture: "constitutional" };
      break;
    case "urg":
      peerPayload = { substrate: "URG", globalRoot: asOmega.merkle?.globalRoot };
      break;
    case "fos":
      peerPayload = { narrative: renderCosmicSnapshotDay11().slice(0, 200) };
      break;
    case "cab":
      peerPayload = { archive: "CAB", specimens: "nova-studio/.runtime/specimens" };
      break;
    default:
      peerPayload = { runtime: "nova-studio", pipeline: "governed" };
  }

  return {
    from: "nova",
    to: peerId,
    envelope,
    peerResponse: peerPayload,
    constellation: getConstellation(),
  };
}

export function getConstellation() {
  initPeers();
  bootStudioRuntime();
  const ledger = getLedger();
  const nova = peerState.get("nova");
  nova.receiptCount = ledger.length;

  return {
    peers: [...peerState.values()],
    exchanges: ["receipts", "invariants", "continuity_threads", "law_surfaces"],
    coherence: computeLiveMetrics().coherence,
  };
}

export function broadcastConstellation() {
  return RUNTIMES.filter((id) => id !== "nova").map((id) => exchangeWithPeer(id));
}
