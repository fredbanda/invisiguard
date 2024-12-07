import * as v from "valibot";

export const UpdateUserInfoSchema = v.object({
    id: v.pipe(
        v.string("ID is required please provide your ID"),
        v.uuid("ID is not valid"),
    ),
    name: v.pipe(
        v.string("Name is required please provide your name"),
        v.nonEmpty("First name can not be empty"),
        v.minLength(2, "Name must be at least 2 characters long"),
    ),
    image: v.union([
        v.pipe(v.literal(""), v.transform(() => null)),
        v.pipe(v.string(), v.nonEmpty()),
      ]),
      
    company: v.optional(
        v.union([
            v.pipe(v.literal(""), v.transform(() => undefined)),
            v.pipe(
                v.string("Company name is required"),
                v.nonEmpty(),
            ) 
        ])
    ),
    phone: v.optional(
        v.union([
            v.pipe(v.literal(""), v.transform(() => undefined)),
            v.pipe(
                v.string(),
                v.nonEmpty(),
            ) 
        ])
    ),
})

export type UpdateUserInfoInput = v.InferInput<typeof UpdateUserInfoSchema>;