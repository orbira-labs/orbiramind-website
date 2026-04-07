import { createClient } from "@/lib/supabase/server";
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
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
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
    .select("*, client:clients(first_name, last_name)")
    .eq("token", token)
    .single();

  if (error) {
    console.error("Test daveti sorgulanamadı:", error);
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
      />
    );
  }

  if (invitation.status === "completed") {
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

  return <TestFlow token={token} clientName={clientName} />;
}
