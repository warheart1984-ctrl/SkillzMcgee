import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLI = path.join(ROOT, "src/cli/governance.ts");
const TSX = path.join(ROOT, "node_modules/tsx/dist/cli.mjs");
const FIXTURE = path.join(ROOT, ".runtime/test-governance-ledger");

function runCli(...args) {
  return spawnSync(process.execPath, [TSX, CLI, ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

test("governance ledger verify passes GL-1.0 seed ledger", () => {
  const verify = runCli("verify", "--json");
  assert.equal(verify.status, 0, verify.stderr || verify.stdout);
  const result = JSON.parse(verify.stdout);
  assert.equal(result.ok, true);
  assert.equal(result.format, "GL-1.0");
  assert.ok(result.entries >= 1);
  assert.equal(result.checks.ledgerIntegrity, "OK");
});

test("governance ledger verify detects GL-1.0 hash tampering", () => {
  fs.mkdirSync(FIXTURE, { recursive: true });
  const src = path.join(ROOT, "governance/ledger/ledger.jsonl");
  const dest = path.join(FIXTURE, "ledger.jsonl");
  fs.copyFileSync(src, dest);

  const lines = fs.readFileSync(dest, "utf8").trim().split("\n");
  const entry = JSON.parse(lines[0]);
  entry.rationale = entry.rationale + " TAMPERED";
  fs.writeFileSync(dest, `${JSON.stringify(entry)}\n`, "utf8");

  const verify = runCli("verify", dest, "--json");
  assert.notEqual(verify.status, 0);
  const result = JSON.parse(verify.stdout);
  assert.equal(result.ok, false);
  assert.ok(result.errors.length > 0);
});

test("governance ledger verify passes GLS-1.0 genesis ledger", () => {
  const gls = path.join(ROOT, "governance/governance-ledger/ledger.jsonl");
  if (!fs.existsSync(gls)) return;

  const verify = runCli("verify", gls, "--gls", "--json");
  assert.equal(verify.status, 0, verify.stderr || verify.stdout);
  const result = JSON.parse(verify.stdout);
  assert.equal(result.ok, true);
  assert.equal(result.format, "GLS-1.0");
});
