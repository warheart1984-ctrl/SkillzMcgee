const DEFAULT_NODE_BASE_URL = "http://127.0.0.1:8080";

export function getNodeBaseUrl() {
  return (process.env.NOVA_NODE_BASE_URL ?? DEFAULT_NODE_BASE_URL).replace(/\/+$/, "");
}

export async function getNodeStatus() {
  return nodeRequest("/node/status");
}

export async function getNodeReceipts() {
  return nodeRequest("/node/receipts");
}

export async function getNodeLedger() {
  return nodeRequest("/node/ledger");
}

export async function getNodeContinuity() {
  return nodeRequest("/node/continuity");
}

export async function getNodePolicy() {
  return nodeRequest("/node/policy");
}

export async function getNodeMesh() {
  return nodeRequest("/node/mesh");
}

export async function getNodeAlerts() {
  return nodeRequest("/node/alerts");
}

export async function getNodeHello() {
  return nodeRequest("/node/hello", { method: "POST" });
}

export async function submitNodeTask(packet) {
  return nodeRequest("/node/submit", {
    method: "POST",
    body: packet,
  });
}

export async function getNodeResult(traceId) {
  return nodeRequest(`/node/result/${encodeURIComponent(traceId)}`);
}

export async function replayNodeTrace(traceId) {
  return nodeRequest(`/node/replay/${encodeURIComponent(traceId)}`, { method: "POST" });
}

async function nodeRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (process.env.NOVA_API_KEY) {
    headers.Authorization = `Bearer ${process.env.NOVA_API_KEY}`;
  }
  const response = await fetch(`${getNodeBaseUrl()}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const message = data?.error?.reason ?? data?.error?.message ?? data?.detail ?? response.statusText;
    return {
      ok: false,
      status: response.status,
      error: message,
      upstream: data,
    };
  }
  return data;
}
