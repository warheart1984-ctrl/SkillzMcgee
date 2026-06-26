/**
 * CAIC canonical manifest generator — hashable constitution tree.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../../..");
const REGISTRY = path.join(REPO_ROOT, "conformance/proof-graph/canonical-derived-registry.json");
const MANIFEST_OUT = path.join(REPO_ROOT, "canonical/manifest-v1.0.json");

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return `sha256:${crypto.createHash("sha256").update(buf).digest("hex")}`;
}

function sha256String(text) {
  return `sha256:${crypto.createHash("sha256").update(text, "utf8").digest("hex")}`;
}

function walkFiles(dirPath, base = "") {
  const entries = [];
  if (!fs.existsSync(dirPath)) return entries;
  const stat = fs.statSync(dirPath);
  if (stat.isFile()) {
    const rel = base || path.basename(dirPath);
    entries.push({ path: rel.replace(/\\/g, "/"), abs: dirPath });
    return entries;
  }
  for (const name of fs.readdirSync(dirPath).sort()) {
    const abs = path.join(dirPath, name);
    const rel = base ? `${base}/${name}` : name;
    entries.push(...walkFiles(abs, rel));
  }
  return entries;
}

function resolveCanonicalRoots() {
  const roots = [];
  if (!fs.existsSync(REGISTRY)) {
    return [
      "specification/normative-requirements",
      "specification/transformation-contracts",
      "governance/constitution",
      "governance/governance-ledger",
      "conformance/evidence-ledger",
      "conformance/provenance-ledger",
    ].map((r) => path.join(REPO_ROOT, r));
  }
  const reg = JSON.parse(fs.readFileSync(REGISTRY, "utf8"));
  const c = reg.canonical ?? {};
  const add = (p) => {
    if (!p) return;
    const abs = path.join(REPO_ROOT, String(p).replace(/^\//, ""));
    roots.push(abs);
  };
  for (const a of c.authorities ?? []) add(`governance/${a}`);
  add(c.requirements);
  add(c.contracts);
  add(c.transformations);
  add(c.evidence);
  add(c.provenance);
  add(c.governance_ledger);
  for (const impl of c.implementations ?? []) add(impl);
  return [...new Set(roots)];
}

export function generateCanonicalManifest(options = {}) {
  const roots = resolveCanonicalRoots();
  const files = [];
  const dirHashes = {};

  for (const root of roots) {
    const prefix = path.relative(REPO_ROOT, root).replace(/\\/g, "/");
    if (!fs.existsSync(root)) continue;
    const stat = fs.statSync(root);
    if (stat.isFile()) {
      files.push({
        path: `canonical/${prefix}`,
        hash: sha256File(root),
      });
      continue;
    }
    const walked = walkFiles(root, prefix);
    const dirFileHashes = [];
    for (const { path: rel, abs } of walked) {
      const canonicalPath = `canonical/${rel}`;
      const hash = sha256File(abs);
      files.push({ path: canonicalPath, hash });
      dirFileHashes.push(hash);
    }
    if (dirFileHashes.length) {
      dirHashes[prefix] = sha256String(dirFileHashes.sort().join("\n"));
    }
  }

  files.sort((a, b) => a.path.localeCompare(b.path));
  const rootHash = sha256String(files.map((f) => `${f.path}:${f.hash}`).join("\n"));

  const manifest = {
    version: "1.0",
    generated_at: new Date().toISOString(),
    rootHash,
    directories: Object.entries(dirHashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dir, hash]) => ({ path: `canonical/${dir}`, hash })),
    files,
  };

  if (options.write !== false) {
    fs.mkdirSync(path.dirname(MANIFEST_OUT), { recursive: true });
    fs.writeFileSync(MANIFEST_OUT, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  return manifest;
}

export function validateCanonicalManifest(manifest = null) {
  const onDisk = manifest ?? (fs.existsSync(MANIFEST_OUT) ? JSON.parse(fs.readFileSync(MANIFEST_OUT, "utf8")) : null);
  if (!onDisk) {
    return { status: "fail", error: "manifest missing", missingArtifacts: ["canonical/manifest-v1.0.json"] };
  }
  const live = generateCanonicalManifest({ write: false });
  const unexpected = [];
  const missing = [];
  const liveMap = new Map(live.files.map((f) => [f.path, f.hash]));
  const manifestMap = new Map(onDisk.files.map((f) => [f.path, f.hash]));

  for (const [p, hash] of liveMap) {
    if (!manifestMap.has(p)) unexpected.push({ path: p, reason: "unexpected_addition" });
    else if (manifestMap.get(p) !== hash) unexpected.push({ path: p, reason: "hash_mismatch" });
  }
  for (const [p] of manifestMap) {
    if (!liveMap.has(p)) missing.push(p);
  }

  const rootOk = onDisk.rootHash === live.rootHash;
  return {
    status: unexpected.length === 0 && missing.length === 0 && rootOk ? "pass" : "fail",
    canonicalIntegrity: unexpected.length === 0 && missing.length === 0 && rootOk ? "OK" : "FAIL",
    unexpectedChanges: unexpected,
    missingArtifacts: missing,
    hashTree: rootOk ? "verified" : "failed",
    manifest: onDisk,
    live_root_hash: live.rootHash,
  };
}

export const MANIFEST_PATH = MANIFEST_OUT;
