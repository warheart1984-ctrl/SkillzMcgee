import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export interface CanonicalFileEntry {
  path: string;
  hash: string;
}

export interface CanonicalManifest {
  version: string;
  generatedAt: string;
  rootHash: string;
  files: CanonicalFileEntry[];
}

export function sha256(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

export function walkCanonicalFiles(dir: string, base = dir): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkCanonicalFiles(full, base));
    } else if (entry.isFile() && !/^manifest.*\.json$/i.test(entry.name)) {
      files.push(path.relative(base, full).replace(/\\/g, "/"));
    }
  }

  return files.sort();
}

export function generateCanonicalManifest(
  canonicalDir: string,
  version: string,
): CanonicalManifest {
  const filePaths = walkCanonicalFiles(canonicalDir);

  const files: CanonicalFileEntry[] = filePaths.map((relPath) => {
    const fullPath = path.join(canonicalDir, relPath);
    const data = fs.readFileSync(fullPath);
    return {
      path: relPath,
      hash: sha256(data),
    };
  });

  const rootHash = sha256(
    files
      .map((f) => `${f.path}:${f.hash}`)
      .sort()
      .join("\n"),
  );

  return {
    version,
    generatedAt: new Date().toISOString(),
    rootHash,
    files,
  };
}

export function writeManifest(manifest: CanonicalManifest, outPath: string): void {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}
