"use server";

import { auth } from "@/auth";
import db from "@/drizzle";
import { users } from "@/drizzle/schema";
import { USER_ROLES } from "@/lib/constants";
import { getUserByEmail } from "@/resources/user-queries";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleEmailVerifiedAction(email: string, isCurrentlyVerified: boolean) {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return;
  if (!existingUser.id) return; // Ensure the user ID is defined
  if (existingUser.role === USER_ROLES.ADMIN) return;

  const emailVerified = isCurrentlyVerified ? null : new Date();

  await db
    .update(users)
    .set({ emailVerified })
    .where(eq(users.id, existingUser.id)); // existingUser.id is guaranteed to be defined here

  revalidatePath("/dashboard/admin");
}
