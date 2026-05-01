/**
 * Vitest — kanonik conditional-logic davranışını golden corpus'a karşı doğrular.
 *
 * Çalıştırma:
 *   npm run sync:aqe-spec  (golden JSON'u orbira-engines'ten kopyalar)
 *   npm test
 *
 * CI: .github/workflows/aqe-spec-test.yml
 *
 * Bu test, orbira-engines'in source-of-truth implementasyonu ile birebir aynı
 * sonucu vermek zorunda. Drift = CI red.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { shouldShowProfileField, type ProfileField } from "../engine-api";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE = resolve(__dirname, "__fixtures__/conditional-logic.golden.json");

interface GoldenCase {
  name: string;
  field: {
    id: string;
    conditions?: { profile?: Record<string, unknown> } | null;
    skip_conditions?: Record<string, unknown> | null;
  };
  profile: Record<string, unknown>;
  expected_visible: boolean;
}

interface GoldenCorpus {
  version: number;
  cases: GoldenCase[];
}

const corpus: GoldenCorpus = JSON.parse(readFileSync(FIXTURE, "utf8"));

describe("AQE conditional-logic golden corpus", () => {
  it("has at least 50 cases", () => {
    expect(corpus.cases.length).toBeGreaterThanOrEqual(50);
  });

  for (const c of corpus.cases) {
    it(c.name, () => {
      const field = {
        id: c.field.id,
        answer_type: "single_choice" as const,
        text: "test",
        conditions: c.field.conditions ?? undefined,
        skip_conditions: c.field.skip_conditions ?? undefined,
      } as unknown as ProfileField;
      const actual = shouldShowProfileField(field, c.profile);
      expect(actual, `Field "${c.field.id}" expected visible=${c.expected_visible}, got ${actual}`).toBe(c.expected_visible);
    });
  }
});
