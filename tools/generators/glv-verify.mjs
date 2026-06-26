#!/usr/bin/env node
/**
 * GLV-1.0 — Governance Ledger Verifier
 * Delegates to TypeScript implementation (src/governance/).
 * Usage: node tools/generators/glv-verify.mjs [ledger.jsonl] [--fail-on-error] [--gls] [--json]
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const WRAPPER = path.join(ROOT, "tools/generators/governance-ledger-verify.mjs");

const args = process.argv.slice(2).filter((a) => a !== "--fail-on-error");
const r = spawnSync(process.execPath, [WRAPPER, ...args], {
  cwd: ROOT,
  stdio: "inherit",
});

process.exit(r.status ?? 1);
