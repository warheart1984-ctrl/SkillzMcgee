export type MaturityLevel = "normative" | "implemented" | "verified" | "reproduced";

export interface MaturityCell {
  requirementId: string;
  maturity: MaturityLevel;
}

const MATURITY_ORDER: MaturityLevel[] = ["normative", "implemented", "verified", "reproduced"];

export function buildMaturityMap(maturity: {
  requirements?: Array<{ requirementId: string; maturity: MaturityLevel }>;
  summary?: Partial<Record<MaturityLevel, number>>;
}): { cells: MaturityCell[]; summary: Record<MaturityLevel, number> } {
  const cells = (maturity.requirements ?? []).map((r) => ({
    requirementId: r.requirementId,
    maturity: r.maturity,
  }));

  const summary: Record<MaturityLevel, number> = {
    normative: 0,
    implemented: 0,
    verified: 0,
    reproduced: 0,
  };

  for (const level of MATURITY_ORDER) {
    summary[level] = maturity.summary?.[level] ?? cells.filter((c) => c.maturity === level).length;
  }

  return { cells, summary };
}

export function maturityColor(level: MaturityLevel): string {
  switch (level) {
    case "reproduced":
      return "#22c55e";
    case "verified":
      return "#3b82f6";
    case "implemented":
      return "#eab308";
    default:
      return "#94a3b8";
  }
}
