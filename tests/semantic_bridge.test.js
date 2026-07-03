import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TSX = path.join(ROOT, "node_modules/tsx/dist/cli.mjs");

function runBridge(script) {
  return spawnSync(process.execPath, [TSX, "-e", script], {
    cwd: ROOT,
    encoding: "utf8",
  });
}

test("semantic bridge classifies normative messages", () => {
  const result = runBridge(`
    import { classifyMessage } from './src/semantic-bridge/classify.ts';
    console.log(classifyMessage('This invariant must hold in the law kernel.'));
  `);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), "normative");
});

test("semantic bridge normalizes Jon to Dar-Z canonical form", () => {
  const result = runBridge(`
    import { normalizeMessage } from './src/semantic-bridge/normalizeMessage.ts';
    const msg = normalizeMessage(
      'I unified the audit log and evidence ledger into one chain.\\nThis resolves the double-truth problem.',
      'jon->darz'
    );
    console.log(JSON.stringify({
      category: msg.category,
      coreClaim: msg.coreClaim,
      impact: msg.impact,
      ask: msg.ask,
      altitude: msg.altitude,
    }));
  `);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout.trim());
  assert.ok(parsed.coreClaim.includes("unified"));
  assert.equal(parsed.ask, "review");
});

test("semantic bridge translateJonToDarz emits Dar-Z friendly body", () => {
  const result = runBridge(`
    import { normalizeMessage } from './src/semantic-bridge/normalizeMessage.ts';
    import { translateJonToDarz } from './src/semantic-bridge/translate.ts';
    const msg = normalizeMessage('Need eyes today on the binding addendum spec change.', 'jon->darz');
    const t = translateJonToDarz(msg);
    console.log(JSON.stringify({ hasCategory: t.body.includes('[Category:'), latency: msg.latency }));
  `);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout.trim());
  assert.equal(parsed.hasCategory, true);
  assert.equal(parsed.latency, "now");
});

test("semantic bridge B4 flags spec changes without spec impact", () => {
  const result = runBridge(`
    import { normalizeMessage } from './src/semantic-bridge/normalizeMessage.ts';
    import { validateBridgeInvariants } from './src/semantic-bridge/invariants.ts';
    const msg = normalizeMessage('Update the binding addendum invariant.', 'jon->darz', { impact: 'repo' });
    const v = validateBridgeInvariants(msg);
    console.log(JSON.stringify(v.map(x => x.id)));
  `);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const ids = JSON.parse(result.stdout.trim());
  assert.ok(ids.includes("B4"));
});

test("semantic bridge API normalize handler", async () => {
  const { handleSemanticBridgeNormalize } = await import(
    "../nova-studio/server/runtime/semanticBridge.mjs"
  );
  const out = await handleSemanticBridgeNormalize({
    rawText: "Here's the stack diagram for the unified ledger interface.",
    direction: "jon->darz",
  });
  assert.equal(out.ok, true);
  assert.equal(out.message.category, "architectural");
  assert.ok(out.translation.includes("Core:"));
});

test("Dar-Z to Jon classifies normative specification input", () => {
  const result = runBridge(`
    import { normalizeMessage } from './src/semantic-bridge/normalizeMessage.ts';
    import { translateDarzToJon } from './src/semantic-bridge/translate.ts';
    const msg = normalizeMessage(
      'This invariant is a governance constraint. Update the binding addendum spec.',
      'darz->jon'
    );
    const t = translateDarzToJon(msg);
    console.log(JSON.stringify({
      category: msg.category,
      normativeImpact: msg.normativeImpact,
      repoTargets: msg.repositoryTargets,
      hasRead: t.jonReply.includes('**Read**'),
      hasCanonical: t.canonical.includes('Normative Impact'),
    }));
  `);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout.trim());
  assert.equal(parsed.category, "normative");
  assert.equal(parsed.normativeImpact, "spec");
  assert.ok(parsed.repoTargets.includes("specification"));
  assert.equal(parsed.hasRead, true);
  assert.equal(parsed.hasCanonical, true);
});

test("Dar-Z to Jon human context skips repo work", () => {
  const result = runBridge(`
    import { normalizeMessage } from './src/semantic-bridge/normalizeMessage.ts';
    import { translateDarzToJon } from './src/semantic-bridge/translate.ts';
    const msg = normalizeMessage('I am tired and venting a bit. No rush.', 'darz->jon');
    const t = translateDarzToJon(msg);
    console.log(JSON.stringify({
      category: msg.category,
      action: msg.requiredAction,
      reply: t.jonReply.includes('No action'),
    }));
  `);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout.trim());
  assert.equal(parsed.category, "human");
  assert.equal(parsed.action, "none");
  assert.equal(parsed.reply, true);
});

test("Dar-Z to Jon API returns canonical and jonReply", async () => {
  const { handleSemanticBridgeNormalize } = await import(
    "../nova-studio/server/runtime/semanticBridge.mjs"
  );
  const out = await handleSemanticBridgeNormalize({
    rawText: "Wire the conformance tests for MRI and Nova Studio UI.",
    direction: "darz->jon",
  });
  assert.equal(out.ok, true);
  assert.equal(out.message.category, "implementation");
  assert.ok(out.canonical);
  assert.ok(out.darzTranslation.jonReply.includes("**My move**"));
});

test("communicationTick ledger append", async () => {
  const { appendCommunicationTick } = await import(
    "../nova-studio/server/runtime/communicationLedger.mjs"
  );
  const record = appendCommunicationTick({
    entry_type: "communicationTick",
    lane_id: "jon-darz-architecture",
    direction: "darz->jon",
    category: "normative",
    core_claim: "New invariant",
    impact: "spec",
    required_action: "respond",
    targets: [],
    altitude: "constitutional",
    latency: "whenever",
  });
  assert.ok(record.id.startsWith("CT-"));
  assert.equal(record.entry_type, "communicationTick");
});

test("communicationTick rejects invalid entry_type", async () => {
  const { appendCommunicationTick } = await import(
    "../nova-studio/server/runtime/communicationLedger.mjs"
  );
  assert.throws(
    () =>
      appendCommunicationTick({
        entry_type: "zoneTick",
        direction: "darz->jon",
        category: "normative",
        core_claim: "x",
      }),
    /Invalid communicationTick/,
  );
});

test("assistant refine endpoint", async () => {
  const { handleAssistantRefine } = await import("../nova-studio/server/runtime/assistant.mjs");
  const out = await handleAssistantRefine({
    lane_id: "jon-darz-architecture",
    normalized: {
      category: "architectural",
      altitude: "engineering",
      requiredAction: "review",
      latency: "whenever",
    },
    draft: "Core draft",
  });
  assert.ok(out.refined?.includes("structural refinement") || out.blocked);
});
