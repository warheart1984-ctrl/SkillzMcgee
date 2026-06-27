# Workflow Modeling Launch Kit (Consultant Edition)

Welcome to the Workflow Modeling Suite.

This kit gives you the operating path for a complete evidence-based workflow engagement.

**Suite overview:** [../README.md](../README.md)

---

## 1. Your Mission

You are not producing opinions. You are producing governed, traceable, reproducible workflow models.

Your job is to:

- capture reality
- analyze it
- recommend improvements
- predict outcomes
- define success metrics
- build a traceability chain

---

## 2. The Artifacts You Must Produce

1. Observation Set - raw facts about how work actually happens.
2. Findings Set - interpretations grounded in observations.
3. Recommendation Set - evidence-backed interventions.
4. Expected Outcome Set - predicted improvements.
5. Success Metric Set - how improvement will be validated.
6. Traceability Map - the assembled evidence chain.

---

## 3. The Evidence Chain

Every recommendation must trace back to an observation:

```text
Observation -> Finding -> Recommendation -> Expected Outcome -> Success Metric
```

If a link is missing, the model is invalid.

Use the template: [Evidence-Chain-Template.md](../../spec/workflow-modeling-canvas/Evidence-Chain-Template.md)

---

## 4. Your Tools

| Tool | Location |
|------|----------|
| Workflow Modeling Canvas v1.0 | [Canvas spec](../../spec/workflow-modeling-canvas/Workflow-Modeling-Canvas-v1.0.md) |
| Evidence-chain template | [Evidence-Chain-Template.md](../../spec/workflow-modeling-canvas/Evidence-Chain-Template.md) |
| Operator Guide | [OWMP-1.0.md](../../spec/workflow-modeling-canvas/OWMP-1.0.md) |
| Client Guide | [Client-Edition.md](../../spec/workflow-modeling-canvas/Client-Edition.md) |
| Nova Studio Workflow Modeling Agent (WM-A1.0) | [WM-A1.0.md](../../spec/workflow-modeling-canvas/WM-A1.0.md) |
| Nova Studio UI | `/nova/studio/workflow-canvas` |
| Validation CLI | `npm run workflow-canvas:validate` |

---

## 5. Engagement Flow

### Step 1 - Capture Observations

Use interviews, logs, transcripts, artifacts. No interpretation. Assign `OBS-*` IDs.

### Step 2 - Derive Findings

Interpret patterns, bottlenecks, and risks. Every finding must cite Observation IDs. Assign `FND-*` IDs.

### Step 3 - Recommend Changes

Create recommendations grounded in findings, not intuition. Assign `REC-*` IDs.

### Step 4 - Predict Outcomes

Define what should improve. Every expected outcome must cite Recommendation IDs. Assign `OUT-*` IDs.

### Step 5 - Define Metrics

Make outcomes measurable before implementation. Assign `MET-*` IDs.

### Step 6 - Assemble Traceability

Build the full chain and run `npm run workflow-canvas:validate`.

---

## 6. Success Criteria

A workflow model is complete when:

- every recommendation is traceable
- every outcome is measurable
- every metric is defined before implementation
- the traceability chain is monotonic
- the model is independently reproducible
- a human operator has reviewed agent drafts

---

## 7. What Not To Do

- do not skip observations
- do not invent findings
- do not propose ungrounded recommendations
- do not collapse artifact categories
- do not bypass the evidence chain

---

## Example

See [canvas-v1.0.example.json](../../workflow-canvas/examples/canvas-v1.0.example.json) for a complete valid engagement.
