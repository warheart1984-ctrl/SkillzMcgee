# Drift Envelopes — CE(S) and SE(S)

**Authority:** CRK-1 Specification v1.0  
**Status:** Normative

## Constitutional Exposure CE(S)

Measures structural exposure to governance and interpretation:

```
CE(S) = H(O_S) + H(E_S)
```

Where `O_S` = OutcomeObjects, `E_S` = EvidenceObjects, `H(·)` = structural entropy.

**Invariant:** `CE(S_{t+1}) ≥ CE(S_t)` — no reduction in constitutional exposure.

**Requirement:** CRK1-R041

## Semantic Exposure SE(S)

Measures semantic diversity in interpretations:

```
SE(S) = D(F_S) + V(I_S)
```

Where `F_S` = interpretive frames, `I_S` = InterpretationObjects, `D(·)` = frame diversity, `V(·)` = semantic variance.

**Invariant:** `SE(S_{t+1}) ≥ SE(S_t)` — no semantic collapse.

**Requirement:** CRK1-R041, CRK1-R022

## Update rule

```
CE' = CE + ΔCE,  SE' = SE + ΔSE   where ΔCE ≥ 0, ΔSE ≥ 0
```

Negative drift is unconstitutional and triggers governance halt.

## Violation handling

On drift regression:

1. Governance halt
2. Refusal receipt
3. Red-team replay
4. Provenance anchoring
