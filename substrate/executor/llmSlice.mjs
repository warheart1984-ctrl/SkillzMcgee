import { stableHash } from "../executionEnvelope.mjs";

export async function llmSlice(cap, input = {}) {
  const prompt = String(input.prompt ?? "");
  const model = String(input.model ?? "default-llm");
  const text = await callLlm(model, prompt);
  return {
    capabilityId: cap.id,
    model,
    promptHash: stableHash({ prompt }),
    text,
  };
}

async function callLlm(model, prompt) {
  return `LLM(${model}) says: ${prompt}`;
}
