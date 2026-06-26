#!/usr/bin/env node
/**
 * GLS-1.0 — append governance ledger entry
 * Usage: node tools/generators/gls-append.mjs --file entry.json
 *        node tools/generators/gls-append.mjs --genesis
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { appendEntry, computeHash, readLedger } from "./gls-lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const args = process.argv.slice(2);

if (args.includes("--genesis")) {
  if (readLedger().length > 0) {
    console.error("Ledger not empty; genesis already initialized");
    process.exit(2);
  }
  const genesis = {
    entry_id: "GLS-20260626-000",
    timestamp: new Date().toISOString(),
    decision_type: "policy_update",
    inputs: {
      cav_version: "CAV-1.0",
      canonical_commit: gitCommit(),
    },
    decision: "approve",
    rationale: [
      "Initialize GLS-1.0 governance ledger",
      "Canonical append-only record for steward decisions separate from measurement",
    ],
    steward_votes: [{ steward_id: "steward:council-genesis", vote: "approve", notes: "GLS schema ratified" }],
    previous_hash: "GENESIS",
  };
  genesis.governance_hash = computeHash(genesis);
  const LEDGER = path.join(ROOT, "governance/governance-ledger/ledger.jsonl");
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.writeFileSync(LEDGER, `${JSON.stringify(genesis)}\n`);
  console.log(`genesis entry ${genesis.entry_id} hash=${genesis.governance_hash}`);
  process.exit(0);
}

const fileIdx = args.indexOf("--file");
if (fileIdx < 0 || !args[fileIdx + 1]) {
  console.error("Usage: gls-append.mjs --file <entry.json> | --genesis");
  process.exit(2);
}

const draft = JSON.parse(fs.readFileSync(path.resolve(args[fileIdx + 1]), "utf8"));
delete draft.governance_hash;
if (!draft.previous_hash) draft.previous_hash = readLedger().at(-1)?.governance_hash ?? "GENESIS";
const entry = appendEntry(draft);
console.log(JSON.stringify(entry, null, 2));
