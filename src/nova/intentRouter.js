import { evaluateIntent } from "./lawKernel.js";
import { createReceipt } from "./receipts.js";
import { callFreeLLM } from "../runtime/webRuntime.js";

export async function routeIntent(intent) {
  const lawsResult = evaluateIntent(intent);

  if (!lawsResult.allowed) {
    const output = {
      error: "Intent rejected by Law Kernel",
      violations: lawsResult.violations
    };
    return createReceipt({ intent, output, lawsResult });
  }

  const llmOutput = await callFreeLLM(intent.prompt);
  return createReceipt({ intent, output: llmOutput, lawsResult });
}
