import type { Category } from "./types.js";

/** Dar-Z → Jon classification buckets (v1.0) */
export const DARZ_CATEGORY_LABEL: Record<Category, string> = {
  normative: "A. Normative Specification Input",
  architectural: "B. Architectural Refinement",
  methodological: "C. Methodological Guidance",
  implementation: "D. Implementation Commentary",
  human: "E. Human Context",
};

const SCORES: Record<Category, RegExp[]> = {
  normative: [
    /\binvariant\b/i,
    /\baxiom\b/i,
    /\blaw kernel\b/i,
    /\bgovernance rule\b/i,
    /\bgovernance constraint\b/i,
    /\bconstitutional\b/i,
    /\bnormative\b/i,
    /\brequirement\b/i,
    /\bsemantic artifact\b/i,
    /\bΛ\b/,
    /\bbinding\b/i,
    /\bcanon\b/i,
  ],
  architectural: [
    /\bdiagram\b/i,
    /\bstack\b/i,
    /\benvelope\b/i,
    /\binterface\b/i,
    /\bflow\b/i,
    /\barchitecture\b/i,
    /\bschema\b/i,
    /\bpipeline\b/i,
    /\bruntime boundar/i,
    /\bintegration logic\b/i,
    /\bsystem structure\b/i,
  ],
  methodological: [
    /\bevidence\b/i,
    /\btest\b/i,
    /\bconformance\b/i,
    /\baudit\b/i,
    /\bauditability\b/i,
    /\bvalidation\b/i,
    /\bprotocol\b/i,
    /\bposture\b/i,
    /\bverification\b/i,
    /\bfounder.independence\b/i,
  ],
  implementation: [
    /\brepo\b/i,
    /\bcommit\b/i,
    /\bui\b/i,
    /\bnova studio\b/i,
    /\bfile path\b/i,
    /\btsx\b/i,
    /\bapi\/\w+/i,
    /\bsrc\//i,
    /\bnpm run\b/i,
    /\bMRI\b/,
    /\bCTS\b/,
    /\bcoding agent\b/i,
  ],
  human: [
    /\bdrained\b/i,
    /\bstepping away\b/i,
    /\bbandwidth\b/i,
    /\bno rush\b/i,
    /\btired\b/i,
    /\bventing\b/i,
    /\bjoking\b/i,
    /\bdecompress/i,
    /\blol\b/i,
    /\bhaha\b/i,
    /\bstatus\b/i,
    /\bemotion\b/i,
  ],
};

export function classifyMessage(rawText: string): Category {
  const ranked = rankCategories(rawText);
  return ranked[0]?.score ? ranked[0].category : "human";
}

export function rankCategories(rawText: string): Array<{ category: Category; score: number }> {
  const t = rawText.toLowerCase();
  const scores = (Object.keys(SCORES) as Category[]).map((category) => {
    const score = SCORES[category].reduce((n, re) => n + (re.test(t) ? 1 : 0), 0);
    return { category, score };
  });
  return scores.sort((a, b) => b.score - a.score);
}

export function detectSecondaryCategory(rawText: string, primary: Category): Category | undefined {
  const ranked = rankCategories(rawText).filter((r) => r.score > 0 && r.category !== primary);
  return ranked[0]?.score ? ranked[0].category : undefined;
}
