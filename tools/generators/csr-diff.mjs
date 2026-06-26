#!/usr/bin/env node
import fs from "node:fs";

const [oldPath, newPath] = process.argv.slice(2);
const oldCsr = JSON.parse(fs.readFileSync(oldPath, "utf8"));
const newCsr = JSON.parse(fs.readFileSync(newPath, "utf8"));

function toMap(csr) {
  if (Array.isArray(csr.claims)) {
    return Object.fromEntries(csr.claims.map((c) => [c.id, c.status]));
  }
  return csr.claims ?? {};
}

const oldMap = toMap(oldCsr);
const newMap = toMap(newCsr);

for (const id of Object.keys(newMap)) {
  if (oldMap[id] !== newMap[id]) {
    console.log(`Status change: ${id}: ${oldMap[id] ?? "—"} → ${newMap[id]}`);
  }
}
