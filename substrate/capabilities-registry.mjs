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
];

export function getAllCapabilities() {
  return [...SLICE_CAPABILITIES];
}
