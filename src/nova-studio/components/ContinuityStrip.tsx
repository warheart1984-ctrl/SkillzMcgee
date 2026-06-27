import React, { useEffect, useState } from "react";
import "./ContinuityStrip.css";

interface ContinuityState {
  metrics?: {
    continuity_score: number;
    runtime_drift: number;
    communication_drift: number;
    governance_drift: number;
    cockpit_drift: number;
    trigger?: string | null;
  };
  evaluation?: {
    state: string;
    trigger?: string | null;
  };
}

interface KillSwitchState {
  halted?: boolean;
}

interface CanonFreezeState {
  canon_state?: string;
  canon_version?: string;
  required_amendment?: string;
}

export function ContinuityStrip() {
  const [fold, setFold] = useState<ContinuityState>({});
  const [killSwitch, setKillSwitch] = useState<KillSwitchState>({});
  const [canonFreeze, setCanonFreeze] = useState<CanonFreezeState>({});

  useEffect(() => {
    const load = () => {
      void fetch("/api/communication/continuity")
        .then((r) => r.json())
        .then((d) => setFold(d))
        .catch(() => setFold({}));
      void fetch("/api/communication/kill-switch")
        .then((r) => r.json())
        .then((d) => setKillSwitch(d))
        .catch(() => setKillSwitch({}));
      void fetch("/api/communication/canon/freeze")
        .then((r) => r.json())
        .then((d) => setCanonFreeze(d))
        .catch(() => setCanonFreeze({}));
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  const score = fold.metrics?.continuity_score ?? 0;
  const state = fold.evaluation?.state ?? "OK";
  const trigger = fold.evaluation?.trigger ?? fold.metrics?.trigger ?? null;
  const stateClass = state.toLowerCase().replace(/_/g, "-");

  return (
    <div className={`ns-continuity-strip ns-continuity-${stateClass}`}>
      <span className="ns-continuity-label">CONTINUITY</span>
      <span className="ns-continuity-score">{score.toFixed(2)}</span>
      <span className="ns-continuity-sep">â†’</span>
      <span className="ns-continuity-state">STATE: {state}</span>
      {trigger && <span className="ns-continuity-trigger">TRIGGER: {trigger}</span>}
      {killSwitch.halted && (
        <span className="ns-continuity-halt">COMM HALTED</span>
      )}
      {canonFreeze.canon_state === "FROZEN" && (
        <span className="ns-continuity-canon-frozen">
          CANON FROZEN v{canonFreeze.canon_version ?? "1.0.0"}
        </span>
      )}
      {state === "CONTAINMENT_EPOCH" && trigger === "communication" && (
        <span className="ns-continuity-banner">
          Automatic Containment Epoch â€” Trigger: Communication Drift
        </span>
      )}
    </div>
  );
}
