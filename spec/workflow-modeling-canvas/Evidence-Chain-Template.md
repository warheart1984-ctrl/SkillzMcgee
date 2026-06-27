# Evidence Chain Template (CMS-1.0)

Use this template for every observation → outcome thread. One thread per distinct workflow issue or improvement.

---

## Observation

- What was directly observed?
- Include raw facts, timestamps, artifacts, actors.
- **Observation ID:** `OBS-___`

## Finding

- What does this observation mean?
- What pattern or issue does it reveal?
- **Finding ID:** `FND-___`
- **Cites:** `OBS-___`

## Recommendation

- What should change?
- What intervention addresses the finding?
- **Recommendation ID:** `REC-___`
- **Cites:** `FND-___`

## Expected Outcome

- What improvement should occur if the recommendation is implemented?
- **Outcome ID:** `OUT-___`
- **Cites:** `REC-___`

## Success Metric

- How will we measure whether the outcome occurred?
- **Metric ID:** `MET-___`
- **Cites:** `OUT-___`

---

This template enforces the evidence chain and prevents hand-waving.

**Machine-readable chain entry:**

```json
{
  "chainId": "CHAIN-001",
  "observationId": "OBS-001",
  "findingId": "FND-001",
  "recommendationId": "REC-001",
  "expectedOutcomeId": "OUT-001",
  "successMetricId": "MET-001"
}
```
