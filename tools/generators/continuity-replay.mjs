#!/usr/bin/env node
import { replayContinuity } from "../../substrate/continuity-substrate.mjs";

const state = replayContinuity();
console.log(JSON.stringify(state, null, 2));
