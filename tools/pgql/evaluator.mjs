/**
 * PGQL-1.0 evaluator — deterministic constitutional queries.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { CONFORMANCE_PATHS, ROOT_DIR } from "../lib/conformance-paths.mjs";
import { readLedger } from "../generators/gl-lib.mjs";
import { parse } from "./parser.mjs";

function loadJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadCor() {
  return loadJson(CONFORMANCE_PATHS.cor) ?? loadJson(CONFORMANCE_PATHS.corMeta);
}

function loadCsr() {
  const raw = loadJson(CONFORMANCE_PATHS.csr) ?? loadJson(CONFORMANCE_PATHS.csrRegistry);
  if (!raw) return { claims: [] };
  if (Array.isArray(raw.claims)) return raw;
  return {
    claims: Object.entries(raw.claims ?? {}).map(([id, status]) => ({
      id,
      type: "normative-requirement",
      status: capitalizeStatus(status),
      evidence: [],
    })),
  };
}

function capitalizeStatus(s) {
  if (!s) return "Normative";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function loadGraph() {
  return loadJson(CONFORMANCE_PATHS.graph) ?? loadJson(CONFORMANCE_PATHS.graphIndex);
}

function applyCondition(items, where) {
  if (!where) return items;
  return items.filter((item) => {
    const field = where.field.toLowerCase();
    const v = item[field] ?? item[where.field];
    if (field === "evidence" && where.value === "missing") {
      return !item.evidence?.length && item.status !== "Normative";
    }
    if (field === "requirement") {
      return item.requirement_id === where.value || item.id === where.value;
    }
    if (field === "subject" && where.op === "CONTAINS") {
      return String(item.subject ?? v ?? "").includes(where.value);
    }
    switch (where.op) {
      case "=":
        return String(v) === String(where.value);
      case "!=":
        return String(v) !== String(where.value);
      case "CONTAINS":
        return String(v).includes(String(where.value));
      default:
        return true;
    }
  });
}

function evalSelect(q) {
  if (q.target === "claims") {
    const csr = loadCsr();
    const cor = loadCor();
    const claims = csr.claims.length
      ? csr.claims
      : (cor?.requirements ?? []).map((r) => ({
          id: r.requirement_id,
          type: "normative-requirement",
          status: capitalizeStatus(r.claim_status),
          evidence: r.exceptions ?? [],
        }));
    return applyCondition(claims, q.where);
  }
  if (q.target === "decisions") {
    return applyCondition(readLedger(), q.where);
  }
  if (q.target === "implementations") {
    const graph = loadGraph();
    return applyCondition(
      Object.entries(graph?.implementations ?? {}).map(([id, node]) => ({ id, ...node })),
      q.where,
    );
  }
  if (q.target === "dependencies") {
    const graph = loadGraph();
    const reqId = q.where?.value;
    const req = graph?.requirements?.[reqId];
    if (!req) return [];
    return [
      ...(req.specifications ?? []).map((s) => ({ type: "specification", id: s })),
      ...(req.implementations ?? []).map((s) => ({ type: "implementation", id: s })),
      ...(req.evidence ?? []).map((s) => ({ type: "evidence", id: s })),
    ];
  }
  return [];
}

function evalExplain(q) {
  const cor = loadCor();
  const graph = loadGraph();
  const id = q.id;
  const row = cor?.requirements?.find((r) => r.requirement_id === id);
  const graphReq = graph?.requirements?.[id];
  return {
    id,
    scope: q.scope,
    cor: row ?? null,
    graph: graphReq ?? null,
    path: graphReq
      ? {
          authority: graphReq.authority,
          specifications: graphReq.specifications,
          implementations: graphReq.implementations,
          evidence: graphReq.evidence,
        }
      : null,
  };
}

function evalCounterfactual(q) {
  const script = path.join(ROOT_DIR, "tools/generators/counterfactual.mjs");
  const parts = q.scenario.match(/remove\s+(\S+)/i);
  if (parts) {
    const r = spawnSync(process.execPath, [script, "remove", "NODE", parts[1]], {
      cwd: ROOT_DIR,
      encoding: "utf8",
    });
    return { query: q.scenario, output: r.stdout || r.stderr, exitCode: r.status };
  }
  return { query: q.scenario, error: "unsupported scenario syntax" };
}

export function evaluate(ast) {
  switch (ast.kind) {
    case "select":
      return { kind: "select", results: evalSelect(ast) };
    case "explain":
      return { kind: "explain", result: evalExplain(ast) };
    case "counterfactual":
      return { kind: "counterfactual", result: evalCounterfactual(ast) };
    default:
      throw new Error("unknown query kind");
  }
}

export function runPgqlQuery(queryString) {
  return evaluate(parse(queryString));
}
