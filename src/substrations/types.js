/**
 * Substration engine — core types
 */

/** @typedef {'continuity_organism' | 'field_attractor' | 'governance_arbitration' | 'cosmological_evolution' | 'temporal_meta'} ClusterId */

/**
 * @typedef {Object} SubstrationContext
 * @property {any} continuityState
 * @property {any} federationConfig
 * @property {import('../cosmic/cosmic_ledger.js').CosmicLedger} ledger
 * @property {any} agents
 * @property {any} [baseLedger]
 * @property {any} [crk1]
 * @property {any} [asOmega]
 */

/**
 * @typedef {Object} SubstrationNeed
 * @property {string} id
 * @property {string} type
 * @property {'low' | 'medium' | 'high' | 'critical'} severity
 * @property {string} reason
 * @property {number} createdAt
 * @property {string} [sourceSubstration]
 */

/**
 * @typedef {Object} SubstrationTask
 * @property {string} id
 * @property {string} needId
 * @property {string} action
 * @property {any} params
 * @property {number} createdAt
 * @property {string} [sourceSubstration]
 */

/**
 * @typedef {Object} SubstrationDescriptor
 * @property {string} id
 * @property {string} name
 * @property {ClusterId} cluster
 * @property {string} purpose
 * @property {boolean} enabled
 * @property {(ctx: SubstrationContext) => any} [analyze]
 * @property {(ctx: SubstrationContext, analysis: any) => SubstrationNeed[]} [deriveNeeds]
 * @property {(ctx: SubstrationContext, needs: SubstrationNeed[]) => SubstrationTask[]} [planTasks]
 * @property {(ctx: SubstrationContext, tasks: SubstrationTask[]) => Promise<void>} [act]
 */

/**
 * @typedef {Object} TickResult
 * @property {SubstrationNeed[]} needs
 * @property {SubstrationTask[]} tasks
 * @property {string[]} actedBy
 */

export {};
