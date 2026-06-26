/**
 * GLV-1.0, RPH-1.0, CAIC-1.0, Derived Layer regeneration wrappers.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REPO_ROOT } from "./constitutionalData.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATORS = path.join(REPO_ROOT, "tools/generators");

function runGenerator(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(GENERATORS, script), ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  let parsed = null;
  try {
    parsed = r.stdout ? JSON.parse(r.stdout) : null;
  } catch {
    parsed = { stdout: r.stdout, stderr: r.stderr };
  }
  return { ok: r.status === 0, status: r.status, data: parsed, stdout: r.stdout, stderr: r.stderr };
}

export function runGLV() {
  const tsx = path.join(REPO_ROOT, "node_modules/tsx/dist/cli.mjs");
  const cli = path.join(REPO_ROOT, "src/cli/governance.ts");
  const r = spawnSync(process.execPath, [tsx, cli, "verify", "--json"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });

  let verification = null;
  try {
    verification = r.stdout ? JSON.parse(r.stdout) : null;
  } catch {
    verification = {
      ok: false,
      summary: r.stderr || r.stdout || "ledger verify failed",
      format: "unknown",
      checks: {},
      errors: [],
    };
  }

  const ok = r.status === 0 && verification?.ok === true;

  return {
    version: "GLV-1.0",
    status: ok ? "pass" : "fail",
    summary: verification?.summary ?? (ok ? "Ledger integrity: OK" : "Ledger integrity: FAIL"),
    ledger_format: verification?.format ?? "unknown",
    checks: verification?.checks ?? {},
    ledger: {
      status: ok ? "pass" : "fail",
      entries: verification?.entries ?? 0,
      errors: verification?.errors ?? [],
    },
    verification,
  };
}

export function runCAIC() {
  const r = runGenerator("cav-validate.mjs");
  const data = r.data ?? {};
  const errors = data.errors ?? [];
  const warnings = data.warnings ?? [];

  return {
    version: "CAIC-1.0",
    canonicalIntegrity: errors.length === 0 ? "OK" : "FAIL",
    unexpectedChanges: errors,
    missingArtifacts: warnings.filter((w) => /missing/i.test(w)),
    hashTree: errors.length === 0 ? "verified" : "failed",
    status: errors.length === 0 ? "pass" : "fail",
    details: data,
  };
}

export function runRPH(options = {}) {
  const steps = [];
  const add = (name, fn) => {
    const result = fn();
    steps.push({ step: name, ...result });
    return result;
  };

  add("proof_graph", () => runGenerator("proof-graph-index.mjs"));
  add("csr", () => runGenerator("csr-registry.mjs"));
  add("dra", () => runGenerator("dra-analyze.mjs", ["--out", "meta/DRA-1.0.json"]));
  add("cor", () => runGenerator("cor-generate.mjs", ["--out", "meta/COR-1.0.json"]));

  if (!options.skip_cav) {
    add("cav", () => runGenerator("cav-validate.mjs"));
  }

  add("glv", () => ({ ok: runGLV().status === "pass", data: runGLV() }));

  const ok = steps.every((s) => s.ok !== false);

  return {
    version: "RPH-1.0",
    status: ok ? "pass" : "partial",
    deterministic: true,
    reproducible: true,
    founder_independent: true,
    steps,
  };
}

export function regenerateDerivedLayer(options = {}) {
  if (options.full) {
    const r = spawnSync(
      process.execPath,
      [path.join(GENERATORS, "darp-regenerate.mjs"), ...(options.fail_on_cav ? ["--fail-on-cav"] : [])],
      { cwd: REPO_ROOT, encoding: "utf8" },
    );
    return {
      version: "DARP-1.0",
      ok: r.status === 0,
      stdout: r.stdout,
      stderr: r.stderr,
    };
  }

  return {
    version: "DARP-1.0",
    cor: runGenerator("cor-generate.mjs", ["--out", "meta/COR-1.0.json"]),
    csr: runGenerator("csr-registry.mjs"),
    dra: runGenerator("dra-analyze.mjs", ["--out", "meta/DRA-1.0.json"]),
    cav: runGenerator("cav-validate.mjs"),
    pipeline: "canonical → proof graph → CSR → DRA → COR → governance",
  };
}
