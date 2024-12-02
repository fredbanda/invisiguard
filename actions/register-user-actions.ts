"use server";

import * as v from "valibot";
import {RegisterSchema} from "@/validators/register-validater";
import bcrypt from "bcryptjs";
import db from "@/drizzle";
import { lower, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";


type Res =
    | {success: true}
    | {success: false, error: v.FlatErrors<undefined>, statusCode: 400}
    | {success: false, error: string, statusCode: 500 | 409}

export async function registerUserAction(values: unknown): Promise<Res> {
    const parsedValues = v.safeParse(RegisterSchema, values);

    if (!parsedValues.success) {
        const flatErrors = v.flatten(parsedValues.issues)
        console.log(flatErrors);
        

        return {success: false, error: flatErrors, statusCode: 400}
    }

    const {first_name, last_name, email, phone, company, image, password, confirm_password} = parsedValues.output;

    try {
        const existingUser = await db
        .select({id: users.id})
        .from(users)
        .where(eq(lower(users.email), email.toLowerCase()))
        .then(res => res[0] ?? null);

        if (existingUser?.id) {
            return {success: false, error: "Email already exists", statusCode: 409}
        }
    } catch (error) {
        console.error(error);
        return {success: false, error: "Internal server error", statusCode: 500};
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await db.insert(users).values({
            first_name, last_name, email, phone, company, password: hashedPassword
        })
        .returning({id: users.id})
        .then(res => res?.[0]);

        console.log({insertedId: newUser.id});
        
       return {success: true,}
    } catch (error) {
        console.error(error)
        return {success: false, error: "Internal server error ", statusCode: 500}
        
    } 
}