"use server";

import db from "@/drizzle";
import { users, verificationTokens } from "@/drizzle/schema";
import { getUserByEmail } from "@/resources/user-queries";
import { getVerificationTokenByToken } from "@/resources/verification-token-queries";
import { eq } from "drizzle-orm";

export async function verifyCredentialsEmailAction(token: (typeof verificationTokens.$inferSelect)["token"]) {
    const verificationToken = await getVerificationTokenByToken(token);

    if(!verificationToken?.expires) return {success: false};

    if(new Date(verificationToken.expires).getTime() < Date.now()) {
        return {success: false}
    };
    
    const existingUser = await getUserByEmail(verificationToken.identifier);

    if(existingUser?.id && !existingUser.emailVerified) {
        await db.update(users).set({emailVerified: new Date()}).where(eq(users.id, existingUser.id));

        await db.update(verificationTokens).set({expires: new Date(Date.now() + (1000 * 60 ))}).where(eq(verificationTokens.identifier, existingUser.email));

        return {success: true}
    }else{
        return {success: false}
    }
}