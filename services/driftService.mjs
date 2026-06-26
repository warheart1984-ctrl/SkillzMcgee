export {
  getDriftPoints,
  getDriftSummary,
  loadDriftState,
  recordDriftPoint,
} from "../substrate/drift-engine.mjs";

export async function loadDriftPoints() {
  const { getDriftPoints } = await import("../substrate/drift-engine.mjs");
  return getDriftPoints();
}
