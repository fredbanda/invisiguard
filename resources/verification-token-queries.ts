import "server-only";


import { verificationTokens } from "@/drizzle/schema";
import db from "@/drizzle";
import { eq } from "drizzle-orm";

export async function getVerificationTokenByToken(token: (typeof verificationTokens.$inferSelect)["token"]): Promise<typeof verificationTokens.$inferSelect | null> {
    const verificationToken = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .then(res => res[0])

    return verificationToken
}