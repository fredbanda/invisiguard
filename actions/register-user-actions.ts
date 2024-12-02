"use server";

import * as v from "valibot";
import {RegisterSchema} from "@/validators/register-validater";
import bcrypt from "bcryptjs";

type Res =
    | {success: true}
    | {success: false, error: v.FlatErrors<undefined>, statusCode: 400}
    | {success: false, error: string, statusCode: 500}

export async function registerUserAction(values: unknown): Promise<Res> {
    const parsedValues = v.safeParse(RegisterSchema, values);

    if (!parsedValues.success) {
        const flatErrors = v.flatten(parsedValues.issues)
        console.log(flatErrors);
        

        return {success: false, error: flatErrors, statusCode: 400}
    }

    const {first_name, last_name, email, phone, company, image, password, confirm_password} = parsedValues.output;
    console.log("success", first_name, last_name, email, phone, company, image, password, confirm_password);
    

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log({name: "password", hashedPassword})
     
       return {success: true,}
    } catch (error) {
        console.error(error)
        return {success: false, error: "Internal server error ", statusCode: 500}
        
    } 
}