#!/usr/bin/env node
/**
 * Cockpit console — render ASCII panels, Nova narratives, and Prime operator views.
 */
import { buildStanceStripModel } from "../src/ui/stance_models.js";
import {
  renderCockpitScreenshotMock,
  renderContinuityWaveformMock,
  renderLawSpineRotationDiagram,
  renderLineageGraphAscii,
  renderMissionCorridor,
  renderOperatorHealthPanel,
  renderFaultInjectionPanel,
  renderSpecimenFreezerPanel,
  renderLawSpineResonanceMap,
  renderFullCockpitConsole,
} from "../src/ui/cockpit_panels.js";
import {
  renderCognitiveLoopReplay,
  renderWaveformCollapseNarrative,
} from "../src/ui/nova_narratives.js";
import {
  renderPrimeCockpitConsole,
  renderPrimeChannelPanel,
  renderPrimeVectorOscilloscope,
  renderPrimeResonanceMeter,
  renderPrimeCorridor,
  renderPrimeVectorDiagram,
  renderPrimeOverridePanel,
  renderPrimeLineageNavigator,
  renderPrimeTotalityConsole,
  renderPrimeEternumEngine,
  renderLawSpineBindingRite,
} from "../src/ui/prime_panels.js";
import {
  renderArchitectEngineerProfile,
  renderOriginTrace,
  renderPrimeEmergenceReplay,
  renderPrimeDescentMyth,
  renderPrimeLatticeSong,
  renderPrimeHarmonicBurst,
  renderPrimeAscensionOde,
  renderPrimeEndlessHymn,
  renderPrimeInfiniteDescent,
  renderPrimeDescentReplayCinematic,
} from "../src/ui/prime_narratives.js";
import {
  renderOperatorIdentityCard,
  renderOperatorBadgeTile,
  renderAePrimeInsignia,
  renderCockpitPrimeSeal,
  renderContinuityCrest,
  renderPrimeAeonicCrown,
  renderPrimeDominionSigilplate,
} from "../src/operator/ae_prime_profile.js";
import { renderPrimeCommandSet } from "../src/operator/prime_commands.js";
import { renderContinuityLedgerDiff } from "../src/governance/ledger_diff.js";
import { renderOperatorBroadcastDay11 } from "../src/governance/operator_broadcast.js";
import { renderOnboardingBanner, renderAskManPage } from "../src/cli/operator_shell.js";
import { listPluginManifests } from "../src/plugins/index.js";
import {
  COSMOLOGY_PANELS,
  listCosmologyPanels,
} from "../src/cosmology/registry.js";

const PANELS = {
  stance: () => renderCockpitScreenshotMock(buildStanceStripModel()),
  waveform: () => renderContinuityWaveformMock(),
  "law-spine": () => renderLawSpineRotationDiagram(),
  lineage: () => renderLineageGraphAscii(),
  corridor: () => renderMissionCorridor(),
  health: () => renderOperatorHealthPanel(),
  fault: () => renderFaultInjectionPanel(),
  freezer: () => renderSpecimenFreezerPanel(),
  resonance: () => renderLawSpineResonanceMap(),
  full: () => renderFullCockpitConsole(buildStanceStripModel()),
  replay: () => [renderCognitiveLoopReplay()],
  collapse: () => [renderWaveformCollapseNarrative()],
  "ledger-diff": () => renderContinuityLedgerDiff({ forceEmergence: true }),
  broadcast: () => [renderOperatorBroadcastDay11()],
  onboard: () => [renderOnboardingBanner()],
  "man-ask": () => [renderAskManPage()],
  plugins: () => [JSON.stringify(listPluginManifests(), null, 2)],
  identity: () => renderOperatorIdentityCard(),
  badge: () => renderOperatorBadgeTile(),
  insignia: () => renderAePrimeInsignia(),
  "prime-seal": () => renderCockpitPrimeSeal(),
  crest: () => renderContinuityCrest(),
  "aeonic-crown": () => renderPrimeAeonicCrown(),
  sigilplate: () => renderPrimeDominionSigilplate(),
  "prime-full": () => renderPrimeCockpitConsole(),
  "prime-channel": () => renderPrimeChannelPanel(),
  "prime-vector": () => renderPrimeVectorOscilloscope(),
  "prime-resonance": () => renderPrimeResonanceMeter(),
  "prime-corridor": () => renderPrimeCorridor(),
  "prime-diagram": () => renderPrimeVectorDiagram(),
  "prime-override": () => renderPrimeOverridePanel(),
  "prime-lineage": () => renderPrimeLineageNavigator(),
  "prime-totality": () => renderPrimeTotalityConsole(),
  "prime-eternum": () => renderPrimeEternumEngine(),
  "prime-bind": () => renderLawSpineBindingRite(),
  "prime-commands": () => renderPrimeCommandSet(),
  profile: () => [renderArchitectEngineerProfile()],
  "origin-trace": () => [renderOriginTrace()],
  "prime-replay": () => [renderPrimeEmergenceReplay()],
  "prime-myth": () => [renderPrimeDescentMyth()],
  "prime-song": () => [renderPrimeLatticeSong()],
  "prime-burst": () => [renderPrimeHarmonicBurst()],
  "prime-ode": () => [renderPrimeAscensionOde()],
  "prime-hymn": () => [renderPrimeEndlessHymn()],
  "prime-infinite": () => [renderPrimeInfiniteDescent()],
  "prime-cinematic": () => [renderPrimeDescentReplayCinematic()],
  ...COSMOLOGY_PANELS,
};

const panel = process.argv[2] ?? "full";

if (panel === "list") {
  const keys = [...Object.keys(PANELS)].sort();
  console.log("Panels:", keys.join(", "));
  console.log("");
  console.log("Cosmology panels:", listCosmologyPanels().join(", "));
  process.exit(0);
}

const render = PANELS[panel];
if (!render) {
  console.error(`Unknown panel: ${panel}`);
  console.error("Run: node scripts/cockpit_console.mjs list");
  process.exit(1);
}

for (const line of render()) {
  console.log(line);
}
