# Canonical Artifact Validator (CAV-1.0)

**Authority:** CRK-1 Conformance v1.0  
**Status:** Normative  
**Implementation:** `tools/generators/cav-validate.mjs`

## Purpose

Ensure all canonical artifacts are structurally valid, internally consistent, and free of contradictions. The **constitutional lint checker**.

## Validation rules

### A. Identity and structure

- Every canonical artifact has a unique ID
- IDs follow canonical naming conventions
- Every artifact satisfies its schema

### B. Referential integrity

- Every reference points to an existing canonical artifact
- No dangling references
- No circular authority chains
- No spec authorized by a derived artifact

### C. Temporal integrity

- Versions are monotonic within artifact families
- Provenance timestamps non-decreasing (when ledger present)
- Receipts do not predate their evidence

### D. Constitutional integrity

- Every implementation claims conformance to exactly one spec version
- Every transformation references valid authority, spec, and implementation
- No canonical artifact depends on a derived artifact

## Output

```json
{
  "status": "pass | fail",
  "errors": [
    "IMPL-003 references missing SPEC-009",
    "PROV-221 has non-monotonic timestamp"
  ],
  "warnings": [
    "SPEC-004 is authorized by deprecated AUTH-001"
  ]
}
```

## CLI

```bash
crk validate canonical
node tools/crk.mjs validate canonical [--fail-on-error]
```

Exit `0` on pass, `1` on fail.
