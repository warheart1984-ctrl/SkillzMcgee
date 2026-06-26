import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "../tools/pgql/parser.mjs";
import { runPgqlQuery } from "../tools/pgql/evaluator.mjs";
import {
  canonicalPayload,
  computeDecisionId,
  signDecision,
  verifySignature,
  validateEntry,
} from "../tools/generators/gl-lib.mjs";
import { CONFORMANCE_PATHS } from "../tools/lib/conformance-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("PGQL parser handles SELECT claims", () => {
  const ast = parse('SELECT claims WHERE evidence = missing');
  assert.equal(ast.kind, "select");
  assert.equal(ast.target, "claims");
});

test("PGQL explain query parses", () => {
  const ast = parse('EXPLAIN CLAIM "CRK1-R012"');
  assert.equal(ast.kind, "explain");
  assert.equal(ast.id, "CRK1-R012");
});

test("GL-1.0 decision id is deterministic", () => {
  const draft = {
    timestamp: "2026-06-26T20:00:00Z",
    steward: "sc:council-genesis",
    decision: "defer",
    subject: "release:v1.0",
    evidence: { cor: "cor-1.0.json", csr: "csr-1.0.json", dra: "dra-1.0.json" },
    rationale: "test",
    continuityCheckpoint: "00001",
    parentDecisionId: "GENESIS",
  };
  const id1 = computeDecisionId(draft);
  const id2 = computeDecisionId(draft);
  assert.equal(id1, id2);
  assert.match(id1, /^sha256:/);
});

test("GL-1.0 signature round-trip", () => {
  const draft = {
    timestamp: "2026-06-26T20:00:00Z",
    steward: "sc:council-genesis",
    decision: "defer",
    subject: "release:v1.0",
    evidence: { cor: "cor-1.0.json", csr: "csr-1.0.json", dra: "dra-1.0.json" },
    rationale: "test signature",
    continuityCheckpoint: "00001",
    parentDecisionId: "GENESIS",
  };
  const id = computeDecisionId(draft);
  const signed = signDecision({ ...draft, id }, "sc:council-genesis");
  const entry = { ...draft, id, ...signed };
  assert.equal(verifySignature(entry).ok, true);
  assert.equal(validateEntry(entry, null).length, 0);
});

test("canonical conformance paths exist after spec:cor", () => {
  if (!fs.existsSync(CONFORMANCE_PATHS.cor)) {
    console.log("skip: run npm run spec:cor to generate conformance artifacts");
    return;
  }
  const cor = JSON.parse(fs.readFileSync(CONFORMANCE_PATHS.cor, "utf8"));
  assert.ok(cor.version);
  assert.ok(cor.canonicalIntegrity || cor.summary);

  const result = runPgqlQuery('SELECT claims WHERE status = normative');
  assert.equal(result.kind, "select");
  assert.ok(Array.isArray(result.results));
});
