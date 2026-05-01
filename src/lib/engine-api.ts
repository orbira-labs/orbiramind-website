// API calls go through our secure server-side routes
// No API keys are exposed to the client

export type ProfileCategory = "demographic" | "physical" | "lifestyle" | "health" | "habit" | "nutrition" | "identity";

/**
 * Condition value tipleri spec'e göre esnektir:
 * scalar (string|number|boolean) veya array. Karşılaştırma strict equality.
 */
export type ConditionScalar = string | number | boolean;
export type ConditionValue = ConditionScalar | ConditionScalar[];

export interface ProfileFieldConditions {
  profile?: Record<string, ConditionValue>;
}

/**
 * Backend'den dönen kategori UI metadata'sı.
 * `aqe.profile_fields.category_meta` jsonb'sinden gelir. Aynı kategoriye ait
 * tüm field'lar aynı meta'yı taşır.
 */
export interface ProfileCategoryMeta {
  label: string;
  description?: string;
  order: number;
}

export interface ProfileField {
  id: string;
  answer_type: "single_choice" | "boolean" | "text" | "multi_select" | "numeric";
  text: string;
  category?: ProfileCategory | string;
  /** Kategori UI metadata (DB tek source of truth). Eski release'lerde olmayabilir. */
  category_meta?: ProfileCategoryMeta;
  /** Numeric input suffix birimi (örn. "cm", "kg"). Diğer answer_type'lar için undefined. */
  unit?: string | null;
  options?: { value: string | boolean; label: string }[];
  numeric_range?: { min: number; max: number } | null;
  required?: boolean;
  stage?: number;
  conditions?: ProfileFieldConditions | null;
  skip_conditions?: Record<string, ConditionValue> | null;
  skip_default_value?: string | null;
}

/**
 * Profile field conditional logic — KANONIK implementasyon.
 *
 * Spec: orbira-engines/engines/aqe/spec/conditional-logic.md
 * Test: src/lib/__tests__/conditional-golden.test.ts (golden corpus, 56+ case)
 *
 * Backend (`supabase/functions/_shared/aqe/validators.ts`) ve mobile
 * (`lib/aqe/models.dart`) ile **birebir aynı davranmak zorundadır**.
 * Drift'i CI golden test yakalar.
 *
 * Kurallar (özet):
 *   - Strict equality, type coercion YASAK (ASLA `String(value)` kullanma)
 *   - undefined/null parent: conditions._in → hide, conditions._not → show, exact → hide
 *   - skip_conditions undefined parent → ATLAMA YOK (her zaman)
 *   - Multi-condition AND
 *   - Multi-select parent: `_in` = overlap, `_not` = no overlap
 */
export function shouldShowProfileField(
  field: ProfileField,
  profile: Record<string, unknown>
): boolean {
  if (field.skip_conditions && typeof field.skip_conditions === "object") {
    for (const [key, value] of Object.entries(field.skip_conditions)) {
      if (matchesConditionExpression(key, value, profile, "skip")) {
        return false;
      }
    }
  }

  if (!field.conditions || typeof field.conditions !== "object") {
    return true;
  }
  const profileConditions = field.conditions.profile;
  if (!profileConditions || typeof profileConditions !== "object" || Object.keys(profileConditions).length === 0) {
    return true;
  }

  for (const [key, value] of Object.entries(profileConditions)) {
    if (!matchesConditionExpression(key, value, profile, "conditions")) {
      return false;
    }
  }

  return true;
}

function matchesConditionExpression(
  key: string,
  conditionValue: unknown,
  profile: Record<string, unknown>,
  channel: "conditions" | "skip"
): boolean {
  let parentId: string;
  let operator: "in" | "not" | "exact";
  if (key.endsWith("_in")) {
    parentId = key.slice(0, -3);
    operator = "in";
  } else if (key.endsWith("_not")) {
    parentId = key.slice(0, -4);
    operator = "not";
  } else {
    parentId = key;
    operator = "exact";
  }

  const parent = profile[parentId];

  if (parent === undefined || parent === null) {
    if (channel === "skip") return false;
    if (operator === "not") return true;
    return false;
  }

  if (operator === "exact") {
    return parent === conditionValue;
  }

  const valueArray = Array.isArray(conditionValue) ? conditionValue : [conditionValue];

  if (Array.isArray(parent)) {
    const hasOverlap = parent.some((p) => valueArray.includes(p));
    return operator === "in" ? hasOverlap : !hasOverlap;
  }

  const isMember = valueArray.includes(parent);
  return operator === "in" ? isMember : !isMember;
}

export interface ProfileGroup {
  category: string;
  label: string;
  description: string;
  fields: ProfileField[];
}

/**
 * Field'ları kategoriye göre gruplar; her grubun label/description/order'ı
 * backend'den gelen `category_meta`'dan okunur (DB = source of truth).
 *
 * Eski client release'lerinde `category_meta` olmayabilir veya yeni bir
 * kategori (DB'de var, seed eksik) gelebilir; bu durumda field'ın ham
 * `category` string'ini başlık olarak göster — kullanıcı stuck olmaz,
 * developer bug'ı UI'da fark eder.
 */
export function groupProfileFields(fields: ProfileField[]): ProfileGroup[] {
  const grouped = new Map<string, { meta: ProfileCategoryMeta | null; items: ProfileField[] }>();

  for (const field of fields) {
    const cat = field.category ?? "other";
    if (!grouped.has(cat)) {
      grouped.set(cat, { meta: field.category_meta ?? null, items: [] });
    }
    const entry = grouped.get(cat)!;
    if (!entry.meta && field.category_meta) entry.meta = field.category_meta;
    entry.items.push(field);
  }

  return Array.from(grouped.entries())
    .map(([category, { meta, items }]) => ({
      category,
      label: meta?.label ?? category,
      description: meta?.description ?? "",
      fields: items,
      _order: meta?.order ?? 99,
    }))
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...rest }) => rest);
}

export interface CoreQuestion {
  id: string;
  text: string;
  dimension: string;
  scale_labels?: string[];
}

/**
 * Pool UI metadata (backend'den gelir). 8 sabit token: body, character,
 * lifestyle, mind, movement, nutrition, sleep, social. Yeni pool eklemek
 * = mevcut token seç, client değişikliği gerekmez.
 */
export interface PoolUiCategory {
  id: string;
  label: string;
  emoji?: string;
}

export interface DeepDiveQuestion {
  id: string;
  text: string;
  pool: string;
  answer_type?: "scale" | "single_choice" | "multi_select";
  scale_labels?: string[];
  options?: { value: string; label: string }[];
  /** DB'deki `aqe.deep_dive_pools.ui_category` jsonb'si. */
  ui_category?: PoolUiCategory;
}

/**
 * AQE Gateway v3.0 (2026-04-18): measurement_context aşaması kaldırıldı.
 * habit/body alanları (height, weight, water_intake, caffeine_intake,
 * alcohol_frequency) artık yalnızca profile_fields içinde.
 */
export interface SessionData {
  session_id: string;
  profile_fields: ProfileField[];
  core_questions: CoreQuestion[];
}

export interface SubmitAnswersResponse {
  deep_dive_questions: DeepDiveQuestion[];
}

export interface DimensionScore {
  id: string;
  label: string;
  score: number;
}

export interface TraitScore {
  trait: string;
  label: string;
  score: number;
}

export interface PatternResult {
  name: string;
  type: string;
  level: string;
  description: string;
}

/**
 * v3: klinik hipotez — opsiyonel.
 * Orbira-engines inference engine v3 tarafından üretilir.
 */
export interface ClinicalHypothesis {
  statement: string;
  null_alternative: string;
  testable_in_session: string[];
  disconfirmation_signals: string[];
}

export interface InsightResult {
  title: string;
  insight: string;
  severity: string;
  suggestion?: string;
  /** Inference tipi. v3 ile yeni klinik kategoriler eklendi. */
  type?:
    | "cross_domain"
    | "profile_signal"
    | "absence_signal"
    | "cascade"
    | "hidden_strength"
    | "contradiction"
    | "temporal_pattern"
    | "defense_hypothesis"
    | "alliance_signal"
    | "attachment_dynamic"
    | "intervention_priority"
    | "readiness_mismatch"
    | "inconsistency";
  /** Terapötik yönelim. */
  therapeutic_implication?: string;
  session_exploration?: string[];
  countertransference_alert?: string;
  intervention_timing?: "immediate" | "early" | "mid_therapy" | "ongoing";
  client_language?: string;
  /** v3: Klinik hipotez (opsiyonel). */
  clinical_hypothesis?: ClinicalHypothesis;
}

export interface AnalysisResults {
  wellness_score: number;
  dimension_scores: DimensionScore[];
  top_strengths: TraitScore[];
  top_risks: TraitScore[];
  traits: TraitScore[];
  patterns: PatternResult[];
  inferences: InsightResult[];
}

export interface Report {
  character_analysis: string;
  top5_and_weak5: {
    top5: { name: string; insight: string }[];
    weak5: { name: string; insight: string }[];
  };
  session_guide?: {
    title: string;
    insight: string;
    action: string;
    timing: "first_session" | "early_phase" | "mid_therapy" | "throughout";
  }[];
  therapeutic_tasks?: {
    title: string;
    description: string;
    rationale: string;
    priority: "high" | "medium" | "low";
    timing: "this_week" | "weeks_2_4" | "months_1_3";
    candidate_ids: string[];
    evidence_refs: string[];
  }[];
  blind_spots?: {
    title: string;
    insight: string;
    coach_tip: string;
  }[];
  /** @deprecated Replaced by `therapeutic_tasks`. Kept optional for legacy snapshots. */
  coaching_roadmap?: {
    immediate: string[];
    short_term: string[];
    medium_term: string[];
  };
  generated_at: string;
  model: string;
}

export interface CompleteSessionResponse {
  results: {
    analysis: AnalysisResults;
    report: Report | null;
    metadata?: {
      report_status?: "pending" | "ready" | "failed";
      [key: string]: unknown;
    };
  };
  report_status?: "pending" | "ready" | "failed";
}

class EngineAPIError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "EngineAPIError";
    this.code = code;
    this.status = status;
  }
}

const ENGINE_REQUEST_TIMEOUT_MS = 30_000;
const ENGINE_COMPLETE_TIMEOUT_MS = 150_000; // 2.5 dakika - AI rapor üretimi uzun sürebilir

// Backend `If-Question-Set-Version` header'ını okuyup outdated client tespiti
// için kullanır. createSession response'undan dönen `versions.question_set`
// burada cache'lenir; submitAnswers çağrılarına header olarak iletilir.
let _lastQuestionSetVersion: string | null = null;

export function setLastQuestionSetVersion(v: string | null): void {
  _lastQuestionSetVersion = v;
}

async function secureApiFetch<T>(
  endpoint: string,
  body: Record<string, unknown>,
  testToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (testToken) {
    headers["x-test-token"] = testToken;
  }
  if (_lastQuestionSetVersion && (endpoint === "answers" || endpoint === "complete")) {
    headers["if-question-set-version"] = _lastQuestionSetVersion;
  }

  // Complete endpoint için daha uzun timeout (AI rapor üretimi)
  const timeoutMs = endpoint === "complete" ? ENGINE_COMPLETE_TIMEOUT_MS : ENGINE_REQUEST_TIMEOUT_MS;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`/api/engine/${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new EngineAPIError("İstek zaman aşımına uğradı", "TIMEOUT", 408);
    }
    throw new EngineAPIError(
      err instanceof Error ? err.message : "Ağ hatası",
      "NETWORK_ERROR",
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    throw new EngineAPIError(
      "Sunucudan geçersiz yanıt alındı",
      "INVALID_RESPONSE",
      res.status
    );
  }

  if (!res.ok || data.error) {
    const errVal = data.error;
    throw new EngineAPIError(
      typeof errVal === "object" && errVal !== null && "message" in errVal
        ? String((errVal as Record<string, unknown>).message)
        : typeof errVal === "string"
          ? errVal
          : "API error",
      typeof errVal === "object" && errVal !== null && "code" in errVal
        ? String((errVal as Record<string, unknown>).code)
        : "UNKNOWN_ERROR",
      res.status
    );
  }

  // Handle both wrapped and unwrapped responses
  return (data.data ?? data) as T;
}

export interface SessionVersions {
  question_set?: string;
  routing?: string;
  engine?: string;
}

export interface SessionDataWithVersions extends SessionData {
  versions?: SessionVersions;
}

export async function createSession(testToken?: string): Promise<SessionData> {
  const data = await secureApiFetch<SessionDataWithVersions>("session", {}, testToken);
  // Cache question_set version → submitAnswers/complete header olarak gider
  setLastQuestionSetVersion(data.versions?.question_set ?? null);
  return data;
}

export async function submitAnswers(
  sessionId: string,
  profile: Record<string, unknown>,
  coreAnswers: Record<string, number>,
  testToken?: string
): Promise<SubmitAnswersResponse> {
  return secureApiFetch<SubmitAnswersResponse>("answers", {
    session_id: sessionId,
    profile,
    core_answers: coreAnswers,
  }, testToken);
}

export async function completeSession(
  sessionId: string,
  deepDiveAnswers: Record<string, number | string | string[]>,
  testToken?: string
): Promise<CompleteSessionResponse> {
  return secureApiFetch<CompleteSessionResponse>("complete", {
    session_id: sessionId,
    deep_dive_answers: deepDiveAnswers,
  }, testToken);
}

export { EngineAPIError };
