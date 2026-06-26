/**
 * Specimen round-trip — export → import → replay → verify
 */

import fs from "node:fs";
import path from "node:path";
import { foldSingularity } from "../../../src/singularity/absoluteSingularity.js";
import {
  SPECIMEN_DIR,
  getLedger,
  bootStudioRuntime,
  LEDGER_PATH,
  WORKSPACE_DIR,
} from "./studioRuntime.mjs";
/**
 * @param {string} [label]
 */
export function exportSpecimen(label = "specimen") {
  bootStudioRuntime();
  const ledger = getLedger();
  const fold = foldSingularity(ledger);
  const workspaceFiles = {};

  if (fs.existsSync(WORKSPACE_DIR)) {
    for (const name of fs.readdirSync(WORKSPACE_DIR)) {
      const full = path.join(WORKSPACE_DIR, name);
      if (fs.statSync(full).isFile()) {
        workspaceFiles[name] = fs.readFileSync(full, "utf8");
      }
    }
  }

  const bundle = {
    version: "specimen-1.0",
    label,
    exportedAt: new Date().toISOString(),
    ledger,
    fold: {
      fingerprint: fold.fingerprint,
      merkleRoot: fold.merkle?.globalRoot,
      receiptCount: fold.meta?.receiptCount ?? ledger.length,
    },
    workspace: workspaceFiles,
  };

  const id = `${label}-${Date.now()}`;
  const filePath = path.join(SPECIMEN_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(bundle, null, 2), "utf8");

  return { id, filePath, bundle };
}

/**
 * @param {string} specimenId
 */
export function importSpecimen(specimenId) {
  const filePath = path.join(SPECIMEN_DIR, `${specimenId}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Specimen not found: ${specimenId}`);
  }
  const bundle = JSON.parse(fs.readFileSync(filePath, "utf8"));

  fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
  for (const [name, content] of Object.entries(bundle.workspace ?? {})) {
    fs.writeFileSync(path.join(WORKSPACE_DIR, name), content, "utf8");
  }

  fs.mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  fs.writeFileSync(
    LEDGER_PATH,
    (bundle.ledger ?? []).map((r) => JSON.stringify(r)).join("\n") +
      (bundle.ledger?.length ? "\n" : ""),
    "utf8"
  );

  bootStudioRuntime();
  return { imported: specimenId, receiptCount: bundle.ledger?.length ?? 0 };
}

/**
 * @param {string} [specimenId] — if omitted, replay current ledger
 */
export function replaySpecimen(specimenId) {
  let ledger;
  if (specimenId) {
    const filePath = path.join(SPECIMEN_DIR, `${specimenId}.json`);
    const bundle = JSON.parse(fs.readFileSync(filePath, "utf8"));
    ledger = bundle.ledger ?? [];
  } else {
    bootStudioRuntime();
    ledger = getLedger();
  }

  const fold = foldSingularity(ledger);
  const recomputed = foldSingularity(ledger);

  return {
    receiptCount: ledger.length,
    fingerprint: fold.fingerprint,
    merkleRoot: fold.merkle?.globalRoot,
    deterministic: fold.fingerprint === recomputed.fingerprint,
    wave: fold.wave,
  };
}

/**
 * @param {string} specimenId
 */
export function verifySpecimen(specimenId) {
  const filePath = path.join(SPECIMEN_DIR, `${specimenId}.json`);
  if (!fs.existsSync(filePath)) {
    return { ok: false, errors: [`Specimen not found: ${specimenId}`] };
  }

  const bundle = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const errors = [];

  if (!bundle.version) errors.push("Missing bundle version");
  if (!Array.isArray(bundle.ledger)) errors.push("Missing ledger array");

  const fold = foldSingularity(bundle.ledger ?? []);
  if (bundle.fold?.fingerprint && bundle.fold.fingerprint !== fold.fingerprint) {
    errors.push("Fingerprint mismatch on replay");
  }
  if (bundle.fold?.merkleRoot && bundle.fold.merkleRoot !== fold.merkle?.globalRoot) {
    errors.push("Merkle root mismatch on replay");
  }

  const replay = replaySpecimen(specimenId);
  if (!replay.deterministic) errors.push("Non-deterministic fold on replay");

  return {
    ok: errors.length === 0,
    errors,
    fingerprint: fold.fingerprint,
    receiptCount: bundle.ledger?.length ?? 0,
  };
}

export function listSpecimens() {
  if (!fs.existsSync(SPECIMEN_DIR)) return [];
  return fs
    .readdirSync(SPECIMEN_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const full = path.join(SPECIMEN_DIR, f);
      const bundle = JSON.parse(fs.readFileSync(full, "utf8"));
      return {
        id: f.replace(/\.json$/, ""),
        label: bundle.label,
        exportedAt: bundle.exportedAt,
        receiptCount: bundle.ledger?.length ?? 0,
      };
    });
}
