import { readFileSlice, writeFileSlice, listDirSlice } from "./sandboxFs.mjs";
import { llmSlice } from "./llmSlice.mjs";

export function buildSliceRuntime(capability) {
  switch (capability.kind) {
    case "read":
      return { capability, run: (input) => readFileSlice(capability, input) };
    case "write":
      return { capability, run: (input) => writeFileSlice(capability, input) };
    case "list_dir":
      return { capability, run: (input) => listDirSlice(capability, input) };
    case "llm":
      return { capability, run: (input) => llmSlice(capability, input) };
    case "compute":
    case "math":
      return {
        capability,
        run: async (input) => ({ value: Number(input?.value ?? 0) + 1 }),
      };
    default:
      throw new Error(`Unsupported slice kind: ${capability.kind}`);
  }
}
