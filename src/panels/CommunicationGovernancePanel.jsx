import React, { useEffect, useState } from "react";
import { getActiveLaneId } from "../runtime/laneContext.js";
import "./CommunicationGovernancePanel.css";

export default function CommunicationGovernancePanel({ laneId: laneIdProp }) {
  const [laneId, setLaneId] = useState(laneIdProp ?? getActiveLaneId());
  const [lane, setLane] = useState(null);
  const [reroutes, setReroutes] = useState([]);
  const [canon, setCanon] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (laneIdProp) setLaneId(laneIdProp);
  }, [laneIdProp]);

  useEffect(() => {
    void fetch(`/api/communication/lanes/${encodeURIComponent(laneId)}`)
      .then((r) => r.json())
      .then((d) => setLane(d.lane ?? null))
      .catch(() => setLane(null));
    void fetch(`/api/communication/reroutes?lane_id=${encodeURIComponent(laneId)}`)
      .then((r) => r.json())
      .then((d) => setReroutes(d.reroutes ?? []))
      .catch(() => setReroutes([]));
  }, [laneId]);

  useEffect(() => {
    void fetch("/api/communication/canon")
      .then((r) => r.json())
      .then((d) => setCanon(d.canon ?? null))
      .catch(() => setCanon(null));
  }, []);

  const budget = lane?.budget_summary;
  const utilization = budget?.utilization ?? 0;
  const budgetPct = Math.min(100, Math.round(utilization * 100));
  const budgetClass =
    budgetPct >= 100 ? "budget-red" : budgetPct >= 75 ? "budget-orange" : budgetPct >= 50 ? "budget-yellow" : "budget-ok";

  async function resolveContainment(action) {
    setBusy(true);
    try {
      await fetch("/api/communication/containment/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lane_id: laneId, action, rationale: `Operator ${action}` }),
      });
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="comm-governance-panel">
      <h3>Communication Governance</h3>

      {budget && (
        <div className="lane-budget">
          <h4>Continuity Budget</h4>
          <div className={`budget-bar ${budgetClass}`}>
            <div className="budget-fill" style={{ width: `${budgetPct}%` }} />
          </div>
          <p>
            BUDGET: {budget.session_spent.toFixed(2)} / {budget.session_budget.toFixed(2)} ({budgetPct}% used)
          </p>
          <p className="budget-meta">Epoch: {budget.epoch_id} · max composite {budget.max_composite}</p>
        </div>
      )}

      {lane?.status === "SUSPENDED" && (
        <div className="containment-actions">
          <p className="containment-title">CONTAINMENT EPOCH — Lane suspended</p>
          <div className="action-row">
            <button type="button" disabled={busy} onClick={() => resolveContainment("correct")}>Correct</button>
            <button type="button" disabled={busy} onClick={() => resolveContainment("amend")}>Amend</button>
            <button type="button" disabled={busy} onClick={() => resolveContainment("terminate")}>Terminate</button>
            <button type="button" disabled={busy} onClick={() => resolveContainment("resume")}>Resume</button>
          </div>
        </div>
      )}

      {reroutes.length > 0 && (
        <div className="reroute-log">
          <h4>Reroutes</h4>
          {reroutes.map((e) => (
            <div key={e.id} className="reroute-item">
              <strong>Rerouted:</strong> {e.original_category} → {e.to_lane}
              <small>{e.timestamp}</small>
            </div>
          ))}
        </div>
      )}

      {canon?.cross_lane_invariants && (
        <div className="invariant-list">
          <h4>Cross-Lane Invariants</h4>
          {canon.cross_lane_invariants.map((inv) => (
            <div key={inv.invariant_id} className="invariant-item">
              <code>{inv.invariant_id}</code> {inv.description}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
