import { evaluateIntent } from "./lawKernel.js";
import {
  appendGovernedReceipt,
  createLLMAdapter,
} from "../runtime/boot.js";

export async function routeIntent(intent) {
  const lawsResult = evaluateIntent(intent);
  const slice = intent?.type ?? "analysis";

  if (!lawsResult.allowed) {
    const output = {
      error: "Intent rejected by Law Kernel",
      violations: lawsResult.violations,
    };
    const receipt = await appendGovernedReceipt(intent, output, lawsResult, {
      slice,
    });
    return { output, receipt };
  }

  const llm = createLLMAdapter(lawsResult);
  const { output, receipt } = await llm.ask(intent.prompt, {
    sliceId: slice,
    actor: "skillz",
    intent,
  });

  return { output, receipt };
}
