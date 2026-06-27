/**
 * COMM-CANON freeze â€” sealed baseline, ledger anchoring, mutation guards.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseCanon } from "./canonParser.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const GOV_DIR = path.join(REPO_ROOT, ".runtime/communication-governance");
const FREEZE_STATE_PATH = path.join(GOV_DIR, "canon-freeze.json");
const FREEZE_TICKS_PATH = path.join(GOV_DIR, "canon-freeze-ticks.jsonl");
const CANON_MD_PATH = path.join(REPO_ROOT, "governance/communication/COMM-CANON.md");
const CANON_JSON_PATH = path.join(GOV_DIR, "COMM-CANON.json");
const REQUIRED_AMENDMENT = "AAIS-COMM-Î›-003";

let cachedFreezeState = null;

function ensureGovDir() {
  fs.mkdirSync(GOV_DIR, { recursive: true });
}

export function getBaselineCanonId(version = "1.0.0") {
  return `COMM-CANON@${version}`;
}

export function getBaselineCanonPath(version = "1.0.0") {
  return path.join(GOV_DIR, `${getBaselineCanonId(version)}.md`);
}

export function loadFreezeState() {
  if (cachedFreezeState) return cachedFreezeState;
  if (!fs.existsSync(FREEZE_STATE_PATH)) {
    cachedFreezeState = { canon_state: "LIVING", canon_version: null };
    return cachedFreezeState;
  }
  try {
    cachedFreezeState = JSON.parse(fs.readFileSync(FREEZE_STATE_PATH, "utf8"));
  } catch {
    cachedFreezeState = { canon_state: "LIVING", canon_version: null };
  }
  return cachedFreezeState;
}

export function reloadFreezeState() {
  cachedFreezeState = null;
  return loadFreezeState();
}

export function isCanonFrozen() {
  return loadFreezeState().canon_state === "FROZEN";
}

export function isFrozenCanonMode() {
  return isCanonFrozen();
}

export function getCanonFreezeState() {
  const state = loadFreezeState();
  return {
    ...state,
    baseline_id: state.baseline_id ?? (state.canon_version ? getBaselineCanonId(state.canon_version) : null),
    required_amendment: REQUIRED_AMENDMENT,
    strict_enforcement: isCanonFrozen(),
  };
}

export function hashCanonMarkdown(markdown) {
  return crypto.createHash("sha256").update(markdown, "utf8").digest("hex");
}

function appendFreezeTick(tick) {
  ensureGovDir();
  fs.appendFileSync(FREEZE_TICKS_PATH, `${JSON.stringify(tick)}\n`, "utf8");
}

function sealMarkdown(markdown, version, timestamp) {
  return markdown.replace(
    /\*\*Status:\*\*[^\n]*/,
    "**Status:** SEALED",
  ).replace(
    /\*\*Version:\*\*[^\n]*/,
    `**Version:** ${version}`,
  ).replace(
    /\*\*Generated:\*\*[^\n]*/,
    `**Generated:** ${timestamp}`,
  ).replace(
    /\*\*Canon State:\*\*[^\n]*/,
    "**Canon State:** FROZEN",
  ) + `\n\n---\n\n**CANON FREEZE:** v${version} sealed at ${timestamp}. Baseline immutable until ${REQUIRED_AMENDMENT}.\n`;
}

/**
 * Guard constitutional mutations while canon is frozen.
 * @param {string} operation
 * @param {{ amendment_unlock?: string }} [context]
 */
export function guardCanonMutation(operation, context = {}) {
  if (!isCanonFrozen()) return;

  if (context.amendment_unlock === REQUIRED_AMENDMENT) return;

  throw new Error(
    `Canon is FROZEN (v${loadFreezeState().canon_version}). ` +
      `Operation "${operation}" requires amendment ${REQUIRED_AMENDMENT} and Operator approval.`,
  );
}

export function readCanonBaseline(version) {
  const v = version ?? loadFreezeState().canon_version ?? "1.0.0";
  const baselinePath = getBaselineCanonPath(v);
  if (!fs.existsSync(baselinePath)) {
    return null;
  }
  return fs.readFileSync(baselinePath, "utf8");
}

export function readParsedCanonBaseline(version) {
  const md = readCanonBaseline(version);
  if (!md) return null;
  return parseCanon(md);
}

/** Strict drift thresholds â€” frozen canon uses baseline values without slack. */
export function getFrozenDriftThresholds() {
  const state = loadFreezeState();
  if (state.frozen_drift_thresholds) {
    return state.frozen_drift_thresholds;
  }
  return {
    warning: 0.05,
    notify_operator: 0.15,
    containment_epoch: 0.30,
    fail_closed: 0.50,
    strict: true,
  };
}

function lockConstitutionRuntime(canonVersion) {
  const runtimePath = path.join(GOV_DIR, "constitution.runtime.json");
  const canonicalPath = path.join(REPO_ROOT, "canonical/communication-governance-v1.json");
  const basePath = fs.existsSync(runtimePath) ? runtimePath : canonicalPath;
  const constitution = JSON.parse(fs.readFileSync(basePath, "utf8"));

  constitution.canon_state = "FROZEN";
  constitution.comm_constitution_version = canonVersion;
  constitution.canon_version = canonVersion;

  for (const lane of constitution.lanes ?? []) {
    lane.comm_constitution_version = canonVersion;
    lane.canon_state = "FROZEN";
  }

  ensureGovDir();
  fs.writeFileSync(runtimePath, JSON.stringify(constitution, null, 2), "utf8");
}

/**
 * Seal COMM-CANON v1.0.0 â€” snapshot, hash, ledger anchor, runtime lock-in.
 */
export async function freezeCommunicationCanon(operator_id = "jon", canonVersion = "1.0.0") {
  if (isCanonFrozen()) {
    throw new Error(`Canon already frozen at v${loadFreezeState().canon_version}`);
  }

  const { generateCommunicationCanon, buildCanonData } = await import("./canonGenerator.mjs");

  const timestamp = new Date().toISOString();
  let markdown = generateCommunicationCanon({ canon_state: "FROZEN" });
  markdown = sealMarkdown(markdown, canonVersion, timestamp);

  const hash = hashCanonMarkdown(markdown);
  const baselineId = getBaselineCanonId(canonVersion);
  const baselinePath = getBaselineCanonPath(canonVersion);
  const data = buildCanonData();
  const parsed = parseCanon(markdown);

  ensureGovDir();
  fs.mkdirSync(path.dirname(CANON_MD_PATH), { recursive: true });
  fs.writeFileSync(baselinePath, markdown, "utf8");
  fs.writeFileSync(CANON_MD_PATH, markdown, "utf8");
  fs.writeFileSync(
    CANON_JSON_PATH,
    JSON.stringify(
      {
        ...data,
        version: canonVersion,
        canon_state: "FROZEN",
        status: "SEALED",
        sealed_at: timestamp,
        hash,
        baseline_id: baselineId,
        parsed_sections: Object.keys(parsed),
      },
      null,
      2,
    ),
    "utf8",
  );

  const freezeTick = {
    id: `CCFT-${crypto.randomUUID()}`,
    entry_type: "communicationCanonFreezeTick",
    timestamp,
    canon_version: canonVersion,
    hash,
    operator_id,
    baseline_id: baselineId,
    baseline_path: baselinePath,
    comm_constitution_version: canonVersion,
    canon_state: "FROZEN",
  };

  appendFreezeTick(freezeTick);

  const freezeState = {
    canon_state: "FROZEN",
    canon_version: canonVersion,
    baseline_id: baselineId,
    baseline_path: baselinePath,
    hash,
    frozen_at: timestamp,
    operator_id,
    frozen_drift_thresholds: data.drift_thresholds
      ? {
          warning: data.drift_thresholds.warn,
          notify_operator: data.drift_thresholds.notify,
          containment_epoch: data.drift_thresholds.contain,
          fail_closed: data.drift_thresholds.fail_closed,
          strict: true,
        }
      : getFrozenDriftThresholds(),
    required_amendment: REQUIRED_AMENDMENT,
  };

  fs.writeFileSync(FREEZE_STATE_PATH, JSON.stringify(freezeState, null, 2), "utf8");
  cachedFreezeState = freezeState;

  lockConstitutionRuntime(canonVersion);

  return {
    freezeTick,
    freezeState,
    markdown,
    hash,
    baseline_id: baselineId,
  };
}

export function getTickCanonMetadata() {
  const state = loadFreezeState();
  return {
    comm_constitution_version: state.canon_version ?? "1.0.0",
    canon_state: state.canon_state ?? "LIVING",
    canon_version: state.canon_version,
  };
}

export { REQUIRED_AMENDMENT };
