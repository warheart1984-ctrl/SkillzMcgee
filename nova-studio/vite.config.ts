import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

export default defineConfig({
  plugins: [react()],
  root: repoRoot,
  publicDir: false,
  build: {
    outDir: path.join(__dirname, "dist-react"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, "index.react.html"),
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@nova-studio": path.join(repoRoot, "src/nova-studio"),
    },
  },
});
