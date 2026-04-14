// API calls go through our secure server-side routes
// No API keys are exposed to the client

export type ProfileCategory = "demographic" | "physical" | "lifestyle" | "health" | "habit" | "nutrition" | "identity";

export interface ProfileField {
  id: string;
  answer_type: "single_choice" | "boolean" | "text" | "multi_select" | "numeric";
  text: string;
  category?: ProfileCategory | string;
  options?: { value: string | boolean; label: string }[];
  numeric_range?: { min: number; max: number } | null;
  required?: boolean;
  stage?: number;
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

export interface MeasurementField {
  id: string;
  answer_type: "numeric" | "single_choice";
  text: string;
  numeric_range?: { min: number; max: number } | null;
  options?: { value: string; label: string }[] | null;
}

export interface DeepDiveQuestion {
  id: string;
  text: string;
  pool: string;
  answer_type?: "scale" | "single_choice" | "multi_select";
  scale_labels?: string[];
  options?: { value: string; label: string }[];
}

export interface SessionData {
  session_id: string;
  profile_fields: ProfileField[];
  core_questions: CoreQuestion[];
  measurement_context: MeasurementField[];
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

export interface InsightResult {
  title: string;
  insight: string;
  severity: string;
  suggestion?: string;
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
  blind_spots?: {
    title: string;
    insight: string;
    coach_tip: string;
  }[];
  coaching_roadmap: {
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
  measurements: Record<string, unknown>,
  testToken?: string
): Promise<SubmitAnswersResponse> {
  return secureApiFetch<SubmitAnswersResponse>("answers", {
    session_id: sessionId,
    profile,
    core_answers: coreAnswers,
    measurements,
  }, testToken);
}

export async function completeSession(
  sessionId: string,
  deepDiveAnswers: Record<string, number>,
  testToken?: string
): Promise<CompleteSessionResponse> {
  return secureApiFetch<CompleteSessionResponse>("complete", {
    session_id: sessionId,
    deep_dive_answers: deepDiveAnswers,
  }, testToken);
}

export { EngineAPIError };
