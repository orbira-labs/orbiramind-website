import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/callback",
  "/privacy",
  "/terms",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /t/[token] test akışı public
  if (pathname.startsWith("/t/")) {
    return NextResponse.next();
  }

  // API route'ları skip
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const hasAuthCookie = request.cookies.getAll().some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  // Root path (/) özel handling - login varsa dashboard'a yönlendir
  if (pathname === "/") {
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Auth yoksa ve public path değilse login'e yönlendir
  if (!hasAuthCookie && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const AUTH_ONLY_PUBLIC = ["/auth/login", "/auth/register", "/auth/verify"];
  const isAuthOnlyPublic = AUTH_ONLY_PUBLIC.some((p) => pathname.startsWith(p));

  // Auth varsa ve login/register/verify sayfasındaysa dashboard'a yönlendir
  if (hasAuthCookie && isAuthOnlyPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)",
  ],
};
