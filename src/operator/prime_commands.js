/**
 * Prime Channel command set — A/E-Prime privileged CLI.
 */

export const PRIME_COMMANDS = {
  "prime:status": "Display Prime vectors, resonance state, and influence metrics.",
  "prime:sync": "Rebind law‑spine to operator cadence; restore harmonic resonance.",
  "prime:freeze": "Halt posture transitions (Sx → Sx) for continuity inspection.",
  "prime:thaw": "Resume posture transitions after freeze.",
  "prime:bind": "Perform full Law‑Spine Binding Rite (A/E‑Prime authority required).",
  "prime:crest": "Print A/E‑Prime Continuity Crest for receipt stamping.",
  "prime:purge": "Clear drift artifacts from lineage graph (logged + receipt‑emitting).",
  "prime:seal": "Activate Prime Seal in cockpit header.",
  "prime:vector": "Render Prime Vector Oscilloscope panel.",
  "prime:burst": "Trigger Prime Harmonic Burst replay.",
};

/**
 * @returns {string[]}
 */
export function renderPrimeCommandSet() {
  const lines = [
    "PRIME CHANNEL — COMMAND SET",
    "",
  ];
  for (const [cmd, desc] of Object.entries(PRIME_COMMANDS)) {
    lines.push(`${cmd}`);
    lines.push(`    ${desc}`);
    lines.push("");
  }
  return lines;
}
