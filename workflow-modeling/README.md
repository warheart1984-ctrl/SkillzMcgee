# Workflow Modeling Suite (WMS-1.0)

The Workflow Modeling Suite provides a governed, evidence-based methodology for analyzing, improving, and validating organizational workflows. It is designed to be transparent, traceable, reproducible, and aligned with the CRK-1 evidence-first philosophy.

WMS-1.0 consists of four layers:

1. Specification - CMS-1.0
2. Conformance - WMC-CTS-1.0
3. Methodology - Canvas and templates
4. Nova Studio Agent - WM-A1.0

Every stage transforms exactly one semantic artifact into exactly one new semantic artifact.

---

## Architecture Overview

### Specification Layer

Defines the normative methodology:

- Observation
- Finding
- Recommendation
- Expected Outcome
- Success Metric
- Traceability Map

**Location:** [`../spec/workflow-modeling-canvas/`](../spec/workflow-modeling-canvas/README.md)

| Document | Path |
|----------|------|
| CMS-1.0 | [CMS-1.0.md](../spec/workflow-modeling-canvas/CMS-1.0.md) |
| Canvas v1.0 | [Workflow-Modeling-Canvas-v1.0.md](../spec/workflow-modeling-canvas/Workflow-Modeling-Canvas-v1.0.md) |
| JSON Schemas | [spec/workflow-modeling-canvas/*.schema.json](../spec/workflow-modeling-canvas/) |

### Conformance Layer

Defines how correctness is verified:

- Compliance profiles W0 through W3
- Test suite WMC-CTS-1.0
- Evidence ledger schema
- Requirement to test to evidence mapping

**Location:** [conformance/README.md](./conformance/README.md)
**Automated check:** `npm run workflow-canvas:validate`

### Methodology Layer

Provides operator and client-facing materials:

- Workflow Modeling Canvas v1.0
- Observation to Finding to Recommendation template
- Operator Guide (OWMP-1.0)
- Client Guide
- Examples

| Resource | Path |
|----------|------|
| Canvas spec | [Workflow-Modeling-Canvas-v1.0.md](../spec/workflow-modeling-canvas/Workflow-Modeling-Canvas-v1.0.md) |
| Evidence template | [Evidence-Chain-Template.md](../spec/workflow-modeling-canvas/Evidence-Chain-Template.md) |
| Operator Guide | [OWMP-1.0.md](../spec/workflow-modeling-canvas/OWMP-1.0.md) |
| Client Guide | [Client-Edition.md](../spec/workflow-modeling-canvas/Client-Edition.md) |
| Example canvas | [canvas-v1.0.example.json](../workflow-canvas/examples/canvas-v1.0.example.json) |
| Launch Kit | [launch-kit/LaunchKit.md](./launch-kit/LaunchKit.md) |

### Nova Studio Layer

AI-assisted modeling agent:

- Observation extraction
- Finding derivation
- Recommendation synthesis
- Outcome projection
- Metric definition
- Traceability assembly

| Resource | Path |
|----------|------|
| Agent spec | [WM-A1.0.md](../spec/workflow-modeling-canvas/WM-A1.0.md) |
| Agent workflow | [nova-studio/workflows/modeling-agent.json](./nova-studio/workflows/modeling-agent.json) |
| Operator UI | Nova Studio route `/nova/studio/workflow-canvas` |

---

## Evidence Chain

All modeling follows the canonical chain:

```text
Observation -> Finding -> Recommendation -> Expected Outcome -> Success Metric
```

This ensures:

- no ungrounded claims
- no hand-waving
- full traceability
- independent reproducibility

---

## Integration with CRK-1

| WMS Artifact | CRK-1 Equivalent |
|--------------|------------------|
| Observation | Evidence |
| Finding | Interpretation |
| Recommendation | Policy Evaluation |
| Expected Outcome | Policy Outcome |
| Success Metric | Drift Envelope |
| Traceability Map | Receipt Lineage |

---

## Quick Start

```bash
npm run workflow-canvas:validate
npm run workflow-canvas:validate -- path/to/canvas-v1.0.json
```

New consultants start with [Launch Kit](./launch-kit/LaunchKit.md).
Public messaging lives at [docs/website/messaging.md](../docs/website/messaging.md).

---

## Status

WMS-1.0 is stable and ready for consulting workflows, Nova Studio integration, and external audits.
