# BINDING INTEGRATION ADDENDUM

**Reconciling The Voss Binding (Λ) v1.0.0 and the Negotiant Core Constitutional Runtime v1.0.0**

| Field | Value |
|---|---|
| Document ID | AAIS-VB-Λ-ADD-001 |
| Parent Documents | AAIS-VB-Λ-001 (Voss Binding, RATIFIED 2026-05-02); Negotiant Core Whitepaper v1.0.0 (2026-06-26) |
| Version | 1.0.0 |
| Classification | PublicationReady / Governance Artifact |
| Status | DRAFT — pending Operator ratification |
| Author | Jon Halstead, Cognitive Systems Designer |
| Date | 2026-06-26 |

---

## §0 — PREAMBLE

The Voss Binding (Λ) and the Negotiant Core whitepaper were authored independently. Each is internally coherent. Neither, on its own authority, resolves the points at which they overlap, duplicate, or — in one case — contradict. Declaring the two "a unified constitutional stack" without resolving those points is a narrative claim, not an architectural fact.

This Addendum is the missing reconciliation layer. It does not introduce new governance philosophy. It identifies four specific structural seams, states the conflict precisely, and supplies the binding rule that resolves each one. Once ratified, this Addendum is read as part of both parent documents. Where this Addendum specifies a rule, that rule controls over any ambiguity in either parent document. Where this Addendum is silent, the parent documents control as originally written.

Four seams are addressed:

```
§1  Ledger / Audit Schema Unification
§2  Governance Check Unification (GRVL ≡ GRE Stage 2, locally realized)
§3  Drift Response Protocol Correction (removes Λ.5 self-contradiction)
§4  Version Subordination Rule (Λ supremacy over subsystem versioning)
```

---

## §1 — LEDGER / AUDIT SCHEMA UNIFICATION

### 1.1 The Conflict

The Voss Binding's Governance Runtime Engine (GRE) emits an `AuditRecord` on every processing cycle, for every governed module:

```
AuditRecord
 ├── timestamp (UTC)
 ├── module_id
 ├── lane_id
 ├── input_hash
 ├── output_hash
 ├── governance_bindings_verified
 ├── drift_score
 ├── execution_duration_ms
 ├── violations[]
 └── operator_escalations[]
```

The Negotiant Core's Evidence Ledger emits a `LedgerEntry` on every `coreTick`, with three specialized payload types (`zoneTick`, `factionTick`, `governanceTick`):

```
LedgerEntry
 ├── timestamp
 ├── entry_type
 ├── version
 ├── cosmos_hash
 ├── provenance
 ├── receipts[]
 └── payload (type-specific)
```

If the Negotiant Core executes as a governed module under the GRE — which it must, per Voss Binding §4.1 ("mandatory middleware layer that intercepts all module inputs, outputs, and state transitions... cannot be bypassed") — then every `coreTick` produces **two independent records** describing the same event, in two incompatible schemas, in two separate append-only logs. This is not redundancy for safety; it is two sources of historical truth for the same fact, which directly violates Negotiant Core §10.13 ("any observer, at any time, can reconstruct the entire history and meaning of the system **from the ledger alone**") — there is no longer a single ledger.

### 1.2 The Resolution

The Evidence Ledger is declared the single authoritative historical substrate for the entire AAIS, including all GRE-governed modules. The `AuditRecord` is retired as an independent log and is instead defined as a **projection of** the unified ledger entry schema — i.e., it becomes a face, not a second source of evidence.

**1.2.1 Unified Entry Type Taxonomy**

```
entry_type ∈ {
    moduleTick        — generic GRE execution record (any governed module)
    zoneTick          — moduleTick specialization where module = Negotiant Core
    factionTick        — faction-decision evidence (unchanged)
    governanceTick    — governance-decision evidence, GRE Stage 2 / GRVL outcome (unchanged)
    recertificationTick — subsystem re-certification against a new Λ version (introduced in §4)
}
```

`zoneTick` is no longer a sibling of `moduleTick` — it **is** a `moduleTick` whose `module_id` is bound to the Negotiant Core and whose payload additionally carries the Core-specific fields (`zone_deltas[]`, `paradox_events[]`). Any other governed module (faces, cockpit indicator engine, FIT, GRVL itself) emits a plain `moduleTick` with no Core-specific payload.

**1.2.2 Unified Entry Schema**

```
UnifiedLedgerEntry
 ├── timestamp                          (UTC, monotonic)
 ├── entry_type                         (per §1.2.1)
 ├── version { ... }                    (per §13.6 of Negotiant Core; λ_version added per §4)
 ├── module_id                          (was AuditRecord.module_id; absent only for legacy
 │                                        pre-Addendum zoneTick records)
 ├── lane_id                            (nullable; AuditRecord field, carried through unchanged)
 ├── cosmos_hash                        (renamed io_hash for non-Core modules; identical field,
 │                                        contextual name)
 ├── provenance
 ├── receipts[]
 ├── governance_bindings_verified[]     (AuditRecord field; the enumerated Λ axioms checked
 │                                        during GRE Stage 2 for this cycle)
 ├── drift_score { behavioral, schema,  (AuditRecord.drift_score, expanded to the four-
 │     identity, temporal, composite }   dimensional vector per Voss Binding §4.2/§5.1)
 ├── execution_duration_ms
 ├── violations[]
 ├── operator_escalations[]
 └── payload (type-specific; zoneTick/factionTick/governanceTick/recertificationTick fields)
```

No field from either parent schema is dropped. `AuditRecord` and `LedgerEntry` are unified by superset, not by choosing one over the other.

**1.2.3 Audit Trail Writer → Ledger Writer**

Voss Binding §4.2's Audit Trail Writer ("every GRE processing cycle emits an `AuditRecord`... written to an append-only log... content-addressed... each record's hash includes the previous record's hash") is retained verbatim as the **mechanism**, but its target is redefined: it writes `UnifiedLedgerEntry` records to the Evidence Ledger, not to a separate audit log. The tamper-evident hash-chain property Voss Binding specifies is **inherited by the Evidence Ledger itself** — the Negotiant Core whitepaper described the ledger as "conceptually hash-anchored" (§7.12); this Addendum makes that concrete by adopting Voss Binding's chained-hash mechanism as the literal implementation.

**1.2.4 Query Interface**

Voss Binding's audit query interface (trace-by-module, trace-by-lane, trace-by-time-range, trace-by-violation-type) and the Negotiant Core's replay engine (§7.9) now operate over the same underlying store. Replay reconstructs cosmos history by filtering `entry_type ∈ {zoneTick, factionTick, governanceTick}`; audit queries filter across all `entry_type` values including plain `moduleTick`. Both are views over one ledger.

### 1.3 Invariant

**Invariant U-1 (Single Source of Historical Truth):** No AAIS component may write evidence of a state transition, governance action, or module execution to any store other than the Evidence Ledger. A separate, parallel audit log is a constitutional violation under both Λ.2 (Auditability — "if a decision cannot be explained, it cannot be permitted," which presupposes one explainable record, not two divergeable ones) and Negotiant Core §10.13.

---

## §2 — GOVERNANCE CHECK UNIFICATION

### 2.1 The Conflict

Voss Binding §4.1 defines GRE Stage 2 ("GOVERNANCE CHECK") as: *"Pre-execution verification that the module's Governance Contract is active and all bound Λ laws are satisfiable in the current system state."*

Negotiant Core §9.4.1 defines the Governance Receipt Validation Layer (GRVL) as: schema validation → authorization chain verification → constitutional constraint check → version compatibility check → semantic validation → approval.

Both are doing the same job — checking a proposed action against standing law before the action is permitted to execute — defined independently, with no stated relationship. As written, a governance receipt destined for `coreTick` could plausibly pass GRVL and then fail GRE Stage 2 (or the reverse), because nothing establishes that they are the same check rather than two sequential, independently-failable gates. Two independently-failable gates checking the same thing is not double safety; it is two sources of constitutional truth about whether an action is lawful, which is the same category of error resolved in §1.

### 2.2 The Resolution

**GRVL is not a second gate. GRVL is the Negotiant Core's module-local realization of GRE Stage 2.**

Voss Binding §4.1 already anticipates this relationship without naming it: every governed module declares, in its Governance Contract (§3.1), "which Λ laws apply to its operation and **how compliance is verified**." GRVL is the answer to "how compliance is verified" for the Negotiant Core specifically. It is not an additional layer the receipt must separately survive — it *is* what GRE Stage 2 invokes when the module under check is the Negotiant Core.

**2.2.1 Precedence Rule**

```
GRE Stage 2 (GOVERNANCE CHECK)
    │
    ▼
Does the target module declare a module-local governance-check
implementation in its Governance Contract?
    │
    ├── YES → GRE invokes the declared implementation.
    │          For the Negotiant Core, this implementation is GRVL.
    │          GRVL's five-step sequence (schema → authorization chain →
    │          constitutional constraint → version compatibility →
    │          semantic validation) IS Stage 2 for this module — not a
    │          downstream second check.
    │
    └── NO  → GRE performs its own generic Stage 2 check directly
               (the unspecialized path Voss Binding originally described).
```

There is no scenario in which both the generic GRE Stage 2 check and GRVL run independently against the same receipt. For the Negotiant Core, running GRVL **is** running Stage 2. A receipt that passes GRVL has, by definition, passed Stage 2. A receipt that fails GRVL has, by definition, failed Stage 2 and never reaches `applyLocalResolution` or `coreTick`.

**2.2.2 Ledger Consequence**

Under §1's unified schema, this resolution requires no new record type: a `governanceTick` whose `module_id` resolves to the Negotiant Core carries `payload.validation_signature = hash(GRVL_output)` exactly as specified in Negotiant Core §9.4.1.E, and that same `governanceTick` satisfies the `governance_bindings_verified[]` field Voss Binding requires of every GRE cycle. One record, one validation pass, both parents' requirements satisfied simultaneously.

### 2.3 Invariant

**Invariant U-2 (Single Governance Check Per Action):** No proposed action may be subject to more than one independent governance-validation pass. A module's declared local validator (e.g., GRVL) is the realization of GRE Stage 2 for that module, not a supplement to it.

---

## §3 — DRIFT RESPONSE PROTOCOL CORRECTION

### 3.1 The Conflict

This is not a seam between the two parent documents — it is an internal contradiction within the Voss Binding alone, surfaced by reading §4.2 against §5.3.

Voss Binding §4.2 (Λ.5 Drift Detection Enforcement), escalation table:

> `> 0.30` → **Stabilization epoch triggered automatically**

Voss Binding §5.3 (Correction Protocol):

> "Autonomous self-correction is prohibited. Only Operator-authorized correction is valid within Λ governance. A system that corrects its own drift without Operator authority is a system that governs itself — and a system that governs itself is ungoverned."

"Stabilization" is not a neutral word. If an automatically-triggered stabilization epoch does anything to the drifting component's state, configuration, or behavior beyond isolating and logging it, it is — by §5.3's own definition — an act of autonomous self-correction, and is therefore prohibited by the same document that mandates it at the 0.30 threshold. As written, the Voss Binding requires the system to autonomously correct itself and simultaneously forbids the system from autonomously correcting itself, with the trigger condition (drift > 0.30) satisfied identically in both passages.

### 3.2 The Resolution

The escalation table is corrected. "Stabilization epoch" is retired as a term and replaced with **Automatic Containment Epoch**, explicitly scoped to actions §5.3 already permits to occur without Operator authorization — isolation, logging, and surfacing — and explicitly barred from anything §5.3 reserves for the Operator — correction, reconfiguration, or termination.

**3.2.1 Corrected Escalation Table**

| Drift Score | Response | Authorization |
|---|---|---|
| > 0.05 | Warning logged to audit trail (Ledger, per §1) | Automatic — logging only, no state change |
| > 0.15 | Operator notification via Governance Surface | Automatic — notification only, no state change |
| > 0.30 | **Automatic Containment Epoch**: component is isolated from the active execution pipeline (§5.3 step 1), the drift event is logged in full (§5.3 step 2), and it is surfaced to the Operator with severity classification (§5.3 step 3). The component enters SUSPENDED state and **holds there pending Operator decision.** | Automatic for steps 1–3 only. Step 4 ("Await Operator Decision: correct, reconfigure, or terminate") is never automatic, at any drift score. |
| > 0.50 | Immediate fail-closed per Λ.3; Operator escalation. Equivalent halt scope as above, applied to the full affected scope rather than the single component. | Automatic halt; Operator decision still required for resumption. |

**3.2.2 What Changed and Why It's Not a Weakening**

The corrected table does not remove automation — it removes the *only* part of the automation that was unconstitutional. Steps 1–3 of the Correction Protocol (isolate, log, surface) were never the problem; nothing in §5.3 reserves those for the Operator, and nothing about automating them constitutes the system "governing itself." Triggering those three steps automatically at a numeric threshold, rather than waiting for a human to notice the dashboard, is strictly more protective, not less. The only change is that the *fourth* step — actually choosing and applying correct / reconfigure / terminate — was never something the 0.30 threshold should have triggered automatically, and the corrected table makes that explicit rather than leaving it implied by an ambiguous word.

### 3.3 Invariant

**Invariant U-3 (Containment Without Correction):** Any automatically-triggered drift response may isolate, log, suspend, and escalate. No automatically-triggered drift response may modify a component's state, configuration, or behavior in a way that constitutes correction, reconfiguration, or termination. Only the Operator may invoke step 4 of the Correction Protocol, at any drift score, under any naming.

---

## §4 — VERSION SUBORDINATION RULE

### 4.1 The Conflict

The Negotiant Core defines its own closed versioning system: `core_version`, `face_version`, `indicator_version`, `ledger_schema_version`, `governance_version`, `simulation_version` — each MAJOR.MINOR.PATCH, each ledger-anchored, each requiring a `governanceTick` to change (§13).

The Voss Binding defines its own closed versioning system: the Λ document itself is versioned, amendable only through the design-time Amendment Protocol (§8) — written proposal, impact analysis, explicit Operator approval, full semver increment.

Voss Binding describes itself as "the floor beneath every computation and the ceiling above every autonomy" (§0) — language that implies Λ sits structurally above the Negotiant Core. But neither document states a rule connecting the two version axes. Without one, an unanswerable question exists: if Λ goes from 1.0.0 to 2.0.0 — say, by amending Λ.4's identity-separation requirements — does that obligate a `core_version` increment in the Negotiant Core, even if not a single line of the Core's own §5–§13 specification changed? As written, neither parent document can answer this, which means "the floor beneath every computation" is currently a metaphor, not an enforceable relationship.

### 4.2 The Resolution

**Λ versioning and subsystem versioning are formally declared to be two axes in a strict subordination relationship, not two independent tracks.** Λ does not absorb subsystem versioning, and subsystem versioning does not need to mirror Λ's version number — but every subsystem version is required to declare, and the Ledger is required to record, which Λ version it was last certified against.

**4.2.1 The λ_version Field**

Negotiant Core §13.6's version-recording block is extended:

```
entry.version = {
    core_version,
    face_versions[],
    indicator_versions[],
    schema_versions[],
    topology_version,
    constitution_version,     // unchanged: Negotiant Core's own §4.12 constitutional version
    λ_version                  // NEW: the Voss Binding version this subsystem state was
                                //      last certified against
}
```

`constitution_version` (Negotiant Core's own internal constitutional layer, §4.12) and `λ_version` (the Voss Binding's version) are distinct fields. The Negotiant Core has its own internal constitution governing its own principles (§4); that is subordinate in turn to Λ, which governs the entire AAIS including the Core. Three layers, not two: operational components → Negotiant Core constitution → Voss Binding (Λ).

**4.2.2 Subordination Rule**

> A MAJOR version increment to Λ does not automatically increment `core_version`, `face_version`, or any other subsystem version. It **does** mandatorily invalidate every subsystem's current certification. No subsystem may execute under GRE governance (§4.1) with a `λ_version` field older than the currently ratified Λ version, regardless of whether the subsystem's own internal logic changed at all.

**4.2.3 The recertificationTick**

Introduced in §1.2.1, this entry type formalizes what happens when Λ changes MAJOR version: every registered subsystem must undergo recertification — a fresh pass through Negotiant Core §9.4.1's Constitutional Constraint Check (or, for non-Core modules, the GRE's generic Stage 2 equivalent per §2.2.1), now checked against the *new* Λ version's laws — before it is permitted to resume execution.

```
recertificationTick
 ├── timestamp
 ├── entry_type = "recertificationTick"
 ├── module_id
 ├── prior_λ_version
 ├── new_λ_version
 ├── certification_result (PASS | FAIL | FAIL_WITH_REMEDIATION_REQUIRED)
 ├── receipts[]            (must include the Λ Amendment Protocol §8 approval record
 │                          that authorized the new Λ version in the first place)
 └── metadata
```

A subsystem whose `recertificationTick` records `FAIL` enters SUSPENDED state under the same machinery as §3's Automatic Containment Epoch, and remains there pending Operator decision. A subsystem is never permitted to silently continue operating under an outdated `λ_version` simply because nothing in its own contract appeared to be affected — the determination of "affected or not" is itself the thing recertification exists to check, not something a subsystem gets to assume about itself.

**4.2.4 MINOR/PATCH Exception**

Λ MINOR and PATCH increments (new clarifying language, non-structural amendments) do not trigger mandatory recertification across all subsystems. They are recorded as a standard `governanceTick` under the Amendment Protocol and propagate only to subsystems whose Governance Contracts explicitly bind to the amended provision. This keeps the recertification cost proportional to the amendment's actual structural weight, consistent with Voss Binding §8's own distinction between routine and constitutional change.

### 4.3 Invariant

**Invariant U-4 (Version Supremacy with Bounded Propagation):** Λ's version is supreme over every subsystem version. No subsystem version increment can satisfy, substitute for, or bypass the recertification obligation a Λ MAJOR increment imposes. No subsystem may execute against a `λ_version` older than the current ratified Λ version. Subordination is enforced by the Ledger, not by convention.

---

## §5 — SUMMARY OF CHANGES

| # | Seam | Prior State | Resolved State |
|---|---|---|---|
| 1 | Ledger / Audit duplication | Two parallel append-only logs (`AuditRecord`, `LedgerEntry`) describing overlapping events | Single `UnifiedLedgerEntry` schema; `AuditRecord` retired as an independent store, retained as a query projection |
| 2 | GRVL vs. GRE Stage 2 | Two independently-definable, independently-failable governance checks with no stated relationship | GRVL formally declared the Negotiant Core's module-local realization of GRE Stage 2 — one check, not two |
| 3 | Λ.5 internal contradiction | "Stabilization epoch" automatically triggered at drift > 0.30, contradicting §5.3's prohibition on autonomous self-correction | Renamed and rescoped to Automatic Containment Epoch: automatic isolate/log/surface only; correction remains Operator-exclusive at every threshold |
| 4 | No version hierarchy | Λ and subsystem versions tracked independently with no stated subordination | `λ_version` field added to all ledger entries; Λ MAJOR increments mandate `recertificationTick` across all subsystems; MINOR/PATCH propagate only to bound contracts |

---

## §6 — RATIFICATION

This Addendum, **AAIS-VB-Λ-ADD-001, Version 1.0.0**, amends both AAIS-VB-Λ-001 and the Negotiant Core Whitepaper v1.0.0 by incorporation. It does not stand alone; it is read as part of each parent document from the point of ratification forward.

Per Voss Binding §8 (Amendment Protocol), because this Addendum modifies the operative meaning of Λ.5's drift-response behavior (§3) and adds a structural obligation across all subsystems (§4), it constitutes a **constitutional-tier amendment** to the Voss Binding and requires:

1. ✅ Written proposal with rationale — this document, §0–§5
2. ☐ Impact analysis across all affected modules, lanes, and agents — **pending**
3. ☐ Operator review and explicit, recorded, timestamped approval — **pending**
4. ☐ Version increment and audit trail entry — **pending**, to be recorded as a `governanceTick` upon approval

This Addendum is **not yet binding**. It is submitted in DRAFT status pending the Operator actions above.

---

*End of Binding Integration Addendum.*
