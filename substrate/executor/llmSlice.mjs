import { stableHash } from "../executionEnvelope.mjs";

export async function llmSlice(cap, input = {}) {
  const prompt = String(input.prompt ?? "");
  const model = String(input.model ?? defaultModel());
  const response = await callLlm({
    model,
    prompt,
    messages: normalizeMessages(input.messages, prompt),
    maxTokens: Number(input.max_tokens ?? input.maxTokens ?? 512),
    temperature: Number(input.temperature ?? 0),
  });
  return {
    capabilityId: cap.id,
    provider: response.provider,
    model: response.model,
    promptHash: stableHash({ prompt }),
    text: response.text,
    inputTokens: response.inputTokens ?? 0,
    outputTokens: response.outputTokens ?? 0,
  };
}

async function callLlm({ model, prompt, messages, maxTokens, temperature }) {
  const provider = String(process.env.NOVA_PROVIDER ?? "deterministic").trim().toLowerCase();
  if (provider === "ollama") {
    return callOllama({ model, messages, maxTokens, temperature });
  }
  if (provider === "nova" || provider === "openai" || provider === "openai-compatible") {
    return callOpenAICompatible({ model, messages, maxTokens, temperature });
  }
  if (provider && provider !== "deterministic" && provider !== "stub") {
    throw new Error(`unsupported NOVA_PROVIDER: ${provider}`);
  }
  return {
    provider: "deterministic",
    model,
    text: `LLM(${model}) says: ${prompt}`,
    inputTokens: tokenEstimate(prompt),
    outputTokens: tokenEstimate(prompt) + 2,
  };
}

async function callOllama({ model, messages, maxTokens, temperature }) {
  const baseUrl = String(process.env.NOVA_OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "");
  const body = await postJson(`${baseUrl}/api/chat`, {
    model,
    messages,
    stream: false,
    options: {
      num_predict: maxTokens,
      temperature,
    },
  });
  return {
    provider: "ollama",
    model: String(body.model ?? model),
    text: String(body.message?.content ?? ""),
    inputTokens: Number(body.prompt_eval_count ?? 0),
    outputTokens: Number(body.eval_count ?? 0),
  };
}

async function callOpenAICompatible({ model, messages, maxTokens, temperature }) {
  const baseUrl = String(
    process.env.NOVA_OPENAI_BASE_URL ?? process.env.NOVA_BASE_URL ?? "http://127.0.0.1:18081/v1",
  ).replace(/\/$/, "");
  const headers = {};
  const apiKey = process.env.NOVA_OPENAI_API_KEY ?? process.env.NOVA_API_KEY;
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const body = await postJson(`${baseUrl}/chat/completions`, {
    model,
    messages,
    stream: false,
    max_tokens: maxTokens,
    temperature,
  }, headers);
  const choice = body.choices?.[0];
  return {
    provider: "openai-compatible",
    model: String(body.model ?? model),
    text: String(choice?.message?.content ?? choice?.text ?? ""),
    inputTokens: Number(body.usage?.prompt_tokens ?? 0),
    outputTokens: Number(body.usage?.completion_tokens ?? 0),
  };
}

async function postJson(url, payload, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`LLM provider HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

function normalizeMessages(messages, prompt) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages.map((m) => ({
      role: String(m.role ?? "user"),
      content: String(m.content ?? ""),
    }));
  }
  return [{ role: "user", content: prompt }];
}

function defaultModel() {
  return process.env.NOVA_OLLAMA_MODEL
    ?? process.env.NOVA_OPENAI_MODEL
    ?? "qwen2.5-coder:7b";
}

function tokenEstimate(text) {
  return String(text ?? "").trim().split(/\s+/).filter(Boolean).length;
}
