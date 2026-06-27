# Binding Integration Conformance (AAIS-VB-Î›-ADD-001)

Reconciles **The Voss Binding (Î›) v1.0.0** with **Negotiant Core Whitepaper v1.0.0**.

| Field | Value |
|---|---|
| Document ID | AAIS-VB-Î›-ADD-001 |
| Status | DRAFT â€” pending Operator ratification |
| Source | `binding-integration-addendum-v1.0.md` |

## Parent artifacts

| Artifact | Repo path / reference |
|---|---|
| Voss Binding (Î›) | External: `The Voss Binding - Unified Runtime Calculus.pdf` |
| Negotiant Core v1.0 | `governance/standards/theta/canon/negotiant-core.md` |
| Evidence ledger schema | `governance/standards/theta/canon/evidence-ledger-schema.md` |

## Invariants (from Addendum)

| ID | Rule | Audit |
|---|---|---|
| U-1 | Single source of historical truth â€” no parallel audit log | `npm run binding:audit` |
| U-2 | GRVL â‰¡ GRE Stage 2 for Negotiant Core â€” one governance check | `npm run binding:audit` |
| U-3 | Containment without correction â€” no auto-fix at drift > 0.30 | `npm run binding:audit` |
| U-4 | `Î»_version` subordination + `recertificationTick` on Î› MAJOR | `npm run binding:audit` |

## Run

```bash
npm run binding:audit
npm run test:binding
```

Produces JSON report at `.runtime/binding-conformance-report.json`.
