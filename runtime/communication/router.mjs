import { listLedgerEntries } from "./store.mjs";

export const DEFAULT_ROUTING_RULES = [
  {
    from_lane: "jon-darz-spec",
    to_lane: "jon-darz-human",
    reason: "category_out_of_corridor",
  },
  {
    source_lane: "jon-darz-human",
    target_lane: "jon-darz-architecture",
    threshold: 0.25,
    effect: "warn",
  },
];

export function listRoutingRules() {
  const topology = listLedgerEntries().filter((entry) =>
    ["communicationRerouteTick", "communicationPropagationTick"].includes(entry.entry_type),
  );
  return [...DEFAULT_ROUTING_RULES, ...topology];
}

export function routeMessage(tick, lane) {
  const target = lane.reroute_to || "jon-darz-human";
  return {
    ...tick,
    lane_id: target,
    routed_from_lane_id: lane.lane_id,
    reroute_reason: "category_out_of_corridor",
  };
}
