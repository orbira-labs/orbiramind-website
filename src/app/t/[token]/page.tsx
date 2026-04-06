import { createClient } from "@/lib/supabase/server";
import { TestFlow } from "./TestFlow";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface TestPageProps {
  params: Promise<{ token: string }>;
}

export default async function TestPage({ params }: TestPageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
    .from("test_invitations")
    .select("*, client:clients(first_name, last_name)")
    .eq("token", token)
    .single();

  if (error) {
    console.error("Test daveti sorgulanamadı:", error);
  }

  if (!invitation) {
    return notFound();
  }

  if (invitation.status === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] to-[#E8F0EC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Test Tamamlandı</h1>
          <p className="text-gray-600">Bu test zaten tamamlandı. Sonuçlarınız uzmanınızla paylaşıldı.</p>
        </div>
      </div>
    );
  }

  if (invitation.status === "expired" || new Date(invitation.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] to-[#E8F0EC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Süre Doldu</h1>
          <p className="text-gray-600">Bu test linkinin süresi dolmuş. Lütfen uzmanınızla iletişime geçin.</p>
        </div>
      </div>
    );
  }

  const clientName = invitation.client
    ? `${invitation.client.first_name} ${invitation.client.last_name}`
    : undefined;

  return <TestFlow token={token} clientName={clientName} />;
}
