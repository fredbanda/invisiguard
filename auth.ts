import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const nextAuth = NextAuth({
    session: {strategy: 'jwt'},
    secret: process.env.AUTH_SECRET,
    pages: {signIn: "/auth/login"},
    providers: []
});