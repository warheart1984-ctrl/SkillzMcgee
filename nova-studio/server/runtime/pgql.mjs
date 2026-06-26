/**
 * PGQL — Proof Graph Query Language interpreter
 * Pipeline: query → lexer → parser → AST → evaluator → result
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadCOR,
  loadCSR,
  loadDRA,
  loadGovernanceLedger,
  loadProofGraph,
  REPO_ROOT,
} from "./constitutionalData.mjs";

const GENERATORS = path.join(REPO_ROOT, "tools/generators");

function tokenize(input) {
  const tokens = [];
  let i = 0;
  const s = input.trim();

  while (i < s.length) {
    if (/\s/.test(s[i])) {
      i++;
      continue;
    }
    if (s[i] === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') j++;
      tokens.push({ type: "STRING", value: s.slice(i + 1, j) });
      i = j + 1;
      continue;
    }
    if (s[i] === "=") {
      tokens.push({ type: "EQ" });
      i++;
      continue;
    }
    const word = s.slice(i).match(/^[\w.-]+/);
    if (word) {
      const v = word[0];
      const upper = v.toUpperCase();
      const keywords = new Set([
        "SELECT",
        "WHERE",
        "EXPLAIN",
        "CLAIM",
        "COUNTERFACTUAL",
        "REMOVE",
        "NODE",
        "FROM",
        "DEPENDENTS",
        "DEPENDENCIES",
      ]);
      tokens.push({
        type: keywords.has(upper) ? upper : "IDENT",
        value: v,
      });
      i += v.length;
      continue;
    }
    throw new Error(`Unexpected character at ${i}: ${s[i]}`);
  }
  return tokens;
}

function parse(tokens) {
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = (type) => {
    const t = tokens[pos];
    if (!t || (type && t.type !== type)) {
      throw new Error(`Expected ${type}, got ${t?.type ?? "EOF"}`);
    }
    pos++;
    return t;
  };

  const first = peek();
  if (!first) throw new Error("Empty query");

  if (first.type === "SELECT") {
    consume("SELECT");
    const target = consume("IDENT").value;
    const node = { kind: "SelectQuery", target, where: null };
    if (peek()?.type === "WHERE") {
      consume("WHERE");
      const field = consume("IDENT").value;
      consume("EQ");
      const value =
        peek()?.type === "STRING"
          ? consume("STRING").value
          : consume("IDENT").value;
      node.where = { field, value };
    }
    return node;
  }

  if (first.type === "EXPLAIN") {
    consume("EXPLAIN");
    if (peek()?.type === "CLAIM") consume("CLAIM");
    const id =
      peek()?.type === "STRING"
        ? consume("STRING").value
        : consume("IDENT").value;
    return { kind: "ExplainQuery", id };
  }

  if (first.type === "COUNTERFACTUAL") {
    consume("COUNTERFACTUAL");
    if (peek()?.type === "STRING") {
      return { kind: "CounterfactualQuery", scenario: consume("STRING").value };
    }
    const action = consume("IDENT").value.toLowerCase();
    const kind = consume("IDENT").value.toUpperCase();
    const id =
      peek()?.type === "STRING"
        ? consume("STRING").value
        : consume("IDENT").value;
    return { kind: "CounterfactualQuery", action, targetKind: kind, id };
  }

  if (first.type === "DEPENDENCIES" || first.type === "DEPENDENTS") {
    const direction = consume(first.type).type;
    const id =
      peek()?.type === "STRING"
        ? consume("STRING").value
        : consume("IDENT").value;
    return { kind: direction === "DEPENDENCIES" ? "DependenciesQuery" : "DependentsQuery", id };
  }

  throw new Error(`Unsupported query start: ${first.type}`);
}

function filterClaims(where) {
  const csr = loadCSR();
  const cor = loadCOR();
  const corById = new Map((cor.requirements ?? []).map((r) => [r.requirement_id, r]));

  return Object.entries(csr.claims ?? {})
    .map(([id, claim]) => {
      const row = corById.get(id) ?? {};
      return {
        id,
        claim,
        evidence_status: row.evidence_status,
        receipt_status: row.receipt_status,
        claim_status: row.claim_status,
        provenance_status: row.provenance_status,
      };
    })
    .filter((row) => {
      if (!where) return true;
      const field = where.field.toLowerCase();
      const val = where.value.toLowerCase();

      if (field === "status") {
        if (val === "missing") {
          return (
            row.evidence_status === "missing" ||
            row.receipt_status === "missing" ||
            row.provenance_status === "missing"
          );
        }
        return (
          String(row.claim_status ?? row.claim).toLowerCase() === val ||
          String(row.claim).toLowerCase() === val
        );
      }
      return String(row[field] ?? "").toLowerCase() === val;
    });
}

function runExplainNode(id) {
  const r = spawnSync(process.execPath, [path.join(GENERATORS, "explain-node.mjs"), id], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    return { error: r.stderr || `unknown node: ${id}` };
  }
  try {
    return JSON.parse(r.stdout);
  } catch {
    return { raw: r.stdout };
  }
}

function runCounterfactual(action, targetKind, id) {
  const args = [path.join(GENERATORS, "counterfactual.mjs")];
  if (action === "remove" && targetKind === "NODE") {
    args.push("remove", "NODE", id);
  } else {
    args.push("remove", "NODE", id);
  }
  const r = spawnSync(process.execPath, args, { cwd: REPO_ROOT, encoding: "utf8" });
  if (r.status !== 0) return { error: r.stderr || r.stdout };
  try {
    return JSON.parse(r.stdout);
  } catch {
    return { raw: r.stdout };
  }
}

function graphNeighbors(id, direction) {
  const graph = loadProofGraph();
  const deps = new Set();
  const dependents = new Set();

  const req = graph.requirements?.[id];
  if (req) {
    for (const s of req.specifications ?? []) deps.add(s);
    for (const a of req.authority ?? []) deps.add(a);
    for (const impl of req.implementations ?? []) dependents.add(impl);
  }

  for (const [reqId, row] of Object.entries(graph.requirements ?? {})) {
    if ((row.implementations ?? []).includes(id)) deps.add(reqId);
    if ((row.specifications ?? []).includes(id)) deps.add(reqId);
  }

  const list = direction === "dependencies" ? [...deps] : [...dependents];
  return { id, direction, nodes: list };
}

function evaluate(ast) {
  switch (ast.kind) {
    case "SelectQuery": {
      if (ast.target.toLowerCase() === "claims") {
        return { type: "claims", rows: filterClaims(ast.where) };
      }
      if (ast.target.toLowerCase() === "ledger") {
        let rows = loadGovernanceLedger();
        if (ast.where) {
          rows = rows.filter(
            (e) =>
              String(e[ast.where.field] ?? "").toLowerCase() ===
              ast.where.value.toLowerCase(),
          );
        }
        return { type: "ledger", rows };
      }
      if (ast.target.toLowerCase() === "blockers") {
        const dra = loadDRA();
        return { type: "blockers", rows: dra.top_blockers ?? [] };
      }
      throw new Error(`Unknown SELECT target: ${ast.target}`);
    }
    case "ExplainQuery":
      return { type: "explain", ...runExplainNode(ast.id) };
    case "CounterfactualQuery":
      if (ast.scenario) {
        const m = ast.scenario.match(/remove\s+(\S+)/i);
        const id = m?.[1] ?? ast.scenario;
        return { type: "counterfactual", ...runCounterfactual("remove", "NODE", id) };
      }
      return {
        type: "counterfactual",
        ...runCounterfactual(ast.action, ast.targetKind, ast.id),
      };
    case "DependenciesQuery":
      return { type: "dependencies", ...graphNeighbors(ast.id, "dependencies") };
    case "DependentsQuery":
      return { type: "dependents", ...graphNeighbors(ast.id, "dependents") };
    default:
      throw new Error(`Unknown AST: ${ast.kind}`);
  }
}

export function executePgql(query) {
  const tokens = tokenize(query);
  const ast = parse(tokens);
  const result = evaluate(ast);
  return { query, ast, result, executed_at: new Date().toISOString() };
}
