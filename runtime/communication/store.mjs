import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");
export const COMM_ROOT = path.join(REPO_ROOT, ".runtime", "communication");
export const COMM_LEDGER_PATH = path.join(COMM_ROOT, "ledger.jsonl");
export const COMM_LANES_PATH = path.join(COMM_ROOT, "lanes.json");
export const COMM_EPOCHS_PATH = path.join(COMM_ROOT, "epochs.json");
export const COMM_CANON_PATH = path.join(REPO_ROOT, "governance", "communication", "COMM-CANON.md");

export function ensureCommunicationDirs() {
  fs.mkdirSync(COMM_ROOT, { recursive: true });
  fs.mkdirSync(path.dirname(COMM_CANON_PATH), { recursive: true });
}

export function readJson(filePath, fallback) {
  ensureCommunicationDirs();
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return fallback;
  }
}

export function writeJson(filePath, value) {
  ensureCommunicationDirs();
  const tmp = `${filePath}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, filePath);
}

export function appendLedgerEntry(entry) {
  ensureCommunicationDirs();
  fs.appendFileSync(COMM_LEDGER_PATH, `${JSON.stringify(entry)}\n`, "utf8");
  return entry;
}

export function listLedgerEntries(filter = {}) {
  ensureCommunicationDirs();
  if (!fs.existsSync(COMM_LEDGER_PATH)) return [];
  return fs
    .readFileSync(COMM_LEDGER_PATH, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line.replace(/^\uFEFF/, "")))
    .filter((entry) => {
      for (const [key, value] of Object.entries(filter)) {
        if (value === undefined || value === "") continue;
        if (entry[key] !== value) return false;
      }
      return true;
    });
}
