# Counterfactual Analysis Engine

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative specification  
**Implementation:** `tools/generators/counterfactual.mjs`

## Purpose

Answer **"what breaks if X changes?"** using the constitutional proof graph.

## Core queries

```
COUNTERFACTUAL REMOVE NODE <NODE_ID>
COUNTERFACTUAL DOWNGRADE CLAIM <REQ_ID> FROM <FROM_STATUS> TO <TO_STATUS>
COUNTERFACTUAL REMOVE EVIDENCE <EVID_ID>
```

CLI:

```bash
crk counterfactual remove NODE CRK1-R012
crk counterfactual downgrade CLAIM CRK1-R020 verified implemented
crk counterfactual remove EVIDENCE EVID-R020
```

## Output schema

```json
{
  "scenario": "REMOVE NODE <NODE_ID>",
  "impacted_requirements": ["CRK1-R020", "CRK1-R021"],
  "impacted_implementations": ["MRI-1.0/nova-studio-pipeline/1.0.0"],
  "regressed_claims": [
    { "requirement_id": "CRK1-R020", "from": "verified", "to": "implemented" }
  ],
  "failed_release_gates": ["proof_closure", "reproduction"],
  "notes": [
    "Removing CRK1-R012 breaks traceability closure for R036 and R037",
    "MRI-1.0/nova-studio-pipeline loses CTS-S5 verification path"
  ]
}
```

## Behavior

1. **Simulate** the scenario by temporarily removing edges/nodes (in-memory; never mutates canonical artifacts).
2. **Recompute** impacted requirements via downstream traversal from the removed node.
3. **Infer claim regression** — if verification path breaks, downgrade `verified` → `implemented` or `implemented` → `normative` as appropriate.
4. **Evaluate release gates** — `proof_closure`, `reproduction`, `csr_completeness`, `hash_continuity`.
5. **Emit notes** — human-readable consequences.

## Scenarios

| Scenario | Effect |
|----------|--------|
| Remove requirement | Orphans specs/CTS links; breaks forward closure |
| Remove authority | Illegitimizes all specs authorized by that authority |
| Remove spec | Untrusts implementations claiming conformance |
| Remove implementation | Loses execution records; requirements lose implementation status |
| Remove evidence | Downgrades verified claims; may break receipt anchoring |
| Downgrade claim | Documents intentional maturity reduction (audit scenario) |

## Non-authoritative guarantee

Purely analytical. Counterfactual results are **not** written to CSR or COR unless explicitly regenerated after a real canonical change.

## REST (future)

```
POST /v1/graph/counterfactual
{ "scenario": "remove_node", "node_id": "CRK1-R012" }
```
