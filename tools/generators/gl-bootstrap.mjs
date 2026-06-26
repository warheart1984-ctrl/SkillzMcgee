#!/usr/bin/env node
/**
 * Bootstrap GL-1.0 genesis ledger from GLS defer decision (honest posture).
 */
import { appendDecision } from "./gl-lib.mjs";

const entry = appendDecision({
  steward: "sc:council-genesis",
  decision: "defer",
  subject: "release:v1.0",
  rationale:
    "RCD-1.0 not satisfied: proof_closure fail. v1.0 specification and measurement infrastructure approved; operational release deferred pending PL-1.1.",
});

console.log(`Appended GL-1.0 entry: ${entry.id}`);
console.log(`${entry.decision}\t${entry.subject}\t${entry.timestamp}`);
