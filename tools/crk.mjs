#!/usr/bin/env node
/**
 * CRK conformance CLI — cor, csr, graph, dra, cav, regenerate, query, explain, counterfactual, validate.
 * Usage: node tools/crk.mjs <command> [options]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATORS = path.join(ROOT, "tools/generators");

function run(script, args) {
  const r = spawnSync(process.execPath, [script, ...args], { stdio: "inherit", cwd: ROOT });
  process.exit(r.status ?? 1);
}

function loadCor() {
  const p = path.join(ROOT, "meta/COR-1.0.json");
  if (!fs.existsSync(p)) {
    console.error("COR not found. Run: node tools/crk.mjs cor generate --out meta/COR-1.0.json");
    process.exit(3);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const [cmd, sub, ...rest] = process.argv.slice(2);

if (cmd === "cor" && sub === "generate") {
  run(path.join(GENERATORS, "cor-generate.mjs"), rest);
}

if (cmd === "csr" && sub === "refresh") {
  run(path.join(GENERATORS, "csr-registry.mjs"), rest);
}

if (cmd === "graph" && sub === "refresh") {
  run(path.join(GENERATORS, "proof-graph-index.mjs"), rest);
}

if (cmd === "dra") {
  run(path.join(GENERATORS, "dra-analyze.mjs"), [sub, ...rest].filter(Boolean));
}

if (cmd === "regenerate" && (sub === "all" || !sub)) {
  run(path.join(GENERATORS, "darp-regenerate.mjs"), rest);
}

if (cmd === "explain" && sub === "NODE" && rest[0]) {
  run(path.join(GENERATORS, "explain-node.mjs"), [rest[0]]);
}

if (cmd === "counterfactual") {
  run(path.join(GENERATORS, "counterfactual.mjs"), [sub, ...rest].filter(Boolean));
}

if (cmd === "query") {
  const cor = loadCor();
  if (rest.includes("--incomplete") || rest.includes("--unimplemented")) {
    for (const r of cor.requirements.filter((x) => x.exceptions?.length || x.implementation_status !== "complete")) {
      console.log(`${r.requirement_id}\t${r.claim_status}\t${r.exceptions?.join("; ") || ""}`);
    }
    process.exit(0);
  }
  if (rest.includes("--verified")) {
    for (const r of cor.requirements.filter((x) => x.claim_status === "verified" || x.claim_status === "reproduced")) {
      console.log(`${r.requirement_id}\t${r.claim_status}`);
    }
    process.exit(0);
  }
  if (rest.includes("--implemented")) {
    for (const r of cor.requirements.filter((x) =>
      ["implemented", "verified", "reproduced"].includes(x.claim_status)
    )) {
      console.log(`${r.requirement_id}\t${r.claim_status}`);
    }
    process.exit(0);
  }
  if (rest.includes("coverage")) {
    const idx = rest.indexOf("--requirement");
    const id = idx >= 0 ? rest[idx + 1] : null;
    const rows = id ? cor.requirements.filter((r) => r.requirement_id === id) : cor.requirements;
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  }
  console.log("Usage: crk query requirements --incomplete | --verified | --implemented");
  console.log("       crk query coverage [--requirement CRK1-R###]");
  process.exit(2);
}

if (cmd === "validate" && sub === "closure") {
  run(path.join(GENERATORS, "cor-generate.mjs"), ["--out", "meta/COR-1.0.json", "--fail-on-incomplete"]);
}

if (cmd === "validate" && sub === "canonical") {
  const args = rest.includes("--fail-on-error") ? ["--fail-on-error"] : [];
  run(path.join(GENERATORS, "cav-validate.mjs"), args);
}

if (cmd === "orc" && sub === "evaluate") {
  run(path.join(GENERATORS, "orc-evaluate.mjs"), rest);
}

if (cmd === "rcd" && sub === "evaluate") {
  run(path.join(GENERATORS, "rcd-evaluate.mjs"), rest);
}

console.log(`CRK Conformance CLI

Commands:
  cor generate [--out meta/COR-1.0.json] [--fail-on-incomplete]
  csr refresh                              Regenerate CSR-1.0 registry
  graph refresh                            Regenerate proof-graph index
  dra top-blockers | unresolved-assumptions | impact-of <ID> | what-unblocks <REQ>
  regenerate all [--skip-cav] [--fail-on-cav]   DARP-1.0 full rebuild
  explain NODE <NODE_ID>
  counterfactual remove NODE <ID> | downgrade CLAIM <REQ> <FROM> <TO> | remove EVIDENCE <ID>
  query requirements --incomplete|--verified|--implemented
  query coverage [--requirement CRK1-R###]
  validate closure                         Fail if proof_closure != pass
  validate canonical [--fail-on-error]     CAV-1.0 lint
  orc evaluate [--out meta/ORC-1.0.json]   ORC-1.0 readiness checklist
  rcd evaluate [--out meta/RCD-1.0.json]   RCD-1.0 release criteria

See conformance/certification/ and docs/public/architecture-vs-evidence.md
`);
process.exit(0);
