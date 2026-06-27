import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { register } from "tsx/esm/api";

register();

const { classifyMessage, normalizeMessage, generateReply } = await import(
  "../src/runtime/semanticBridge.js"
);

describe("Semantic Bridge", () => {
  test("classifies normative messages", () => {
    assert.equal(classifyMessage("This invariant must hold"), "normative");
  });

  test("classifies architectural messages", () => {
    assert.equal(classifyMessage("The interface boundary changes here"), "architectural");
  });

  test("normalizes a message", () => {
    const result = normalizeMessage("Spec change: new invariant added", "jon->darz");

    assert.equal(result.category, "normative");
    assert.ok(result.coreClaim.includes("Spec change"));
    assert.equal(result.impact, "spec");
    assert.equal(result.requiredAction, "review");
  });

  test("generateReply produces structured outbound text", () => {
    const result = normalizeMessage("Spec change: new invariant added", "jon->darz");
    const reply = generateReply(result);
    assert.ok(reply.includes("[NORMATIVE]"));
    assert.ok(reply.includes("Core:"));
    assert.ok(reply.includes("Impact: spec"));
  });

  test("generateReply uses Jon voice for Dar-Z inbound", () => {
    const result = normalizeMessage(
      "Wire conformance tests for Nova Studio UI.",
      "darz->jon",
    );
    const reply = generateReply(result);
    assert.ok(reply.includes("Acknowledged") || reply.includes("**Read**"));
  });

  test("refineReply adds category opener and bandwidth signal", async () => {
    const { refineReply } = await import("../src/runtime/replyAssistant.js");
    const normalized = normalizeMessage("New invariant for the law kernel.", "jon->darz");
    const refined = refineReply(normalized, "Core draft line.");
    assert.ok(refined.includes("constitutional change"));
    assert.ok(refined.includes("Latency:"));
  });
});
