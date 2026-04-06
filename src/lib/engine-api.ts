// API calls go through our secure server-side routes
// No API keys are exposed to the client

export type ProfileCategory = "demographic" | "lifestyle" | "health" | "habit" | "nutrition";

export interface ProfileField {
  id: string;
  answer_type: "single_choice" | "boolean" | "text";
  text: string;
  category?: ProfileCategory | string;
  options?: { value: string | boolean; label: string }[];
  required?: boolean;
}

export interface ProfileGroup {
  category: string;
  label: string;
  description: string;
  fields: ProfileField[];
}

const CATEGORY_META: Record<string, { label: string; description: string; order: number }> = {
  demographic: { label: "Temel Bilgiler", description: "Sizi daha iyi tanımamız için birkaç temel bilgi.", order: 0 },
  lifestyle: { label: "Yaşam Tarzı", description: "Günlük yaşamınızı şekillendiren tercihler.", order: 1 },
  health: { label: "Sağlık Durumu", description: "Genel sağlık profiliniz hakkında.", order: 2 },
  habit: { label: "Alışkanlıklar", description: "Günlük alışkanlıklarınız.", order: 3 },
  nutrition: { label: "Beslenme", description: "Beslenme tercihleriniz.", order: 4 },
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
  scale_labels?: string[];
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

export interface AnalysisResults {
  wellness_score: number;
  dimension_scores: Record<string, number>;
  top_strengths: string[];
  top_risks: string[];
  traits: { id: string; name: string; active: boolean }[];
  patterns: { id: string; type: string; description: string }[];
  inferences: { id: string; title: string; description: string }[];
  bmi_context: { bmi: number; category: string };
}

export interface Report {
  character_analysis: string;
  top5_and_weak5: {
    top5: { name: string; insight: string }[];
    weak5: { name: string; insight: string }[];
  };
  blind_spots: {
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
    report: Report;
  };
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

async function secureApiFetch<T>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`/api/engine/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new EngineAPIError(
      data.error?.message ?? data.error ?? "API error",
      data.error?.code ?? "UNKNOWN_ERROR",
      res.status
    );
  }

  // Handle both wrapped and unwrapped responses
  return (data.data ?? data) as T;
}

export async function createSession(): Promise<SessionData> {
  return secureApiFetch<SessionData>("session", {});
}

export async function submitAnswers(
  sessionId: string,
  profile: Record<string, unknown>,
  coreAnswers: Record<string, number>,
  measurements: Record<string, unknown>
): Promise<SubmitAnswersResponse> {
  return secureApiFetch<SubmitAnswersResponse>("answers", {
    session_id: sessionId,
    profile,
    core_answers: coreAnswers,
    measurements,
  });
}

export async function completeSession(
  sessionId: string,
  deepDiveAnswers: Record<string, number>
): Promise<CompleteSessionResponse> {
  return secureApiFetch<CompleteSessionResponse>("complete", {
    session_id: sessionId,
    deep_dive_answers: deepDiveAnswers,
  });
}

export { EngineAPIError };
