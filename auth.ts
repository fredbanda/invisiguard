import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./validators/login-validater";
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import * as v from "valibot";
import { getUserByEmail } from "./resources/user-queries";
import bcrypt from "bcryptjs"

const nextAuth = NextAuth({
    session: {strategy: 'jwt'},
    secret: process.env.AUTH_SECRET,
    pages: {signIn: "/auth/login"},
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = v.safeParse(LoginSchema, credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.output;
                    
                    const user = await getUserByEmail(email);
                    if(!user) return null;
                    if(!user.password) return null;

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    
                    if(passwordMatch) {
                        const {password, ...userWithoutPassword} = user;
                        return userWithoutPassword;
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
    ]
});

export const {handlers, signIn, signOut, auth} = nextAuth;