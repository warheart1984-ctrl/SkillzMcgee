import fs from "node:fs";
import { COR_SUITE_PATHS } from "../cor-suite/paths.js";
import type { CorStateVector, MaturityLevel } from "../cor-suite/paths.js";
import { emitArtifact } from "../cor/emitters/json.js";

export interface MaturityVector {
  generatedAt: string;
  commit?: string;
  requirements: Array<{ requirementId: string; maturity: MaturityLevel }>;
  summary: Record<MaturityLevel, number>;
}

function loadCorState(): CorStateVector {
  const p = COR_SUITE_PATHS.outputs.corState;
  if (!fs.existsSync(p)) throw new Error("COR state missing — run cor-suite cor first");
  return JSON.parse(fs.readFileSync(p, "utf8")) as CorStateVector;
}

export function computeMaturityVector(corState?: CorStateVector): string {
  const cor = corState ?? loadCorState();
  const requirements = cor.requirements.map((r) => ({
    requirementId: r.id,
    maturity: r.maturity,
  }));

  const summary: Record<MaturityLevel, number> = {
    normative: 0,
    implemented: 0,
    verified: 0,
    reproduced: 0,
  };
  for (const r of requirements) summary[r.maturity] += 1;

  const vector: MaturityVector = {
    generatedAt: new Date().toISOString(),
    commit: cor.commit,
    requirements,
    summary,
  };

  return emitArtifact(COR_SUITE_PATHS.outputs.maturityVector, vector, [
    "generatedAt",
    "requirements",
  ]);
}
