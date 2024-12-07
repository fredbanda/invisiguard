import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthConfig } from "next-auth";
import db from "./drizzle";
import * as schema from "./drizzle/schema";
import { oauthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import Google from "@auth/core/providers/google";
import Github from "@auth/core/providers/github";

export const authConfig = {
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    authorized({auth, request}){
        const { nextUrl } = request;

        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
        const isOnAuth = nextUrl.pathname.startsWith("/auth");
    
        // Redirect users trying to access the dashboard when not logged in
        if (isOnDashboard) {
            if (isLoggedIn) {
                return true; // Allow logged-in users to access the dashboard
            }
            return Response.redirect(new URL("/auth/login", request.url)); // Redirect to login
        }
    
        // Redirect logged-in users trying to access auth routes
        if (isOnAuth) {
            if (!isLoggedIn) {
                return true; // Allow unauthenticated users to access auth routes
            }
            return Response.redirect(new URL("/", request.url)); // Redirect to the homepage or another page
        }
    
        // Allow other routes by default
        return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;
      if (user?.company) token.company = user.company;
      if (user?.phone) token.phone = user.phone;

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.company = token.company;
      session.user.phone = token.phone; // Set the role from the token
      return session;
    },

    signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        return !!profile?.email_verified;
      }

      if (account?.provider === "github") {
        return true;
      }

      if (account?.provider === "credentials") {
        if (user?.emailVerified) {
          // return true;
        }
        return true;
      }
      return false;
    },
  },
  events: {
    linkAccount: async ({ user, account }) => {
      if (["google", "github"].includes(account.provider)) {
        if (user.email) await oauthVerifyEmailAction(user.email);
      }
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ]
} satisfies NextAuthConfig;