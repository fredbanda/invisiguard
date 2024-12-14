import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function redirectToDashboard(req: NextRequest) {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL("/auth/login", req.url);
  //loginUrl.searchParams.set("callbackUrl", req.url);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET;

  const token = await getToken({ req, secret });

  if (pathname.startsWith("/auth")) {
    if (token) return redirectToDashboard(req);
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) return redirectToLogin(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*"],
};
