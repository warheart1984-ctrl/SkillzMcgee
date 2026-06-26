export interface StanceEvent {
  type: "stance";
  runtime_id: string;
  session_id?: string;
  timestamp: string;
  payload: {
    operator_id: string;
    stance: "idle" | "monitoring" | "intervening" | "halted";
    focus_capability_id?: string;
    severity?: "info" | "warn" | "critical";
  };
}

export interface WaveEvent {
  type: "wave";
  runtime_id: string;
  session_id?: string;
  timestamp: string;
  payload: {
    wave_id: string;
    runtime_id?: string;
    phase: "plan" | "act" | "reflect";
    drift_score: number;
    fold_id: string;
    started_at?: string;
    updated_at?: string;
  };
}

export interface RuntimeEvent {
  type: "event";
  runtime_id: string;
  session_id?: string;
  timestamp: string;
  payload: Record<string, unknown>;
}

export type NovaStudioEvent = StanceEvent | WaveEvent | RuntimeEvent;
