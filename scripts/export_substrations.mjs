#!/usr/bin/env node
/** JSON export of substration registry for Python governance gate. */
import { exportSubstrationRegistry } from "../src/substrations/registry.js";
console.log(JSON.stringify(exportSubstrationRegistry()));
