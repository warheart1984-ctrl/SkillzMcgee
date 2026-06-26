#!/usr/bin/env node
/**
 * Governance CLI — objectives | substrations | graph | receipts
 */

import { printObjectivesCli } from "../src/governance/objectives.js";
import { printSubstrationsCli, printGraphCli } from "../src/substrations/registry.js";
import { printReceiptsCli } from "../src/governance/continuity_ledger.js";
import { printSafeModeCli } from "../src/governance/safe_mode.js";
import { printGovernanceStanceStripCli, stanceFromCosmic } from "../src/ui/governance_stance_strip.js";
import { cycleEscalation } from "../src/governance/escalation.js";
import { recordDay11Emergence } from "../src/governance/emergence.js";
import { renderCosmicSnapshotDay11 } from "../src/cosmic/cosmic_snapshot.js";
import { formatDay11OperatorLog } from "../src/governance/operator_log.js";
import { loadDay11EmergenceReceipt } from "../src/governance/aaes_continuity.js";
import { renderEventTileAscii } from "../src/ui/event_tile.js";
import { renderOperatorIdentityCard } from "../src/operator/ae_prime_profile.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cosmicPath = path.join(__dirname, "..", "skillz_cosmic.json");

function loadStanceModel() {
  if (!fs.existsSync(cosmicPath)) return undefined;
  try {
    return stanceFromCosmic(JSON.parse(fs.readFileSync(cosmicPath, "utf8")));
  } catch {
    return undefined;
  }
}

const cmd = process.argv[2] ?? "objectives";

if (cmd === "objectives") {
  printObjectivesCli();
} else if (cmd === "substrations") {
  printSubstrationsCli();
} else if (cmd === "graph") {
  printGraphCli();
} else if (cmd === "receipts") {
  printReceiptsCli();
} else if (cmd === "safe-mode") {
  printSafeModeCli();
} else if (cmd === "stance") {
  printGovernanceStanceStripCli(loadStanceModel());
} else if (cmd === "escalate") {
  const result = cycleEscalation({ cause: process.argv[3] ?? "CLI escalation toggle", actor: "governance_cli" });
  console.log(`Escalation: ${result.previous} → ${result.current}`);
  printGovernanceStanceStripCli();
} else if (cmd === "cockpit") {
  const repo = path.join(__dirname, "..");
  const r = spawnSync("node", ["scripts/write_cockpit.mjs"], { cwd: repo, stdio: "inherit" });
  process.exit(r.status ?? 0);
} else if (cmd === "emergence") {
  const result = recordDay11Emergence({ operator: process.env.SKILLZMCGEE_OPERATOR ?? "jon" });
  console.log("=== DAY 11 EMERGENCE ===\n");
  console.log(renderEventTileAscii(result.eventTile).join("\n"));
  console.log(`\nReceipt ledger: ${result.receiptsPath}`);
} else if (cmd === "snapshot") {
  const receipt = loadDay11EmergenceReceipt(path.join(__dirname, ".."));
  console.log(renderCosmicSnapshotDay11({ day: 11, operator: receipt.signatures?.operator ?? "jon" }));
} else if (cmd === "operator-log") {
  const receipt = loadDay11EmergenceReceipt(path.join(__dirname, ".."));
  console.log(formatDay11OperatorLog(receipt));
} else if (cmd === "console") {
  const panel = process.argv[3] ?? "full";
  const repo = path.join(__dirname, "..");
  const r = spawnSync("node", ["scripts/cockpit_console.mjs", panel], { cwd: repo, stdio: "inherit" });
  process.exit(r.status ?? 0);
} else if (cmd === "identity") {
  console.log(renderOperatorIdentityCard().join("\n"));
} else if (cmd === "prime") {
  const panel = process.argv[3] ?? "prime-full";
  const repo = path.join(__dirname, "..");
  const r = spawnSync("node", ["scripts/cockpit_console.mjs", panel], { cwd: repo, stdio: "inherit" });
  process.exit(r.status ?? 0);
} else {
  console.error(`Unknown command: ${cmd}`);
  console.error("Usage: node scripts/governance_cli.mjs [objectives|substrations|graph|receipts|safe-mode|stance|escalate|cockpit|emergence|snapshot|operator-log|console <panel>|identity|prime <panel>]");
  process.exit(1);
}
