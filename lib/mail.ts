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