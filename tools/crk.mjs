#!/usr/bin/env node
/**
 * CRK conformance CLI — cor, query, explain, counterfactual, validate.
 * Usage: node tools/crk.mjs <command> [options]
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATORS = path.join(ROOT, "generators");

function run(script, args) {
  const r = spawnSync(process.execPath, [script, ...args], { stdio: "inherit", cwd: ROOT });
  process.exit(r.status ?? 1);
}

function loadCor() {
  const p = path.join(ROOT, "../meta/COR-1.0.json");
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

if (cmd === "explain" && sub === "NODE" && rest[0]) {
  run(path.join(GENERATORS, "explain-node.mjs"), [rest[0]]);
}

if (cmd === "counterfactual") {
  run(path.join(GENERATORS, "counterfactual.mjs"), [sub, ...rest].filter(Boolean));
}

if (cmd === "graph" && sub === "refresh") {
  run(path.join(GENERATORS, "proof-graph-index.mjs"), rest);
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
  run(path.join(GENERATORS, "cor-generate.mjs"), ["--out", path.join(ROOT, "../meta/COR-1.0.json"), "--fail-on-incomplete"]);
}

if (cmd === "csr" && sub === "refresh") {
  run(path.join(GENERATORS, "csr-registry.mjs"), rest);
}

console.log(`CRK Conformance CLI

Commands:
  cor generate [--out meta/COR-1.0.json] [--fail-on-incomplete] [--explain ID] [--counterfactual ID]
  csr refresh                              Regenerate CSR-1.0 registry
  graph refresh                            Regenerate proof-graph index
  explain NODE <NODE_ID>                   Explain-This-Node engine
  counterfactual remove NODE <ID>
  counterfactual downgrade CLAIM <REQ> <FROM> <TO>
  counterfactual remove EVIDENCE <EVID_ID>
  query requirements --incomplete|--verified|--implemented
  query coverage [--requirement CRK1-R###]
  validate closure                         Fail if proof_closure != pass

See conformance/proof-graph/ and docs/public/dont-trust-query-it.md
`);
process.exit(0);
