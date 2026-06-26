/**
 * Operator session flight recorder.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.resolve(__dirname, "../../../.runtime/nova-studio/session");
const LOG_PATH = path.join(SESSION_DIR, "log.json");

function ensureSessionDir() {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

function readLog() {
  ensureSessionDir();
  if (!fs.existsSync(LOG_PATH)) {
    fs.writeFileSync(LOG_PATH, "[]\n", "utf8");
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
  } catch {
    return [];
  }
}

export function recordSessionEvent(event) {
  const log = readLog();
  log.push({ ...event, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOG_PATH, `${JSON.stringify(log, null, 2)}\n`, "utf8");
  return log.at(-1);
}

export function loadSession() {
  return readLog();
}

export function clearSession() {
  ensureSessionDir();
  fs.writeFileSync(LOG_PATH, "[]\n", "utf8");
}
