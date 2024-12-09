import "server-only";
import db from "@/drizzle";
import { adminUserEmailAddresses, lower } from "@/drizzle/schema";

export const getAdminUserEmailAddresses = async () => {
    const adminEmails = await db
        .select({ email: lower(adminUserEmailAddresses.email )})
        .from(adminUserEmailAddresses);

    console.log(adminEmails);
    return adminEmails;
};
