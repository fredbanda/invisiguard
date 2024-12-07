import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./validators/login-validater";
import * as v from "valibot";
import { getUserByEmail } from "./resources/user-queries";
import bcrypt from "bcryptjs";
import { OAuthAccountAlreadyLinkedError } from "./lib/custom-errors";
import { authConfig } from "./auth.config";

const { providers: authConfigProviders, ...authConfigRest } = authConfig;

const nextAuth = NextAuth({
  ...authConfigRest,
  providers: [
    ...authConfigProviders,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = v.safeParse(LoginSchema, credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.output;

          const user = await getUserByEmail(email);
          if (!user) return null;
          if (!user.password) throw new OAuthAccountAlreadyLinkedError();

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
  ],
});

export const { handlers, signIn, signOut, auth } = nextAuth;
