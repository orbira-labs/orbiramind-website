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
  created_at: string;
  updated_at: string;
}

export interface TestInvitation {
  id: string;
  professional_id: string;
  client_id: string;
  token: string;
  test_type: string;
  status: "sent" | "started" | "completed" | "expired";
  sent_via: "whatsapp" | "email";
  message_text: string | null;
  expires_at: string;
  session_id: string | null;
  results_snapshot: Record<string, unknown> | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
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

export interface DashboardStats {
  total_clients: number;
  todays_appointments: number;
  remaining_tests: number;
  completed_tests: number;
}

export interface Trait {
  id: string;
  name: string;
  active: boolean;
}

export interface Pattern {
  id: string;
  type: "risk" | "strength" | "contradiction";
  description: string;
}

export interface Inference {
  id: string;
  title: string;
  description: string;
}

export interface BMIContext {
  bmi: number;
  category: string;
}

export interface AnalysisResults {
  wellness_score: number;
  dimension_scores: Record<string, number>;
  top_strengths: string[];
  top_risks: string[];
  traits: Trait[];
  patterns: Pattern[];
  inferences: Inference[];
  bmi_context: BMIContext;
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
  blind_spots: BlindSpot[];
  coaching_roadmap: CoachingRoadmap;
  generated_at: string;
  model: string;
}

export interface TestResults {
  analysis: AnalysisResults;
  report: Report;
}
