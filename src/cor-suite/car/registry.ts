import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { COR_SUITE_PATHS, REPO_ROOT } from "../paths.js";
import type { CarArtifact, CarRegistry } from "../paths.js";

export function canonicalArtifactPath(relPath: string): string {
  if (path.isAbsolute(relPath) || /^[A-Za-z]:/.test(relPath)) return relPath;
  return path.join(REPO_ROOT, relPath);
}

export function normalizeArtifactPath(relPath: string): string {
  return relPath.replace(/\\/g, "/");
}

export function sha256File(filePath: string): string {
  const buf = fs.readFileSync(filePath);
  return `sha256:${crypto.createHash("sha256").update(buf).digest("hex")}`;
}

export function loadCarRegistry(registryPath = COR_SUITE_PATHS.inputs.carRegistry): CarRegistry {
  if (!fs.existsSync(registryPath)) {
    throw new Error(`CAR registry missing: ${registryPath}`);
  }
  return JSON.parse(fs.readFileSync(registryPath, "utf8")) as CarRegistry;
}

export function saveCarRegistry(
  registry: CarRegistry,
  registryPath = COR_SUITE_PATHS.inputs.carRegistry,
): string {
  fs.mkdirSync(path.dirname(registryPath), { recursive: true });
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  return registryPath;
}

export function artifactExists(artifact: CarArtifact): boolean {
  return fs.existsSync(canonicalArtifactPath(artifact.path));
}

export function computeArtifactHash(artifact: CarArtifact): string {
  return sha256File(canonicalArtifactPath(artifact.path));
}

export function artifactRefFromCar(artifact: CarArtifact): {
  id: string;
  path: string;
  type: string;
  hash: string;
} {
  return {
    id: artifact.id,
    path: normalizeArtifactPath(artifact.path),
    type: artifact.kind,
    hash: artifact.hash,
  };
}

export function relatedToRequirement(artifact: CarArtifact, requirementId: string): boolean {
  return artifact.links?.related?.includes(requirementId) ?? false;
}
