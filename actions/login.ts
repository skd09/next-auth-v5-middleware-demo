"use server"
import { getUserByEmail } from "@/data/user"
import { LoginSchema } from "@/schemas"
import { z } from "zod"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields.success){
        return {
            error: "Invalid fields"
        }
    }

    const { email, password } = validatedFields.data


    // getUserByEmail

    return {
        success: "Email sent!"
    }
}