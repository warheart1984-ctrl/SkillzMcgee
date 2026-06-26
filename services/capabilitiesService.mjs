import fs from "node:fs/promises";
import path from "node:path";

const CAPABILITIES_PATH = path.resolve("skillzmcgee", "capabilities.json");

export const DEFAULT_CAPABILITIES = [
  {
    id: "slice_math",
    kind: "compute",
    path: "/data/math",
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
    expectedValue: 42,
  },
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
        contents: { type: "string" },
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
        contents: { type: "string" },
      },
      required: ["path", "contents"],
    },
    outputSchema: {
      type: "object",
      properties: {
        path: { type: "string" },
        bytes: { type: "number" },
      },
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
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          type: { type: "string" },
        },
      },
    },
  },
  {
    id: "llm_echo",
    kind: "llm",
    inputSchema: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        model: { type: "string" },
      },
      required: ["prompt"],
    },
    outputSchema: {
      type: "object",
      properties: {
        text: { type: "string" },
        promptHash: { type: "string" },
      },
    },
  },
];

export async function loadCapabilities() {
  try {
    const text = await fs.readFile(CAPABILITIES_PATH, "utf8");
    return JSON.parse(text.replace(/^\uFEFF/, ""));
  } catch {
    return DEFAULT_CAPABILITIES;
  }
}
