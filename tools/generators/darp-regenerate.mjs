#!/usr/bin/env node
/**
 * DARP-1.0 — Derived Artifact Regeneration Protocol
 * Usage: node tools/generators/darp-regenerate.mjs [--skip-cav] [--fail-on-cav]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const GENERATORS = path.dirname(fileURLToPath(import.meta.url));

function run(script, args = []) {
  const r = spawnSync(process.execPath, [script, ...args], { cwd: ROOT, encoding: "utf8" });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) {
    console.error(`failed: ${path.basename(script)} ${args.join(" ")}`);
    process.exit(r.status ?? 1);
  }
}

function gitCommit() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

const skipCav = process.argv.includes("--skip-cav");
const failOnCav = process.argv.includes("--fail-on-cav");

console.log("DARP-1.0: load canonical state (implicit from repo paths)");

if (!skipCav) {
  console.log("DARP step 2: CAV-1.0 validate canonical state");
  const cavArgs = failOnCav ? ["--fail-on-error"] : [];
  const r = spawnSync(process.execPath, [path.join(GENERATORS, "cav-validate.mjs"), ...cavArgs], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (failOnCav && r.status !== 0) {
    console.error("DARP aborted: CAV-1.0 failed");
    process.exit(1);
  }
  if (r.status !== 0) {
    console.warn("DARP warning: CAV reported errors (continuing regeneration)");
  }
}

console.log("DARP step 3: rebuild proof-graph index");
run(path.join(GENERATORS, "proof-graph-index.mjs"));

console.log("DARP step 4: recompute CSR-1.0");
run(path.join(GENERATORS, "csr-registry.mjs"));

console.log("DARP step 5: recompute COR-1.0");
run(path.join(GENERATORS, "cor-generate.mjs"), ["--out", "meta/COR-1.0.json"]);

console.log("DARP step 6: recompute DRA-1.0");
run(path.join(GENERATORS, "dra-analyze.mjs"), ["--out", "meta/DRA-1.0.json"]);

const manifest = {
  version: "DARP-1.0",
  regenerated_at: new Date().toISOString(),
  commit: gitCommit(),
  outputs: [
    "conformance/proof-graph/index.json",
    "meta/proof-graph-index.json",
    "conformance/observability/CSR-1.0/registry.json",
    "meta/COR-1.0.json",
    "meta/DRA-1.0.json",
  ],
  invariant: "derived artifacts MUST NOT be manually edited",
};

const manifestPath = path.join(ROOT, "meta/darp-last-run.json");
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`DARP step 7: wrote ${manifestPath}`);
console.log("DARP-1.0 complete");
