/**
 * Federated runtime — cosmic ledger + continuity state + CRK-1 / AS-Ω services
 */

import { createCosmicLedger } from "../cosmic/cosmic_ledger.js";
import { getContinuityState } from "../cosmic/continuity_state.js";
import { createCrk1Runtime } from "../crk1/runtime.js";
import { createAsOmegaServices } from "../singularity/collapse.js";
import { computeGlobalRoot } from "../federation/frs_continuity/continuity.js";
import { createBehaviorRules } from "../behavior/grammar.js";

/**
 * @param {any} baseLedger
 * @param {any} agents
 * @param {any} config
 * @param {object} [services]
 * @param {any} [services.crk1]
 * @param {any} [services.asOmega]
 */
export function createRuntime(baseLedger, agents, config, services = {}) {
  const cosmicLedger = createCosmicLedger(baseLedger);
  let continuity = config?.continuity ?? null;

  const getContinuity = () => continuity;
  const setContinuity = (state) => {
    continuity = state;
  };

  const crk1 =
    services.crk1 ??
    createCrk1Runtime({
      baseLedger,
      cosmicLedger,
      getContinuity,
      setContinuity,
      nodeId: config?.nodeId ?? "local",
    });

  const asOmega =
    services.asOmega ?? createAsOmegaServices(baseLedger?.entries ?? baseLedger ?? [], cosmicLedger);

  const runtime = {
    ledger: cosmicLedger,
    baseLedger,
    agents,
    crk1,
    asOmega,
    behaviorRules: createBehaviorRules(),
    getFederationConfig: () => config ?? {},
    getContinuityState: (ledger = baseLedger) => {
      if (!continuity) {
        return getContinuityState(ledger, { nodeRoots: [], federatedLineages: {}, globalRoot: "" });
      }
      return getContinuityState(ledger, continuity);
    },
    setContinuity,
    getContinuity,
  };

  baseLedger.recomputeGlobalRoot = async () => crk1.recomputeGlobalRoot();
  baseLedger.runReconciliationCycle = async () => crk1.runReconciliationCycle();
  baseLedger.repairLineage = async (lineageId) => crk1.repairLineage(lineageId);

  return runtime;
}

/**
 * Sync continuity global root after AS-Ω fold.
 * @param {any} continuity
 * @param {any} asOmegaFold
 */
export function syncContinuityFromFold(continuity, asOmegaFold) {
  if (!continuity) return continuity;
  const next = { ...continuity, globalRoot: computeGlobalRoot(continuity) };
  if (asOmegaFold?.merkle?.globalRoot && continuity.nodeRoots?.length) {
    const nodeId = asOmegaFold.meta?.nodeId ?? continuity.nodeRoots[0]?.nodeId;
    const idx = next.nodeRoots.findIndex((r) => r.nodeId === nodeId);
    if (idx >= 0) {
      next.nodeRoots = [...next.nodeRoots];
      next.nodeRoots[idx] = {
        ...next.nodeRoots[idx],
        globalMerkleRoot: asOmegaFold.merkle.globalRoot,
        height: asOmegaFold.meta?.receiptCount ?? next.nodeRoots[idx].height,
      };
    }
  }
  next.globalRoot = computeGlobalRoot(next);
  return next;
}
