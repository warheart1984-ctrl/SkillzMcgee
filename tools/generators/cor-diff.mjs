#!/usr/bin/env node
import fs from "node:fs";

const [oldPath, newPath] = process.argv.slice(2);
if (!oldPath || !newPath) {
  console.error("Usage: cor-diff.mjs <old.json> <new.json>");
  process.exit(2);
}
const oldCor = JSON.parse(fs.readFileSync(oldPath, "utf8"));
const newCor = JSON.parse(fs.readFileSync(newPath, "utf8"));

const oldSum = oldCor.summary ?? {};
const newSum = newCor.summary ?? {};

console.log(`canonicalIntegrity: ${oldCor.canonicalIntegrity ? "tracked" : "unchanged"}`);
console.log(
  `evidenceCoverage: missing ${oldSum.missing_evidence ?? "?"} → ${newSum.missing_evidence ?? "?"}`,
);
console.log(
  `proofGraphStatus: proof_closure ${oldSum.proof_closure ?? "?"} → ${newSum.proof_closure ?? "?"}`,
);
console.log(
  `dependencyRisk: ${oldCor.dependencyRisk ?? "n/a"} → ${newCor.dependencyRisk ?? "n/a"}`,
);
console.log(
  `releaseReadiness: ${oldCor.releaseReadiness ?? oldSum.proof_closure ?? "?"} → ${newCor.releaseReadiness ?? newSum.proof_closure ?? "?"}`,
);
