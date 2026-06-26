#!/usr/bin/env node
/**
 * Print Nova Studio dev environment status (repo root, ports).
 */
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve({ port, inUse: true }));
    server.once("listening", () => {
      server.close(() => resolve({ port, inUse: false }));
    });
    server.listen(port, "127.0.0.1");
  });
}

const api = await checkPort(8787);
const vite = await checkPort(5174);

console.log("Nova Studio environment");
console.log("  repo root:", REPO_ROOT);
console.log("  node:", process.version);
console.log("  cwd:", process.cwd());
console.log("  port 8787 (API):", api.inUse ? "IN USE (server may already be running)" : "free");
console.log("  port 5174 (Vite):", vite.inUse ? "IN USE" : "free");
console.log("");
console.log("Commands (run from repo root):");
console.log("  npm run nova-studio           → http://localhost:8787");
console.log("  npm run nova-studio:react     → http://localhost:5174");
console.log("  npm run nova-studio:build:react  → build UI into nova-studio/dist-react/");
