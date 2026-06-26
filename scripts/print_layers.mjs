#!/usr/bin/env node
import { renderOrganismDiagram } from "../src/ui/organism_diagram.js";

console.log(renderOrganismDiagram().join("\n"));
