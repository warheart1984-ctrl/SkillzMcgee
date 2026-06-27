import { COR_SUITE_PATHS } from "../paths.js";
import type { CarArtifact, CarRegistry } from "../paths.js";
import {
  canonicalArtifactPath,
  normalizeArtifactPath,
  saveCarRegistry,
  sha256File,
} from "./registry.js";

const VERSION = "1.0.0";
const AUTHORITY = "COR Suite 1.0";

function artifact(input: Omit<CarArtifact, "hash" | "lifecycle">): CarArtifact {
  const normalizedPath = normalizeArtifactPath(input.path);
  return {
    ...input,
    path: normalizedPath,
    hash: sha256File(canonicalArtifactPath(normalizedPath)),
    lifecycle: {
      createdAt: "2026-06-26T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    },
  };
}

export function buildInitialCarRegistry(): CarRegistry {
  const req = "CORSUITE.REQ-001";
  return {
    carVersion: "CAR-1.0",
    generatedAt: new Date().toISOString(),
    artifacts: [
      artifact({
        id: req,
        namespace: "CORSUITE",
        kind: "requirement",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "spec/COR-Suite-Spec-1.0.md",
      }),
      artifact({
        id: "CORSUITE.SPEC-001",
        namespace: "CORSUITE",
        kind: "specification",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "spec/COR-1.0-Contract.md",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.SPEC-002",
        namespace: "CORSUITE",
        kind: "specification",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "spec/CAR-1.0-Registry.md",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.SCHEMA-001",
        namespace: "CORSUITE",
        kind: "schema",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "spec/car-1.0.schema.json",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.SCHEMA-002",
        namespace: "CORSUITE",
        kind: "schema",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/pgi.schema.json",
        path: "spec/pgi.schema.json",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.SCHEMA-003",
        namespace: "CORSUITE",
        kind: "schema",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/dra-report.schema.json",
        path: "spec/dra-report.schema.json",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.IMPL-001",
        namespace: "CORSUITE",
        kind: "implementation",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "src/cor/index.ts",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.IMPL-002",
        namespace: "CORSUITE",
        kind: "implementation",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "src/cor-suite/car/registry.ts",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.IMPL-003",
        namespace: "CORSUITE",
        kind: "implementation",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "src/cor-suite/car/validate.ts",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.IMPL-004",
        namespace: "CORSUITE",
        kind: "implementation",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/pgi.schema.json",
        path: "src/cor-suite/pgi/index.ts",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.IMPL-005",
        namespace: "CORSUITE",
        kind: "implementation",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/dra-report.schema.json",
        path: "src/cor-suite/dra/index.ts",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.VER-001",
        namespace: "CORSUITE",
        kind: "verification",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "tests/cor_suite.test.js",
        links: { related: [req] },
      }),
      artifact({
        id: "CORSUITE.EVID-001",
        namespace: "CORSUITE",
        kind: "evidence",
        version: VERSION,
        status: "active",
        authority: AUTHORITY,
        schemaRef: "spec/car-1.0.schema.json",
        path: "spec/CAV-1.0-Validation.md",
        links: { related: [req] },
      }),
    ],
  };
}

export function bootstrapCarRegistry(): string {
  return saveCarRegistry(buildInitialCarRegistry(), COR_SUITE_PATHS.inputs.carRegistry);
}
