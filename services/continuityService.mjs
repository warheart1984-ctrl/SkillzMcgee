import fs from "node:fs";
import {
  CHECKPOINT_PATH,
  CONTINUITY_ROOT,
  TIMELINE_PATH,
  loadContinuityState as loadContinuityStateSync,
  replayContinuity,
} from "../substrate/continuity-substrate.mjs";

export async function loadContinuityState() {
  return loadContinuityStateSync();
}

export async function saveContinuityState(state) {
  fs.mkdirSync(CONTINUITY_ROOT, { recursive: true });
  fs.writeFileSync(CHECKPOINT_PATH, `${state.checkpoint ?? "00000"}\n`, "utf8");
  fs.writeFileSync(
    TIMELINE_PATH,
    `${JSON.stringify({ events: state.events ?? [] }, null, 2)}\n`,
    "utf8",
  );
  return state;
}

export async function loadContinuityTimeline() {
  return loadContinuityStateSync().events;
}

export { replayContinuity };
