/**
 * Communication enforcement â€” classifier, routing, budgets, drift-aware reply guard.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  computeDriftVector,
  getDriftThresholds,
  getLane,
  loadConstitution,
  validateCorridor,
} from "./communicationGovernance.mjs";
import { getActiveEpoch, getEpochBudgetSummary } from "./communicationEpochs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const GOV_DIR = path.join(REPO_ROOT, ".runtime/communication-governance");

function appendJsonl(name, record) {
  fs.mkdirSync(GOV_DIR, { recursive: true });
  fs.appendFileSync(path.join(GOV_DIR, name), `${JSON.stringify(record)}\n`, "utf8");
}

/** Drift-aware message classifier (AAIS-COMM-Î›-002) */
export function classifyMessage(text) {
  const t = String(text ?? "").toLowerCase();

  if (t.includes("invariant") || t.includes("axiom") || t.includes("law")) {
    return "normative";
  }
  if (t.includes("interface") || t.includes("diagram") || t.includes("stack")) {
    return "architectural";
  }
  if (t.includes("evidence") || t.includes("test") || t.includes("audit")) {
    return "methodological";
  }
  if (t.includes("repo") || t.includes("commit") || t.includes("ui")) {
    return "implementation";
  }
  if (t.includes("deploy") || t.includes("ops") || t.includes("production")) {
    return "ops";
  }
  return "human";
}

export function isSpecLane(lane) {
  return lane.human_bandwidth === "none" || lane.lane_id?.includes("-spec");
}

export function writeRerouteTick(payload) {
  const record = {
    id: `CRT-${crypto.randomUUID()}`,
    entry_type: "communicationRerouteTick",
    timestamp: payload.timestamp ?? new Date().toISOString(),
    from_lane: payload.from_lane,
    to_lane: payload.to_lane,
    reason: payload.reason ?? "category_out_of_corridor",
    original_category: payload.original_category,
    comm_constitution_version: payload.comm_constitution_version,
  };
  appendJsonl("reroutes.jsonl", record);
  return record;
}

export function writeBudgetTick(payload) {
  const record = {
    id: `CBT-${crypto.randomUUID()}`,
    entry_type: "communicationBudgetTick",
    timestamp: payload.timestamp ?? new Date().toISOString(),
    lane_id: payload.lane_id,
    epoch_id: payload.epoch_id,
    drift_added: payload.drift_added,
    session_spent: payload.session_spent,
    session_budget: payload.session_budget,
    comm_constitution_version: payload.comm_constitution_version,
  };
  appendJsonl("budget-ticks.jsonl", record);
  return record;
}

/** Route out-of-corridor messages to sibling lane */
export function routeMessage(tick, lane) {
  const target =
    lane.reroute_to ??
    lane.routing?.default_target ??
    (lane.lane_id.includes("spec") ? "jon-darz-human" : "jon-internal");

  writeRerouteTick({
    from_lane: lane.lane_id,
    to_lane: target,
    reason: "category_out_of_corridor",
    original_category: tick.category,
    timestamp: tick.timestamp,
    comm_constitution_version: lane.comm_constitution_version,
  });

  return { ...tick, lane_id: target, rerouted_from: lane.lane_id };
}

export function enforceCommunicationRules(tick, context = {}) {
  let body = { ...tick };
  let lane = getLane(body.lane_id);
  if (!lane) throw new Error(`Lane not registered: ${body.lane_id}`);

  if (!body.category && body.core_claim) {
    body.category = classifyMessage(body.core_claim);
  }

  const allowed =
    lane.allowed_categories ?? lane.corridor?.categories ?? [];
  const categoryOk =
    allowed.includes(body.category) ||
    (body.category === "human" && lane.corridor?.human_bandwidth && lane.corridor.human_bandwidth !== "none");

  if (!categoryOk && (isSpecLane(lane) || lane.auto_reroute)) {
    body = routeMessage(body, lane);
    lane = getLane(body.lane_id);
    if (!lane) throw new Error(`Reroute target not registered: ${body.lane_id}`);
  }

  const corridorViolations = validateCorridor(body, lane);
  if (corridorViolations.length > 0 && !body.rerouted_from) {
    return { ok: false, error: "category_out_of_corridor", violations: corridorViolations, tick: body };
  }

  const drift = body.drift_vector?.composite ?? computeDriftVector(body, lane, corridorViolations).composite;
  const budget = lane.continuity_budget ?? {
    max_composite: 0.3,
    session_budget: 0.5,
  };

  if (drift > budget.max_composite) {
    return { ok: false, error: "Drift exceeds max_composite â€” containment required", drift, tick: body };
  }

  const epochSummary = getEpochBudgetSummary(body.lane_id);
  const projectedSpent = epochSummary.session_spent + drift;

  writeBudgetTick({
    lane_id: body.lane_id,
    epoch_id: epochSummary.epoch_id,
    drift_added: drift,
    session_spent: projectedSpent,
    session_budget: epochSummary.session_budget,
    comm_constitution_version: lane.comm_constitution_version ?? loadConstitution().comm_constitution_version,
    timestamp: body.timestamp,
  });

  if (projectedSpent > epochSummary.session_budget) {
    return { ok: false, error: "Session drift budget exceeded â€” containment required", drift, tick: body };
  }

  return { ok: true, tick: body, lane, drift, epochSummary };
}

export function canGenerateReply(laneContract, currentDrift, proposedReplyMeta) {
  const corridorViolations = [];
  const allowedCategories =
    laneContract.allowed_categories ?? laneContract.corridor?.categories ?? [];
  const allowedAltitudes =
    laneContract.allowed_altitudes ?? laneContract.corridor?.altitudes ?? [];
  const maxImpact = laneContract.max_impact ?? laneContract.corridor?.max_impact ?? "spec";

  if (!allowedCategories.includes(proposedReplyMeta.category)) {
    corridorViolations.push("category_out_of_corridor");
  }
  if (!allowedAltitudes.includes(proposedReplyMeta.altitude)) {
    corridorViolations.push("altitude_out_of_corridor");
  }
  if (proposedReplyMeta.impact === "ops" && maxImpact !== "ops") {
    corridorViolations.push("impact_exceeds_corridor");
  }

  const thresholds = getDriftThresholds();
  const budget = laneContract.continuity_budget ?? { max_composite: thresholds.containment_epoch };
  const projectedComposite = Math.max(
    currentDrift?.composite ?? 0,
    proposedReplyMeta.projected_drift ?? 0,
  );
  const strict = thresholds.strict === true;
  const exceeds = (value, limit) => (strict ? value >= limit : value > limit);

  if (exceeds(projectedComposite, thresholds.fail_closed)) {
    return { ok: false, reason: "would_trigger_fail_closed", corridorViolations, projectedComposite };
  }
  if (exceeds(projectedComposite, budget.max_composite)) {
    return { ok: false, reason: "would_trigger_max_composite", corridorViolations, projectedComposite };
  }
  if (exceeds(projectedComposite, thresholds.containment_epoch)) {
    return { ok: false, reason: "would_trigger_containment", corridorViolations, projectedComposite };
  }

  const epoch = getActiveEpoch(laneContract.lane_id);
  if (epoch) {
    const projectedSpent = epoch.session_spent + projectedComposite;
    if (strict ? projectedSpent >= epoch.session_budget : projectedSpent > epoch.session_budget) {
      return { ok: false, reason: "would_exceed_session_budget", corridorViolations, projectedComposite };
    }
    if (strict && projectedSpent > epoch.session_budget * 0.85) {
      return { ok: false, reason: "frozen_canon_budget_headroom", corridorViolations, projectedComposite };
    }
  }

  return {
    ok: corridorViolations.length === 0,
    corridorViolations,
    projectedComposite,
  };
}

export function listRerouteEvents(laneId, limit = 20) {
  const file = path.join(GOV_DIR, "reroutes.jsonl");
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, "utf8").trim().split("\n").filter(Boolean);
  return lines
    .map((l) => JSON.parse(l))
    .filter((e) => !laneId || e.from_lane === laneId || e.to_lane === laneId)
    .slice(-limit)
    .reverse();
}
