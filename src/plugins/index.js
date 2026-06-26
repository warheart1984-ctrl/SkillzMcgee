/**
 * Plugin loader stubs — governance stance strip and operator macros.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} name
 * @returns {object|null}
 */
export function loadPluginManifest(name) {
  const file = path.join(__dirname, "manifests", `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * @returns {object[]}
 */
export function listPluginManifests() {
  const dir = path.join(__dirname, "manifests");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

export const stanceStripPlugin = {
  name: "governance-stance-strip",
  render: async () => {
    const { printGovernanceStanceStripCli } = await import("../ui/governance_stance_strip.js");
    printGovernanceStanceStripCli();
  },
};

export const operatorMacrosPlugin = {
  name: "operator-macros",
  configPath: path.join(process.cwd(), "config", "operator_macros.yaml"),
};
