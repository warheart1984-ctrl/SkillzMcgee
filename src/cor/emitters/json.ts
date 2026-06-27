import fs from "node:fs";
import path from "node:path";
import { COR_SUITE_PATHS } from "../../cor-suite/paths.js";
import type { CorStateVector } from "../../cor-suite/paths.js";

export function ensureOutputDir(): void {
  fs.mkdirSync(COR_SUITE_PATHS.outputDir, { recursive: true });
}

export function writeJson(outPath: string, data: unknown): void {
  ensureOutputDir();
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function assertCorStateVector(data: CorStateVector): void {
  if (!data.corVersion || !data.generatedAt || !Array.isArray(data.requirements)) {
    throw new Error("Invalid COR state vector shape");
  }
  if (!data.structuralIntegrity?.orphans) {
    throw new Error("COR state vector missing structuralIntegrity.orphans");
  }
}

export function emitCorState(data: CorStateVector): string {
  assertCorStateVector(data);
  writeJson(COR_SUITE_PATHS.outputs.corState, data);
  return COR_SUITE_PATHS.outputs.corState;
}

export function emitArtifact<T extends object>(
  outPath: string,
  data: T,
  requiredKeys: (keyof T)[],
): string {
  for (const key of requiredKeys) {
    if (data[key] === undefined) {
      throw new Error(`Missing required field: ${String(key)} in ${path.basename(outPath)}`);
    }
  }
  writeJson(outPath, data);
  return outPath;
}
