import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./validators/login-validater";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import * as v from "valibot";
import { getUserByEmail } from "./resources/user-queries";
import bcrypt from "bcryptjs";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import * as schema from "./drizzle/schema";
import db from "./drizzle";
import { oauthVerifyEmailAction } from "./actions/oauth-verify-email-action";

const nextAuth = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  callbacks: {
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
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(LoginSchema, credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.output;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            const { password, ...userWithoutPassword } = user;

            // Ensure fields match the `User` type
            const userWithRole = {
              id: userWithoutPassword.id || "",
              name: userWithoutPassword.name ?? null,
              email: userWithoutPassword.email,
              image: userWithoutPassword.image ?? null,
              role: user.role || "user",
              company: user.company || "The First Pitch",
              phone: user.phone || "0123456789",
              emailVerified: user.emailVerified ?? null, // Ensure `Date | null`
            };

            return userWithRole as User; // Explicitly cast to `User` type
          }
        }

        return null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});

export const { handlers, signIn, signOut, auth } = nextAuth;
