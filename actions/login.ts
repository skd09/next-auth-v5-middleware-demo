"use server"
import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail"
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/token"
import { LoginSchema } from "@/schemas"
import { DEFAULT_LOGIN_REDIRECT } from "@/schemas/routes"
import { AuthError } from "next-auth"
import { z } from "zod"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { db } from "@/lib/db"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if(!validatedFields.success){
        return {
            error: "Invalid fields"
        }
    }

    const { email, password, code } = validatedFields.data

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

    if(existingUser && existingUser.isTwoFactorEnabled && existingUser.email){
        if(code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)
            if(!twoFactorToken){
                return {
                    error: "Invalid code!"
                }
            }
            if(twoFactorToken.token !== code){
                return {
                    error: "Invalid code!"
                }  
            }
            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if(hasExpired){
                return {
                    error: "Code expired!"
                }  
            }

            await db.twoFactorToken.delete({
                where:{
                    id: twoFactorToken.id
                }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.email)
            if(existingConfirmation){
                await db.twoFactorToken.delete({
                    where:{
                        id: existingConfirmation.id
                    }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })
        } else {
            const twofactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorEmail(twofactorToken.email, twofactorToken.token)
            return {
                twoFactor: true
            }
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