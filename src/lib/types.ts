export interface Professional {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  city: string | null;
  district: string | null;
  work_type: "individual" | "company" | null;
  company_name: string | null;
  specializations: string[];
  avatar_url: string | null;
  onboarding_completed: boolean;
  session_price_cents: number | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  professional_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: "female" | "male" | "other" | "prefer_not_to_say" | null;
  status: "active" | "passive" | "archived";
  created_at: string;
  updated_at: string;
}

export interface ClientNote {
  id: string;
  client_id: string;
  professional_id: string;
  content: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  professional_id: string;
  client_id: string;
  starts_at: string;
  duration_minutes: number;
  note: string | null;
  status: "scheduled" | "completed" | "cancelled";
  session_transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestInvitation {
  id: string;
  professional_id: string;
  client_id: string;
  token: string;
  test_type: string;
  status: "sent" | "started" | "processing" | "completed" | "error" | "reviewed" | "expired";
  expires_at: string;
  session_id: string | null;
  results_snapshot: Record<string, unknown> | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  reviewed_at: string | null;
}

export interface CreditPackage {
  id: string;
  name: string;
  test_count: number;
  price_cents: number;
  currency: string;
  is_active: boolean;
  sort_order: number;
}

export interface CreditTransaction {
  id: string;
  professional_id: string;
  package_id: string | null;
  invitation_id: string | null;
  amount: number;
  balance_after: number;
  type: "purchase" | "usage" | "refund" | "bonus";
  description: string | null;
  payment_provider: string | null;
  payment_id: string | null;
  created_at: string;
}

export interface ProNotification {
  id: string;
  professional_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface SessionPriceTemplate {
  id: string;
  professional_id: string;
  name: string;
  type: "single" | "package";
  session_count: number;
  price_per_session_cents: number;
  total_price_cents: number;
  discount_percent: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SessionPackage {
  id: string;
  professional_id: string;
  client_id: string;
  template_id: string | null;
  name: string;
  total_sessions: number;
  remaining_sessions: number;
  total_price_cents: number;
  currency: string;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface SessionTransaction {
  id: string;
  package_id: string;
  professional_id: string;
  client_id: string;
  appointment_id: string | null;
  type: "usage" | "refund" | "manual_deduct";
  amount: number;
  remaining_after: number;
  note: string | null;
  created_at: string;
}

export interface SessionPayment {
  id: string;
  package_id: string;
  professional_id: string;
  amount_cents: number;
  method: "cash" | "card" | "transfer" | "other" | null;
  note: string | null;
  created_at: string;
}

export interface DashboardStats {
  active_clients: number;
  todays_appointments: number;
  pending_analyses: number;
}

export interface ProfessionalStats {
  professional_id: string;
  active_clients_count: number;
  total_clients_count: number;
  pending_analyses_count: number;
  completed_analyses_count: number;
  todays_appointments_count: number;
  upcoming_appointments_count: number;
  total_appointments_count: number;
  total_notes_count: number;
  updated_at: string;
}

export interface DimensionScore {
  dimension: string;
  label: string;
  score: number;
  base?: number;
  trait_modifier?: number;
  pattern_modifier?: number;
  has_data?: boolean;
}

export interface TraitScore {
  trait: string;
  label: string;
  score: number;
}

export interface Pattern {
  name: string;
  type: "risk" | "strength" | "contradiction";
  level: string;
  description: string;
}

export interface Insight {
  title: string;
  insight: string;
  severity: string;
  suggestion?: string;
  type?: "hidden_strength" | "absence_signal" | "inconsistency";
}

export interface ProfileSummary {
  age_range: string | null;
  gender: string | null;
  bmi_category: string | null;
  bmi_raw: number | null;
  chronotype: string | null;
  thinking_style: string | null;
  social_style: string | null;
  stress_response: string | null;
  primary_motivation: string | null;
  life_phase: string | null;
  routine_style: string | null;
  social_role: string | null;
  decision_style: string | null;
  emotional_expression: string | null;
  relationship_status: string | null;
  living_situation: string | null;
  work_status: string | null;
  has_chronic_condition: boolean;
  children_status: string | null;
  nutrition_preference: string | null;
}

export interface BlindSpotItem {
  title: string;
  insight: string;
  type: "hidden_strength" | "absence_signal" | "inconsistency";
  severity: string;
  suggestion: string | null;
}

export interface AnalysisResults {
  wellness_score: number;
  dimension_scores: DimensionScore[];
  top_strengths: TraitScore[];
  top_risks: TraitScore[];
  traits: TraitScore[];
  patterns: Pattern[];
  inferences: Insight[];
  profile_summary?: ProfileSummary;
  blind_spots?: BlindSpotItem[];
}

export interface BlindSpot {
  title: string;
  insight: string;
  coach_tip: string;
}

export interface CoachingRoadmap {
  immediate: string[];
  short_term: string[];
  medium_term: string[];
}

export interface StrengthWeakness {
  name: string;
  insight: string;
}

export interface Report {
  character_analysis: string;
  top5_and_weak5: {
    top5: StrengthWeakness[];
    weak5: StrengthWeakness[];
  };
  blind_spots?: BlindSpot[];
  coaching_roadmap: CoachingRoadmap;
  generated_at: string;
  model: string;
}

export interface TestResults {
  analysis: AnalysisResults;
  report: Report | null;
  metadata?: {
    report_status?: "pending" | "ready" | "failed";
    [key: string]: unknown;
  };
}
