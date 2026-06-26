#!/usr/bin/env node
import { loadContinuityState } from "../../substrate/continuity-substrate.mjs";

const cp = process.argv[2];
const state = loadContinuityState();
const events = cp
  ? state.events.filter((e, i) => String(i + 1).padStart(5, "0") === cp.padStart(5, "0"))
  : state.events;
console.log(JSON.stringify({ checkpoint: state.checkpoint, events }, null, 2));
