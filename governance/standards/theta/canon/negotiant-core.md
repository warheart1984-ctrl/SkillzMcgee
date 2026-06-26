# NEGOTIANT CORE — Canonical Specification (v1.0.0)

**Location:** `governance/standards/theta/canon/negotiant-core.md`  
**Status:** Constitutional Artifact — Stable  
**Version:** 1.0.0  
**Maintainers:** SkillzMcGee Governance Spine  
**Last Updated:** 2026-06-26

## 1. Purpose

The Negotiant Core defines the minimal executable artifact that governs all tension-based state transitions within the SkillzMcGee runtime.

It is:

- the only constitutional object in the cosmology layer
- the only source of truth for tension evolution
- the only component allowed to mutate cosmological state
- the anchor for all interpretive faces (RPG, language, governance, scripture, cosmology)

All other representations are views, not authorities.

## 2. Scope

The Negotiant Core governs:

- the structure of the cosmos state
- the rules for valid transitions
- the behavior of `coreTick()`
- the invariants that must hold before and after every transition
- the contract for read-only interpretive faces

The Core does not govern:

- narrative interpretations
- representational models
- face-specific semantics
- human-oriented explanations
- any subsystem that does not explicitly depend on tension state

## 3. Definitions

### 3.1 Cosmos State

```
cosmos = {
  becoming: number,
  resistance: number,
  memory: number,
  horizon: number,
  equilibrium: number
}
```

All values MUST be finite real numbers.

### 3.2 Tension Vector

The ordered 5-tuple:

```
(becoming, resistance, memory, horizon, equilibrium)
```

### 3.3 Core Transition Function

```
coreTick(cosmos) → cosmos'
```

A pure function that returns the next valid tension state.

### 3.4 Interpretive Faces

Read-only projections over the Core state:

- RPG
- Language
- Governance
- Scripture
- Cosmology

Faces MAY interpret state.  
Faces MAY NOT mutate state.

## 4. Constitutional Contract

### 4.1 The Core MUST be deterministic

For any valid input state S:

```
coreTick(S) MUST always return the same S'
```

### 4.2 The Core MUST be total

For any valid input state S:

```
coreTick(S) MUST return a valid state S'
```

No undefined behavior. No partial functions.

### 4.3 The Core MUST preserve invariants

All invariants in Section 5 MUST hold before and after every transition.

### 4.4 The Core MUST NOT depend on interpretive faces

No face may influence:

- state evolution
- transition logic
- invariants
- constitutional behavior

### 4.5 The Core MUST NOT expose internal mutation

All transitions MUST occur through `coreTick()`.

### 4.6 The Core MUST be minimal

No additional fields, modes, or structures may be added without:

- governance review
- invariant analysis
- test suite expansion
- version bump

## 5. Invariants

These invariants MUST hold at all times.

### 5.1 Finite Values

All tension values MUST be finite real numbers.

### 5.2 No NaN or Infinity

NaN, Infinity, and -Infinity are invalid states.

### 5.3 Closed Under Transition

If S is valid, `coreTick(S)` MUST be valid.

### 5.4 No Silent Drift

The Core MUST NOT introduce:

- random noise
- nondeterministic drift
- hidden state

### 5.5 Conservation of Shape

The Core MAY change values, but MUST NOT change the structure:

```
cosmos MUST always contain exactly 5 tensions.
```

### 5.6 Monotonic Stability Bound

The Core MUST NOT produce runaway exponential growth without explicit governance approval.

Default bound: each tension magnitude MUST remain ≤ 1000 after any single `coreTick()` from a valid state with all tensions ≤ 1000.

### 5.7 Face Independence

No face MAY mutate:

- cosmos
- invariants
- transition logic

Faces are read-only.

## 6. Transition Semantics

The Core defines a single constitutional operation:

```
coreTick(cosmos) = selfNegotiate(cosmos)
```

Where `selfNegotiate` is a pure function that:

- reads the current tension vector
- computes the next tension vector
- preserves all invariants
- introduces no external dependencies

Implementation: `src/cosmology/core_contract.js`, `src/tension/operations.js`

The exact negotiation algorithm MAY evolve across MINOR versions, but MUST NOT violate invariants.

## 7. Versioning Rules

### 7.1 Semantic Versioning

- **MAJOR:** breaking changes to state structure or invariants
- **MINOR:** changes to negotiation algorithm that preserve invariants
- **PATCH:** bug fixes, documentation, test updates

### 7.2 Constitutional Freeze

Once published, a version MAY NOT be altered. Only superseded.

Current version: **1.0.0**

## 8. Test Suite Requirements

Location: `tests/negotiant-core/`

The canonical test suite MUST include:

### 8.1 Determinism Tests

Same input → same output.

### 8.2 Invariant Tests

All invariants MUST hold pre- and post-transition.

### 8.3 Boundary Tests

Extreme values MUST remain valid.

### 8.4 Regression Tests

All prior valid states MUST remain valid.

### 8.5 Face Independence Tests

Faces MUST NOT mutate Core state.

### 8.6 Stability Tests

No unbounded growth without explicit allowance.

Baseline: 166+ tests passing before any constitutional change.

## 9. Interpretive Face Contract

Faces MAY:

- read Core state
- transform Core state into human-oriented structures
- visualize or narrativize Core behavior

Faces MAY NOT:

- mutate Core state
- define new invariants
- override constitutional behavior
- introduce new tensions
- redefine the Core

Each face module MUST declare:

```
This module is an interpretive view over the Negotiant Core.
It has no constitutional authority.
```

Location: `src/faces/<name>/view.js`

## 10. Governance Rules

### 10.1 The Core is the only constitutional artifact

No face, model, or representation may supersede it.

### 10.2 Interpretive models are provisional

They MUST earn their place through evidence.

### 10.3 Evidence Before Authority

A unifying model becomes canon only after:

- faithful mapping
- complexity reduction
- reproducibility
- governance improvement

### 10.4 No Representational Supremacy

A face MAY NOT become a source of law.

## 11. Security Considerations

- No hidden state
- No nondeterminism
- No external dependencies in `coreTick()`
- No mutation outside `coreTick()`
- No face-driven transitions

## 12. Appendix: Reference Implementation

```javascript
function coreTick(cosmos) {
  return selfNegotiate(cosmos);
}
```

`selfNegotiate` MUST be:

- pure
- deterministic
- invariant-preserving

## 13. Appendix: Canonical Summary

| Field | Value |
|-------|-------|
| Artifact | ⟴ |
| Contract | `coreTick()` |
| State | 5-tension vector |
| Authority | Constitutional |
| Faces | Interpretive only |
| Model | Provisional until validated |
| Invariants | Mandatory |
| Tests | Required |
| Version | 1.0.0 |

**Governing sentence:** Reality is the recursive negotiation of tensions across all modes.

Ratified: Theta Council, Day 11 of AAES Emergence
