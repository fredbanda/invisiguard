import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl; // Extract the pathname
    const secret = process.env.AUTH_SECRET; // Ensure the secret is defined

    // Retrieve the token with the secret
    const token = await getToken({ req, secret });

    // Redirect logged-in users away from "/auth" routes
    if (pathname.startsWith("/auth")) {
        if (token) {
            // Redirect to dashboard if logged in
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next(); // Allow access to "/auth" routes if not logged in
    }

    // Protect routes starting with "/dashboard"
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            // Redirect to login page if not authenticated
            const loginUrl = new URL("/auth/login", req.url);
            loginUrl.searchParams.set("callbackUrl", req.url); // Preserve the current path for redirect after login
            return NextResponse.redirect(loginUrl);
        }
    }

    // Allow all other routes
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",               // Home route
        "/dashboard/:path*", // Protect dashboard routes
        "/auth/:path*",    // Redirect logged-in users away from "/auth"
    ],
};
