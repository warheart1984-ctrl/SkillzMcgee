/** Declarative invariant definitions for the governance engine. */

export interface InvariantCheck {
  id: string;
  description: string;
  severity: "info" | "warning" | "error" | "critical";
}

export const CONSTITUTIONAL_INVARIANTS: InvariantCheck[] = [
  {
    id: "INV-COR-PURE",
    description: "Governance must not mutate COR state vector",
    severity: "critical",
  },
  {
    id: "INV-EVIDENCE-BACKED",
    description: "Release approval requires evidence references",
    severity: "error",
  },
  {
    id: "INV-PROOF-CLOSURE",
    description: "Operational release requires proof_closure pass or explicit deferral",
    severity: "error",
  },
  {
    id: "INV-LINEAGE",
    description: "Broken provenance chains block approve decisions",
    severity: "warning",
  },
  {
    id: "INV-REPRODUCIBILITY",
    description: "Reproduced maturity requires successful reproduction status",
    severity: "warning",
  },
];

export type GovernanceDecision =
  | "approve"
  | "reject"
  | "require_fixes"
  | "escalate"
  | "freeze"
  | "retire";

export interface GovernanceReceipt {
  decisionId: string;
  corStateRef: string;
  analysisRef?: string;
  decision: GovernanceDecision;
  scope: string[];
  rationale: string;
  evidenceRefs: string[];
  invariantsEnforced: string[];
  steward: string;
  timestamp: string;
  signature: string;
}
