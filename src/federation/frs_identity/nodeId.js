/**
 * frs_identity — stable node ID generation
 */

import crypto from "crypto";
import fs from "fs";
import path from "path";

const DEFAULT_ID_PATH = "node_id.json";

/**
 * @returns {import('../types.js').NodeId}
 */
export function generateNodeId() {
  return crypto.randomUUID();
}

/**
 * Load or create persistent NodeId on first boot.
 * @param {string} [storePath]
 * @returns {import('../types.js').NodeId}
 */
export function loadOrCreateNodeId(storePath = DEFAULT_ID_PATH) {
  if (fs.existsSync(storePath)) {
    const data = JSON.parse(fs.readFileSync(storePath, "utf-8"));
    return data.nodeId;
  }
  const nodeId = generateNodeId();
  fs.mkdirSync(path.dirname(path.resolve(storePath)), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify({ nodeId, createdAt: Date.now() }, null, 2));
  return nodeId;
}
