import crypto from "node:crypto";
import fs from "node:fs";

export function sha256File(filePath: string): string {
  if (!fs.existsSync(filePath)) return "missing";
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

export function sha256String(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

export function artifactRef(repoRoot: string, relPath: string, type: string): {
  path: string;
  type: string;
  hash: string;
} {
  const abs = relPath.startsWith("/") || /^[A-Za-z]:/.test(relPath)
    ? relPath
    : `${repoRoot}/${relPath}`.replace(/\\/g, "/");
  const normalized = relPath.replace(/\\/g, "/");
  return {
    path: normalized,
    type,
    hash: fs.existsSync(abs) ? sha256File(abs) : "missing",
  };
}
