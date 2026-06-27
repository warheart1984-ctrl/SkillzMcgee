/**
 * Canon generator â€” runtime state â†’ COMM-CANON.md (structured JSON sections).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  getConstitutionVersion,
  getDriftThresholds,
  listLanes,
  loadConstitution,
} from "./communicationGovernance.mjs";
import { listEpochs, getEpochBudgetSummary } from "./communicationEpochs.mjs";
import { getLaneTopology } from "./communicationTopology.mjs";
import { getCrossLaneInvariantRegistry } from "./communicationInvariants.mjs";
import { parseCanon } from "./canonParser.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const CANON_JSON_PATH = path.join(REPO_ROOT, ".runtime/communication-governance/COMM-CANON.json");
const CANON_MD_PATH = path.join(REPO_ROOT, "governance/communication/COMM-CANON.md");
const CANON_HISTORY_DIR = path.join(REPO_ROOT, ".runtime/communication-governance/canon-history");

export function listLaneContracts() {
  return listLanes().map((lane) => ({
    lane_id: lane.lane_id,
    label: lane.label,
    participants: lane.participants,
    allowed_categories: lane.allowed_categories ?? lane.corridor?.categories ?? [],
    allowed_altitudes: lane.allowed_altitudes ?? lane.corridor?.altitudes ?? [],
    max_impact: lane.corridor?.max_impact,
    human_bandwidth: lane.corridor?.human_bandwidth,
    continuity_budget: {
      ...(lane.continuity_budget ?? {
        max_composite: 0.3,
        session_budget: 0.5,
        reset_policy: "per-epoch",
      }),
      session_spent: getEpochBudgetSummary(lane.lane_id).session_spent,
    },
    comm_constitution_version: lane.comm_constitution_version ?? getConstitutionVersion(),
    status: lane.status ?? "ACTIVE",
    reroute_to: lane.reroute_to,
  }));
}

export function listCrossLaneInvariants() {
  return getCrossLaneInvariantRegistry();
}

export function listRoutingRules() {
  const constitution = loadConstitution();
  return constitution.routing_rules ?? [];
}

export function getConstitutionVersions() {
  const constitution = loadConstitution();
  return {
    "COMM-CANON": "1.0.0",
    "AAIS-COMM-Î›-001": constitution.version ?? constitution.comm_constitution_version ?? "1.0.0",
    "AAIS-COMM-Î›-002": "1.0.0",
  };
}

function buildLaneTopologyPayload() {
  const topology = getLaneTopology();
  const lanes = listLanes();
  const retired = lanes
    .filter((l) => ["DEPRECATED", "SPLIT", "MERGED", "SUSPENDED"].includes(l.status))
    .map((l) => ({ lane_id: l.lane_id, status: l.status }));

  return {
    splits: topology.splits ?? [],
    merges: topology.merges ?? [],
    retired_lanes: retired,
  };
}

/** Build structured canon data object (machine-readable). */
export function buildCanonData() {
  const lanes = listLaneContracts();
  const epochs = listEpochs();
  const invariants = listCrossLaneInvariants();
  const routing = listRoutingRules();
  const versions = getConstitutionVersions();
  const driftThresholds = getDriftThresholds();

  return {
    doc_id: "COMM-CANON",
    version: versions["COMM-CANON"],
    generated_at: new Date().toISOString(),
    lanes,
    epochs,
    budgets: Object.fromEntries(lanes.map((l) => [l.lane_id, l.continuity_budget])),
    drift_thresholds: {
      warn: driftThresholds.warning,
      notify: driftThresholds.notify_operator,
      contain: driftThresholds.containment_epoch,
      fail_closed: driftThresholds.fail_closed,
    },
    cross_lane_invariants: invariants,
    routing_rules: routing,
    constitution_versions: versions,
    lane_topology: buildLaneTopologyPayload(),
  };
}

/** Generate COMM-CANON markdown string matching constitutional structure. */
export function generateCommunicationCanon(options = {}) {
  const data = buildCanonData();
  const canonState = options.canon_state ?? data.canon_state ?? "LIVING ARTIFACT";
  const statusLabel = canonState === "FROZEN" ? "SEALED" : "LIVING ARTIFACT";

  return `# COMMUNICATION CANON (COMM-CANON)

**Version:** ${data.version}
**Generated:** ${data.generated_at}
**Status:** ${statusLabel}
**Canon State:** ${canonState === "FROZEN" ? "FROZEN" : "LIVING"}

---

## Â§1 â€” ACTIVE LANES

\`\`\`json
${JSON.stringify({ lanes: data.lanes }, null, 2)}
\`\`\`

## Â§2 â€” EPOCHS

\`\`\`json
${JSON.stringify({ epochs: data.epochs }, null, 2)}
\`\`\`

## Â§3 â€” CONTINUITY BUDGETS

\`\`\`json
${JSON.stringify({ budgets: data.budgets }, null, 2)}
\`\`\`

## Â§4 â€” DRIFT THRESHOLDS

\`\`\`json
${JSON.stringify({ drift_thresholds: data.drift_thresholds }, null, 2)}
\`\`\`

## Â§5 â€” CROSS-LANE INVARIANTS

\`\`\`json
${JSON.stringify({ cross_lane_invariants: data.cross_lane_invariants }, null, 2)}
\`\`\`

## Â§6 â€” ROUTING RULES

\`\`\`json
${JSON.stringify({ routing_rules: data.routing_rules }, null, 2)}
\`\`\`

## Â§7 â€” CONSTITUTION VERSIONS

\`\`\`json
${JSON.stringify({ constitution_versions: data.constitution_versions }, null, 2)}
\`\`\`

## Â§8 â€” LANE TOPOLOGY

\`\`\`json
${JSON.stringify({ lane_topology: data.lane_topology }, null, 2)}
\`\`\`
`;
}

function archivePreviousCanon(previousMarkdown) {
  if (!previousMarkdown?.trim()) return null;
  fs.mkdirSync(CANON_HISTORY_DIR, { recursive: true });
  const archivePath = path.join(CANON_HISTORY_DIR, `${Date.now()}-COMM-CANON.md`);
  fs.writeFileSync(archivePath, previousMarkdown, "utf8");
  return archivePath;
}

/** Write canon to disk; archive prior version for diff. */
export async function writeCommunicationCanon() {
  const { guardCanonMutation, isCanonFrozen } = await import("./canonFreeze.mjs");
  guardCanonMutation("writeCommunicationCanon");

  const previousMarkdown = fs.existsSync(CANON_MD_PATH)
    ? fs.readFileSync(CANON_MD_PATH, "utf8")
    : null;

  const markdown = generateCommunicationCanon({
    canon_state: isCanonFrozen() ? "FROZEN" : "LIVING",
  });
  const data = buildCanonData();
  const parsed = parseCanon(markdown);

  fs.mkdirSync(path.dirname(CANON_JSON_PATH), { recursive: true });
  fs.mkdirSync(path.dirname(CANON_MD_PATH), { recursive: true });

  const archived = archivePreviousCanon(previousMarkdown);
  fs.writeFileSync(CANON_MD_PATH, markdown, "utf8");
  fs.writeFileSync(
    CANON_JSON_PATH,
    JSON.stringify({ ...data, parsed_sections: Object.keys(parsed) }, null, 2),
    "utf8",
  );

  return {
    markdown,
    data,
    parsed,
    archived_path: archived,
  };
}

export function readCommunicationCanonMarkdown() {
  if (fs.existsSync(CANON_MD_PATH)) {
    return fs.readFileSync(CANON_MD_PATH, "utf8");
  }
  return generateCommunicationCanon();
}

export function readParsedCommunicationCanon() {
  const md = readCommunicationCanonMarkdown();
  return parseCanon(md);
}

export function getCanonJsonPath() {
  return CANON_JSON_PATH;
}

export function getCanonMarkdownPath() {
  return CANON_MD_PATH;
}

/** Anchor canon regeneration in ledger as governance tick metadata. */
export async function anchorCanonRegeneration() {
  const result = await writeCommunicationCanon();
  return {
    id: `CANON-${crypto.randomUUID()}`,
    entry_type: "communicationCanonTick",
    timestamp: new Date().toISOString(),
    version: result.data.version,
    section_count: Object.keys(result.parsed).length,
    archived_path: result.archived_path,
  };
}
