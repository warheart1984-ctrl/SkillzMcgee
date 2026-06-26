import React, { useState } from "react";
import type { StewardState } from "../hooks/useStewardState";

export function GovernanceSummary({ summary }: { summary: StewardState["summary"] }) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Governance Summary</div>
      <ul className="ns-summary-list">
        <li>COR: {String(summary.cor_version ?? "—")}</li>
        <li>CSR: {String(summary.csr_version ?? "—")}</li>
        <li>DRA: {String(summary.dra_version ?? "—")}</li>
        <li>Ledger entries: {String(summary.ledger_entries ?? 0)}</li>
        <li>Last decision: {String(summary.last_decision ?? "—")}</li>
      </ul>
    </div>
  );
}

export function QuorumIndicator({ quorum }: { quorum: StewardState["quorum"] }) {
  const status = String(quorum.status ?? (quorum.met ? "green" : "red"));
  const statusClass =
    status === "green"
      ? "ns-quorum-green"
      : status === "yellow"
        ? "ns-quorum-yellow"
        : "ns-quorum-red";

  return (
    <div className={`ns-panel ${statusClass}`}>
      <div className="ns-panel-title">Quorum</div>
      <p className={quorum.met ? "ns-status-ok" : "ns-status-error"}>
        {quorum.presence_met ? "Presence OK" : "Presence insufficient"} —{" "}
        {String(quorum.active_stewards ?? quorum.council_size ?? "?")} active, need{" "}
        {String(quorum.quorum_required ?? quorum.required ?? "?")}
      </p>
      <p className="ns-meta">
        Votes: {String(quorum.votes_cast ?? quorum.votes_recorded ?? 0)} · Approve{" "}
        {String(quorum.votes_for ?? quorum.approve_count ?? 0)} / need{" "}
        {String(quorum.approval_required ?? "?")}
      </p>
      <p className="ns-meta">
        {quorum.can_vote ? "Voting enabled" : "Voting disabled (quorum not met)"}
      </p>
    </div>
  );
}

export function EvidenceInspector({ bundle }: { bundle: StewardState["evidenceBundle"] }) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Evidence Bundle</div>
      <ul className="ns-evidence-list">
        {Object.entries(bundle).map(([k, v]) => (
          <li key={k}>
            <code>{k}</code>: {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PendingDecisionPanel({
  pending,
  selected,
  onSelect,
}: {
  pending: StewardState["pending"];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Pending Decisions</div>
      <ul className="ns-pending-list">
        {pending.map((p) => (
          <li key={String(p.id)}>
            <button
              type="button"
              className={selected === p.id ? "ns-pending-active" : ""}
              onClick={() => onSelect(String(p.id))}
            >
              <strong>{String(p.subject)}</strong> — {String(p.summary)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function VotingPanel({
  pendingId,
  onVote,
  quorum,
}: {
  pendingId: string;
  onVote: (vote: {
    decision: "approve" | "reject" | "defer";
    rationale: string;
    subject: string;
  }) => Promise<void>;
  quorum: StewardState["quorum"];
}) {
  const [decision, setDecision] = useState<"approve" | "reject" | "defer">("defer");
  const [rationale, setRationale] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const canVote = quorum.can_vote !== false;

  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Voting Panel</div>
      <p className="ns-meta">Subject: {pendingId}</p>
      {!canVote && (
        <p className="ns-status-error">Quorum not met — submit disabled until council presence is sufficient.</p>
      )}
      <div className="ns-vote-actions">
        {(["approve", "reject", "defer"] as const).map((d) => (
          <button
            key={d}
            type="button"
            className={decision === d ? "ns-vote-selected" : ""}
            onClick={() => setDecision(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <textarea
        className="ns-vote-rationale"
        placeholder="Rationale (required)"
        value={rationale}
        onChange={(e) => setRationale(e.target.value)}
        rows={4}
      />
      <button
        type="button"
        disabled={submitting || !rationale.trim() || !canVote}
        onClick={() => {
          setSubmitting(true);
          void onVote({ decision, rationale, subject: pendingId }).finally(() =>
            setSubmitting(false),
          );
        }}
      >
        {submitting ? "Submitting…" : "Submit vote"}
      </button>
    </div>
  );
}

export function LedgerFeed({ ledger }: { ledger: StewardState["ledger"] }) {
  return (
    <div className="ns-panel">
      <div className="ns-panel-title">Ledger Feed</div>
      <ul className="ns-ledger-list">
        {ledger
          .slice()
          .reverse()
          .slice(0, 10)
          .map((e) => (
            <li key={String(e.entry_id)}>
              {String(e.entry_id)} — {String(e.decision)} —{" "}
              {(e.rationale as string[])?.[0] ?? ""}
            </li>
          ))}
      </ul>
    </div>
  );
}
