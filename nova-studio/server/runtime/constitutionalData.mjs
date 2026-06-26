/**
 * Constitutional artifact paths and loaders (Derived + Governance layers).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readLedger as readGlsLedger } from "../../../tools/generators/gls-lib.mjs";
import { readLedger as readGlLedger, validateLedger as validateGlLedger } from "../../../tools/generators/gl-lib.mjs";
import { getContinuityTimeline } from "./substrateState.mjs";
import { CONFORMANCE_PATHS } from "../../../tools/lib/conformance-paths.mjs";
import { computeQuorumState, loadStewards } from "./quorum.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../../..");

export const PATHS = {
  cor: CONFORMANCE_PATHS.cor,
  corMeta: CONFORMANCE_PATHS.corMeta,
  csr: CONFORMANCE_PATHS.csr,
  csrRegistry: CONFORMANCE_PATHS.csrRegistry,
  dra: CONFORMANCE_PATHS.dra,
  draMeta: CONFORMANCE_PATHS.draMeta,
  cavSpec: path.join(REPO_ROOT, "conformance/validation/CAV-1.0/spec.md"),
  ledger: path.join(REPO_ROOT, "governance/governance-ledger/ledger.jsonl"),
  glLedger: CONFORMANCE_PATHS.glLedger,
  proofGraph: CONFORMANCE_PATHS.graph,
  proofGraphIndex: CONFORMANCE_PATHS.graphIndex,
  continuity: path.join(REPO_ROOT, "runtime/continuity/timeline.json"),
  orc: path.join(REPO_ROOT, "meta/ORC-1.0.json"),
  rcd: path.join(REPO_ROOT, "meta/RCD-1.0.json"),
};

function readJsonSafe(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

export function loadCOR() {
  return readJsonSafe(PATHS.cor, readJsonSafe(PATHS.corMeta, { requirements: [], version: "COR-1.0" }));
}

export function loadCSR() {
  const canonical = readJsonSafe(PATHS.csr, null);
  if (canonical?.claims) return canonical;
  return readJsonSafe(PATHS.csrRegistry, { claims: {}, metadata: { version: "CSR-1.0" } });
}

export function loadDRA() {
  return readJsonSafe(PATHS.dra, readJsonSafe(PATHS.draMeta, { top_blockers: [], version: "DRA-1.0" }));
}

export function loadProofGraph() {
  return readJsonSafe(PATHS.proofGraph, readJsonSafe(PATHS.proofGraphIndex, {}));
}

export function loadGovernanceLedger() {
  const gl = readGlLedger();
  if (gl.length) return gl;
  return readGlsLedger();
}

export function loadContinuityTimeline() {
  const onDisk = readJsonSafe(PATHS.continuity, null);
  if (Array.isArray(onDisk) && onDisk.length) return onDisk;

  const live = getContinuityTimeline();
  try {
    fs.mkdirSync(path.dirname(PATHS.continuity), { recursive: true });
    fs.writeFileSync(PATHS.continuity, JSON.stringify(live, null, 2), "utf8");
  } catch {
    /* read-only env */
  }
  return live;
}

export function getAuditState() {
  return {
    cor: loadCOR(),
    csr: loadCSR(),
    dra: loadDRA(),
    ledger: loadGovernanceLedger(),
    continuity: loadContinuityTimeline(),
    proofGraph: loadProofGraph(),
    paths: {
      cor: PATHS.cor,
      csr: PATHS.csr,
      dra: PATHS.dra,
      ledger: PATHS.ledger,
      continuity: PATHS.continuity,
    },
  };
}

export function getPendingDecisions() {
  const dra = loadDRA();
  const orc = readJsonSafe(PATHS.orc, {});
  const rcd = readJsonSafe(PATHS.rcd, {});

  const blockers = (dra.top_blockers ?? []).slice(0, 5).map((b, i) => ({
    id: `pending:blocker-${i}`,
    subject: b.artifact_id,
    type: "release_blocker",
    summary: `Blocks ${(b.blocked_requirements ?? []).join(", ")}`,
    evidence_refs: [b.artifact_id, ...(b.blocked_provenance ?? [])],
    impact_score: b.impact_score,
  }));

  const releaseVote = {
    id: "pending:release-vote",
    subject: "operational_release_v1.0",
    type: "release_vote",
    summary: orc.summary ?? "Operational release readiness vote",
    evidence_refs: ["meta/COR-1.0.json", "meta/DRA-1.0.json", "meta/ORC-1.0.json"],
    rcd_status: rcd.status ?? "unknown",
  };

  return [releaseVote, ...blockers];
}

export function getQuorumState(pendingId = "pending:release-vote") {
  const ledger = loadGovernanceLedger();
  const lastRelease = [...ledger]
    .reverse()
    .find((e) => e.decision_type === "release_vote");
  const votes = lastRelease?.steward_votes ?? [];
  const stewards = loadStewards();
  const quorum = computeQuorumState({ stewards, votes });

  return {
    pending_id: pendingId,
    ...quorum,
    required: quorum.quorum_required,
    votes_recorded: quorum.votes_cast,
    approve_count: quorum.votes_for,
    met: quorum.participation_met,
    can_vote: quorum.can_vote,
    last_decision: lastRelease?.decision ?? null,
    last_entry_id: lastRelease?.entry_id ?? null,
  };
}

export function getStewardState() {
  const cor = loadCOR();
  const csr = loadCSR();
  const dra = loadDRA();
  const ledger = loadGovernanceLedger();
  const pending = getPendingDecisions();

  return {
    summary: {
      cor_version: cor.version ?? "COR-1.0",
      csr_version: csr.metadata?.version ?? "CSR-1.0",
      dra_version: dra.version ?? "DRA-1.0",
      ledger_entries: ledger.length,
      last_decision: ledger.at(-1)?.decision ?? null,
      last_entry_id: ledger.at(-1)?.entry_id ?? null,
    },
    quorum: getQuorumState(),
    pending,
    ledger,
    evidenceBundle: {
      cor: PATHS.cor,
      csr: PATHS.csr,
      dra: PATHS.dra,
      proof_graph: PATHS.proofGraph,
    },
  };
}
