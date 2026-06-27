#!/usr/bin/env node
/**
 * COR Suite CLI - CAR -> CAV -> COR -> PGI -> DRA -> Analysis -> Maturity -> Governance.
 */
import { generateCor } from "../cor/index.js";
import { runProofAnalysis } from "../analysis/index.js";
import { emitCavValidation } from "../cor-suite/car/validate.js";
import { bootstrapCarRegistry } from "../cor-suite/car/bootstrap.js";
import { emitDraReport } from "../cor-suite/dra/index.js";
import { emitProofGraphIndex } from "../cor-suite/pgi/index.js";
import {
  printPipelineSummary,
  runCorSuitePipeline,
  runGovernOnly,
  runMaturityOnly,
} from "../hygiene/pipeline.js";
import { hygienePasses, scanRepoHygiene } from "../hygiene/scanner.js";

const [, , cmd, ...rest] = process.argv;

function hasFlag(flag: string): boolean {
  return rest.includes(flag);
}

function stewardArg(): string | undefined {
  const i = rest.indexOf("--steward");
  return i >= 0 ? rest[i + 1] : undefined;
}

function main(): void {
  switch (cmd) {
    case "car:bootstrap": {
      const out = bootstrapCarRegistry();
      console.log(`CAR registry -> ${out}`);
      break;
    }
    case "cav":
    case "validate": {
      const out = emitCavValidation();
      console.log(`CAV validation -> ${out}`);
      break;
    }
    case "cor": {
      const out = generateCor({ skipGenerators: hasFlag("--skip-generators") });
      console.log(`COR state vector -> ${out}`);
      break;
    }
    case "pgi": {
      const out = emitProofGraphIndex();
      console.log(`PGI proof graph index -> ${out}`);
      break;
    }
    case "dra": {
      if (!hasFlag("--skip-pgi")) {
        emitProofGraphIndex();
      }
      const out = emitDraReport();
      console.log(`DRA report -> ${out}`);
      break;
    }
    case "analyze": {
      if (!hasFlag("--skip-generators")) {
        generateCor({ skipGenerators: false });
      }
      const out = runProofAnalysis();
      console.log(`Proof Analysis -> ${out}`);
      break;
    }
    case "govern": {
      const result = runGovernOnly(stewardArg());
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    case "maturity": {
      const out = runMaturityOnly();
      console.log(`Maturity vector -> ${out}`);
      break;
    }
    case "hygiene": {
      const status = scanRepoHygiene();
      console.log(JSON.stringify(status, null, 2));
      if (!hygienePasses(status)) process.exitCode = 1;
      break;
    }
    case "pipeline": {
      const result = runCorSuitePipeline({
        skipGenerators: hasFlag("--skip-generators"),
        steward: stewardArg() ?? "cor-suite-cli",
        failOnGovernanceReject: hasFlag("--fail-on-reject"),
        registerGovernanceReceipt: hasFlag("--register-governance-receipt"),
      });
      printPipelineSummary(result);
      if (hasFlag("--fail-on-reject") && ["reject", "freeze"].includes(result.governance.decision)) {
        process.exitCode = 1;
      }
      break;
    }
    default:
      console.error("Usage: cor-suite <car:bootstrap|cav|validate|cor|pgi|dra|analyze|govern|maturity|hygiene|pipeline> [options]");
      process.exitCode = 1;
  }
}

try {
  main();
} catch (err: unknown) {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
}
