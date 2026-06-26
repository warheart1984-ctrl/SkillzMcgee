export type StudioMode = "coding-agent" | "drift" | "control" | "replay";

export interface StudioState {
  mode: StudioMode;
}

export function createInitialStudioState(): StudioState {
  return { mode: "coding-agent" };
}
