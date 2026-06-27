import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { COR_SUITE_PATHS, REPO_ROOT } from "../cor-suite/paths.js";
import { emitArtifact } from "../cor/emitters/json.js";

export interface HygieneIssue {
  issueId: string;
  category: "determinism" | "directory_hygiene" | "canonical_paths" | "reproducibility" | "ci_cd" | "other";
  description: string;
  severity: "info" | "warning" | "error" | "critical";
}

export interface RepoHygieneStatus {
  repoId: string;
  scanTimestamp: string;
  deterministicArtifacts: boolean;
  directoryHygieneOk: boolean;
  canonicalPathsOk: boolean;
  reproducibleBuildsOk: boolean;
  ciCdIntegrated: boolean;
  issues: HygieneIssue[];
}

const TRACKED_BUILD_PREFIXES = ["nova-studio/dist/", "nova-studio/dist-react/"];

function listTrackedFiles(): string[] {
  try {
    return execSync("git ls-files", { cwd: REPO_ROOT, encoding: "utf8" }).split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

export function collectHygieneIssues(): HygieneIssue[] {
  const issues: HygieneIssue[] = [];
  const tracked = listTrackedFiles();

  for (const prefix of TRACKED_BUILD_PREFIXES) {
    if (tracked.some((f) => f.replace(/\\/g, "/").startsWith(prefix))) {
      issues.push({
        issueId: `HYG-TRACKED-${prefix.replace(/\//g, "-")}`,
        category: "directory_hygiene",
        description: `Build artifact tracked in git: ${prefix}`,
        severity: "error",
      });
    }
  }

  for (const rel of [
    "conformance/traceability-matrix.json",
    "conformance/observability/CSR-1.0/registry.json",
    "spec/cor-state-vector.schema.json",
  ]) {
    if (!fs.existsSync(path.join(REPO_ROOT, rel))) {
      issues.push({
        issueId: `HYG-MISSING-${rel.replace(/[/\\.]/g, "-")}`,
        category: "canonical_paths",
        description: `Missing canonical path: ${rel}`,
        severity: "error",
      });
    }
  }

  if (fs.existsSync(path.join(REPO_ROOT, ".runtime"))) {
    issues.push({
      issueId: "HYG-RUNTIME-LEDGER",
      category: "determinism",
      description: "Legacy COR reads .runtime/nova-studio/ledger.jsonl - COR may vary by machine",
      severity: "warning",
    });
  }

  return issues;
}

export function scanRepoHygiene(): RepoHygieneStatus {
  const issues = collectHygieneIssues();
  const hasError = issues.some((i) => i.severity === "error" || i.severity === "critical");

  const status: RepoHygieneStatus = {
    repoId: "skillzmcgee",
    scanTimestamp: new Date().toISOString(),
    deterministicArtifacts: !issues.some((i) => i.category === "determinism" && i.severity === "error"),
    directoryHygieneOk: !issues.some((i) => i.category === "directory_hygiene" && i.severity === "error"),
    canonicalPathsOk: !issues.some((i) => i.category === "canonical_paths" && i.severity === "error"),
    reproducibleBuildsOk: !hasError,
    ciCdIntegrated: fs.existsSync(path.join(REPO_ROOT, ".github/workflows/cor-suite-ci.yml")),
    issues,
  };

  emitArtifact(COR_SUITE_PATHS.outputs.repoHygiene, status, [
    "repoId",
    "scanTimestamp",
    "deterministicArtifacts",
    "directoryHygieneOk",
    "canonicalPathsOk",
    "reproducibleBuildsOk",
    "ciCdIntegrated",
  ]);

  return status;
}

export function hygienePasses(status: RepoHygieneStatus): boolean {
  return (
    status.deterministicArtifacts &&
    status.directoryHygieneOk &&
    status.canonicalPathsOk &&
    status.reproducibleBuildsOk
  );
}
