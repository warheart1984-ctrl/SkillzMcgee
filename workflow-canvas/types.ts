/** Workflow Modeling Canvas v1.0 â€” CMS-1.0 types */

export interface Observation {
  id: string;
  capturedAt?: string;
  sourceRef: string;
  actors: string[];
  inputs?: string[];
  triggers?: string[];
  steps: string[];
  tools?: string[];
  handoffs?: string[];
  waitStates?: string[];
  bottlenecks?: string[];
  risks?: string[];
  artifactsProduced?: string[];
  notes?: string;
}

export interface ObservationSet {
  setVersion: string;
  generatedAt: string;
  observations: Observation[];
}

export interface Finding {
  id: string;
  observationIds: string[];
  summary: string;
  patterns?: string[];
  frictionPoints?: string[];
  failureModes?: string[];
  decisionPoints?: string[];
  automationOpportunities?: string[];
  governanceGaps?: string[];
  complianceRisks?: string[];
  costTimeInefficiencies?: string[];
}

export interface FindingsSet {
  setVersion: string;
  generatedAt: string;
  findings: Finding[];
}

export interface Recommendation {
  id: string;
  findingIds: string[];
  recommendation: string;
  requiredCapabilities?: string[];
  governanceImplications?: string[];
  implementationConstraints?: string[];
  dependencies?: string[];
}

export interface RecommendationSet {
  setVersion: string;
  generatedAt: string;
  recommendations: Recommendation[];
}

export interface ExpectedOutcome {
  id: string;
  recommendationIds: string[];
  description: string;
  expectedImprovement?: string;
}

export interface ExpectedOutcomeSet {
  setVersion: string;
  generatedAt: string;
  expectedOutcomes: ExpectedOutcome[];
}

export interface SuccessMetric {
  id: string;
  expectedOutcomeIds: string[];
  name: string;
  definition: string;
  quantitative?: boolean;
  target?: string;
  baseline?: string;
}

export interface SuccessMetricSet {
  setVersion: string;
  generatedAt: string;
  successMetrics: SuccessMetric[];
}

export interface TraceabilityChain {
  chainId: string;
  observationId: string;
  findingId: string;
  recommendationId: string;
  expectedOutcomeId: string;
  successMetricId: string;
}

export interface TraceabilityMap {
  mapVersion: string;
  generatedAt: string;
  chains: TraceabilityChain[];
}

export interface WorkflowCanvasV1 {
  canvasVersion: "1.0.0";
  engagementId: string;
  generatedAt: string;
  methodology: "CMS-1.0";
  operatorReviewed?: boolean;
  observationSet: ObservationSet;
  findingsSet: FindingsSet;
  recommendationSet: RecommendationSet;
  expectedOutcomeSet: ExpectedOutcomeSet;
  successMetricSet: SuccessMetricSet;
  traceabilityMap: TraceabilityMap;
}

export interface CanvasValidationIssue {
  invariant: string;
  message: string;
  entityId?: string;
}

export interface CanvasValidationResult {
  valid: boolean;
  issues: CanvasValidationIssue[];
  chainCount: number;
  observationCount: number;
}
