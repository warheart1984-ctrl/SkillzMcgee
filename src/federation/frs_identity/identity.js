/**
 * frs_identity — full node identity passport
 */

import fs from "fs";
import path from "path";
import { loadOrCreateNodeId } from "./nodeId.js";
import {
  captureEnvironment,
  defaultNodeConfig,
  generateNodeFingerprint,
} from "./fingerprint.js";
import { verifyNodeIdentity } from "./verify.js";

const DEFAULT_IDENTITY_PATH = "node_identity.json";

/**
 * @typedef {import('./fingerprint.js').NodeFingerprint} NodeFingerprint
 * @typedef {import('./fingerprint.js').NodeEnvironment} NodeEnvironment
 * @typedef {import('./fingerprint.js').NodeConfig} NodeConfig
 */

/**
 * @typedef {Object} NodeIdentity
 * @property {string} nodeId
 * @property {NodeFingerprint} fingerprint
 * @property {NodeEnvironment} environment
 * @property {NodeConfig} config
 */

/**
 * @param {string} [storePath]
 * @returns {NodeIdentity}
 */
export function loadNodeIdentity(storePath = DEFAULT_IDENTITY_PATH) {
  if (fs.existsSync(storePath)) {
    const identity = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    if (verifyNodeIdentity(identity)) {
      return identity;
    }
  }

  const nodeId = loadOrCreateNodeId(path.join(path.dirname(storePath), "node_id.json"));
  const environment = captureEnvironment();
  const config = defaultNodeConfig();
  const fingerprint = generateNodeFingerprint(config, environment);

  /** @type {NodeIdentity} */
  const identity = { nodeId, fingerprint, environment, config };

  fs.mkdirSync(path.dirname(path.resolve(storePath)), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(identity, null, 2));
  return identity;
}

/**
 * Emit NodeRekeyReceipt when fingerprint drifts (I5).
 * @param {NodeIdentity} oldIdentity
 * @param {NodeIdentity} newIdentity
 */
export function createNodeRekeyReceipt(oldIdentity, newIdentity) {
  return {
    type: "NodeRekeyReceipt",
    nodeId: newIdentity.nodeId,
    previousFingerprint: oldIdentity.fingerprint.hash,
    newFingerprint: newIdentity.fingerprint.hash,
    timestamp: Date.now(),
  };
}

/**
 * Boot-time identity with drift detection.
 * @param {string} [storePath]
 * @returns {{ identity: NodeIdentity, rekeyReceipt: object | null }}
 */
export function bootNodeIdentity(storePath = DEFAULT_IDENTITY_PATH) {
  if (!fs.existsSync(storePath)) {
    return { identity: loadNodeIdentity(storePath), rekeyReceipt: null };
  }

  const stored = JSON.parse(fs.readFileSync(storePath, "utf-8"));
  const environment = captureEnvironment();
  const config = defaultNodeConfig();
  const freshFingerprint = generateNodeFingerprint(config, environment);

  if (freshFingerprint.hash === stored.fingerprint.hash) {
    return { identity: stored, rekeyReceipt: null };
  }

  const newIdentity = {
    ...stored,
    fingerprint: freshFingerprint,
    environment,
    config,
  };
  fs.writeFileSync(storePath, JSON.stringify(newIdentity, null, 2));
  const rekeyReceipt = createNodeRekeyReceipt(stored, newIdentity);
  return { identity: newIdentity, rekeyReceipt };
}
