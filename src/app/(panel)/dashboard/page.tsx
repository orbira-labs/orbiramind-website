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
        "id, token, status, created_at, started_at, completed_at, client:clients(first_name, last_name)"
      )
      .eq("professional_id", userId)
      .in("status", ["sent", "started", "completed"])
      .order("created_at", { ascending: false })
      .limit(10),
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

  const COMPLETED_TTL_MS = 5 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const pendingTests = (testsRes.data as TestRow[] || [])
    .filter((t) => {
      if (t.status !== "completed") return true;
      const ref = t.completed_at ?? t.created_at;
      return now - new Date(ref).getTime() < COMPLETED_TTL_MS;
    })
    .map((t) => ({
      ...t,
      client: Array.isArray(t.client) ? t.client[0] || null : t.client,
    }))
    .sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const statsData = statsRes.data as {
    active_clients_count: number;
    todays_appointments_count: number;
    pending_analyses_count: number;
  } | null;

  return {
    upcomingAppointments,
    pendingTests,
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
        pendingTests: [],
        stats: {
          active_clients: 0,
          todays_appointments: 0,
          pending_analyses: 0,
        },
      };

  return <DashboardClient initialData={initialData} />;
}
