# Transformation Contract Index (T01–T12)

**Amendments:** [CA-1.0](../constitutional-amendments/CA-1.0-one-artifact-per-stage.md), [CA-1.1](../constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**ADRs:** [ADR-003](../../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../../meta/adrs/ADR-004-transformation-context-invariant.md)

| ID | Contract | Input → Output | Requirements | CTS |
|----|----------|----------------|--------------|-----|
| T01 | [decision-to-outcome](./decision-to-outcome.md) | DecisionObject → OutcomeObject | R001, K0 | M1 |
| T02 | [outcome-to-evidence](./outcome-to-evidence.md) | OutcomeObject → EvidenceObject | R002, K1 | M2 |
| T03 | [evidence-to-interpretation](./evidence-to-interpretation.md) | EvidenceObject → InterpretationObject | R003, R020–R022, K2, K7–K9 | M3, E1–E3 |
| T04 | [interpretation-to-policy-eval](./interpretation-to-policy-eval.md) | InterpretationObject → PolicyEvaluationObject | R040, R042 | G1 |
| T05 | [policy-eval-to-policy-outcome](./policy-eval-to-policy-outcome.md) | PolicyEvaluationObject → PolicyOutcomeObject | R040 | G1 |
| T06 | [policy-outcome-to-governance-decision](./policy-outcome-to-governance-decision.md) | PolicyOutcomeObject → GovernanceDecisionObject | R042, K12 | G1 |
| T07 | [governance-decision-to-execution-plan](./governance-decision-to-execution-plan.md) | GovernanceDecisionObject → ExecutionPlanObject | R040, R042 | G1 |
| T08 | [execution-plan-to-state-transition](./execution-plan-to-state-transition.md) | ExecutionPlanObject → RuntimeStateTransitionObject | R040 | M4 |
| T09 | [state-transition-to-receipt](./state-transition-to-receipt.md) | RuntimeStateTransitionObject → GovernanceReceipt | R042, R011, R012, R030 | G1–G3 |
| T10 | [receipt-to-provenance](./receipt-to-provenance.md) | GovernanceReceipt → ProvenanceEntry | R030, K10 | G3 |
| T11 | [provenance-to-lineage](./provenance-to-lineage.md) | ProvenanceEntry → LineageNode | R012, R030 | G3 |
| T12 | [lineage-to-drift-update](./lineage-to-drift-update.md) | LineageNode → DriftEnvelopeUpdate | R041, K9 | D1–D3 |

Each transformation: one input artifact, one output artifact, four-layer binding (sections 1–4), deterministic, replayable, traceable (CA-1.0, CA-1.1, R043).

**Template:** [template.md](./template.md) · **Loop:** [../constitutional-loop-v1.0.md](../constitutional-loop-v1.0.md)
