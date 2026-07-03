import fs from "node:fs";
import path from "node:path";
import { COR_SUITE_PATHS, REPO_ROOT } from "../paths.js";
import type { CarArtifact, CarRegistry, CorStateVector } from "../paths.js";
import type { GovernanceReceipt } from "../governance/invariants.js";
import {
  loadCarRegistry,
  normalizeArtifactPath,
  saveCarRegistry,
  sha256File,
} from "./registry.js";

function repoRelative(absPath: string): string {
  return normalizeArtifactPath(path.relative(REPO_ROOT, absPath));
}

function receiptArtifact(
  receipt: GovernanceReceipt,
  receiptPath: string,
  relatedRequirements: string[],
  existing?: CarArtifact,
): CarArtifact {
  const now = new Date().toISOString();
  const relPath = repoRelative(receiptPath);
  return {
    id: `GOV.RECEIPT-${receipt.decisionId}`,
    namespace: "GOV",
    kind: "governance_receipt",
    version: "1.0.0",
    status: "active",
    authority: "Governance-Engine-Interface",
    schemaRef: "spec/governance-receipt.schema.json",
    path: relPath,
    hash: sha256File(receiptPath),
    lifecycle: {
      createdAt: existing?.lifecycle?.createdAt ?? now,
      updatedAt: now,
    },
    links: {
      related: relatedRequirements,
      supersedes: existing?.links?.supersedes ?? [],
      supersededBy: existing?.links?.supersededBy ?? [],
    },
  };
}

export function registerGovernanceReceiptInCar(
  receiptPath: string,
  cor: CorStateVector,
  registry: CarRegistry = loadCarRegistry(),
): string {
  const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8")) as GovernanceReceipt;
  const artifactId = `GOV.RECEIPT-${receipt.decisionId}`;
  const existingIndex = registry.artifacts.findIndex((artifact) => artifact.id === artifactId);
  const artifact = receiptArtifact(
    receipt,
    receiptPath,
    cor.requirements.map((req) => req.id),
    existingIndex >= 0 ? registry.artifacts[existingIndex] : undefined,
  );

  if (existingIndex >= 0) {
    registry.artifacts[existingIndex] = artifact;
  } else {
    registry.artifacts.push(artifact);
  }
  registry.generatedAt = new Date().toISOString();
  return saveCarRegistry(registry, COR_SUITE_PATHS.inputs.carRegistry);
}
