/**
 * Slice capability registry — shared by Codex runtime and substrate state.
 */
export const SLICE_CAPABILITIES = [
  {
    id: "read_file",
    kind: "read",
    path: "workspace/*",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string" } },
      required: ["path"],
    },
    outputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
        bytes: { type: "number" },
      },
    },
  },
  {
    id: "write_file",
    kind: "write",
    path: "workspace/*",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
    outputSchema: {
      type: "object",
      properties: { path: { type: "string" }, written: { type: "boolean" } },
    },
  },
  {
    id: "list_dir",
    kind: "list_dir",
    path: "workspace/*",
    inputSchema: {
      type: "object",
      properties: { path: { type: "string" } },
    },
    outputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        entries: { type: "array" },
      },
    },
  },
  {
    id: "slice_math",
    kind: "compute",
    path: "deterministic",
    inputSchema: {
      type: "object",
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    outputSchema: {
      type: "object",
      properties: { value: { type: "number" } },
      required: ["value"],
    },
  },
  {
    id: "llm_echo",
    kind: "llm",
    path: "lawful-nova",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        model: { type: "string" },
        max_tokens: { type: "number" },
        temperature: { type: "number" },
      },
      required: ["prompt"],
    },
    outputSchema: {
      type: "object",
      properties: {
        capabilityId: { type: "string" },
        provider: { type: "string" },
        model: { type: "string" },
        promptHash: { type: "string" },
        text: { type: "string" },
        inputTokens: { type: "number" },
        outputTokens: { type: "number" },
      },
      required: ["text", "promptHash"],
    },
  },
];

export function getAllCapabilities() {
  return [...SLICE_CAPABILITIES];
}
