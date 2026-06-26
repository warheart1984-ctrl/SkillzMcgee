# Constitutional Object Model (COM-1.0)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative

Version 1.0 recognizes **exactly five** canonical objects. Everything else is userland.

## IdentityObject

Represents an actor within the constitutional runtime.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | yes |
| `metadata` | object | no |

**Invariants:** K4, K11

## DecisionObject

Represents an action taken by an IdentityObject.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | yes |
| `actor` | IdentityObject ref | yes |
| `payload` | unknown | yes |
| `timestamp` | ISO8601 | yes |

**Invariants:** K0, K4, K5

## OutcomeObject

Represents the result of a DecisionObject.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | yes |
| `decision_id` | string | yes |
| `result` | unknown | yes |
| `timestamp` | ISO8601 | yes |

**Invariants:** K1, K4, K5

## EvidenceObject

Represents evidence generated from an OutcomeObject.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | yes |
| `outcome_id` | string | yes |
| `data` | unknown | yes |
| `timestamp` | ISO8601 | yes |

**Invariants:** K2, K4, K5, K6

## InterpretationObject

Represents semantic interpretation of EvidenceObject.

| Field | Type | Required |
|-------|------|----------|
| `id` | string | yes |
| `evidence_id` | string | yes |
| `interpretation` | unknown | yes |
| `frames_used` | string[] | yes |
| `timestamp` | ISO8601 | yes |

**Invariants:** K7, K8, K9

## Normative requirements

Object schemas are verified by CRK1-R013 through CRK1-R017. See [normative-requirements/](./normative-requirements/).
