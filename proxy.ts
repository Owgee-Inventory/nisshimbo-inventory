import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const demoMode =
    process.env.NODE_ENV === "development" &&
    process.env.INVENTORY_DEMO_MODE === "true";

  const isInventoryPage = request.nextUrl.pathname === "/inventory";

  const isPageRequest = request.method === "GET" || request.method === "HEAD";

  if (demoMode && isInventoryPage && isPageRequest) {
    return NextResponse.next();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
/*
 * Match all request paths except for the ones starting with:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 * Feel free to modify this pattern to include more paths.
 */
