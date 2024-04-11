"use server"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { z } from "zod"
import { NewPasswordSchema } from "@/schemas/index"
import bcyrpt from "bcryptjs"


export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token?: string | null) => {
    if(!token){
        return {
            error: "Missing Token!"
        }
    }

    const validatedFields = NewPasswordSchema.safeParse(values)

    if(!validatedFields.success){
        return {
            error: "Invalid fields"
        }
    }

    const { password } = validatedFields.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if(!existingToken){
        return {
            error: "Token doesn't exist!"
        }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if(hasExpired){
        return {
            error: "Token has expired!"
        }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser){
        return {
            error: "Email doesn't exist!"
        }
    }

    const newPassword = await bcyrpt.hash(password, 10)

    await db.user.update({
        where: {id: existingUser.id},
        data: {
            password: newPassword
        }
    })

    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return {
        success: "Password Updated!"
    }
}