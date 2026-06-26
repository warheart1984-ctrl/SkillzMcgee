/**
 * frs_identity — deterministic node fingerprint (F1)
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { hashPayload } from "../../singularity/merkle.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AS_OMEGA_DIR = path.resolve(__dirname, "../../singularity");
const CRK_CONFIG_PATH = path.resolve(__dirname, "../../../config/constitution.yaml");

/**
 * @typedef {Object} NodeEnvironment
 * @property {string} os
 * @property {string} cpu
 * @property {string} arch
 * @property {string} runtime
 * @property {string} timezone
 */

/**
 * @typedef {Object} NodeConfig
 * @property {string} crkVersion
 * @property {string} asOmegaVersion
 * @property {string[]} invariants
 */

/**
 * @typedef {Object} NodeFingerprint
 * @property {string} hash
 * @property {number} createdAt
 * @property {string} configHash
 * @property {string} envHash
 * @property {string} asOmegaHash
 * @property {string} crkHash
 */

export function captureEnvironment() {
  /** @type {NodeEnvironment} */
  return {
    os: process.platform,
    cpu: process.env.PROCESSOR_IDENTIFIER ?? "unknown",
    arch: process.arch,
    runtime: `node${process.version}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export function defaultNodeConfig() {
  /** @type {NodeConfig} */
  return {
    crkVersion: "CRK-1.0",
    asOmegaVersion: "AS-Ω-1.1",
    invariants: ["K0", "K1", "K2", "K3", "K4", "K5", "K6", "K7", "F1", "F2", "F3", "F4", "F5", "F6"],
  };
}

export function hashConfig(config) {
  return hashPayload(config);
}

export function hashEnvironment(env) {
  return hashPayload(env);
}

export function computeAsOmegaHash() {
  const files = fs.readdirSync(AS_OMEGA_DIR).filter((f) => f.endsWith(".js")).sort();
  const contents = files.map((f) => fs.readFileSync(path.join(AS_OMEGA_DIR, f), "utf-8"));
  return hashPayload(contents.join(""));
}

export function computeCrkHash() {
  if (fs.existsSync(CRK_CONFIG_PATH)) {
    return hashPayload(fs.readFileSync(CRK_CONFIG_PATH, "utf-8"));
  }
  return hashPayload(defaultNodeConfig());
}

/**
 * @param {NodeConfig} config
 * @param {NodeEnvironment} env
 * @returns {NodeFingerprint}
 */
export function generateNodeFingerprint(config, env) {
  const configHash = hashConfig(config);
  const envHash = hashEnvironment(env);
  const asOmegaHash = computeAsOmegaHash();
  const crkHash = computeCrkHash();

  const hash = hashPayload({ configHash, envHash, asOmegaHash, crkHash });

  return {
    hash,
    createdAt: Date.now(),
    configHash,
    envHash,
    asOmegaHash,
    crkHash,
  };
}
