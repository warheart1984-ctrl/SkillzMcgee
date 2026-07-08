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
import {
  appendSemanticBridgeLog,
  handleSemanticBridgeNormalize,
  listSemanticBridgeLog,
} from "./runtime/semanticBridge.mjs";
import {
  appendCommunicationTick,
  listCommunicationTicks,
} from "./runtime/communicationLedger.mjs";
import {
  appendCommunicationGovernanceTick,
  approveAmendment,
  analyzeAmendmentImpact,
  getConstitutionVersion,
  getLaneContext,
  listLanes,
  loadConstitution,
  proposeAmendment,
  resumeLane,
} from "./runtime/communicationGovernance.mjs";
import { getEnrichedLaneContext } from "./runtime/communicationLaneContext.mjs";
import {
  activateCommunicationKillSwitch,
  deactivateCommunicationKillSwitch,
  getKillSwitchState,
  guardCommunicationIO,
} from "./runtime/communicationControl.mjs";
import {
  getContinuityFoldState,
  computeContinuityMetrics,
  evaluateContinuity,
} from "./runtime/continuityFold.mjs";
import {
  closeEpoch,
  listEpochs,
  getEpochBudgetSummary,
} from "./runtime/communicationEpochs.mjs";
import {
  canGenerateReply,
  listRerouteEvents,
} from "./runtime/communicationEnforcement.mjs";
import { splitLane, mergeLanes, getLaneTopology } from "./runtime/communicationTopology.mjs";
import {
  diffCommunicationCanon,
  generateCommunicationCanon,
  getCommunicationCanon,
  readCommunicationCanonMarkdown,
  readParsedCommunicationCanon,
  regenerateCommunicationCanon,
  writeCommunicationCanon,
  freezeCommunicationCanon,
  getCanonFreezeState,
  isCanonFrozen,
} from "./runtime/communicationCanon.mjs";
import { runCrossLaneInvariants, getCrossLaneInvariantRegistry } from "./runtime/communicationInvariants.mjs";
import {
  broadcastDiscordMessage,
  getDiscordBridgeClientCount,
  handleDiscordWebSocketUpgrade,
} from "./runtime/discordBridge.mjs";
import { handleAssistantRefine } from "./runtime/assistant.mjs";
import {
  getNodeAlerts,
  getNodeContinuity,
  getNodeLedger,
  getNodeHello,
  getNodeMesh,
  getNodePolicy,
  getNodeReceipts,
  getNodeResult,
  getNodeStatus,
  replayNodeTrace,
  submitNodeTask,
} from "./runtime/nodeClient.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STUDIO_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(STUDIO_DIR, "..");
const COR_INFI_OUT = path.resolve(REPO_ROOT, "../project-infi/cor-suite/out");
const COR_INFI_CAR = path.resolve(REPO_ROOT, "../project-infi/cor-suite/car");
const COR_ARTIFACT_ALLOWLIST = new Set([
  "cor-state.json",
  "proof-analysis.json",
  "governance-receipt.json",
  "maturity-vector.json",
  "repo-hygiene-status.json",
  "cav-validation.json",
  "cav-report.json",
  "pgi-1.0.json",
  "dra-report.json",
  "csr-report.json",
  "car-1.0.json",
]);
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
    if (url.pathname.startsWith("/api/cor/artifact/") && req.method === "GET") {
      const name = decodeURIComponent(url.pathname.slice("/api/cor/artifact/".length));
      if (!COR_ARTIFACT_ALLOWLIST.has(name)) {
        return json(res, 404, { error: "unknown cor artifact" });
      }
      const filePath = name === "car-1.0.json"
        ? path.join(COR_INFI_CAR, name)
        : path.join(COR_INFI_OUT, name);
      if (!fs.existsSync(filePath)) {
        return json(res, 404, {
          error: "cor artifact not found — run pipeline in project-infi/cor-suite",
          path: filePath,
        });
      }
      return json(res, 200, JSON.parse(fs.readFileSync(filePath, "utf8")));
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
    if (url.pathname === "/api/node/status" && req.method === "GET") {
      return json(res, 200, await getNodeStatus());
    }
    if (url.pathname === "/api/node/receipts" && req.method === "GET") {
      return json(res, 200, await getNodeReceipts());
    }
    if (url.pathname === "/api/node/ledger" && req.method === "GET") {
      return json(res, 200, await getNodeLedger());
    }
    if (url.pathname === "/api/node/continuity" && req.method === "GET") {
      return json(res, 200, await getNodeContinuity());
    }
    if (url.pathname === "/api/node/policy" && req.method === "GET") {
      return json(res, 200, await getNodePolicy());
    }
    if (url.pathname === "/api/node/mesh" && req.method === "GET") {
      return json(res, 200, await getNodeMesh());
    }
    if (url.pathname === "/api/node/alerts" && req.method === "GET") {
      return json(res, 200, await getNodeAlerts());
    }
    if (url.pathname === "/api/node/submit" && req.method === "POST") {
      const body = await readBody(req);
      return json(res, 200, await submitNodeTask(body));
    }
    if (url.pathname === "/api/node/hello" && req.method === "POST") {
      return json(res, 200, await getNodeHello());
    }
    const nodeResultMatch = url.pathname.match(/^\/api\/node\/result\/([^/]+)$/);
    if (nodeResultMatch && req.method === "GET") {
      return json(res, 200, await getNodeResult(decodeURIComponent(nodeResultMatch[1])));
    }
    const nodeReplayMatch = url.pathname.match(/^\/api\/node\/replay\/([^/]+)$/);
    if (nodeReplayMatch && req.method === "POST") {
      return json(res, 200, await replayNodeTrace(decodeURIComponent(nodeReplayMatch[1])));
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

    if (url.pathname === "/api/assistant/refine" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const result = await handleAssistantRefine(body);
        return json(res, 200, { ok: true, ...result });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/semantic-bridge/normalize" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const result = await handleSemanticBridgeNormalize(body);
        return json(res, 200, result);
      } catch (err) {
        return json(res, 200, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/ledger/communication" && req.method === "POST") {
      try {
        const body = await readBody(req);
        if (!body.entry_type) {
          body.entry_type = "communicationTick";
        }
        const governanceOverride =
          req.headers["x-communication-governance-override"] === "true";
        const record = appendCommunicationTick(body, {
          active_lane_id: body.lane_id,
          governance_override: governanceOverride,
          governance_receipt_id: body.governance_receipt_id,
        });
        return json(res, 200, {
          ok: true,
          status: "ok",
          id: record.id,
          tick: record,
          corridor_status: record.corridor_status,
          drift_violations: record.drift_violations,
        });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/ledger/communication" && req.method === "GET") {
      try {
        const laneId = url.searchParams.get("lane_id");
        const governanceOverride =
          url.searchParams.get("governance_override") === "true" ||
          req.headers["x-communication-governance-override"] === "true";
        const limit = Number(url.searchParams.get("limit") ?? 50);
        const ticks = listCommunicationTicks(limit, {
          laneId,
          governanceOverride,
        });
        return json(res, 200, {
          ok: true,
          lane_id: laneId,
          comm_constitution_version: getConstitutionVersion(),
          ticks,
        });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/ledger/communication/replay" && req.method === "GET") {
      try {
        const laneId = url.searchParams.get("lane_id");
        const governanceOverride =
          url.searchParams.get("governance_override") === "true" ||
          req.headers["x-communication-governance-override"] === "true";
        const limit = Number(url.searchParams.get("limit") ?? 200);
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");
        const category = url.searchParams.get("category");
        const direction = url.searchParams.get("direction");
        const impact = url.searchParams.get("impact");
        const ticks = listCommunicationTicks(limit, {
          laneId,
          governanceOverride,
        }).filter((tick) => {
          const at = tick.timestamp ? Date.parse(tick.timestamp) : 0;
          if (from && at < Date.parse(from)) return false;
          if (to && at > Date.parse(to)) return false;
          if (category && tick.category !== category) return false;
          if (direction && tick.direction !== direction) return false;
          if (impact && tick.impact !== impact) return false;
          return true;
        });
        return json(res, 200, {
          ok: true,
          replay: true,
          lane_id: laneId,
          comm_constitution_version: getConstitutionVersion(),
          ticks,
        });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/ledger/communication/governance" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const tick = appendCommunicationGovernanceTick(body);
        return json(res, 200, { ok: true, status: "ok", tick });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/communication/lanes" && req.method === "GET") {
      return json(res, 200, {
        ok: true,
        comm_constitution_version: getConstitutionVersion(),
        lanes: listLanes(),
      });
    }

    const laneMatch = url.pathname.match(/^\/api\/communication\/lanes\/([^/]+)$/);
    if (laneMatch && req.method === "GET") {
      const ctx = getEnrichedLaneContext(decodeURIComponent(laneMatch[1]));
      if (!ctx) {
        return json(res, 404, { ok: false, error: "Lane not found" });
      }
      return json(res, 200, { ok: true, lane: ctx });
    }

    if (url.pathname === "/api/communication/state" && req.method === "GET") {
      const lanes = listLanes().map((lane) => (
        getEnrichedLaneContext(lane.lane_id) ?? getLaneContext(lane.lane_id) ?? lane
      ));
      return json(res, 200, {
        ok: true,
        comm_constitution_version: getConstitutionVersion(),
        canon: getCanonFreezeState(),
        lanes,
        epochs: listEpochs(),
        continuity: getContinuityFoldState(),
        kill_switch: getKillSwitchState(),
        topology: getLaneTopology(),
        invariant_registry: getCrossLaneInvariantRegistry(),
        reroutes: listRerouteEvents(null, 50),
      });
    }

    if (url.pathname === "/api/communication/continuity" && req.method === "GET") {
      return json(res, 200, { ok: true, ...getContinuityFoldState() });
    }

    if (url.pathname === "/api/metrics/communication/drift" && req.method === "GET") {
      const fold = getContinuityFoldState();
      return json(res, 200, {
        ok: true,
        communication_drift: fold.metrics.communication_drift,
        budget_pressure: fold.metrics.budget_pressure,
        continuity_score: fold.metrics.continuity_score,
        trigger: fold.metrics.trigger,
        drift_vector: fold.metrics.drift_vector,
        evaluation: fold.evaluation,
      });
    }

    if (url.pathname === "/api/communication/kill-switch" && req.method === "GET") {
      return json(res, 200, { ok: true, ...getKillSwitchState() });
    }

    if (url.pathname === "/api/communication/kill-switch" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const result = body.active
          ? activateCommunicationKillSwitch(body.operator_id, body.rationale)
          : deactivateCommunicationKillSwitch(body.operator_id, body.rationale);
        return json(res, 200, { ok: true, ...result });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/kill-switch/activate" && req.method === "POST") {
      try {
        const body = await readBody(req);
        return json(res, 200, { ok: true, ...activateCommunicationKillSwitch(body.operator_id, body.rationale) });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/kill-switch/deactivate" && req.method === "POST") {
      try {
        const body = await readBody(req);
        return json(res, 200, { ok: true, ...deactivateCommunicationKillSwitch(body.operator_id, body.rationale) });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/epochs" && req.method === "GET") {
      const laneId = url.searchParams.get("lane_id");
      return json(res, 200, { ok: true, epochs: listEpochs(laneId ? { lane_id: laneId } : {}) });
    }

    if (url.pathname.match(/^\/api\/communication\/epochs\/[^/]+\/close$/) && req.method === "POST") {
      try {
        const laneId = decodeURIComponent(url.pathname.split("/")[4]);
        const body = await readBody(req);
        const closed = closeEpoch(laneId, body.operator_id);
        return json(res, 200, { ok: true, epoch: closed });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/epoch/close" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const laneId = body.lane_id ?? body.epoch_id;
        const closed = closeEpoch(laneId, body.operator_id);
        return json(res, 200, { ok: true, epoch: closed });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/reply-guard" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const lane = getLaneContext(body.lane_id);
        if (!lane) return json(res, 404, { ok: false, error: "Lane not found" });
        const fullLane = { ...loadConstitution().lanes.find((l) => l.lane_id === body.lane_id), ...lane };
        const result = canGenerateReply(fullLane, body.current_drift, body.proposed);
        return json(res, 200, { ok: true, ...result });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/topology/split" && req.method === "POST") {
      try {
        const body = await readBody(req);
        return json(res, 200, { ok: true, tick: splitLane(body) });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/lane/split" && req.method === "POST") {
      try {
        const body = await readBody(req);
        return json(res, 200, { ok: true, tick: splitLane(body) });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/topology/merge" && req.method === "POST") {
      try {
        const body = await readBody(req);
        return json(res, 200, { ok: true, tick: mergeLanes(body) });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/lane/merge" && req.method === "POST") {
      try {
        const body = await readBody(req);
        return json(res, 200, { ok: true, tick: mergeLanes(body) });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/topology" && req.method === "GET") {
      return json(res, 200, { ok: true, topology: getLaneTopology() });
    }

    if (url.pathname === "/api/communication/invariants" && req.method === "GET") {
      const run = url.searchParams.get("run") === "true";
      return json(res, 200, {
        ok: true,
        registry: getCrossLaneInvariantRegistry(),
        results: run ? runCrossLaneInvariants() : undefined,
      });
    }

    if (url.pathname === "/api/communication/canon/parsed" && req.method === "GET") {
      const regen = url.searchParams.get("regenerate") === "true";
      if (regen) await writeCommunicationCanon();
      return json(res, 200, { ok: true, parsed: readParsedCommunicationCanon(), freeze: getCanonFreezeState() });
    }

    if (url.pathname === "/api/communication/canon/diff" && req.method === "GET") {
      const regen = url.searchParams.get("regenerate") === "true";
      const diff = diffCommunicationCanon(regen);
      return json(res, 200, { ok: true, ...diff, freeze: getCanonFreezeState() });
    }

    if (url.pathname === "/api/communication/canon/freeze" && req.method === "GET") {
      return json(res, 200, { ok: true, ...getCanonFreezeState() });
    }

    if (url.pathname === "/api/communication/canon/freeze" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const result = await freezeCommunicationCanon(
          body.operator_id ?? "jon",
          body.canon_version ?? "1.0.0",
        );
        return json(res, 200, {
          ok: true,
          freezeTick: result.freezeTick,
          freezeState: result.freezeState,
          hash: result.hash,
          baseline_id: result.baseline_id,
        });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/canon" && req.method === "GET") {
      const regen = url.searchParams.get("regenerate") === "true";
      const format = url.searchParams.get("format") ?? "json";

      if (regen) await regenerateCommunicationCanon();

      if (format === "md" || format === "markdown") {
        const md = readCommunicationCanonMarkdown();
        res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8" });
        res.end(md);
        return;
      }

      return json(res, 200, {
        ok: true,
        canon: getCommunicationCanon(),
        markdown: readCommunicationCanonMarkdown(),
        freeze: getCanonFreezeState(),
      });
    }

    if (url.pathname === "/api/communication/canon/write" && req.method === "POST") {
      try {
        const result = await writeCommunicationCanon();
        return json(res, 200, {
          ok: true,
          version: result.data.version,
          sections: Object.keys(result.parsed),
          archived_path: result.archived_path,
        });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/reroutes" && req.method === "GET") {
      const laneId = url.searchParams.get("lane_id");
      return json(res, 200, { ok: true, reroutes: listRerouteEvents(laneId, 50) });
    }

    if (url.pathname === "/api/communication/containment/resolve" && req.method === "POST") {
      try {
        const body = await readBody(req);
        let receipt;
        if (body.action === "resume" && body.lane_id) {
          receipt = resumeLane(body.lane_id, body.operator_id, body.rationale);
        } else {
          const { appendCommunicationGovernanceTick } = await import("./runtime/communicationGovernance.mjs");
          receipt = appendCommunicationGovernanceTick({
            decision_type: body.action ?? "correct",
            communication_id: body.tick_id,
            rationale: body.rationale,
            operator_id: body.operator_id ?? "operator:local",
            affected_lanes: body.lane_id ? [body.lane_id] : [],
          });
        }
        return json(res, 200, { ok: true, receipt });
      } catch (err) {
        return json(res, 400, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    }

    if (url.pathname === "/api/communication/constitution" && req.method === "GET") {
      return json(res, 200, {
        ok: true,
        constitution: loadConstitution(),
      });
    }

    if (url.pathname === "/api/communication/amendments/propose" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const proposal = proposeAmendment(body);
        const impact = analyzeAmendmentImpact({
          proposal_id: proposal.id,
          affected_lanes: body.affected_lanes,
          operator: body.operator,
        });
        return json(res, 200, { ok: true, proposal, impact });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/communication/amendments/approve" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const approval = approveAmendment(body);
        return json(res, 200, { ok: true, approval });
      } catch (err) {
        return json(res, 400, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/discord/ingest" && req.method === "POST") {
      try {
        guardCommunicationIO();
        const body = await readBody(req);
        const result = broadcastDiscordMessage(body);
        return json(res, 200, { ok: true, ...result });
      } catch (err) {
        return json(res, 500, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/discord/status" && req.method === "GET") {
      return json(res, 200, {
        ok: true,
        clients: getDiscordBridgeClientCount(),
      });
    }

    if (url.pathname === "/api/semantic-bridge/log" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const record = appendSemanticBridgeLog({
          message: body.message,
          translation: body.translation,
        });
        return json(res, 200, { ok: true, id: record.id, record });
      } catch (err) {
        return json(res, 200, {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    if (url.pathname === "/api/semantic-bridge/log" && req.method === "GET") {
      const limit = Number(url.searchParams.get("limit") ?? 50);
      return json(res, 200, { ok: true, entries: listSemanticBridgeLog(limit) });
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
  if (url.pathname === "/ws/discord") {
    handleDiscordWebSocketUpgrade(req, socket, head);
    return;
  }
  socket.destroy();
});

server.listen(PORT, () => {
  const layout = getStaticLayout();
  console.log(`Nova Studio API → http://localhost:${PORT}`);
  console.log(`Static UI: ${layout.kind} (${layout.root})`);
});
