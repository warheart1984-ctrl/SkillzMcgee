#!/usr/bin/env node
/** Write interactive governance cockpit HTML. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderGovernanceCockpitPage, stanceFromCosmic } from "../src/ui/governance_stance_strip.js";
import { loadDay11EmergenceReceipt } from "../src/governance/aaes_continuity.js";
import { emergenceEventFromReceipt } from "../src/ui/event_tile.js";
import { buildStanceStripModel } from "../src/ui/stance_models.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const outPath = path.join(repoRoot, "ui", "cockpit.html");
const cosmicPath = path.join(repoRoot, "skillz_cosmic.json");

let model;
if (fs.existsSync(cosmicPath)) {
  try {
    model = stanceFromCosmic(JSON.parse(fs.readFileSync(cosmicPath, "utf8")));
  } catch {
    model = undefined;
  }
}

let eventTile;
try {
  const receipt = loadDay11EmergenceReceipt(repoRoot);
  eventTile = emergenceEventFromReceipt(receipt);
  if (!model) {
    model = buildStanceStripModel({
      charterJustActivated: true,
      tensionIndex: receipt.stance?.tension_index ?? 0.12,
      missionThread: {
        focus: receipt.stance?.mission_thread ?? "Runtime unification + cockpit activation",
        threadId: receipt.receipt_id,
        progressPct: 100,
        coherencePct: 96,
        lineage: ["anchor", "restore", "unify", "activate"],
      },
      healthStatus: "healthy",
    });
  }
} catch {
  eventTile = undefined;
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, renderGovernanceCockpitPage(model, eventTile), "utf8");
console.log(`Wrote ${outPath}`);
