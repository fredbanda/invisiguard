"use server";

import { signIn } from "@/auth";

type Res =
  | { success: true }
  | { success: false; error: string; statusCode: 500 };

export async function loginUserAction(values: unknown): Promise<Res> {
  try {
    // Validate input
    if (
      typeof values !== "object" ||
      values === null ||
      Array.isArray(values) ||
      !("email" in values) ||
      !("password" in values)
    ) {
      throw new Error("Invalid input");
    }

    const { email, password } = values as { email: string; password: string };

    // Attempt to sign in
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!response || response.error) {
      throw new Error(response?.error || "Login failed");
    }

    return { success: true };
  } catch (error: unknown) {
    // Narrow the error type to Error to access the message
    if (error instanceof Error) {
      console.error(error);
      return { success: false, error: error.message || "Internal server error", statusCode: 500 };
    }

    // Fallback in case the error is not an instance of Error
    console.error("Unknown error:", error);
    return { success: false, error: "Internal server error", statusCode: 500 };
  }
}
