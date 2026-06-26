export type EventKind = "EVENT" | "DECISION" | "ARTIFACT";

export interface ContinuityEvent {
  id: string;
  kind: EventKind;
  timestamp: string;
  label: string;
  artifactId?: string;
  decisionId?: string;
}

export interface ArtifactNode {
  id: string;
  type: string;
  label: string;
}

export interface DecisionPoint {
  id: string;
  label: string;
  receiptId: string;
}
