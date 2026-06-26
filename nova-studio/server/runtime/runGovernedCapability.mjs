/**
 * Governed capability execution — CRK-2 envelope → receipt → law kernel → provenance.
 */

import { runSlice } from "../../../substrate/runSlice.mjs";
import { loadContinuityState } from "../../../services/continuityService.mjs";

const SLICE_ALIASES = {
  "nova-slice-1": "slice_math",
};

export function resolveCapabilityId(id) {
  return SLICE_ALIASES[id] ?? id;
}

export async function runGovernedCapability(capabilityId, inputs = {}, operator = "operator:local") {
  const resolved = resolveCapabilityId(capabilityId);
  const parsedInputs = normalizeInputs(inputs, resolved);

  const result = await runSlice({
    operator,
    capabilityId: resolved,
    input: parsedInputs,
    continuityState: loadContinuityState(),
  });

  return {
    ok: result.ok,
    receipt: result.receipt,
    verdict: result.verdict,
    provenance: result.provenance,
    drift: result.drift,
    continuity: result.continuity,
    violations: result.violations,
    envelope: result.envelope,
  };
}

export async function executeGovernedSlice(sliceId, payload = {}, operator = "operator:local") {
  return runGovernedCapability(sliceId, payload, operator);
}

function normalizeInputs(inputs, capabilityId) {
  if (capabilityId === "slice_math" && inputs.value !== undefined) {
    const n = Number(inputs.value);
    return { value: Number.isFinite(n) ? n : 0 };
  }
  if (capabilityId === "read_file" || capabilityId === "write_file" || capabilityId === "list_dir") {
    const out = { ...inputs };
    if (out.path === undefined && out.file) out.path = out.file;
    return out;
  }
  return inputs;
}
