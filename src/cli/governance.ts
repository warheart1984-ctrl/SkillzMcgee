#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  formatVerificationReport,
  verifyGovernanceLedger,
} from "../governance/verifyGovernanceLedger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

const [, , cmd, ...args] = process.argv;

if (cmd === "verify") {
  const ledgerArg = args.find((a) => !a.startsWith("--"));
  const preferGls = args.includes("--gls");
  const ledgerPath = ledgerArg
    ? path.isAbsolute(ledgerArg)
      ? ledgerArg
      : path.resolve(REPO_ROOT, ledgerArg)
    : undefined;

  const result = verifyGovernanceLedger({
    ledgerPath,
    preferGl1: !preferGls,
  });

  if (args.includes("--json")) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(formatVerificationReport(result));
  }
  process.exit(result.ok ? 0 : 1);
}

console.error("Usage:");
console.error("  governance verify [ledgerPath] [--gls] [--json]");
process.exit(1);
