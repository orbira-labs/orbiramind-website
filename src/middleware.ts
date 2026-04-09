import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/callback",
  "/privacy",
  "/terms",
  "/onboarding",
];

const AUTH_PAGES = ["/auth/login", "/auth/register", "/auth/verify"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /t/[token] test akışı public
  if (pathname.startsWith("/t/")) {
    return NextResponse.next();
  }

  // API route'ları skip
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Supabase session'ı güncelle ve kullanıcıyı al
  const { user, supabaseResponse } = await updateSession(request);

  // Root path (/) - gerçek login varsa dashboard'a yönlendir
  if (pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  // Auth sayfaları - gerçek login varsa dashboard'a yönlendir
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  // Onboarding - kullanıcı girişli olmalı ama professional kontrolü yok
  if (pathname === "/onboarding") {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return supabaseResponse;
  }

  // Public paths - her zaman izin ver
  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isPublicPath) {
    return supabaseResponse;
  }

  // Protected paths - gerçek auth yoksa login'e yönlendir
  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)",
  ],
};
