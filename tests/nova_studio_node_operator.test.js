import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getNodeAlerts,
  getNodeContinuity,
  getNodeLedger,
  getNodeMesh,
  getNodePolicy,
  getNodeReceipts,
  getNodeStatus,
  replayNodeTrace,
  submitNodeTask,
} from "../nova-studio/server/runtime/nodeClient.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

test("Nova Studio exposes Node operator route, nav, and page toggle", () => {
  const routes = fs.readFileSync(path.join(repoRoot, "src/nova-studio/routes.tsx"), "utf8");
  const shell = fs.readFileSync(path.join(repoRoot, "src/nova-studio/NovaStudioShell.tsx"), "utf8");
  const page = fs.readFileSync(path.join(repoRoot, "src/nova-studio/node/NodePage.tsx"), "utf8");

  assert.match(routes, /path: "node"/);
  assert.match(shell, /label="Node"/);
  assert.match(page, /Use Node v0\.1 \(governed\)/);
  assert.match(page, /\/api\/node\/status/);
  assert.match(page, /\/api\/node\/submit/);
  assert.match(page, /Governance Health/);
  assert.match(page, /Rate Limits/);
  assert.match(page, /Federation/);
  assert.match(page, /Handshake/);
  assert.match(page, /Replay Explorer/);
  assert.match(page, /Continuity Graph/);
  assert.match(page, /Policy Diff/);
  assert.match(page, /Federation Mesh/);
  assert.match(page, /Governance Alerts/);
});

test("Node client proxies status receipts ledger submit and N1 evidence", async (t) => {
  const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.method === "GET" && req.url === "/node/status") {
      res.end(JSON.stringify({ node_id: "jonai-node-001", receipt_count: 1 }));
      return;
    }
    if (req.method === "GET" && req.url === "/node/receipts") {
      res.end(JSON.stringify({ receipts: [{ trace_id: "trace-1" }] }));
      return;
    }
    if (req.method === "GET" && req.url === "/node/ledger") {
      res.end(JSON.stringify({ ledger: [], continuity: [] }));
      return;
    }
    if (req.method === "GET" && req.url === "/node/continuity") {
      res.end(JSON.stringify({ events: [{ kind: "submit", trace_id: "trace-1" }] }));
      return;
    }
    if (req.method === "GET" && req.url === "/node/policy") {
      res.end(JSON.stringify({ policy_hash: "abc", diff: { added: [], removed: [], changed: [] } }));
      return;
    }
    if (req.method === "GET" && req.url === "/node/mesh") {
      res.end(JSON.stringify({ peers: [], consensus_ratio: 1, divergent_peers: [] }));
      return;
    }
    if (req.method === "GET" && req.url === "/node/alerts") {
      res.end(JSON.stringify({ alerts: [] }));
      return;
    }
    if (req.method === "POST" && req.url === "/node/hello") {
      res.end(JSON.stringify({ node_id: "jonai-node-001", trust_level: "self", signature: "sig" }));
      return;
    }
    if (req.method === "POST" && req.url === "/node/replay/trace-1") {
      res.end(JSON.stringify({ trace_id: "trace-1", deterministic: true }));
      return;
    }
    if (req.method === "POST" && req.url === "/node/submit") {
      const body = await readRequestJson(req);
      res.end(JSON.stringify({ decision: "allowed", trace_id: "trace-2", echo: body.task_id }));
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => closeTestServer(server));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  const previous = process.env.NOVA_NODE_BASE_URL;
  process.env.NOVA_NODE_BASE_URL = `http://127.0.0.1:${port}`;
  t.after(() => {
    if (previous === undefined) delete process.env.NOVA_NODE_BASE_URL;
    else process.env.NOVA_NODE_BASE_URL = previous;
  });

  assert.equal((await getNodeStatus()).node_id, "jonai-node-001");
  assert.equal((await getNodeReceipts()).receipts[0].trace_id, "trace-1");
  assert.deepEqual(await getNodeLedger(), { ledger: [], continuity: [] });
  assert.equal((await getNodeContinuity()).events[0].kind, "submit");
  assert.equal((await getNodePolicy()).policy_hash, "abc");
  assert.equal((await getNodeMesh()).consensus_ratio, 1);
  assert.deepEqual((await getNodeAlerts()).alerts, []);
  assert.equal((await replayNodeTrace("trace-1")).deterministic, true);
  assert.equal((await submitNodeTask({ task_id: "task-ui" })).echo, "task-ui");
  const { getNodeHello } = await import("../nova-studio/server/runtime/nodeClient.mjs");
  assert.equal((await getNodeHello()).trust_level, "self");
});

function readRequestJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function closeTestServer(server) {
  return new Promise((resolve) => {
    server.closeAllConnections?.();
    server.close(() => resolve());
    setTimeout(resolve, 100);
  });
}
