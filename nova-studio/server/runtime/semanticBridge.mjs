/**
 * Semantic Bridge API â€” normalize + append to evidence log.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

let bridgePromise = null;

async function loadBridge() {
  if (!bridgePromise) {
    bridgePromise = (async () => {
      const { register } = await import("tsx/esm/api");
      register();
      return import("../../../src/semantic-bridge/index.ts");
    })();
  }
  return bridgePromise;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const LOG_DIR = path.join(REPO_ROOT, ".runtime/semantic-bridge");
const LOG_PATH = path.join(LOG_DIR, "messages.jsonl");

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export async function handleSemanticBridgeNormalize(body) {
  const {
    normalizeMessage,
    translateJonToDarz,
    translateDarzToJon,
    suggestReply,
    validateBridgeInvariants,
  } = await loadBridge();
  const direction = body.direction === "darz->jon" ? "darz->jon" : "jon->darz";
  const rawText = String(body.rawText ?? body.text ?? "");
  const overrides = body.overrides ?? {};
  const message = normalizeMessage(rawText, direction, overrides);
  const violations = validateBridgeInvariants(message);
  if (direction === "darz->jon") {
    const darz = translateDarzToJon(message);
    return {
      ok: true,
      message,
      translation: darz.jonReply,
      canonical: darz.canonical,
      darzTranslation: darz,
      violations,
    };
  }
  const translation = translateJonToDarz(message).body;
  return { ok: true, message, translation, violations };
}

export function appendSemanticBridgeLog(entry) {
  ensureLogDir();
  const id = `SB-${crypto.randomUUID()}`;
  const record = {
    id,
    timestamp: new Date().toISOString(),
    entry_type: "semanticBridgeTick",
    ...entry,
  };
  fs.appendFileSync(LOG_PATH, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

export function listSemanticBridgeLog(limit = 50) {
  if (!fs.existsSync(LOG_PATH)) return [];
  const lines = fs.readFileSync(LOG_PATH, "utf8").trim().split("\n").filter(Boolean);
  return lines.slice(-limit).map((l) => JSON.parse(l));
}
