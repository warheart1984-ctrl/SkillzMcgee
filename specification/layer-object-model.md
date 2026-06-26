# Layer Object Model (Authority, Specification, Implementation)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative  
**Amendment:** [CA-1.1](./constitutional-amendments/CA-1.1-four-layer-provenance.md)  
**ADRs:** [ADR-003](../meta/adrs/ADR-003-four-layer-separation.md), [ADR-004](../meta/adrs/ADR-004-transformation-context-invariant.md)

Non-loop artifacts that bind the four-layer provenance model. Execution-layer artifacts (loop stages, receipts, provenance entries) are defined in [semantic-artifact-types.md](./semantic-artifact-types.md).

## SpecificationObject

```typescript
SpecificationObject = {
  spec_id: ID,
  name: string,
  version: string,              // vX.Y
  description: string,
  authority_id: ID,             // links to AuthorityObject
  normative_requirements: string[],  // "CRK1-R###", ...
  invariants: string[],         // "K#", "P-1", ...
  contracts: string[],          // "T01/decision-to-outcome/v1.0", ...
  status: "active" | "deprecated" | "experimental"
}
```

**Example:** `T01/decision-to-outcome/v1.0` — see [transformation-contracts/decision-to-outcome.md](./transformation-contracts/decision-to-outcome.md)

## AuthorityObject

```typescript
AuthorityObject = {
  authority_id: ID,
  type: "GovernancePolicy" | "ConstitutionalAmendment" | "StewardCouncilDecision",
  version: string,              // vX.Y
  description: string,
  scope: "specification" | "implementation" | "execution",
  status: "active" | "superseded"
}
```

**Examples:**

| authority_id | type | scope |
|--------------|------|-------|
| `steward-council/v1.0` | StewardCouncilDecision | execution |
| `CA-1.1/four-layer-provenance` | ConstitutionalAmendment | specification |
| `governance-policy/continuity/v1.0` | GovernancePolicy | implementation |

## ImplementationObject

```typescript
ImplementationObject = {
  implementation_id: ID,
  name: string,
  version: string,              // vX.Y.Z
  spec_id: ID,                  // claims conformance to this spec
  spec_version: string,         // vX.Y
  runtime: string,              // e.g. "MRI-1.0", "VendorRuntime-A"
  conformance_profile: "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6",
  status: "active" | "deprecated" | "experimental"
}
```

**Example:** `MRI-1.0/nova-studio-pipeline/1.0.0` claims `T01/decision-to-outcome/v1.0` at conformance profile C3.

## Relationships

```
AuthorityObject ──authorizes──► SpecificationObject
SpecificationObject ◄──claims── ImplementationObject
ImplementationObject ──performs──► Execution (loop + PL-1.1 entries)
```

## Traceability

| Object | Requirements |
|--------|----------------|
| AuthorityObject | R032, R042 |
| SpecificationObject | R010, R012, R036 |
| ImplementationObject | R037, R043 |
| Full chain | ADR-003, ADR-004, R043 |

See [four-layer-provenance-model.md](./four-layer-provenance-model.md).
