/**
 * @typedef {"communicationTick"} CommunicationEntryType
 * @typedef {"jon->darz"|"darz->jon"} CommunicationDirection
 */

/**
 * @typedef {Object} DriftVector
 * @property {number} semantic
 * @property {number} altitude
 * @property {number} impact
 * @property {number} latency
 * @property {number} composite
 */

/**
 * @typedef {Object} CommunicationTick
 * @property {"communicationTick"} entry_type
 * @property {string} lane_id
 * @property {string} [id]
 * @property {string} timestamp
 * @property {string} comm_constitution_version
 * @property {CommunicationDirection} direction
 * @property {string} category
 * @property {string} core_claim
 * @property {string} impact
 * @property {string} required_action
 * @property {string[]} targets
 * @property {string} altitude
 * @property {string} latency
 * @property {DriftVector} drift_vector
 * @property {string} [corridor_status]
 * @property {Array<Object>} [drift_violations]
 */

/** @returns {DriftVector} */
export function zeroDriftVector() {
  return { semantic: 0, altitude: 0, impact: 0, latency: 0, composite: 0 };
}

/** @param {unknown} body â€” inbound POST body (pre-enrichment) */
export function validateCommunicationTickInput(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Body must be an object" };
  }
  const tick = /** @type {CommunicationTick} */ (body);
  if (tick.entry_type !== "communicationTick") {
    return { ok: false, error: "Invalid communicationTick: entry_type required" };
  }
  if (!tick.lane_id) {
    return { ok: false, error: "lane_id is mandatory on communicationTick" };
  }
  if (!tick.direction || !tick.core_claim || !tick.category) {
    return { ok: false, error: "Missing required fields: direction, category, core_claim" };
  }
  if (tick.direction !== "jon->darz" && tick.direction !== "darz->jon") {
    return { ok: false, error: "Invalid direction" };
  }
  return { ok: true, tick };
}

/** @param {unknown} tick â€” persisted communicationTick record */
export function validateCommunicationTick(tick) {
  const input = validateCommunicationTickInput(tick);
  if (!input.ok) return input;
  const record = /** @type {CommunicationTick} */ (tick);
  if (!record.comm_constitution_version) {
    return { ok: false, error: "comm_constitution_version is mandatory on communicationTick" };
  }
  if (!record.drift_vector || typeof record.drift_vector.composite !== "number") {
    return { ok: false, error: "drift_vector with composite is mandatory on communicationTick" };
  }
  return { ok: true, tick: record };
}
