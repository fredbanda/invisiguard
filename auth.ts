import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./validators/login-validater";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import * as v from "valibot";
import { getUserByEmail } from "./resources/user-queries";
import bcrypt from "bcryptjs"
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
    session: {strategy: 'jwt'},
    pages: {signIn: "/auth/login"},
    callbacks:{
        async jwt({token, user}) {
            console.log(user);
            if(user?.id) token.id = user.id;
            if(user?.role) token.role = user.role;
        
            
        return token;
        },
        session({session, token}) {
            session.user.id = token.id;
            session.user.role = token.role;  // Set the role from the token
            return session;
        }
    },
    events: {
        linkAccount: async ({user, account}) => {
            if(["google", "github"].includes(account.provider)) {
               if (user.email) await oauthVerifyEmailAction(user.email);
            }
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = v.safeParse(LoginSchema, credentials);
            
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.output;
            
                    const user = await getUserByEmail(email);
                    if (!user) return null;
                    if (!user.password) return null;
            
                    const passwordMatch = await bcrypt.compare(password, user.password);
            
                    if (passwordMatch) {
                        const { password, ...userWithoutPassword } = user;
            
                        // Ensure role is always set
                        const userWithRole = {
                            ...userWithoutPassword,
                            role: user.role || "user",  // Set default role if not defined
                        };
            
                        return userWithRole;  // Return the user with the role
                    }
                }
            
                return null;
            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        })
    ],
    secret: process.env.AUTH_SECRET,
});

export const {handlers, signIn, signOut, auth} = nextAuth;