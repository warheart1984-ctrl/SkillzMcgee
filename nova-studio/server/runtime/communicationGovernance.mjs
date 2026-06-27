/**
 * Communication governance â€” corridor validation, identity isolation, amendments.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { getFrozenDriftThresholds, guardCanonMutation, isFrozenCanonMode } from "./canonFreeze.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const CONSTITUTION_PATH = path.join(REPO_ROOT, "canonical/communication-governance-v1.json");
const GOV_DIR = path.join(REPO_ROOT, ".runtime/communication-governance");
const AMENDMENTS_PATH = path.join(GOV_DIR, "amendments.jsonl");
const GOVERNANCE_TICKS_PATH = path.join(GOV_DIR, "governance-ticks.jsonl");
const RUNTIME_CONSTITUTION_PATH = path.join(GOV_DIR, "constitution.runtime.json");

const IMPACT_RANK = { neither: 0, repo: 1, spec: 2, ops: 3 };

let cachedConstitution = null;

function ensureGovDir() {
  fs.mkdirSync(GOV_DIR, { recursive: true });
}

export function loadConstitution() {
  if (cachedConstitution) return cachedConstitution;
  const basePath = fs.existsSync(RUNTIME_CONSTITUTION_PATH)
    ? RUNTIME_CONSTITUTION_PATH
    : CONSTITUTION_PATH;
  cachedConstitution = JSON.parse(fs.readFileSync(basePath, "utf8"));
  return cachedConstitution;
}

export function reloadConstitution() {
  cachedConstitution = null;
  return loadConstitution();
}

export function getConstitutionVersion() {
  return loadConstitution().comm_constitution_version ?? loadConstitution().version;
}

export function listLanes() {
  return loadConstitution().lanes ?? [];
}

export function getLane(laneId) {
  return listLanes().find((l) => l.lane_id === laneId) ?? null;
}

function impactRank(impact) {
  return IMPACT_RANK[impact] ?? IMPACT_RANK.neither;
}

function corridorSummary(lane) {
  const c = lane.corridor;
  return `Allowed: ${c.categories.join("/")} @ ${c.altitudes.join("/")} Â· max impact ${c.max_impact}`;
}

export function getLaneContext(laneId) {
  const lane = getLane(laneId);
  if (!lane) return null;
  return {
    lane_id: lane.lane_id,
    label: lane.label,
    participants: lane.participants,
    status: lane.status ?? "ACTIVE",
    corridor_summary: corridorSummary(lane),
    corridor: lane.corridor,
    continuity_budget: lane.continuity_budget,
    reroute_to: lane.reroute_to,
    auto_reroute: lane.auto_reroute ?? false,
    comm_constitution_version: getConstitutionVersion(),
  };
}

/** Validate tick against lane corridor contract */
export function validateCorridor(tick, lane) {
  const violations = [];
  const corridor = lane.corridor;
  const category = tick.category;
  const altitude = tick.altitude ?? "human";
  const impact = tick.impact ?? tick.normative_impact ?? "neither";

  const categoryAllowed =
    corridor.categories.includes(category) ||
    (category === "human" && corridor.human_bandwidth);

  if (!categoryAllowed) {
    violations.push({
      type: "communicationCorridorDrift",
      field: "category",
      value: category,
      allowed: corridor.categories,
    });
  }

  if (!corridor.altitudes.includes(altitude)) {
    violations.push({
      type: "communicationCorridorDrift",
      field: "altitude",
      value: altitude,
      allowed: corridor.altitudes,
    });
  }

  if (impactRank(impact) > impactRank(corridor.max_impact)) {
    violations.push({
      type: "communicationCorridorDrift",
      field: "impact",
      value: impact,
      max: corridor.max_impact,
    });
  }

  return violations;
}

/** Â§4 â€” compute drift vector against lane corridor (AAIS-COMM-Î›-001) */
export function computeDriftVector(tick, lane, violations = []) {
  const corridor = lane.corridor;
  const category = tick.category;
  const altitude = tick.altitude ?? "human";
  const impact = tick.impact ?? tick.normative_impact ?? "neither";

  const categoryAllowed =
    corridor.categories.includes(category) ||
    (category === "human" && corridor.human_bandwidth);
  const semantic = categoryAllowed ? 0 : 1;

  const altitudeDrift = corridor.altitudes.includes(altitude) ? 0 : 1;

  const impactExcess = Math.max(0, impactRank(impact) - impactRank(corridor.max_impact));
  const impactDrift = impactExcess / 3;

  const latencyDrift = 0;

  const identityPenalty = violations.some((v) => v.type === "communicationIdentityDrift")
    ? 0.5
    : 0;

  const composite = Math.min(
    1,
    (semantic + altitudeDrift + impactDrift + latencyDrift + identityPenalty) / 4,
  );

  return {
    semantic,
    altitude: altitudeDrift,
    impact: impactDrift,
    latency: latencyDrift,
    composite,
  };
}

export function getDriftThresholds() {
  if (isFrozenCanonMode()) {
    const frozen = getFrozenDriftThresholds();
    return {
      warning: frozen.warning ?? 0.05,
      notify_operator: frozen.notify_operator ?? 0.15,
      containment_epoch: frozen.containment_epoch ?? 0.3,
      fail_closed: frozen.fail_closed ?? 0.5,
      strict: true,
    };
  }

  const rules = loadConstitution().rules?.drift_thresholds ?? {};
  return {
    warning: rules.warning ?? 0.05,
    notify_operator: rules.notify_operator ?? 0.15,
    containment_epoch: rules.containment_epoch ?? 0.3,
    fail_closed: rules.fail_closed ?? 0.5,
  };
}

/** Â§4 C-6 â€” map composite drift to containment action */
export function evaluateDriftContainment(driftVector) {
  const t = getDriftThresholds();
  const c = driftVector.composite;
  const strict = t.strict === true;

  if (strict ? c >= t.fail_closed : c > t.fail_closed) return "fail_closed";
  if (strict ? c >= t.containment_epoch : c > t.containment_epoch) return "containment_epoch";
  if (strict ? c >= t.notify_operator : c > t.notify_operator) return "notify_operator";
  if (strict ? c >= t.warning : c > t.warning) return "warning";
  return "ok";
}

export function suspendLane(laneId, reason) {
  const constitution = loadConstitution();
  const lane = constitution.lanes.find((l) => l.lane_id === laneId);
  if (!lane) return;
  lane.status = "SUSPENDED";
  lane.suspension_reason = reason;
  lane.suspended_at = new Date().toISOString();
  fs.writeFileSync(RUNTIME_CONSTITUTION_PATH, JSON.stringify(constitution, null, 2), "utf8");
  cachedConstitution = null;
}

export function appendCommunicationDriftTick(tick, driftVector, violations, containmentAction) {
  const driftTick = {
    id: `CDT-${crypto.randomUUID()}`,
    entry_type: "communicationDriftTick",
    timestamp: new Date().toISOString(),
    lane_id: tick.lane_id,
    source_tick_id: tick.id,
    comm_constitution_version: tick.comm_constitution_version,
    drift_vector: driftVector,
    containment_action: containmentAction,
    violations,
  };
  appendJsonl(path.join(GOV_DIR, "drift-ticks.jsonl"), driftTick);
  return driftTick;
}

/** Cross-lane identity isolation */
export function validateIdentity(tick, lane, context = {}) {
  const violations = [];
  const sourceLane = tick.source_lane_id ?? context.source_lane_id;

  if (sourceLane && sourceLane !== tick.lane_id) {
    if (!context.governance_receipt_id) {
      violations.push({
        type: "communicationIdentityDrift",
        field: "source_lane_id",
        source_lane_id: sourceLane,
        lane_id: tick.lane_id,
        message: "Cross-lane reference requires explicit governance receipt",
      });
    }
  }

  if (context.active_lane_id && context.active_lane_id !== tick.lane_id) {
    violations.push({
      type: "communicationIdentityDrift",
      field: "lane_context",
      active_lane_id: context.active_lane_id,
      tick_lane_id: tick.lane_id,
      message: "Tick lane does not match active operator lane context",
    });
  }

  if (lane.status === "SUSPENDED") {
    violations.push({
      type: "communicationLaneSuspended",
      lane_id: lane.lane_id,
      message: "Lane suspended pending recertification",
    });
  }

  return violations;
}

export function enforceCommunicationTick(body, context = {}) {
  if (!body.lane_id) {
    return { ok: false, error: "lane_id is mandatory on communicationTick" };
  }

  const lane = getLane(body.lane_id);
  if (!lane) {
    return { ok: false, error: `Unknown lane_id: ${body.lane_id}` };
  }

  const corridorViolations = validateCorridor(body, lane);
  const identityViolations = validateIdentity(body, lane, context);
  const violations = [...corridorViolations, ...identityViolations];

  const suspended = lane.status === "SUSPENDED" && !context.governance_override;
  if (suspended) {
    return {
      ok: false,
      error: `Lane ${body.lane_id} is SUSPENDED â€” governance override required`,
      violations,
    };
  }

  let corridor_status = "ok";
  if (violations.some((v) => v.type === "communicationIdentityDrift")) {
    corridor_status = "identity_drift";
  } else if (violations.some((v) => v.type === "communicationCorridorDrift")) {
    corridor_status = "corridor_drift";
  }

  const drift_vector = computeDriftVector(body, lane, violations);
  const containment_action = evaluateDriftContainment(drift_vector);

  return {
    ok: true,
    lane,
    violations,
    corridor_status,
    drift_vector,
    containment_action,
    comm_constitution_version: getConstitutionVersion(),
  };
}

export function resumeLane(laneId, operator_id, rationale) {
  const constitution = loadConstitution();
  const lane = constitution.lanes.find((l) => l.lane_id === laneId);
  if (!lane) throw new Error(`Lane not found: ${laneId}`);
  lane.status = "ACTIVE";
  lane.suspension_reason = null;
  lane.suspended_at = null;
  lane.resumed_at = new Date().toISOString();
  lane.resumed_by = operator_id ?? "operator:local";
  ensureGovDir();
  fs.writeFileSync(RUNTIME_CONSTITUTION_PATH, JSON.stringify(constitution, null, 2), "utf8");
  cachedConstitution = null;
  return appendCommunicationGovernanceTick({
    decision_type: "resume",
    communication_id: laneId,
    rationale: rationale ?? "Operator resumed lane",
    operator_id: operator_id ?? "operator:local",
    affected_lanes: [laneId],
  });
}

function appendJsonl(filePath, record) {
  ensureGovDir();
  fs.appendFileSync(filePath, `${JSON.stringify(record)}\n`, "utf8");
}

export function appendDriftTick(violationType, tick, violations) {
  const drift = {
    id: `CD-${crypto.randomUUID()}`,
    entry_type: violationType,
    timestamp: new Date().toISOString(),
    lane_id: tick.lane_id,
    source_tick_id: tick.id,
    comm_constitution_version: tick.comm_constitution_version,
    violations,
  };
  appendJsonl(path.join(GOV_DIR, "drift.jsonl"), drift);
  return drift;
}

export function appendCommunicationGovernanceTick(tick) {
  const record = {
    id: `CGT-${crypto.randomUUID()}`,
    entry_type: "communicationGovernanceTick",
    timestamp: new Date().toISOString(),
    comm_constitution_version: getConstitutionVersion(),
    ...tick,
  };
  appendJsonl(GOVERNANCE_TICKS_PATH, record);
  return record;
}

function bumpVersion(version, level = "MINOR") {
  const parts = version.split(".").map(Number);
  if (level === "MAJOR") return `${parts[0] + 1}.0.0`;
  if (level === "MINOR") return `${parts[0]}.${parts[1] + 1}.0`;
  return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
}

export function proposeAmendment(body) {
  const proposal = appendCommunicationGovernanceTick({
    decision_type: "propose-amendment",
    doc_id: body.doc_id ?? "AAIS-COMM-Î›-001",
    proposal: body.proposal,
    affected_lanes: body.affected_lanes ?? [],
    operator: body.operator ?? "operator:local",
  });
  return proposal;
}

export function analyzeAmendmentImpact(body) {
  const constitution = loadConstitution();
  const affected = body.affected_lanes?.length
    ? body.affected_lanes
    : constitution.lanes.map((l) => l.lane_id);

  return appendCommunicationGovernanceTick({
    decision_type: "impact-analysis",
    proposal_id: body.proposal_id,
    affected_lanes: affected,
    affected_panels: ["SemanticBridge", "CommunicationStream"],
    operator: body.operator ?? "operator:local",
  });
}

export function approveAmendment(body) {
  if (!body.proposal_id) {
    throw new Error("proposal_id required for approval");
  }

  const approval = appendCommunicationGovernanceTick({
    decision_type: "approve-amendment",
    proposal_id: body.proposal_id,
    operator: body.operator ?? "operator:local",
    approved_at: new Date().toISOString(),
  });

  if (body.updated_constitution) {
    applyConstitutionUpdate(body.updated_constitution, body.version_bump ?? "MINOR", {
      amendment_unlock: body.amendment_doc_id,
    });
  }

  return approval;
}

export function applyConstitutionUpdate(updatedConstitution, versionBump = "MINOR", context = {}) {
  guardCanonMutation("applyConstitutionUpdate", context);
  ensureGovDir();
  const current = loadConstitution();
  const nextVersion = bumpVersion(
    current.comm_constitution_version ?? current.version,
    versionBump,
  );

  const next = {
    ...current,
    ...updatedConstitution,
    comm_constitution_version: nextVersion,
    version: nextVersion,
  };

  fs.writeFileSync(RUNTIME_CONSTITUTION_PATH, JSON.stringify(next, null, 2), "utf8");
  cachedConstitution = null;

  if (versionBump === "MAJOR") {
    recertifyAllLanes(next);
  }

  appendCommunicationGovernanceTick({
    decision_type: "version-increment",
    comm_constitution_version: nextVersion,
    version_bump: versionBump,
  });

  return next;
}

function recertifyAllLanes(constitution) {
  for (const lane of constitution.lanes) {
    const violations = [];
    if (!lane.corridor?.categories?.length) {
      violations.push("missing corridor categories");
    }
    lane.status = violations.length ? "SUSPENDED" : "ACTIVE";
    lane.last_recertified = violations.length ? null : new Date().toISOString();
    lane.recertification_violations = violations;
  }
  fs.writeFileSync(RUNTIME_CONSTITUTION_PATH, JSON.stringify(constitution, null, 2), "utf8");
  cachedConstitution = null;
}

export function listCommunicationTicksForLane(laneId, limit = 50) {
  const logPath = path.join(REPO_ROOT, ".runtime/communication-ledger/ticks.jsonl");
  if (!fs.existsSync(logPath)) return [];
  const lines = fs.readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean);
  return lines
    .map((l) => JSON.parse(l))
    .filter((t) => t.lane_id === laneId)
    .slice(-limit)
    .reverse();
}

export function listCommunicationTicksFiltered({ laneId, governanceOverride = false, limit = 50 }) {
  if (!laneId && !governanceOverride) {
    throw new Error("lane_id required â€” no global communication queries without governance override");
  }

  const logPath = path.join(REPO_ROOT, ".runtime/communication-ledger/ticks.jsonl");
  if (!fs.existsSync(logPath)) return [];

  const lines = fs.readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean);
  let ticks = lines.map((l) => JSON.parse(l));

  if (laneId) {
    ticks = ticks.filter((t) => t.lane_id === laneId);
  }

  return ticks.slice(-limit).reverse();
}
