import type { Metadata } from "next";
import { Geist_Mono, Nunito, Caveat } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orbiramind.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "OrbiraMind | Psikologlar İçin Danışan Analiz Platformu",
    template: "%s | OrbiraMind",
  },
  description: "Psikologlar, koçlar ve danışmanlar için kişilik analizi ve danışan yönetim platformu. HAE ve AQE motorları ile bilimsel analiz.",
  keywords: ["psikolog yazılımı", "danışan yönetimi", "kişilik analizi", "psikoloji platformu", "koç yazılımı", "danışman araçları", "OrbiraMind"],
  authors: [{ name: "Orbira Labs" }],
  creator: "Orbira Labs",
  publisher: "Orbira Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "OrbiraMind | Psikologlar İçin Danışan Analiz Platformu",
    description: "Kişilik analizi ve danışan yönetimi için profesyonel platform.",
    type: "website",
    locale: "tr_TR",
    url: baseUrl,
    siteName: "OrbiraMind",
  },
  twitter: {
    card: 'summary_large_image',
    title: "OrbiraMind | Psikologlar İçin Danışan Analiz Platformu",
    description: "Kişilik analizi ve danışan yönetimi için profesyonel platform.",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        data-theme="pro"
        className={`${geistMono.variable} ${nunito.variable} ${caveat.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[family-name:var(--font-nunito)]`}
      >
        {children}
        <Toaster
          position="top-right"
          duration={3000}
          toastOptions={{
            style: {
              background: "var(--pro-surface)",
              border: "1px solid var(--pro-border)",
              color: "var(--pro-text)",
            },
          }}
        />
      </body>
    </html>
  );
}
