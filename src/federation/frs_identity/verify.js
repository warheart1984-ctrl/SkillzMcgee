/**
 * frs_identity — verify node identity (I4)
 */

import {
  hashConfig,
  hashEnvironment,
  computeAsOmegaHash,
  computeCrkHash,
  generateNodeFingerprint,
} from "./fingerprint.js";

/**
 * @param {import('./identity.js').NodeIdentity} identity
 * @returns {boolean}
 */
export function verifyNodeIdentity(identity) {
  if (!identity?.nodeId || !identity?.fingerprint) return false;

  const { fingerprint, environment, config } = identity;

  if (hashConfig(config) !== fingerprint.configHash) return false;
  if (hashEnvironment(environment) !== fingerprint.envHash) return false;
  if (computeAsOmegaHash() !== fingerprint.asOmegaHash) return false;
  if (computeCrkHash() !== fingerprint.crkHash) return false;

  const recomputed = generateNodeFingerprint(config, environment);
  return recomputed.hash === fingerprint.hash;
}

/**
 * Verify another node's identity from exchanged fingerprint components.
 * @param {import('./fingerprint.js').NodeFingerprint} fingerprint
 * @param {import('./fingerprint.js').NodeConfig} config
 * @param {import('./fingerprint.js').NodeEnvironment} environment
 */
export function verifyRemoteFingerprint(fingerprint, config, environment) {
  const identity = { nodeId: "remote", fingerprint, environment, config };
  return verifyNodeIdentity(identity);
}
