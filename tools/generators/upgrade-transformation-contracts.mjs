#!/usr/bin/env node
/**
 * Upgrades T01–T12 transformation contracts to 13-section four-layer format.
 * Run: node tools/generators/upgrade-transformation-contracts.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dir = join(root, "specification/transformation-contracts");

const DEFAULT_AUTH = {
  authority_id: "steward-council/v1.0",
  authority_type: "StewardCouncilDecision",
  authority_version: "v1.0",
  authority_desc: "Steward Council authorization under CRK-1 v1.0 and CA-1.1 four-layer provenance.",
};

const DEFAULT_IMPL = {
  implementation_id: "MRI-1.0/nova-studio-pipeline/1.0.0",
  implementation_name: "Nova Studio Governed Pipeline",
  implementation_version: "1.0.0",
  runtime: "nova-studio / MRI-1.0 preview",
};

const DEFAULT_ASSUMPTIONS = {
  items: [
    "COM-1.0 artifact schemas satisfied",
    "Constitution v1.0 active",
    "One artifact per stage (CA-1.0)",
  ],
  policies: ["continuity-policy@v1.0", "governance-policy@v1.0"],
  mode: "strict",
};

const CONTRACTS = [
  {
    file: "decision-to-outcome.md",
    title: "Decision to Outcome",
    tn: "T01",
    slug: "decision-to-outcome",
    input: "DecisionObject",
    output: "OutcomeObject",
    reqs: "CRK1-R001, CRK1-R005, CRK1-R014, CRK1-R015, CRK1-R040, CRK1-R043",
    inv: "K0, K1, K4, K5, P-1",
    cts: "CTS-M1",
    fia: "FIA-Mechanical",
    receipt: "invariant_block",
    inputId: "decision.id",
    inputProps: ["`id` (unique)", "`actor` (IdentityObject reference)", "`payload` (action intent)", "`timestamp` (ISO8601)"],
    outputId: "outcome.id",
    outputProps: ["`id` (unique, distinct from decision)", "`decision_id` (references input)", "`result` (consequence payload)", "`timestamp` (ISO8601, ≥ decision timestamp)"],
    pre: [
      "Input DecisionObject validates against COM-1.0 schema (R014).",
      "Actor identity is resolvable.",
      "Runtime is not in halt state.",
      "RuntimeContract permits execution.",
    ],
    post: [
      "Exactly one OutcomeObject exists for this decision (R001).",
      "`outcome.decision_id === decision.id`.",
      "No in-place mutation of DecisionObject (CA-1.0).",
      "Outcome is eligible for evidence transformation.",
      "PL-1.1 provenance entry records full transformation context (R043).",
    ],
    fn: `f_decision_outcome(DecisionObject d, assumptions, policy_versions) → OutcomeObject o
  where o.decision_id = d.id
    and o.result = execute(d.payload, d.actor, assumptions, policy_versions)`,
    fnConstraints: "Deterministic on `(d, runtime_state_at_decision, assumptions)` · Total on valid decisions · Replayable from ledger + decision snapshot · Traceable via `decision_id` link",
    evidence: ["OutcomeObject instance", "Governance receipt (`receipt_id`)", "PL-1.1 provenance entry", "Optional drift delta if execution envelope exceeded"],
    trace: "CRK1-R001 → ADR-003/004 → nova-studio/runtime → CTS-M1 → OutcomeObject → invariant_block → PL-1.1",
    implPath: "nova-studio/server/runtime/pipeline.mjs",
  },
  {
    file: "outcome-to-evidence.md",
    title: "Outcome to Evidence",
    tn: "T02",
    slug: "outcome-to-evidence",
    input: "OutcomeObject",
    output: "EvidenceObject",
    reqs: "CRK1-R002, CRK1-R006, CRK1-R016, CRK1-R018, CRK1-R040, CRK1-R043",
    inv: "K2, K4, K5, K6, P-1",
    cts: "CTS-M2",
    fia: "FIA-Mechanical",
    receipt: "evidence_block",
    inputId: "outcome.id",
    inputProps: ["`id` (unique)", "`decision_id` (parent decision)", "`result` (consequence payload)", "`timestamp` (ISO8601)"],
    outputId: "evidence.id",
    outputProps: ["`id` (unique)", "`outcome_id` (references input)", "`data` (complete evidentiary payload)", "`timestamp` (ISO8601, ≥ outcome timestamp)", "Hash-stable serialization (EvidenceContract)"],
    pre: ["Input OutcomeObject validates against COM-1.0 schema (R015).", "Outcome is complete (not partial or suppressed).", "EvidenceContract enforcement enabled."],
    post: ["Exactly one EvidenceObject per OutcomeObject (R002).", "Evidence derived solely from the outcome.", "No in-place mutation of OutcomeObject (CA-1.0).", "All relevant fields exposed (K4).", "PL-1.1 provenance entry (R043)."],
    fn: `f_outcome_evidence(OutcomeObject o, assumptions, policy_versions) → EvidenceObject e
  where e.outcome_id = o.id
    and e.data = materialize_evidence(o.result, assumptions)`,
    fnConstraints: "Deterministic · Total on valid outcomes · Replayable from outcome snapshot · Traceable via `outcome_id`",
    evidence: ["EvidenceObject instance", "PL-1.1 provenance entry", "EvidenceContract validation log"],
    trace: "CRK1-R002 → ADR-003/004 → governance/constitution → CTS-M2 → EvidenceObject → evidence_block → PL-1.1",
    implPath: "governance/constitution/, src/crk1/",
  },
  {
    file: "evidence-to-interpretation.md",
    title: "Evidence to Interpretation",
    tn: "T03",
    slug: "evidence-to-interpretation",
    input: "EvidenceObject",
    output: "InterpretationObject",
    reqs: "CRK1-R003, CRK1-R007, CRK1-R017, CRK1-R020, CRK1-R027, CRK1-R040, CRK1-R043",
    inv: "K7, K8, K9, P-1",
    cts: "CTS-M3, CTS-E1, CTS-E2",
    fia: "FIA-Semantic",
    receipt: "traceability_block",
    inputId: "evidence.id",
    inputProps: ["`id` (unique)", "`outcome_id` (parent outcome)", "`data` (evidentiary payload)", "`timestamp` (ISO8601)"],
    outputId: "interpretation.id",
    outputProps: ["`id` (unique)", "`evidence_id` (references input)", "`interpretation` (semantic frame output)", "`frames_used` (non-empty array)", "`timestamp` (ISO8601, ≥ evidence timestamp)"],
    pre: ["Input EvidenceObject validates (R016).", "Frame set available and versioned.", "SemanticContract enforcement enabled.", "No blocked interpretation paths (R007)."],
    post: ["Exactly one InterpretationObject per EvidenceObject (R003).", "`frames_used` documents all frames (R020).", "Reproducible from `(evidence, frames, frame_version)` (R021).", "No in-place mutation (CA-1.0).", "PL-1.1 provenance entry (R043)."],
    fn: `f_evidence_interpretation(EvidenceObject e, FrameSet F, assumptions, policy_versions) → InterpretationObject i
  where i.evidence_id = e.id
    and i.interpretation = interpret(e.data, F, assumptions)
    and i.frames_used = F.applied_ids`,
    fnConstraints: "Deterministic on `(e, F, frame_version, assumptions)` · Total on valid evidence · Replayable (Semantic Replay Engine) · Traceable via `evidence_id` and `frames_used`",
    evidence: ["InterpretationObject", "Frame list snapshot", "PL-1.1 provenance entry", "Drift deltas (if semantic envelope exceeded)"],
    trace: "CRK1-R003 → ADR-003/004 → src/crk1/ SRE → CTS-M3 → InterpretationObject → traceability_block → PL-1.1",
    implPath: "src/crk1/, semantic replay hooks",
    assumptionsExtra: ["Frame set version pinned in assumptions"],
    policies: ["semantic-policy@v1.0", "continuity-policy@v1.0"],
  },
  {
    file: "interpretation-to-policy-eval.md",
    title: "Interpretation to Policy Evaluation",
    tn: "T04",
    slug: "interpretation-to-policy-eval",
    input: "InterpretationObject",
    output: "PolicyEvaluationObject",
    reqs: "CRK1-R033, CRK1-R042, CRK1-R011, CRK1-R032, CRK1-R040, CRK1-R043",
    inv: "K10, K12, P-1",
    cts: "CTS-G1",
    fia: "FIA-Governance",
    receipt: "policy_eval_log",
    inputId: "interpretation.id",
    inputProps: ["`id` (unique)", "`evidence_id`", "`interpretation`", "`frames_used`", "`timestamp` (ISO8601)"],
    outputId: "policy_evaluation.id",
    outputProps: ["`id` (unique)", "`interpretation_id`", "`evaluation` (deterministic policy assessment)", "`timestamp`"],
    pre: ["InterpretationObject validates (R017).", "Interpretation replayable (R021).", "SemanticContract satisfied."],
    post: ["Exactly one PolicyEvaluationObject per interpretation (R040).", "Deterministic on `(interpretation, constitution_version, assumptions)`.", "No in-place mutation (CA-1.0).", "PL-1.1 provenance entry (R043)."],
    fn: `f_interpretation_policy_eval(InterpretationObject i, assumptions, policy_versions) → PolicyEvaluationObject pe
  where pe.interpretation_id = i.id
    and pe.evaluation = evaluate_policy(i, policy_versions, assumptions)`,
    fnConstraints: "Deterministic · Total on valid inputs · Replayable · Traceable",
    evidence: ["PolicyEvaluationObject", "Policy evaluation logs", "PL-1.1 provenance entry"],
    trace: "CRK1-R040 → ADR-003/004 → governance/validator → CTS-G1 → PolicyEvaluationObject → PL-1.1",
    implPath: "governance/validator.py, src/crk1/governance_evaluator.js",
  },
  {
    file: "policy-eval-to-policy-outcome.md",
    title: "Policy Evaluation to Policy Outcome",
    tn: "T05",
    slug: "policy-eval-to-policy-outcome",
    input: "PolicyEvaluationObject",
    output: "PolicyOutcomeObject",
    reqs: "CRK1-R040, CRK1-R043",
    inv: "K12, P-1",
    cts: "CTS-G1",
    fia: "FIA-Governance",
    receipt: "policy_outcome_log",
    inputId: "policy_evaluation.id",
    inputProps: ["`id`", "`interpretation_id`", "`evaluation`", "`timestamp`"],
    outputId: "policy_outcome.id",
    outputProps: ["`id`", "`policy_evaluation_id`", "`outcome`", "`timestamp`"],
    pre: ["Policy evaluation complete and valid.", "Evaluation deterministic and replayable."],
    post: ["Policy outcome explicit and singular (CA-1.0).", "No in-place mutation.", "PL-1.1 provenance entry (R043)."],
    fn: `f_policy_outcome(PolicyEvaluationObject pe, assumptions, policy_versions) → PolicyOutcomeObject po
  where po.policy_evaluation_id = pe.id
    and po.outcome = materialize_outcome(pe.evaluation, assumptions)`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["PolicyOutcomeObject", "PL-1.1 provenance entry"],
    trace: "CRK1-R040 → ADR-003/004 → governance/validator → CTS-G1 → PolicyOutcomeObject → PL-1.1",
    implPath: "governance/validator.py",
  },
  {
    file: "policy-outcome-to-governance-decision.md",
    title: "Policy Outcome to Governance Decision",
    tn: "T06",
    slug: "policy-outcome-to-governance-decision",
    input: "PolicyOutcomeObject",
    output: "GovernanceDecisionObject",
    reqs: "CRK1-R042, CRK1-R043",
    inv: "K12, P-1",
    cts: "CTS-G1",
    fia: "FIA-Governance",
    receipt: "governance_decision_log",
    inputId: "policy_outcome.id",
    inputProps: ["`id`", "`policy_evaluation_id`", "`outcome`", "`timestamp`"],
    outputId: "governance_decision.id",
    outputProps: ["`id`", "`policy_outcome_id`", "`decision` (pass | refuse | defer)", "`timestamp`"],
    pre: ["Policy outcome valid.", "Constitutional supremacy checks available (K12)."],
    post: ["Governance decision explicit.", "No in-place mutation.", "PL-1.1 provenance entry (R043)."],
    fn: `f_governance_decision(PolicyOutcomeObject po, assumptions, policy_versions) → GovernanceDecisionObject gd
  where gd.policy_outcome_id = po.id
    and gd.decision = govern(po.outcome, assumptions)`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["GovernanceDecisionObject", "Governance decision logs", "PL-1.1 provenance entry"],
    trace: "CRK1-R042 → ADR-003/004 → governance_evaluator → CTS-G1 → GovernanceDecisionObject → PL-1.1",
    implPath: "src/crk1/governance_evaluator.js",
  },
  {
    file: "governance-decision-to-execution-plan.md",
    title: "Governance Decision to Execution Plan",
    tn: "T07",
    slug: "governance-decision-to-execution-plan",
    input: "GovernanceDecisionObject",
    output: "ExecutionPlanObject",
    reqs: "CRK1-R040, CRK1-R042, CRK1-R043",
    inv: "K0, K12, P-1",
    cts: "CTS-G1",
    fia: "FIA-Governance",
    receipt: "execution_plan_log",
    inputId: "governance_decision.id",
    inputProps: ["`id`", "`policy_outcome_id`", "`decision`", "`timestamp`"],
    outputId: "execution_plan.id",
    outputProps: ["`id`", "`governance_decision_id`", "`plan`", "`timestamp`"],
    pre: ["Governance decision valid.", "RuntimeContract permits planning."],
    post: ["Execution plan deterministic from governance decision.", "No in-place mutation.", "PL-1.1 provenance entry (R043)."],
    fn: `f_execution_plan(GovernanceDecisionObject gd, assumptions, policy_versions) → ExecutionPlanObject ep
  where ep.governance_decision_id = gd.id
    and ep.plan = plan_from_decision(gd.decision, assumptions)`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["ExecutionPlanObject", "Plan trace logs", "PL-1.1 provenance entry"],
    trace: "CRK1-R040 → ADR-003/004 → nova-studio/pipeline → CTS-G1 → ExecutionPlanObject → PL-1.1",
    implPath: "nova-studio/server/runtime/pipeline.mjs",
  },
  {
    file: "execution-plan-to-state-transition.md",
    title: "Execution Plan to Runtime State Transition",
    tn: "T08",
    slug: "execution-plan-to-state-transition",
    input: "ExecutionPlanObject",
    output: "RuntimeStateTransitionObject",
    reqs: "CRK1-R040, CRK1-R004, CRK1-R043",
    inv: "K3, K5, P-1",
    cts: "CTS-M4",
    fia: "FIA-Mechanical",
    receipt: "state_transition_log",
    inputId: "execution_plan.id",
    inputProps: ["`id`", "`governance_decision_id`", "`plan`", "`timestamp`"],
    outputId: "state_transition.id",
    outputProps: ["`id`", "`execution_plan_id`", "`transition` (before/after state hashes)", "`timestamp`"],
    pre: ["Execution plan valid and complete.", "Runtime not in halt state."],
    post: ["State transition explicit.", "No hidden state mutation (R008).", "No in-place mutation.", "PL-1.1 provenance entry (R043)."],
    fn: `f_state_transition(ExecutionPlanObject ep, assumptions, policy_versions) → RuntimeStateTransitionObject rst
  where rst.execution_plan_id = ep.id
    and rst.transition = apply_plan(ep.plan, assumptions)`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["RuntimeStateTransitionObject", "Transition logs", "Replay snapshot", "PL-1.1 provenance entry"],
    trace: "CRK1-R040, R004 → ADR-003/004 → nova-studio/runtime → CTS-M4 → RuntimeStateTransitionObject → PL-1.1",
    implPath: "nova-studio/server/runtime/",
  },
  {
    file: "state-transition-to-receipt.md",
    title: "Runtime State Transition to Receipt",
    tn: "T09",
    slug: "state-transition-to-receipt",
    input: "RuntimeStateTransitionObject",
    output: "GovernanceReceipt",
    reqs: "CRK1-R042, CRK1-R011, CRK1-R012, CRK1-R030, CRK1-R033, CRK1-R043",
    inv: "K10, K12, P-1",
    cts: "CTS-G1, CTS-G2, CTS-G3",
    fia: "FIA-Governance",
    receipt: "REC-HDR-1.0",
    inputId: "state_transition.id",
    inputProps: ["`id`", "`execution_plan_id`", "`transition`", "`timestamp`"],
    outputId: "receipt.id",
    outputProps: ["`id`", "`transition_id`", "`invariant_block`", "`evidence_block`", "`traceability_block`", "`merkle_root`", "`timestamp`"],
    pre: ["Transition valid.", "GovernanceContract enforcement enabled."],
    post: ["Receipt generated and Merkle-anchored.", "REC-HDR-1.0 schema satisfied (R033).", "No in-place mutation.", "PL-1.1 provenance entry (R043)."],
    fn: `f_receipt(RuntimeStateTransitionObject rst, assumptions, policy_versions) → GovernanceReceipt r
  where r.transition_id = rst.id
    and r.invariant_block = evaluate_invariants(rst, assumptions)
    and r.merkle_root = anchor_merkle(r)`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["GovernanceReceipt", "Merkle anchor", "PL-1.1 provenance entry"],
    trace: "CRK1-R042 → ADR-003/004 → src/governance/receipts.js → CTS-G1–G3 → GovernanceReceipt → PL-1.1",
    implPath: "src/governance/receipts.js",
  },
  {
    file: "receipt-to-provenance.md",
    title: "Receipt to Provenance Entry",
    tn: "T10",
    slug: "receipt-to-provenance",
    input: "GovernanceReceipt",
    output: "ProvenanceEntry",
    reqs: "CRK1-R030, CRK1-R043",
    inv: "K10, P-1",
    cts: "CTS-G3",
    fia: "FIA-Governance",
    receipt: "ledger_hash",
    inputId: "receipt.id",
    inputProps: ["`id`", "`transition_id`", "`invariant_block`", "`merkle_root`", "`timestamp`"],
    outputId: "provenance_entry.entry_id",
    outputProps: ["`entry_id`", "PL-1.1 binding fields (authority, spec, impl, assumptions)", "`receipt_id`", "`provenance_hash`", "`parent_hash`", "`timestamp`"],
    pre: ["Receipt valid against REC-HDR-1.0.", "Ledger append-only mode active."],
    post: ["Ledger append-only.", "Hash chain continuity.", "No in-place mutation.", "Full PL-1.1 context recorded (R043)."],
    fn: `f_provenance(GovernanceReceipt r, authority_id, spec_id, impl_id, assumptions) → ProvenanceEntry p
  where p.receipt_id = r.id
    and p.provenance_hash = hash(p)
    and p.parent_hash = ledger_tip()`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable · Assumption-aware",
    evidence: ["ProvenanceEntry", "Ledger hash continuity proof"],
    trace: "CRK1-R030 → ADR-003/004 → continuity_ledger → CTS-G3 → ProvenanceEntry → PL-1.1",
    implPath: "governance/continuity_ledger.py",
  },
  {
    file: "provenance-to-lineage.md",
    title: "Provenance Entry to Lineage Update",
    tn: "T11",
    slug: "provenance-to-lineage",
    input: "ProvenanceEntry",
    output: "LineageNode",
    reqs: "CRK1-R012, CRK1-R030, CRK1-R043",
    inv: "K6, P-1",
    cts: "CTS-S3",
    fia: "FIA-Governance",
    receipt: "lineage_hash",
    inputId: "provenance_entry.entry_id",
    inputProps: ["`entry_id`", "PL-1.1 fields", "`receipt_id`", "`provenance_hash`", "`parent_hash`", "`timestamp`"],
    outputId: "lineage_node.id",
    outputProps: ["`id`", "`provenance_entry_id`", "`lineage_hash`", "`timestamp`"],
    pre: ["Ledger hash valid.", "Parent chain intact."],
    post: ["Lineage graph updated (append-only).", "Lineage hash derivable from provenance chain.", "No in-place mutation.", "PL-1.1 context preserved (R043)."],
    fn: `f_lineage(ProvenanceEntry p, assumptions) → LineageNode ln
  where ln.provenance_entry_id = p.entry_id
    and ln.lineage_hash = hash_lineage(p)`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["LineageNode", "Lineage graph export", "PL-1.1 provenance entry"],
    trace: "CRK1-R012 → ADR-003/004 → lineage.js → CTS-S3 → LineageNode → PL-1.1",
    implPath: "src/singularity/lineage.js",
  },
  {
    file: "lineage-to-drift-update.md",
    title: "Lineage Update to Drift Envelope Update",
    tn: "T12",
    slug: "lineage-to-drift-update",
    input: "LineageNode",
    output: "DriftEnvelopeUpdate",
    reqs: "CRK1-R041, CRK1-R022, CRK1-R043",
    inv: "K9, P-1",
    cts: "CTS-D1, CTS-D2, CTS-D3",
    fia: "FIA-Semantic",
    receipt: "drift_audit",
    inputId: "lineage_node.id",
    inputProps: ["`id`", "`provenance_entry_id`", "`lineage_hash`", "`timestamp`"],
    outputId: "drift_update.id",
    outputProps: ["`id`", "`lineage_node_id`", "`CE_delta`", "`SE_delta`", "`timestamp`"],
    pre: ["Lineage valid.", "Prior drift envelopes available."],
    post: ["CE and SE monotonic (R041).", "Drift deltas recorded.", "No in-place mutation.", "Loop closure: ready for next DecisionObject.", "PL-1.1 provenance entry (R043)."],
    fn: `f_drift(LineageNode ln, assumptions) → DriftEnvelopeUpdate de
  where de.lineage_node_id = ln.id
    and (de.CE_delta, de.SE_delta) = compute_drift(ln, assumptions)
    and CE_new >= CE_prev and SE_new >= SE_prev`,
    fnConstraints: "Deterministic · Total · Replayable · Traceable",
    evidence: ["DriftEnvelopeUpdate", "Drift audit report", "PL-1.1 provenance entry"],
    trace: "CRK1-R041 → ADR-003/004 → drift engine → CTS-D1–D3 → DriftEnvelopeUpdate → PL-1.1",
    implPath: "src/crk1/, drift engine",
  },
];

function renderContract(c) {
  const specId = `${c.tn}/${c.slug}/v1.0`;
  const assumptions = {
    items: [...DEFAULT_ASSUMPTIONS.items, ...(c.assumptionsExtra ?? [])],
    policies: c.policies ?? DEFAULT_ASSUMPTIONS.policies,
    mode: DEFAULT_ASSUMPTIONS.mode,
  };

  const list = (items) => items.map((x) => `- ${x}`).join("\n");
  const props = (items) => items.map((x) => `- ${x}`).join("\n");

  return `# Transformation Contract: ${c.title}

## 1. Authority

**Authority ID:** \`${DEFAULT_AUTH.authority_id}\`  
**Authority Type:** \`${DEFAULT_AUTH.authority_type}\`  
**Authority Version:** \`${DEFAULT_AUTH.authority_version}\`  
**Description:** ${DEFAULT_AUTH.authority_desc}

## 2. Transformation Specification

**Specification ID:** \`${specId}\`  
**Specification Name:** \`${c.title}\`  
**Specification Version:** \`v1.0\`  
**Normative Requirements:** ${c.reqs}  
**Invariants:** ${c.inv}

## 3. Implementation

**Implementation ID:** \`${DEFAULT_IMPL.implementation_id}\`  
**Implementation Name:** \`${DEFAULT_IMPL.implementation_name}\`  
**Implementation Version:** \`${DEFAULT_IMPL.implementation_version}\`  
**Claims Conformance To:** \`${specId}@v1.0\`  
**Runtime Context:** \`${DEFAULT_IMPL.runtime}\`

## 4. Assumptions & Policy Versions

**Assumptions:**

${list(assumptions.items)}

**Active Policy Versions:**

${assumptions.policies.map((p) => `- \`${p}\``).join("\n")}

**Evaluation Mode:** \`${assumptions.mode}\`

## 5. Input Artifact

**Type:** ${c.input}  
**Identifier:** \`${c.inputId}\`  
**Required Properties:**

${props(c.inputProps)}

## 6. Output Artifact

**Type:** ${c.output}  
**Identifier:** \`${c.outputId}\` (new, distinct)  
**Guaranteed Properties:**

${props(c.outputProps)}

## 7. Preconditions

${list(c.pre)}

## 8. Postconditions

${list(c.post)}

## 9. Transformation Function

**Formal Definition:**

\`\`\`
${c.fn}
\`\`\`

**Constraints:** ${c.fnConstraints}

## 10. Verification Method

**CTS Tests:** ${c.cts}  
**Audits:** ${c.fia}  
**Receipts:** \`${c.receipt}\`  
**Ledger:** hash continuity checks (PL-1.1)

## 11. Evidence Produced

${list(c.evidence)}

## 12. Traceability Links

\`\`\`
${c.trace}
\`\`\`

| Link | Reference |
|------|-----------|
| ADR | [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md) |
| Requirement | ${c.reqs.split(", ")[0]} |
| Implementation | \`${c.implPath}\` |
| CTS | ${c.cts.split(",")[0].trim()} |
| Provenance | PL-1.1 |

## 13. Version

**Contract Version:** v1.0 (four-layer binding per CA-1.1)
`;
}

for (const c of CONTRACTS) {
  const path = join(dir, c.file);
  writeFileSync(path, renderContract(c), "utf8");
  console.log(`Updated ${c.file}`);
}
