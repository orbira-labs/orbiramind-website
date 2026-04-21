// API calls go through our secure server-side routes
// No API keys are exposed to the client

export type ProfileCategory = "demographic" | "physical" | "lifestyle" | "health" | "habit" | "nutrition" | "identity";

export interface ProfileFieldConditions {
  profile?: Record<string, string | string[] | boolean>;
}

export interface ProfileField {
  id: string;
  answer_type: "single_choice" | "boolean" | "text" | "multi_select" | "numeric";
  text: string;
  category?: ProfileCategory | string;
  options?: { value: string | boolean; label: string }[];
  numeric_range?: { min: number; max: number } | null;
  required?: boolean;
  stage?: number;
  conditions?: ProfileFieldConditions;
  skip_conditions?: Record<string, string[]>;
  skip_default_value?: string | null;
}

/**
 * Evaluates if a profile field should be shown based on conditions and current profile values.
 * Returns true if the field should be shown, false if it should be skipped.
 */
export function shouldShowProfileField(
  field: ProfileField,
  profile: Record<string, unknown>
): boolean {
  // Check skip_conditions first (format: {age_range_in: ["13_18"]})
  if (field.skip_conditions && Object.keys(field.skip_conditions).length > 0) {
    for (const [key, values] of Object.entries(field.skip_conditions)) {
      if (key.endsWith("_in")) {
        const fieldId = key.replace("_in", "");
        const currentValue = profile[fieldId];
        if (currentValue && values.includes(String(currentValue))) {
          return false; // Skip this field
        }
      } else if (key.endsWith("_not")) {
        const fieldId = key.replace("_not", "");
        const currentValue = profile[fieldId];
        if (currentValue && !values.includes(String(currentValue))) {
          return false; // Skip this field
        }
      }
    }
  }

  // Check conditions (format: {profile: {children_status_not: ["no_children"]}})
  if (!field.conditions || Object.keys(field.conditions).length === 0) {
    return true; // No conditions = always show
  }

  const profileConditions = field.conditions.profile;
  if (!profileConditions || Object.keys(profileConditions).length === 0) {
    return true; // No profile conditions = always show
  }

  for (const [key, value] of Object.entries(profileConditions)) {
    if (key.endsWith("_not")) {
      const fieldId = key.replace("_not", "");
      const currentValue = profile[fieldId];
      if (currentValue && Array.isArray(value) && value.includes(String(currentValue))) {
        return false; // Condition not met - skip this field
      }
    } else if (key.endsWith("_in")) {
      const fieldId = key.replace("_in", "");
      const currentValue = profile[fieldId];
      if (!currentValue || (Array.isArray(value) && !value.includes(String(currentValue)))) {
        return false; // Condition not met - skip this field
      }
    } else {
      const currentValue = profile[key];
      if (currentValue !== value) {
        return false; // Exact match failed - skip this field
      }
    }
  }

  return true; // All conditions met - show this field
}

export interface ProfileGroup {
  category: string;
  label: string;
  description: string;
  fields: ProfileField[];
}

const CATEGORY_META: Record<string, { label: string; description: string; order: number }> = {
  demographic: { label: "Temel Bilgiler", description: "Sizi daha iyi tanımamız için birkaç temel bilgi.", order: 0 },
  physical: { label: "Fiziksel Bilgiler", description: "Boy ve kilo bilgileriniz.", order: 1 },
  lifestyle: { label: "Yaşam Tarzı", description: "Günlük yaşamınızı şekillendiren tercihler.", order: 2 },
  health: { label: "Sağlık Durumu", description: "Genel sağlık profiliniz hakkında.", order: 3 },
  habit: { label: "Alışkanlıklar", description: "Günlük alışkanlıklarınız.", order: 4 },
  nutrition: { label: "Beslenme", description: "Beslenme tercihleriniz.", order: 5 },
  identity: { label: "Kimlik & İlgi Alanları", description: "Sizi tanımlayan özellikler ve tercihleriniz.", order: 6 },
};

export function groupProfileFields(fields: ProfileField[]): ProfileGroup[] {
  const grouped = new Map<string, ProfileField[]>();

  for (const field of fields) {
    const cat = field.category ?? "other";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(field);
  }

  return Array.from(grouped.entries())
    .map(([category, fields]) => {
      const meta = CATEGORY_META[category] ?? { label: "Diğer", description: "", order: 99 };
      return { category, label: meta.label, description: meta.description, fields, _order: meta.order };
    })
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...rest }) => rest);
}

export interface CoreQuestion {
  id: string;
  text: string;
  dimension: string;
  scale_labels?: string[];
}

export interface DeepDiveQuestion {
  id: string;
  text: string;
  pool: string;
  answer_type?: "scale" | "single_choice" | "multi_select";
  scale_labels?: string[];
  options?: { value: string; label: string }[];
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

export async function createSession(testToken?: string): Promise<SessionData> {
  return secureApiFetch<SessionData>("session", {}, testToken);
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
