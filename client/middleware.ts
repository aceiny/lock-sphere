import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./lib/api/axios";
import { publicPaths } from "./constants/publicPath";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const sessionId = req.cookies.get("sessionId")?.value;


  // Allow public paths without authentication
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!sessionId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const sessionCheck = await api.get(`/auth/validate-session`, {
      headers: { Cookie: `sessionId=${sessionId}` },
    });

    if (sessionCheck.status === 200) {
      return NextResponse.next();
    }
  } catch (error: any) {
    console.error("Session validation failed:", error?.response?.status, error?.message);

    if (error?.response?.status === 401) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
