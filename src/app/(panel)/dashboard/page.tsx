import { getServerUser } from "@/lib/supabase/auth-cache";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import type { DashboardInitialData } from "@/lib/hooks/useDashboard";

async function getDashboardData(userId: string): Promise<DashboardInitialData> {
  const supabase = await createClient();

  const [aptsRes, testsRes, statsRes] = await Promise.all([
    supabase
      .from("appointments")
      .select(
        "id, client_id, starts_at, duration_minutes, note, status, client:clients(first_name, last_name)"
      )
      .eq("professional_id", userId)
      .eq("status", "scheduled")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(5),
    supabase
      .from("test_invitations")
      .select(
        "id, token, status, created_at, sent_via, started_at, completed_at, client:clients(first_name, last_name)"
      )
      .eq("professional_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("professional_stats")
      .select("active_clients_count, todays_appointments_count, pending_analyses_count")
      .eq("professional_id", userId)
      .single(),
  ]);

  interface ClientInfo {
    first_name: string;
    last_name: string;
  }

  type AppointmentStatus = "scheduled" | "completed" | "cancelled";
  type TestSentVia = "email" | "whatsapp" | "manual";

  interface AppointmentRow {
    id: string;
    client_id: string;
    starts_at: string;
    duration_minutes: number;
    note: string | null;
    status: AppointmentStatus;
    client: ClientInfo | ClientInfo[] | null;
  }

  interface TestRow {
    id: string;
    token: string;
    status: string;
    created_at: string;
    sent_via: TestSentVia;
    started_at: string | null;
    completed_at: string | null;
    client: ClientInfo | ClientInfo[] | null;
  }

  const upcomingAppointments = (aptsRes.data as AppointmentRow[] || []).map(
    (a) => ({
      ...a,
      client: Array.isArray(a.client) ? a.client[0] || null : a.client,
    })
  );

  const recentTests = (testsRes.data as TestRow[] || []).map(
    (t) => ({
      ...t,
      client: Array.isArray(t.client) ? t.client[0] || null : t.client,
    })
  );

  const statsData = statsRes.data as {
    active_clients_count: number;
    todays_appointments_count: number;
    pending_analyses_count: number;
  } | null;

  return {
    upcomingAppointments,
    recentTests,
    stats: {
      active_clients: statsData?.active_clients_count ?? 0,
      todays_appointments: statsData?.todays_appointments_count ?? 0,
      pending_analyses: statsData?.pending_analyses_count ?? 0,
    },
  };
}

export default async function DashboardPage() {
  const user = await getServerUser();
  const initialData = user
    ? await getDashboardData(user.id)
    : {
        upcomingAppointments: [],
        recentTests: [],
        stats: {
          active_clients: 0,
          todays_appointments: 0,
          pending_analyses: 0,
        },
      };

  return <DashboardClient initialData={initialData} />;
}
