"use server"
import bcyrpt from "bcryptjs"
import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if(!validatedFields.success){
        return {
            error: "Invalid fields"
        }
    }

    const { email, password, name } = validatedFields.data
    const hashPassword = await bcyrpt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if(existingUser){
        return {
            error: "Email is already in use"
        }
    }

    await db.user.create({ 
        data: { 
            email, 
            name, 
            password: hashPassword 
        }
    })

    const verificationToken = await generateVerificationToken(email)


    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {
        success: "Confirmation Sent!"
    }
}