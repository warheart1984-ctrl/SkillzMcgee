import React, { useState } from "react";
import { useStewardState } from "../hooks/useStewardState";
import {
  GovernanceSummary,
  QuorumIndicator,
  EvidenceInspector,
  PendingDecisionPanel,
  VotingPanel,
  LedgerFeed,
} from "./panels";
import "../styles/novaStudio.css";

export const StewardDashboard: React.FC = () => {
  const { state, loading, refresh } = useStewardState();
  const [selected, setSelected] = useState("pending:release-vote");

  async function submitVote(vote: {
    decision: "approve" | "reject" | "defer";
    rationale: string;
    subject: string;
  }) {
    if (!state.quorum.can_vote) {
      throw new Error("Quorum not met — voting disabled");
    }
    const res = await fetch("/api/governance/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        steward_id: "steward:local",
        decision: vote.decision,
        decision_type: "release_vote",
        subject: vote.subject,
        rationale: [vote.rationale],
        continuity_checkpoint: new Date().toISOString(),
        evidence_refs: Object.values(state.evidenceBundle),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Vote failed");
    }
    await refresh();
  }

  return (
    <div className="ns-mode-page ns-steward">
      <h2 className="ns-mode-title">Steward Council</h2>

      {loading && <p className="ns-meta">Loading governance state…</p>}

      <div className="ns-steward-grid">
        <GovernanceSummary summary={state.summary} />
        <QuorumIndicator quorum={state.quorum} />
        <EvidenceInspector bundle={state.evidenceBundle} />
        <PendingDecisionPanel
          pending={state.pending}
          selected={selected}
          onSelect={setSelected}
        />
        <VotingPanel
          pendingId={selected}
          onVote={submitVote}
          quorum={state.quorum}
        />
        <LedgerFeed ledger={state.ledger} />
      </div>
    </div>
  );
};
