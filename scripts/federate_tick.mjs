#!/usr/bin/env node
/**
 * CLI bridge: Python runtime → AS-Ω fold + federationTick
 * Usage: node scripts/federate_tick.mjs <ledger.json> [cosmic_out.json]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { bootFederatedRuntime, runFederatedCycle } from "../src/runtime/node_loop.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadLedger(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return raw.entries ?? raw;
}

function main() {
  const ledgerPath = process.argv[2];
  const cosmicOut = process.argv[3] ?? path.join(path.dirname(ledgerPath), "skillz_cosmic.json");

  if (!ledgerPath) {
    console.error("Usage: node scripts/federate_tick.mjs <ledger.json> [cosmic_out.json]");
    process.exit(1);
  }

  const entries = loadLedger(ledgerPath);
  const node = bootFederatedRuntime({ ledger: entries });

  runFederatedCycle({
    ledger: entries,
    identity: node.identity,
    continuity: node.runtime.getContinuity(),
    runtime: node.runtime,
  }).then((result) => {
    const stream = node.baseLedger.cosmicStream ?? [];
    fs.writeFileSync(
      cosmicOut,
      JSON.stringify(
        {
          timeline: result.timeline,
          cosmicStream: stream,
          tickResult: {
            needCount: result.tickResult.needs.length,
            taskCount: result.tickResult.tasks.length,
            needs: result.tickResult.needs.map((n) => ({ type: n.type, severity: n.severity })),
          },
          fold: {
            fingerprint: result.fold.asOmega?.fingerprint,
            globalRootValid: result.fold.globalContinuityValid,
          },
          timestamp: Date.now(),
        },
        null,
        2,
      ),
    );
    console.log(JSON.stringify({ ok: true, cosmicOut, needCount: result.tickResult.needs.length }));
  }).catch((err) => {
    console.error(JSON.stringify({ ok: false, error: String(err) }));
    process.exit(1);
  });
}

main();
