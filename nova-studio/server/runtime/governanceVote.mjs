/**
 * Steward Council voting — GLS-1.0 ledger append with signature support.
 */

import crypto from "node:crypto";
import { appendEntry, readLedger } from "../../../tools/generators/gls-lib.mjs";
import { assertQuorumForLedgerWrite, computeQuorumState, loadStewards } from "./quorum.mjs";

function nextEntryId() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const entries = readLedger();
  const todayEntries = entries.filter((e) => e.entry_id?.includes(today));
  const seq = String(todayEntries.length).padStart(3, "0");
  return `GLS-${today}-${seq}`;
}

function verifyEd25519Signature(publicKeyB64, message, signatureB64) {
  try {
    const key = crypto.createPublicKey({
      key: Buffer.from(publicKeyB64, "base64"),
      format: "der",
      type: "spki",
    });
    return crypto.verify(
      null,
      Buffer.from(message, "utf8"),
      key,
      Buffer.from(signatureB64, "base64"),
    );
  } catch {
    return false;
  }
}

export function submitGovernanceVote(body) {
  const {
    steward_id,
    decision,
    decision_type = "release_vote",
    subject,
    rationale = [],
    evidence_refs = [],
    continuity_checkpoint,
    signature,
    public_key,
    inputs = {},
  } = body;

  if (!steward_id) throw new Error("steward_id required");
  if (!["approve", "reject", "defer"].includes(decision)) {
    throw new Error("decision must be approve | reject | defer");
  }
  if (!Array.isArray(rationale) || rationale.length === 0) {
    throw new Error("rationale required (non-empty array)");
  }

  const stewards = loadStewards();
  assertQuorumForLedgerWrite(stewards);

  const votePayload = {
    steward_id,
    vote: decision,
    notes: subject ?? "",
    evidence_refs,
    continuity_checkpoint: continuity_checkpoint ?? new Date().toISOString(),
    signature: signature ?? null,
  };

  if (signature && public_key) {
    const message = JSON.stringify({
      steward_id,
      decision,
      subject,
      rationale,
      evidence_refs,
      continuity_checkpoint,
    });
    votePayload.signature_valid = verifyEd25519Signature(public_key, message, signature);
  }

  const entry = appendEntry({
    entry_id: nextEntryId(),
    timestamp: new Date().toISOString(),
    decision_type,
    inputs: {
      subject,
      evidence_refs,
      continuity_checkpoint,
      ...inputs,
    },
    decision,
    rationale,
    steward_votes: [votePayload],
  });

  const ledger = readLedger();
  const releaseVotes = ledger.filter((e) => e.decision_type === "release_vote");
  const last = releaseVotes.at(-1);
  const votes = last?.steward_votes ?? [];
  const quorum = computeQuorumState({ stewards, votes });

  return {
    entry,
    quorum: {
      ...quorum,
      required: quorum.quorum_required,
      council_size: quorum.council_size,
      approve_count: quorum.votes_for,
      met: quorum.participation_met && quorum.approval_met,
    },
  };
}
