/**
 * Live capability execution — sandboxed to nova-studio/workspace.
 */

import fs from "node:fs";
import path from "node:path";
import { WORKSPACE_DIR } from "./studioRuntime.mjs";

/**
 * @param {string} relPath
 */
function resolveSafe(relPath) {
  const normalized = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = path.resolve(WORKSPACE_DIR, normalized);
  if (!full.startsWith(WORKSPACE_DIR)) {
    throw new Error("Path escapes governed workspace");
  }
  return full;
}

/**
 * @param {string} name
 * @param {Record<string, unknown>} args
 */
export async function executeCapability(name, args = {}) {
  try {
    switch (name) {
      case "read_file": {
        const full = resolveSafe(String(args.path ?? ""));
        const content = fs.readFileSync(full, "utf8");
        return { ok: true, output: { path: args.path, content, bytes: content.length } };
      }
      case "write_file": {
        const full = resolveSafe(String(args.path ?? ""));
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, String(args.content ?? ""), "utf8");
        return { ok: true, output: { path: args.path, written: true } };
      }
      case "list_dir": {
        const full = resolveSafe(String(args.path ?? "."));
        const entries = fs.readdirSync(full, { withFileTypes: true }).map((d) => ({
          name: d.name,
          type: d.isDirectory() ? "dir" : "file",
        }));
        return { ok: true, output: { path: args.path ?? ".", entries } };
      }
      default:
        return { ok: false, error: `Unknown capability: ${name}`, output: null };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      output: null,
    };
  }
}
