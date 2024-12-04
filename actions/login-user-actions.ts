"use server";

import { signIn } from "@/auth";

type Res =
  | { success: true }
  | { success: false; error: string; statusCode: 500 };

export async function loginUserAction(values: unknown): Promise<Res> {
  
  return { success: true };
}
