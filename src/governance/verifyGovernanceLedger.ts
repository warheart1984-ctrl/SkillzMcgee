import fs from "node:fs";
import { detectLedgerFormat } from "./detectFormat.js";
import { validateGl1Ledger, type Gl1Entry } from "./gl1.js";
import { validateGls1Ledger, type Gls1Entry } from "./gls1.js";
import { GOVERNANCE_PATHS } from "./paths.js";
import { readLedgerFile } from "./readLedger.js";
import { validateGl1Evidence, validateGls1Evidence } from "./validateEvidence.js";

export interface GovernanceLedgerChecks {
  ledgerIntegrity: "OK" | "FAIL";
  signatures: string;
  continuity: "OK" | "FAIL";
  evidenceReferences: "OK" | "FAIL";
  governanceRules: "OK" | "FAIL";
}

export interface GovernanceLedgerVerificationResult {
  ok: boolean;
  format: ReturnType<typeof detectLedgerFormat>;
  ledgerPath: string;
  entries: number;
  checks: GovernanceLedgerChecks;
  errors: Array<{ id: string; errors: string[] }>;
  summary: string;
}

export interface VerifyGovernanceLedgerOptions {
  ledgerPath?: string;
  /** Prefer GL-1.0 ledger when both exist */
  preferGl1?: boolean;
}

function resolveLedgerPath(options: VerifyGovernanceLedgerOptions = {}): string {
  if (options.ledgerPath) return options.ledgerPath;
  const glExists = fs.existsSync(GOVERNANCE_PATHS.glLedger);
  const glsExists = fs.existsSync(GOVERNANCE_PATHS.glsLedger);
  if (options.preferGl1 !== false && glExists) return GOVERNANCE_PATHS.glLedger;
  if (glsExists) return GOVERNANCE_PATHS.glsLedger;
  return GOVERNANCE_PATHS.glLedger;
}

function continuityOkGl1(errors: Array<{ id: string; errors: string[] }>): boolean {
  return !errors.some((e) =>
    e.errors.some((x) => x.includes("continuity") || x.includes("parent")),
  );
}

function signaturesOkGl1(errors: Array<{ id: string; errors: string[] }>): boolean {
  return !errors.some((e) => e.errors.some((x) => x.includes("signature")));
}

function continuityOkGls1(entries: Gls1Entry[]): boolean {
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1];
    const cur = entries[i];
    if (cur && prev && cur.previous_hash !== prev.governance_hash) return false;
  }
  return true;
}

function signaturesOkGls1(errors: Array<{ id: string; errors: string[] }>): boolean {
  return !errors.some((e) => e.errors.some((x) => x.includes("hash mismatch")));
}

export function verifyGovernanceLedger(
  options: VerifyGovernanceLedgerOptions = {},
): GovernanceLedgerVerificationResult {
  const ledgerPath = resolveLedgerPath(options);
  const raw = readLedgerFile(ledgerPath);
  const format = detectLedgerFormat(raw);
  const errors: Array<{ id: string; errors: string[] }> = [];

  if (format === "empty") {
    return {
      ok: false,
      format,
      ledgerPath,
      entries: 0,
      checks: {
        ledgerIntegrity: "FAIL",
        signatures: "FAIL",
        continuity: "FAIL",
        evidenceReferences: "FAIL",
        governanceRules: "FAIL",
      },
      errors: [{ id: "ledger", errors: ["ledger empty or missing"] }],
      summary: "Ledger integrity: FAIL (empty)",
    };
  }

  if (format === "GL-1.0") {
    const entries = raw as Gl1Entry[];
    const integrity = validateGl1Ledger(entries);

    for (const entry of entries) {
      const evErrs = validateGl1Evidence(entry);
      if (evErrs.length) errors.push({ id: entry.id, errors: evErrs });
    }

    const allErrors = [...integrity.errors, ...errors];
    const checks: GovernanceLedgerChecks = {
      ledgerIntegrity: integrity.status === "pass" ? "OK" : "FAIL",
      signatures: signaturesOkGl1(integrity.errors)
        ? `OK (${entries.length}/${entries.length})`
        : "FAIL",
      continuity: continuityOkGl1(integrity.errors) ? "OK" : "FAIL",
      evidenceReferences: errors.length === 0 ? "OK" : "FAIL",
      governanceRules: integrity.status === "pass" && errors.length === 0 ? "OK" : "FAIL",
    };

    const ok =
      checks.ledgerIntegrity === "OK" &&
      checks.signatures.startsWith("OK") &&
      checks.continuity === "OK" &&
      checks.evidenceReferences === "OK" &&
      checks.governanceRules === "OK";

    return {
      ok,
      format,
      ledgerPath,
      entries: entries.length,
      checks,
      errors: allErrors,
      summary: ok
        ? "Ledger integrity: OK"
        : `Ledger integrity: FAIL (${allErrors.length} issue(s))`,
    };
  }

  const entries = raw as Gls1Entry[];
  const integrity = validateGls1Ledger(entries);

  for (const entry of entries) {
    const evErrs = validateGls1Evidence(entry);
    if (evErrs.length) errors.push({ id: entry.entry_id, errors: evErrs });
  }

  const allErrors = [...integrity.errors, ...errors];
  const sigOk = signaturesOkGls1(integrity.errors);
  const contOk = continuityOkGls1(entries);

  const checks: GovernanceLedgerChecks = {
    ledgerIntegrity: integrity.status === "pass" ? "OK" : "FAIL",
    signatures: sigOk ? "OK" : "FAIL",
    continuity: contOk ? "OK" : "FAIL",
    evidenceReferences: errors.length === 0 ? "OK" : "FAIL",
    governanceRules:
      entries.every((e) => e.steward_votes.length > 0) && integrity.status === "pass"
        ? "OK"
        : "FAIL",
  };

  const ok =
    checks.ledgerIntegrity === "OK" &&
    checks.signatures === "OK" &&
    checks.continuity === "OK" &&
    checks.evidenceReferences === "OK" &&
    checks.governanceRules === "OK";

  return {
    ok,
    format,
    ledgerPath,
    entries: entries.length,
    checks,
    errors: allErrors,
    summary: ok ? "Ledger integrity: OK" : `Ledger integrity: FAIL (${allErrors.length} issue(s))`,
  };
}

export function formatVerificationReport(result: GovernanceLedgerVerificationResult): string {
  const lines = [
    result.summary,
    `Format: ${result.format}`,
    `Path: ${result.ledgerPath}`,
    `Entries: ${result.entries}`,
    `Signatures: ${result.checks.signatures}`,
    `Continuity: ${result.checks.continuity}`,
    `Evidence references: ${result.checks.evidenceReferences}`,
    `Governance rules: ${result.checks.governanceRules}`,
  ];
  if (!result.ok) {
    for (const err of result.errors) {
      for (const msg of err.errors) {
        lines.push(`ERROR: ${msg} (entry ${err.id})`);
      }
    }
  }
  return lines.join("\n");
}
