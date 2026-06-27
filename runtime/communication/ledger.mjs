import crypto from "node:crypto";
import { COMM_CONSTITUTION_VERSION } from "./constants.mjs";
import { appendLedgerEntry, listLedgerEntries } from "./store.mjs";

export function ledgerId(entry) {
  return `COMM-${crypto
    .createHash("sha256")
    .update(JSON.stringify({ ...entry, id: undefined }))
    .digest("hex")
    .slice(0, 16)}`;
}

export function writeCommunicationLedgerEntry(entry) {
  const normalized = {
    id: entry.id ?? ledgerId(entry),
    timestamp: entry.timestamp ?? new Date().toISOString(),
    comm_constitution_version: entry.comm_constitution_version ?? COMM_CONSTITUTION_VERSION,
    ...entry,
  };
  return appendLedgerEntry(normalized);
}

export function queryCommunicationLedger({ entry_type, from, to, filters = {} } = {}) {
  return listLedgerEntries()
    .filter((entry) => !entry_type || entry.entry_type === entry_type)
    .filter((entry) => !from || entry.timestamp >= from)
    .filter((entry) => !to || entry.timestamp <= to)
    .filter((entry) => {
      for (const [key, value] of Object.entries(filters)) {
        if (!value) continue;
        if (entry[key] !== value) return false;
      }
      return true;
    });
}
