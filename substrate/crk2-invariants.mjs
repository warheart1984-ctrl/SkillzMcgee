/**
 * CRK-2 invariant suite — Codex runtime enforcement.
 */
import {
  SLICE_CAPABILITIES,
  stableHash,
  capabilitySignatureHash,
} from "../nova-studio/server/runtime/substrateState.mjs";

const DRIFT_ABS_THRESHOLD = 5;
const DRIFT_REL_THRESHOLD = 0.1;

function getCapability(capabilityId) {
  return SLICE_CAPABILITIES.find((c) => c.id === capabilityId);
}

function validateSchema(value, schema) {
  if (!schema || typeof schema !== "object") return [];
  const issues = [];
  if (schema.required && Array.isArray(schema.required)) {
    for (const key of schema.required) {
      if (value == null || value[key] === undefined) {
        issues.push(`schema-missing-${key}`);
      }
    }
  }
  return issues;
}

/**
 * @param {object} ctx
 */
export function evaluateCrk2Invariants(ctx) {
  const violations = [];
  const cap = getCapability(ctx.capabilityId);

  if (!ctx.operator) violations.push("missing-operator");
  if (!ctx.capabilityId) violations.push("missing-capability");
  if (!ctx.inputHash) violations.push("missing-input-hash");

  if (!cap) {
    violations.push("unknown-capability");
    return violations;
  }

  const sigHash = capabilitySignatureHash(cap);
  if (ctx.capabilitySignatureHash && ctx.capabilitySignatureHash !== sigHash) {
    violations.push("capability-signature-hash-mismatch");
  }

  violations.push(...validateSchema(ctx.input, cap.inputSchema).map((v) => `input-${v}`));

  if (ctx.output !== undefined) {
    violations.push(...validateSchema(ctx.output, cap.outputSchema).map((v) => `output-${v}`));
    if (!ctx.outputHash) violations.push("missing-output-hash");
  }

  if (ctx.parentReceiptId === undefined && ctx.requireParent) {
    violations.push("missing-parent-receipt");
  }
  if (ctx.parentReceiptId && ctx.expectedParentReceiptId && ctx.parentReceiptId !== ctx.expectedParentReceiptId) {
    violations.push("broken-lineage-parent");
  }
  if (ctx.previousCheckpoint && ctx.continuityCheckpoint && ctx.continuityCheckpoint <= ctx.previousCheckpoint) {
    violations.push("non-monotonic-checkpoint");
  }

  if (ctx.expectedOutputHash && ctx.outputHash && ctx.outputHash !== ctx.expectedOutputHash) {
    violations.push("nondeterministic-output-hash");
  }
  if (ctx.previousOutputHash && ctx.outputHash && ctx.outputHash !== ctx.previousOutputHash && ctx.deterministic) {
    violations.push("output-hash-differs-from-previous");
  }

  if (ctx.driftPoint) {
    const { expected, actual } = ctx.driftPoint;
    const abs = Math.abs(actual - expected);
    if (abs > DRIFT_ABS_THRESHOLD) violations.push("drift-absolute-threshold");
    if (expected !== 0 && abs / Math.abs(expected) > DRIFT_REL_THRESHOLD) {
      violations.push("drift-relative-threshold");
    }
    if (ctx.previousDriftActual != null && actual < ctx.previousDriftActual && expected >= ctx.previousDriftActual) {
      violations.push("drift-direction-unexpected");
    }
  }

  return violations;
}

export { stableHash, capabilitySignatureHash };
