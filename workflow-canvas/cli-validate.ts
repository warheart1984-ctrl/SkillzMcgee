#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateCanvas, type WorkflowCanvasV1 } from "./validate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultPath = path.join(__dirname, "examples/canvas-v1.0.example.json");

const target = process.argv[2] ?? defaultPath;
const raw = fs.readFileSync(target, "utf8");
const canvas = JSON.parse(raw) as WorkflowCanvasV1;
const result = validateCanvas(canvas);

console.log(JSON.stringify(result, null, 2));
if (!result.valid) process.exit(1);
