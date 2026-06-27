/**
 * COR client configuration — skillzmcgee consumes project-infi outputs only.
 * Set COR_SUITE_BASE_URL to override the default raw GitHub URL base.
 */

const DEFAULT_ORG = "SkillzMcgee";
const DEFAULT_REPO = "project-infi";
const DEFAULT_BRANCH = "main";

function baseUrl(): string {
  const viteEnv =
    typeof import.meta !== "undefined" &&
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_COR_SUITE_BASE_URL;
  if (viteEnv && viteEnv.length > 0) {
    return viteEnv.replace(/\/$/, "");
  }
  if (typeof process !== "undefined" && process.env?.COR_SUITE_BASE_URL) {
    return process.env.COR_SUITE_BASE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return "/api/cor/artifact";
  }
  return `https://raw.githubusercontent.com/${DEFAULT_ORG}/${DEFAULT_REPO}/${DEFAULT_BRANCH}/cor-suite/out`;
}

const CAR_DIR_FILES = new Set(["car-1.0.json"]);

function rawGithubArtifactUrl(filename: string): string {
  const subdir = CAR_DIR_FILES.has(filename) ? "car" : "out";
  return `https://raw.githubusercontent.com/${DEFAULT_ORG}/${DEFAULT_REPO}/${DEFAULT_BRANCH}/cor-suite/${subdir}/${filename}`;
}

export function corArtifactUrl(filename: string): string {
  const base = baseUrl();
  if (base.startsWith("http")) {
    return rawGithubArtifactUrl(filename);
  }
  return `${base.replace(/\/$/, "")}/${filename}`;
}

export const COR_ARTIFACTS = {
  carRegistry: "car-1.0.json",
  cavValidation: "cav-validation.json",
  cavReport: "cav-report.json",
  corState: "cor-state.json",
  proofAnalysis: "proof-analysis.json",
  governanceReceipt: "governance-receipt.json",
  maturityVector: "maturity-vector.json",
  repoHygiene: "repo-hygiene-status.json",
  pgi: "pgi-1.0.json",
  draReport: "dra-report.json",
  csrReport: "csr-report.json",
} as const;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`COR fetch failed (${res.status}): ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchArtifact<T>(filename: string): Promise<T> {
  return fetchJson<T>(corArtifactUrl(filename));
}
