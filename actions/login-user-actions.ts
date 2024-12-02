"use server";

type Res = 
| {success: true}

export async function loginUserAction(values: unknown): Promise<Res>{
    return {success: true}
}