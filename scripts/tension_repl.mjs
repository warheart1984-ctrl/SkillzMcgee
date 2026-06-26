#!/usr/bin/env node
/**
 * TENSION language REPL — run modal cosmology programs.
 */
import { createInterpreterState, runProgram, parseTensionSource } from "../src/tension/index.js";
import { tensionToRecord } from "../src/tension/types.js";

const args = process.argv.slice(2);

if (args[0] === "--help" || args[0] === "-h") {
  console.log(`Usage:
  node scripts/tension_repl.mjs --eval '<source>'
  node scripts/tension_repl.mjs --tick <becoming> <resistance> <memory> <horizon> <equilibrium>

Example:
  node scripts/tension_repl.mjs --eval 'tension cosmos { becoming: 7, resistance: 4, memory: 9, horizon: 6, equilibrium: 5 }
invert(cosmos)'
`);
  process.exit(0);
}

if (args[0] === "--eval" && args[1]) {
  const { bindings, program } = parseTensionSource(args[1]);
  let state = createInterpreterState({ cosmos: bindings.cosmos ?? bindings[Object.keys(bindings)[0]] });
  state = runProgram(state, program);
  console.log(JSON.stringify({ mode: state.mode, cosmos: tensionToRecord(state.cosmos), steps: state.history.length }, null, 2));
  process.exit(0);
}

if (args[0] === "--tick") {
  const vals = args.slice(1).map(Number);
  const { cosmologicalTick } = await import("../src/tension/operations.js");
  const { tension: t } = await import("../src/tension/types.js");
  const cosmos = t({
    becoming: vals[0] ?? 5,
    resistance: vals[1] ?? 5,
    memory: vals[2] ?? 5,
    horizon: vals[3] ?? 5,
    equilibrium: vals[4] ?? 5,
  });
  const next = cosmologicalTick(cosmos);
  console.log(JSON.stringify({ before: tensionToRecord(cosmos), after: tensionToRecord(next) }, null, 2));
  process.exit(0);
}

console.error("Run with --help for usage.");
process.exit(1);
