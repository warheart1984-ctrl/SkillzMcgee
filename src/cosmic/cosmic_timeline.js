/**
 * Cosmic Timeline — read-model over cosmic ledger stream
 */

/**
 * @typedef {Object} CosmicTimelineEvent
 * @property {string} type
 * @property {number} timestamp
 * @property {any} [details]
 * @property {any} [task]
 * @property {any} [conflict]
 * @property {any} [health]
 * @property {number} [epoch]
 */

/**
 * @param {any} entry
 * @returns {CosmicTimelineEvent | null}
 */
export function mapLedgerEntryToTimeline(entry) {
  const { type, payload, timestamp } = entry;

  switch (type) {
    case "GENESIS_CANDIDATE_NEED":
      return { type: "genesis_candidate", details: payload, timestamp };
    case "GENESIS_COMMITTED":
      return { type: "genesis_committed", details: payload, timestamp };
    case "CONTINUITY_TASK_EXECUTED":
      return { type: "continuity_task", task: payload.task, timestamp };
    case "CONTINUITY_NEED":
      return { type: "continuity_need", details: payload.need, timestamp };
    case "META_CONTINUITY_TICK":
      return { type: "health_tick", health: payload.health, timestamp };
    case "REPAIR_LINEAGE":
      return { type: "repair", details: payload, timestamp };
    case "CONFLICT_DETECTED":
      return { type: "conflict_detected", conflict: payload, timestamp };
    case "RECONCILIATION_APPLIED":
      return { type: "reconciliation", details: payload, timestamp };
    case "MIGRATION_RECORDED":
      return { type: "migration", details: payload, timestamp };
    case "COLLAPSE_TRIGGERED":
      return { type: "collapse", details: payload, timestamp };
    case "UNIVERSE_FORK":
      return { type: "fork", details: payload, timestamp };
    case "UNIVERSE_MERGE":
      return { type: "merge", details: payload, timestamp };
    case "EPOCH_START":
      return { type: "epoch_start", epoch: payload.epoch, timestamp };
    case "EPOCH_END":
      return { type: "epoch_end", epoch: payload.epoch, timestamp };
    case "COSMOLOGICAL_MEMORY_TICK":
      return { type: "health_tick", health: payload, timestamp };
    case "BEHAVIOR_GOAL_PROPOSED":
      return { type: "behavior_goal", details: payload, timestamp };
    case "BEHAVIOR_TASK_EXECUTED":
      return { type: "behavior_task", task: payload.task, timestamp };
    case "BEHAVIOR_GOAL_VETOED":
    case "BEHAVIOR_TASK_BLOCKED":
      return { type: "behavior_veto", details: payload, timestamp };
    case "META_BEHAVIOR_CHANGE":
      return { type: "meta_behavior", details: payload, timestamp };
    default:
      return null;
  }
}

/**
 * @param {any[]} cosmicLedger
 * @returns {CosmicTimelineEvent[]}
 */
export function buildCosmicTimeline(cosmicLedger) {
  const timeline = [];
  for (const entry of cosmicLedger) {
    const evt = mapLedgerEntryToTimeline(entry);
    if (evt) timeline.push(evt);
  }
  timeline.sort((a, b) => a.timestamp - b.timestamp);
  return timeline;
}

/**
 * @param {CosmicTimelineEvent[]} timeline
 * @returns {string[]}
 */
export function renderCosmicTimeline(timeline) {
  const lines = [];
  for (const evt of timeline) {
    switch (evt.type) {
      case "epoch_start":
        lines.push(`Epoch ${evt.epoch} begins`);
        break;
      case "epoch_end":
        lines.push(`Epoch ${evt.epoch} ends`);
        break;
      case "continuity_need":
        lines.push(`Need: ${evt.details?.type ?? "unknown"} (${evt.details?.severity})`);
        break;
      case "continuity_task":
        lines.push(`Continuity task: ${evt.task?.action ?? "unknown"}`);
        break;
      case "conflict_detected":
        lines.push(`Conflict: ${evt.conflict?.id ?? "unknown"}`);
        break;
      case "reconciliation":
        lines.push("Reconciliation applied");
        break;
      case "repair":
        lines.push("Repair performed");
        break;
      case "migration":
        lines.push(`Migration: ${evt.details?.lineageId ?? "unknown"}`);
        break;
      case "genesis_candidate":
        lines.push("Genesis candidate detected");
        break;
      case "genesis_committed":
        lines.push("Genesis committed — new universe state");
        break;
      case "collapse":
        lines.push("Subsystem collapse triggered");
        break;
      case "fork":
        lines.push("Universe forked");
        break;
      case "merge":
        lines.push("Universes merged");
        break;
      case "health_tick":
        lines.push(`Health: ${JSON.stringify(evt.health)}`);
        break;
      case "behavior_goal":
        lines.push(`Behavior goal: ${evt.details?.goal?.description ?? "proposed"}`);
        break;
      case "behavior_task":
        lines.push(`Behavior task: ${evt.task?.action ?? "executed"}`);
        break;
      case "behavior_veto":
        lines.push(`Behavior veto: ${evt.details?.reason ?? evt.details?.goalId ?? "blocked"}`);
        break;
      case "meta_behavior":
        lines.push(`Meta-behavior change: ${evt.details?.metaGoal?.action ?? "applied"}`);
        break;
      default:
        lines.push(`Event: ${evt.type}`);
    }
  }
  return lines;
}

/**
 * @param {any} baseLedger
 * @returns {string[]}
 */
export function cosmicTimelineView(baseLedger) {
  const stream = baseLedger?.cosmicStream ?? baseLedger?.readStream?.("cosmic") ?? [];
  const cosmicStream = typeof stream === "function" ? stream() : stream;
  const timeline = buildCosmicTimeline(cosmicStream);
  return renderCosmicTimeline(timeline);
}
