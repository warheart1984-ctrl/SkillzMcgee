import type { CavReportShape } from "../fetchers/cor.js";

export interface PgiShape {
  nodes?: Array<{ id: string; kind: string; path: string }>;
  edges?: Array<{ from: string; to: string; relation: string }>;
}

export interface DraShape {
  risk?: Record<
    string,
    {
      requirementId: string;
      score: number;
      verificationGaps: number;
      deprecatedDependencies: number;
      fanIn: number;
      fanOut: number;
    }
  >;
}

export interface InvestigationForensics {
  lineage: {
    requirementCount: number;
    edgeCount: number;
    byRequirement: Array<{ requirementId: string; inbound: number; outbound: number }>;
  };
  drift: Array<{ id: string; issue: string; detail: string }>;
  counterfactuals: Array<{
    requirementId: string;
    currentScore: number;
    scoreIfVerificationClosed: number;
    delta: number;
  }>;
  readiness: {
    structuralOk: boolean;
    blockingCount: number;
    highRiskCount: number;
    governanceDecision: string;
    readyForRelease: boolean;
    summary: string;
  };
}

export function buildInvestigationForensics(input: {
  cav: CavReportShape;
  cor: { structuralIntegrity?: { brokenLineage?: Array<{ issueType?: string }> } };
  pgi: PgiShape;
  dra: DraShape;
  receipt: { decision?: string };
}): InvestigationForensics {
  const requirements = (input.pgi.nodes ?? []).filter((n) => n.kind === "requirement");
  const edges = input.pgi.edges ?? [];

  const byRequirement = requirements.map((req) => ({
    requirementId: req.id,
    inbound: edges.filter((e) => e.to === req.id).length,
    outbound: edges.filter((e) => e.from === req.id).length,
  }));

  const drift = (input.cav.blocking ?? []).filter(
    (f) => f.issue === "hash_mismatch" || f.issue === "missing_artifact",
  );

  const counterfactuals = Object.values(input.dra.risk ?? {})
    .filter((r) => r.verificationGaps > 0)
    .map((r) => {
      const scoreIfVerificationClosed = r.score - r.verificationGaps * 3;
      return {
        requirementId: r.requirementId,
        currentScore: r.score,
        scoreIfVerificationClosed,
        delta: r.score - scoreIfVerificationClosed,
      };
    })
    .sort((a, b) => b.delta - a.delta);

  const blockingCount = input.cav.blocking?.length ?? 0;
  const highRiskCount = Object.values(input.dra.risk ?? {}).filter((r) => r.score >= 10).length;
  const criticalLineage = (input.cor.structuralIntegrity?.brokenLineage ?? []).some(
    (b) => b.issueType === "critical",
  );
  const decision = String(input.receipt.decision ?? "unknown");
  const structuralOk = !criticalLineage;
  const readyForRelease =
    blockingCount === 0 && structuralOk && decision === "approve" && highRiskCount === 0;

  let summary = "Investigation complete.";
  if (blockingCount > 0) summary = `${blockingCount} CAV blocking finding(s) — release blocked.`;
  else if (!structuralOk) summary = "Critical structural lineage breaks detected.";
  else if (decision === "reject" || decision === "freeze") summary = `Governance ${decision}.`;
  else if (highRiskCount > 0) summary = `${highRiskCount} high-risk requirement(s) in DRA.`;
  else if (decision === "require_fixes") summary = "Advisory fixes required before approve.";
  else if (readyForRelease) summary = "All constitutional checks pass — release ready.";

  return {
    lineage: {
      requirementCount: requirements.length,
      edgeCount: edges.length,
      byRequirement,
    },
    drift,
    counterfactuals,
    readiness: {
      structuralOk,
      blockingCount,
      highRiskCount,
      governanceDecision: decision,
      readyForRelease,
      summary,
    },
  };
}
