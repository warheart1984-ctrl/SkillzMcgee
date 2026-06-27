import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COMM_CANON_PATH } from "./store.mjs";
import { listLaneContracts } from "./laneRegistry.mjs";
import { listEpochs } from "./epochStore.mjs";
import { listCrossLaneInvariants } from "./invariantStore.mjs";
import { listRoutingRules } from "./router.mjs";
import { getConstitutionVersions } from "./constitutionStore.mjs";
import { writeCommunicationLedgerEntry } from "./ledger.mjs";

export async function generateCommunicationCanon({ sealed = false } = {}) {
  const lanes = listLaneContracts();
  const epochs = listEpochs();
  const invariants = listCrossLaneInvariants();
  const routing = listRoutingRules();
  const versions = getConstitutionVersions();

  return `# COMMUNICATION CANON (COMM-CANON)
Version: ${versions["COMM-CANON"] || "1.0.0"}
Generated: ${new Date().toISOString()}
Status: ${sealed ? "SEALED" : "LIVING ARTIFACT"}

---

## §1 — ACTIVE LANES
\`\`\`json
${JSON.stringify({ lanes }, null, 2)}
\`\`\`

## §2 — EPOCHS
\`\`\`json
${JSON.stringify({ epochs }, null, 2)}
\`\`\`

## §3 — CONTINUITY BUDGETS
\`\`\`json
${JSON.stringify({ budgets: Object.fromEntries(lanes.map((lane) => [lane.lane_id, lane.continuity_budget])) }, null, 2)}
\`\`\`

## §4 — DRIFT THRESHOLDS
\`\`\`json
${JSON.stringify({ drift_thresholds: { warn: 0.05, notify: 0.15, contain: 0.3, fail_closed: 0.5 } }, null, 2)}
\`\`\`

## §5 — CROSS-LANE INVARIANTS
\`\`\`json
${JSON.stringify({ cross_lane_invariants: invariants }, null, 2)}
\`\`\`

## §6 — ROUTING RULES
\`\`\`json
${JSON.stringify({ routing_rules: routing }, null, 2)}
\`\`\`

## §7 — CONSTITUTION VERSIONS
\`\`\`json
${JSON.stringify({ constitution_versions: versions }, null, 2)}
\`\`\`

## §8 — LANE TOPOLOGY
\`\`\`json
${JSON.stringify({ lane_topology: { splits: [], merges: [], retired_lanes: [] } }, null, 2)}
\`\`\`
`;
}

export function canonHash(markdown) {
  return `sha256:${createHash("sha256").update(markdown).digest("hex")}`;
}

export async function freezeCommunicationCanon(operator_id = "jon") {
  const canon = await generateCommunicationCanon({ sealed: true });
  fs.mkdirSync(path.dirname(COMM_CANON_PATH), { recursive: true });
  fs.writeFileSync(COMM_CANON_PATH, canon, "utf8");
  const tick = writeCommunicationLedgerEntry({
    entry_type: "communicationCanonFreezeTick",
    timestamp: new Date().toISOString(),
    canon_version: "1.0.0",
    hash: canonHash(canon),
    operator_id,
  });
  return { canon, hash: tick.hash, tick };
}
