import { COR_ARTIFACTS, fetchArtifact } from "../config.js";

export async function fetchCarRegistry() {
  return fetchArtifact(COR_ARTIFACTS.carRegistry);
}

/** Alias for steward dashboard. */
export const fetchCar = fetchCarRegistry;

export async function fetchCavValidation() {
  return fetchArtifact(COR_ARTIFACTS.cavValidation);
}

export async function fetchCavReport() {
  return fetchArtifact<CavReportShape>(COR_ARTIFACTS.cavReport);
}

/** Alias — simplified blocking/advisory report for dashboards. */
export const fetchCav = fetchCavReport;

export interface CavReportShape {
  cavVersion: string;
  generatedAt: string;
  blocking: Array<{ id: string; issue: string; detail: string }>;
  advisory: Array<{ id: string; issue: string; detail: string }>;
}

export async function fetchCorState() {
  return fetchArtifact(COR_ARTIFACTS.corState);
}

export const fetchCor = fetchCorState;

export async function fetchProofAnalysis() {
  return fetchArtifact(COR_ARTIFACTS.proofAnalysis);
}

export async function fetchGovernanceReceipt() {
  return fetchArtifact(COR_ARTIFACTS.governanceReceipt);
}

export async function fetchMaturityVector() {
  return fetchArtifact(COR_ARTIFACTS.maturityVector);
}

export async function fetchRepoHygiene() {
  return fetchArtifact(COR_ARTIFACTS.repoHygiene);
}

export async function fetchPgi() {
  return fetchArtifact(COR_ARTIFACTS.pgi);
}

export async function fetchDra() {
  return fetchArtifact(COR_ARTIFACTS.draReport);
}

export async function fetchCsr() {
  return fetchArtifact(COR_ARTIFACTS.csrReport);
}

export async function fetchAllCorArtifacts() {
  const [cor, analysis, receipt, maturity, hygiene] = await Promise.all([
    fetchCorState(),
    fetchProofAnalysis(),
    fetchGovernanceReceipt(),
    fetchMaturityVector(),
    fetchRepoHygiene(),
  ]);
  return { cor, analysis, receipt, maturity, hygiene };
}

export async function fetchAllGovernanceArtifacts() {
  const [car, cav, cor, dra, pgi, receipt, csr] = await Promise.all([
    fetchCarRegistry(),
    fetchCavReport(),
    fetchCorState(),
    fetchDra(),
    fetchPgi(),
    fetchGovernanceReceipt(),
    fetchCsr(),
  ]);
  return { car, cav, cor, dra, pgi, receipt, csr };
}
