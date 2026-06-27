import { classifyMessage, detectSecondaryCategory } from "./classify.js";
import type {
  Altitude,
  AskAction,
  Category,
  Impact,
  Latency,
  MessageDirection,
  NormativeImpact,
  NormalizedMessage,
  RepositoryTarget,
} from "./types.js";

const FILE_PATH_RE = /(?:^|\s)(?:[\w.-]+\/)+[\w.-]+\.(?:tsx?|jsx?|mjs|md|json)(?:\s|$)/gi;
const ROUTE_RE = /\/nova\/studio\/[\w-]+/gi;

export function extractCoreClaim(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const first = lines[0] ?? text.trim();
  if (first.length <= 160) return first;
  const sentence = first.match(/^[^.!?]+[.!?]/)?.[0];
  return (sentence ?? first.slice(0, 157) + "…").trim();
}

export function inferContext(text: string, coreClaim: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== coreClaim);
  if (lines.length === 0) return "";
  return lines.slice(0, 2).join(" ");
}

export function inferImpact(text: string, category: Category): Impact {
  const t = text.toLowerCase();
  if (/\bspec\b|whitepaper|addendum|canon|normative doc|binding integration|governance\/standards/.test(t)) {
    return "spec";
  }
  if (/\brepo\b|commit|file|implement|nova studio|src\/|npm run|ui wire|\bMRI\b|\bCTS\b/.test(t)) {
    return "repo";
  }
  if (/\bdeploy\b|ops\b|production|runtime live|server\b/.test(t)) {
    return "ops";
  }
  if (category === "human") return "neither";
  if (category === "normative" || category === "methodological") return "spec";
  if (category === "implementation") return "repo";
  return "neither";
}

export function toNormativeImpact(impact: Impact): NormativeImpact {
  if (impact === "spec") return "spec";
  if (impact === "repo" || impact === "ops") return "repo";
  return "neither";
}

export function inferRepositoryTargets(text: string): RepositoryTarget[] {
  const t = text.toLowerCase();
  const hits: RepositoryTarget[] = [];
  if (/\bspec\b|whitepaper|addendum|canon|governance\/standards|normative/.test(t)) {
    hits.push("specification");
  }
  if (/\bconformance\b|binding integration|audit|AAIS-VB/.test(t)) {
    hits.push("conformance");
  }
  if (/\bMRI\b|mri\//.test(text)) {
    hits.push("MRI");
  }
  if (/\bdocs\b|readme|documentation|\.md\b/.test(t)) {
    hits.push("docs");
  }
  if (/\bwebsite\b|landing|site\b|public-facing/.test(t)) {
    hits.push("website");
  }
  return [...new Set(hits)];
}

export function inferDarzRequiredActionDetail(
  text: string,
  category: Category,
  normativeImpact: NormativeImpact,
  repositoryTargets: RepositoryTarget[],
): string {
  const t = text.toLowerCase();
  if (category === "human") {
    return /\?/.test(text) ? "Respond at human altitude — no repo work unless asked" : "Hold space — no action required";
  }
  if (/\bimplement\b|\bbuild\b|\bwire\b/.test(t)) {
    return "Implement the described change in repo";
  }
  if (/\bupdate spec\b|addendum|canon/.test(t) || (category === "normative" && normativeImpact === "spec")) {
    return "Update specification / governance docs to reflect input";
  }
  if (/\bconformance\b|binding/.test(t) || repositoryTargets.includes("conformance")) {
    return "Align conformance tests and binding audit posture";
  }
  if (category === "methodological") {
    return "Adjust verification, evidence, or audit discipline";
  }
  if (category === "architectural") {
    return "Refine architecture, interfaces, or integration boundaries";
  }
  if (category === "implementation" || normativeImpact === "repo") {
    return "Apply implementation changes in targeted repo surfaces";
  }
  if (/\?/.test(text)) {
    return "Respond with architectural read and proposed next step";
  }
  return "Acknowledge and fold into canon or backlog as appropriate";
}

export function inferAction(text: string, direction: MessageDirection, category: Category): AskAction {
  const t = text.toLowerCase();
  if (category === "human" && !/\?/.test(text)) return "none";
  if (direction === "darz->jon") {
    if (/\bapprove\b|\bsign off\b/.test(t)) return "approve";
    if (/\bimplement\b|\bfix\b|\bbuild\b|\bwire\b/.test(t)) return "respond";
    if (/\?/.test(text)) return "review";
    return category === "human" ? "none" : "respond";
  }
  if (/\bapprove\b|\bsign off\b/.test(t)) return "approve";
  if (/\brefine\b|\bedit\b|\btweak\b/.test(t)) return "refine";
  if (/\bignore\b|\bfyi\b|\bno action\b/.test(t)) return "ignore";
  if (/\?/.test(text)) return "review";
  return "review";
}

export function inferTargets(text: string): string[] {
  const paths = [...text.matchAll(FILE_PATH_RE)].map((m) => m[0].trim());
  const routes = [...text.matchAll(ROUTE_RE)].map((m) => m[0]);
  return [...new Set([...paths, ...routes])].slice(0, 8);
}

export function inferAltitude(category: Category): Altitude {
  if (category === "normative") return "constitutional";
  if (category === "architectural") return "architectural";
  if (category === "implementation") return "engineering";
  if (category === "methodological") return "architectural";
  return "human";
}

export function inferLatency(text: string): Latency {
  const t = text.toLowerCase();
  if (/\btoday\b|\basap\b|\bnow\b|\burgent\b|\bneed eyes today\b/.test(t)) return "now";
  if (/\bsoon\b|\bthis week\b|\bwhen you can\b/.test(t)) return "soon";
  if (/\bno rush\b|\bwhenever\b|\bwhen you have bandwidth\b/.test(t)) return "whenever";
  return "whenever";
}

export function normalizeMessage(
  rawText: string,
  direction: MessageDirection,
  overrides: Partial<NormalizedMessage> = {},
): NormalizedMessage {
  const category = overrides.category ?? classifyMessage(rawText);
  const secondaryCategory =
    overrides.secondaryCategory ?? detectSecondaryCategory(rawText, category);
  const coreClaim = overrides.coreClaim ?? extractCoreClaim(rawText);
  const context = overrides.context ?? inferContext(rawText, coreClaim);
  const impact = overrides.impact ?? inferImpact(rawText, category);
  const normativeImpact = overrides.normativeImpact ?? toNormativeImpact(impact);
  const repositoryTargets =
    overrides.repositoryTargets ??
    (direction === "darz->jon"
      ? inferRepositoryTargets(rawText)
      : inferRepositoryTargets(rawText));
  const requiredAction =
    overrides.requiredAction ?? inferAction(rawText, direction, category);
  const requiredActionDetail =
    overrides.requiredActionDetail ??
    inferDarzRequiredActionDetail(rawText, category, normativeImpact, repositoryTargets);
  const ask = overrides.ask ?? requiredAction;

  return {
    direction,
    category,
    secondaryCategory,
    coreClaim,
    context,
    impact,
    normativeImpact,
    requiredAction,
    requiredActionDetail,
    ask,
    targets: overrides.targets ?? inferTargets(rawText),
    repositoryTargets,
    altitude: overrides.altitude ?? inferAltitude(category),
    latency: overrides.latency ?? inferLatency(rawText),
    rawText,
  };
}
