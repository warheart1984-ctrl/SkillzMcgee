#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CONFORMANCE_PATHS } from "../lib/conformance-paths.mjs";

const id = process.argv[2];
if (!id) {
  console.error("Usage: csr-explain.mjs <claim-id>");
  process.exit(2);
}

const csrPath = fs.existsSync(CONFORMANCE_PATHS.csr)
  ? CONFORMANCE_PATHS.csr
  : CONFORMANCE_PATHS.csrRegistry;
const csr = JSON.parse(fs.readFileSync(csrPath, "utf8"));
const claims = Array.isArray(csr.claims)
  ? csr.claims
  : Object.entries(csr.claims).map(([cid, status]) => ({ id: cid, status }));

const claim = claims.find((c) => c.id === id);
if (!claim) {
  console.error(`Unknown claim: ${id}`);
  process.exit(2);
}

console.log(`${claim.id} (${claim.type ?? "claim"})`);
console.log(`  Status: ${claim.status}`);
if (claim.evidence?.length) {
  console.log(`  Evidence: ${claim.evidence.join(", ")}`);
}
