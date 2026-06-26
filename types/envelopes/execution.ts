export interface ExecutionEnvelope {
  runtimeId: string;
  implementationId: string;
  operatorId: string;
  executionContext: {
    configHash: string;
    environment: "dev" | "staging" | "prod";
  };
}
