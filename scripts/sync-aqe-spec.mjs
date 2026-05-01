#!/usr/bin/env node
/**
 * Golden conditional-logic corpus'unu orbira-engines'ten kopyalar.
 *
 * Kullanım:
 *   ORBIRA_ENGINES_PATH=/path/to/orbira-engines node scripts/sync-aqe-spec.mjs
 *   (env yoksa default: ../orbira-engines)
 *
 * CI'da: orbira-engines repo'su sibling olarak checkout edilir, env path verilir.
 *
 * Hedef: src/lib/__tests__/__fixtures__/conditional-logic.golden.json
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const enginesPath = process.env.ORBIRA_ENGINES_PATH ?? resolve(repoRoot, "../orbira-engines");
const sourceFile = resolve(enginesPath, "engines/aqe/spec/conditional-logic.golden.json");
const targetDir = resolve(repoRoot, "src/lib/__tests__/__fixtures__");
const targetFile = resolve(targetDir, "conditional-logic.golden.json");

if (!existsSync(sourceFile)) {
  console.warn(`[sync-aqe-spec] Source not found: ${sourceFile}`);
  console.warn("[sync-aqe-spec] Skipping sync. Set ORBIRA_ENGINES_PATH env to the orbira-engines repo path.");
  process.exit(0);
}

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

const content = readFileSync(sourceFile, "utf8");
writeFileSync(targetFile, content);

const parsed = JSON.parse(content);
console.log(`[sync-aqe-spec] OK: ${parsed.cases.length} cases synced to ${targetFile}`);
