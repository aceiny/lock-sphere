import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./lib/api/axios";
import { publicPaths } from "./constants/publicPath";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const sessionId = req.cookies.get("sessionId")?.value;

  // First check if user has a valid session
  let isValidSession = false;
  if (sessionId) {
    try {
      const sessionCheck = await api.get(`/auth/validate-session`, {
        headers: { Cookie: `sessionId=${sessionId}` },
      });
      isValidSession = sessionCheck.status === 200;
    } catch (error: any) {
      console.error("Session validation failed:", error?.response?.status, error?.message);
    }
  }

  // If user is logged in and tries to access public routes, redirect to dashboard
  if (isValidSession && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow public paths without authentication for non-logged in users
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Handle protected routes
  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!isValidSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};