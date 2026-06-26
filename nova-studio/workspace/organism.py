def governed_action(intent):
    """Nova Studio governed workspace — Intent → Plan → Reasoning → Capabilities → Receipts."""
    plan = nova.generate_plan(intent)
    for step in plan.steps:
        reasoning = nova.reason(step)
        result = nova.call_capability(step)
        nova.finalize_receipt(result)
    return plan


# Placeholder runtime binding (wired by Nova Studio governed pipeline)
class _NovaStub:
    def generate_plan(self, intent):
        return type("Plan", (), {"steps": [{"action": "governed_run", "intent": intent}]})()

    def reason(self, step):
        return f"Reasoning: {step}"

    def call_capability(self, step):
        return {"step": step, "status": "ok"}

    def finalize_receipt(self, result):
        return f"REC-{id(result)}"


nova = _NovaStub()
