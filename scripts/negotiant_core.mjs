#!/usr/bin/env node
/**
 * Negotiant Core (⟴) — constitutional cockpit: spin, face, cycle, live REPL.
 */
import readline from "node:readline";
import {
  createNegotiantCore,
  rotateCore,
  spinCore,
  spinFullCycle,
  renderNegotiantCore,
  renderNegotiantCoreFace,
  renderNegotiantCoreState,
  viewCoreFace,
  coreTick,
  CORE_FACES,
  NEGOTIANT_GLYPH,
  NEGOTIANT_CORE_VERSION,
} from "../src/cosmology/negotiant_core.js";
import { projectFace, FACE_NAMES } from "../src/faces/index.js";
import { tension } from "../src/tension/types.js";

const args = process.argv.slice(2);

function usage() {
  console.log(`Negotiant Core ${NEGOTIANT_GLYPH} v${NEGOTIANT_CORE_VERSION}

Usage:
  node scripts/negotiant_core.mjs                         # canonical artifact
  node scripts/negotiant_core.mjs --face <name>         # interpretive face view
  node scripts/negotiant_core.mjs --spin [n]              # spin n ticks (coreTick)
  node scripts/negotiant_core.mjs --cycle                 # five-face rotation
  node scripts/negotiant_core.mjs --live                  # interactive REPL
  node scripts/negotiant_core.mjs --json --spin 3         # machine state JSON

REPL commands (core>):
  spin [n]     run n coreTick transitions (default 1)
  face <name>  project interpretive face over current cosmos
  state        print tension vector
  cycle        full five-face rotation
  json         dump state as JSON
  help         show commands
  quit         exit

Faces: ${FACE_NAMES.join(", ")}
`);
}

if (args.includes("--help") || args.includes("-h")) {
  usage();
  process.exit(0);
}

const json = args.includes("--json");
const vals = args.filter((a) => !a.startsWith("--") && Number.isFinite(Number(a))).map(Number);

function initialState() {
  return createNegotiantCore({
    cosmos: tension({
      becoming: vals[0] || 7,
      resistance: vals[1] || 4,
      memory: vals[2] || 9,
      horizon: vals[3] || 6,
      equilibrium: vals[4] || 5,
    }),
  });
}

function startREPL() {
  let state = initialState();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`Negotiant Core ${NEGOTIANT_GLYPH} — live (coreTick is the law)\n`);
  rl.setPrompt("core> ");
  rl.prompt();

  rl.on("line", (line) => {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0]?.toLowerCase();

    if (!cmd || cmd === "help") {
      console.log("Commands: spin [n] | face <name> | state | cycle | json | quit");
    } else if (cmd === "quit" || cmd === "exit") {
      rl.close();
      return;
    } else if (cmd === "spin") {
      const n = Number(parts[1]) || 1;
      for (let i = 0; i < n; i++) state = spinCore(state);
      for (const l of renderNegotiantCoreState(state)) console.log(l);
    } else if (cmd === "face") {
      const name = parts[1];
      if (!FACE_NAMES.includes(name)) {
        console.error(`Unknown face. Use: ${FACE_NAMES.join(", ")}`);
      } else {
        state = rotateCore(state, name);
        console.log(JSON.stringify(projectFace(name, state.cosmos), null, 2));
      }
    } else if (cmd === "state") {
      console.log(JSON.stringify(state.cosmos, null, 2));
    } else if (cmd === "cycle") {
      state = spinFullCycle(state);
      for (const l of renderNegotiantCoreState(state)) console.log(l);
    } else if (cmd === "json") {
      console.log(JSON.stringify(state, null, 2));
    } else if (cmd === "tick") {
      state = { ...state, cosmos: coreTick(state.cosmos) };
      console.log(JSON.stringify(state.cosmos, null, 2));
    } else {
      console.error(`Unknown command: ${cmd}`);
    }
    rl.prompt();
  });

  rl.on("close", () => process.exit(0));
}

if (args.includes("--live")) {
  startREPL();
  // eslint-disable-next-line no-unreachable -- REPL blocks
}

if (args.includes("--face")) {
  const face = args[args.indexOf("--face") + 1];
  if (!face || !CORE_FACES.includes(face)) {
    console.error(`Unknown face. Use: ${CORE_FACES.join(", ")}`);
    process.exit(1);
  }
  const state = initialState();
  const lines = renderNegotiantCoreFace(face, state.cosmos);
  if (json) {
    console.log(JSON.stringify(viewCoreFace(face, state.cosmos), null, 2));
  } else {
    for (const line of lines) console.log(line);
  }
  process.exit(0);
}

let state = initialState();

if (args.includes("--cycle")) {
  state = spinFullCycle(state);
} else if (args.includes("--spin")) {
  const nIdx = args.indexOf("--spin");
  const next = args[nIdx + 1];
  const n = next && !next.startsWith("--") ? Number(next) : 1;
  for (let i = 0; i < n; i++) state = spinCore(state);
}

if (args.includes("--spin") || args.includes("--cycle")) {
  if (json) {
    console.log(JSON.stringify(state, null, 2));
  } else {
    for (const line of renderNegotiantCoreState(state)) console.log(line);
  }
  process.exit(0);
}

for (const line of renderNegotiantCore()) console.log(line);
