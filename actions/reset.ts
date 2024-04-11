"use server"
import { getUserByEmail } from "@/data/user"
import { sendPasswordEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/token"
import { ResetSchema } from "@/schemas"
import { z } from "zod"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)

    if(!validatedFields.success){
        return {
            error: "Invalid email!"
        }
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser || !existingUser.password){
        return {
            error: "Email not found!"
        }
    }

    const resetPasswordToken = await generatePasswordResetToken(existingUser.email ?? "")
    await sendPasswordEmail(resetPasswordToken.email, resetPasswordToken.token)
    
    return {
        success: "Reset email sent!"
    }
}