import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { NextAuthConfig } from "next-auth";
import db from "./drizzle";
import * as schema from "./drizzle/schema";
import { oauthVerifyEmailAction } from "./actions/oauth-verify-email-action";
import Google from "@auth/core/providers/google";
import Github from "@auth/core/providers/github";
import { USER_ROLES } from "./lib/constants";
import { AdapterUser } from "next-auth/adapters";
import { getTableColumns } from "drizzle-orm";

export const authConfig = {
  // adapter: DrizzleAdapter(db, {
  //   accountsTable: schema.accounts,
  //   usersTable: schema.users,
  //   sessionsTable: schema.sessions,
  //   verificationTokensTable: schema.verificationTokens,
  //   authenticatorsTable: schema.authenticators,

  adapter: {
    ...DrizzleAdapter(db, {
    accountsTable: schema.accounts,
    usersTable: schema.users,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
    async createUser(data: AdapterUser){
      const {id, ...insertData} = data;
      const hasDefaultId = getTableColumns(schema.users)["id"]["hasDefault"];
      const isAdmin = process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() === data.email.toLowerCase();
      
      if (hasDefaultId && isAdmin) {
        insertData.role = isAdmin ? USER_ROLES.ADMIN : USER_ROLES.USER;
      }
      return db
        .insert(schema.users)
        .values(hasDefaultId ? insertData : {...insertData, id})
        .returning()
        .then(res => res?.[0]);
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    authorized({ auth }) {
      const user = auth?.user;
  
      if (user) {
        const hasAccess = user.role === USER_ROLES.ADMIN;
        return hasAccess;
      }
      return false;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user?.id) token.id = user.id;
      if (user?.role) token.role = user.role;
      if (user?.company) token.company = user.company;
      if (user?.phone) token.phone = user.phone;
      if (user?.image) token.picture = user.image;

      // if (
      //   user?.email &&
      //   process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() ===
      //     user.email.toLowerCase()
      // ) {
      //   token.role = USER_ROLES.ADMIN;
      // }

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
         return true;
        }
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
    // async createUser({user}){
    //   if (user.email && process.env.ADMIN_EMAIL_ADDRESS?.toLowerCase() === user.email.toLowerCase()) {
    //     await changeUserRoleAction(user.email, USER_ROLES.ADMIN);
    //   }
    // },
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
  ],
} satisfies NextAuthConfig;
