/**
 * Cross-lane invariants — global constitutional rules (X-1, X-2, X-3).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { listLanes } from "./communicationGovernance.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const TICKS_PATH = path.join(REPO_ROOT, ".runtime/communication-ledger/ticks.jsonl");
const INVARIANTS_PATH = path.join(REPO_ROOT, ".runtime/communication-governance/invariant-ticks.jsonl");

const GLOBAL_DRIFT_CEILING = 0.7;

function readAllTicks(limit = 500) {
  if (!fs.existsSync(TICKS_PATH)) return [];
  const lines = fs.readFileSync(TICKS_PATH, "utf8").trim().split("\n").filter(Boolean);
  return lines.slice(-limit).map((l) => JSON.parse(l));
}

function appendInvariantTick(record) {
  fs.mkdirSync(path.dirname(INVARIANTS_PATH), { recursive: true });
  fs.appendFileSync(INVARIANTS_PATH, `${JSON.stringify(record)}\n`, "utf8");
}

/** X-1: No ungoverned spec change */
function checkX1(ticks, lanes) {
  const violations = [];
  for (const tick of ticks) {
    if (tick.impact !== "spec" && tick.normative_impact !== "spec") continue;
    const lane = lanes.find((l) => l.lane_id === tick.lane_id);
    const allowed = lane?.allowed_categories ?? lane?.corridor?.categories ?? [];
    const ok =
      allowed.includes("normative") ||
      allowed.includes("architectural") ||
      tick.governance_receipt_id;
    if (!ok) {
      violations.push({
        lane_id: tick.lane_id,
        tick_id: tick.id,
        reason: "Spec change from lane without normative/architectural authority",
      });
    }
  }
  return { ok: violations.length === 0, violations };
}

/** X-2: Human context isolation */
function checkX2(ticks, lanes) {
  const violations = [];
  for (const tick of ticks) {
    if (tick.category !== "human") continue;
    const lane = lanes.find((l) => l.lane_id === tick.lane_id);
    const bandwidth = lane?.corridor?.human_bandwidth ?? lane?.human_bandwidth;
    if (bandwidth === "none" || bandwidth === false) {
      violations.push({
        lane_id: tick.lane_id,
        tick_id: tick.id,
        reason: "Human-category message stored in spec lane (human_bandwidth: none)",
      });
    }
    if (tick.lane_id?.includes("-spec") && !tick.governance_receipt_id) {
      violations.push({
        lane_id: tick.lane_id,
        tick_id: tick.id,
        reason: "Human context referenced in spec lane without governance receipt",
      });
    }
  }
  return { ok: violations.length === 0, violations };
}

/** X-3: Global drift ceiling */
function checkX3(ticks) {
  const maxComposite = ticks.reduce(
    (max, t) => Math.max(max, t.drift_vector?.composite ?? 0),
    0,
  );
  const violations =
    maxComposite > GLOBAL_DRIFT_CEILING
      ? [{ lane_id: "*", reason: `Global communication drift ${maxComposite.toFixed(3)} exceeds ${GLOBAL_DRIFT_CEILING}` }]
      : [];
  return { ok: violations.length === 0, violations, maxComposite };
}

export const CROSS_LANE_INVARIANTS = [
  {
    invariant_id: "X-1",
    description: "Spec changes must originate from normative/architectural lanes.",
    check: checkX1,
  },
  {
    invariant_id: "X-2",
    description: "Human-category messages must not enter spec lanes.",
    check: checkX2,
  },
  {
    invariant_id: "X-3",
    description: `Global communication drift must remain below ${GLOBAL_DRIFT_CEILING}.`,
    check: (ticks, lanes) => checkX3(ticks),
  },
];

export function runCrossLaneInvariants(ticks = null) {
  const allTicks = ticks ?? readAllTicks();
  const lanes = listLanes();
  const results = [];

  for (const inv of CROSS_LANE_INVARIANTS) {
    const result = inv.check(allTicks, lanes);
    const tick = {
      id: `CLI-${crypto.randomUUID()}`,
      entry_type: "crossLaneInvariantTick",
      timestamp: new Date().toISOString(),
      invariant_id: inv.invariant_id,
      ok: result.ok,
      violations: result.violations,
    };
    appendInvariantTick(tick);
    results.push({ ...inv, ...result, tick });
  }

  return results;
}

export function getCrossLaneInvariantRegistry() {
  return CROSS_LANE_INVARIANTS.map(({ invariant_id, description }) => ({
    invariant_id,
    description,
    status: "ENFORCED",
  }));
}
