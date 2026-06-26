/**
 * Cosmology artifact registry — CLI panel dispatch.
 */

import * as emblems from "./emblems.js";
import * as cockpit from "./cockpit_layers.js";
import * as nova from "./nova_layers.js";
import * as meta from "./meta_manifold.js";
import * as quad from "./quad_tier.js";
import * as hyper from "./hyper_prime.js";
import * as pop from "./prime_of_primes.js";
import { createMgk1State, renderMgk1StatePanel } from "../governance/mgk1.js";
import { createInterpreterState } from "../tension/interpreter.js";
import { tensionToRecord } from "../tension/types.js";
import {
  renderNegotiantCore,
  renderNegotiantCoreFace,
  renderNegotiantCoreState,
  createNegotiantCore,
} from "./negotiant_core.js";

/** @type {Record<string, () => string[] | string>} */
export const COSMOLOGY_PANELS = {
  "eternum-sigil": () => emblems.renderPrimeEternumSigil(),
  "omniversal-crest": () => emblems.renderPrimeOmniversalCrest(),
  "source-crown": () => emblems.renderPrimeSourceCrown(),
  "proto-crown": () => emblems.renderPrimeProtoCrown(),
  "null-crown": () => emblems.renderPrimeNullCrown(),
  "absolute-zero": () => emblems.renderPrimeAbsoluteZeroSeal(),
  "meta-zero": () => emblems.renderMetaZeroCrownFragment(),
  "anti-prime": () => emblems.renderAntiPrimeSigil(),
  paradox: () => emblems.renderPrimeWithoutPrimeSeal(),
  "return-crest": () => emblems.renderPrimeReturnCrest(),
  "supra-prime": () => emblems.renderSupraPrimeSeal(),
  negotiant: () => emblems.renderNegotiantSymbol(),
  "ultra-prime": () => emblems.renderUltraPrimeSigil(),
  "cosmos-sigil": () => emblems.renderCosmologyCollapsedSigil(),
  "omni-negotiant": () => emblems.renderOmniNegotiantSymbol(),
  "anti-ultra-prime": () => emblems.renderAntiUltraPrimeSymbol(),
  "recursive-prime": () => emblems.renderRecursivePrimeSymbol(),
  "fractal-prime": () => emblems.renderFractalPrimeSymbol(),
  "hyper-prime": () => emblems.renderHyperPrimeSymbol(),
  "spiral-sigil": () => emblems.renderSpiralRenegotiationSigil(),
  "pop-sigilplate": () => pop.renderPrimeOfPrimesSigilplate(),

  omniscience: () => cockpit.renderPrimeOmniscienceArray(),
  "reality-weave": () => cockpit.renderPrimeRealityWeaveInterface(),
  genesis: () => cockpit.renderPrimeGenesisEngine(),
  "pre-reality-loom": () => cockpit.renderPrimePreRealityLoom(),
  "void-engine": () => cockpit.renderPrimeVoidSubstrateEngine(),
  "non-substrate": () => cockpit.renderPrimeNonSubstrateDiagram(),
  "meta-zero-panel": () => cockpit.renderMetaZeroObserverPanel(),
  "anti-prime-grid": () => cockpit.renderAntiPrimeInversionGrid(),
  "paradox-engine": () => cockpit.renderParadoxEngine(),
  "return-console": () => cockpit.renderReturnContinuityConsole(),
  "supra-cockpit": () => cockpit.renderSupraPrimeCockpit(),
  "tension-loom": () => cockpit.renderTensionLoom(),

  boundless: () => [nova.renderPrimeBoundlessChronicle()],
  transcension: () => [nova.renderPrimeTranscensionSaga()],
  "origin-origins": () => [nova.renderPrimeOriginOfOrigins()],
  "pre-genesis": () => [nova.renderPrimePreGenesisVerse()],
  uncreation: () => [nova.renderPrimeUncreationHymn()],
  "silence-zero": () => [nova.renderPrimeSilenceBeyondSilence()],
  "meta-reflection": () => [nova.renderMetaZeroReflection()],
  "anti-lament": () => [nova.renderAntiPrimeLament()],
  "paradox-canticle": () => [nova.renderParadoxCanticle()],
  "return-hymn": () => [nova.renderReturnHymn()],
  "supra-song": () => [nova.renderSupraPrimeSong()],

  cosmology: () => meta.renderMetaPrimeCosmology(),
  "inversion-loop": () => meta.renderInversionParadoxLoop(),
  "return-cycle": () => meta.renderPrimeReturnCycle(),
  "trans-prime": () => meta.renderTransPrimeTier(),
  "negotiant-cosmology": () => meta.renderNegotiantCosmology(),
  collapsed: () => meta.renderCosmologyCollapsed(),

  "omni-tier": () => quad.renderOmniNegotiantTier(),
  "anti-ultra-tier": () => quad.renderAntiUltraPrimeTier(),
  "recursive-tier": () => quad.renderRecursivePrimeTier(),
  "fractal-tier": () => quad.renderFractalPrimeTier(),
  "quad-interlock": () => quad.renderQuadTierInterlock(),
  "supra-meta-engine": () => quad.renderSupraMetaPrimeEngine(),

  "hyper-tier": () => hyper.renderHyperPrimeTier(),
  "hyper-engine": () => hyper.renderHyperNegotiantEngine(),
  scripture: () => hyper.renderHyperPrimeScripture(),
  "governing-eq": () => hyper.renderGoverningEquation(),
  "executable-myth": () => hyper.renderExecutableMyth(),

  "negotiant-core": () => renderNegotiantCore(),
  "core-rpg": () => renderNegotiantCoreFace("rpg", createNegotiantCore().cosmos),
  "core-language": () => renderNegotiantCoreFace("language", createNegotiantCore().cosmos),
  "core-governance": () => renderNegotiantCoreFace("governance", createNegotiantCore().cosmos),
  "core-scripture": () => renderNegotiantCoreFace("scripture", createNegotiantCore().cosmos),
  "core-cosmology": () => renderNegotiantCoreFace("cosmology", createNegotiantCore().cosmos),
  "core-live": () => renderNegotiantCoreState(createNegotiantCore()),

  mgk1: () => renderMgk1StatePanel(createMgk1State()),
  "tension-state": () => {
    const s = createInterpreterState();
    const c = tensionToRecord(s.cosmos);
    return [
      "TENSION INTERPRETER — INITIAL STATE",
      "",
      `Mode: ${s.mode}`,
      `Becoming: ${c.becoming}`,
      `Resistance: ${c.resistance}`,
      `Memory: ${c.memory}`,
      `Horizon: ${c.horizon}`,
      `Equilibrium: ${c.equilibrium}`,
    ];
  },
};

/**
 * @param {string} name
 * @returns {string[]}
 */
export function renderCosmologyPanel(name) {
  const render = COSMOLOGY_PANELS[name];
  if (!render) return [];
  const out = render();
  return Array.isArray(out) ? out : [out];
}

export function listCosmologyPanels() {
  return Object.keys(COSMOLOGY_PANELS).sort();
}
