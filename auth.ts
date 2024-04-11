import { db } from "./lib/db"
import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { getUserById } from "./data/user"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from ".prisma/client"

declare module "next-auth" {
    interface User {
      role?: UserRole
    }
}


export const { 
    handlers: { GET, POST }, 
    auth,
    signIn,
    signOut
 } = NextAuth({
    pages:{
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events:{
        async linkAccount({user}){
            await db.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({user, account}){
            if (account?.provider !== "credentials"){
                return true
            }

            const existingUser = await getUserById(user.id as string)
            
            // Prevents signin without email verification
            if(!existingUser || !existingUser.emailVerified){
                return false
            }

            //TODO: 2FA Check
            
            return true
        },
        async session({ session, token, user }) {
            console.log("User:", user)
            console.log("Session Token:", token)
            if(token.sub && session.user){
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session;
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
