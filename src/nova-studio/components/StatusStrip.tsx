import React from "react";
import type { GovernanceEnvelope } from "../governance/receiptTypes";

export interface StatusStripProps {
  lastReceipt: GovernanceEnvelope | null;
  lastViolation: {
    id: string;
    laws?: { violations?: string[] };
    violations?: string[];
  } | null;
}

export const StatusStrip: React.FC<StatusStripProps> = ({ lastReceipt, lastViolation }) => (
  <footer className="ns-bottom-strip">
    <span className="ns-bottom-label">Last receipt</span>
    <code className="ns-bottom-value">
      {lastReceipt?.id ?? "—"}
      {lastReceipt?.phase ? ` · ${lastReceipt.phase}` : ""}
    </code>
    <span className="ns-bottom-label">Last invariant</span>
    <code
      className={
        lastViolation ? "ns-bottom-value ns-status-error" : "ns-bottom-value ns-status-ok"
      }
    >
      {lastViolation
        ? `${lastViolation.id}: ${(lastViolation.laws?.violations ?? lastViolation.violations ?? []).join("; ")}`
        : "none"}
    </code>
  </footer>
);
