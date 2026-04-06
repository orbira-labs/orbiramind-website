import { getServerUser } from "@/lib/supabase/auth-cache";
import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";
import type { DashboardInitialData } from "@/lib/hooks/useDashboard";

async function getDashboardData(userId: string): Promise<DashboardInitialData> {
  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    aptsRes,
    testsRes,
    clientsCountRes,
    completedCountRes,
    todayAptsRes,
    creditRes,
  ] = await Promise.all([
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
        "id, token, status, created_at, client:clients(first_name, last_name)"
      )
      .eq("professional_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", userId)
      .eq("status", "active"),
    supabase
      .from("test_invitations")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", userId)
      .eq("status", "completed"),
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", userId)
      .eq("status", "scheduled")
      .gte("starts_at", todayStart.toISOString())
      .lte("starts_at", todayEnd.toISOString()),
    supabase
      .from("credit_balance")
      .select("balance")
      .eq("professional_id", userId)
      .maybeSingle(),
  ]);

  const upcomingAppointments = (aptsRes.data || []).map(
    (a: Record<string, unknown>) => ({
      ...a,
      client: Array.isArray(a.client) ? a.client[0] || null : a.client,
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any[];

  const recentTests = (testsRes.data || []).map(
    (t: Record<string, unknown>) => ({
      ...t,
      client: Array.isArray(t.client) ? t.client[0] || null : t.client,
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any[];

  return {
    upcomingAppointments,
    recentTests,
    stats: {
      total_clients: clientsCountRes.count ?? 0,
      todays_appointments: todayAptsRes.count ?? 0,
      remaining_tests:
        (creditRes.data as { balance?: number } | null)?.balance ?? 0,
      completed_tests: completedCountRes.count ?? 0,
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
          total_clients: 0,
          todays_appointments: 0,
          remaining_tests: 0,
          completed_tests: 0,
        },
      };

  return <DashboardClient initialData={initialData} />;
}
