/** Shared types for Negotiant Core cockpit UI */

export interface TensionCosmos {
  becoming: number;
  resistance: number;
  memory: number;
  horizon: number;
  equilibrium: number;
}

export interface RpgFaceView {
  mode: string;
  cycle: TensionCosmos;
  backlash: number;
  narrativeHook: string;
}

export interface CoreRpgPanelProps {
  cosmos: TensionCosmos;
  rpgFace: RpgFaceView;
  archetype?: string;
  coreVersion?: string;
  onSpin: (ticks: number) => void;
  onReset: () => void;
}

export type BacklashBand = "stable" | "unstable" | "critical";

export { DEFAULT_COSMOS } from "./constants.js";

export function backlashBand(backlash: number): BacklashBand {
  if (backlash <= 2) return "stable";
  if (backlash <= 4) return "unstable";
  return "critical";
}

export const TENSION_LABELS: { key: keyof TensionCosmos; label: string }[] = [
  { key: "becoming", label: "Becoming" },
  { key: "resistance", label: "Resistance" },
  { key: "memory", label: "Memory" },
  { key: "horizon", label: "Horizon" },
  { key: "equilibrium", label: "Equilibrium" },
];
