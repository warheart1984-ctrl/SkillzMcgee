/**
 * Materialize canonical/ from canonical-derived-registry paths.
 * Run once before generate — skillzmcgee scatters canonical artifacts across the repo.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, "../..");
const REGISTRY = path.join(
  REPO_ROOT,
  "conformance/proof-graph/canonical-derived-registry.json",
);

const DEFAULT_ROOTS = [
  "specification/normative-requirements",
  "specification/transformation-contracts",
  "governance/constitution",
  "governance/governance-ledger",
  "conformance/evidence-ledger",
  "conformance/provenance-ledger",
  "governance/ledger",
];

function resolveRoots(): string[] {
  if (!fs.existsSync(REGISTRY)) return DEFAULT_ROOTS;
  const reg = JSON.parse(fs.readFileSync(REGISTRY, "utf8")) as {
    canonical?: Record<string, unknown>;
  };
  const c = reg.canonical ?? {};
  const roots: string[] = [];
  const add = (p: unknown) => {
    if (!p || typeof p !== "string") return;
    roots.push(p.replace(/^\//, ""));
  };
  for (const a of (c.authorities as string[] | undefined) ?? []) {
    add(`governance/${a}`);
  }
  add(c.requirements);
  add(c.contracts);
  add(c.transformations);
  add(c.evidence);
  add(c.provenance);
  add(c.governance_ledger);
  for (const impl of (c.implementations as string[] | undefined) ?? []) {
    add(impl);
  }
  return [...new Set(roots.length ? roots : DEFAULT_ROOTS)];
}

function copyIntoCanonical(srcAbs: string, destRoot: string, repoRel: string): number {
  let count = 0;
  if (!fs.existsSync(srcAbs)) return 0;

  const stat = fs.statSync(srcAbs);
  if (stat.isFile()) {
    const dest = path.join(destRoot, repoRel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(srcAbs, dest);
    return 1;
  }

  for (const name of fs.readdirSync(srcAbs)) {
    count += copyIntoCanonical(
      path.join(srcAbs, name),
      destRoot,
      path.join(repoRel, name).replace(/\\/g, "/"),
    );
  }
  return count;
}

export function bootstrapCanonicalDir(
  outDir = path.join(REPO_ROOT, "canonical"),
): { outDir: string; filesCopied: number; roots: string[] } {
  const roots = resolveRoots();
  let filesCopied = 0;

  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  for (const rel of roots) {
    const src = path.join(REPO_ROOT, rel);
    const destRel = rel.replace(/\\/g, "/");
    filesCopied += copyIntoCanonical(src, outDir, destRel);
  }

  return { outDir, filesCopied, roots };
}
