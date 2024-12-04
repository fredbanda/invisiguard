import "server-only";

import db from "@/drizzle";
import {lower, users} from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string):Promise<typeof users.$inferInsert | null>=> {
    const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), 
    email.toLowerCase()))
    .then((res) => res[0] ?? null);

    return user;
}