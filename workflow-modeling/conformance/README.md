# WMC-CTS-1.0 â€” Workflow Modeling Conformance Test Suite

**Version:** 1.0 Â· **Suite:** [WMS-1.0](../README.md)

Conformance layer for CMS-1.0 engagements.

---

## Compliance Profiles

| Profile | Name | Requirement |
|---------|------|-------------|
| **W0** | Schema + CMS invariants | Canvas validates; all citation links present |
| **W1** | Traceability complete | Every recommendation in traceability map; monotonic chains |
| **W2** | Operator reviewed | `operatorReviewed: true`; human sign-off recorded |
| **W3** | External audit ready | W2 + CAR/CRK evidence registration + independent replay |

---

## W0 â€” Automated (baseline)

```bash
npm run workflow-canvas:validate
```

Implementation: [`workflow-canvas/validate.ts`](../../workflow-canvas/validate.ts)

Checks CMS-1.0 invariants:

1. No recommendation without an observation (via findings)
2. No interpretation without evidence
3. No future state without traceability
4. No metric without a predicted outcome
5. Traceability map references valid IDs

---

## Requirement â†’ Test â†’ Evidence Mapping

| CMS Requirement | Test | Evidence |
|-----------------|------|----------|
| Â§3.1 No rec without obs | `validateCanvas` CMS-1 | `validation.issues[]` empty |
| Â§3.2 No finding without obs | `validateCanvas` CMS-2 | finding.observationIds |
| Â§3.4 No metric without outcome | `validateCanvas` CMS-4 | metric.expectedOutcomeIds |
| Â§5 Traceability | chain completeness | traceabilityMap.chains |
| Â§6 Reproducibility | same input â†’ same validate | CI workflow-canvas:validate |

---

## Evidence Ledger Schema

Canvas v1.0 envelope: [`canvas-v1.0.schema.json`](../../spec/workflow-modeling-canvas/canvas-v1.0.schema.json)

Per-artifact schemas in `spec/workflow-modeling-canvas/`.

---

## Status

W0 is implemented. W1â€“W3 profiles are specified; W2/W3 integrate with Nova Studio operator review and CRK-1 receipt registration (future).
