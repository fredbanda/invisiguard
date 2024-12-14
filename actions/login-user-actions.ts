"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

type Res =
  | { success: true }
  | { success: false; error: string; statusCode: 500 | 401 };

export async function loginUserAction(values: unknown): Promise<Res> {
  try {
    if (
      typeof values !== "object" ||
      values === null ||
      Array.isArray(values)
    ) {
      throw new Error("Invalid credentials");
    }

    await signIn("credentials", { ...values, redirect: false });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
        case "CallbackRouteError":
          return {
            success: false,
            error: "Invalid credentials",
            statusCode: 401,
          };
        case "AccessDenied":
          return {
            success: false,
            error: "Please check your email for a verification link to verify your account",
            statusCode: 401,
          };
        case "OAuthAccountAlreadyLinkedError" as AuthError["type"]:
          return {
            success: false,
            error: "Account already, linked login with google or github instead",
            statusCode: 401,
          };
        default:
          return {
            success: false,
            error: "Ooops something went wrong",
            statusCode: 500,
          };
      }
    }
    console.error(error);
    return {
      success: false,
      error: "Internal server error please try again later",
      statusCode: 500,
    };
  }
}
