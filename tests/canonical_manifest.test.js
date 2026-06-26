import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLI = path.join(ROOT, "src/cli/canonical.ts");
const TSX = path.join(ROOT, "node_modules/tsx/dist/cli.mjs");
const FIXTURE = path.join(ROOT, ".runtime/test-canonical");

function runCli(...args) {
  return spawnSync(process.execPath, [TSX, CLI, ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

test("canonical manifest generate + verify round-trip", () => {
  fs.rmSync(FIXTURE, { recursive: true, force: true });
  fs.mkdirSync(path.join(FIXTURE, "normative"), { recursive: true });
  fs.writeFileSync(path.join(FIXTURE, "normative", "NR-01.md"), "# Requirement 1\n", "utf8");
  fs.writeFileSync(path.join(FIXTURE, "normative", "NR-02.md"), "# Requirement 2\n", "utf8");

  const manifestPath = path.join(FIXTURE, "manifest-v1.0.json");
  const gen = runCli("generate", FIXTURE, "1.0", manifestPath);
  assert.equal(gen.status, 0, gen.stderr);

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.version, "1.0");
  assert.equal(manifest.files.length, 2);
  assert.ok(manifest.rootHash);

  const verify = runCli("verify", FIXTURE, manifestPath);
  assert.equal(verify.status, 0, verify.stderr);
  const result = JSON.parse(verify.stdout);
  assert.equal(result.ok, true);
});

test("canonical verify detects tampering", () => {
  const manifestPath = path.join(FIXTURE, "manifest-v1.0.json");
  if (!fs.existsSync(manifestPath)) return;

  const tampered = path.join(FIXTURE, "normative", "NR-01.md");
  fs.appendFileSync(tampered, "\n# tampered\n");

  const verify = runCli("verify", FIXTURE, manifestPath);
  assert.notEqual(verify.status, 0);
  const result = JSON.parse(verify.stdout);
  assert.equal(result.ok, false);
  assert.ok(result.changedFiles.length > 0);
});
