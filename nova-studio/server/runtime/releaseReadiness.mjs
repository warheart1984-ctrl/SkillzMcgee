/**
 * Release readiness evaluator — measurable v1.0 gate.
 */

import fs from "node:fs";
import path from "node:path";
import { loadCOR, loadCSR, loadDRA, loadGovernanceLedger, PATHS, REPO_ROOT } from "./constitutionalData.mjs";
import { validateCanonicalManifest } from "./canonicalManifest.mjs";
import { computeQuorumState } from "./quorum.mjs";

const CERT_DIR = path.join(REPO_ROOT, "governance/certifications");

function loadCertifications() {
  if (!fs.existsSync(CERT_DIR)) return [];
  return fs
    .readdirSync(CERT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(CERT_DIR, f), "utf8")));
}

export function evaluateReleaseReadiness(options = {}) {
  const release = options.release ?? "v1.0";
  const cor = loadCOR();
  const csr = loadCSR();
  const dra = loadDRA();
  const ledger = loadGovernanceLedger();
  const reasons = [];
  const blockingIssues = [];

  const criticalGaps = (cor.requirements ?? []).filter(
    (r) =>
      r.claim_status === "missing" ||
      r.specification_status === "missing" ||
      r.authority_status === "missing",
  );
  if (criticalGaps.length) {
    blockingIssues.push(`${criticalGaps.length} critical COR gaps (missing normative chain)`);
  } else {
    reasons.push("No critical COR gaps");
  }

  const claims = csr?.claims ?? {};
  const unclassified = Object.entries(claims).filter(
    ([, status]) => !status || status === "unknown" || status === "unclassified",
  );
  if (unclassified.length) {
    blockingIssues.push(`${unclassified.length} unclassified CSR claims`);
  } else {
    reasons.push("All CSR claims classified");
  }

  const risk = String(dra.riskLevel ?? "high").toLowerCase();
  if (risk === "high") {
    blockingIssues.push(`DRA riskLevel is high (threshold: low or medium)`);
  } else {
    reasons.push(`DRA riskLevel: ${risk}`);
  }

  const releaseVotes = ledger.filter(
    (e) => e.decision_type === "release_vote" && e.decision === "approve",
  );
  const validGovernance = releaseVotes.some(
    (e) => Array.isArray(e.rationale) && e.rationale.length > 0 && Array.isArray(e.steward_votes) && e.steward_votes.length > 0,
  );
  if (!validGovernance) {
    blockingIssues.push("No valid governance decision approving release");
  } else {
    reasons.push("Governance release approval present");
  }

  const certs = loadCertifications();
  const auditorCert = certs.find((c) => c.release === release && c.status === "certified");
  if (auditorCert) {
    reasons.push(`Auditor certification present (${auditorCert.certification_id})`);
  } else if (options.require_certification) {
    blockingIssues.push("Auditor certification required but missing");
  } else {
    reasons.push("Auditor certification optional — not present");
  }

  const quorum = computeQuorumState({
    votes: releaseVotes.at(-1)?.steward_votes ?? [],
  });
  if (!quorum.approval_met && validGovernance) {
    reasons.push("Governance vote recorded; quorum approval formula may need more votes");
  }

  const ready = blockingIssues.length === 0;

  return {
    release,
    ready,
    reasons,
    blockingIssues,
    artifacts: {
      cor: PATHS.cor,
      csr: PATHS.csr,
      dra: PATHS.dra,
      ledger: PATHS.ledger,
    },
    metrics: {
      cor_gaps: criticalGaps.length,
      unclassified_claims: unclassified.length,
      risk_level: risk,
      governance_approvals: releaseVotes.length,
      auditor_certified: Boolean(auditorCert),
    },
  };
}
