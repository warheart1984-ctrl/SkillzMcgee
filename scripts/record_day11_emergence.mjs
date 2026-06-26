#!/usr/bin/env node
/**
 * Record Day 11 Constitutional Runtime Emergence artifacts.
 */
import { recordDay11Emergence } from "../src/governance/emergence.js";
import { renderEventTileAscii } from "../src/ui/event_tile.js";
import { formatDay11OperatorLog } from "../src/governance/operator_log.js";

const result = recordDay11Emergence({ operator: process.env.SKILLZMCGEE_OPERATOR ?? "jon" });

console.log("=== DAY 11 EMERGENCE RECORDED ===\n");
console.log(`Continuity receipt: ${result.receiptsPath}`);
console.log(`Operator log:       ${result.operatorPath}`);
console.log(`Trace spans:        ${result.tracesPath}`);
console.log(`Cosmic snapshot:    ${result.snapshotPath}\n`);

console.log(renderEventTileAscii(result.eventTile).join("\n"));
console.log("\n--- Operator log preview ---\n");
console.log(formatDay11OperatorLog(result.receipt));
