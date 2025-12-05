import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Get auth token from cookies (NextAuth session token)
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const isLoggedIn = !!token;
  const path = req.nextUrl.pathname;

  // Public paths
  const publicPaths = ["/", "/pricing", "/about", "/login", "/register"];
  const isPublicPath = publicPaths.some((p) => path.startsWith(p));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Guest preview paths (limited access)
  const guestPreviewPaths = ["/professors", "/leaderboard"];
  const isGuestPreview = guestPreviewPaths.some((p) => path.startsWith(p));

  if (isGuestPreview) {
    // Allow access but add header to enable limited mode
    const response = NextResponse.next();
    if (!isLoggedIn) {
      response.headers.set("x-guest-mode", "true");
    }
    return response;
  }

  // Protected paths - require login
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
