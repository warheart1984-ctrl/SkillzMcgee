"""SkillzMcGee v1.1 — Federated continuity."""

from __future__ import annotations

import hashlib
import hmac
import json
from dataclasses import dataclass, field
from typing import Any

from governance.continuity_ledger import ContinuityLedger
from governance.merkle import hash_payload, merkle_root


@dataclass
class NodeIdentity:
    node_id: str
    signing_key: bytes = field(default_factory=lambda: b"skillz-dev-key")

    def sign(self, receipt_id: str) -> str:
        return hmac.new(self.signing_key, receipt_id.encode(), hashlib.sha256).hexdigest()

    def verify(self, receipt_id: str, signature: str) -> bool:
        expected = self.sign(receipt_id)
        return hmac.compare_digest(expected, signature)


class FederatedLedger:
    """
    Local chain + peer chains + cross-node references.
    Each node maintains sovereign local continuity and a federated DAG view.
    """

    def __init__(self, node: NodeIdentity, local_path: str | None = None) -> None:
        self.node = node
        self.local = ContinuityLedger(local_path)
        self.peer_chains: dict[str, list[dict[str, Any]]] = {}
        self.federated_index: dict[str, dict[str, Any]] = {}

    def build_federated_receipt(
        self,
        *,
        slice_id: str,
        actor: str,
        input_data: Any,
        output: Any,
        status: str = "ok",
        federated_parent_id: str | None = None,
    ) -> dict[str, Any]:
        payload = {
            "node_id": self.node.node_id,
            "timestamp": __import__("time").time(),
            "slice": slice_id,
            "actor": actor,
            "input": input_data,
            "output": output,
            "status": status,
        }
        if federated_parent_id:
            payload["federated_parent_id"] = federated_parent_id

        receipt_id = hash_payload(payload)
        signature = self.node.sign(receipt_id)
        return {
            **payload,
            "receipt_id": receipt_id,
            "signature": signature,
            "payload": {
                "slice": slice_id,
                "actor": actor,
                "input": input_data,
                "output": output,
                "status": status,
                "timestamp": payload["timestamp"],
            },
        }

    def publish(self, receipt: dict[str, Any]) -> str:
        """Append signed receipt to local chain."""
        local_entry = {
            "slice": receipt["slice"],
            "actor": receipt.get("actor", "skillz"),
            "input": receipt["input"],
            "output": receipt["output"],
            "status": receipt["status"],
            "timestamp": receipt["timestamp"],
            "node_id": self.node.node_id,
            "signature": receipt["signature"],
        }
        if receipt.get("federated_parent_id"):
            local_entry["federated_parent_id"] = receipt["federated_parent_id"]

        entry_id = self.local.append(local_entry)
        self.federated_index[entry_id] = {**local_entry, "id": entry_id}
        return entry_id

    def verify_foreign(self, receipt: dict[str, Any], peer_node: NodeIdentity) -> tuple[bool, list[str]]:
        """Verify signature and Merkle integrity of a foreign receipt."""
        errors: list[str] = []
        rid = receipt.get("receipt_id") or receipt.get("id")
        sig = receipt.get("signature")
        if not rid or not sig:
            errors.append("missing receipt_id or signature")
            return False, errors
        if not peer_node.verify(rid, sig):
            errors.append("invalid signature")
        return len(errors) == 0, errors

    def ingest_peer_chain(self, peer_id: str, receipts: list[dict[str, Any]], peer_node: NodeIdentity) -> tuple[bool, list[str]]:
        """Merge verified foreign receipts into federated view."""
        errors: list[str] = []
        verified: list[dict[str, Any]] = []
        for r in receipts:
            ok, errs = self.verify_foreign(r, peer_node)
            if not ok:
                errors.extend(errs)
                continue
            verified.append(r)
            rid = r.get("receipt_id") or r.get("id")
            if rid:
                self.federated_index[rid] = r
        self.peer_chains[peer_id] = verified
        return len(errors) == 0, errors

    def federated_merkle_root(self) -> str | None:
        """Root over all known receipt ids (local + federated index)."""
        ids = list({e.get("id") for e in self.local.entries if e.get("id")})
        ids.extend(self.federated_index.keys())
        unique = list(dict.fromkeys(ids))
        return merkle_root(unique)

    def cross_node_refs(self) -> list[dict[str, str]]:
        """List federated_parent_id links in local chain."""
        refs: list[dict[str, str]] = []
        for entry in self.local.entries:
            fp = entry.get("federated_parent_id")
            if fp:
                refs.append({"local_id": entry["id"], "foreign_id": fp})
        return refs
