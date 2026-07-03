/**
 * Cross-lane drift propagation rules.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadConstitution } from "./communicationGovernance.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const GOV_DIR = path.join(REPO_ROOT, ".runtime/communication-governance");

const propagationEffects = new Map();

function getPropagationRules() {
  return loadConstitution().propagation_rules ?? [
    {
      source_lane: "jon-darz-human",
      target_lane: "jon-darz-spec",
      threshold: 0.25,
      effect: "warn",
    },
    {
      source_lane: "jon-darz-human",
      target_lane: "jon-darz-architecture",
      threshold: 0.25,
      effect: "warn",
    },
  ];
}

function appendPropagationTick(record) {
  fs.mkdirSync(GOV_DIR, { recursive: true });
  fs.appendFileSync(
    path.join(GOV_DIR, "propagation.jsonl"),
    `${JSON.stringify(record)}\n`,
    "utf8",
  );
}

export function markLanePropagationEffect(laneId, effect, sourceDrift) {
  propagationEffects.set(laneId, {
    effect,
    source_drift: sourceDrift,
    marked_at: new Date().toISOString(),
  });
}

export function getLanePropagationEffect(laneId) {
  return propagationEffects.get(laneId) ?? null;
}

export function applyCrossLanePropagation(laneDrifts) {
  const byId = new Map(laneDrifts.map((d) => [d.lane_id, d]));
  const effects = [];

  for (const rule of getPropagationRules()) {
    const src = byId.get(rule.source_lane);
    const tgt = byId.get(rule.target_lane);
    if (!src || !tgt) continue;

    if (src.composite_drift > rule.threshold) {
      markLanePropagationEffect(rule.target_lane, rule.effect, src.composite_drift);
      const tick = {
        id: `CPT-${crypto.randomUUID()}`,
        entry_type: "communicationPropagationTick",
        timestamp: new Date().toISOString(),
        source_lane: rule.source_lane,
        target_lane: rule.target_lane,
        source_drift: src.composite_drift,
        effect: rule.effect,
      };
      appendPropagationTick(tick);
      effects.push({ rule, source: src, target: tgt, tick });
    }
  }

  return effects;
}
