import { reduceLedger } from "../governance/reducer.js";
import { ledgerFingerprint } from "./fingerprint.js";
import { enrichReceiptChain } from "./receiptHash.js";
import {
  groupByLineage,
  detectBranches,
  buildWorldlines,
} from "./lineage.js";
import { buildMerkleRoots, verifyHashChain } from "./merkle.js";
import {
  integrateNonlinearWave,
  detectAttractors,
  detectPhaseTransition,
} from "./nonlinearWave.js";
import { solveFieldEquations } from "./darzFields.js";
import { genesisOperator } from "./genesis.js";
import { buildDarzTensors } from "./darzTensors.js";
import { foldWaveState, JUDGMENT_DIMENSIONS } from "./waveMath.js";
import { verifyReconstructable } from "./foldUtils.js";

export { verifyReconstructable };

/**
 * AS-Ω — Full cosmophysics fold.
 * @param {import("../governance/types.js").GovernedReceipt[]} ledgerEntries
 */
export function foldAbsoluteSingularityOmega(ledgerEntries) {
  const enriched = enrichReceiptChain(ledgerEntries);
  const sorted = [...enriched].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );
  const sliceState = reduceLedger(sorted);
  const lineagesMap = groupByLineage(sorted);
  const branches = detectBranches(sorted);
  const worldlines = buildWorldlines(sorted);

  /** @type {Record<string, { wave: ReturnType<typeof integrateNonlinearWave>, darz: ReturnType<typeof buildDarzTensors> }>} */
  const lineages = {};
  for (const [lineageId, chain] of lineagesMap) {
    lineages[lineageId] = {
      wave: integrateNonlinearWave(chain),
      darz: buildDarzTensors(chain),
    };
  }

  const globalWave = integrateNonlinearWave(sorted);
  const attractors = detectAttractors(globalWave.trajectory);
  const phaseTransition = detectPhaseTransition(globalWave.terminal);
  const darz = solveFieldEquations(sorted, globalWave.terminal, lineagesMap);
  const merkle = buildMerkleRoots(sorted);

  const partial = {
    merkle,
    wave: { terminal: globalWave.terminal },
    lineages,
    attractors,
  };

  const asOmega = {
    version: "AS-Ω",
    fingerprint: ledgerFingerprint(sorted),
    foldedAt: sorted.at(-1)?.timestamp ?? "epoch",
    receiptCount: sorted.length,
    sliceState,
    lineage: {
      roots: [...lineagesMap.keys()],
      branches,
      worldlines,
    },
    lineages,
    merkle,
    wave: {
      linear: { w_t: foldWaveState(sorted), dimensions: [...JUDGMENT_DIMENSIONS] },
      nonlinear: globalWave,
      attractors,
      phaseTransition,
    },
    darz: {
      tensors: buildDarzTensors(sorted),
      fields: darz,
    },
    k4: {
      reconstructable: verifyReconstructable(sliceState, sorted),
      hashChainValid: verifyHashChain(sorted),
      coherence: coherenceFromWave(globalWave.terminal),
    },
    genesisOperator: genesisOperator(partial),
  };

  return asOmega;
}

/** @alias foldAbsoluteSingularityOmega */
export const foldAbsoluteSingularity = foldAbsoluteSingularityOmega;

/**
 * @param {import("./nonlinearWave.js").NonlinearWaveState} terminal
 */
function coherenceFromWave(terminal) {
  const speed =
    JUDGMENT_DIMENSIONS.reduce(
      (s, d) => s + Math.abs(terminal.velocity[d]),
      0
    ) / JUDGMENT_DIMENSIONS.length;
  return clamp01(1 - speed);
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}
