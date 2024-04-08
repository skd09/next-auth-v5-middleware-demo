import { db } from "./lib/db"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { PrismaAdapter } from "@auth/prisma-adapter"

// declare module "next-auth" {
//     interface User {
//       role: "Admin" | "User"
//     }
// }

export const { 
    handlers: { GET, POST }, 
    auth,
    signIn,
    signOut
 } = NextAuth({
    callbacks: {
        async session({ session, token, user }) {
            console.log("Session Token:", token)
            if(token.sub && session.user){
                session.user.id = token.sub
            }
            
            // return {
            //     ...session,
            //     user: {
            //         ...session.user,
            //         role: user.role
            //     }
            // }
            return session
        },
        async jwt({ token}) {
            if(!token.sub) return token
            const existingUser = await getUserById(token.sub)
            if(!existingUser) return token
            token.role = existingUser.role

            return token
        }
    },
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})