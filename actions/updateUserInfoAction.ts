"use server";

import { auth } from "@/auth";
import db from "@/drizzle";
import { users } from "@/drizzle/schema";
import { UpdateUserInfoSchema } from "@/validators/update-user-info-validator";
import { eq } from "drizzle-orm";
import * as v from "valibot";

type Res = 
  | {  
      success: true;    
      data: {
        id: (typeof users.$inferSelect)['id'];
        name: (typeof users.$inferSelect)['name'];
        image: (typeof users.$inferSelect)['image'];
        company: (typeof users.$inferSelect)['company'];
        phone: (typeof users.$inferSelect)['phone'];
      };
    }
  | { success: false; error: v.FlatErrors<undefined>; statusCode: 400 }
  | { success: false; error: string; statusCode: 500 | 401 };

  export async function updateUserInfoAction(values: unknown): Promise<Res> {
    const parsedValues = v.safeParse(UpdateUserInfoSchema, values);
  
    if (!parsedValues.success) {
      const flatErrors = v.flatten(parsedValues.issues);
  
      // Extracting the error message from the nested structure
      const errorMessages = Object.entries(flatErrors).reduce((acc, [key, value]) => {
        const message = Array.isArray(value) ? value[0] : "Invalid input";
        acc[key] = message;
        return acc;
      }, {} as Record<string, string>);
  
      console.error("Validation errors:", errorMessages);
      return { success: false, error: errorMessages, statusCode: 400 };
    }
  
    const { id, name, image, company, phone } = parsedValues.output;
  
    const session = await auth();
  
    if (!session?.user?.id || session.user.id !== id) {
      console.error("Unauthorized access attempt:", { sessionUserId: session?.user?.id, targetUserId: id });
      return {
        success: false,
        error: "You are not authorized to update this user",
        statusCode: 401,
      };
    }
  
    if (
      session?.user?.name === name &&
      session?.user?.image === image &&
      session?.user?.company === company &&
      session?.user?.phone === phone
    ) {
      console.log("No changes detected for user:", id);
      return { success: true, data: { id, name, image, company, phone } };
    }
  
    // Sanitize input
    const sanitizedData = {
      name,
      image: image ?? null,
      company: company ?? null,
      phone: phone ?? null,
    };
  
    console.log("Sanitized data for update:", sanitizedData);
  
    try {
      const updatedUser = await db
        .update(users)
        .set(sanitizedData)
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          name: users.name,
          image: users.image,
          company: users.company,
          phone: users.phone,
        })
        .then((res) => res[0]);
  
      console.log("Updated user data:", updatedUser);
  
      if (!updatedUser) {
        console.error("Update returned no results for user ID:", id);
        return {
          success: false,
          error: "User update failed. No matching user found.",
          statusCode: 400,
        };
      }
  
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error("Database update error:", error);
      return { success: false, error: "Internal server error", statusCode: 500 };
    }
  }