import crypto from "node:crypto";
import fs from "node:fs";
import { COR_SUITE_PATHS } from "../paths.js";
import type { CarArtifact, CarRegistry } from "../paths.js";
import {
  artifactExists,
  computeArtifactHash,
  loadCarRegistry,
} from "./registry.js";

export interface CavFinding {
  findingId: string;
  category: "schema" | "path" | "hash" | "identity" | "lifecycle" | "advisory";
  severity: "blocking" | "advisory";
  blocking: boolean;
  message: string;
  artifactId?: string;
  path?: string;
}

export interface CavValidation {
  cavVersion: "CAV-1.0";
  generatedAt: string;
  registryPath: string;
  registryHash?: string;
  ok: boolean;
  findings: CavFinding[];
}

const ARTIFACT_KINDS = new Set([
  "requirement",
  "specification",
  "implementation",
  "verification",
  "evidence",
  "governance_receipt",
  "schema",
  "registry",
]);

const ARTIFACT_STATUSES = new Set(["draft", "active", "deprecated", "retired"]);

function isDateTime(value: unknown): boolean {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function addFinding(
  findings: CavFinding[],
  finding: Omit<CavFinding, "findingId">,
): void {
  findings.push({
    findingId: `CAV-${String(findings.length + 1).padStart(3, "0")}`,
    ...finding,
  });
}

function validateRegistryShape(registry: CarRegistry, findings: CavFinding[]): void {
  if (typeof registry.carVersion !== "string") {
    addFinding(findings, {
      category: "schema",
      severity: "blocking",
      blocking: true,
      message: "carVersion must be a string",
    });
  }
  if (!isDateTime(registry.generatedAt)) {
    addFinding(findings, {
      category: "schema",
      severity: "blocking",
      blocking: true,
      message: "generatedAt must be an ISO date-time string",
    });
  }
  if (!Array.isArray(registry.artifacts)) {
    addFinding(findings, {
      category: "schema",
      severity: "blocking",
      blocking: true,
      message: "artifacts must be an array",
    });
  }
}

function validateArtifactShape(artifact: CarArtifact, findings: CavFinding[]): void {
  for (const field of ["id", "namespace", "kind", "version", "status", "path", "hash"] as const) {
    if (typeof artifact[field] !== "string" || artifact[field].length === 0) {
      addFinding(findings, {
        category: "schema",
        severity: "blocking",
        blocking: true,
        artifactId: artifact.id,
        path: artifact.path,
        message: `artifact ${artifact.id ?? "(unknown)"} missing required string field: ${field}`,
      });
    }
  }
  if (!ARTIFACT_KINDS.has(artifact.kind)) {
    addFinding(findings, {
      category: "schema",
      severity: "blocking",
      blocking: true,
      artifactId: artifact.id,
      path: artifact.path,
      message: `artifact kind is not valid: ${artifact.kind}`,
    });
  }
  if (!ARTIFACT_STATUSES.has(artifact.status)) {
    addFinding(findings, {
      category: "schema",
      severity: "blocking",
      blocking: true,
      artifactId: artifact.id,
      path: artifact.path,
      message: `artifact status is not valid: ${artifact.status}`,
    });
  }
}

function validateLifecycle(artifact: CarArtifact, findings: CavFinding[]): void {
  if (artifact.status === "active" && artifact.lifecycle?.retiredAt) {
    addFinding(findings, {
      category: "lifecycle",
      severity: "blocking",
      blocking: true,
      artifactId: artifact.id,
      path: artifact.path,
      message: "active artifact cannot have retiredAt",
    });
  }
  if (artifact.status === "retired" && !artifact.lifecycle?.retiredAt) {
    addFinding(findings, {
      category: "lifecycle",
      severity: "blocking",
      blocking: true,
      artifactId: artifact.id,
      path: artifact.path,
      message: "retired artifact must include retiredAt",
    });
  }
  if (artifact.status === "deprecated" && !artifact.links?.supersededBy?.length) {
    addFinding(findings, {
      category: "advisory",
      severity: "advisory",
      blocking: false,
      artifactId: artifact.id,
      path: artifact.path,
      message: "deprecated artifact should identify supersededBy successor",
    });
  }
}

export function validateCarRegistry(registry = loadCarRegistry()): CavValidation {
  const findings: CavFinding[] = [];
  validateRegistryShape(registry, findings);

  const seen = new Map<string, CarArtifact>();
  for (const artifact of registry.artifacts ?? []) {
    validateArtifactShape(artifact, findings);

    if (seen.has(artifact.id)) {
      addFinding(findings, {
        category: "identity",
        severity: "blocking",
        blocking: true,
        artifactId: artifact.id,
        path: artifact.path,
        message: `duplicate artifact id: ${artifact.id}`,
      });
    }
    seen.set(artifact.id, artifact);

    if (!artifactExists(artifact)) {
      addFinding(findings, {
        category: "path",
        severity: "blocking",
        blocking: true,
        artifactId: artifact.id,
        path: artifact.path,
        message: "registered artifact path does not exist",
      });
      continue;
    }

    const actualHash = computeArtifactHash(artifact);
    if (artifact.hash !== actualHash) {
      addFinding(findings, {
        category: "hash",
        severity: "blocking",
        blocking: true,
        artifactId: artifact.id,
        path: artifact.path,
        message: `hash mismatch: expected ${artifact.hash}, actual ${actualHash}`,
      });
    }

    validateLifecycle(artifact, findings);
  }

  const registryPath = COR_SUITE_PATHS.inputs.carRegistry;
  const registryHash = fs.existsSync(registryPath)
    ? `sha256:${crypto.createHash("sha256").update(fs.readFileSync(registryPath)).digest("hex")}`
    : undefined;

  return {
    cavVersion: "CAV-1.0",
    generatedAt: new Date().toISOString(),
    registryPath,
    registryHash,
    ok: findings.every((finding) => !finding.blocking),
    findings,
  };
}

export function emitCavValidation(validation = validateCarRegistry()): string {
  fs.mkdirSync(COR_SUITE_PATHS.outputDir, { recursive: true });
  fs.writeFileSync(
    COR_SUITE_PATHS.outputs.cavValidation,
    `${JSON.stringify(validation, null, 2)}\n`,
    "utf8",
  );
  return COR_SUITE_PATHS.outputs.cavValidation;
}
