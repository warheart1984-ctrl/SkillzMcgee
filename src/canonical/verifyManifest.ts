import fs from "node:fs";
import path from "node:path";
import type { CanonicalManifest } from "./generateManifest.js";
import { sha256, walkCanonicalFiles } from "./generateManifest.js";

export interface ManifestVerificationResult {
  ok: boolean;
  missingFiles: string[];
  changedFiles: string[];
  unexpectedFiles: string[];
  rootHashMatches: boolean;
}

export function verifyCanonicalManifest(
  canonicalDir: string,
  manifestPath: string,
): ManifestVerificationResult {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as CanonicalManifest;

  const expectedFiles = new Map(manifest.files.map((f) => [f.path, f.hash]));
  const actualFiles = new Map<string, string>();

  for (const rel of walkCanonicalFiles(canonicalDir)) {
    const full = path.join(canonicalDir, rel);
    actualFiles.set(rel, sha256(fs.readFileSync(full)));
  }

  const missingFiles: string[] = [];
  const changedFiles: string[] = [];
  const unexpectedFiles: string[] = [];

  for (const [filePath, expectedHash] of expectedFiles) {
    if (!actualFiles.has(filePath)) {
      missingFiles.push(filePath);
    } else if (actualFiles.get(filePath) !== expectedHash) {
      changedFiles.push(filePath);
    }
  }

  for (const filePath of actualFiles.keys()) {
    if (!expectedFiles.has(filePath)) {
      unexpectedFiles.push(filePath);
    }
  }

  const recomputedRoot = sha256(
    [...actualFiles.entries()]
      .map(([p, h]) => `${p}:${h}`)
      .sort()
      .join("\n"),
  );

  return {
    ok:
      missingFiles.length === 0 &&
      changedFiles.length === 0 &&
      unexpectedFiles.length === 0 &&
      recomputedRoot === manifest.rootHash,
    missingFiles,
    changedFiles,
    unexpectedFiles,
    rootHashMatches: recomputedRoot === manifest.rootHash,
  };
}
