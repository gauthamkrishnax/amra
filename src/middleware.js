import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/signIn", "/connect", "/username"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Get the session cookie
  const session = request.cookies.get("__session")?.value;

  // If user is not authenticated and trying to access a protected route
  if (!session && !isPublicRoute) {
    const signInUrl = new URL("/signIn", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and trying to access sign-in page, redirect to home
  if (session && pathname === "/signIn") {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Configure which routes should be protected by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, json, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};
