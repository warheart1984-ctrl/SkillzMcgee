/**
 * Auditor certification protocol — seven-step release validity gate.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadCOR, loadCSR, loadContinuityTimeline, PATHS, REPO_ROOT } from "./constitutionalData.mjs";
import { generateCanonicalManifest, validateCanonicalManifest } from "./canonicalManifest.mjs";
import { runGLV } from "./constitutionalEngines.mjs";
import { buildGraphVisual } from "./proofGraphData.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GENERATORS = path.join(REPO_ROOT, "tools/generators");
const CERT_DIR = path.join(REPO_ROOT, "governance/certifications");
const RISK_THRESHOLD = new Set(["low", "medium"]);

function runGenerator(script, args = []) {
  const r = spawnSync(process.execPath, [path.join(GENERATORS, script), ...args], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  let parsed = null;
  try {
    parsed = r.stdout ? JSON.parse(r.stdout) : null;
  } catch {
    parsed = { stdout: r.stdout?.slice(0, 500), stderr: r.stderr?.slice(0, 500) };
  }
  return { ok: r.status === 0, status: r.status, data: parsed, stdout: r.stdout, stderr: r.stderr };
}

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function compareJson(a, b, label) {
  const sa = JSON.stringify(a);
  const sb = JSON.stringify(b);
  return { step: label, pass: sa === sb, detail: sa === sb ? "match" : "drift detected" };
}

function checkGraphCycles(graph) {
  const adj = new Map();
  for (const e of graph.edges ?? []) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source).push(e.target);
  }
  const visited = new Set();
  const stack = new Set();
  let cycle = null;

  function dfs(n) {
    if (stack.has(n)) {
      cycle = n;
      return true;
    }
    if (visited.has(n)) return false;
    visited.add(n);
    stack.add(n);
    for (const next of adj.get(n) ?? []) {
      if (dfs(next)) return true;
    }
    stack.delete(n);
    return false;
  }

  for (const n of graph.nodes ?? []) {
    if (dfs(n.id)) break;
  }

  const nodeIds = new Set((graph.nodes ?? []).map((n) => n.id));
  const orphans = (graph.edges ?? [])
    .filter((e) => !nodeIds.has(e.source) || !nodeIds.has(e.target))
    .map((e) => `${e.source}→${e.target}`);

  return {
    pass: !cycle && orphans.length === 0,
    cycles: cycle ? [cycle] : [],
    orphans,
  };
}

function replayContinuity(timeline) {
  const gaps = [];
  let lastTs = null;
  for (const ev of timeline ?? []) {
    const ts = ev.timestamp ?? ev.ts;
    if (lastTs && ts && new Date(ts) < new Date(lastTs)) {
      gaps.push({ type: "order_violation", event: ev });
    }
    if (ev.contradiction) gaps.push({ type: "contradiction", event: ev });
    lastTs = ts ?? lastTs;
  }
  return { pass: gaps.length === 0, gaps };
}

export function runAuditorCertification(options = {}) {
  const release = options.release ?? "v1.0";
  const auditorId = options.auditor_id ?? "auditor:local";
  const riskThreshold = options.risk_threshold ?? "medium";
  const steps = [];

  const add = (name, fn) => {
    const result = fn();
    steps.push({ step: name, ...result });
    return result;
  };

  add("canonical_integrity", () => {
    generateCanonicalManifest({ write: true });
    const v = validateCanonicalManifest();
    return {
      pass: v.status === "pass",
      detail: v.canonicalIntegrity,
      unexpected: v.unexpectedChanges?.length ?? 0,
      missing: v.missingArtifacts?.length ?? 0,
    };
  });

  add("proof_graph_rebuild", () => {
    const gen = runGenerator("proof-graph-index.mjs");
    const graph = buildGraphVisual();
    const integrity = checkGraphCycles(graph);
    return {
      pass: gen.ok && integrity.pass,
      generator: gen.ok,
      cycles: integrity.cycles,
      orphans: integrity.orphans,
      nodes: graph.nodeCount,
    };
  });

  add("csr_regeneration", () => {
    const before = loadCSR();
    const gen = runGenerator("csr-registry.mjs");
    const after = readJsonSafe(PATHS.csrRegistry) ?? readJsonSafe(PATHS.csr);
    const cmp = compareJson(before?.claims, after?.claims, "csr");
    return { pass: gen.ok, regenerated: gen.ok, ...cmp };
  });

  add("cor_regeneration", () => {
    const before = loadCOR();
    const gen = runGenerator("cor-generate.mjs", ["--out", "meta/COR-1.0.json"]);
    const after = readJsonSafe(PATHS.corMeta) ?? readJsonSafe(PATHS.cor);
    const cmp = compareJson(
      (before.requirements ?? []).length,
      (after?.requirements ?? []).length,
      "cor_requirement_count",
    );
    return { pass: gen.ok, regenerated: gen.ok, ...cmp };
  });

  add("dra_analysis", () => {
    const gen = runGenerator("dra-analyze.mjs", ["--out", "meta/DRA-1.0.json"]);
    const dra = readJsonSafe(PATHS.draMeta);
    const risk = String(dra?.riskLevel ?? "high").toLowerCase();
    const allowed =
      riskThreshold === "high"
        ? true
        : RISK_THRESHOLD.has(risk) && (riskThreshold === "medium" || risk === "low");
    return {
      pass: gen.ok && allowed,
      riskLevel: risk,
      threshold: riskThreshold,
      unverified: dra?.unverifiedDependencies ?? null,
    };
  });

  add("ledger_verification", () => {
    const glv = runGLV();
    return {
      pass: glv.status === "pass",
      summary: glv.summary,
      checks: glv.checks,
    };
  });

  add("continuity_replay", () => {
    const timeline = loadContinuityTimeline();
    const replay = replayContinuity(timeline);
    return { pass: replay.pass, gaps: replay.gaps, events: timeline.length };
  });

  const allPass = steps.every((s) => s.pass);
  const certificationId = `CERT-${release.replace(/\./g, "")}-${Date.now().toString(36)}`;

  const record = {
    certification_id: certificationId,
    release,
    auditor_id: auditorId,
    status: allPass ? "certified" : "failed",
    certified_at: new Date().toISOString(),
    steps,
    signature: null,
  };

  if (options.sign && options.private_key) {
    const message = JSON.stringify({
      certification_id: certificationId,
      release,
      auditor_id: auditorId,
      steps: steps.map((s) => ({ step: s.step, pass: s.pass })),
    });
    record.signature = {
      algorithm: "ed25519-dev",
      value: crypto.createHash("sha256").update(message).digest("hex"),
    };
  }

  if (options.write !== false) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(CERT_DIR, `${certificationId}.json`),
      `${JSON.stringify(record, null, 2)}\n`,
      "utf8",
    );
  }

  return record;
}
