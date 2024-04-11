import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "./schemas"
import { getUserByEmail } from "./data/user"
import bcyrpt from "bcryptjs"
import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
        async authorize(credentials): Promise<any> {
          const validatedFields = LoginSchema.safeParse(credentials)
  
          if (validatedFields.success) {
            const { email, password } = validatedFields.data
  
            const user = await getUserByEmail(email)
            console.log({user})
            if (!user || !user.password) return null
  
            const passwordsMatch = await bcyrpt.compare(
              password,
              user.password,
            )
  
            if (passwordsMatch) { 
              console.log(user)
              return user
            } else {
              console.log("Password didn't match")
              return null
            }
          } else {
            console.log("Credentials are not valid")
            return null
          }
  
          // You can get rid of this return
          return null
        }
      })
  ],
} satisfies NextAuthConfig