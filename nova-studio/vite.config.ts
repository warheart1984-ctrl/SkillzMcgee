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
      "/canonical": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
      "/runtime": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
      "/conformance": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
      "/skillzmcgee": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@nova-studio": path.join(repoRoot, "src/nova-studio"),
      react: path.join(__dirname, "node_modules/react"),
      "react/jsx-runtime": path.join(__dirname, "node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.join(__dirname, "node_modules/react/jsx-dev-runtime.js"),
      "react-dom": path.join(__dirname, "node_modules/react-dom"),
      "react-dom/client": path.join(__dirname, "node_modules/react-dom/client.js"),
      "react-router-dom": path.join(__dirname, "node_modules/react-router-dom/dist/index.mjs"),
      d3: path.join(__dirname, "node_modules/d3/src/index.js"),
    },
  },
});
