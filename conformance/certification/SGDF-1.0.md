# Steward Governance Decision Framework (SGDF-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — Version 1.0 governance layer  
**Related:** [stewardship-charter.md](../../meta/stewardship-charter.md), [steward-council-governance-process.md](../../meta/steward-council-governance-process.md)

## Purpose

Define how stewards use COR-1.0, CSR-1.0, DRA-1.0, and CAV-1.0 to make governance decisions — **without mixing measurement and governance**.

## A. Inputs to governance

Stewards consume:

| Instrument | Role |
|------------|------|
| COR-1.0 | Constitutional state |
| CSR-1.0 | Claim maturity |
| DRA-1.0 | Dependency risk / prioritization |
| CAV-1.0 | Canonical validity |
| [RCD-1.0](./RCD-1.0.md) | Published release thresholds |
| [ORC-1.0](./ORC-1.0.md) | Pre-vote readiness checklist |

Stewards do **not** consume hand-written reports, manually edited manifests, or subjective assessments as authoritative.

## B. Governance questions

1. Does the measured state satisfy the release criteria?
2. Are any risks unacceptable?
3. Should unresolved assumptions block release?
4. Should missing evidence delay verification?
5. Should research claims be deferred to v1.1 or v2.0?

## C. Governance does NOT decide

- What is implemented
- What is verified
- What evidence exists
- What provenance is intact

Those are **measured** by COR-1.0 and CSR-1.0.

## D. Decision flow

```
1. Validate canonical artifacts (CAV-1.0)
2. Regenerate derived state (DARP-1.0)
3. Measure constitutional state (COR-1.0)
4. Classify claims (CSR-1.0)
5. Analyze dependency risk (DRA-1.0)
6. Compare COR-1.0 to [RCD-1.0](./RCD-1.0.md)
7. Confirm [ORC-1.0](./ORC-1.0.md) readiness
8. Steward Council votes per [SCVP-1.0](./SCVP-1.0.md)
9. Record decision in [GLS-1.0](../../governance/governance-ledger/GLS-1.0.md)
```

## E. Release criteria

Published in [RCD-1.0](./RCD-1.0.md). Evaluate live state:

```bash
node tools/crk.mjs rcd evaluate
```

Stewards decide whether **measured** state satisfies RCD — not whether criteria should be waived without record.

## F. Governance output

```json
{
  "decision": "approve | reject | defer",
  "rationale": [
    "All critical requirements verified",
    "No broken provenance chains",
    "Two research claims deferred to v1.1"
  ],
  "timestamp": "<ISO8601>",
  "stewards": ["<names>"],
  "inputs": {
    "cor_proof_closure": "pass | fail",
    "cav_status": "pass | fail",
    "dra_top_blocker": "<artifact_id>"
  }
}
```

Template: [governance-decision-template.json](./governance-decision-template.json)

## Separation principle

| Layer | Question |
|-------|----------|
| Measurement | What is the state? |
| Governance | Is that state acceptable for release? |

DRA informs **where to work next**; SGDF decides **whether to ship**.
