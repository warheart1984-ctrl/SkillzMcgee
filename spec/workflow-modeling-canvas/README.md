# Workflow Modeling Canvas (v1.0)

**Evidence-chain integrated consulting framework**

| Document | Audience |
|----------|----------|
| [Workflow-Modeling-Canvas-v1.0.md](./Workflow-Modeling-Canvas-v1.0.md) | Normative (4 layers) |
| [CMS-1.0.md](./CMS-1.0.md) | Consulting Methodology Specification |
| [Evidence-Chain-Template.md](./Evidence-Chain-Template.md) | Observation → Metric template |
| [Client-Edition.md](./Client-Edition.md) | Client-facing |
| [OWMP-1.0.md](./OWMP-1.0.md) | Internal operators / auditors |
| [WM-A1.0.md](./WM-A1.0.md) | Nova Studio agent protocol |

## Machine-readable artifacts

| Schema | Output artifact |
|--------|-----------------|
| [observation-set.schema.json](./observation-set.schema.json) | Observation Set |
| [findings-set.schema.json](./findings-set.schema.json) | Findings Set |
| [recommendation-set.schema.json](./recommendation-set.schema.json) | Recommendation Set |
| [expected-outcome-set.schema.json](./expected-outcome-set.schema.json) | Expected Outcome Set |
| [success-metric-set.schema.json](./success-metric-set.schema.json) | Success Metric Set |
| [traceability-map.schema.json](./traceability-map.schema.json) | Traceability Map |
| [canvas-v1.0.schema.json](./canvas-v1.0.schema.json) | Full Canvas v1.0 JSON |

## Implementation

| Path | Role |
|------|------|
| `skillzmcgee/workflow-canvas/` | Types, validation, example JSON |
| Nova Studio `/nova/studio/workflow-canvas` | Operator cockpit + agent review |

## CMS invariants (summary)

1. No recommendation without an observation.
2. No interpretation without evidence.
3. No future state without traceability.
4. No metric without a predicted outcome.
5. No change without governance.
