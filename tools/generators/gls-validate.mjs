#!/usr/bin/env node
/**
 * GLS-1.0 — validate governance ledger
 * Usage: node tools/generators/gls-validate.mjs [--fail-on-error]
 */
import { validateLedger } from "./gls-lib.mjs";

const result = validateLedger();
console.log(JSON.stringify(result, null, 2));
process.exit(result.status === "pass" || !process.argv.includes("--fail-on-error") ? 0 : 1);
