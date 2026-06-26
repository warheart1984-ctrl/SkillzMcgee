#!/usr/bin/env node
/**
 * GLV-1.0 — Governance Ledger Verifier (TypeScript implementation).
 * Usage: node tools/generators/governance-ledger-verify.mjs [ledger.jsonl] [--gls] [--json]
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CLI = path.join(ROOT, "src/cli/governance.ts");
const TSX = path.join(ROOT, "node_modules/tsx/dist/cli.mjs");

const args = process.argv.slice(2);
const r = spawnSync(process.execPath, [TSX, CLI, "verify", ...args], {
  cwd: ROOT,
  encoding: "utf8",
  stdio: ["inherit", "pipe", "pipe"],
});

if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
process.exit(r.status ?? 1);
