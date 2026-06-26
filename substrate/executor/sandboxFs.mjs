import fs from "node:fs/promises";
import path from "node:path";

export const SANDBOX_ROOT = path.resolve(process.env.SKILLZMCGEE_FS_ROOT ?? ".runtime/fs");

export function resolveSafePath(targetPath) {
  const root = path.resolve(SANDBOX_ROOT);
  const full = path.resolve(root, String(targetPath ?? "."));
  if (full !== root && !full.startsWith(`${root}${path.sep}`)) {
    throw new Error("sandbox violation: path escape");
  }
  return full;
}

export async function readFileSlice(cap, input = {}) {
  const rel = input.path ?? cap.path;
  if (!rel) throw new Error("readFileSlice: missing path");
  const full = resolveSafePath(rel);
  const contents = await fs.readFile(full, "utf8");
  return { path: rel, contents };
}

export async function writeFileSlice(cap, input = {}) {
  const rel = input.path ?? cap.path;
  if (!rel) throw new Error("writeFileSlice: missing path");
  const full = resolveSafePath(rel);
  const contents = String(input.contents ?? input.content ?? "");
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, contents, "utf8");
  return { path: rel, bytes: Buffer.byteLength(contents) };
}

export async function listDirSlice(cap, input = {}) {
  const rel = input.path ?? cap.path ?? ".";
  const full = resolveSafePath(rel);
  const entries = await fs.readdir(full, { withFileTypes: true });
  return entries
    .map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? "dir" : "file",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
