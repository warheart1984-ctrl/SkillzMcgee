/**
 * Steward Council quorum — SCC-1.0 computable invariants.
 *
 * quorum_required = ceil(2/3 * active_stewards)
 * approval_required = ceil(3/4 * votes_cast)  (when votes_cast > 0)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const STEWARDS_PATH = path.join(REPO_ROOT, "governance/ledger/stewards.json");

const DEFAULT_STEWARDS = [
  { id: "sc:council-genesis", name: "Council Genesis", online: true },
  { id: "sc:chair", name: "Council Chair", online: true },
  { id: "sc:auditor", name: "Council Auditor", online: true },
  { id: "sc:operator", name: "Council Operator", online: true },
  { id: "sc:archivist", name: "Council Archivist", online: true },
];

function loadStewards() {
  try {
    if (!fs.existsSync(STEWARDS_PATH)) return DEFAULT_STEWARDS;
    const raw = JSON.parse(fs.readFileSync(STEWARDS_PATH, "utf8"));
    return Object.entries(raw).map(([id, meta]) => ({
      id,
      name: meta.name ?? id,
      publicKey: meta.publicKey ?? null,
      online: meta.online !== false,
    }));
  } catch {
    return DEFAULT_STEWARDS;
  }
}

export function quorumRequired(activeCount) {
  return Math.ceil((2 / 3) * Math.max(activeCount, 1));
}

export function approvalRequired(votesCast) {
  if (votesCast <= 0) return 1;
  return Math.ceil((3 / 4) * votesCast);
}

/**
 * @param {object} opts
 * @param {Array<{vote:string}>} [opts.votes]
 * @param {Array<{id:string, online?:boolean}>} [opts.stewards]
 */
export function computeQuorumState(opts = {}) {
  const stewards = opts.stewards ?? loadStewards();
  const active = stewards.filter((s) => s.online !== false);
  const activeCount = active.length;
  const required = quorumRequired(activeCount);
  const votes = opts.votes ?? [];
  const votesCast = votes.length;
  const votesFor = votes.filter((v) => v.vote === "approve").length;
  const votesAgainst = votes.filter((v) => v.vote === "reject").length;
  const votesDefer = votes.filter((v) => v.vote === "defer").length;
  const approveNeeded = approvalRequired(votesCast);

  const presenceMet = activeCount >= required;
  const participationMet = votesCast >= required;
  const approvalMet = votesCast > 0 && votesFor >= approveNeeded;

  let status = "red";
  if (presenceMet && participationMet && approvalMet) status = "green";
  else if (presenceMet && (participationMet || votesCast > 0)) status = "yellow";

  return {
    version: "SCC-1.0",
    council_size: stewards.length,
    active_stewards: activeCount,
    quorum_required: required,
    votes_cast: votesCast,
    votes_for: votesFor,
    votes_against: votesAgainst,
    votes_defer: votesDefer,
    approval_required: approveNeeded,
    presence_met: presenceMet,
    participation_met: participationMet,
    approval_met: approvalMet,
    met: presenceMet && participationMet,
    can_vote: presenceMet,
    can_approve: presenceMet && participationMet && approvalMet,
    status,
    stewards: active.map((s) => ({ id: s.id, name: s.name, online: s.online !== false })),
    formula: {
      quorum: "ceil(2/3 * active_stewards)",
      approval: "votes_for >= ceil(3/4 * votes_cast)",
    },
  };
}

export function assertQuorumForLedgerWrite(stewards = loadStewards()) {
  const state = computeQuorumState({ stewards, votes: [] });
  if (!state.presence_met) {
    throw new Error(
      `Quorum not met: ${state.active_stewards}/${state.quorum_required} active stewards required`,
    );
  }
  return state;
}

export { loadStewards };
