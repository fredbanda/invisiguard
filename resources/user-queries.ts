import "server-only";

import db from "@/drizzle";
import { lower, users } from "@/drizzle/schema";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { auth } from "@/auth";
import { USER_ROLES } from "@/lib/constants";

/** ADMIN QUERIES - THESE QUERIES REQUIRE ADMIN PREVILEGES **/

export async function getAllUsers() {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }

  const { password, ...rest } = getTableColumns(users);

  const allUsers = await db
    .select({ ...rest })
    .from(users)
    .orderBy(desc(users.role));

  return allUsers;
}

/* __________________________________________________________________________ */
/* __________________________________________________________________________ */

export const getUserByEmail = async (
  email: string,
): Promise<typeof users.$inferInsert | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()))
    .then((res) => res[0] ?? null);

  return user;
};

type UserWithoutPassword = Omit<typeof users.$inferSelect, "password">;

export const getUserById = async (id: string): Promise<UserWithoutPassword> => {
  const { password, ...rest } = getTableColumns(users);
  const user = await db
    .select(rest)
    .from(users)
    .where(eq(users.id, id))
    .then((res) => res[0] ?? null);

  if (!user) throw new Error("Sorry the user does not exist");

  return user;
};

export const getUserByAuth = async () => {
  const session = await auth();

  const sessionUserId = session?.user?.id;
  if (!sessionUserId) throw new Error("Not authorized to access this resource");

  const { password, ...rest } = getTableColumns(users);
  const user = await db
    .select(rest)
    .from(users)
    .where(eq(users.id, sessionUserId))
    .then((res) => res[0] ?? null);

  if (!user) throw new Error("Sorry the user does not exist");

  return user;
};
