# Explain-This-Node Engine

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative specification  
**Implementation:** `tools/generators/explain-node.mjs`

## Purpose

Turn the proof graph from **navigable** into **explanatory** by answering why any node exists and what depends on it.

## Inputs

| Input | Path |
|-------|------|
| Proof-Graph Index | `conformance/proof-graph/index.json` |
| COR-1.0 | `meta/COR-1.0.json` |
| CSR-1.0 | `conformance/observability/CSR-1.0/registry.json` |
| Transformation Records | `conformance/proof-graph/transformation-records/` |
| Traceability Matrix | `conformance/traceability-matrix.json` |

## Core query

```
EXPLAIN NODE <NODE_ID>
```

CLI:

```bash
crk explain NODE <NODE_ID>
node tools/crk.mjs explain NODE CRK1-R012
node tools/crk.mjs explain NODE steward-council/v1.0
node tools/crk.mjs explain NODE T01/decision-to-outcome/v1.0
```

## Output schema

For any node (`Requirement`, `Authority`, `Specification`, `Implementation`, `Evidence`, `Receipt`, `Provenance`, `Transformation`, `Verification`):

```json
{
  "node_id": "<NODE_ID>",
  "node_type": "Requirement | Authority | Specification | Implementation | Evidence | Receipt | Provenance | Transformation | Verification",
  "exists_because": [
    "linked_from <PARENT_NODE_ID>",
    "authorized_by <AUTH_ID>",
    "required_by <REQ_ID>"
  ],
  "authorized_by": ["<AUTH_ID>"],
  "defined_by_spec": ["<SPEC_ID>"],
  "depends_on": ["<NODE_ID_1>", "<NODE_ID_2>"],
  "supports": ["<DOWNSTREAM_NODE_ID_1>", "<DOWNSTREAM_NODE_ID_2>"],
  "evidence_supporting": ["<EVID_ID_1>", "<EVID_ID_2>"],
  "would_fail_if_removed": [
    "Requirement R020 loses verification",
    "Implementation IMPL-001 becomes untrusted",
    "Proof closure fails for R010"
  ],
  "claim_status": "normative | implemented | verified | reproduced | research",
  "cor_context": {
    "implementation_status": "complete | partial | missing",
    "verification_status": "complete | partial | missing",
    "exceptions": ["..."]
  }
}
```

## Behavior

1. **Resolve** `NODE_ID` to type via proof-graph index prefix or pattern (`CRK1-R###`, `T##/`, `steward-council/`, `MRI-1.0/`, `CTS-`, `entry:`, `EVID-`, `REC-`, `PROV-`, `TR-`).
2. **Traverse upstream** — authorization chain, parent specs, governing requirements.
3. **Traverse downstream** — dependents, supported requirements, implementations that claim this spec.
4. **Attach maturity** — `claim_status` from CSR-1.0; dimension statuses and `exceptions` from COR-1.0.
5. **Compute removal impact** — list requirements and gates that would fail if this node were removed.

## Non-authoritative guarantee

The engine explains **current computed state** from canonical artifacts. It does not upgrade claim status or invent edges.

## REST (future)

```
GET /v1/graph/nodes/{node_id}/explain
```

Returns the same JSON envelope as the CLI.
