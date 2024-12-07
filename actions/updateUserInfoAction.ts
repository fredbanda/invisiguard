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
      return { success: false, error: flatErrors, statusCode: 400 };
    }
  
    const { id, name, image, company, phone } = parsedValues.output;
  
    const session = await auth();
  
    if (!session?.user?.id || session.user.id !== id) {
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
      return { success: true, data: { id, name, image, company, phone } };
    }
  
    // Transform `undefined` to `null` here before database update
    const sanitizedData = {
      name,
      image: image ?? null,
      company: company ?? null,
      phone: phone ?? null,
    };

    console.log(sanitizedData);
    
  
    try {
      const updatedUser = await db
        .update(users)
        .set(sanitizedData) // Pass sanitized values
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          name: users.name,
          image: users.image,
          company: users.company,
          phone: users.phone,
        })
        .then((res) => res[0]);
  
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error(error);
      return { success: false, error: "Internal server error", statusCode: 500 };
    }
  }
  