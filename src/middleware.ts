import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
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

  // Root path (/) - login varsa dashboard'a yönlendir
  if (pathname === "/") {
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Auth sayfaları - login varsa dashboard'a yönlendir
  const AUTH_PAGES = ["/auth/login", "/auth/register", "/auth/verify"];
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  
  if (isAuthPage) {
    if (hasAuthCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Public paths - her zaman izin ver
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected paths - auth yoksa login'e yönlendir
  if (!hasAuthCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|xml|txt)$).*)",
  ],
};
