import { getServerUser } from "@/lib/supabase/auth-cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProShell } from "@/components/layout/ProShell";

async function getProfessional(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/auth/login");
  }

  const professional = await getProfessional(user.id);

  if (!professional) {
    redirect("/auth/login");
  }

  if (!professional.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <ProShell initialProfessional={professional} initialCredits={0}>
      {children}
    </ProShell>
  );
}
