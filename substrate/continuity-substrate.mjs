/**
 * Continuity substrate — constitutional memory (.runtime/continuity).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
export const CONTINUITY_ROOT = path.join(REPO_ROOT, ".runtime", "continuity");
export const CHECKPOINT_PATH = path.join(CONTINUITY_ROOT, "checkpoint");
export const TIMELINE_PATH = path.join(CONTINUITY_ROOT, "timeline.json");
export const ARTIFACTS_DIR = path.join(CONTINUITY_ROOT, "artifacts");
export const RECEIPTS_DIR = path.join(CONTINUITY_ROOT, "receipts");

function ensureDirs() {
  fs.mkdirSync(CONTINUITY_ROOT, { recursive: true });
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

function formatCheckpoint(n) {
  return String(n).padStart(5, "0");
}

export function loadContinuityState() {
  ensureDirs();
  let checkpoint = "00000";
  if (fs.existsSync(CHECKPOINT_PATH)) {
    checkpoint = fs.readFileSync(CHECKPOINT_PATH, "utf8").trim() || "00000";
  }
  let events = [];
  if (fs.existsSync(TIMELINE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(TIMELINE_PATH, "utf8"));
      events = data.events ?? [];
    } catch {
      events = [];
    }
  }
  return { checkpoint, events };
}

function atomicWrite(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, content, "utf8");
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    fs.renameSync(tmp, filePath);
  } catch {
    fs.copyFileSync(tmp, filePath);
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore cleanup */
    }
  }
}

/**
 * @param {Array<{ id: string, kind: string, timestamp: string, label: string, receiptId?: string, artifactId?: string }>} newEvents
 */
export function appendContinuityEvents(newEvents) {
  ensureDirs();
  const state = loadContinuityState();
  const merged = [...state.events, ...newEvents];
  const checkpointNum = merged.length;
  const checkpoint = formatCheckpoint(checkpointNum);
  atomicWrite(CHECKPOINT_PATH, checkpoint);
  atomicWrite(TIMELINE_PATH, `${JSON.stringify({ events: merged }, null, 2)}\n`);
  return { checkpoint, events: merged };
}

export function persistContinuityArtifact(artifactId, payload) {
  ensureDirs();
  const p = path.join(ARTIFACTS_DIR, `${artifactId}.json`);
  atomicWrite(p, `${JSON.stringify(payload, null, 2)}\n`);
}

export function persistContinuityReceipt(receiptId, envelope) {
  ensureDirs();
  const p = path.join(RECEIPTS_DIR, `${receiptId}.json`);
  atomicWrite(p, `${JSON.stringify(envelope, null, 2)}\n`);
}

/**
 * Replay loader — reconstruct timeline for validation.
 */
export function replayContinuity() {
  const state = loadContinuityState();
  const artifacts = [];
  if (fs.existsSync(ARTIFACTS_DIR)) {
    for (const f of fs.readdirSync(ARTIFACTS_DIR)) {
      if (f.endsWith(".json")) {
        artifacts.push(JSON.parse(fs.readFileSync(path.join(ARTIFACTS_DIR, f), "utf8")));
      }
    }
  }
  return { ...state, artifacts, valid: state.events.length === Number(state.checkpoint) };
}

export function clearContinuityState() {
  ensureDirs();
  atomicWrite(CHECKPOINT_PATH, "00000");
  atomicWrite(TIMELINE_PATH, `${JSON.stringify({ events: [] }, null, 2)}\n`);
  for (const dir of [ARTIFACTS_DIR, RECEIPTS_DIR]) {
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        fs.unlinkSync(path.join(dir, f));
      }
    }
  }
}
