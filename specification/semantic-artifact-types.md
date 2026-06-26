# Semantic Artifact Type System (v1.0)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative  
**Base model:** [object-model.md](./object-model.md) (COM-1.0 core five)  
**Loop:** [constitutional-loop-v1.0.md](./constitutional-loop-v1.0.md)

Version 1.0 recognizes **thirteen semantic artifact types** across the twelve-stage loop. The first five are COM-1.0 canonical objects; stages six through twelve introduce governance and continuity artifacts.

## A. Primitive types

| Type | Definition |
|------|------------|
| `ID` | Globally unique identifier (unguessable string) |
| `Timestamp` | ISO8601 datetime |
| `Hash` | Cryptographic hash (hex or base64) |
| `Frame` | Interpretive frame identifier |

## B. Semantic artifact types

### 1. DecisionObject (COM-1.0)

```typescript
DecisionObject = {
  id: ID,
  actor: IdentityObject,
  payload: unknown,
  timestamp: Timestamp
}
```

### 2. OutcomeObject (COM-1.0)

```typescript
OutcomeObject = {
  id: ID,
  decision_id: ID,
  result: unknown,
  timestamp: Timestamp
}
```

### 3. EvidenceObject (COM-1.0)

```typescript
EvidenceObject = {
  id: ID,
  outcome_id: ID,
  data: unknown,
  timestamp: Timestamp
}
```

### 4. InterpretationObject (COM-1.0)

```typescript
InterpretationObject = {
  id: ID,
  evidence_id: ID,
  interpretation: unknown,
  frames_used: Frame[],
  timestamp: Timestamp
}
```

### 5. PolicyEvaluationObject

```typescript
PolicyEvaluationObject = {
  id: ID,
  interpretation_id: ID,
  evaluation: unknown,
  timestamp: Timestamp
}
```

### 6. PolicyOutcomeObject

```typescript
PolicyOutcomeObject = {
  id: ID,
  policy_evaluation_id: ID,
  outcome: unknown,
  timestamp: Timestamp
}
```

### 7. GovernanceDecisionObject

```typescript
GovernanceDecisionObject = {
  id: ID,
  policy_outcome_id: ID,
  decision: unknown,
  timestamp: Timestamp
}
```

### 8. ExecutionPlanObject

```typescript
ExecutionPlanObject = {
  id: ID,
  governance_decision_id: ID,
  plan: unknown,
  timestamp: Timestamp
}
```

### 9. RuntimeStateTransitionObject

```typescript
RuntimeStateTransitionObject = {
  id: ID,
  execution_plan_id: ID,
  transition: unknown,
  timestamp: Timestamp
}
```

### 10. GovernanceReceipt (REC-HDR-1.0)

```typescript
GovernanceReceipt = {
  id: ID,
  transition_id: ID,
  header: { schema: "REC-HDR-1.0" },
  invariant_block: string[],
  evidence_block: string[],
  traceability_block: TraceabilityBlock,
  merkle_root: Hash,
  timestamp: Timestamp
}
```

### 11. ProvenanceEntry (PL-1.1)

**Supersedes PL-1.0** for new conformance claims. PL-1.0 entries remain valid for legacy ledgers.

```typescript
ProvenanceEntry = {
  id: ID,
  input_artifact_id: ID,
  output_artifact_id: ID,
  transformation_spec_id: ID,   // SpecificationID
  implementation_id: ID,        // ImplementationID
  authority_id: ID,             // AuthorizedBy
  assumptions: {
    policy_version: string,
    evaluation_mode: string,    // strict | audit | replay
    constitution_version: string,
    frame_set_version?: string
  },
  receipt_id: ID,
  parent_hash: Hash,
  entry_hash: Hash,
  timestamp: Timestamp
}
```

**Invariant P-1 (R043):** All binding fields required for transformation provenance.

### Layer identity types (non-loop artifacts)

```typescript
AuthorityRecord = {
  id: ID,                        // authority_id
  charter_version: string,
  council_term: string,
  active_policy_version: string,
  timestamp: Timestamp
}

SpecificationRecord = {
  id: ID,                        // transformation_spec_id
  contract_path: string,
  contract_version: string,
  requirements: string[],         // CRK1-R###
  timestamp: Timestamp
}

ImplementationRecord = {
  id: ID,                        // implementation_id
  spec_id: ID,
  module_path: string,
  semver: string,
  conformance_profile: string,    // C0–C6
  timestamp: Timestamp
}
```

### 12. LineageNode

```typescript
LineageNode = {
  id: ID,
  provenance_entry_id: ID,
  lineage_hash: Hash,
  timestamp: Timestamp
}
```

### 13. DriftEnvelopeUpdate

```typescript
DriftEnvelopeUpdate = {
  id: ID,
  lineage_node_id: ID,
  CE_delta: number,
  SE_delta: number,
  timestamp: Timestamp
}
```

## C. COM-1.0 relationship

COM-1.0 defines the **core five** objects (Identity, Decision, Outcome, Evidence, Interpretation). Governance artifacts (types 5–13) extend the loop without replacing COM-1.0 — they are constitutionally declared in CA-1.0 and verified by transformation contracts T05–T12.

## D. Requirements mapping

| Types | Requirements |
|-------|----------------|
| 1–4 | R013–R017, R001–R003 |
| 5–9 | R040, R042 |
| 10 | R033, R011, R012 |
| 11–12 | R030, R012 |
| 13 | R041, R022 |
| PL-1.1 bindings | R043, P-1, CA-1.1 |

See [four-layer-provenance-model.md](./four-layer-provenance-model.md).
