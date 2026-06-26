/** @typedef {Object} StudioReceipt
 * @property {string} id
 * @property {string} timestamp
 * @property {string} actor
 * @property {string} slice
 * @property {unknown} intent
 * @property {unknown} output
 * @property {"ok"|"error"} status
 * @property {{ allowed: boolean, violations: string[] }} laws
 * @property {string|null} [parentId]
 * @property {string|null} [capability]
 * @property {string|null} [phase]
 */

/** @typedef {Object} StudioEvent
 * @property {string} id
 * @property {string} timestamp
 * @property {string} type
 */

export {};
