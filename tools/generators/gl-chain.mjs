#!/usr/bin/env node
import { readLedger } from "./gl-lib.mjs";

const entries = readLedger();
for (const e of entries) {
  console.log(`${e.continuityCheckpoint}\t${e.id}\t${e.decision}\t${e.subject}`);
}
