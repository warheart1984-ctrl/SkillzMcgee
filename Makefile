.PHONY: test test-node governance-gate seed-governance-gate

test: test-node governance-gate

test-node:
	npm test

seed-governance-gate:
	node scripts/seed_governance_gate.mjs

governance-gate: seed-governance-gate
	python -m pytest tests/skillzmcgee/ -v
