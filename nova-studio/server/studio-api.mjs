#!/usr/bin/env node
/**
 * Nova Studio API — HTTP bridge for UI + Python runtime.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import {
  bootStudioRuntime,
  getNovaRuntimeState,
  getStudioState,
  clearLedger,
} from "./runtime/studioRuntime.mjs";
import { getNovaStateData } from "../../api/state/nova.mjs";
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
import { handleStudioEventsUpgrade } from "./runtime/events.mjs";
import {
  getContinuityTimeline,
  getDriftPoints,
  getGovernanceReceipts,
  getSliceCapabilities,
  getSubstratePayload,
  readSkillzMcGeeLedgerText,
} from "./runtime/substrateState.mjs";
import { runSlice } from "../../substrate/runSlice.mjs";
import { loadContinuityState } from "../../services/continuityService.mjs";
import { getAuditState, getStewardState } from "./runtime/constitutionalData.mjs";
import { executePgql } from "./runtime/pgql.mjs";
import {
  regenerateDerivedLayer,
  runCAIC,
  runGLV,
  runRPH,
} from "./runtime/constitutionalEngines.mjs";
import { submitGovernanceVote } from "./runtime/governanceVote.mjs";
import { getProofGraphVisual } from "./runtime/proofGraphData.mjs";
import {
  generateCanonicalManifest,
  validateCanonicalManifest,
} from "./runtime/canonicalManifest.mjs";
import { evaluateReleaseReadiness } from "./runtime/releaseReadiness.mjs";
import { runAuditorCertification } from "./runtime/auditorCertification.mjs";
import { computeQuorumState, loadStewards } from "./runtime/quorum.mjs";
import {
  buildReceiptLineage,
  computeDriftAnomalies,
  computeDriftHistory,
  computeGovernanceImpact,
  computeImpact,
  diffReceipts,
  investigateDecision,
  investigateReceipt,
  replayContinuityFromCheckpoint,
  replaySlice,
  replaySlices,
} from "./runtime/forensics.mjs";
import { loadSession, recordSessionEvent } from "./runtime/sessionRecorder.mjs";
import { getLedger } from "./runtime/studioRuntime.mjs";
import {
  executeGovernedSlice,
  runGovernedCapability,
} from "./runtime/runGovernedCapability.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDIO_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(STUDIO_DIR, "..");
const PORT = Number(process.env.NOVA_STUDIO_PORT ?? 8787);
const DIST_REACT_DIR = path.join(STUDIO_DIR, "dist-react");
const DIST_REACT_NESTED = path.join(DIST_REACT_DIR, "nova-studio");
const DIST_DIR = path.join(STUDIO_DIR, "dist");
const PUBLIC_DIR = path.join(STUDIO_DIR, "public");

function getStaticLayout() {
  const reactIndex = path.join(DIST_REACT_NESTED, "index.react.html");
  if (fs.existsSync(reactIndex)) {
    return { kind: "react", root: DIST_REACT_DIR, index: reactIndex };
  }
  if (fs.existsSync(path.join(DIST_DIR, "index.html"))) {
    return { kind: "legacy", root: DIST_DIR, index: path.join(DIST_DIR, "index.html") };
  }
  return { kind: "public", root: PUBLIC_DIR, index: path.join(PUBLIC_DIR, "index.html") };
}

function resolveStaticFile(pathname) {
  const layout = getStaticLayout();
  const safePath = pathname === "/" ? "/" : pathname;

  if (layout.kind === "react") {
    if (safePath === "/" || safePath === "/index.html" || safePath === "/index.react.html") {
      return layout.index;
    }
    const relative = safePath.replace(/^\//, "");
    const candidate = path.join(layout.root, relative);
    if (candidate.startsWith(layout.root) && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
    return layout.index;
  }

  let filePath = path.join(layout.root, safePath === "/" ? "index.html" : relativePathFromUrl(safePath));
  if (!filePath.startsWith(layout.root)) {
    return null;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  return filePath;
}

function relativePathFromUrl(pathname) {
  return pathname.replace(/^\//, "");
}

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
      return json(res, 200, await getSubstratePayload());
    }
    if (url.pathname === "/api/capabilities" && req.method === "GET") {
      return json(res, 200, await getSliceCapabilities());
    }
    if (url.pathname === "/api/continuity" && req.method === "GET") {
      return json(res, 200, await getContinuityTimeline());
    }
    if (url.pathname === "/api/drift" && req.method === "GET") {
      return json(res, 200, await getDriftPoints());
    }
    if (url.pathname === "/skillzmcgee/ledger" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(await readSkillzMcGeeLedgerText());
      return;
    }
    if (url.pathname === "/api/state/nova" && req.method === "GET") {
      getNovaRuntimeState();
      return json(res, 200, getNovaStateData());
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
    const runMatch = url.pathname.match(/^\/api\/run\/([^/]+)$/);
    if (runMatch && req.method === "POST") {
      const body = await readBody(req);
      const continuityState = await loadContinuityState();
      const result = await runSlice({
        operator: req.headers["x-operator"] ?? body.operator ?? body.actor ?? "operator:local",
        capabilityId: decodeURIComponent(runMatch[1]),
        input: body.input ?? body,
        continuityState,
      });
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
    if (url.pathname === "/api/audit/state" && req.method === "GET") {
      return json(res, 200, getAuditState());
    }
    if (url.pathname === "/api/steward/state" && req.method === "GET") {
      return json(res, 200, getStewardState());
    }
    if (url.pathname === "/api/pgql" && req.method === "POST") {
      const body = await readBody(req);
      const result = executePgql(String(body.query ?? ""));
      return json(res, 200, result);
    }
    if (url.pathname === "/api/governance/vote" && req.method === "POST") {
      const body = await readBody(req);
      const result = submitGovernanceVote(body);
      return json(res, 200, result);
    }
    if (url.pathname === "/api/glv/validate" && req.method === "GET") {
      return json(res, 200, runGLV());
    }
    if (url.pathname === "/api/governance/ledger/validate" && req.method === "GET") {
      return json(res, 200, runGLV());
    }
    if (url.pathname === "/api/caic/validate" && req.method === "GET") {
      return json(res, 200, runCAIC());
    }
    if (url.pathname === "/api/rph/reproduce" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, runRPH(body));
    }
    if (url.pathname === "/api/derived/regenerate" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, regenerateDerivedLayer(body));
    }
    if (url.pathname === "/api/proof-graph/visual" && req.method === "GET") {
      return json(res, 200, getProofGraphVisual());
    }
    if (url.pathname === "/api/runtime/status" && req.method === "GET") {
      const payload = await getSubstratePayload();
      const lastReceipt = payload.receipts?.at(-1) ?? null;
      const lastViolation =
        payload.receipts
          ?.slice()
          .reverse()
          .find((r) => (r.laws?.violations ?? []).length > 0) ?? null;
      return json(res, 200, {
        online: true,
        operator: "operator:local",
        capabilities: payload.capabilities?.length ?? 0,
        receipts: payload.receipts?.length ?? 0,
        continuity_events: payload.continuity?.length ?? 0,
        drift_points: payload.drift?.length ?? 0,
        lastReceipt,
        lastViolation: lastViolation
          ? {
              id: lastViolation.id,
              violations: lastViolation.laws?.violations ?? [],
            }
          : null,
      });
    }
    if (url.pathname === "/api/quorum/state" && req.method === "GET") {
      const ledger = getStewardState().ledger;
      const lastRelease = [...ledger].reverse().find((e) => e.decision_type === "release_vote");
      return json(
        res,
        200,
        computeQuorumState({ stewards: loadStewards(), votes: lastRelease?.steward_votes ?? [] }),
      );
    }
    if (url.pathname === "/api/canonical/manifest" && req.method === "GET") {
      return json(res, 200, validateCanonicalManifest());
    }
    if (url.pathname === "/api/canonical/manifest/generate" && req.method === "POST") {
      const manifest = generateCanonicalManifest({ write: true });
      return json(res, 200, { ok: true, manifest });
    }
    if (url.pathname === "/api/release/readiness" && req.method === "GET") {
      const release = url.searchParams.get("release") ?? "v1.0";
      const requireCert = url.searchParams.get("require_certification") === "true";
      return json(res, 200, evaluateReleaseReadiness({ release, require_certification: requireCert }));
    }
    if (url.pathname === "/api/audit/certify" && req.method === "POST") {
      const body = await readBody(req);
      const result = runAuditorCertification(body);
      return json(res, 200, result);
    }

    if (url.pathname === "/api/capability/run" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const { capabilityId, inputs, operator } = body;
        const result = await runGovernedCapability(
          capabilityId,
          inputs ?? {},
          operator ?? "operator:local",
        );
        return json(res, 200, {
          ok: result.ok,
          receipt: result.receipt,
          verdict: result.verdict,
          provenance: result.provenance,
          drift: result.drift,
          continuity: result.continuity,
          violations: result.violations,
        });
      } catch (err) {
        return json(res, 200, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/slice/execute" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const { sliceId, payload, operator } = body;
        const result = await executeGovernedSlice(
          sliceId ?? "nova-slice-1",
          payload ?? {},
          operator ?? "operator:local",
        );
        return json(res, 200, {
          ok: result.ok,
          receipt: result.receipt,
          verdict: result.verdict,
          provenance: result.provenance,
          drift: result.drift,
          continuity: result.continuity,
          violations: result.violations,
        });
      } catch (err) {
        return json(res, 200, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/receipts/index" && req.method === "GET") {
      const ledger = getLedger();
      const receipts = ledger.slice(-50).reverse().map((r) => ({
        id: r.id,
        sliceId: r.slice ?? r.capability,
        capability: r.capability ?? r.slice,
        timestamp: r.timestamp,
        status: r.status,
      }));
      return json(res, 200, receipts);
    }

    if (url.pathname === "/api/continuity/replay" && req.method === "POST") {
      const body = await readBody(req);
      const result = replayContinuityFromCheckpoint(body.checkpoint);
      recordSessionEvent({ kind: "continuity_replay", checkpoint: body.checkpoint });
      return json(res, 200, { ok: true, ...result });
    }

    if (url.pathname === "/api/slice/replay" && req.method === "POST") {
      const body = await readBody(req);
      const result = await replaySlice(body.receiptId);
      return json(res, 200, { ok: true, ...result });
    }

    if (url.pathname === "/api/slice/replay-multi" && req.method === "POST") {
      const body = await readBody(req);
      const results = await replaySlices(body.receiptIds ?? []);
      return json(res, 200, { ok: true, results });
    }

    if (url.pathname === "/api/receipt/diff" && req.method === "POST") {
      const body = await readBody(req);
      const diff = diffReceipts(body.a, body.b);
      return json(res, 200, { ok: true, diff });
    }

    const lineageMatch = url.pathname.match(/^\/api\/receipt\/lineage\/([^/]+)$/);
    if (lineageMatch && req.method === "GET") {
      const tree = buildReceiptLineage(decodeURIComponent(lineageMatch[1]));
      return json(res, 200, { ok: true, tree });
    }

    if (url.pathname === "/api/drift/history" && req.method === "GET") {
      return json(res, 200, { ok: true, history: computeDriftHistory() });
    }

    if (url.pathname === "/api/drift/anomalies" && req.method === "GET") {
      return json(res, 200, { ok: true, anomalies: computeDriftAnomalies() });
    }

    if (url.pathname === "/api/impact" && req.method === "POST") {
      const body = await readBody(req);
      const receipt = getLedger().find((r) => r.id === body.receiptId);
      if (!receipt) return json(res, 404, { ok: false, error: "Receipt not found" });
      const impact = await computeImpact(receipt);
      return json(res, 200, { ok: true, impact });
    }

    if (url.pathname === "/api/governance/impact" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const impact = await computeGovernanceImpact(body.decisionId);
        return json(res, 200, { ok: true, impact });
      } catch (err) {
        return json(res, 200, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/session/replay" && req.method === "GET") {
      return json(res, 200, { ok: true, log: loadSession() });
    }

    const investigateReceiptMatch = url.pathname.match(/^\/api\/investigation\/receipt\/([^/]+)$/);
    if (investigateReceiptMatch && req.method === "GET") {
      try {
        const data = await investigateReceipt(decodeURIComponent(investigateReceiptMatch[1]));
        return json(res, 200, data);
      } catch (err) {
        return json(res, 404, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    const investigateDecisionMatch = url.pathname.match(/^\/api\/investigation\/decision\/([^/]+)$/);
    if (investigateDecisionMatch && req.method === "GET") {
      try {
        const data = await investigateDecision(decodeURIComponent(investigateDecisionMatch[1]));
        return json(res, 200, data);
      } catch (err) {
        return json(res, 404, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    const repoStaticPrefixes = ["/canonical/", "/runtime/", "/conformance/"];
    if (repoStaticPrefixes.some((p) => url.pathname.startsWith(p))) {
      const repoFile = path.join(REPO_ROOT, url.pathname.replace(/^\//, ""));
      if (fs.existsSync(repoFile) && fs.statSync(repoFile).isFile()) {
        return serveStatic(res, repoFile);
      }
    }

    const filePath = resolveStaticFile(url.pathname);
    if (!filePath) {
      return json(res, 403, { error: "Forbidden" });
    }
    return serveStatic(res, filePath);
  } catch (err) {
    return json(res, 500, {
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  if (url.pathname === "/events") {
    handleStudioEventsUpgrade(req, socket, head);
    return;
  }
  socket.destroy();
});

server.listen(PORT, () => {
  const layout = getStaticLayout();
  console.log(`Nova Studio API → http://localhost:${PORT}`);
  console.log(`Static UI: ${layout.kind} (${layout.root})`);
});
