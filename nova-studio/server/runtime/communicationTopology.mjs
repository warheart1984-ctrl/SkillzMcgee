/**
 * Lane topology — split and merge communication contexts.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  appendCommunicationGovernanceTick,
  getConstitutionVersion,
  loadConstitution,
  reloadConstitution,
} from "./communicationGovernance.mjs";
import { guardCanonMutation } from "./canonFreeze.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const RUNTIME_CONSTITUTION_PATH = path.join(
  REPO_ROOT,
  ".runtime/communication-governance/constitution.runtime.json",
);
const TOPOLOGY_PATH = path.join(REPO_ROOT, ".runtime/communication-governance/topology.json");

function readTopology() {
  if (!fs.existsSync(TOPOLOGY_PATH)) {
    return { splits: [], merges: [], retired_lanes: [] };
  }
  return JSON.parse(fs.readFileSync(TOPOLOGY_PATH, "utf8"));
}

function writeTopology(topology) {
  fs.mkdirSync(path.dirname(TOPOLOGY_PATH), { recursive: true });
  fs.writeFileSync(TOPOLOGY_PATH, JSON.stringify(topology, null, 2), "utf8");
}

function persistConstitution(constitution) {
  fs.mkdirSync(path.dirname(RUNTIME_CONSTITUTION_PATH), { recursive: true });
  fs.writeFileSync(RUNTIME_CONSTITUTION_PATH, JSON.stringify(constitution, null, 2), "utf8");
  reloadConstitution();
}

export function splitLane(body) {
  guardCanonMutation("splitLane", { amendment_unlock: body.amendment_doc_id });
  const constitution = loadConstitution();
  const source = constitution.lanes.find((l) => l.lane_id === body.source_lane_id);
  if (!source) throw new Error(`Source lane not found: ${body.source_lane_id}`);

  source.status = "SPLIT";

  const newLanes = (body.new_lanes ?? []).map((nl) => ({
    ...source,
    lane_id: nl.lane_id,
    label: nl.label ?? nl.lane_id,
    status: "ACTIVE",
    corridor: nl.corridor ?? source.corridor,
    allowed_categories: nl.allowed_categories ?? source.allowed_categories,
    allowed_altitudes: nl.allowed_altitudes ?? source.allowed_altitudes,
    continuity_budget: nl.continuity_budget ?? source.continuity_budget,
    comm_constitution_version: getConstitutionVersion(),
  }));

  constitution.lanes.push(...newLanes);
  persistConstitution(constitution);

  const tick = {
    id: `CLST-${crypto.randomUUID()}`,
    entry_type: "communicationLaneSplitTick",
    timestamp: new Date().toISOString(),
    source_lane_id: body.source_lane_id,
    new_lanes: newLanes.map((l) => ({ lane_id: l.lane_id, contract_id: l.lane_id })),
    rationale: body.rationale ?? "",
    operator_id: body.operator_id ?? "operator:local",
    comm_constitution_version: getConstitutionVersion(),
  };

  const topology = readTopology();
  topology.splits.push(tick);
  writeTopology(topology);

  appendCommunicationGovernanceTick({
    decision_type: "lane-split",
    communication_id: tick.id,
    rationale: body.rationale,
    operator_id: body.operator_id,
    affected_lanes: [body.source_lane_id, ...newLanes.map((l) => l.lane_id)],
  });

  return tick;
}

export function mergeLanes(body) {
  guardCanonMutation("mergeLanes", { amendment_unlock: body.amendment_doc_id });
  const constitution = loadConstitution();
  const sources = body.source_lanes ?? [];
  const targetId = body.target_lane_id;

  for (const id of sources) {
    const lane = constitution.lanes.find((l) => l.lane_id === id);
    if (lane) lane.status = "MERGED";
  }

  let target = constitution.lanes.find((l) => l.lane_id === targetId);
  if (!target) {
    const first = constitution.lanes.find((l) => l.lane_id === sources[0]);
    target = {
      ...first,
      lane_id: targetId,
      label: body.label ?? targetId,
      status: "ACTIVE",
      comm_constitution_version: getConstitutionVersion(),
    };
    constitution.lanes.push(target);
  } else {
    target.status = "ACTIVE";
  }

  persistConstitution(constitution);

  const tick = {
    id: `CLMT-${crypto.randomUUID()}`,
    entry_type: "communicationLaneMergeTick",
    timestamp: new Date().toISOString(),
    source_lanes: sources,
    target_lane_id: targetId,
    rationale: body.rationale ?? "",
    operator_id: body.operator_id ?? "operator:local",
    comm_constitution_version: getConstitutionVersion(),
  };

  const topology = readTopology();
  topology.merges.push(tick);
  writeTopology(topology);

  appendCommunicationGovernanceTick({
    decision_type: "lane-merge",
    communication_id: tick.id,
    rationale: body.rationale,
    operator_id: body.operator_id,
    affected_lanes: [...sources, targetId],
  });

  return tick;
}

export function getLaneTopology() {
  return readTopology();
}
