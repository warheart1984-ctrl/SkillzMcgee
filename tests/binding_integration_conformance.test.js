import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runBindingConformanceAudit } from "../tools/audit/binding-conformance.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

test("binding integration audit runs and records report", () => {
  const report = runBindingConformanceAudit();
  assert.ok(report.audited_at);
  assert.equal(report.invariants.length, 4);
  assert.ok(["aligned", "gaps_remain"].includes(report.summary.overall));
  assert.equal(report.negotiant_core.ok, true, report.negotiant_core.stderr);

  const reportPath = path.join(ROOT, ".runtime/binding-conformance-report.json");
  assert.ok(fs.existsSync(reportPath));
});

test("Negotiant Core whitepaper invariants â€” determinism suite passes", () => {
  const report = runBindingConformanceAudit();
  assert.equal(report.negotiant_core.ok, true);
  assert.equal(report.build_checks.every((c) => c.ok), true);
});

test("binding addendum U-1..U-4 gaps are documented when partial", () => {
  const report = runBindingConformanceAudit();
  for (const inv of report.invariants) {
    assert.ok(["pass", "partial"].includes(inv.status));
    assert.match(inv.id, /^U-[1-4]$/);
    if (inv.status === "partial") {
      assert.ok(inv.violations.length > 0, `${inv.id} partial without violations`);
    }
  }
});
