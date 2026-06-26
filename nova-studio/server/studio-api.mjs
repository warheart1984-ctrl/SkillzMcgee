#!/usr/bin/env node
/**
 * Nova Studio API — HTTP bridge for UI + Python runtime.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { bootStudioRuntime, getStudioState, clearLedger } from "./runtime/studioRuntime.mjs";
import { runGovernedPipeline } from "./runtime/governedPipeline.mjs";
import { executeCapability } from "./runtime/capabilities.mjs";
import {
  exportSpecimen,
  importSpecimen,
  replaySpecimen,
  verifySpecimen,
  listSpecimens,
} from "./runtime/specimen.mjs";
import {
  getConstellation,
  exchangeWithPeer,
  broadcastConstellation,
} from "./runtime/constellation.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDIO_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(STUDIO_DIR, "..");
const PORT = Number(process.env.NOVA_STUDIO_PORT ?? 8787);
const DIST_DIR = path.join(STUDIO_DIR, "dist");
const PUBLIC_DIR = path.join(STUDIO_DIR, "public");

bootStudioRuntime();

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function callPythonBridge(action, payload = {}) {
  return new Promise((resolve, reject) => {
    const script = path.join(REPO_ROOT, "skillzmcgee", "studio_bridge.py");
    const proc = spawn("python", [script, action], {
      cwd: REPO_ROOT,
      env: { ...process.env, PYTHONPATH: REPO_ROOT },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d));
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("close", (code) => {
      if (code !== 0) {
        resolve({ ok: false, error: stderr || `python exit ${code}`, fallback: true });
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch {
        resolve({ ok: false, error: "Invalid JSON from Python bridge", raw: stdout });
      }
    });
    proc.stdin.write(JSON.stringify(payload));
    proc.stdin.end();
  });
}

function serveStatic(res, filePath) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
  };
  res.writeHead(200, { "Content-Type": types[ext] ?? "text/plain" });
  res.end(fs.readFileSync(filePath));
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  try {
    if (url.pathname === "/api/state" && req.method === "GET") {
      return json(res, 200, getStudioState());
    }
    if (url.pathname === "/api/governed-run" && req.method === "POST") {
      const body = await readBody(req);
      const result = await runGovernedPipeline(body);
      return json(res, 200, result);
    }
    if (url.pathname === "/api/capability" && req.method === "POST") {
      const body = await readBody(req);
      const result = await executeCapability(body.name, body.args ?? {});
      return json(res, 200, result);
    }
    if (url.pathname === "/api/python" && req.method === "POST") {
      const body = await readBody(req);
      const result = await callPythonBridge(body.action ?? "ping", body.payload ?? {});
      return json(res, 200, result);
    }
    if (url.pathname === "/api/specimen/export" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, exportSpecimen(body.label ?? "specimen"));
    }
    if (url.pathname === "/api/specimen/import" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, importSpecimen(body.id));
    }
    if (url.pathname === "/api/specimen/replay" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, replaySpecimen(body.id));
    }
    if (url.pathname === "/api/specimen/verify" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, verifySpecimen(body.id));
    }
    if (url.pathname === "/api/specimen/list" && req.method === "GET") {
      return json(res, 200, { specimens: listSpecimens() });
    }
    if (url.pathname === "/api/federation/constellation" && req.method === "GET") {
      return json(res, 200, getConstellation());
    }
    if (url.pathname === "/api/federation/exchange" && req.method === "POST") {
      const body = await readBody(req);
      if (body.broadcast) {
        return json(res, 200, { exchanges: broadcastConstellation() });
      }
      return json(res, 200, exchangeWithPeer(body.peer ?? "aaes"));
    }
    if (url.pathname === "/api/ledger/clear" && req.method === "POST") {
      clearLedger();
      return json(res, 200, { cleared: true });
    }

    const staticRoot = fs.existsSync(DIST_DIR) ? DIST_DIR : PUBLIC_DIR;
    let filePath = path.join(staticRoot, url.pathname === "/" ? "index.html" : url.pathname);
    if (!filePath.startsWith(staticRoot)) {
      return json(res, 403, { error: "Forbidden" });
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    return serveStatic(res, filePath);
  } catch (err) {
    return json(res, 500, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

server.listen(PORT, () => {
  console.log(`Nova Studio API → http://localhost:${PORT}`);
});
