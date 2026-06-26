#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrapCanonicalDir } from "../canonical/bootstrapCanonical.js";
import { generateCanonicalManifest, writeManifest } from "../canonical/generateManifest.js";
import { verifyCanonicalManifest } from "../canonical/verifyManifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

const [, , cmd, ...args] = process.argv;

if (cmd === "bootstrap") {
  const result = bootstrapCanonicalDir();
  console.log(
    JSON.stringify(
      { ok: true, ...result, manifestTarget: "canonical/manifest-v1.0.json" },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (cmd === "generate") {
  const canonicalDir = path.resolve(REPO_ROOT, args[0] ?? "canonical");
  const version = args[1] ?? "1.0";
  const out = path.resolve(REPO_ROOT, args[2] ?? "canonical/manifest-v1.0.json");

  if (!args[0] && !fs.existsSync(canonicalDir)) {
    console.error("canonical/ missing — run: npm run canonical:bootstrap");
    process.exit(1);
  }

  const manifest = generateCanonicalManifest(canonicalDir, version);
  writeManifest(manifest, out);
  console.log(`Manifest generated: ${out}`);
  console.log(`rootHash: ${manifest.rootHash}`);
  console.log(`files: ${manifest.files.length}`);
  process.exit(0);
}

if (cmd === "verify") {
  const canonicalDir = path.resolve(REPO_ROOT, args[0] ?? "canonical");
  const manifestPath = path.resolve(REPO_ROOT, args[1] ?? "canonical/manifest-v1.0.json");

  const result = verifyCanonicalManifest(canonicalDir, manifestPath);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.ok ? 0 : 1);
}

console.error("Usage:");
console.error("  canonical bootstrap");
console.error("  canonical generate [canonicalDir] [version] [outPath]");
console.error("  canonical verify [canonicalDir] [manifestPath]");
process.exit(1);
