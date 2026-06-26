/**
 * Thin wrapper — delegates to TypeScript canonical layer.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CLI = path.join(ROOT, "src/cli/canonical.ts");

function run(args) {
  const tsx = path.join(ROOT, "node_modules/tsx/dist/cli.mjs");
  const r = spawnSync(process.execPath, [tsx, CLI, ...args], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  process.exit(r.status ?? 1);
}

const cmd = process.argv[2];
if (cmd === "bootstrap") run(["bootstrap"]);
else if (cmd === "verify") run(["verify", ...process.argv.slice(3)]);
else run(["generate", ...process.argv.slice(3)]);
