export interface InvariantRow {
  id: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

export function buildInvariantDashboard(input: {
  cor?: { structuralIntegrity?: { missingArtifacts?: unknown[]; brokenLineage?: unknown[] } };
  analysis?: { claims?: Array<{ claimId: string; severity: string; summary: string }> };
  receipt?: { decision?: string; invariantsEnforced?: string[] };
}): InvariantRow[] {
  const rows: InvariantRow[] = [];

  const missing = input.cor?.structuralIntegrity?.missingArtifacts?.length ?? 0;
  rows.push({
    id: "INV-STRUCTURAL-MISSING",
    status: missing > 10 ? "fail" : missing > 0 ? "warn" : "pass",
    detail: `${missing} missing artifact links`,
  });

  const broken = input.cor?.structuralIntegrity?.brokenLineage?.length ?? 0;
  rows.push({
    id: "INV-LINEAGE",
    status: broken > 0 ? "warn" : "pass",
    detail: `${broken} broken lineage edges`,
  });

  const critical =
    input.analysis?.claims?.filter((c) => c.severity === "critical" || c.severity === "error").length ?? 0;
  rows.push({
    id: "INV-PROOF-CRITICAL",
    status: critical > 0 ? "fail" : "pass",
    detail: `${critical} critical/error claims`,
  });

  const decision = input.receipt?.decision ?? "unknown";
  rows.push({
    id: "INV-GOVERNANCE-DECISION",
    status: decision === "approve" || decision === "escalate" ? "pass" : "fail",
    detail: `Governance decision: ${decision}`,
  });

  for (const inv of input.receipt?.invariantsEnforced ?? []) {
    if (rows.some((r) => r.id === inv)) continue;
    rows.push({ id: inv, status: "pass", detail: "Enforced" });
  }

  return rows;
}
