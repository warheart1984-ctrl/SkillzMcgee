/**
 * Communication Canon â€” facade over canonGenerator for backward compatibility.
 */
import fs from "node:fs";
import {
  buildCanonData,
  generateCommunicationCanon,
  readCommunicationCanonMarkdown,
  readParsedCommunicationCanon,
  writeCommunicationCanon,
  anchorCanonRegeneration,
  getCanonJsonPath,
} from "./canonGenerator.mjs";
import { diffCanons } from "./canonDiffEngine.mjs";
import {
  freezeCommunicationCanon,
  getCanonFreezeState,
  isCanonFrozen,
  isFrozenCanonMode,
  readCanonBaseline,
  guardCanonMutation,
} from "./canonFreeze.mjs";
import { getContinuityFoldState } from "./continuityFold.mjs";
import { getKillSwitchState } from "./communicationControl.mjs";
import { listRerouteEvents } from "./communicationEnforcement.mjs";
import { runCrossLaneInvariants } from "./communicationInvariants.mjs";

export {
  generateCommunicationCanon,
  buildCanonData,
  readCommunicationCanonMarkdown,
  readParsedCommunicationCanon,
  writeCommunicationCanon,
  anchorCanonRegeneration,
  diffCanons,
  freezeCommunicationCanon,
  getCanonFreezeState,
  isCanonFrozen,
  isFrozenCanonMode,
  guardCanonMutation,
};

export function buildCommunicationCanon() {
  const data = buildCanonData();
  const freeze = getCanonFreezeState();
  return {
    ...data,
    canon_state: freeze.canon_state,
    baseline_id: freeze.baseline_id,
    hash: freeze.hash,
    frozen_at: freeze.frozen_at,
    required_amendment: freeze.required_amendment,
    strict_enforcement: freeze.strict_enforcement,
    continuity_fold: getContinuityFoldState(),
    kill_switch: getKillSwitchState(),
    reroutes_recent: listRerouteEvents(null, 10),
    invariant_results: runCrossLaneInvariants().map((i) => ({
      invariant_id: i.invariant_id,
      ok: i.ok,
      violation_count: i.violations?.length ?? 0,
    })),
  };
}

export async function regenerateCommunicationCanon() {
  guardCanonMutation("regenerateCommunicationCanon");
  const result = await writeCommunicationCanon();
  const extended = buildCommunicationCanon();
  fs.writeFileSync(getCanonJsonPath(), JSON.stringify(extended, null, 2), "utf8");
  return extended;
}

export function getCommunicationCanon() {
  if (fs.existsSync(getCanonJsonPath())) {
    try {
      return JSON.parse(fs.readFileSync(getCanonJsonPath(), "utf8"));
    } catch {
      /* fall through to live build */
    }
  }
  return buildCommunicationCanon();
}

export function diffCommunicationCanon(regenerate = false) {
  if (isCanonFrozen()) {
    const baseline = readCanonBaseline();
    const current = regenerate ? generateCommunicationCanon({ canon_state: "FROZEN" }) : generateCommunicationCanon();
    const diff = diffCanons(baseline ?? readCommunicationCanonMarkdown(), current);
    return {
      ...diff,
      baseline_id: getCanonFreezeState().baseline_id,
      mode: "frozen_baseline",
    };
  }

  const oldMarkdown = readCommunicationCanonMarkdown();
  const newMarkdown = regenerate
    ? generateCommunicationCanon()
    : generateCommunicationCanon();
  return { ...diffCanons(oldMarkdown, newMarkdown), mode: "living" };
}
