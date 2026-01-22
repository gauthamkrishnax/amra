import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/signin",
  "/signup",
  "/favicon.ico",
  "/.well-known",
  "/_next",
  "/api",
];

export function proxy(req) {
  const session = req.cookies.get("__session");
  const pathname = req.nextUrl.pathname;

  // Allow auth pages
  if (pathname.startsWith("/signin")) {
    return NextResponse.next();
  }

  // Allow public/static files
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect everything else
  if (!session) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
