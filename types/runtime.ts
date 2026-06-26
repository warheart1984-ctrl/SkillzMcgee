export type OperatorStance = "idle" | "monitoring" | "intervening" | "halted";
export type WavePhase = "plan" | "act" | "reflect";

export interface StanceStripState {
  operator_id: string;
  stance: OperatorStance;
  focus_capability_id?: string;
  last_event_at: string;
}

export interface NovaWave {
  wave_id: string;
  runtime_id: string;
  phase: WavePhase;
  drift_score: number;
  fold_id: string;
  started_at: string;
  updated_at: string;
}

export interface FoldSummary {
  fold_id: string;
  requirements: string[];
  implementations: string[];
  receipts: string[];
  provenance_roots: string[];
}

export interface NovaRuntimeState {
  runtime_id: string;
  stance: StanceStripState;
  waves: NovaWave[];
  folds: FoldSummary[];
}
