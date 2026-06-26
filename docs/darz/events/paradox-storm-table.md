# Paradox Storm Event Table (v1.0.0)

**Location:** `docs/darz/events/paradox-storm-table.md`  
**Runtime:** `src/darz/simulation/paradoxStorm.js`  
**Driven by validated faces:** cosmology (tier), RPG (backlash), scripture (narrative), governance (posture), Core (lawful transitions)

## Trigger conditions

A Paradox Storm triggers when:

- cosmology tier ∈ {Paradox, Hyper-Prime}
- OR backlash ≥ 5
- OR zone-to-zone propagation creates a tension inversion

## 1. Storm Severity

| Tier | Backlash | Severity | Description |
|------|----------|----------|-------------|
| Paradox | 3–4 | Minor | Local distortions, echoes, memory bleed |
| Paradox | 5+ | Major | Mode inversion, tension spikes, fractures |
| Hyper-Prime | 0–4 | Major | Reality drift, horizon storms |
| Hyper-Prime | 5+ | Catastrophic | Zone-wide rewrite, scripture rupture |

## 2. Event Table

Roll `1d10 + current backlash`:

| Roll | Event | Effect |
|------|-------|--------|
| 1–4 | Echo Surge | Memory +2; scripture: "The past reasserts itself." |
| 5–7 | Horizon Shear | Horizon +3; impossible futures revealed |
| 8–10 | Mode Inversion | Dominant tension flips (Becoming ↔ Resistance, Memory ↔ Horizon) |
| 11–13 | Fracture Event | Zone splits into sub-zones; Sundering Verse |
| 14–16 | Tension Cascade | All tensions +1; `coreTick`; tier may escalate |
| 17+ | Hyper-Prime Rewrite | New random tension vector; Critical Alert |

Handlers mutate cosmos then apply `coreTick()` where applicable.

## 3. Operator Alerts

| Alert | Condition |
|-------|-----------|
| Yellow | backlash ≥ 3 OR tier = Anti-Prime |
| Orange | backlash ≥ 5 OR tier = Paradox |
| Red | tier = Hyper-Prime OR Paradox Storm triggered |
