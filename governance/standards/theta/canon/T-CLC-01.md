THETA CANON T‑CLC‑01: CONTINUITY LEDGER CANON

1. Purpose
   To define the canonical structure and obligations of the AAES
   continuity ledger.

2. Canonical Fields
   Each receipt SHALL contain:
     a. timestamp
     b. event_type
     c. lineage_id
     d. drift_vector
     e. tension_index
     f. governance_posture
     g. operator (if applicable)

3. Obligations
   a. All governed actions SHALL emit receipts.
   b. No posture transition SHALL occur without a receipt.
   c. Ledger entries SHALL be immutable once committed.

4. Access
   The cockpit, SkillzMcGee, and governance console SHALL have
   read access to the ledger; write access SHALL be governed
   by CKCE‑1 and Theta protocols.

5. Integrity
   Any gap, corruption, or non‑monotonic sequence in the ledger
   SHALL trigger Governance Drift Arbitration (T‑GDA‑07).

Ratified: Theta Council, Day 11 of AAES Emergence
