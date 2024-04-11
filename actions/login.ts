"use server"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/token"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/schemas/routes"
import { AuthError } from "next-auth"
import { z } from "zod"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields.success){
        return {
            error: "Invalid fields"
        }
    }

    const { email, password } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if(!existingUser || !existingUser || !existingUser.password){
        return {
            error: "Email doesn't exists!"
        }
    }

    if(existingUser && !existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email ?? "")
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return {
            success: "Confirmation email sent!"
        }
    }

    try{
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin": 
                    return { error: "Invalid Credentials!"}  
                default:
                    return { error: "Something went wrong."}  
            }
        }
        throw error
    }

    return {
        success: "Email sent!"
    }
}