export interface ProvenanceEnvelope {
  provenanceId: string;
  inputArtifactId: string;
  outputArtifactId: string;
  hashChainRoot: string;
  parentProvenanceId?: string;
}
