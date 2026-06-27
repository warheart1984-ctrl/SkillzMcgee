export type DriftVector = {
  semantic: number;
  altitude: number;
  impact: number;
  latency: number;
  composite: number;
};

export type CommunicationTick = {
  id?: string;
  entry_type: "communicationTick";
  timestamp: string;
  lane_id: string;
  direction: "jon->darz" | "darz->jon";
  category: string;
  core_claim: string;
  impact: string;
  required_action: string;
  targets: string[];
  altitude: string;
  latency: string;
  drift_vector: DriftVector;
  comm_constitution_version: string;
};

export type CommunicationGovernanceTick = {
  entry_type: "communicationGovernanceTick";
  timestamp: string;
  decision_type: "ack" | "reject" | "amend" | "defer" | "correct" | "terminate" | "resume";
  communication_id: string;
  rationale: string;
  operator_id: string;
  receipts: string[];
  comm_constitution_version: string;
};

export type CommunicationRecertificationTick = {
  entry_type: "communicationRecertificationTick";
  timestamp: string;
  lane_id: string;
  prior_comm_constitution_version: string;
  new_comm_constitution_version: string;
  certification_result: "PASS" | "FAIL" | "FAIL_WITH_REMEDIATION_REQUIRED";
  checked_rules: string[];
  receipts: string[];
  metadata?: Record<string, unknown>;
};

export type CommunicationEpoch = {
  epoch_id: string;
  lane_id: string;
  started_at: string;
  ended_at?: string;
  session_budget: number;
  session_spent: number;
  drift_max: number;
  ticks_count: number;
  status: "ACTIVE" | "CLOSED" | "CONTAINED";
};

export type CommunicationLaneSplitTick = {
  entry_type: "communicationLaneSplitTick";
  timestamp: string;
  source_lane_id: string;
  new_lanes: { lane_id: string; contract_id: string }[];
  rationale: string;
  operator_id: string;
};

export type CommunicationLaneMergeTick = {
  entry_type: "communicationLaneMergeTick";
  timestamp: string;
  source_lanes: string[];
  target_lane_id: string;
  rationale: string;
  operator_id: string;
};

export type LedgerEntry =
  | CommunicationTick
  | CommunicationGovernanceTick
  | CommunicationRecertificationTick
  | CommunicationLaneSplitTick
  | CommunicationLaneMergeTick
  | Record<string, unknown>;
