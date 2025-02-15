import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./lib/api/axios";
import { publicPaths } from "./constants/publicPath";


export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const sessionId = req.cookies.get("sessionId");

  // If session exists, check its validity
  if (sessionId) {
    const sessionCheck = await api.get(`${req.nextUrl.origin}/auth/validate-session`);
    
    if (sessionCheck.status === 200) {
      // Redirect authenticated users away from public routes to the dashboard
      if (publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }
  }

  // Allow access to public routes for unauthenticated users
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected routes to login
  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
