/**
 * Drift engine — measures deviation between expected and actual behavior.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
export const DRIFT_PATH = path.join(REPO_ROOT, ".runtime", "drift.json");

const DEFAULT_THRESHOLD = 5;

function ensureDir() {
  fs.mkdirSync(path.dirname(DRIFT_PATH), { recursive: true });
}

export function loadDriftState() {
  ensureDir();
  if (!fs.existsSync(DRIFT_PATH)) {
    return { points: [], anomalies: [], summary: { count: 0, maxAbsDrift: 0 } };
  }
  return JSON.parse(fs.readFileSync(DRIFT_PATH, "utf8"));
}

function persist(state) {
  ensureDir();
  fs.writeFileSync(DRIFT_PATH, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function zScore(value, mean, std) {
  if (std === 0) return 0;
  return (value - mean) / std;
}

/**
 * @param {{ t: number, expected: number, actual: number, capabilityId?: string }} point
 */
export function recordDriftPoint(point) {
  const state = loadDriftState();
  const absDrift = Math.abs(point.actual - point.expected);
  const anomalies = [];

  if (absDrift > DEFAULT_THRESHOLD) {
    anomalies.push({ type: "band-crossing", point, threshold: DEFAULT_THRESHOLD });
  }

  const prev = state.points.at(-1);
  if (prev && point.actual < prev.actual && point.expected >= prev.actual) {
    anomalies.push({ type: "trend-reversal", point });
  }
  if (prev && Math.abs(point.actual - prev.actual) > DEFAULT_THRESHOLD * 2) {
    anomalies.push({ type: "sudden-jump", point, delta: point.actual - prev.actual });
  }

  const values = [...state.points.map((p) => p.actual), point.actual];
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const std = Math.sqrt(variance);
  const zs = zScore(point.actual, mean, std);
  if (Math.abs(zs) > 2) {
    anomalies.push({ type: "z-score", z: zs, point });
  }

  state.points.push(point);
  state.anomalies.push(...anomalies);
  state.summary = {
    count: state.points.length,
    maxAbsDrift: Math.max(state.summary?.maxAbsDrift ?? 0, absDrift),
    cumulativeDrift: state.points.reduce((s, p) => s + Math.abs(p.actual - p.expected), 0),
    lastCapabilityId: point.capabilityId,
  };
  persist(state);
  return { point, anomalies, summary: state.summary };
}

export function getDriftPoints() {
  return loadDriftState().points;
}

export function getDriftSummary() {
  return loadDriftState();
}

export function clearDriftState() {
  persist({ points: [], anomalies: [], summary: { count: 0, maxAbsDrift: 0 } });
}
