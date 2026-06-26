/**
 * @typedef {Object} LawsResult
 * @property {boolean} allowed
 * @property {string[]} [violations]
 */

/**
 * @typedef {Object} GovernedReceipt
 * @property {string} id
 * @property {string} timestamp
 * @property {string} actor
 * @property {string} slice
 * @property {unknown} intent
 * @property {unknown} output
 * @property {"ok"|"error"} status
 * @property {LawsResult} laws
 * @property {string} [parentId]
 * @property {string} [lineageId]
 * @property {number} [depth]
 * @property {string} [receiptHash]
 * @property {string} [parentHash]
 */

/**
 * @typedef {Object} SliceState
 * @property {unknown} lastOutput
 * @property {"ok"|"error"} lastStatus
 * @property {string} lastRunId
 * @property {string} [lastTimestamp]
 */

export {};
