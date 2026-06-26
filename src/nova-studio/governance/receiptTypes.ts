export interface CapabilitySignature {
  id: string;
  inputSchema: unknown;
  outputSchema: unknown;
}

export interface GovernanceEnvelope {
  id: string;
  operator: string;
  capabilityId: string;
  capabilitySignatureHash: string;
  continuityCheckpoint: string;
  parentReceiptId?: string;
  inputHash: string;
  outputHash?: string;
  timestamp: string;
  status: "pending" | "ok" | "error";
  invariantViolations?: string[];
}

/** @deprecated use capabilityId */
export type LegacyReceipt = {
  id: string;
  timestamp: string;
  actor: string;
  slice: string;
  status: string;
};

export function envelopeToFeedRow(env: GovernanceEnvelope): {
  id: string;
  timestamp: string;
  slice: string;
  status: string;
} {
  return {
    id: env.id,
    timestamp: env.timestamp,
    slice: env.capabilityId,
    status: env.status,
  };
}
