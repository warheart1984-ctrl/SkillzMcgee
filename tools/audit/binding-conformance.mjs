/**
 * Binding Integration Addendum conformance audit (AAIS-VB-Î›-ADD-001).
 * Compares current SkillzMcGee build against U-1..U-4 invariants.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const REPORT_PATH = path.join(ROOT, ".runtime/binding-conformance-report.json");

function read(rel) {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
}

function grepFiles(pattern, globs) {
  const hits = [];
  for (const rel of globs) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    const stat = fs.statSync(full);
    const files = stat.isDirectory()
      ? walk(full).filter((f) => /\.(mjs|js|ts|tsx|md|json)$/.test(f))
      : [full];
    for (const file of files) {
      const text = fs.readFileSync(file, "utf8");
      if (pattern.test(text)) {
        hits.push(path.relative(ROOT, file));
      }
    }
  }
  return hits;
}

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.name === "node_modules" || ent.name === ".git") continue;
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function auditU1() {
  const parallelAuditStores = [
    "governance/governance-ledger/ledger.jsonl",
    "governance/ledger/ledger.jsonl",
    ".runtime/nova-studio/ledger.jsonl",
    "runtime/continuity/timeline.json",
  ].filter((p) => fs.existsSync(path.join(ROOT, p)));

  const evidenceSchema = read("governance/standards/theta/canon/evidence-ledger-schema.md");
  const hasZoneTick = evidenceSchema.includes("zoneTick");
  const hasUnified = /moduleTick|UnifiedLedgerEntry|entry_type/.test(
    read("governance/standards/theta/canon/evidence-ledger-schema.md") +
      read("src/ledger/zoneTick.js"),
  );

  const violations = [];
  if (parallelAuditStores.length > 1) {
    violations.push(
      `Multiple append-only governance/continuity stores (${parallelAuditStores.length}): ${parallelAuditStores.join(", ")}`,
    );
  }
  if (!hasZoneTick) violations.push("Evidence ledger schema missing zoneTick taxonomy");
  if (!hasUnified) {
    violations.push(
      "UnifiedLedgerEntry / moduleTick superset not implemented (Addendum Â§1.2)",
    );
  }

  return {
    id: "U-1",
    name: "Single Source of Historical Truth",
    status: violations.length === 0 ? "pass" : "partial",
    violations,
    evidence: { parallelAuditStores, hasZoneTick },
  };
}

function auditU2() {
  const lawKernel = read("nova-studio/server/runtime/lawKernel.mjs");
  const runSlice = read("substrate/runSlice.mjs");
  const crk2 = read("substrate/runSlice.mjs");

  const hasLawKernel = lawKernel.includes("evaluateLawKernel");
  const hasCrk2 = crk2.includes("evaluateCrk2Invariants");
  const dualGate = hasLawKernel && hasCrk2;

  const grvlNamed = grepFiles(/GRVL|Governance Receipt Validation/, [
    "src",
    "governance",
    "nova-studio",
  ]);
  const violations = [];
  if (dualGate) {
    violations.push(
      "runSlice applies CRK-2 invariants then lawKernel â€” potential dual governance pass (GRE generic + module-local)",
    );
  }
  if (grvlNamed.length === 0) {
    violations.push("GRVL not named as GRE Stage 2 realization for Negotiant Core (Â§2.2)");
  }

  return {
    id: "U-2",
    name: "Single Governance Check Per Action",
    status: violations.length === 0 ? "pass" : "partial",
    violations,
    evidence: { hasLawKernel, hasCrk2, grvlNamed: grvlNamed.slice(0, 5) },
  };
}

function auditU3() {
  const bindingPdfText = ""; // ratified Î› still says stabilization epoch
  const safeMode = read("src/governance/safe_mode.js");
  const escalation = read("src/governance/escalation.js");
  const driftEngine = read("substrate/drift-engine.mjs");
  const specDrift = read("specification/drift-envelopes.md");

  const hasNumericThresholds = /0\.30|0\.15|0\.05/.test(
    driftEngine + specDrift + safeMode + escalation,
  );
  const hasStabilizationEpoch = grepFiles(/stabilization epoch|Stabilization epoch/i, [
    "src",
    "substrate",
    "nova-studio",
    "governance",
  ]);
  const hasContainmentEpoch = grepFiles(/Automatic Containment|containment epoch/i, [
    "src",
    "substrate",
    "nova-studio",
    "governance",
    "conformance",
  ]);
  const operatorOnlyCorrection = escalation.includes("setEscalationMode");

  const violations = [];
  if (!hasNumericThresholds) {
    violations.push("Î›.5 drift escalation thresholds (0.05/0.15/0.30/0.50) not encoded");
  }
  if (hasContainmentEpoch.length === 0) {
    violations.push("Addendum Â§3 Automatic Containment Epoch not implemented");
  }
  if (hasStabilizationEpoch.length > 0) {
    violations.push(
      `Legacy 'stabilization epoch' terminology still present: ${hasStabilizationEpoch.slice(0, 3).join(", ")}`,
    );
  }

  return {
    id: "U-3",
    name: "Containment Without Correction",
    status: violations.length === 0 ? "pass" : "partial",
    violations,
    evidence: {
      hasNumericThresholds,
      operatorOnlyCorrection,
      safeModeLadder: ["S0", "S1", "S2", "S3"],
    },
  };
}

function auditU4() {
  const negotiantCanon = read("governance/standards/theta/canon/negotiant-core.md");
  const zoneTick = read("src/ledger/zoneTick.js");
  const ledgerSchema = read("governance/standards/theta/canon/evidence-ledger-schema.md");

  const hasLambdaVersion = /Î»_version|lambda_version/.test(
    zoneTick + ledgerSchema + negotiantCanon,
  );
  const hasRecertTick = /recertificationTick/.test(ledgerSchema + zoneTick);

  const violations = [];
  if (!hasLambdaVersion) {
    violations.push("Î»_version field not recorded on ledger entries (Addendum Â§4.2.1)");
  }
  if (!hasRecertTick) {
    violations.push("recertificationTick entry type not implemented (Addendum Â§4.2.3)");
  }

  return {
    id: "U-4",
    name: "Version Supremacy with Bounded Propagation",
    status: violations.length === 0 ? "pass" : "partial",
    violations,
    evidence: { hasLambdaVersion, hasRecertTick },
  };
}

function runNegotiantCoreTests() {
  const r = spawnSync(
    process.execPath,
    [
      "--test",
      "tests/negotiant-core/invariants.test.js",
      "tests/negotiant-core/face-independence.test.js",
      "tests/negotiant-core/validations.test.js",
      "tests/cockpit/indicators.reproducibility.test.js",
    ],
    { cwd: ROOT, encoding: "utf8" },
  );
  return { ok: r.status === 0, status: r.status, stderr: r.stderr?.slice(-500) };
}

function runBuildChecks() {
  const checks = [];
  const gov = spawnSync(process.execPath, ["--test", "tests/governance_ledger.test.js"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  checks.push({ name: "governance_ledger", ok: gov.status === 0 });

  const canon = spawnSync(process.execPath, ["--test", "tests/canonical_manifest.test.js"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  checks.push({ name: "canonical_manifest", ok: canon.status === 0 });

  const constitutional = spawnSync(
    process.execPath,
    ["--test", "tests/constitutional_runtime.test.js"],
    { cwd: ROOT, encoding: "utf8" },
  );
  checks.push({ name: "constitutional_runtime", ok: constitutional.status === 0 });

  return checks;
}

export function runBindingConformanceAudit() {
  const invariants = [auditU1(), auditU2(), auditU3(), auditU4()];
  const negotiant = runNegotiantCoreTests();
  const buildChecks = runBuildChecks();

  const partialCount = invariants.filter((i) => i.status === "partial").length;
  const passCount = invariants.filter((i) => i.status === "pass").length;

  const report = {
    audited_at: new Date().toISOString(),
    addendum: "AAIS-VB-Î›-ADD-001 v1.0.0 (DRAFT)",
    parents: [
      "AAIS-VB-Î›-001 (Voss Binding v1.0.0, RATIFIED 2026-05-02)",
      "Negotiant Core Whitepaper v1.0.0 (2026-06-26)",
    ],
    summary: {
      invariants_pass: passCount,
      invariants_partial: partialCount,
      negotiant_core_tests: negotiant.ok ? "pass" : "fail",
      build_checks: buildChecks.every((c) => c.ok) ? "pass" : "partial",
      overall:
        partialCount === 0 && negotiant.ok && buildChecks.every((c) => c.ok)
          ? "aligned"
          : "gaps_remain",
    },
    invariants,
    negotiant_core: negotiant,
    build_checks: buildChecks,
    ratified_binding_note:
      "Ratified Î› PDF still specifies 'Stabilization epoch' at drift > 0.30; Addendum Â§3 corrects this to Automatic Containment Epoch (DRAFT, not yet binding).",
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const report = runBindingConformanceAudit();
  console.log(JSON.stringify(report, null, 2));
  const exitCode = report.negotiant_core.ok ? 0 : 1;
  process.exit(exitCode);
}
