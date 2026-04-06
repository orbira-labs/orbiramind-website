import type { Metadata } from "next";
import { Geist_Mono, Nunito } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "OrbiraMind",
    template: "%s | OrbiraMind",
  },
  description: "Danışanlarınızın iç dünyasını anlamanın en bilimsel yolu",
  robots: { index: false, follow: false },
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
        className={`${geistMono.variable} ${nunito.variable} antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] font-[family-name:var(--font-nunito)]`}
      >
        {children}
        <Toaster
          position="top-right"
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
