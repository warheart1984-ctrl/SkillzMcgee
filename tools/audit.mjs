#!/usr/bin/env node
/**
 * Unified Auditor CLI — constitutional operator cockpit.
 * Usage: node tools/audit.mjs <domain> <command> [args]
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATORS = path.join(ROOT, "tools/generators");
const PGQL = path.join(ROOT, "tools/pgql");

function run(script, args, opts = {}) {
  const r = spawnSync(process.execPath, [script, ...args], {
    stdio: "inherit",
    cwd: ROOT,
    ...opts,
  });
  process.exit(r.status ?? 1);
}

function runJson(script, args) {
  const r = spawnSync(process.execPath, [script, ...args], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    process.exit(r.status ?? 1);
  }
  return r.stdout;
}

const [domain, cmd, ...rest] = process.argv.slice(2);

if (domain === "cor" && cmd === "generate") {
  run(path.join(GENERATORS, "cor-generate.mjs"), rest);
}
if (domain === "cor" && cmd === "diff" && rest[0] && rest[1]) {
  run(path.join(GENERATORS, "cor-diff.mjs"), rest);
}
if (domain === "cor" && cmd === "explain" && rest[0]) {
  run(path.join(GENERATORS, "cor-generate.mjs"), ["--explain", rest[0]]);
}

if (domain === "csr" && cmd === "generate") {
  run(path.join(GENERATORS, "csr-registry.mjs"), rest);
}
if (domain === "csr" && cmd === "explain" && rest[0]) {
  run(path.join(GENERATORS, "csr-explain.mjs"), [rest[0]]);
}
if (domain === "csr" && cmd === "diff" && rest[0] && rest[1]) {
  run(path.join(GENERATORS, "csr-diff.mjs"), rest);
}

if (domain === "dra" && cmd === "analyze") {
  run(path.join(GENERATORS, "dra-analyze.mjs"), ["--out", "conformance/dra/dra-1.0.json", ...rest]);
}
if (domain === "dra" && cmd === "explain" && rest[0]) {
  run(path.join(GENERATORS, "dra-analyze.mjs"), ["impact-of", rest[0]]);
}

if (domain === "cav" && cmd === "run" && rest[0]) {
  run(path.join(GENERATORS, "counterfactual.mjs"), ["remove", "NODE", rest[0]]);
}
if (domain === "cav" && cmd === "impact" && rest[0]) {
  run(path.join(GENERATORS, "dra-analyze.mjs"), ["impact-of", rest[0]]);
}

if (domain === "ledger" && cmd === "verify") {
  run(path.join(GENERATORS, "glv-verify.mjs"), rest);
}
if (domain === "ledger" && cmd === "chain") {
  const out = runJson(path.join(GENERATORS, "gl-chain.mjs"), []);
  console.log(out);
  process.exit(0);
}

if (domain === "continuity" && cmd === "replay") {
  run(path.join(GENERATORS, "continuity-replay.mjs"), rest);
}
if (domain === "continuity" && cmd === "explain" && rest[0]) {
  run(path.join(GENERATORS, "continuity-explain.mjs"), [rest[0]]);
}

if (domain === "proof" && cmd === "build") {
  run(path.join(GENERATORS, "proof-graph-index.mjs"), rest);
}
if (domain === "proof" && cmd === "explain" && rest[0]) {
  run(path.join(GENERATORS, "explain-node.mjs"), [rest[0]]);
}

if (domain === "pgql" && rest[0]) {
  const { runPgqlQuery } = await import(path.join(PGQL, "evaluator.mjs"));
  console.log(JSON.stringify(runPgqlQuery(rest.join(" ")), null, 2));
  process.exit(0);
}

console.log(`Audit CLI — constitutional operator cockpit

  audit cor generate | diff <old> <new> | explain <claim>
  audit csr generate | diff <old> <new> | explain <claim>
  audit dra analyze | explain <claim>
  audit cav run <node> | impact <claim>
  audit ledger verify | chain
  audit continuity replay | explain <checkpoint>
  audit proof build | explain <node>
  audit pgql '<query>'

Also: npm run crk — legacy CRK dispatcher
`);
process.exit(0);
