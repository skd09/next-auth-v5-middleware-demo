import * as z from "zod"
import { UserRole } from "@prisma/client"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(4, {
        message: "Password is required"
    }),
    code: z.optional(z.string())
})

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(4, {
        message: "Password is required"
    }),
    name: z.string().min(3, {
        message: "Name is required"
    })
})

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    })
})

export const NewPasswordSchema = z.object({
    password: z.string().min(4, {
        message: "Minimum 4 characters are required"
    })
})

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(4)),
    newPassword: z.optional(z.string().min(4))
})
.refine((data) => {
    if(data.password && !data.newPassword){
        return false
    }
    if(data.newPassword && !data.password){
        return false
    }
    return true
}, {
    message: "New password is required!",
    path: ["newPassword"]
})