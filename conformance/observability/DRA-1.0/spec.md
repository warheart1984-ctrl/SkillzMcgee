# Dependency-Risk Analyzer (DRA-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative — derived prioritization instrumentation  
**Implementation:** `tools/generators/dra-analyze.mjs`

## Purpose

Identify which missing or incomplete canonical artifacts create the **largest downstream impact** on the constitutional proof graph. Turns COR-1.0 from a passive health report into a **prioritization engine**.

## Inputs

| Input | Path |
|-------|------|
| Proof-Graph Index | `conformance/proof-graph/index.json` |
| COR-1.0 | `meta/COR-1.0.json` |
| CSR-1.0 | `conformance/observability/CSR-1.0/registry.json` |
| Transformation Records | `conformance/proof-graph/transformation-records/` |
| Traceability Matrix | `conformance/traceability-matrix.json` |
| Canonical Artifact Registry | `conformance/proof-graph/canonical-derived-registry.json` |

## Core functions

### A. Downstream impact score

For any missing or incomplete artifact:

```
impact_score = number_of_downstream_nodes_blocked
```

Downstream nodes include requirements that cannot reach evidence, implementations that cannot reach verification, receipts that cannot anchor into provenance, and provenance chains that cannot close.

### B. Upstream dependency score

For unresolved assumptions or missing authority/spec:

```
dependency_score = number_of_upstream_nodes_required_to_satisfy_closure
```

### C. Bottleneck identification

```json
{
  "top_blockers": [
    {
      "artifact_id": "EVID-R020",
      "impact_score": 14,
      "blocked_requirements": ["CRK1-R020", "CRK1-R021"],
      "blocked_verifications": ["CTS-M3"],
      "blocked_provenance": ["PROV-R020"]
    }
  ],
  "top_unresolved_assumptions": [
    {
      "assumption": "PL-1.1 runtime binding",
      "impact_score": 43
    }
  ]
}
```

## Queries

| Query | CLI |
|-------|-----|
| Top blockers | `crk dra top-blockers` |
| Unresolved assumptions | `crk dra unresolved-assumptions` |
| Impact of node | `crk dra impact-of <NODE_ID>` |
| What unblocks requirement | `crk dra what-unblocks <REQ_ID>` |

## Non-authoritative guarantee

DRA computes state from canonical artifacts. It **informs** governance; it does not decide it. See [SGDF-1.0](../../certification/SGDF-1.0.md).
