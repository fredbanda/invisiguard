import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const secret = process.env.AUTH_SECRET; // Ensure this is defined
    
    // Retrieve the token with the secret
    const token = await getToken({ req, secret });

    // Allow public routes
    if (pathname.startsWith("/auth") || pathname === "/") {
        return NextResponse.next();
    }

    // Protect routes starting with "/dashboard"
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            const loginUrl = new URL("/auth/login", req.url);
            loginUrl.searchParams.set("callbackUrl", req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};
