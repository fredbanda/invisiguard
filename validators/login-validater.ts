import * as v from "valibot";


export const LoginSchema = v.object({
    email: v.pipe(
        v.string("Email must be should valid please"),
        v.nonEmpty("Email can not be empty"),
        v.email("Provide a valid email please")
    ),
    password: v.pipe(
        v.string("Your password should be strong"),
        v.nonEmpty("Password can not be empty")
    ),
});

export type LoginInput = v.InferInput<typeof LoginSchema>;