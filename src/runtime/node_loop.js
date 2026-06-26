/**
 * Federated node loop — AS-Ω fold + substration tick after each cycle
 */

import { bootFederatedNode, foldFederatedSingularity } from "../federation/frs.js";
import { federationTick } from "../federation/federation_tick.js";
import { createRuntime, syncContinuityFromFold } from "./federated_runtime.js";
import { cosmicTimelineView } from "../cosmic/cosmic_timeline.js";

/**
 * Run one federated cycle: fold → tick → return results.
 * @param {object} nodeState
 * @param {any[]} nodeState.ledger
 * @param {any} nodeState.identity
 * @param {any} nodeState.continuity
 * @param {any} nodeState.runtime
 */
export async function runFederatedCycle(nodeState) {
  const { ledger, identity, runtime } = nodeState;
  let { continuity } = nodeState;

  const fold = foldFederatedSingularity(ledger, identity, continuity);
  continuity = syncContinuityFromFold(fold.continuity, fold.asOmega);
  runtime.setContinuity(continuity);
  if (runtime.asOmega?.fold) {
    runtime.asOmega.fold(ledger);
  }

  const tickResult = await federationTick(runtime);

  return {
    fold,
    continuity,
    tickResult,
    timeline: cosmicTimelineView(runtime.baseLedger),
  };
}

/**
 * Boot a federated node with runtime ready for tick loop.
 * @param {object} [options]
 * @param {any[]} [options.ledger]
 * @param {any} [options.agents]
 * @param {object} [options.config]
 */
export function bootFederatedRuntime(options = {}) {
  const { identity, continuity: initialContinuity } = bootFederatedNode(options);
  const ledger = options.ledger ?? [];
  const baseLedger = {
    entries: ledger,
    cosmicStream: [],
    append(entry) {
      this.entries.push(entry);
      return entry.id ?? `entry-${this.entries.length}`;
    },
  };

  const runtime = createRuntime(baseLedger, options.agents ?? { spawn: async () => {} }, {
    continuity: initialContinuity,
    nodeId: identity.nodeId,
    ...options.config,
  });
  runtime.setContinuity(initialContinuity);

  return { identity, continuity: initialContinuity, ledger, baseLedger, runtime };
}

/**
 * @param {ReturnType<typeof bootFederatedRuntime>} node
 * @param {number} cycles
 */
export async function runFederatedNodeLoop(node, cycles = 1) {
  const results = [];
  for (let i = 0; i < cycles; i++) {
    const cycle = await runFederatedCycle({
      ledger: node.baseLedger.entries,
      identity: node.identity,
      continuity: node.runtime.getContinuity(),
      runtime: node.runtime,
    });
    node.runtime.setContinuity(cycle.continuity);
    results.push(cycle);
  }
  return results;
}
