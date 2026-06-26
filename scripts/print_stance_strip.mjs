#!/usr/bin/env node
/** Print governance stance strip (ASCII). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { printGovernanceStanceStripCli, stanceFromCosmic } from "../src/ui/governance_stance_strip.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cosmicPath = path.join(__dirname, "..", "skillz_cosmic.json");

let model;
if (fs.existsSync(cosmicPath)) {
  try {
    model = stanceFromCosmic(JSON.parse(fs.readFileSync(cosmicPath, "utf8")));
  } catch {
    model = undefined;
  }
}

printGovernanceStanceStripCli(model);
