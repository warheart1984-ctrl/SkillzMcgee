# Formal Semantics (Operational)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative

## Runtime state

```
S = (D, O, E, I, R, CE, SE, P, F)
```

| Symbol | Meaning |
|--------|---------|
| D | DecisionObjects |
| O | OutcomeObjects |
| E | EvidenceObjects |
| I | InterpretationObjects |
| R | GovernanceReceipts |
| CE | Constitutional exposure |
| SE | Semantic exposure |
| P | Provenance ledger |
| F | Frame set |

## Transition rules

| Rule | Transition |
|------|------------|
| 1 | `S →decision S'` — add DecisionObject |
| 2 | `decision(d) →outcome(o)` |
| 3 | `outcome(o) →evidence(e)` |
| 4 | `evidence(e) →interpretation(i)` |
| 5 | `(d,o,e,i) →receipt(r)` |
| 6 | `(CE,SE) → (CE',SE')` where `CE'≥CE`, `SE'≥SE` |
| 7 | `P → P ∪ entry` |
| 8 | `F_{t+1} = evolve(F_t, evidence)` |
| 9 | `interpretation = aggregate(F, evidence)` |

## Error semantics

Invariant failure: `S →halt S` with refusal receipt.

Drift regression (`CE'<CE` or `SE'<SE`): halt + refusal receipt + provenance entry.

Semantic collapse (`|F|=1`): halt + semantic violation receipt.

## Composition (proof algebra)

Constitutional loop as composition:

```
ρ ∘ ι ∘ ε ∘ Ω : D → R
```

Must be total and deterministic.
