export interface SliceCapability {
  id: string;
  kind: "read" | "write" | "list_dir" | "compute" | "llm";
  path?: string;
  inputSchema: unknown;
  outputSchema: unknown;
  lastRun?: string | null;
}

export function inferSignatureFromConfig(config: {
  id: string;
  kind: "read" | "write" | "list_dir" | "compute" | "llm";
  path?: string;
  inputSchema?: unknown;
  outputSchema?: unknown;
}): SliceCapability {
  return {
    id: config.id,
    kind: config.kind,
    path: config.path,
    inputSchema: config.inputSchema ?? {},
    outputSchema: config.outputSchema ?? {},
  };
}
