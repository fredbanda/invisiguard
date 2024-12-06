import * as v from "valibot";

export const RegisterSchema = v.pipe(
    v.object({
        name: v.pipe(
            v.string("Name is required please provide your name"),
            v.nonEmpty("First name can not be empty"),
            v.minLength(2, "Name must be at least 2 characters long"),
        ),
        email: v.pipe(
            v.string("Email is required please provide your email"),
            v.nonEmpty("Email can not be empty"),
            v.email("Email is not valid"),
        ),

        phone: v.optional(
            v.union([
                v.pipe(v.literal(""), v.transform(() => undefined)),
                v.pipe(
                    v.string(),
                    v.nonEmpty(),
                    v.minLength(10),
                ) 
            ])
        ),
        company: v.optional(
            v.union([
                v.pipe(v.literal(""), v.transform(() => undefined)),
                v.pipe(
                    v.string("Company name is required"),
                    v.nonEmpty(),
                    v.minLength(10),
                ) 
            ])
        ),
        image: v.optional(
            v.union([
                v.pipe(v.literal(""), v.transform(() => undefined)),
                v.pipe(
                    v.string(),
                    v.nonEmpty(),
                    v.minLength(10),
                ) 
            ])
        ),

        password: v.pipe(
            v.string("Password is required please provide your password"),
            v.nonEmpty("Password can not be empty"),
            v.minLength(6, "Password must be at least 6 characters long"),
        ),
        confirm_password: v.pipe(
            v.string("Confirm Password is required please provide your password"),
            v.nonEmpty("Confirm Password can not be empty"),
        ),
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["confirm_password"]],
            (input) => input.password === input.confirm_password,
            "Passwords do not match please try again"
        ),
        ["confirm_password"]
    )
);

export type RegisterInput = v.InferInput<typeof RegisterSchema>;