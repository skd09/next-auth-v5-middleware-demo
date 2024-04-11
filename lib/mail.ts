import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async(
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`
    console.log(confirmLink)
    const data = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Confirm your Email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`  
    })
    console.log(data)
}

export const sendPasswordEmail = async(
    email: string,
    token: string
) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`
    console.log(resetLink)
    const data = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Reset your Password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`  
    })
    console.log(data)
}

export const sendTwoFactorEmail = async(
    email: string,
    token: string
) => {
    console.log(token)
    const data = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "2FA Code",
        html: `<p>Your 2FA code: ${token}</p>`  
    })
    console.log(data)
}