import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karakter Analizi | OrbiraMind",
  description: "Kişilik analizi testinizi tamamlayın",
  robots: { index: false, follow: false },
};

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
