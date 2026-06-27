export const CATEGORIES = [
  "normative",
  "architectural",
  "methodological",
  "implementation",
  "human",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type MessageDirection = "jon->darz" | "darz->jon";

export type Impact = "spec" | "repo" | "ops" | "neither";

/** Dar-Z → Jon normative impact (spec / repo / neither) */
export type NormativeImpact = "spec" | "repo" | "neither";

export const REPOSITORY_TARGETS = [
  "specification",
  "conformance",
  "MRI",
  "docs",
  "website",
] as const;

export type RepositoryTarget = (typeof REPOSITORY_TARGETS)[number];

export type Altitude = "constitutional" | "architectural" | "engineering" | "human";

export type Latency = "now" | "soon" | "whenever";

export type AskAction = "review" | "refine" | "approve" | "ignore" | "respond" | "none";

export interface NormalizedMessage {
  direction: MessageDirection;
  category: Category;
  secondaryCategory?: Category;
  coreClaim: string;
  context: string;
  impact: Impact;
  /** Dar-Z → Jon: collapsed spec / repo / neither */
  normativeImpact: NormativeImpact;
  requiredAction: AskAction;
  /** Dar-Z → Jon: what Jon needs to update, write, or adjust */
  requiredActionDetail: string;
  ask: AskAction;
  targets: string[];
  /** Dar-Z → Jon: specification / conformance / MRI / docs / website */
  repositoryTargets: RepositoryTarget[];
  altitude: Altitude;
  latency: Latency;
  rawText: string;
}

export interface JonToDarzTranslation {
  category: Category;
  coreStatement: string;
  context: string;
  impact: Impact;
  ask: AskAction;
  latency: Latency;
  body: string;
}

export interface DarzToJonTranslation {
  category: Category;
  categoryLabel: string;
  coreClaim: string;
  normativeImpact: NormativeImpact;
  requiredActionDetail: string;
  repositoryTargets: RepositoryTarget[];
  responseAltitude: Altitude;
  /** Machine-readable canonical block */
  canonical: string;
  /** Architect-grade Jon reply draft */
  jonReply: string;
}

export interface InvariantViolation {
  id: string;
  message: string;
}
