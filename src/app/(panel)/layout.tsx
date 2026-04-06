import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProShell } from "@/components/layout/ProShell";

async function getSessionData() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    await supabase.auth.signOut();
    return null;
  }

  const [{ data: professional }, { data: credits }] = await Promise.all([
    supabase.from("professionals").select("*").eq("id", user.id).single(),
    supabase.rpc("get_credit_balance", { p_professional_id: user.id }),
  ]);

  return { user, professional, credits };
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await getSessionData();

  if (!sessionData) {
    redirect("/auth/login");
  }

  const { professional, credits } = sessionData;

  if (!professional?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <ProShell
      initialProfessional={professional}
      initialCredits={credits || 0}
    >
      {children}
    </ProShell>
  );
}
