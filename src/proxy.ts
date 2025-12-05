import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/constants/roles";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/professors/[id]", // Detail pages
  "/bookmarks",
  "/settings",
];

// Routes that require PRO
const proOnlyRoutes = [
  "/dashboard/analytics",
  "/dashboard/export",
  "/professors/pro", // PRO-only professor listings
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session
  const session = await auth();
  const userRole = session?.user?.role || UserRole.GUEST;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route.replace("[id]", ""))
  );

  // Check if route requires PRO
  const isProRoute = proOnlyRoutes.some((route) => pathname.startsWith(route));

  // Not logged in trying to access protected route
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Not PRO trying to access PRO route
  if (isProRoute && userRole !== UserRole.PRO) {
    const upgradeUrl = new URL("/pricing", request.url);
    upgradeUrl.searchParams.set("reason", "pro_required");
    return NextResponse.redirect(upgradeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
};
