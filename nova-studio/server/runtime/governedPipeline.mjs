/**
 * Governed pipeline: Intent → Plan → Reasoning → Capabilities → Receipts
 */

import {
  appendReceipt,
  logEvent,
  WORKSPACE_DIR,
} from "./studioRuntime.mjs";
import { executeCapability } from "./capabilities.mjs";

/**
 * @param {{ prompt: string, code?: string, actor?: string }} input
 */
export async function runGovernedPipeline(input) {
  const prompt = input.prompt?.trim();
  if (!prompt) throw new Error("Prompt required");

  const intent = { type: "governed_action", prompt, confidence: 0.4 };
  logEvent("intent_received", { prompt: prompt.slice(0, 120) });

  const intentReceipt = appendReceipt({
    slice: "nova",
    intent,
    output: { accepted: true },
    phase: "intent",
    laws: { allowed: true, violations: [] },
  });

  const plan = buildPlan(prompt, input.code);
  logEvent("plan_generated", { steps: plan.steps.length });
  const planReceipt = appendReceipt({
    slice: "nova",
    intent: { type: "plan", parentIntent: intent },
    output: plan,
    phase: "plan",
    parentId: intentReceipt.id,
    laws: { allowed: true, violations: [] },
  });

  const reasoning = buildReasoning(prompt, plan);
  logEvent("reasoning_complete", { steps: reasoning.length });
  const reasoningReceipt = appendReceipt({
    slice: "nova",
    intent: { type: "reasoning", planId: planReceipt.id },
    output: reasoning,
    phase: "reasoning",
    parentId: planReceipt.id,
    laws: { allowed: true, violations: [] },
  });

  /** @type {import("./types.js").StudioReceipt[]} */
  const capabilityReceipts = [];
  /** @type {object[]} */
  const capabilityResults = [];

  for (const step of plan.capabilitySteps) {
    const result = await executeCapability(step.name, step.args);
    const receipt = appendReceipt({
      slice: "nova",
      intent: { type: "capability", name: step.name, args: step.args },
      output: result.output,
      status: result.ok ? "ok" : "error",
      phase: "capability",
      capability: step.name,
      parentId: reasoningReceipt.id,
      laws: result.ok
        ? { allowed: true, violations: [] }
        : { allowed: false, violations: [result.error ?? "CAPABILITY_FAIL"] },
    });
    capabilityReceipts.push(receipt);
    capabilityResults.push({
      capability: step.name,
      target: step.args?.path ?? step.args?.prompt?.slice?.(0, 40) ?? "—",
      status: result.ok ? "ok" : "error",
      receiptId: receipt.id,
    });
    logEvent("capability_call", {
      name: step.name,
      receiptId: receipt.id,
      ok: result.ok,
    });
  }

  const finalOutput = synthesizeOutput(prompt, plan, capabilityResults);
  const finalReceipt = appendReceipt({
    slice: "nova",
    intent,
    output: finalOutput,
    phase: "complete",
    parentId: capabilityReceipts.at(-1)?.id ?? reasoningReceipt.id,
    laws: { allowed: true, violations: [] },
  });

  return {
    output: finalOutput,
    pipeline: {
      intent: intentReceipt,
      plan: planReceipt,
      reasoning: reasoningReceipt,
      capabilities: capabilityReceipts,
      final: finalReceipt,
    },
    capabilityTable: capabilityResults,
    reasoningCorridor: ["Intent", "Plan", "Reasoning", "Capabilities", "Receipts"].map((label, i) => ({
      step: label,
      active: true,
      index: i,
    })),
  };
}

function buildPlan(prompt, code) {
  const steps = [
    { id: 1, action: "parse_intent", description: "Parse operator intent from prompt" },
    { id: 2, action: "assess_workspace", description: "Inspect governed workspace context" },
    { id: 3, action: "execute_capabilities", description: "Run capability calls under law spine" },
    { id: 4, action: "finalize_receipt", description: "Seal governed run with continuity receipt" },
  ];

  const capabilitySteps = [];
  const lower = prompt.toLowerCase();

  if (lower.includes("read") || lower.includes("show") || lower.includes("open")) {
    capabilitySteps.push({
      name: "read_file",
      args: { path: "organism.py" },
    });
  }
  if (lower.includes("write") || lower.includes("save") || lower.includes("update")) {
    capabilitySteps.push({
      name: "write_file",
      args: {
        path: "organism.py",
        content: code ?? defaultOrganismPy(),
      },
    });
  }
  if (lower.includes("list") || lower.includes("files")) {
    capabilitySteps.push({ name: "list_dir", args: { path: "." } });
  }
  if (capabilitySteps.length === 0) {
    capabilitySteps.push({
      name: "read_file",
      args: { path: "organism.py" },
    });
  }

  return { steps, capabilitySteps, workspace: WORKSPACE_DIR };
}

function buildReasoning(prompt, plan) {
  return plan.steps.map((s, i) => ({
    order: i + 1,
    thought: `${s.description} for: "${prompt.slice(0, 80)}"`,
    action: s.action,
  }));
}

function synthesizeOutput(prompt, plan, capabilityResults) {
  const caps = capabilityResults.map((c) => `${c.capability} → ${c.receiptId}`).join("; ");
  return `Governed run complete for: ${prompt}\nCapabilities: ${caps || "none"}\nWorkspace: ${plan.workspace}`;
}

function defaultOrganismPy() {
  return `def governed_action(intent):
    plan = nova.generate_plan(intent)
    for step in plan.steps:
        reasoning = nova.reason(step)
        result = nova.call_capability(step)
        nova.finalize_receipt(result)
    return plan
`;
}
