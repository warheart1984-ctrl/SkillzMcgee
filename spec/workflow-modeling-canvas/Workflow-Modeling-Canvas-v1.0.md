# Workflow Modeling Canvas v1.0

**Version:** 1.0 Â· **Status:** Normative Â· **Methodology:** [CMS-1.0](./CMS-1.0.md)

The Workflow Modeling Canvas is a governed consulting framework that enforces evidence-first reasoning, explicit semantic boundaries, traceable recommendations, reproducible analysis, and founder-independent methodology.

---

## Layer 1 â€” Current State (Observation Layer)

**Purpose:** Capture what actually happens, not what stakeholders believe happens.

### Fields

| Field | Description |
|-------|-------------|
| Actors | People, roles, systems performing work |
| Inputs | Materials, data, triggers entering the workflow |
| Triggers | Events that start or advance work |
| Steps | Sequential or parallel actions observed |
| Tools | Software, documents, physical tools used |
| Handoffs | Transitions between actors or systems |
| Wait states | Queues, approvals, blocked periods |
| Bottlenecks | Constraints limiting throughput |
| Risks | Failure, compliance, or operational hazards |
| Artifacts produced | Outputs created during the workflow |

**Output artifact:** **Observation Set** (`observation-set.schema.json`)

**Rule:** No interpretation in this layer â€” raw facts only.

---

## Layer 2 â€” Analysis (Interpretation Layer)

**Purpose:** Derive meaning from observations.

### Fields

| Field | Description |
|-------|-------------|
| Patterns | Recurring structures across observations |
| Friction points | Where work slows or fails |
| Failure modes | How the workflow breaks down |
| Decision points | Where choices branch the flow |
| Automation opportunities | Candidates for tooling or orchestration |
| Governance gaps | Missing controls, approvals, or audit trails |
| Compliance risks | Regulatory or policy exposure |
| Cost/time inefficiencies | Quantifiable waste |

**Output artifact:** **Findings Set** (`findings-set.schema.json`)

**Rule:** Every finding **MUST** cite at least one Observation ID.

---

## Layer 3 â€” Future State (Governance Layer)

**Purpose:** Define what should change and why.

### Fields

| Field | Description |
|-------|-------------|
| Recommendations | Proposed interventions |
| Expected outcomes | Improvements if recommendations land |
| Required capabilities | Skills, systems, or org changes |
| Governance implications | Stewardship, approval, or policy impact |
| Implementation constraints | Budget, timeline, technical limits |
| Dependencies | Ordering and prerequisite work |

**Output artifacts:** **Recommendation Set**, **Expected Outcome Set**

**Rule:** Every recommendation **MUST** cite at least one Finding ID.

---

## Layer 4 â€” Evidence Chain (Traceability Layer)

**Purpose:** Ensure every recommendation is grounded in observed reality.

### Canonical chain

```
Observation â†’ Finding â†’ Recommendation â†’ Expected Outcome â†’ Success Metric
```

**Output artifacts:** **Success Metric Set**, **Traceability Map**

**Rule:** The traceability map **MUST** be monotonic â€” no orphan nodes, no backward-only links.

---

## Canvas summary

| Layer | Name | Produces |
|-------|------|----------|
| 1 | Observation | Observation Set |
| 2 | Analysis | Findings Set |
| 3 | Future State | Recommendation Set, Expected Outcome Set |
| 4 | Evidence Chain | Success Metric Set, Traceability Map |

A valid engagement **MUST** produce all six artifact sets plus a complete traceability map.

**Envelope schema:** [canvas-v1.0.schema.json](./canvas-v1.0.schema.json)
