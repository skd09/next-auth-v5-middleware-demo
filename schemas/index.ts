import * as z from "zod"

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(4, {
        message: "Password is required"
    })
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