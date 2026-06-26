export interface GovernanceEnvelope {
  operator: string;
  timestamp: string;
  continuityCheckpoint: string;
  capability: string;
  inputHash: string;
  outputHash?: string;
  status: "pending" | "ok" | "error";
}
