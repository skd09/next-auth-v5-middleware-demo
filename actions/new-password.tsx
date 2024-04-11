"use server"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"


export const newPassword = async (token: string) => {
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

    await db.user.update({
        where: {id: existingUser.id},
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    })

    return {
        success: "Email Verified!"
    }
}