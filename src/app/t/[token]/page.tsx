import { createClient } from "@/lib/supabase/server";
import { AnalysisSubmitted } from "@/components/test/AnalysisSubmitted";
import { TestFlow } from "./TestFlow";

export const dynamic = "force-dynamic";

interface TestPageProps {
  params: Promise<{ token: string }>;
}

function ErrorCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  errorCode,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  errorCode?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F9F7] to-[#E8F0EC] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div
          className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}
        >
          <svg
            className={`w-8 h-8 ${iconColor}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {icon}
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
        {errorCode && (
          <p className="mt-4 text-xs text-gray-400 font-mono">Hata kodu: {errorCode}</p>
        )}
      </div>
    </div>
  );
}

export default async function TestPage({ params }: TestPageProps) {
  const { token: rawToken } = await params;
  const token = rawToken.toUpperCase();
  const supabase = await createClient();

  const { data: invitation, error } = await supabase
    .from("test_invitations")
    .select("*, client:clients(first_name, last_name), professional:professionals(first_name, last_name)")
    .eq("token", token)
    .single();

  if (error) {
    console.error("Test daveti sorgulanamadı:", error);
    
    // DB bağlantı hatası veya RLS hatası
    if (error.code === "PGRST301" || error.message?.includes("permission") || error.message?.includes("policy")) {
      return (
        <ErrorCard
          iconBg="bg-red-100"
          iconColor="text-red-500"
          icon={
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          }
          title="Bağlantı Hatası"
          description="Sunucuya bağlanırken bir sorun oluştu. Lütfen birkaç dakika sonra tekrar deneyin."
          errorCode={error.code}
        />
      );
    }
  }

  if (!invitation) {
    return (
      <ErrorCard
        iconBg="bg-gray-100"
        iconColor="text-gray-500"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        }
        title="Test Bulunamadı"
        description="Girdiğiniz kod geçersiz veya bu test artık mevcut değil. Lütfen uzmanınızdan yeni bir link isteyin."
        errorCode={error?.code}
      />
    );
  }

  if (invitation.status === "processing") {
    return <AnalysisSubmitted state="processing" />;
  }

  if (invitation.status === "completed" || invitation.status === "reviewed") {
    return (
      <ErrorCard
        iconBg="bg-green-100"
        iconColor="text-green-600"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        }
        title="Test Tamamlandı"
        description="Bu test zaten tamamlandı. Sonuçlarınız uzmanınızla paylaşıldı."
      />
    );
  }

  if (invitation.status === "error") {
    return (
      <ErrorCard
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01m-7.938 4h15.876c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L2.34 17c-.77 1.333.192 3 1.732 3z"
          />
        }
        title="Rapor Hazırlanamadı"
        description="Yanıtlarınız alındı ancak rapor hazırlanırken bir sorun oluştu. Uzmanınız sizinle iletişime geçecektir."
      />
    );
  }

  if (invitation.status === "expired" || new Date(invitation.expires_at) < new Date()) {
    return (
      <ErrorCard
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        icon={
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        }
        title="Süre Doldu"
        description="Bu test linkinin süresi dolmuş. Lütfen uzmanınızla iletişime geçerek yeni bir test linki isteyin."
      />
    );
  }

  const clientName = invitation.client
    ? `${invitation.client.first_name} ${invitation.client.last_name}`
    : undefined;

  const professionalName = invitation.professional
    ? `${invitation.professional.first_name ?? ""} ${invitation.professional.last_name ?? ""}`.trim() || undefined
    : undefined;

  return <TestFlow token={token} clientName={clientName} professionalName={professionalName} />;
}
